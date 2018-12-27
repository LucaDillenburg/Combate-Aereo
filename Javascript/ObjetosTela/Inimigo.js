//CONTROLADOR INIMIGOS
class ControladorInimigos
{
  //O INIMIGO MORTO SOH VAI SAIR DA LISTA DEPOIS QUE FOR PRINTADO NA TELA, QUANDO TODOS OS INIMIGOS ANDAREM OU
  //QUANDO OS TIROS DO PERSONAGEM ANDAREM (OU QUANDO ELE SAIR DA TELA)

  constructor(infoInimigoPadrao, indexContr, ehDeInimigosEssenciais = false)
  {
    //padrao
    this._infoInimigoPadrao = infoInimigoPadrao.clone();

    //index controlador
    this._indexContr = indexContr;

    // inimigos que interagem com o meio
    this._inimigos = new ListaDuplamenteLigada();
    // inimigos que NAO interagem com o meio (soh sao printados)
    this._inimigosSurgindo = []; //fila

    this._ehDeInimigosEssenciais = ehDeInimigosEssenciais;
  }

  get infoInimigoPadrao()
  { return this._infoInimigoPadrao; }

  get ehDeInimigosEssenciais()
  { return this._ehDeInimigosEssenciais; }

  //novo inimigo
  adicionarInimigoDif(pontoInicial, infoInimigo, direcaoX, direcaoY, todoQtdDirecao=false)
  {
    if (infoInimigo === undefined)
    {
      infoInimigo = this._infoInimigoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoInimigo.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar, configuracoesAtirar

      //infoAndar
      AuxControladores.qtdAndarDif(infoInimigo, this._infoInimigoPadrao, direcaoX, direcaoY, todoQtdDirecao);

      if (infoInimigo.corImgMorto === undefined)
        infoInimigo.corImgMorto = this._infoInimigoPadrao.corImgMorto;
      if (infoInimigo.vida === undefined)
        infoInimigo.vida = this._infoInimigoPadrao.vida;
      if (infoInimigo.corVida === undefined)
        infoInimigo.corVida = this._infoInimigoPadrao.corVida;
      if (infoInimigo.mostrarVidaSempre === undefined)
        infoInimigo.mostrarVidaSempre = this._infoInimigoPadrao.mostrarVidaSempre;
      if (infoInimigo.podeAtirarQualquerLado === undefined)
        infoInimigo.podeAtirarQualquerLado = this._infoInimigoPadrao.podeAtirarQualquerLado;
      if (infoInimigo.qtdTiraVidaPersQndIntersec === undefined)
        infoInimigo.qtdTiraVidaPersQndIntersec = this._infoInimigoPadrao.qtdTiraVidaPersQndIntersec;
      if (infoInimigo.configuracoesAtirar === undefined)
        infoInimigo.configuracoesAtirar = this._infoInimigoPadrao.configuracoesAtirar;

      //porcentagemTempoVida (pode ser nulo)
      if (infoInimigo.porcentagemTempoVida === undefined)
        infoInimigo.porcentagemTempoVida = this._infoInimigoPadrao.porcentagemTempoVida;

      //formaGeometrica
      if (infoInimigo.formaGeometrica === undefined)
        infoInimigo.formaGeometrica = this._infoInimigoPadrao.formaGeometrica;
    }

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoInimigoPadrao.formaGeometrica);

