//import "ObjetosComplexos.js";
//import "Outros.js"
// import "OutrosControladores.js"; jah foi importado por ObjetosComplexos.js
// import "ListaDuplamenteLigada.js"; jah foi importado
// import "ObjetosSimples.js"; jah foi importado por OutrosControladores.js e ObjetosComplexos.js

const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3, "Ganhou": 4};

//const heightVidaUsuario estah em geometria basica
class ControladorJogo
{
  constructor()
  {
    //futuros atributos: this._level, this._colocarLvXTela, this._personagemPrincipal, this._controladoresInimigos, this._controladoresObstaculos, this._controladoresTiros, this._controladorPocaoTela, this._controladorTimers

    this._estadoJogo = EstadoJogo.NaoComecou;
    //outro futuro atributo: this._estadoJogoAnterior
  }

  //get EstadoJogo
  get estadoJogo()
  { return this._estadoJogo; }

  static infoPersonagemPrincPadrao()
  {
    const corPers = color(0, 51, 153);

    //InfoPersonagemPrincipal: formaGeometrica, corImgMorto, vida, infoTiroPadrao, qtdAndar
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();
    infoPersonagemPrincipal.formaGeometrica = new Quadrado(null,null, 30, {stroke: corPers, fill: corPers});
    infoPersonagemPrincipal.corImgMorto = {stroke: color("black"), fill: color("black")};
    infoPersonagemPrincipal.vida = 100;
    infoPersonagemPrincipal.infoTiroPadrao = ControladorJogo.infoTiroPersPadrao();
    infoPersonagemPrincipal.qtdAndar = 10;

    return infoPersonagemPrincipal;
  }
  static infoTiroPersPadrao()
  {
    const corTiro = color(0, 0, 102);

    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroPersPadrao = new InfoTiro();
    infoTiroPersPadrao.formaGeometrica = new Retangulo(null,null, 5, 8, {fill: corTiro, stroke: corTiro});
    infoTiroPersPadrao.corImgMorto = {fill: color("black"), stroke: color("black")};
    infoTiroPersPadrao.infoAndar = new InfoAndar(0, -18, TipoAndar.Normal);
    infoTiroPersPadrao.ehDoPers = true;
    infoTiroPersPadrao.mortalidade = 5;

    return infoTiroPersPadrao;
  }
  static infoTiroMissilPers()
  {
    const corTiro = color("white");

    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoMissil = new InfoTiro();
    infoMissil.formaGeometrica = new Retangulo(null,null, 6, 10, {fill: corTiro, stroke: corTiro});
    infoMissil.corImgMorto = {fill: color("black"), stroke: color("black")};
    infoMissil.infoAndar = new InfoAndar(0, -10, TipoAndar.SeguirInimMaisProx);
    infoMissil.ehDoPers = true;
    infoMissil.mortalidade = 20;

    return infoMissil;
  }

  static infoTiroInim()
  {
    const corTiro = color("red");

    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroInim = new InfoTiro();
    infoTiroInim.formaGeometrica = new Retangulo(null,null, 2.7, 5, {fill: corTiro, stroke: corTiro});
    infoTiroInim.corImgMorto = {fill: color("black"), stroke: color("black")};
    infoTiroInim.infoAndar = new InfoAndar(0, 13, TipoAndar.DirecaoPers);
    infoTiroInim.ehDoPers = false;
    infoTiroInim.mortalidade = 3;

    return infoTiroInim;
  }
  static infoTiroTela()
  {
    const corTiro = color("black");

    //InfoTiroPadrao: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroTela = new InfoTiro();
    infoTiroTela.formaGeometrica = new Retangulo(null,null, 25, 25, {fill: corTiro, stroke: corTiro});
    infoTiroTela.corImgMorto = {fill: color("white"), stroke: color("white")};
    infoTiroTela.infoAndar = new InfoAndar(6, 0, TipoAndar.Normal);
    infoTiroTela.ehDoPers = false;
    infoTiroTela.mortalidade = 3;

    return infoTiroTela;
  }

