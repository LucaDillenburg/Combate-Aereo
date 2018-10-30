// import "ObjetosSimples.js"; jah foi importado por OutrosControladores.js e ObjetosComplexos.js
//import "ObjetosComplexos.js";
// import "OutrosControladores.js"; jah foi importado por ObjetosComplexos.js
// import "ListaDuplamenteLigada.js"; jah foi importado

const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3};

//const heightVidaUsuario estah em geometria basica
class ControladorJogo
{
  constructor()
  {
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
    let forma = new Quadrado(0, 0, tamPer, corPers, corPers, null);

    let pers = new PersonagemPrincipal(forma, 100, ControladorJogo.tiroPersPadrao, 8);
    pers.colocarLugarInicial();
    return
  }
  static tiroPersPadrao()
  {
    let corTiro = color(0, 0, 102);
    let tiro = new Tiro(new Retangulo(0, 0, 5, 8, corTiro, corTiro, null),
                    {fill: color("black"), stroke: color("black")}, 0, -15, true, 5);
    tiro.colocarNoMeioX();
    return tiro;
  }

  //inicializacao
  comecarJogo()
  {
    this._personagemPrincipal = ControladorJogo.personagemPrincPadrao();

    this._level = 1;
    this._iniciarLevel();
    this._estadoJogo = EstadoJogo.Jogando;
  }
  //inicializar level
  _iniciarLevel()
  {
    this._passandoLevel = true;

    //mudar : this._controladoesInimigos, this._controladoresObstaculos, this._controladoresTiros
    // ATENCAO: NENHUM DESSES MEMBROS PODEM SER NULOS, POREM PODEM SER UM ARRAY DE ZERO POSICOES
    //  (exceto this._controladoresTiros que tem que ter no minimo 1 posicao)

    //TODO: DEFINIR COMO CADA LEVEL VAI SER
      //1. Um inimigo central que se mexe de um lado para o outro atirando e obstaculos com vida passando da esquerda para a direita (saindo da tela)
      //2. mais inimigos nao essenciais
    switch(this._level)
    {
      case 1:
      // inimigos
        // TODO :
        this._controladoresInimigos = new Array(1);

        let tamInimigo = 50;
        let corInim = color("red");
        let formaInimigo = new Quadrado(0, 0, tamInimigo, corInim, corInim, null);

        this.controladoresInimigos[0] = new ControladorInimigos(new Inimigo(formaInimigo, color("black"), 250, corInim, null, 8, false));

      // obstaculos
        // TODO :
      // tiros tela
        // TODO :
        break;
    }

    // tira o "Level X" da tela
    let t = this;
    setTimeout(function(){t._passandoLevel = false;}, 3000);
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
      this._controladoresTiros[i].andarTiros(this._personagemPrincipal, this._controladoresObstaculos,
        this._controladoresInimigos, this._controladoresTiros);

    //tiros do personagem
    this._personagemPrincipal.controladorTiros.andarTiros(this._personagemPrincipal, this._controladoresObstaculos,
      this._controladoresInimigos, this._controladoresTiros);

    //tiros dos inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarTirosTodosInim(this._personagemPrincipal, this._controladoresInimigos,
        this._controladoresInimigos, this._controladoresTiros);
  }
  //inimigos e obstaculos
  _andarInimObst()
  {
    //andar obstaculos
    for (let i = 0; i<this._controladoresObstaculos.length; i++)
      this._controladoresObstaculos[i].andarObstaculos(i, this._personagemPrincipal,
        this._controladoresObstaculos, this._controladoresInimigos, this._controladoresTiros);

    //andar inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarInimigos(this._personagemPrincipal, this._controladoresTirosJogo);
  }


  //FUNCINALIDADES PERSONAGEM
  andarPers(direcaoX, direcaoY) //setinhas
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.andar(direcaoX, direcaoY, this._controladoresObstaculos, this._controladoresInimigos, this._controladoresTiros);
  }
  atirar() //espaco
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.atirar(this._personagemPrincipal, this._controladoresObstaculos, this._controladoresInimigos,
        Direcao.Cima);
  }
  mudarPausado() //enter
  {
    if (this._estadoJogo == EstadoJogo.Pausado)
    {
      this._estadoJogo = this._estadoJogoAnterior;
      this._estadoJogoAnterior = null;
    }else
    {
      this._estadoJogoAnterior = this._estadoJogo;l
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
    }
    if (this._estadoJogo == EstadoJogo.Morto) //animacao dele morrendo
    {
      // TODO : animacao dele morrendo
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
        return !this._controladoresInimigos[0].algumVivo();
      default:
        return false;
    }
  }
}
