//OBJETO TELA COM TIROS
const qtdRotateHelicePadrao = PI/3;
class InfoObjComTiros extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, vida, configuracoesAtirar, qtdHelices=0, qtdsRotateDifHelices)
  // se tem helices (jah tem que ter adicionado as imagens secundarias na formaGeometrica)
  // qtdsRotateHelices: eh um vetor
  // se quiser que alguma helice gire numa velocidade diferente do que a padrao colocar no vetor o valor da velocidade no index dessa helice (as demais helices cujos indices nao tem nenhum valor no vetor, girarao na velocidade padrao)
  {
    super(formaGeometrica, corImgMorto);
    this.vida = vida;
    this.configuracoesAtirar = configuracoesAtirar;

    this.qtdHelices = qtdHelices;
    this.qtdsRotateDifHelices = qtdsRotateDifHelices;
  }
}
class ConfigAtirar
//atributos: normal ou duplo + numero pixels ou centro + numero pixels pra tras + como vai ser o tiro (o objeto pode atirar tiros diferentes)
{
  constructor(infoTiroPadrao, freqAtirar, indexArmaGiratoria, direcaoSairTiro, qntPraDentroObj=0, ehTiroDuplo=false, distanciaTiroVert, mudarDirAndarTiroDirSai=false)
  {
    this.infoTiroPadrao = infoTiroPadrao;
    this.freqAtirar = freqAtirar;

    this.indexArmaGiratoria = indexArmaGiratoria;
    if (indexArmaGiratoria < 0)
    {
      this.direcaoSairTiro = direcaoSairTiro;
      this.qntPraDentroObj = qntPraDentroObj;
      this.mudarDirAndarTiroDirSai = mudarDirAndarTiroDirSai;

      this.ehTiroDuplo = ehTiroDuplo;
      if (this.ehTiroDuplo)
        this.distanciaTiroVert = distanciaTiroVert;
    }
  }

  clone()
  { return new ConfigAtirar(this.infoTiroPadrao, this.freqAtirar, this.indexArmaGiratoria, this.direcaoSairTiro, this.qntPraDentroObj, this.ehTiroDuplo, this.distanciaTiroVert, this.mudarDirAndarTiroDirSai); }

  getTudoMenosInfoTiro()
  {
    if (this.indexArmaGiratoria >= 0) //se eh arma giratoria
      return { indexArmaGiratoria: this.indexArmaGiratoria };
    else
      return {
        indexArmaGiratoria: this.indexArmaGiratoria,
        direcaoSairTiro: this.direcaoSairTiro,
        qntPraDentroObj: this.qntPraDentroObj,
        ehTiroDuplo: this.ehTiroDuplo,
        distanciaTiroVert: this.distanciaTiroVert,
        mudarDirAndarTiroDirSai: this.mudarDirAndarTiroDirSai
      };
  }
}
class ObjComTiros extends ObjetoTela
{
  constructor(pontoInicial, infoObjComTiros)
  {
    super(pontoInicial, infoObjComTiros);

    //vida
    this._vida = infoObjComTiros.vida;
    this._vidaMAX = infoObjComTiros.vida;

    //tiros
    this._setarConfigContrTiros(infoObjComTiros.configuracoesAtirar);

    //helices
    this._qtdHelices = infoObjComTiros.qtdHelices;
    if (infoObjComTiros.qtdHelices > 0)
      this._qtdsRotateDifHelices = infoObjComTiros.qtdsRotateDifHelices;
  }
  _setarConfigContrTiros(configuracoesAtirar)
  {
    //tiros: array de config (onde vai colocar) e controlador (controladorTiros)
    this._configContrTiros = new Array(configuracoesAtirar.length)
    const _this = this;
    for (let i = 0; i<this._configContrTiros.length; i++)
    {
      const freqAtirar = configuracoesAtirar[i].freqAtirar;
      this._configContrTiros[i] = {
        controlador: new ControladorTiros(configuracoesAtirar[i].infoTiroPadrao, this instanceof PersonagemPrincipal),
        config: configuracoesAtirar[i].getTudoMenosInfoTiro(),
        freqFunc: new FreqFunction(freqAtirar, freqAtirar-2) // o index comeca no penultimo porque nao pode jah atirar sem que o configContrTiros[i] esteja pronto
      };
      // se eh arma giratoria vai ter um atributo "pontoRelativoSairTiro" no config
    }
  }

  //get ControladorTiros
  getControladorTiros(i=0)
  { return this._configContrTiros[i].controlador; }
  get qtdControladoresTiros()
  { return this._configContrTiros.length; }
  getConfigAtirar(i=0) //pode mudar as configuracoes por aqui
  { return this._configContrTiros[i].controlador; }
  //ps: se quiser mudar frequencia: "this._configContrTiros[i].freqFunc.freq = X;"

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
  morreu()
  {
    this._vivo = false;
    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }

