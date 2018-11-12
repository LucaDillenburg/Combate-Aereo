// import "ObjetosSimples.js"; jah foi importado por OutrosControladores.js e ObjetosComplexos.js
//import "ObjetosComplexos.js";
// import "OutrosControladores.js"; jah foi importado por ObjetosComplexos.js
// import "ListaDuplamenteLigada.js"; jah foi importado

const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3, "Ganhou": 4};

//const heightVidaUsuario estah em geometria basica
class ControladorJogo
{
  constructor()
  {
    this._conjuntoObjetosTela = null;
    this._personagemPrincipal = null;
    this._controladoresInimigos = null;
    this._controladoresObstaculos = null;
    this._controladoresTiros = null;
    //deixar posicao 0 para tiros de personagens que morrem

    this._estadoJogo = EstadoJogo.NaoComecou;
    this._estadoJogoAnterior = null;

    this._level = -1;
    this._passandoLevel = false;
  }

  //get EstadoJogo
  get estadoJogo()
  { return this._estadoJogo; }

  static personagemPrincPadrao()
  {
    let tamPersPrinc = 30;
    let corPers = color(0, 51, 153);
    let forma = new Quadrado(0, 0, tamPersPrinc, {stroke: corPers, fill: corPers});
    let pers = new PersonagemPrincipal(forma, color("black"), 100, ControladorJogo.newTiroPersPadrao(), 10);
    pers.colocarLugarInicial();
    return pers;
  }
  static newTiroPersPadrao()
  {
    let corTiro = color(0, 0, 102);
    return new Tiro(new Retangulo(0, 0, 5, 8, {fill: corTiro, stroke: corTiro}),
      {fill: color("black"), stroke: color("black")},
      {qtdAndarX: 0, qtdAndarY: -15, tipoAndar: Andar.ANDAR_NORMAL}, null, true, 5);
  }
  static newTiroNaoPersPadrao()
  {
    let corTiro = color("red");
    return new Tiro(new Retangulo(0, 0, 2.7, 5, {fill: corTiro, stroke: corTiro}),
      {fill: color("black"), stroke: color("black")},
      {qtdAndarX: 0, qtdAndarY: 18, tipoAndar: Andar.ANDAR_NORMAL}, null, false, 3);
  }

  //inicializacao
  comecarJogo()
  {
    this._personagemPrincipal = ControladorJogo.personagemPrincPadrao();
    this._atualizarConjuntoObjetosTela();

    this._level = 1;
    this._iniciarLevel();

    this._estadoJogo = EstadoJogo.Jogando;
  }
  //inicializar level
  _iniciarLevel()
  {
    this._passandoLevel = true;

    //zerar tudo
    this._controladoresInimigos = new Array(0);
    this._controladoresObstaculos = new Array(0);
    this._controladoresTiros = new Array(0);
    this._atualizarConjuntoObjetosTela();

    //mudar : this._controladoresInimigos, this._controladoresObstaculos, this._controladoresTiros
    // ATENCAO: NENHUM DESSES MEMBROS PODEM SER NULOS, POREM PODEM SER UM ARRAY DE ZERO POSICOES
    //  (exceto this._controladoresTiros que tem que ter no minimo 1 posicao)

    //TODO: DEFINIR COMO CADA LEVEL VAI SER
      //1. Um inimigo central que se mexe de um lado para o outro atirando e obstaculos com vida passando da esquerda para a direita (saindo da tela)
      //2. mais inimigos nao essenciais
    let controladoresInimigosLvAtual,
        controladoresObstaculosLvAtual,
        controladoresTirosLvAtual;
    switch(this._level)
    {
      case 1:
      // inimigos
        controladoresInimigosLvAtual = new Array(1);

        let corInim = color("red");
        let tamInimigo = 50;
        controladoresInimigosLvAtual[0] = new ControladorInimigos(new Inimigo(
          new Quadrado(0, 0, tamInimigo, {stroke: corInim, fill: corInim}),
          color("black"), {vida: 350, corVida: corInim, mostrarVidaSempre: true},
          ControladorJogo.newTiroNaoPersPadrao(), 2, {qtdAndarX: 5, qtdAndarY: 0,
          tipoAndar: Andar.INVERTER_QTDANDAR_NAO_SAIR_TELA}, this._personagemPrincipal
        ));
        //controladoresInimigosLvAtual[0].adicionarInimigo(0, this._personagemPrincipal, Tela.xParaEstarNoMeio(tamInimigo), 20); aqui

      // obstaculos
        controladoresObstaculosLvAtual = new Array(1);

        let corObst = color("black");
        controladoresObstaculosLvAtual[0] = new ControladorObstaculos(new Obstaculo(
          new Retangulo(0, 0, 150, 50, {stroke: corObst, fill: corObst}),
          {corImgEspecial: color("green"), corImgMorto: color("white")},
          {qtdAndarX: 0, qtdAndarY: 0, tipoAndar: Andar.INVERTER_QTDANDAR_NAO_SAIR_TELA},
          this._personagemPrincipal, 20
        ));
        controladoresObstaculosLvAtual[0].adicionarObstaculo(0, this._conjuntoObjetosTela, 50, 100);

      // tiros tela
        controladoresTirosLvAtual = new Array(1);
        controladoresTirosLvAtual[0] = new ControladorTiros(null, false);

        break;
    }

    // para que inimigo nao atire tao rapido
    this._auxAtirarInim = 0;

    //colocar tudo na tela depois que jah criou tudo
    if (controladoresInimigosLvAtual != null)
      this._controladoresInimigos = controladoresInimigosLvAtual;
    if (controladoresObstaculosLvAtual != null)
      this._controladoresObstaculos = controladoresObstaculosLvAtual;
    if (controladoresTirosLvAtual != null)
      this._controladoresTiros = controladoresTirosLvAtual;
    this._atualizarConjuntoObjetosTela();

    // tira o "Level X" da tela
    let t = this;
    setTimeout(function(){t._passandoLevel = false;}, 3000);
  }
  _atualizarConjuntoObjetosTela()
  {
    this._conjuntoObjetosTela =
      {
        pers: this._personagemPrincipal,
        controladoresInimigos: this._controladoresInimigos,
        controladoresObstaculos: this._controladoresObstaculos,
        controladoresTirosJogo: this._controladoresTiros
      };
  }
  //passar de level
  _passarLevel()
  {
    this._level++;
    this._iniciarLevel();
  }

