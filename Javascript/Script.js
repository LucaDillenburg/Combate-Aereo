//import "ControladorJogo.js"; //tudo dentro disso

//colocar eventos no formulario
window.addEventListener("onload", setup);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

var controladorJogo;

const tamStroke = 1.5;
const frameRatePadrao = 50;
const heightVidaUsuario = 30;

// The statements in the setup() function executes once when the program begins
function setup()
{
  // createCanvas must be the first statement
  createCanvas(window.innerWidth-20, window.innerHeight-20);
  frameRate(frameRatePadrao);

  strokeWeight(tamStroke);

  controladorJogo = new ControladorJogo();
}

// The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
//FRAME RATE diz de quanto em quanto tempo draw() deve ser executado
function draw()
{ controladorJogo.draw(); }

//funcoes teclado
var keys = [];
function keyDown(event)
{
  if (controladorJogo.estadoJogo == EstadoJogo.NaoComecou)
  {
    if (event.key == "Escape")
    {
      alert("Começar o Jogo!");
      controladorJogo.comecarJogo();
    }
  }else
  {
    //mostra que usuário está clicando naquela tecla
    keys[event.key] = true;

  //ANDAR
    //direcao X
    let direcaoX = null;
    if (keys["ArrowRight"])
      direcaoX = Direcao.Direita;
    else
    if(keys["ArrowLeft"])
      direcaoX = Direcao.Esquerda;

    //direcao Y
    let direcaoY = null;
    if (keys["ArrowUp"])
      direcaoX = Direcao.Cima;
    else
    if(keys["ArrowDown"])
      direcaoX = Direcao.Baixo;

    controladorJogo.andarPers(direcaoX, direcaoY);

    //atirar
    if (keys[" "]) //espaco
      controladorJogo.atirar();

    //pausar
    if (event.key == "Enter")
      controladorJogo.mudarPausado();
  }
}
function keyUp(event)
{
    //mostra que usuário não está mais clicando naquela tecla
    keys[event.key] = false;
}
