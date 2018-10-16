var EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3};
Object.freeze(EstadoJogo);
var Direcao = {"Direita":1, "Esquerda":2, "Cima":3, "Baixo":4};
Object.freeze(Direcao);

const heightVidaUsuario = 30;
class ControladorJogo
{
  constructor()
  {
    this._personagemPrincipal = null;
    this._inimigos = null;
    this._obstaculos = null;

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
                                                     //(x,                      y,           tamLado, 
    this._personagemPrincipal = new PersonagemPrincipal((width-tamPersPrinc)/2, 0.75*height, tamPersPrinc,
    //qtdAndar, cor,               vida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao,    qtdAndarTiro)
      8,        color(0, 51, 153), 100,  5,               8,                color(0, 0, 102), 15);

    this._level = 1;
    this.iniciarLevel();
    this._estadoJogo = EstadoJogo.Jogando;
  }
  //inicializar level
  iniciarLevel()
  {
    this._passandoLevel = true;
    this._inimigos = null;
    this._obstaculos = null;
    
    switch(this._level)
    {
      case 1:
        this._inimigos = new Array(1);
        let tamInimigo = 50;
        this._inimigos[0] = new Inimigo((width - tamInimigo)/2, tamInimigo + 10, tamInimigo, tamInimigo, color("red"), 250, color("red"), 5, 5, color("red"), 10);
        break;
    }
    
    setTimeout(this._auxPassandoLevel, 3000);
  }
  _auxPassandoLevel() { this._passandoLevel = false; }
  //passar de level


  //JOGO
  //andar tiros
  andarTiros()
  {
    //desenha o personagem e os tiros dele
    this._personagemPrincipal.andarTiros();

    if (this._inimigos != null)
      for (let i = 0; i<this._inimigos.length; i++)
        this._inimigos[i].andarTiros();
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
    switch (this._estadoJogo)
    {
      case EstadoJogo.NaoComecou:
        background(255);
        fill(0);
        text("Pressione [ESC] para começar a jogar", 50, 50);
        break;
      case EstadoJogo.Jogando:
        background(100);

        //desenha o personagem e os tiros dele
        this._personagemPrincipal.draw();

        if (this._inimigos != null)
          for (let i = 0; i<this._inimigos.length; i++)
            this._inimigos[i].draw();

        if (this._obstaculos != null)
          for (let i = 0; i<this._obstaculos.length; i++)
            this._obstaculos[i].draw();

        this.andarTiros();
        
        if (this._passandoLevel)
        {
          textSize(40);
          fill(0);
          textAlign(CENTER, CENTER);
          text("Level " + this._level, width/2, height/2);
          textAlign(LEFT, BASELINE);
        }

        this.colocacarVidaUsuarioTela();

        break;
      case EstadoJogo.Pausado:
        //pausa-se com [ENTER]
        break;
      case EstadoJogo.Morto:
        //animacao dele morrendo
        break;
    }
  }
    
  colocacarVidaUsuarioTela()
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
