//OBJETO COM TIROS
class InfoObjetoComArmas extends InfoObjetoTela
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, infoArmas, qtdHelices=0, qtdsRotateDifHelices)
  // se tem helices (jah tem que ter adicionado as imagens secundarias na formaGeometrica)
  // qtdsRotateHelices: eh um vetor
  // se quiser que alguma helice gire numa velocidade diferente do que a padrao colocar no vetor o valor da velocidade no index dessa helice (as demais helices cujos indices nao tem nenhum valor no vetor, girarao na velocidade padrao)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto);
    this.infoArmas = infoArmas;
    this.qtdHelices = qtdHelices;
    this.qtdsRotateDifHelices = qtdsRotateDifHelices;
  }
}
class InfoArma
{
  constructor(infoTiroPadrao, freqAtirar, indexArmaGiratoria=-1, direcaoSairTiro, porcPraDentroObj=0, ehTiroDuplo=false, porcTiroCentro, porcComecaAtirar=1, atirarDireto=true, funcaoCondicaoAtirar)
  //porcComecaAtirar: porcentagem da frequencia. freqFunc serah inicializado com o count = porc*freq
  //porcTiroCentro: porcentagem da formaGeometrica que seja no meio de onde o tiro deve sair
  // porcPraDentroObj e porcTiroCentro devem ser um numero de 0 a 1 (porcentagem)
  // funcaoCondicaoAtirar: essa funcao recebe o ObjetoComArmas como parametro e deve retornar true se puder atirar e false se nao puder (soh vai atirar se jah tiver a frequencia necessaria e se essa funcao retornar true)
  {
    this.infoTiroPadrao = infoTiroPadrao;
    this.freqAtirar = freqAtirar;
    this.porcComecaAtirar = porcComecaAtirar;

    this.indexArmaGiratoria = indexArmaGiratoria;
    if (indexArmaGiratoria < 0)
    {
      this.direcaoSairTiro = direcaoSairTiro;
      this.porcPraDentroObj = porcPraDentroObj;

      this.ehTiroDuplo = ehTiroDuplo;
      if (this.ehTiroDuplo)
        this.porcTiroCentro = porcTiroCentro;
    }

    this.atirarDireto = atirarDireto;
    this.funcaoCondicaoAtirar = funcaoCondicaoAtirar;
  }

  clone()
  { return new InfoArma(this.infoTiroPadrao, this.freqAtirar, this.indexArmaGiratoria, this.direcaoSairTiro, this.porcPraDentroObj, this.ehTiroDuplo, this.porcTiroCentro, this.porcComecaAtirar, this.atirarDireto, this.funcaoCondicaoAtirar); }

  getConfig()
  {
    if (this.indexArmaGiratoria >= 0) //se eh arma giratoria
      return {
        indexArmaGiratoria: this.indexArmaGiratoria,
        atirarDireto: this.atirarDireto,
        funcaoCondicaoAtirar: this.funcaoCondicaoAtirar
      };
    else
      return {
        indexArmaGiratoria: this.indexArmaGiratoria,
        direcaoSairTiro: this.direcaoSairTiro,
        porcPraDentroObj: this.porcPraDentroObj,
        ehTiroDuplo: this.ehTiroDuplo,
        porcTiroCentro: this.porcTiroCentro,
        atirarDireto: this.atirarDireto,
        funcaoCondicaoAtirar: this.funcaoCondicaoAtirar
      };
  }
}
class ObjetoComArmas extends ObjetoTela
{
  constructor(pontoInicial, infoObjetoComArmas)
  {
    super(pontoInicial, infoObjetoComArmas);

    //tiros
    this._setarArmas(infoObjetoComArmas.infoArmas);

    //para helicoptero
    if (infoObjetoComArmas.qtdHelices > 0)
      this._helices = new Helices(infoObjetoComArmas.qtdHelices, infoObjetoComArmas.qtdsRotateDifHelices);
  }
  _setarArmas(infoArmas)
  {
    //this._armas: array de config (onde vai colocar), freqFunc (quando vai colocar), controlador (quem vai colocar)
    this._armas = new Array(infoArmas.length)
    infoArmas.forEach((infoArma,i) =>
      {
        let config = infoArma.getConfig();
        if (!config.atirarDireto)
        // se nao eh atirarDireto jah tem que setar o "podeAtirar"
          config.podeAtirar = false; //vai comecar podendo atirar, porem eh o primeiro this.atirar(...) que vai setar essa variavel true (se setar ela aqui, as duas primeiras vezes nao terao impedimento de tempo separando-as)

        const freqAtirar = infoArma.freqAtirar;
        this._armas[i] = {
          controlador: new ControladorTiros(infoArma.infoTiroPadrao, this instanceof PersonagemPrincipal),
          config: config,
          freqFunc: new FreqFunction(freqAtirar,
              (infoArma.porcComecaAtirar===1) ? freqAtirar-1 // o index comeca logo antes de executar porque nao pode jah atirar sem que o this._armas[i] esteja pronto
                : freqAtirar*infoArma.porcComecaAtirar)
        };
        // se nao eh atirarDireto vai ter atributo "podeAtirar" no config
      });
  }