    this._adicionarInimigo(pontoInicial, infoInimigo);
  }
  adicionarInimigo(pontoInicial, infoInimigo)
  {
		if (infoInimigo === undefined)
      infoInimigo = this._infoInimigoPadrao;

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoInimigo.formaGeometrica);

    this._adicionarInimigo(pontoInicial, infoInimigo);
  }
  _adicionarInimigo(pontoInicial, infoInimigo)
  {
    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    const _this = this;
    this._inimigosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoInimigo, function(){ //(funcao callback)
      //remover esse inimigo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
      _this._inimigosSurgindo.pop();

      //adicionar inimigo que interage com o meio
      const novoInim = new Inimigo(pontoInicial, infoInimigo);
      novoInim.procCriou(_this._indexContr);

      if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
      // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do inimigo que for adicionar)
        novoInim.mudarTempoSemTiros(porcentagemDeixarTempoLento);

      //adicionar novo inimigo ao comeco da lista
  		_this._inimigos.inserirNoComeco(novoInim);
    }));
  }

  //tiros inimigos
  andarTirosTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.andarTodosContrTiros();
  }
  atirarTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.atirar();
  }

  //andar
  andarInimigos()
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        const continuaNaLista = this._inimigos.atual.andar(this._indexContr, indexInim);
        if (!continuaNaLista)
        //inimigo nao aparece na tela
          this._removerInimAtualCompleto();
      }
  }

 //outros...

  //para ver se level acabou
  algumInimNaTela()
  { return !this._inimigos.vazia || this._inimigosSurgindo.length>0; }

  //colisao com tiro
  verifColidirTiroPersTodosInim(info, tiro)
  //esses metodos funcionam por passagem por referencia de info
  {
    let inseriu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._inimigos.atual, tiro, true) || inseriu;
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com inimigos)
  procColidirTiroCriadoTodosInim(tiro)
  {
    let colidiu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        colidiu = this._inimigos.atual.procColidirTiroCriado(tiro, this._indexContr) || colidiu;
    return colidiu;
  }

  //andar personagem e obstaculo colidindo com tiros dos inimigos
  procObjTelaAndarColidirTirosTodosInim(objTelaColide, qtdMudarX, qtdMudarY, indexContrAndou, podeTirarVidaObjTela)
  //indexContrAndou soh eh necessario se objTela estiver em um controlador (ex: inimigo, obstaculo, tiro)
  //pers andou colidir com tiros de inimigos
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.procedimentoObjTelaColideAndarTodosContr(objTelaColide, qtdMudarX, qtdMudarY,
        indexContrAndou, podeTirarVidaObjTela);
  }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndarTodosInim(qtdAndarX, qtdAndarY) //personagem andou
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.procPersAndar(this._indexContr, indexInim, qtdAndarX, qtdAndarY);
  }
  procPersCresceuTodosInim() //personagem cresceu de tamanho
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.procVerifColisaoPersInimEstatico(this._indexContr, indexInim);
  }

  //para andar ateh inimigo
	qntAndarInimigoMaisProximo(formaGeometrica)
  // formaGeometrica do objeto que vai andar ateh inimigo mais proximo
	{
    let menorHipotenusa = null;
    let praOndeAndar = {}; //x, y, inim
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        const qntAndar = ClasseAndar.qntAndarParaBater(formaGeometrica, this._inimigos.atual.formaGeometrica);
        const hipotenusa = Operacoes.hipotenusa(qntAndar.x, qntAndar.y);
        if (menorHipotenusa === null || hipotenusa < menorHipotenusa)
        {
          praOndeAndar.x = qntAndar.x;
          praOndeAndar.y = qntAndar.y;
          praOndeAndar.inim = this._inimigos.atual;
          menorHipotenusa = hipotenusa;
        }
      }

    return praOndeAndar;
	}

  //para obstaculo criado e personagem que aumentar de tamanho colidir com tiros dos inimigos
  procObjCriadoColidirTirosInim(objCriado, indexContr)
  {
    const tirarVida = !(objCriado instanceof Obstaculo);
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.procedimentoObjTelaColideCriarTodosContr(objCriado, indexContr, tirarVida);
  }

  //POCAO
  matarTodosInim()
  {
    //mata todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.seMatar();
  }
  tirarVidaTodosInim(qtdTira)
  {
    //tirar um pouco de vida de todos inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.mudarVida(-qtdTira, false); //nao eh o tiro que estah tirando a vida dele
  }
  virarTirosContraCriador(seguir)
  {
    //virar todos os tiros contra o criador
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
    {
      this._inimigos.guardarAtual();
      this._inimigos.atual.virarTirosContraCriador(seguir);
      this._inimigos.colocarGuardadoNoAtual();
    }
  }
  mudarCongelarTodosInim(congelar)
  //congelar: true = congelar, false = descongelar
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        if (congelar)
          this._inimigos.atual.congelar();
        else
          this._inimigos.atual.descongelar();
      }
  }
  mudarTempo(porcentagem)
  {
    //inimigos surgindo
    this._inimigosSurgindo.forEach(inimSurgindo => {
      inimSurgindo.mudarTempo(porcentagem);
    });

    //inimigos que jah interagem com o meio
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.mudarTempo(porcentagem);
  }


  //aux
  _removerInimAtualCompleto()
  {
    this._inimigos.atual.procVaiSerRemovido();
    this._inimigos.removerAtual();
  }

  //draw
  draw()
	{
    //inimigos surgindo
    this._inimigosSurgindo.forEach(inimSurgindo => {
      inimSurgindo.draw();
    });

    //inimigos que jah interagem com o meio
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
    {
      this._inimigos.atual.draw();
      //se inimigo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._inimigos.atual.vivo)
        this._removerInimAtualCompleto();
    }
	}
}