  //inicializacao
  comecarJogo()
  {
    //personagem (1 pra todos os levels)
    this._personagemPrincipal = new PersonagemPrincipal(ControladorJogo.infoPersonagemPrincPadrao());
    this._personagemPrincipal.colocarLugarInicial();
    ConjuntoObjetosTela.adicionarPersonagem(this._personagemPrincipal);

    //controlador pocao (1 pra todos os levels)
    this._controladorPocaoTela = new ControladorPocaoTela();
    ConjuntoObjetosTela.adicionarControladorPocaoTela(this._controladorPocaoTela);

    //controlador timers (1 para todo os levels)
    this._controladorTimers = new ControladorTimersLevel();

    //let's start baby...
    this._level = 1;
    this._iniciarLevel();
    this._estadoJogo = EstadoJogo.Jogando;
  }
  //inicializar level
  _iniciarLevel()
  {
    this._criandoLevel = true;
    this._colocarLvXTela = true; // para colocar "Level X" na tela

    //zerar tudo
    this._controladoresInimigos = [];
    this._controladoresObstaculos = [];
    this._controladoresTiros = [];
    this._atualizarConjuntoObjetosTela();

    //mudar : this._controladoresInimigos, this._controladoresObstaculos, this._controladoresTiros
    // ATENCAO: NENHUM DESSES MEMBROS PODEM SER NULOS, POREM PODEM SER UM ARRAY DE ZERO POSICOES
    //  (exceto this._controladoresTiros que tem que ter no minimo 1 posicao)

    //TODO: DEFINIR COMO CADA LEVEL VAI SER
      //1. Um inimigo central que se mexe de um lado para o outro atirando e obstaculos com vida passando da esquerda para a direita (saindo da tela)
      //2. mais inimigos nao essenciais

    switch(this._level)
    {
      case 1:
      // inimigos
        //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, [porcentagemTempoVida], infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar
        //Inimigo 1
        const corInim = color("red");
        let infoInim1 = new InfoInimigo();
        infoInim1.formaGeometrica = new Quadrado(null,null, 50, {stroke: corInim, fill: corInim});
        infoInim1.corImgMorto = {stroke: color("black"), fill: color("black")};
        infoInim1.vida = 350;
        infoInim1.corVida = corInim;
        infoInim1.mostrarVidaSempre = true;
        infoInim1.infoTiroPadrao = ControladorJogo.infoTiroInim();
        infoInim1.freqTiro = 10;
        infoInim1.podeAtirarQualquerLado = false;
        infoInim1.qtdTiraVidaPersQndIntersec = 2;
        infoInim1.infoAndar = new InfoAndar(0, 0, TipoAndar.NaoSairTelaInvTudo);
        this._controladoresInimigos[0] = new ControladorInimigos(infoInim1, 0, true); //sao inimigos essenciais
        this._controladoresInimigos[0].adicionarInimigo({posicaoX: PosicaoX.Meio, y: 20});


      // obstaculos
        //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers
        const corObst = color("black");
        let infoObst1 = new InfoObstaculo();
        infoObst1.formaGeometrica = new Retangulo(null,null, 25, 200, {stroke: corObst, fill: corObst});
        infoObst1.corImgMorto = {stroke: color("white"), fill: color("white")};
        infoObst1.corImgEspecial = {stroke: color("green"), fill: color("green")};
        infoObst1.infoAndar = new InfoAndar(2, 2, TipoAndar.NaoSairTelaInvDir);
        infoObst1.qtdTiraVidaNaoConsegueEmpurrarPers = 10;
        this._controladoresObstaculos[0] = new ControladorObstaculos(infoObst1, 0);
        this._controladoresObstaculos[0].adicionarObstaculo({posicaoY: PosicaoY.Meio, posicaoX: PosicaoX.Meio});


      // tiros tela (soh pra ter onde colocar os tiros dos inimigos que morrerem)
        //para tiros de inimigos que morrem
        this._controladoresTiros[0] = new ControladorTiros(null, false);
        //tiros tela propriamente dito
        this._controladoresTiros[1] = new ControladorTiros(ControladorJogo.infoTiroTela(), false);


      // Timers
        const _this = this;
        const tmrTiros = new Timer(function()
        {
          _this._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeDireita, posicaoY: PosicaoY.Meio},
            undefined, Direcao.Esquerda);
          _this._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeEsquerda, posicaoY: PosicaoY.Meio},
            undefined, Direcao.Direita);
        }, 5000, false, true);
        this._controladorTimers.adicionarTimer(tmrTiros);
        break;

      case 10:
        //ganha nave espacial
        this._personagemPrincipal.colocarNaveEspecial(new Quadrado(null,null, 30, {stroke: color("white"), fill: color("white")}));
        break;

      default:
        this._controladoresInimigos = new Array(0);
        this._controladoresObstaculos = new Array(0);
        this._controladoresTiros = new Array(0);
        console.log("Acabaram as fases... vishh Luca tá fraco!!")
    }
    //colocar tudo na tela depois que jah criou tudo
    this._atualizarConjuntoObjetosTela();

    // programar para o "Level X" da tela desaparecer
    const _this = this;
    new Timer(function(){ _this._colocarLvXTela = false; }, 3000, false, false);

    this._criandoLevel = false;

    //POCAO
    //terah no maximo uma pocao por level:
    //esse metodo vai adicionar a pocao depois de certo tempo (depois de fazer a verificacao de se o level atual
    //tem pocoes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
    this._controladorPocaoTela.colocarPocaoEmTempoSeChance(this._level);
  }
  _atualizarConjuntoObjetosTela()
  { ConjuntoObjetosTela.adicionarNovoConjunto(this._controladoresInimigos, this._controladoresObstaculos, this._controladoresTiros); }
  //passar de level
  _passarLevel()
  {
    this._level++; //passa de level
    this._controladorTimers.excluirTimers(); //finaliza timers antigos e os exclui
    this._personagemPrincipal.mudarVida(ControladorJogo.qtdGanhaVidaLevel(this._level)); //personagem ganha vida
    this._iniciarLevel(); //proximo level
  }

  static qtdGanhaVidaLevel(level)
  {
    return Math.floor((level-1)/5)*2 + 3;
    // de  1 -  5: 3
    // de  6 - 10: 5
    // de 10 - 15: 7
  }
  static tempoEstimadoLevel(level)
  //retornar tempo em segundos
  {
    switch (level)
    {
      case 1: return ;
      case 2: return ;
      case 3: return ;
      case 4: return ;
      //...
      // TODO: se tiver mais levels colocar aqui
    }
  }

  //FUNCIONALIDADES PROGRAMA FAZ SOZINHO
  //ANDAR ObjetosTela que se movem sozinho:
  //tiros
  _andarTiros()
  {
    //tiros do controlador jogo
    for (let i = 0; i<this._controladoresTiros.length; i++)
      this._controladoresTiros[i].andarTiros();

    //tiros do personagem
    this._personagemPrincipal.controladorTiros.andarTiros();

    //tiros dos inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarTirosTodosInim();
  }
  //inimigos e obstaculos
  _andarInimObst()
  {
    //andar obstaculos
    for (let i = 0; i<this._controladoresObstaculos.length; i++)
      this._controladoresObstaculos[i].andarObstaculos(i);

    //andar inimigos
    for (let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].andarInimigos();
  }
  //inimigos atirarem
  _atirarInimigos()
  {
    for(let i = 0; i<this._controladoresInimigos.length; i++)
      this._controladoresInimigos[i].atirarTodosInim();
  }


  //FUNCINALIDADES PERSONAGEM
 //andar
  andarPers(direcaoX, direcaoY) //setinhas
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo === EstadoJogo.Jogando)
      this._personagemPrincipal.andar(direcaoX, direcaoY);
  }

 //tiro
  atirar() //espaco
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo === EstadoJogo.Jogando)
      this._personagemPrincipal.atirar(Direcao.Cima);
  }
  mudarDirecaoTiroSaiPers(direcao) //W: cima, D: direita, S: baixo, A: esquerda
  {
    if (this._estadoJogo === EstadoJogo.Jogando)
      this._personagemPrincipal.mudarDirecaoTiroSai(direcao);
      //verifica se estah com nave especial
  }

 //POCAO
  ativarPocaoPers() //Q
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo === EstadoJogo.Jogando)
      this._personagemPrincipal.controladorPocoesPegou.usarPocaoAtual();
  }

 //pausado/despausado
  mudarPausado() //enter
  {
    if (this._estadoJogo === EstadoJogo.Pausado)
    {
      this._estadoJogo = this._estadoJogoAnterior;
      delete this._estadoJogoAnterior;
    }else
    {
      this._estadoJogoAnterior = this._estadoJogo;
      this._estadoJogo = EstadoJogo.Pausado;
    }
  }


  //draw
  draw()
  {
    if (this._estadoJogo === EstadoJogo.NaoComecou)
    {
      // TODO : design
      background(255);
      stroke(0);
      fill(0);
      textSize(40);
      text("Pressione [ESC] para começar a jogar", 50, 50);
      return;
    }
    if (this._estadoJogo === EstadoJogo.Pausado) //pausa-se com [ENTER]
    {
      // TODO : design
      //deixa o que estava na tela de fundo mesmo
      stroke(0);
      fill(0);
      textSize(40);
      text("PAUSADO: Pressione [ENTER] para despausar", 50, 50);
      return;
    }else
    if (this._estadoJogo === EstadoJogo.Ganhou)
    {
      // TODO : design (falar que ele passou todas as fases ateh ultima fase existente)
      return;
    }else
    if (this._estadoJogo === EstadoJogo.Morto) //animacao dele morrendo
    {
      // TODO : animacao dele morrendo (ideia: acabar com os tiros dele e continuar o jogo "normal" com uma animacao dele morrendo e colocar na tela depois que ele MORREU)
      alert("Voce morreu!");
      location.reload();
      return;
    }

    //daqui pra baixo this._estadoJogo === EstadoJogo.Jogando

    background(100);

    if (this._criandoLevel)
    {
      //desenha o personagem, os tiros dele e a vida
      this._personagemPrincipal.draw();
      //tiros do personagem
      this._personagemPrincipal.controladorTiros.andarTiros();
      return;
    }

    //procedimento dos Timers
    ConjuntoTimers.procDraws();

    //nessa ordem especificamente
    this._andarInimObst();
    this._personagemPrincipal.procTirarVidaIntersecInim();

    // desenha os inimigos (do ultimo para o primeiro pois o primeiro eh mais importante)
    for (let i = this._controladoresInimigos.length-1; i >= 0; i--)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      this._controladoresInimigos[i].draw();

    // desenha os tiros do jogo
    for (let i = this._controladoresTiros.length-1; i >= 0; i--)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      this._controladoresTiros[i].draw();

    // desenha os obstaculos (do ultimo pro primeiro pois o primeiro eh mais importante)
    for (let i = this._controladoresObstaculos.length-1; i >= 0; i--)
    //desenha todos os obstaculos desse controlador
      this._controladoresObstaculos[i].draw();

    //desenha o personagem, os tiros dele e a vida
    this._personagemPrincipal.draw();

    if (this._colocarLvXTela)
    {
      textSize(40);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Level " + this._level, width/2, height/2);
      textAlign(LEFT, BASELINE);
    }

    this._andarTiros();
    this._atirarInimigos();

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
      case 2: //ultimo level
        return false;
      default:
        for (let i = 0; i<this._controladoresInimigos.length; i++)
          if (this._controladoresInimigos[i].ehDeInimigosEssenciais && this._controladoresInimigos[i].algumInimNaTela())
          //se ha algum inimigo essencial na tela, nao acabou
            return false;
        return true;
    }

    return false;
  }
}