  //getters
  get armas()
  { return this._armas; }
  //para especificos:
  getControladorTiros(i=0)
  { return this._armas[i].controlador; }
  get qtdControladoresTiros()
  { return this._armas.length; }
  getConfigArma(i=0) //pode mudar as configuracoes por aqui
  { return this._armas[i].config; }
  getFreqFuncAtirar(i=0) //ps: se quiser mudar frequencia mudar aqui (ou this._armas[i].freqFunc.freq)
  { return this._armas[i].freqFunc; }
  get qtdConfigContrTiros() { return this._armas.length; }

  //getters e setters vivo
  get vivo()
  { return this._vivo; }


  //TIROS
  //novo tiro
  atirar()
  //soh chama o .contar() de todos os freqFunc (se estiver na hora deles atirarem, eles atiram)
  {
    // mudar direcao armas giratorias (vai atirar certo, vai ser mais facil, mais controle)
    this._mudarDirecaoArmasGiratorias();

    // atirar propriamente dito
    this._armas.forEach((arma,index) =>
      {
        // se (for atirarDireto) ou se (nao for atirarDireto mas ainda nao pode atirar), conta
        if (arma.config.atirarDireto || !arma.config.podeAtirar)
        {
          if (arma.freqFunc.contar())
          // se jah pode atirar nessa arma
          {
              if (arma.config.atirarDireto)
              // se atirar direto jah atira
              {
                if (this._podeAtirar(arma.config))
                  this._atirarEspecifico(arma);
                else
                // agora o count do freqFunc estah no zero, porem nao pode deixar o freqFunc zerado. tem que deixar o count do freqFunc de modo a executar a funcao na proxima vez que contar
                  arma.freqFunc.setContadorUltimaEtapa();
              }
              else
              //se nao eh pra atirar direto, soh seta a variavel podeAtirar do config
                arma.config.podeAtirar = true;
          }
        }
      });
  }
  //o procedimento de realmente atirar (onde a magica realmente acontece...)
  _atirarEspecifico(arma)
  {
    // SE FOR ARMA GIRATORIA
    if (arma.config.indexArmaGiratoria >= 0)
      this._atirarArmaGiratoria(arma);
    else
    {
      //verifica se nao estah rotacionado (mesmo se nao estah rotacionado o algoritmo de atirar rotacionado daria mas haveria uma perda de tempo desnecessaria)
      const estahRotacionado = !Exatidao.ehQuaseExato(this._formaGeometrica.anguloRotacionouTotal, 0);

      const pontosIniciais = this._getPontosIniciaisTiro(arma, estahRotacionado);
      //vetor com 1 ou 2 posicoes (se ehTiroDuplo). ps: jah conta o porcPraDentroObj
      //obs: se estah rotacionado vai retornar o vetor de pontos relativo ao centroMassa e sem ter rotacionado-os ainda

      if (!estahRotacionado)
        pontosIniciais.forEach(pontoInicial => arma.controlador.adicionarTiro(pontoInicial));
      else
      {
        //Explicacao: fazer com cada ponto
          //1. clonar formaGeometrica no lugar certo e rotacionar formaGeometrica do tiro com centroRotacao=(0,0)
          //2. tirar relatividade do centroMassa (isto eh, somar centroMassa)
          //3. adicionar tiro ao controlador
        pontosIniciais.forEach(pontoInicial =>
          {
            //1.
            let formaGeomTiro = arma.controlador.infoTiroPadraoAtual.formaGeometrica.clone(pontoInicial.x, pontoInicial.y);
            formaGeomTiro = formaGeomTiro.rotacionar(this._formaGeometrica.anguloRotacionouTotal, new Ponto(0,0));

            //2.
            formaGeomTiro.x += this._formaGeometrica.centroMassa.x;
            formaGeomTiro.y += this._formaGeometrica.centroMassa.y;

            //3.
            arma.controlador.adicionarTiroDif(null,
              {angulo: Angulo.angRotacaoParaAngCicloTrig(this._formaGeometrica.anguloRotacionouTotal + Angulo.anguloRotacaoDirecao(arma.config.direcaoSairTiro))},
              //tiro vai andar pra direcao que estah apontado
              {formaGeometrica: formaGeomTiro});
          });
      }
    }
  }
  _getPontosIniciaisTiro(arma, estahRotacionado)
  //se estahRotacionado vai retornar os pontosIniciais relativos ao centroMassa e nao rotacionados
  //caso contrario, vai retornar os pontos iniciais absolutos
  {
    //nao eh mais arma giratoria...

    let vetorPontos = new Array(arma.config.ehTiroDuplo?2:1);
    //se tiro duplo, retorna vetor com a posicao inicial dos dois tiros

    const infoTiroPadrao = arma.controlador.infoTiroPadraoAtual;
    const direcaoSairTiro = arma.config.direcaoSairTiro;

    //calcular qual o (x,y) em que o tiro vai ser criado
    if (direcaoSairTiro === Direcao.Cima || direcaoSairTiro === Direcao.Baixo)
    {
      const qntPraDentroObj = arma.config.porcPraDentroObj * this._formaGeometrica.heightSemRotac;

      if (estahRotacionado)
      //estah rotacionado
      {
        let y;
        if (direcaoSairTiro === Direcao.Cima)
          y = -this._formaGeometrica.distYCentroAbs - infoTiroPadrao.formaGeometrica.height + qntPraDentroObj;
        else
          y = (this._formaGeometrica.heightSemRotac - this._formaGeometrica.distYCentroAbs)/*y da parede de baixo do retangulo*/
            - qntPraDentroObj;

        const xCentro = this._formaGeometrica.widthSemRotac/2 - this._formaGeometrica.distXCentroAbs;
        if (arma.config.ehTiroDuplo) //se eh tiro duplo
        {
          const distanciaTiroCentro = arma.config.porcTiroCentro * this._formaGeometrica.widthSemRotac;
          vetorPontos[0] = new Ponto(xCentro - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.width/2, y);
          vetorPontos[1] = new Ponto(xCentro + distanciaTiroCentro - infoTiroPadrao.formaGeometrica.width/2, y);
        }else
          vetorPontos[0] = new Ponto(xCentro - infoTiroPadrao.formaGeometrica.width/2, y);
      }else
      //nao estah rotacionado
      {
        let y;
        if (direcaoSairTiro === Direcao.Cima)
          y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntPraDentroObj;
        else
          y = this._formaGeometrica.y + this._formaGeometrica.height - qntPraDentroObj;

        if (arma.config.ehTiroDuplo) //se eh tiro duplo
        {
          const distanciaTiroCentro = arma.config.porcTiroCentro * this._formaGeometrica.width;
          vetorPontos[0] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width/2 - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.width/2, y);
          vetorPontos[1] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width/2 + distanciaTiroCentro - infoTiroPadrao.formaGeometrica.width/2, y);
        }else
          vetorPontos[0] = new Ponto(this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2, y);
      }
    }else
    {
      const qntPraDentroObj = arma.config.porcPraDentroObj * this._formaGeometrica.widthSemRotac;

      if (estahRotacionado)
      //estah rotacionado
      {
        let x;
        if (direcaoSairTiro === Direcao.Esquerda)
          x = -this._formaGeometrica.distXCentroAbs - infoTiroPadrao.formaGeometrica.width + qntPraDentroObj;
        else
          x = (this._formaGeometrica.widthSemRotac - this._formaGeometrica.distXCentroAbs)/*x da parede direita do retangulo*/
            - qntPraDentroObj;

        const yCentro = this._formaGeometrica.heightSemRotac/2 - this._formaGeometrica.distYCentroAbs;
        if (arma.config.ehTiroDuplo) //se eh tiro duplo
        {
          const distanciaTiroCentro = arma.config.porcTiroCentro * this._formaGeometrica.heightSemRotac;
          vetorPontos[0] = new Ponto(x, yCentro - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.height/2);
          vetorPontos[1] = new Ponto(x, yCentro + distanciaTiroCentro - infoTiroPadrao.formaGeometrica.height/2);
        }else
          vetorPontos[0] = new Ponto(x, yCentro - infoTiroPadrao.formaGeometrica.height/2);
      }else
      //nao estah rotacionado
      {
        let x;
        if (direcaoSairTiro === Direcao.Esquerda)
          x = this._formaGeometrica.x - infoTiroPadrao.formaGeometrica.width + qntPraDentroObj;
        else
          x = this._formaGeometrica.x + this._formaGeometrica.width - qntPraDentroObj;

        if (arma.config.ehTiroDuplo) //se eh tiro duplo
        {
          const distanciaTiroCentro = arma.config.porcTiroCentro * this._formaGeometrica.height;
          vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height/2 - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.height/2);
          vetorPontos[1] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height/2 + distanciaTiroCentro - infoTiroPadrao.formaGeometrica.height/2);
        }else
          vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2);
      }
    }

    return vetorPontos;
  }

  //ARMA GIRATORIA
  _atirarArmaGiratoria(arma)
  {
    //Explicacao para deixar o tiro na rotacao e no lugar certo:
      // 1. Mudar (x,y) do tiro de modo a que o centroMassa dessa formaGeometrica seja exatamente o [ponto central final arma absoluto]
      // 2. Rotacionar tiro o valor que a arma esta rotacionada

    let formaGeomTiro = arma.controlador.infoTiroPadraoAtual.formaGeometrica.clone();
    //ps: clone para nao mudar infoTiroPadrao em si

    const chaveArmaGiratoria = ObjetoComArmas.chaveArmaGiratoria(arma.config.indexArmaGiratoria);

    //1. andar
    // qtdAndar = centroMassa(FINAL) - centroMassa(INICIAL)
    // ps: centroMassa(FINAL) = pontoCentralFinalArma
    const qtdAndar = this._getPontoCentralFinalArma(chaveArmaGiratoria).menos(formaGeomTiro.centroMassa);
    formaGeomTiro.x += qtdAndar.x;
    formaGeomTiro.y += qtdAndar.y;

    //2. rotacionar
    const rotacaoImgSecundaria = this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria);
    formaGeomTiro = formaGeomTiro.rotacionar(rotacaoImgSecundaria);
    //"formaGeomTiro = " para funcionar para FormasGeometricasSimples tambem

    //ADICIONAR TIRO: as unicas coisas que tem que mudar do infoTiroPadraoAtual sao:
    // a formaGeometrica (que jah contem os (x,y) desejados) e o qtdAndar (depende do angulo da arma)
    arma.controlador.adicionarTiroDif(null,
      {angulo: Angulo.angRotacaoParaAngCicloTrig(rotacaoImgSecundaria)},
      {formaGeometrica: formaGeomTiro});
  }
  _getPontoCentralFinalArma(chaveArmaGiratoria)
  // retorna pontoCentralFinalArmaRel
  {
    //PONTO INICIAL TIRO SAI
    // Explicacao dos passos:
      // 1) Transformar rotation em angulo do ciclo trigonometrico
      // 2) Descobrir os catetos do triangulo formado pelo angulo no ciclo (o cateto adjacente sobrepoe sobre o eixo x, e o oposto sobre o eixo y- (x,y) eh o ponto relativo do centro da arma)

    // 1)
    const anguloCiclo =  Angulo.angRotacaoParaAngCicloTrig(this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria)
      + this._formaGeometrica.anguloRotacionouTotal/*para funcionar quando o ObjetoComArmas estiver rotacionado*/);

    // 2)
    const raio = this._formaGeometrica.getMedidaImagemSecundaria(chaveArmaGiratoria, true)/2;
    const x = Math.cos(anguloCiclo) * raio;
    const y = Math.sin(anguloCiclo) * raio;

    // p(x,y) eh pontoCentralFinalArma relativo ao centro da imagem secundaria (portanto somando a esse ponto, ele se torna absoluto)
    return new Ponto(x,y).mais(this._formaGeometrica.getPontoCentralAbsolutoImagemSecundaria(chaveArmaGiratoria));
  }
  _mudarDirecaoArmasGiratorias()
  // se for PersonagemPrincipal, a movimentacao da arma vai ser pela posicao do mouse
  // se for Inimigo, a momvimentacao da arma vai ser pela posicao do personagem
  {
    this._armas.forEach((arma,i) =>
      {
        if (arma.config.indexArmaGiratoria >= 0) //se eh arma giratoria
        {
          //constantes
          const chaveArmaGiratoria = ObjetoComArmas.chaveArmaGiratoria(arma.config.indexArmaGiratoria);
          let pontoDestino;
          if (this instanceof PersonagemPrincipal)
            pontoDestino = new Ponto(mouseX,mouseY);
          else
          {
            if (ControladorJogo.pers.formaGeometrica!==undefined) //se ainda nao acabou as imagens de morrer do personagem depois que ele morreu
            {
              pontoDestino = ControladorJogo.pers.formaGeometrica.centroMassa; //aonde quer atirar (mouse ou personagem)
              this._ultimoPontoDestino = pontoDestino;
            }
            else
            if (this._ultimoPontoDestino!==undefined)
            //se jah acabou de printar pers mas guardou a ultima posicao dele, continua mirando para la
              pontoDestino = this._ultimoPontoDestino;
            else
            //se jah acabou de printar personagem e nao guardou ultima posicao dele, deixa arma giratoria parada
              return;
          }
          const maxRotacionarArmaGiratoria = (this instanceof PersonagemPrincipal)?maxRotacionarArmaGiratoriaPers:maxRotacionarArmaGiratoriaInim; //maximo angulo pode rotacionar (muda se for personagem ou inimigo)

          //o angulo que forma com o mouse (se PersonagemPrincipal) ou personagem (se Inimigo)
          const pontoCentralArma = this._formaGeometrica.getPontoCentralAbsolutoImagemSecundaria(chaveArmaGiratoria);
          const anguloDestino = new Angulo(pontoCentralArma.mais(new Ponto(0,-5)), pontoCentralArma, pontoDestino, Angulo.MAIOR_180_CIMA).valorRad;

          //o angulo que a arma estah
          const anguloArmaEstah = this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria);

          //quanto quer rotacionar
          let anguloQuerRotacionar = Angulo.entrePIeMenosPI(anguloDestino - anguloArmaEstah);
          // esse metodo do Angulo retorna um angulo entre PI e -PI: o caminho mais curto (se quer girar mais que 180 graus ha um caminho mais rapido: pelo outro lado/sentido oposto)

          //quanto pode rotacionar
          let anguloVaiRotacionar;
          if (Math.abs(anguloQuerRotacionar) > maxRotacionarArmaGiratoria)
          //se nao pode rotacionar tudo aquilo que quer
            anguloVaiRotacionar = maxRotacionarArmaGiratoria * ((anguloQuerRotacionar<0)?-1:1);
          else
            anguloVaiRotacionar = anguloQuerRotacionar;

          //rotaciona
          this._formaGeometrica.rotacionarImagemSecundaria(chaveArmaGiratoria, anguloVaiRotacionar);
        }
      });
  }
  static chaveArmaGiratoria(index)
  { return "armaGiratoria" + index; }

  //ATIRAR NAO AUTOMATICO
  puxarGatilho(i)
  //atirar nao automatico
  {
    let arma = this._armas[i];
    // se nao eh atirarDireto e podeAtirar E se [condicao da funcao]
    if (!arma.config.atirarDireto && arma.config.podeAtirar && this._podeAtirar(arma.config))
    {
      this._atirarEspecifico(arma);
      arma.config.podeAtirar = false;
    }
  }
  puxarGatilhos(vetorIndexes, inclusivo)
  // se vetorIndexes ou inclusivo for undefined, significa que sao todos os controladores
  // inclusivo: true=inclusivo (soh esses indexes), false=exclusivo (soh esses nao)
  {
    for (let i = 0; i<this._armas.length; i++)
    {
      //verificar se vai atirar nesse controlador
      let vaiAtirarNesseContr;
      if (vetorIndexes===undefined || inclusivo===undefined)
      //se nao ha especificacoes (sao todos)
        vaiAtirarNesseContr = true;
      else
      if (inclusivo)
        vaiAtirarNesseContr = vetorIndexes.indexOf(i) >= 0; //se estah no vetor
      else
      //if (!inclusivo) //exclusivo
        vaiAtirarNesseContr = vetorIndexes.indexOf(i) < 0; //se nao estah no vetor

      if (vaiAtirarNesseContr)
        this.puxarGatilho(i);
    }
  }

  //condicaoAtirar
  _podeAtirar(config)
  {
    return config.funcaoCondicaoAtirar===undefined || config.funcaoCondicaoAtirar(this);
    // se nao ha uma condicao pra atirar (sempre que der a frequencia, atirar) OU se ha, e a funcao retorna true (pode atirar)
  }

  //procedimentos com todos os controladores tiros
  andarTiros()
  {
    this._armas.forEach(arma => arma.controlador.andarTiros());
  }
  procObjVaiAndarColideTiros(objTela, qtdAndarX, qtdAndarY, podeTirarVidaObjTela)
  {
    this._armas.forEach(arma =>
      arma.controlador.procObjVaiAndarColideTiros(objTela, qtdAndarX, qtdAndarY, podeTirarVidaObjTela));
  }
  procObjCriadoColideTiros(objCriado, tirarVida)
  {
    this._armas.forEach(arma =>
      arma.controlador.procObjCriadoColideTiros(objCriado, tirarVida));
  }
  virarTirosContraCriador(seguir)
  {
    this._armas.forEach(arma => arma.controlador.virarTirosContraCriador(seguir));
  }
  //pode-se fazer outros procedimentos muito especificos com this.armas se nao for piorar o funcionamento do programa

  //para quando um tiro for criado (ver se colide com esse ObjetoComArmas)
  procColidirTiroCriado(tiro)
  //retorna se colidiu
  { return Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica); }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
  //retorna se deve retirar objeto do vetor depois de printa-lo
	{
    //rotacionar as helices se tiver
    if (this._helices!==undefined)
      this._helices.girar(this._formaGeometrica);

    // desenhar ObjComTiro
		const ret = super.draw();

    //desenhar tiros
    this._armas.forEach(arma => arma.controlador.draw());

    return ret;
	}
  drawTirosMortos() //tem que desenhar por cima de todos os ObjetosTela
  {
    this._armas.forEach(arma => arma.controlador.drawMortos());
  }
}