//INIMIGO
const maxRotacionarArmaGiratoriaInim = PI/32;
class InfoInimigo extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, podeAtirarQualquerLado=false, qtdTiraVidaPersQndIntersec, infoAndar, configuracoesAtirar, qtdHelices, qtdsRotateDifHelices, ehInimEssencial)
  //podeAtirarQualquerLado: se tiro for seguir personagem, pode colocar tiro do lado mais proximo do pers
  {
    super(formaGeometrica, corImgMorto, vida, configuracoesAtirar, qtdHelices, qtdsRotateDifHelices);
    this.corVida = corVida;
    this.mostrarVidaSempre = mostrarVidaSempre;
    if (porcentagemTempoVida !== undefined)
      this.porcentagemTempoVida = porcentagemTempoVida;
    this.podeAtirarQualquerLado = podeAtirarQualquerLado;
    this.qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
    this.infoAndar = infoAndar;
    this.ehInimEssencial = ehInimEssencial; //soh o controladorInimigos que coloca
  }

  clone()
  { return new InfoInimigo(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), this.vida, AuxInfo.cloneImgCor(this.corVida), this.mostrarVidaSempre, this.porcentagemTempoVida, this.podeAtirarQualquerLado, this.qtdTiraVidaPersQndIntersec, this.infoAndar.clone(), AuxInfo.cloneConfiguracoesAtirar(this.configuracoesAtirar), this.qtdHelices, AuxInfo.cloneQtdsRotateDifHelice(this.qtdsRotateDifHelices), this.ehInimEssencial); }
}
//backend
const tempoMostrarVidaPadrao = 675;
//visual:
const heightVidaInim = 10;
const porcentWidthVidaInim = 0.25;
class Inimigo extends ObjComTiros
{
  constructor(pontoInicial, infoInimigo)
  {
    super(pontoInicial, infoInimigo);

    //tiro
    this._podeAtirarQualquerLado = infoInimigo.podeAtirarQualquerLado;
    this.procMudouTiroIndex1();

    //andar
    this._seEhImpossivelExcep(infoInimigo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoInimigo.infoAndar, this._formaGeometrica);

    //tirar vida pers
    this._qtdTiraVidaPersQndIntersec = infoInimigo.qtdTiraVidaPersQndIntersec;
    this._auxTirarVidaPers = 0;

    //para desenhar vida
    this._corVida = AuxInfo.cloneImgCor(infoInimigo.corVida);
    this._mostrarVidaSempre = infoInimigo.mostrarVidaSempre;
    if (!this._mostrarVidaSempre)
      this._tempoMostrarVida = (infoInimigo.porcentagemTempoVida===undefined) ? tempoMostrarVidaPadrao : infoInimigo.porcentagemTempoVida*tempoMostrarVidaPadrao;
    if (this._mostrarVidaSempre)
    //se soh vai mostrar sempre
      this._mostrarVida = true;
    else
    //se soh vai mostrar vida quando levar tiro
    {
      this._funcCamadasMostrarVida = new FuncEmCamadas();
      this._mostrarVidaCertoTempo();
    }

    //essencial
    this._ehInimEssencial = infoInimigo.ehInimEssencial;

    //congelado
    this._funcCamadasCongelar = new FuncEmCamadas();
    this._estahCongelado = false;
  }

