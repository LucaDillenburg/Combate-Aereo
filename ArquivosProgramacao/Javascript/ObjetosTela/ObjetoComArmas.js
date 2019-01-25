//OBJETO TELA COM TIROS
const qtdRotateHelicePadrao = PI/3;
class InfoObjetoComArmas extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, vida, infoArmas, qtdHelices=0, qtdsRotateDifHelices)
  // se tem helices (jah tem que ter adicionado as imagens secundarias na formaGeometrica)
  // qtdsRotateHelices: eh um vetor
  // se quiser que alguma helice gire numa velocidade diferente do que a padrao colocar no vetor o valor da velocidade no index dessa helice (as demais helices cujos indices nao tem nenhum valor no vetor, girarao na velocidade padrao)
  {
    super(formaGeometrica, corImgMorto);
    this.vida = vida;
    this.infoArmas = infoArmas;

    this.qtdHelices = qtdHelices;
    this.qtdsRotateDifHelices = qtdsRotateDifHelices;
  }
}
class InfoArma
{
  constructor(infoTiroPadrao, freqAtirar, indexArmaGiratoria=-1, direcaoSairTiro, porcPraDentroObj=0, ehTiroDuplo=false, porcTiroCentro, atirarDireto=true, funcaoCondicaoAtirar)
  // porcPraDentroObj e porcTiroCentro devem ser um numero de 0 a 1
  // se indexArmaGiratoria >= 0, ha varios atributos que nao precisa-se preencher
  // funcaoCondicaoAtirar: essa funcao recebe o ObjetoComArmas como parametro e deve retornar true se puder atirar e false se nao puder (soh vai atirar se jah tiver a frequencia necessaria e se essa funcao retornar true)
  {
    this.infoTiroPadrao = infoTiroPadrao;
    this.freqAtirar = freqAtirar;

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
  { return new InfoArma(this.infoTiroPadrao, this.freqAtirar, this.indexArmaGiratoria, this.direcaoSairTiro, this.porcPraDentroObj, this.ehTiroDuplo, this.porcTiroCentro, this.atirarDireto, this.funcaoCondicaoAtirar); }

  getConfig()
  {
    if (this.indexArmaGiratoria >= 0) //se eh arma giratoria
      return {
        atirarDireto: this.atirarDireto,
        indexArmaGiratoria: this.indexArmaGiratoria,
        funcaoCondicaoAtirar: this.funcaoCondicaoAtirar
      };
    else
      return {
        atirarDireto: this.atirarDireto,
        indexArmaGiratoria: this.indexArmaGiratoria,
        direcaoSairTiro: this.direcaoSairTiro,
        porcPraDentroObj: this.porcPraDentroObj,
        ehTiroDuplo: this.ehTiroDuplo,
        porcTiroCentro: this.porcTiroCentro,
        funcaoCondicaoAtirar: this.funcaoCondicaoAtirar
      };
  }
}
class ObjetoComArmas extends ObjetoTela
{
  constructor(pontoInicial, infoObjetoComArmas)
  {
    super(pontoInicial, infoObjetoComArmas);

    //vida
    this._vida = infoObjetoComArmas.vida;
    this._vidaMAX = infoObjetoComArmas.vida;

    //tiros
    this._setarArmas(infoObjetoComArmas.infoArmas);

    //helices
    this._qtdHelices = infoObjetoComArmas.qtdHelices;
    if (infoObjetoComArmas.qtdHelices > 0)
      this._qtdsRotateDifHelices = infoObjetoComArmas.qtdsRotateDifHelices;
  }
  _setarArmas(infoArmas)
  {
    //this._armas: array de config (onde vai colocar), freqFunc (quando vai colocar), controlador (quem vai colocar)
    this._armas = new Array(infoArmas.length)
    for (let i = 0; i<this._armas.length; i++)
    {
      let config = infoArmas[i].getConfig();
      if (!config.atirarDireto)
      // se nao eh atirarDireto jah tem que setar o "podeAtirar"
        config.podeAtirar = false; // jah comeca podendo atirar

      const freqAtirar = infoArmas[i].freqAtirar;
      this._armas[i] = {
        controlador: new ControladorTiros(infoArmas[i].infoTiroPadrao, this instanceof PersonagemPrincipal),
        config: config,
        freqFunc: new FreqFunction(freqAtirar, freqAtirar-2) // o index comeca no penultimo porque nao pode jah atirar sem que o this._armas[i] esteja pronto
      };
      // se nao eh atirarDireto vai ter atributo "podeAtirar" no config
    }
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
  { return this._armas[i].controlador; }
  getFreqFuncAtirar(i=0) //ps: se quiser mudar frequencia mudar aqui (ou this._armas[i].freqFunc.freq)
  { return this._armas[i].freqFunc; }
  get qtdConfigContrTiros() { return this._armas.length; }

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
    this._vivo = this._vida !== 0;

    return this._vivo;
  }

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
            if (arma.config.funcaoCondicaoAtirar===undefined || arma.config.funcaoCondicaoAtirar(this))
            // se nao ha uma condicao pra atirar (sempre que der a frequencia, atirar) OU se ha, e a funcao retorna true (pode atirar)
            {
              if (arma.config.atirarDireto)
              // se atirar direto jah atira
                this._atirarEspecifico(index);
              else
              //se nao eh pra atirar direto, soh seta a variavel podeAtirar do config
                arma.config.podeAtirar = true;
            }else
            // agora o count do freqFunc estah no zero, porem nao pode deixar o freqFunc zerado. tem que deixar o count do freqFunc de modo a executar a funcao na proxima vez que contar
              arma.freqFunc.setContadorUltimaEtapa();
          }
        }
      });
  }
  //o procedimento de realmente atirar (onde a magica realmente acontece...)
  _atirarEspecifico(i)
  {
    // SE FOR ARMA GIRATORIA
    if (this._armas[i].config.indexArmaGiratoria >= 0)
      this._atirarArmaGiratoria(i);
    else
    {
      const pontosIniciais = this._lugarCertoTiro(i); //vetor com 1 ou 2 posicoes (se ehTiroDuplo). ps: jah conta o porcPraDentroObj
      this._armas[i].controlador.adicionarTiro(pontosIniciais[0]); //sempre vai atirar pelo menos um tiro
      if (pontosIniciais.length>1)
        this._armas[i].controlador.adicionarTiro(pontosIniciais[1]); //talvez seja tiro duplo
    }
  }
  _lugarCertoTiro(i)
  {
    //nao eh mais arma giratoria...

    let vetorPontos = new Array(this._armas[i].config.ehTiroDuplo?2:1);
    //se tiro duplo, retorna vetor com a posicao inicial dos dois tiros

    const infoTiroPadrao = this._armas[i].controlador.infoTiroPadraoAtual;
    const direcaoSairTiro = this._armas[i].config.direcaoSairTiro;

    //calcular qual o (x,y) em que o tiro vai ser criado
    if (direcaoSairTiro === Direcao.Cima || direcaoSairTiro === Direcao.Baixo)
    {
      const qntPraDentroObj = this._armas[i].config.porcPraDentroObj * this._formaGeometrica.height;
      let y;
      if (direcaoSairTiro === Direcao.Cima)
        y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntPraDentroObj;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntPraDentroObj;

      if (this._armas[i].config.ehTiroDuplo) //se eh tiro duplo
      {
        const distanciaTiroCentro = this._armas[i].config.porcTiroCentro * this._formaGeometrica.width;
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width/2 - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.width, y);
        vetorPontos[1] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width/2 + distanciaTiroCentro, y);
      }else
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2, y);
    }else
    {
      const qntPraDentroObj = this._armas[i].config.porcPraDentroObj * this._formaGeometrica.width;
      let x;
      if (direcaoSairTiro === Direcao.Esquerda)
        x = this._formaGeometrica.x - infoTiroPadrao.formaGeometrica.width + qntPraDentroObj;
      else
        x = this._formaGeometrica.x + this._formaGeometrica.width - qntPraDentroObj;

      if (this._armas[i].config.ehTiroDuplo) //se eh tiro duplo
      {
        const distanciaTiroCentro = this._armas[i].config.porcTiroCentro * this._formaGeometrica.height;
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height/2 - distanciaTiroCentro - infoTiroPadrao.formaGeometrica.height);
        vetorPontos[1] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height/2 + distanciaTiroCentro);
      }else
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2);
    }

    return vetorPontos;
  }

  //ARMA GIRATORIA
  _atirarArmaGiratoria(i)
  {
    //Explicacao para deixar o tiro na rotacao e no lugar certo:
      // 1. Mudar (x,y) do tiro de modo a que o centroMassa dessa formaGeometrica seja exatamente o [ponto central final arma absoluto]
      // 2. Rotacionar tiro o valor que a arma esta rotacionada

    let formaGeomTiro = this._armas[i].controlador.infoTiroPadraoAtual.formaGeometrica.clone();
    //ps: clone para nao mudar infoTiroPadrao em si

    const chaveArmaGiratoria = ObjetoComArmas.chaveArmaGiratoria(this._armas[i].config.indexArmaGiratoria);

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
    this._armas[i].controlador.adicionarTiroDif(null,
      {angulo: Angulo.angRotacaoParaAngCicloTrig(rotacaoImgSecundaria), direcaoTiroAponta: null},
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
    const anguloCiclo =  Angulo.angRotacaoParaAngCicloTrig(this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria));

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
          const pontoDestino = (this instanceof PersonagemPrincipal)?new Ponto(mouseX,mouseY):ControladorJogo.pers.formaGeometrica.centroMassa; //aonde quer atirar (mouse ou personagem)
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

  //atirar especificos
  puxarGatilho(i)
  //atirar nao automatico
  {
    // se nao eh atirarDireto e podeAtirar
    if (!this._armas[i].config.atirarDireto && this._armas[i].config.podeAtirar)
    {
      this._atirarEspecifico(i);
      this._armas[i].config.podeAtirar = false;
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
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      tiro.tirarVidaObjCmVida(this, true);
      return true;
    }else
      return false;
  }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
	{
    //rotacionar as helices se tiver
    for (let i = 0; i<this._qtdHelices; i++)
    // as helices sempre vao ficar nas primeiras posicoes de ImagemSecundaria
    {
      let qtdRotateHeliceAtual;
      if (this._qtdsRotateDifHelices === undefined || this._qtdsRotateDifHelices[i] === undefined)
        qtdRotateHeliceAtual = qtdRotateHelicePadrao; //padrao
      else
        qtdRotateHeliceAtual = this._qtdsRotateDifHelices[i]; //diferente
      this._formaGeometrica.rotacionarImagemSecundaria("helice"+i, qtdRotateHeliceAtual);
    }

    // desenhar ObjComTiro
		super.draw();

    //desenhar tiros
    this._armas.forEach(arma => arma.controlador.draw());
	}
}
