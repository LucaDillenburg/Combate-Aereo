//import "ControladorJogo.js"; //tudo dentro disso

//colocar eventos no formulario
window.addEventListener("load", setup);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

var controladorJogo;

const tamStroke = 1.5;
const frameRatePadrao = 40;
const heightVidaUsuario = 30;

// The statements in the setup() function executes once when the program begins
function setup()
{
  // createCanvas must be the first statement
  createCanvas(window.innerWidth-20, window.innerHeight-20);
  background(0);
  frameRate(frameRatePadrao);

  strokeWeight(tamStroke);

  controladorJogo = new ControladorJogo();
}

// The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
//FRAME RATE diz de quanto em quanto tempo draw() deve ser executado
function draw()
{
//ANDAR
  //direcao X
  let direcaoX = null;
  if (keys["ArrowRight"] === on)
    direcaoX = Direcao.Direita;
  else
  if(keys["ArrowLeft"] === on)
    direcaoX = Direcao.Esquerda;

  //direcao Y
  let direcaoY = null;
  if (keys["ArrowUp"] === on)
    direcaoY = Direcao.Cima;
  else
  if(keys["ArrowDown"] === on)
    direcaoY = Direcao.Baixo;

  controladorJogo.andarPers(direcaoX, direcaoY);

//ATIRAR
  //if (keys[" "]) /*espaco*/ atirar automatico
    controladorJogo.atirar();

  //DESENHAR
  controladorJogo.draw();
}

//funcoes teclado
var keys = [];
const on = 1;
const off = 0;
const option = 2;
//quando a setinha de baixo estah pressionada e entao pressiona-se a setinha de cima, a setinha de cima fica com ON e a de baixo com OPTION
// (quando a de cima sair e a de baixo for OPTION, ela ficara ON)
function keyDown(event)
{
  if (event.repeat) return;

  if (controladorJogo.estadoJogo === EstadoJogo.NaoComecou)
  {
    if (event.key === "Escape")
    {
      alert("Começar o Jogo!");
      controladorJogo.comecarJogo();
    }
  }else
  {
    if (event.key === "Enter") //pausar
      controladorJogo.mudarPausado();
    else
    if (event.key === "q" || event.key === "Q") //pocao
      controladorJogo.ativarPocaoPers();
    else

    //direcao tiro pers (verifica se personagem jah estah com nave especial)
    if (event.key === "w" || event.key === "W") //para cima
      controladorJogo.mudarDirecaoTiroSaiPers(Direcao.Cima);
    else
    if (event.key === "d" || event.key === "D") //para direita
      controladorJogo.mudarDirecaoTiroSaiPers(Direcao.Direita);
    else
    if (event.key === "s" || event.key === "S") //para baixo
      controladorJogo.mudarDirecaoTiroSaiPers(Direcao.Baixo);
    else
    if (event.key === "a" || event.key === "A") //para esquerda
      controladorJogo.mudarDirecaoTiroSaiPers(Direcao.Esquerda);

    else
      //mostra que usuário está clicando naquela tecla
      acionarKey(event.key);
  }
}
function acionarKey(key)
{
  if (!ehKeyValida(key) || keys[key] === on)// || (ke ===  " && keys[" "])) atirar automatico
    return;

  /*atirar automatico
  if (key === " ") //espaco
    keys[" "] = true;
  else */
  {
    //acionar key
    keys[key] = on;

    //desacionar chaves contrarias
    switch (key)
    {
        case "ArrowRight":
        //Explicacao: se clicou na setinha da direita, o da esquerda eh desativado
        // (porem deixa-se o em OPTION se o da direita for desapertado, o da esquerda fica ON de novo)
          if (keys["ArrowLeft"] === on)
            keys["ArrowLeft"] = option;
          break;
        case "ArrowLeft":
          if (keys["ArrowRight"] === on)
            keys["ArrowRight"] = option;
          break;
        case "ArrowUp":
          if (keys["ArrowDown"] === on)
            keys["ArrowDown"] = option;
          break;
        case "ArrowDown":
          if (keys["ArrowUp"] === on)
            keys["ArrowUp"] = option;
          break;
    }
  }
}
function ehKeyValida(key)
{
  //keys validas: setinhas e espaco (Enter eh tratado em outro lugar)
  return key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown";// || key === " "; atirar automatico
}
function keyUp(event)
{
  if (!ehKeyValida(event.key))
    return;

  //mostra que usuário não está mais clicando naquela tecla
  desacionarKey(event.key);
}
function desacionarKey(key)
{
  if (key === " ")
    keys[" "] = false;
  else
  {
    keys[key] = off;

    //desacionar reativar chaves contrarias que estavam ativadas
    switch (key)
    {
        case "ArrowRight":
        //Explicacao: se desapertou clicou na setinha da direita, o da esquerda eh desativado
        // (porem deixa-se o em OPTION se o da direita for desapertado, o da esquerda fica ON de novo)
          if (keys["ArrowLeft"] === option)
            keys["ArrowLeft"] = on;
          break;
        case "ArrowLeft":
          if (keys["ArrowRight"] === option)
            keys["ArrowRight"] = on;
          break;
        case "ArrowUp":
          if (keys["ArrowDown"] === option)
            keys["ArrowDown"] = on;
          break;
        case "ArrowDown":
          if (keys["ArrowUp"] === option)
            keys["ArrowUp"] = on;
          break;
    }
  }
}
