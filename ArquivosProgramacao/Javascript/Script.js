//colocar eventos no formulario
window.addEventListener("load", setup);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

const tamStroke = 1.5;
const frameRatePadrao = 40;


// The statements in the setup() function executes once when the program begins
function setup()
{
  //cria canvas com tamanho minimo e sempre com as mesmas proporcoes (se o tamanho da tela atual for pequeno, cria maior)
  const medidasCanvas = getMedidasCanvas();
  createCanvas(medidasCanvas.width, medidasCanvas.height);

  //setar outras propriedades do canvas
  background(0);
  frameRate(frameRatePadrao);
  strokeWeight(tamStroke);
  noCursor();

  //carregar imagens: para otimizar
  ArmazenadorInfoObjetos.carregarImagens();

  //ControladorJogo (estrutura de tudo)
  ControladorJogo.inicializar(previaJogo);
}
//tamanho canvas
const proporcaoWidtHeight = 1.3;
const minimoWidthTela = 600;
const pxlsSobrandoTela = 20;
function getMedidasCanvas()
{
  //calcular width a partir da medida do width disponivel
  const widthCanvas1 = Math.max(window.innerWidth, minimoWidthTela) - pxlsSobrandoTela;

  //calcular width a partir do height
  const heightCanvas2 = window.innerHeight - pxlsSobrandoTela;
  //Regra de 3: [widthCanvas2] estah para [heightCanvas2] assim como [proporcaoWidtHeight] estah para 1
  const widthCanvas2 = heightCanvas2 * proporcaoWidtHeight;

  if (widthCanvas2 < widthCanvas1 && widthCanvas1 >= minimoWidthTela)
    return {width: widthCanvas2, height: heightCanvas2}
  else
  {
    //calcular height a partir de widthCanvas1
    //Regra de 3: [widthCanvas1] estah para [heightCanvas1] assim como [proporcaoWidtHeight] estah para 1
    return {width: widthCanvas1, height: widthCanvas1/proporcaoWidtHeight};
  }
}

// The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
//FRAME RATE diz de quanto em quanto tempo draw() deve ser executado
function draw()
{
 //ANDAR
  //direcao X
  let direcaoX = null;
  if (keys[Direcao.Direita] === on)
    direcaoX = Direcao.Direita;
  else
  if(keys[Direcao.Esquerda] === on)
    direcaoX = Direcao.Esquerda;

  //direcao Y
  let direcaoY = null;
  if (keys[Direcao.Cima] === on)
    direcaoY = Direcao.Cima;
  else
  if(keys[Direcao.Baixo] === on)
    direcaoY = Direcao.Baixo;

  ControladorJogo.andarPers(direcaoX, direcaoY);

  //DESENHAR
  ControladorJogo.draw();
}

//funcoes teclado
let keys = [];
const on = 1;
const off = 0;
const option = 2;
//quando a setinha de baixo estah pressionada e entao pressiona-se a setinha de cima, a setinha de cima fica com ON e a de baixo com OPTION
// (quando a de cima sair e a de baixo for OPTION, ela ficara ON)
function keyDown(event)
{
  if (event.repeat) return;

  if (ControladorJogo.estadoJogo === EstadoJogo.NaoComecou)
  {
    if (event.key === "Escape")
    {
      ControladorJogo.comecarJogo();
      addQndPerderFocoPausar();
    }
  }else
  {
    if (event.key === "Enter") //pausar
      ControladorJogo.mudarPausado();
    else
    if (event.key === "q" || event.key === "Q") //pocao
      ControladorJogo.ativarPocaoPers();
    else
    if (event.key === "e" || event.key === "E") //atirar nao automatico
      ControladorJogo.persPuxouGatilho();
    else
      //mostra que usuário está clicando naquela tecla
      acionarKey(event.key);
  }
}
function acionarKey(key)
{
  if (!ehKeyValida(key) || keys[key] === on) //se for uma tecla que nao faz nada ou uma tecla que jah esteja acionada
    return;

  //desacionar chaves contrarias e acionar a chave certa
  switch (key)
  {
    //Explicacao: se clicou na setinha da direita, o da esquerda eh desativado
    // (porem deixa-se o em OPTION se o da direita for desapertado, o da esquerda fica ON de novo)
      case "ArrowRight":
      case "d":
      case "D":
        keys[Direcao.Direita] = on; //aciona
        if (keys[Direcao.Esquerda] === on)
          keys[Direcao.Esquerda] = option; //desaciona oposta
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        keys[Direcao.Esquerda] = on; //aciona
        if (keys[Direcao.Direita] === on)
          keys[Direcao.Direita] = option; //desaciona oposta
        break;
      case "ArrowUp":
      case "w":
      case "W":
        keys[Direcao.Cima] = on; //aciona
        if (keys[Direcao.Baixo] === on)
          keys[Direcao.Baixo] = option; //desaciona oposta
        break;
      case "ArrowDown":
      case "s":
      case "S":
        keys[Direcao.Baixo] = on; //aciona
        if (keys[Direcao.Cima] === on)
          keys[Direcao.Cima] = option; //desaciona oposta
        break;
      default:
        keys[key] = on;
  }
}
function ehKeyValida(key)
{
  //keys validas: setinhas 1.0 e 2.0 (WADS)
  return key === "ArrowLeft" || key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown" ||  //mover personagem com setinhas
    key === "w" || key === "W" || key === "a" || key === "A" || key === "s" || key === "S" || key === "d" || key === "D"; //mover personagem com letras (WASD)
}
function keyUp(event)
{
  //mostra que usuário não está mais clicando naquela tecla
  //desacionar reativar chaves contrarias que estavam ativadas
  switch (event.key)
  {
    //Explicacao: se desapertou clicou na setinha da direita, o da esquerda eh desativado
    // (porem deixa-se o em OPTION se o da direita for desapertado, o da esquerda fica ON de novo)
    case "ArrowRight":
    case "d":
    case "D":
      keys[Direcao.Direita] = off; //desaciona
      if (keys[Direcao.Esquerda] === option)
        keys[Direcao.Esquerda] = on; //aciona oposta
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      keys[Direcao.Esquerda] = off; //desaciona
      if (keys[Direcao.Direita] === option)
        keys[Direcao.Direita] = on; //aciona oposta
      break;
    case "ArrowUp":
    case "w":
    case "W":
      keys[Direcao.Cima] = off; //desaciona
      if (keys[Direcao.Baixo] === option)
        keys[Direcao.Baixo] = on; //aciona oposta
      break;
    case "ArrowDown":
    case "s":
    case "S":
      keys[Direcao.Baixo] = off; //desaciona
      if (keys[Direcao.Cima] === option)
        keys[Direcao.Cima] = on; //aciona oposta
      break;
    default:
      keys[event.key] = off;
  }
}

//Pra pausar quando janela perder o foco:
function addQndPerderFocoPausar()
{
  document.getElementById("defaultCanvas0").addEventListener("focusout",
    function() { alert("saiu"); ControladorJogo.pausar(); });
}