  //FUNCIONALIDADES PROGRAMA FAZ SOZINHO
  //ANDAR ObjetosTela que se movem sozinho:
  //tiros
  _andarTiros()
  {
    //tiros do controlador jogo
    for (let i = 0; i<this._controladoresTiros; i++)
      this._controladoresTiros[i].andarTiros(this._conjuntoObjetosTela);

    //tiros do personagem
    this._personagemPrincipal.controladorTiros.andarTiros(this._conjuntoObjetosTela);

    //tiros dos inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarTirosTodosInim(this._conjuntoObjetosTela);
  }
  //inimigos e obstaculos
  _andarInimObst()
  {
    //andar obstaculos
    for (let i = 0; i<this._controladoresObstaculos.length; i++)
      this._controladoresObstaculos[i].andarObstaculos(this._conjuntoObjetosTela, i);

    //andar inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarInimigos(this._personagemPrincipal, this._controladoresTiros);
  }
  //inimigos atirarem
  _atirarInimigos()
  {
    this._auxAtirarInim++;

    // para que inimigo nao atire tao constantemente
    if (this._auxAtirarInim >= 1000)//8) aqui
    {
      for(let i = 0; i<this._controladoresInimigos.length; i++)
        this._controladoresInimigos[i].atirarTodosInim(this._conjuntoObjetosTela);

      this._auxAtirarInim = 0;
    }
  }


  //FUNCINALIDADES PERSONAGEM
  andarPers(direcaoX, direcaoY) //setinhas
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.andar(direcaoX, direcaoY, this._conjuntoObjetosTela);
  }
  atirar() //espaco
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.atirar(this._conjuntoObjetosTela, Direcao.Cima);
  }
  mudarPausado() //enter
  {
    if (this._estadoJogo == EstadoJogo.Pausado)
    {
      this._estadoJogo = this._estadoJogoAnterior;
      this._estadoJogoAnterior = null;
    }else
    {
      this._estadoJogoAnterior = this._estadoJogo;
      this._estadoJogo = EstadoJogo.Pausado;
    }
  }


  //draw
  draw()
  {
    if (this._estadoJogo == EstadoJogo.NaoComecou)
    {
      // TODO : design
      background(255);
      stroke(0);
      fill(0);
      textSize(40);
      text("Pressione [ESC] para começar a jogar", 50, 50);
      return;
    }
    if (this._estadoJogo == EstadoJogo.Pausado) //pausa-se com [ENTER]
    {
      // TODO : design
      //deixa o que estava na tela de fundo mesmo
      stroke(0);
      fill(0);
      textSize(40);
      text("PAUSADO: Pressione [ENTER] para despausar", 50, 50);
      return;
    }else
    if (this._estadoJogo == EstadoJogo.Ganhou)
    {
      // TODO : design (falar que ele passou todas as fases ateh ultima fase existente)
      return;
    }else
    if (this._estadoJogo == EstadoJogo.Morto) //animacao dele morrendo
    {
      // TODO : animacao dele morrendo (ideia: acabar com os tiros dele e continuar o jogo "normal" com uma animacao dele morrendo e colocar na tela depois que ele MORREU)
      alert("Voce morreu!");
      location.reload();
      return;
    }

    //daqui pra baixo this._estadoJogo == EstadoJogo.Jogando

    background(100);

    // desenha os inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      this._controladoresInimigos[i].draw(this._controladoresTiros);

    // desenha os obstaculos
    for (let i = 0; i<this._controladoresObstaculos.length; i++)
    //desenha todos os obstaculos desse controlador
      this._controladoresObstaculos[i].draw();

    //desenha o personagem, os tiros dele e a vida
    this._personagemPrincipal.draw();

    if (this._passandoLevel)
    {
      textSize(40);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Level " + this._level, width/2, height/2);
      textAlign(LEFT, BASELINE);
    }


    // daqui pra baixo eh nao grafico...
    this._andarTiros();
    this._atirarInimigos();
    this._andarInimObst();

    if (this._acabouLevel())
      this._passarLevel();
    else
      this._fazerProcLevel();

    if (!this._personagemPrincipal.vivo)
      this._estadoJogo = EstadoJogo.Morto;
  }

  _fazerProcLevel()
  {
    //fazer alguma coisa dependendo do level
    switch (this._level)
    {
      case 1:
        break;
    }
  }

  _acabouLevel()
  {
    //verificar se o level jah acabou
    switch (this._level)
    {
      case 1:
        //return !this._controladoresInimigos[0].algumVivo(); aqui
      default:
        return false;
    }

    return false;
  }
}