  //procedimento ao criar: colisao com tiros do pers (nao precisa verificar colidir com o personagem aqui! pois quando ele for andar jah vai colidir jah que Interseccao.vaiTerInterseccao(...) verifica se jah estah intersectando antes)
  procCriou(indexContrInim)
  { ConjuntoObjetosTela.pers.procObjTelaColideCriarTodosContrTiros(this, indexContrInim); }

  procMudouTiroIndex1()
  { this._mudouCondicaoEscolherDirTiroSair(); }

  _mudouCondicaoEscolherDirTiroSair()
  {
    if (this._decidirDirecaoTiro)
      this._configContrTiros[1].config.mudarDirAndarTiroDirSai = true;
  }
  get _decidirDirecaoTiro() //private porque soh pode ser usado dentro da classe e nao eh metodo porque fica mais facil e simples assim
  {
    if (this._configContrTiros.length < 2) return false; //se nem tem INDEX=1 em configContrTiros

    return this._podeAtirarQualquerLado && this._configContrTiros[1].controlador.infoTiroPadraoAtual.infoAndar.tipoAndar === Andar.SEGUIR_PERS;
  }

  //getters e setters andar
  get classeAndar()
  { return this._classeAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo === TipoAndar.SeguirInimMaisProx)
      throw "Inimigo nao pode seguir inimigos";
  }
  setTipoAndar(tipo)
  {
    this._seEhImpossivelExcep(tipo);
    this._classeAndar.setTipoAndar(tipo, this._formaGeometrica);
  }
  //se for adicionar set qtdAndar, mudar this._hipotenusaAndarPadrao de acordo com o tipoAndar

  //ANDAR
  andar(indexContrInim, indexInim)
  //retorna se deve continuar na lista
  {
    if (this._estahCongelado) return true; //se estah congelado nao anda nem atira

    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse inimigo andou, ele sai
    ConjuntoObjetosTela.pers.procObjTelaColideAndarTodosContrTiros(this, qtdAndar.x, qtdAndar.y, indexContrInim);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      ConjuntoObjetosTela.pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //mudar tamanho
  mudarTamLados(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    super.mudarTamLados(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
    //soh tem que verificar se colidiu com tiros do personagem e personagem
    {
      //verificar colisao com tiros do personagem
      ConjuntoObjetosTela.pers.procObjTelaColideCriarTodosContrTiros(this, indexContrInim);

      //verificar colisao com personagem
      procVerifColisaoPersInimEstatico(indexContr, indexInim);
    }
  }

  //ATIRAR
  atirar()
  {
    if (this._estahCongelado) return; //se estah congelado nao anda nem atira

    //se eh pra decidir a direcao do tiro decide (index 1)
    if (this._decidirDirecaoTiro)
      this._configContrTiros[1].config.direcaoSairTiro = Direcao.emQualDirecaoObjEsta(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica);

    // atirar propriamente dito
    super.atirar();
  }

  get podeAtirarQualquerLado()
  { return this._podeAtirarQualquerLado; }
  set podeAtirarQualquerLado(pode)
  {
    this._podeAtirarQualquerLado = pode;
    this._mudouCondicaoEscolherDirTiroSair();
  }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }

  //vida
  mudarVida(qtdMuda, colidiuTiroPers = true)
  //mudar vida de inimigo: verificar se deve colocar vida na tela ou nao
  {
    if (colidiuTiroPers && !this._ehInimEssencial &&
      ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
    //se nao eh inimigo essencial e nesse momento mata-se inimigos com 1 tiro, se matar
    // PARTE DA EXECUCAO DA POCAO
      this.seMatar();
    else
    {
      super.mudarVida(qtdMuda);

      //a vida nao pode ser maior do que o maximo
      if (this._vida > this._vidaMAX)
        this._vida = this._vidaMAX;
    }

    //se soh mostra vida quando leva tiro
    //(mostra a vida ateh ficar um certo tempo sem levar tiro)
    if (!this._mostrarVidaSempre)
      this._mostrarVidaCertoTempo();
  }
  seMatar()
  {
    this._vida = 0;
    this.morreu();
  }
  _mostrarVidaCertoTempo()
  {
    this._mostrarVida = true;
    this._funcCamadasMostrarVida.subirCamada();
    const _this = this;
    new Timer(
      function()
      {
        if (_this._funcCamadasMostrarVida.descerCamada())
          _this._mostrarVida = false;
      }, this._tempoMostrarVida, false
    );
  }
  get mostrarVidaSempre()
  { return this._mostrarVidaSempre; }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndar(indexContr, indexInim, qtdAndarX, qtdAndarY) //quando personagem for andar
  {
    if (Interseccao.vaiTerInterseccao(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica, qtdAndarX, qtdAndarY))
      ConjuntoObjetosTela.pers.colidiuInim(indexContr, indexInim, this._qtdTiraVidaPersQndIntersec);
  }
  procVerifColisaoPersInimEstatico(indexContr, indexInim) //quando personagem ou inimigo for aumentar de tamanho
  {
    if (Interseccao.interseccao(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica))
      ConjuntoObjetosTela.pers.colidiuInim(indexContr, indexInim, this._qtdTiraVidaPersQndIntersec);
  }

  //para quando um tiro for criado (ver se colide com esse inimigo)
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

  // para ControladorInimigos
  procVaiSerRemovido()
  {
    // passar todos os tiros para o controladorTirosJogo (se nao os tiros do inimigo simplesmente sumiriam)
    for (let i = 0; i<this._configContrTiros.length; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[0].concatenarTiros(this._configContrTiros[i].controlador);
  }

  //procedimento com todos os controladores
  virarTirosContraCriador(seguir)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.seVirarContraCriador(seguir);
  }
  procedimentoObjTelaColideAndarTodosContr(objTelaColide, qtdMudarX, qtdMudarY,
    indexContrAndou, podeTirarVidaObjTela)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY,
        indexContrAndou, podeTirarVidaObjTela);
  }
  procedimentoObjTelaColideCriarTodosContr(objCriado, indexContr, tirarVida)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.procedimentoObjTelaColideCriar(objCriado, indexContr, tirarVida)
  }

  //POCAO
  //congelar e descongelar
  congelar()
  {
    this._funcCamadasCongelar.subirCamada();
    this._estahCongelado = true;
  }
  descongelar()
  {
    if (this._funcCamadasCongelar.descerCamada())
      this._estahCongelado = false;
  }
  //deixar tempo mais lento
  mudarTempoSemTiros(porcentagem)
  {
    //andar do inimigo
    this._classeAndar.mudarTempo(porcentagem);
    //atirar do inimigo
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].freqFunc.mudarTempo(porcentagem);
  }
  mudarTempo(porcentagem)
  {
    //tiros
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.mudarTempo(porcentagem);

    //atirar e andar do inimigo
    this.mudarTempoSemTiros(porcentagem);
  }

  //desenho
  get corVida()
  { return this._corVida; }
  set corVida(vida)
  { this._corVida = vida; }
  draw()
  {
    // TODO: SE ESTAH CONGELADO, COLOCAR TEXTURA

    //desenha inimigo e tiros dele
    super.draw();

    if (this._mostrarVida)
      this._desenharVida();
  }
  _desenharVida()
  {
    const tamStrokeAtual = 2;
    strokeWeight(tamStrokeAtual);

    //DRAW VIDA:
    //draw vida em cima do inimigo
    const widthVidaInim = porcentWidthVidaInim*this._vidaMAX;
    const xVida = this._formaGeometrica.x + (this._formaGeometrica.width - widthVidaInim)/2;
    const yVida = this._formaGeometrica.y - (heightVidaInim + 5);

    //desenhar parte branca da vida
    stroke(this._corVida.stroke);
    fill(255); //branco
    rect(xVida, yVida, widthVidaInim, heightVidaInim);

    //desenhar a parte verdadeira
    const tamNoStroke = tamStrokeAtual/2;
    noStroke();
    fill(this._corVida.fill);
    rect(xVida + tamNoStroke, yVida + tamNoStroke,
      (widthVidaInim - 2*tamNoStroke)*(this._vida/this._vidaMAX), heightVidaInim - 2*tamNoStroke);

    strokeWeight(tamStroke);
  }
}
