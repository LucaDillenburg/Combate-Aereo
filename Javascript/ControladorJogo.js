const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3};

const heightVidaUsuario = 30;
class ControladorJogo
{
  constructor()
  {
    this._personagemPrincipal = null;
    this._inimigos = null;
    this._obstaculos = null;
    this._controladorTiros = null;

    this._estadoJogo = EstadoJogo.NaoComecou;
    this._estadoJogoAnterior = null;

    this._level = 1;
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
    this._inimigos = null;
    this._obstaculos = null;

    switch(this._level)
    {
      case 1:
        this._inimigos = new Array(1);
        let tamInimigo = 50;
        let corInim = color("red");

        let formaInimigo = new Quadrado(0, 0, tamInimigo, corInim, corInim, null);

        this._inimigos[0] = new Inimigo(formaInimigo, 250, corInim, null, 8, false);
        break;
    }

    setTimeout(function() {this._passandoLevel = false;}, 3000);
  }
  //passar de level
  _passarLevel()
  {
    this._level++;
    this._iniciarLevel();
  }


  //JOGO
  //andar tiros
  _andarTiros()
  {
    //desenha o personagem e os tiros dele
    this._personagemPrincipal.andarTiros(this._personagemPrincipal, this._obstaculos, this._inimigos);

    if (this._inimigos != null)
      for (let i = 0; i<this._inimigos.length; i++)
        this._inimigos[i].andarTiros(this._personagemPrincipal, this._obstaculos, this._inimigos);
  }


  //funcionalidades personagem
  andarPers(direcaoX, direcaoY) //setinhas
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.andar(direcaoX, direcaoY, this._obstaculos, this._inimigos, this._controladorTiros);
  }
  atirar() //espaco
  {
    this._personagemPrincipal.adicionarTiro();
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
      background(255);
      stroke(0);
      fill(0);
      textSize(40);
      text("Pressione [ESC] para começar a jogar", 50, 50);
      return;
    }
    if (this._estadoJogo == EstadoJogo.Pausado) //pausa-se com [ENTER]
    {
      //deixa o que estava na tela de fundo mesmo
      stroke(0);
      fill(0);
      textSize(40);
      text("PAUSADO: Pressione [ENTER] para despausar", 50, 50);
      return;
    }
    if (this._estadoJogo == EstadoJogo.Morto) //animacao dele morrendo
    {

      return;
    }

    //daqui pra baixo this._estadoJogo == EstadoJogo.Jogando

    background(100);

    //desenha o personagem e os tiros dele
    this._personagemPrincipal.draw();

    if (this._inimigos != null)
      for (let i = 0; i<this._inimigos.length; i++)
        this._inimigos[i].draw();

    if (this._obstaculos != null)
      for (let i = 0; i<this._obstaculos.length; i++)
        this._obstaculos[i].draw();

    this._andarTiros();

    if (this._passandoLevel)
    {
      textSize(40);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Level " + this._level, width/2, height/2);
      textAlign(LEFT, BASELINE);
    }

    this._personagemPrincipal.colocacarVidaTela();

    if (this._acabouLevel())
      this._passarLevel();
    else
    {
      //fazer alguma coisa dependendo do level
      switch (this._level)
      {
        case 1:
          break;
      }
    }
  }

  _acabouLevel()
  {
    //verificar se o level jah acabou
    switch (this._level)
    {
      case 1:
        return this._inimigos[0].vida <= 0;
      default:
        return false;
    }
  }
}
