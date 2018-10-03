const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3};
const Direcao = {"Direita":1, "Esquerda":2, "Cima":3, "Baixo":4};

const heightVidaUsuario = 30;
class ControladorJogo
{
  constructor()
  {
    this._personagemPrincipal = null;
    this._inimigos = null;
    this._obstaculos = null;
    this._tiros = null;

    this._estadoJogo = EstadoJogo.NaoComecou;
    this._level = 1;
    this._passandoLevel = false;
  }

  //get EstadoJogo
  get estadoJogo()
  { return this._estadoJogo; }

  //inicializacao
  comecarJogo()
  {
    let tamPersPrinc = 30;

    //                                                 (x,                      y,           tamLado       qtdAndar, cor,               vida,
    this._personagemPrincipal = new PersonagemPrincipal((width-tamPersPrinc)/2, 0.75*height, tamPersPrinc, 8,        color(0, 51, 153), 100,
    //widthTiroPadrao, heightTiroPadrao, corTiroPadrao,   qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao)
      5,               8,                color(0, 0, 102), 0,                  -15,                 5);

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

        //                              (x,                     y,               width,      height,     cor,
        this._inimigos[0] = new Inimigo((width - tamInimigo)/2, tamInimigo + 10, tamInimigo, tamInimigo, color("red"),
        //vida, corVida,      widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao)
          250,  color("red"), 5,               5,                color("red"),  0,                   0,                   0);
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
  andarPers(direcao)
  {
    switch (direcao)
    {
      case Direcao.Cima:
        this._personagemPrincipal.andarY(false);
        break;
      case Direcao.Baixo:
        this._personagemPrincipal.andarY(true);
        break;
      case Direcao.Direita:
        this._personagemPrincipal.andarX(true);
        break;
      case Direcao.Esquerda:
        this._personagemPrincipal.andarX(false);
        break;
    }
  }
  atirar()
  {
    this._personagemPrincipal.adicionarTiro();
  }


  //draw
  draw()
  {
    if (this._estadoJogo == EstadoJogo.NaoComecou)
    {
      background(255);
      fill(0);
      text("Pressione [ESC] para começar a jogar", 50, 50);
      return;
    }
    if (this._estadoJogo == EstadoJogo.Pausado) //pausa-se com [ENTER]
    {

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

    this._colocacarVidaUsuarioTela();

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

  _colocacarVidaUsuarioTela()
  {
    stroke(0);
    fill(color("black"));
    rect(0, height - heightVidaUsuario, width, heightVidaUsuario);

    noStroke(0);
    fill(color("green"));
    rect(0, height - heightVidaUsuario, width*(this._personagemPrincipal._vida/this._personagemPrincipal._vidaMAX), heightVidaUsuario);

    fill(0);
    let fontSize = 22;
    textSize(fontSize);
    text("Vida: " + this._personagemPrincipal._vida + "/" + this._personagemPrincipal._vidaMAX, 5, height - heightVidaUsuario + fontSize);
  }
}