//para nao precisar ficar passando conjuntoObjetosTela por parametro ou soh os necessarios (nao tem que ficar mudando os parametros sempre que precisa de mais um tipo de objetoTela)
class ConjuntoObjetosTela
//static class que armazena os controladoresInimigos, controladoresObstaculos, controladoresTirosJogo e pers
{
  //setter
  static adicionarPersonagem(pers)
  { ConjuntoObjetosTela._pers = pers; }

  static adicionarControladorPocaoTela(controladorPocaoTela)
  { ConjuntoObjetosTela._controladorPocaoTela = controladorPocaoTela; }

  static adicionarNovoConjunto(controladoresInimigos, controladoresObstaculos, controladoresTirosJogo)
  {
    //colocar os novos controladores e pers na classe
    ConjuntoObjetosTela._controladoresInimigos = controladoresInimigos;
    ConjuntoObjetosTela._controladoresObstaculos = controladoresObstaculos;
    ConjuntoObjetosTela._controladoresTirosJogo = controladoresTirosJogo;
  }

  //getters
  static get pers()
  { return ConjuntoObjetosTela._pers; }
  static get controladoresInimigos()
  { return ConjuntoObjetosTela._controladoresInimigos; }
  static get controladoresObstaculos()
  { return ConjuntoObjetosTela._controladoresObstaculos; }
  static get controladoresTirosJogo()
  { return ConjuntoObjetosTela._controladoresTirosJogo; }
  static get controladorPocaoTela()
  { return ConjuntoObjetosTela._controladorPocaoTela; }
}

class TipoObjetos
{
  //retorna o numero que representa o tipo do objeto
  static fromObj(obj)
  {
    if (obj instanceof Tiro)
      return TipoObjetos.Tiro;
    if (obj instanceof Obstaculo)
      return TipoObjetos.Obstaculo;
    if (obj instanceof Inimigo)
      return TipoObjetos.Inimigo;
    if (obj instanceof PersonagemPrincipal)
      return TipoObjetos.Personagem;
  }

  //getters ("constantes")
  static get Tiro()
  { return 1; }
  static get Obstaculo()
  { return 2; }
  static get Inimigo()
  { return 3; }
  static get Personagem()
  { return 4; }
}