  //TIROS
  //novo tiro
  atirar()
  //soh chama o .contar() de todos os freqFunc (se estiver na hora deles atirarem, eles atiram)
  {
    // mudar direcao armas giratorias (vai atirar certo, vai ser mais facil, mais controle)
    this._mudarDirecaoArmasGiratorias();

    // atirar propriamente dito
    for(let i = 0; i<this._configContrTiros.length; i++)
      if (this._configContrTiros[i].freqFunc.contar()) // se jah estah na hora de chamar o metodo
        this.atirarEspecifico(i);
  }
  //o procedimento de realmente atirar (onde a magica realmente acontece...)
  atirarEspecifico(i)
  {
    const pontosIniciais = this._lugarCertoTiro(i); //vetor com 1 ou 2 posicoes (se ehTiroDuplo). ps: jah conta o qntPraDentroObj
    this._adicionarTirosEmContr(pontosIniciais[0], i); //sempre vai atirar pelo menos um tiro
    if (pontosIniciais.length>1)
      this._adicionarTirosEmContr(pontosIniciais[1], i); //talvez seja tiro duplo
  }
  _adicionarTirosEmContr(pontoInicial, i)
  {
    if (this._configContrTiros[i].config.mudarDirAndarTiroDirSai)
    {
      const direcaoSairTiro = this._configContrTiros[i].config.direcaoSairTiro;
      this._configContrTiros[i].controlador.adicionarTiroDif(pontoInicial, undefined, direcaoSairTiro, direcaoSairTiro, true);
      //vai fazer o tiro ir pra direcao que ele saiu (todo o qtdAndarX e Y somado vai pra soh uma direcao)
      //ps: se colocar Direcao.Baixo como DirecaoX, por exemplo, nao vai dar problema
    }
    else
      this._configContrTiros[i].controlador.adicionarTiro(pontoInicial);
  }
  _lugarCertoTiro(i)
  {
    // SE FOR ARMA GIRATORIA
    if (this._configContrTiros[i].config.indexArmaGiratoria >= 0)
    {
      // ponto central absoluto + ponto sair tiro relativo ao ponto central
      const pontoSairTiroArmaGiratoria = this._configContrTiros[i].config.pontoRelativoSairTiro.mais(
        this._formaGeometrica.getPontoCentralAbsolutoImagemSecundaria(
          "armaGiratoria"+this._configContrTiros[i].config.indexArmaGiratoria));

      let vetorPontos = new Array(1);
      vetorPontos[0] = pontoSairTiroArmaGiratoria;
      return vetorPontos;
    }

    //daqui pra frenque nao eh mais arma giratoria...

    let vetorPontos = new Array(this._configContrTiros[i].config.ehTiroDuplo?2:1);
    //se tiro duplo, retorna vetor com a posicao inicial dos dois tiros

    const infoTiroPadrao = this._configContrTiros[i].controlador.infoTiroPadraoAtual;
    const qntPraDentroObj = this._configContrTiros[i].config.qntPraDentroObj;
    const direcaoSairTiro = this._configContrTiros[i].config.direcaoSairTiro;

    //calcular qual o (x,y) em que o tiro vai ser criado
    if (direcaoSairTiro === Direcao.Cima || direcaoSairTiro === Direcao.Baixo)
    {
      let y;
      if (direcaoSairTiro === Direcao.Cima)
        y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntPraDentroObj;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntPraDentroObj;

      if (this._configContrTiros[i].config.ehTiroDuplo) //se eh tiro duplo
      {
        const distanciaTiroVert = this._configContrTiros[i].config.distanciaTiroVert;
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + distanciaTiroVert, y);
        vetorPontos[1] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width - distanciaTiroVert, y);
      }else
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2, y);
    }else
    {
      let x;
      if (direcaoSairTiro === Direcao.Esquerda)
        x = this._formaGeometrica.x - infoTiroPadrao.formaGeometrica.width + qntPraDentroObj;
      else
        x = this._formaGeometrica.x + this._formaGeometrica.width - qntPraDentroObj;

      if (this._configContrTiros[i].config.ehTiroDuplo) //se eh tiro duplo
      {
        const distanciaTiroVert = this._configContrTiros[i].config.distanciaTiroVert;
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + distanciaTiroVert); //tiro 1 (mais em cima)
        vetorPontos[1] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height - distanciaTiroVert); //tiro 2 (mais em baixo)
      }else
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2);
    }

    return vetorPontos;
  }
  //atirar especificos
  atirarEspecificos(vetorIndexes, inclusivo)
  // se vetorIndexes ou inclusivo for undefined, significa que sao todos os controladores
  // inclusivo: true=inclusivo (soh esses indexes), false=exclusivo (soh esses nao)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
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
        this.atirarEspecifico(i);
    }
  }

  //ARMA GIRATORIA
  _mudarDirecaoArmasGiratorias()
  // se for PersonagemPrincipal, a movimentacao da arma vai ser pela posicao do mouse
  // se for Inimigo, a momvimentacao da arma vai ser pela posicao do personagem
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      if (this._configContrTiros[i].config.indexArmaGiratoria >= 0) //se eh arma giratoria
      {
        //constantes
        const chaveArmaGiratoria = "armaGiratoria" + this._configContrTiros[i].config.indexArmaGiratoria;
        const pontoDestino = (this instanceof PersonagemPrincipal)?new Ponto(mouseX,mouseY):ConjuntoObjetosTela.pers.formaGeometrica.centroMassa; //aonde quer atirar (mouse ou personagem)
        const maxRotacionarArmaGiratoria = (this instanceof PersonagemPrincipal)?maxRotacionarArmaGiratoriaPers:maxRotacionarArmaGiratoriaInim; //maximo angulo pode rotacionar (muda se for personagem ou inimigo)

        //o angulo que forma com o mouse (se PersonagemPrincipal) ou personagem (se Inimigo)
        const pontoCentralArma = this._formaGeometrica.getPontoCentralAbsolutoImagemSecundaria(chaveArmaGiratoria);
        const anguloMouse = new Angulo(pontoCentralArma.mais(0,-5), pontoCentralArma, pontoDestino, Angulo.MAIOR_180_CIMA);

        //o angulo que a arma estah
        const anguloArmaEstah = this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria);

        //quanto quer rotacionar
        const anguloQuerRotacionar = anguloMouse - anguloArmaEstah;

        //quanto pode rotacionar
        let anguloVaiRotacionar;
        if (Math.abs(anguloQuerRotacionar) > maxRotacionarArmaGiratoria)
        //se nao pode rotacionar tudo aquilo que quer
        {
          if (anguloQuerRotacionar < 0)
          // se queria rotacionar negativamente mais do que podia, deixa no maximo negativamente
            anguloVaiRotacionar = -maxRotacionarArmaGiratoria;
          else
          // se queria rotacionar positivamente mais do que podia, deixa no maximo positivamente
            anguloVaiRotacionar = maxRotacionarArmaGiratoria;
        }else
          anguloVaiRotacionar = anguloQuerRotacionar;

        //rotaciona
        this._formaGeometrica.rotacionarImagemSecundaria(chaveArmaGiratoria, anguloVaiRotacionar);

        //soh precisa setar ponto inicial e qtdAndar, se a proxima vez jah vai atirar (se nao faria algo desnecessario jah que esses valores seriam mudados de novo antes do proximo tiro)
        if (this._configContrTiros[i].freqFunc.vaiExecutarFuncaoProximaVez())
          this._setarPontoInicialQtdAndarTiroArmaGiratoria(i, chaveArmaGiratoria);
    }
  }
  _setarPontoInicialQtdAndarTiroArmaGiratoria(i, chaveArmaGiratoria)
  {
    //PONTO INICIAL TIRO SAI
    // Explicacao dos passos:
      // 1) O angulo das rotacoes comeca a contar de cima sentido horario, mas o angulo do ciclo trigonometrico comeca da direita em sentido anti-horario (transformar rotation em angulo do ciclo trigonometrico)
      // 2) Descobrir os catetos do triangulo formado pelo angulo no ciclo (o cateto adjacente sobrepoe sobre o eixo x, e o oposto sobre o eixo y- (x,y) eh o ponto relativo do centro da arma)

    // 1)
    let anguloCiclo = PI/2 - this._formaGeometrica.getRotacaoImgSecundaria(chaveArmaGiratoria);
    if (anguloCiclo < 0)
      anguloCiclo += 2*PI; //para tirar do negativo

    // 2)
    const raio = this._formaGeometrica.getMedidaImagemSecundaria(chaveArmaGiratoria, true)/2;
    const x = Math.cos(anguloCiclo) * raio;
    const y = Math.sin(anguloCiclo) * raio;

    // mudar de onde o tiro sai
    this._configContrTiros[i].config.pontoRelativoSairTiro = new Ponto(x,y);


    //QTD ANDAR TIRO
    this._configContrTiros[i].controlador.infoTiroPadraoAtual.infoAndar.mudarAnguloQtdAndar(anguloCiclo);
  }

  //procedimentos com todos os controladores tiros
  andarTodosContrTiros()
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.andarTiros();
  }
  procObjTelaColideAndarTodosContrTiros(objTela, qtdAndarX, qtdAndarY, indexContr, podeTirarVidaObjTela)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.procedimentoObjTelaColideAndar(objTela, qtdAndarX, qtdAndarY, indexContr, podeTirarVidaObjTela);
  }
  procComTodosContrTiros(funcao) //essa funcao recebe um parametro: um controlador
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      funcao(this._configContrTiros[i].controlador);
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
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.draw();
	}


  //MUDAR TAMANHOS
  mudarTamLados(porcentagem)
  //soh tem opcao para mudar o tamanho os lados proporcionalmente ao valor atual deles (mantem a proporcao dos lados)
  {
    switch (this._formaGeometrica.codForma)
    {
      case Geometria.COD_QUADRADO:
        this._formaGeometrica.setTamanhoLadoPorcentagem(porcentagem);
        break;
      case Geometria.COD_RETANGULO:
        this._formaGeometrica.setWidthPorcentagem(porcentagem);
        this._formaGeometrica.setHeightPorcentagem(porcentagem);
        break;
      default:
        throw "Não é possível mudar o width e height de um objeto que não tem!";
    }
  }
}
