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
    this._personagemPrincipal = null;
    this._controladoresInimigos = null;
    this._controladoresObstaculos = null;
    this._controladoresTiros = null;
    this._controladorPoderTela = null;
    //deixar posicao 0 para tiros de personagens que morrem

    this._estadoJogo = EstadoJogo.NaoComecou;
    this._estadoJogoAnterior = null;

    this._level = -1;
    this._passandoLevel = false;
  }

  //get EstadoJogo
  get estadoJogo()
  { return this._estadoJogo; }

  static infoPersonagemPrincPadrao()
  {
    let corPers = color(0, 51, 153);

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
    let corTiro = color(0, 0, 102);

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
    let corTiro = color("white");

    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoMissil = new InfoTiro();
    infoMissil.formaGeometrica = new Retangulo(null,null, 6, 10, {fill: corTiro, stroke: corTiro});
    infoMissil.corImgMorto = {fill: color("black"), stroke: color("black")};
    infoMissil.infoAndar = new InfoAndar(0, -10, TipoAndar.SeguirInimMaisProx);
    infoMissil.ehDoPers = true;
    infoMissil.mortalidade = 20;

    return infoMissil;
  }

  static infoTiroNaoPers()
  {
    let corTiro = color("red");

    //InfoTiroPadrao: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroNaoPers = new InfoTiro();
    infoTiroNaoPers.formaGeometrica = new Retangulo(null,null, 2.7, 5, {fill: corTiro, stroke: corTiro});
    infoTiroNaoPers.corImgMorto = {fill: color("black"), stroke: color("black")};
    infoTiroNaoPers.infoAndar = new InfoAndar(0, 13, TipoAndar.DirecaoPers);
    infoTiroNaoPers.ehDoPers = false;
    infoTiroNaoPers.mortalidade = 3;

    return infoTiroNaoPers;
  }

  //inicializacao
  comecarJogo()
  {
    this._personagemPrincipal = new PersonagemPrincipal(ControladorJogo.infoPersonagemPrincPadrao());
    this._personagemPrincipal.colocarLugarInicial();
    ConjuntoObjetosTela.adicionarPersonagem(this._personagemPrincipal);

    this._controladorPoderTela = new ControladorPoderTela();
    ConjuntoObjetosTela.adicionarControladorPoderTela(this._controladorPoderTela);

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

    // CRIAR CONTROLADORES
    let controladoresInimigosLvAtual,
        controladoresObstaculosLvAtual,
        controladoresTirosLvAtual;
    switch(this._level)
    {
      case 1:
      // inimigos
        controladoresInimigosLvAtual = new Array(1);

        //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, [porcTempoVida], infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar

        //Inimigo 1
        let corInim = color("red");
        let infoInim1 = new InfoInimigo();
        infoInim1.formaGeometrica = new Quadrado(null,null, 50, {stroke: corInim, fill: corInim});
        infoInim1.corImgMorto = {stroke: color("black"), fill: color("black")};
        infoInim1.vida = 350;
        infoInim1.corVida = corInim;
        infoInim1.mostrarVidaSempre = true;
        infoInim1.infoTiroPadrao = ControladorJogo.infoTiroNaoPers();
        infoInim1.freqTiro = 1000;//10;
        infoInim1.podeAtirarQualquerLado = false;
        infoInim1.qtdTiraVidaPersQndIntersec = 2;
        infoInim1.infoAndar = new InfoAndar(0, 0, TipoAndar.NaoSairTelaInvTudo);
        controladoresInimigosLvAtual[0] = new ControladorInimigos(infoInim1, true); //sao inimigos essenciais
        controladoresInimigosLvAtual[0].adicionarInimigo(0, {posicaoX: PosicaoX.Meio, y: 20});


      // obstaculos
        controladoresObstaculosLvAtual = new Array(1);

        //formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers
        let corObst = color("black");
        let infoObst1 = new InfoObstaculo();
        infoObst1.formaGeometrica = new Retangulo(null,null, 25, 200, {stroke: corObst, fill: corObst});
        infoObst1.corImgMorto = {stroke: color("white"), fill: color("white")};
        infoObst1.corImgEspecial = {stroke: color("green"), fill: color("green")};
        infoObst1.infoAndar = new InfoAndar(2, 2, TipoAndar.NaoSairTelaInvDir);
        infoObst1.qtdTiraVidaNaoConsegueEmpurrarPers = 10;
        controladoresObstaculosLvAtual[0] = new ControladorObstaculos(infoObst1);
        controladoresObstaculosLvAtual[0].adicionarObstaculo(0, {posicaoY: PosicaoY.Meio, posicaoX: PosicaoX.Meio});


      // tiros tela (soh pra ter onde colocar os tiros dos inimigos que morrerem)
        controladoresTirosLvAtual = new Array(1);
        controladoresTirosLvAtual[0] = new ControladorTiros(null, false);
        break;

      case 10:
        //ganha nave espacial
        this._personagemPrincipal.colocarNaveEspecial(new Quadrado(null,null, 30, {stroke: color("white"), fill: color("white")}));
        break;

      default:
        controladoresInimigosLvAtual = new Array(0);
        controladoresObstaculosLvAtual = new Array(0);
        controladoresTirosLvAtual = new Array(0);
        console.log("Acabaram as fases... vishh Luca tá fraco!!")
    }

    //colocar tudo na tela depois que jah criou tudo
    this._colocarControladoresThis(controladoresInimigosLvAtual, controladoresObstaculosLvAtual, controladoresTirosLvAtual);
    this._atualizarConjuntoObjetosTela();

    //terah no maximo um poder por level:
    //esse metodo vai adicionar o poder depois de certo tempo (depois de fazer a verificacao de se o level atual
    //tem poderes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
    this._controladorPoderTela.colocarPoderEmTempoSeChance(this._level);

    // tira o "Level X" da tela
    let _this = this;
    new Timer(function(){_this._passandoLevel = false;}, 3000, false, false);
  }
  _colocarControladoresThis(controladoresInimigosLvAtual, controladoresObstaculosLvAtual, controladoresTirosLvAtual)
  {
    this._controladoresInimigos = controladoresInimigosLvAtual;
    this._controladoresObstaculos = controladoresObstaculosLvAtual;
    this._controladoresTiros = controladoresTirosLvAtual;
  }
  _atualizarConjuntoObjetosTela()
  { ConjuntoObjetosTela.adicionarNovoConjunto(this._controladoresInimigos, this._controladoresObstaculos, this._controladoresTiros); }
  //passar de level

  _passarLevel()
  {
    this._level++;
    this._personagemPrincipal.mudarVida(ControladorJogo.qtdGanhaVidaLevel(this._level));
    this._iniciarLevel();
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
    for (let i = 0; i<this._controladoresTiros; i++)
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
      this._controladoresInimigos[i].andarInimigos(i);
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
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.andar(direcaoX, direcaoY);
  }

 //tiro
  atirar() //espaco
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.atirar(Direcao.Cima);
  }
  mudarDirecaoTiroSaiPers(direcao) //W: cima, D: direita, S: baixo, A: esquerda
  {
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.mudarDirecaoTiroSai(direcao);
      //verifica se estah com nave especial
  }

 //poder
  ativarPoderPers() //Q
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (this._estadoJogo == EstadoJogo.Jogando)
      this._personagemPrincipal.controladorPoderesPegou.usarPoderAtual();
  }

 //pausado/despausado
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

    //procedimento dos Timers
    ConjuntoTimers.procDraws();

    //nessa ordem especificamente
    this._andarInimObst();
    this._personagemPrincipal.procTirarVidaIntersecInim();

    // desenha os inimigos (do ultimo para o primeiro pois o primeiro eh mais importante)
    for (let i = this._controladoresInimigos.length-1; i >= 0; i--)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      this._controladoresInimigos[i].draw();

    // desenha os obstaculos (do ultimo pro primeiro pois o primeiro eh mais importante)
    for (let i = this._controladoresObstaculos.length-1; i >= 0; i--)
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

  static adicionarControladorPoderTela(controladorPoderTela)
  { ConjuntoObjetosTela._controladorPoderTela = controladorPoderTela; }

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
  static get controladorPoderTela()
  { return ConjuntoObjetosTela._controladorPoderTela; }
}
