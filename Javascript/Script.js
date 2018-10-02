//colocar eventos no formulario
window.addEventListener("onload", setup);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);


var controladorJogo;

// The statements in the setup() function executes once when the program begins
function setup() {
  // createCanvas must be the first statement
  createCanvas(window.innerWidth-20, window.innerHeight-20);
  frameRate(50);
    
  controladorJogo = new ControladorJogo();
}

// The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
//FRAME RATE diz de quanto em quanto tempo draw() deve ser executado
function draw()
{
  controladorJogo.draw();
}

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
      
    //teclas Y
    if (keys["ArrowUp"])
      controladorJogo.andarPers(Direcao.Cima);
    else
    if(keys["ArrowDown"])
      controladorJogo.andarPers(Direcao.Baixo);

    //teclas X
    if (keys["ArrowRight"])
      controladorJogo.andarPers(Direcao.Direita);
    else
    if(keys["ArrowLeft"])
      controladorJogo.andarPers(Direcao.Esquerda);

    //espaco
    if (keys[" "]) //space
      controladorJogo.atirar();
  }
}
function keyUp(event)
{
    //mostra que usuário não está mais clicando naquela tecla
    keys[event.key] = false;
}

/*
function keyDown(event)
{
  event = event || window.event;
  if (event.key == "Escape" && controladorJogo.estadoJogo == EstadoJogo.NaoComecou)
  {
    alert("Começar o Jogo!");
    controladorJogo.comecarJogo();
  }
}
function keyPress(event)
{
  if (controladorJogo.estadoJogo == EstadoJogo.NaoComecou)
    return;

  //teclas Y
  if (event.key == "ArrowUp")
    controladorJogo.andarPers(Direcao.Cima);
  else
  if(event.key == "ArrowDown")
    controladorJogo.andarPers(Direcao.Baixo);

  //teclas X
  if (event.key == "ArrowRight")
    controladorJogo.andarPers(Direcao.Direita);
  else
  if(event.key == "ArrowLeft")
    controladorJogo.andarPers(Direcao.Esquerda);

  //espaco
  if (event.key == " ") //space
    controladorJogo.atirar();
}*/