//OBJETO COM TIROS E VIDA
class InfoObjetoComArmas_e_Vida extends InfoObjetoComArmas
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, vida, infoArmas, qtdHelices, qtdsRotateDifHelices)
  // se tem helices (jah tem que ter adicionado as imagens secundarias na formaGeometrica)
  // qtdsRotateHelices: eh um vetor
  // se quiser que alguma helice gire numa velocidade diferente do que a padrao colocar no vetor o valor da velocidade no index dessa helice (as demais helices cujos indices nao tem nenhum valor no vetor, girarao na velocidade padrao)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.vida = vida;
  }
}
class ObjetoComArmas_e_Vida extends ObjetoComArmas
{
  constructor(pontoInicial, infoObjetoComArmas_e_Vida)
  {
    super(pontoInicial, infoObjetoComArmas_e_Vida);

    //vida
    this._vida = infoObjetoComArmas_e_Vida.vida;
    this._vidaMAX = infoObjetoComArmas_e_Vida.vida;
  }

  //getter vida
  get vida()
  { return this._vida; }
  get vidaMAX()
  { return this._vidaMAX; }

  //mudar vida
  colocarMAXVida()
  { this._vida = this._vidaMAX; }
  zerarVida()
  { this.mudarVida(-this._vida); }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida < 0)
        this._vida = 0;

    if (this._vivo && this._vida <= 0)
    //se ainda estava vivo e agora estah sem vida
      this.morreu();

    return this._vivo;
  }

  //para quando um tiro for criado (ver se colide com esse ObjetoComArmas)
  procColidirTiroCriado(tiro)
  //retorna se colidiu
  {
    const colidiu = super.procColidirTiroCriado(tiro);
    if (colidiu)
      tiro.tirarVidaObjCmVida(this, true);
    return colidiu;
  }

  //deixar tempo mais lento (para SuporteAereo e Inimigo: PersonagemPrincipal nao)
  mudarTempoSemTiros(porcentagem)
  {
    //mudarTempo do andar do inimigo
    this._classeAndar.mudarTempo(porcentagem);
    //mudarTempo do atirar do inimigo
    this._armas.forEach(arma => arma.freqFunc.mudarTempo(porcentagem));
    //para helicoptero
    if (this._helices!==undefined)
      this._helices.mudarTempo(porcentagem);
  }
  mudarTempo(porcentagem)
  {
    //mudarTempo tiros (diminuir velocidade dos que jah estao atirados e dos infoTiros)
    this._armas.forEach(arma => arma.controlador.mudarTempo(porcentagem));

    //atirar e andar do inimigo
    this.mudarTempoSemTiros(porcentagem);
  }
}
