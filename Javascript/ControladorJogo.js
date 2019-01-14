const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3, "Ganhou": 4};

const testando = true;

// ControladorJogo eh static class porque sempre soh vai existir 1 e eh mais pratico (pq nao precisar ficar passando os objetoTela necessarios, nem level, estadoJogo e outros getters)
class ControladorJogo
{
  static inicializar()
  {
    ControladorJogo._estadoJogo = EstadoJogo.NaoComecou;
    //quando personagem mudar estado do jogo (pausar), novo atributo: ControladorJogo._estadoJogoAnterior

    //futuros atributos: ControladorJogo._level, ControladorJogo._colocarLvXTela, ControladorJogo._personagemPrincipal, ControladorJogo._controladoresInimigos, ControladorJogo._controladoresObstaculos, ControladorJogo._controladoresTiros, ControladorJogo._controladorPocaoTela
  }

 //GETTER
  // Atributos de Estado
  static get estadoJogo()
  { return ControladorJogo._estadoJogo; }
  static get criandoLevel()
  { return ControladorJogo._criandoLevel; }
  static get level()
  { return ControladorJogo._level; }
  // ObjetosTela
  static get pers()
  { return ControladorJogo._personagemPrincipal; }
  static get controladoresInimigos()
  { return ControladorJogo._controladoresInimigos; }
  static get controladoresObstaculos()
  { return ControladorJogo._controladoresObstaculos; }
  static get controladoresTirosJogo()
  { return ControladorJogo._controladoresTiros; }
  static get controladorPocaoTela()
  { return ControladorJogo._controladorPocaoTela; }
  static get oficina()
  { return ControladorJogo._oficina; }

  //inicializacao
  static comecarJogo()
  {
    //personagem (1 pra todos os levels)
    ControladorJogo._personagemPrincipal = new PersonagemPrincipal(ControladorJogo.infoPersonagemPrincPadrao());
    ControladorJogo._personagemPrincipal.colocarLugarInicial();

    //controlador pocao (1 pra todos os levels)
    ControladorJogo._controladorPocaoTela = new ControladorPocaoTela();

    //let's start baby...
    ControladorJogo._level = 1;
    ControladorJogo._iniciarLevel();
    ControladorJogo._estadoJogo = EstadoJogo.Jogando;
  }
  //inicializar level
  static _iniciarLevel()
  // retorna se ainda tem levels
  {
    ControladorJogo._criandoLevel = true;
    ControladorJogo._colocarLvXTela = true; // para colocar "Level X" na tela

    //zerar tudo
    ControladorJogo._controladoresInimigos = [];
    ControladorJogo._controladoresObstaculos = [];
    ControladorJogo._controladoresTiros = [];
    delete ControladorJogo._escuridao;

    //mudar : ControladorJogo._controladoresInimigos, ControladorJogo._controladoresObstaculos, ControladorJogo._controladoresTiros
    // ATENCAO: NENHUM DESSES MEMBROS PODEM SER NULOS, POREM PODEM SER UM ARRAY DE ZERO POSICOES
    //  (exceto ControladorJogo._controladoresTiros que tem que ter no minimo 1 posicao)

    //TODO: DEFINIR COMO CADA LEVEL VAI SER
      //1. Um inimigo central que se mexe de um lado para o outro atirando e obstaculos com vida passando da esquerda para a direita (saindo da tela)
      //2. mais inimigos nao essenciais

    //Comum a todos os levels:
    //primeiro controladorTiros da tela: para tiros de inimigos que morrem
    ControladorJogo._controladoresTiros[0] = new ControladorTiros(undefined, false);
    switch(ControladorJogo._level)
    {
      case 1:
      case 2:
      // inimigos
        //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, podeAtirarQualquerLado=false, qtdTiraVidaPersQndIntersec, infoAndar, configuracoesAtirar
        //Inimigo 1
        const corInim = "red";
        let infoInim1 = new InfoInimigo();
        infoInim1.formaGeometrica = new Quadrado(undefined,undefined, 50, {fill: corInim});
        infoInim1.corImgMorto = {fill: "black"};
        infoInim1.vida = 350;
        infoInim1.corVida = {stroke: color(200, 0, 0), fill: corInim};
        infoInim1.mostrarVidaSempre = true;
        infoInim1.podeAtirarQualquerLado = false;
        infoInim1.qtdTiraVidaPersQndIntersec = 2;
        infoInim1.infoAndar = new InfoAndar(0, 0, TipoAndar.NaoSairTelaInvTudo);

        //Atirar 1 do Inimigo 1
        let configuracaoAtirar = new ConfigAtirar();
        configuracaoAtirar.infoTiroPadrao = ControladorJogo.infoTiroInim();
        configuracaoAtirar.freqAtirar = 10;
        configuracaoAtirar.direcaoSairTiro = Direcao.Baixo;
        configuracaoAtirar.porcPraDentroObj = 0.05;
        configuracaoAtirar.mudarDirAndarTiroDirSai = false;
        configuracaoAtirar.ehTiroDuplo = true;
        configuracaoAtirar.porcTiroCentro = 0.2;
        infoInim1.configuracoesAtirar = [configuracaoAtirar];

        //ObjetoAparecendo
        const infoInim1Aparecendo = new InfoObjetoTelaAparecendo(false, false, new Ponto(0, -70));

        ControladorJogo._controladoresInimigos[0] = new ControladorInimigos(0, infoInim1, true, infoInim1Aparecendo); //sao inimigos essenciais
        ControladorJogo._controladoresInimigos[0].adicionarInimigo({posicaoX: PosicaoX.Meio, y: 30});


      // obstaculos
        //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers
        let infoObst1 = new InfoObstaculo();
        infoObst1.formaGeometrica = new Retangulo(undefined,undefined, 25, 200, {fill: "black"});
        infoObst1.corImgMorto = {fill: "white"};
        infoObst1.corImgEspecial = {fill: "green"};
        infoObst1.infoAndar = new InfoAndar(0,0, TipoAndar.NaoSairTelaInvDir);
        infoObst1.qtdTiraVidaBatePers = 1;
        infoObst1.qtdTiraVidaNaoConsegueEmpurrarPers = 10;
        const infoObst1Aparecendo = new InfoObjetoTelaAparecendo(true, true);
        ControladorJogo._controladoresObstaculos[0] = new ControladorObstaculos(0, infoObst1, infoObst1Aparecendo);
        ControladorJogo._controladoresObstaculos[0].adicionarObstaculo({posicaoY: PosicaoY.Meio, posicaoX: PosicaoX.Meio, x: 70, y: 20});


      // tiros tela (comecar a partir do index 1)
        //tiros tela propriamente dito
        ControladorJogo._controladoresTiros[1] = new ControladorTiros(ControladorJogo.infoTiroTela(), false);

        break;

      case 10:
        //ganha nave espacial
        ControladorJogo._personagemPrincipal = ControladorJogo._personagemPrincipal.novaNave(infoPersonagemPrincipal);
        break;

      //se tiver mais levels colocar aqui, mudar em: ControladorJogo.tempoEstimadoLevel(), ControladorJogo._acabouLevel(), ControladorPocaoTela.pocoesPossiveisFromLevel(...), ControladorPocaoTela.probabilidadeFromLevel(...)

      default:
        console.log("Acabaram as fases... vishh Luca tá fraco!!");
        return false; //acabaram os levels
    }

    ControladorJogo._criandoLevel = false;

    // programar para o "Level X" da tela desaparecer
    new Timer(function(){ ControladorJogo._colocarLvXTela = false; }, 3000);
    //adicionar timers do level atual depois que os ObjetosTela criados acabarem de aparecer
    new Timer(function(){ ControladorJogo._adicionarObjetosTmrLv(); }, tempoObjetoAparecerAntesIniciarLv);

    return true; //ainda tem mais levels
  }
  static _adicionarObjetosTmrLv()
  {
    // criar todos os Timers que vao ser usados no Level (para adicionar Tiros, Obstaculos e Inimigos) e Escuridao (tambem tem um Timer dentro dele)
    switch(ControladorJogo._level)
    {
      case 1:
      case 2:
        //adicionar tiros horizontais
        new Timer(function()
        {
          ControladorJogo._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeDireita, posicaoY: PosicaoY.Meio},
            undefined, Direcao.Esquerda);
          ControladorJogo._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeEsquerda, posicaoY: PosicaoY.Meio},
            undefined, Direcao.Direita);
        }, 5000, Timer.ehIntervalFazerAoCriar); //jah chama esse procedimento agora

        // escuridao
        let infoEscuridao = new InfoEscuridao();
        infoEscuridao.tempoEscurecendo = 800;
        infoEscuridao.desvioTempoEscurec = 0;
        infoEscuridao.tempoEscuroTotal = 0;
        infoEscuridao.desvioEscuroTotal = 0;
        infoEscuridao.intervaloEntreEscClarMsmBloco = 200;
        infoEscuridao.intervalo = 10000;
        infoEscuridao.desvioIntervalo = 0;
        infoEscuridao.qtdRepeticoes = 2;
        infoEscuridao.desvioQtdRep = 0;
        infoEscuridao.infosImgsRaios = [];
        ControladorJogo._escuridao = new Escuridao(infoEscuridao);
        break;
    }

    //POCAO
    //terah no maximo uma pocao por level:
    //esse metodo vai adicionar a pocao depois de certo tempo (depois de fazer a verificacao de se o level atual
    //tem pocoes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
    ControladorJogo._controladorPocaoTela.colocarPocaoEmTempoSeChance(ControladorJogo._level);
  }
  //passar de level
  static _passarLevel()
  //retorna se pers ganhou
  {
    ControladorJogo._level++; //passa de level

    ConjuntoTimers.excluirTimersDoLevel(); //finaliza timers antigos atrelacados ao level e os exclui

    const aindaTemLevel = ControladorJogo._iniciarLevel(); //proximo level
    if (aindaTemLevel===false) return true; // pers ganhou

    //cria oficina
    ControladorJogo._oficina = new Oficina(ControladorJogo._level);

    //programar para tirar oficina
    new Timer(function(){ delete ControladorJogo._oficina; }, 5000);

    return false; //pers nao ganhou
  }

  static tempoEstimadoLevel(level)
  //retornar tempo em segundos
  {
    // TODO: ajeitar tempo cada level
    switch (level)
    {
      case 1: return 25;
      case 2: return 40;
      case 3: return 60;
      case 4: return 65;
      case 5: return 70;
      case 6: return 75;
      case 7: return 80;
      case 8: return 85;
      case 9: return 90;
      case 10: return 95;
      case 11: return 100;
      case 12: return 105;
      case 13: return 110;
      case 14: return 115;
      case 15: return 120;
    }
  }

  //FUNCIONALIDADES PROGRAMA FAZ SOZINHO
  //ANDAR ObjetosTela que se movem sozinho:
  //tiros
  static _andarTiros()
  {
    //tiros do controlador jogo
    for (let i = 0; i<ControladorJogo._controladoresTiros.length; i++)
      ControladorJogo._controladoresTiros[i].andarTiros();

    //tiros do personagem
    ControladorJogo._personagemPrincipal.andarTiros();

    //tiros dos inimigos
    for (let i = 0; i<ControladorJogo._controladoresInimigos.length; i++)
      ControladorJogo._controladoresInimigos[i].andarTirosTodosInim();
  }
  //inimigos e obstaculos
  static _andarInimObst()
  {
    //andar obstaculos
    for (let i = 0; i<ControladorJogo._controladoresObstaculos.length; i++)
      ControladorJogo._controladoresObstaculos[i].andarObstaculos(i);

    //andar inimigos
    for (let i = 0; i<ControladorJogo._controladoresInimigos.length; i++)
      ControladorJogo._controladoresInimigos[i].andarInimigos();
  }
  //atirar automatico
  static _atirarAutomatico() //automatico
  {
    //personagem
    ControladorJogo._personagemPrincipal.atirar(Direcao.Cima);

    //inimigos
    for(let i = 0; i<ControladorJogo._controladoresInimigos.length; i++)
      ControladorJogo._controladoresInimigos[i].atirarTodosInim();
  }


  //FUNCINALIDADES PERSONAGEM
 //andar
  static andarPers(direcaoX, direcaoY) //setinhas
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (ControladorJogo._estadoJogo === EstadoJogo.Jogando)
      ControladorJogo._personagemPrincipal.andar(direcaoX, direcaoY);
  }

 //tiro
  static persPuxouGatilho() //atirar nao automatico
  {
    // para o aviao especial... (arma do index zero o personagem que atira manualmente)
    if (ControladorJogo._estadoJogo === EstadoJogo.Jogando && ControladorJogo._personagemPrincipal.ehAviaoMaster)
      ControladorJogo._personagemPrincipal.puxarGatilho(indexArmaNaoAutomaticaAviaoMasterPers);
  }

 //POCAO
  static ativarPocaoPers() //Q
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (ControladorJogo._estadoJogo === EstadoJogo.Jogando)
      ControladorJogo._personagemPrincipal.controladorPocoesPegou.usarPocaoAtual();
  }

 //pausado/despausado
  static mudarPausado() //enter
  {
    // pra pausar, o jogo jah tem que ter comecado
    if (ControladorJogo._estadoJogo === EstadoJogo.NaoComecou) return;

    if (ControladorJogo._estadoJogo === EstadoJogo.Pausado)
    {
      ControladorJogo._estadoJogo = ControladorJogo._estadoJogoAnterior;
      delete ControladorJogo._estadoJogoAnterior;
    }else
      ControladorJogo._pausarJogo();
  }
  static pausar() //quando a janela perder o foco
  {
    if (ControladorJogo._estadoJogo !== EstadoJogo.NaoComecou || ControladorJogo._estadoJogo !== EstadoJogo.Pausado)
    // se da pra pausar e nao estah pausado jah
      ControladorJogo._pausarJogo();
  }
  static _pausarJogo()
  {
    ControladorJogo._estadoJogoAnterior = ControladorJogo._estadoJogo;
    ControladorJogo._estadoJogo = EstadoJogo.Pausado;
  }


  //draw
  static draw()
  {
    if (ControladorJogo._estadoJogo === EstadoJogo.NaoComecou)
    {
      // TODO : design
      background(255);
      stroke(0);
      fill(0);
      textSize(40);
      text("Pressione [ESC] para começar a jogar", 50, 50);
      return;
    }
    if (ControladorJogo._estadoJogo === EstadoJogo.Pausado) //pausa-se com [ENTER]
    {
      // TODO : design
      //deixa o que estava na tela de fundo mesmo
      stroke(0);
      fill(0);
      textSize(40);
      text("PAUSADO: Pressione [ENTER] para despausar", 50, 50);
      return;
    }else
    if (ControladorJogo._estadoJogo === EstadoJogo.Ganhou)
    {
      // TODO : design (falar que ele passou todas as fases ateh ultima fase existente)
      background("green");
      stroke(0);
      fill(0);
      textSize(40);
      text("VOCE GANHOU!!", 50, 50);
      return;
    }else
    if (ControladorJogo._estadoJogo === EstadoJogo.Morto) //animacao dele morrendo
    {
      // TODO : animacao dele morrendo (ideia: acabar com os tiros dele e continuar o jogo "normal" com uma animacao dele morrendo e colocar na tela depois que ele MORREU)
      alert("Voce morreu!");
      location.reload();
      return;
    }

    //daqui pra baixo ControladorJogo._estadoJogo === EstadoJogo.Jogando

    // TODO: SE ESTAH COM POCAO DE DEIXAR TEMPO MAIS DEVAGAR, COLOCAR PLANO DE FUNDO DIFERENTE OU MEIO OPACO POR CIMA
    background(55);

    if (ControladorJogo._criandoLevel) //soh enquanto estiver no processo de criar os inimigos, tiros e obstaculos
    {
      //desenha o personagem, os tiros dele e a vida
      ControladorJogo._personagemPrincipal.draw();
      //andar tiros do personagem
      ControladorJogo._personagemPrincipal.andarTiros();
      return;
    }

    //procedimento dos Timers
    ConjuntoTimers.procDraws();

    //nessa ordem especificamente
    ControladorJogo._andarInimObst();
    ControladorJogo._personagemPrincipal.procTirarVidaIntersecInim();

    ControladorJogo._andarTiros();
    ControladorJogo._atirarAutomatico();

    if (ControladorJogo._oficina !== undefined)
    {
      ControladorJogo._oficina.draw();
      ControladorJogo._oficina.procVerificarConsertando(ControladorJogo._level);
    }

    //pocao
    ControladorJogo._controladorPocaoTela.draw();

    // desenha os inimigos (do ultimo para o primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresInimigos.length-1; i >= 0; i--)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      ControladorJogo._controladoresInimigos[i].draw();

    // desenha os tiros do jogo
    for (let i = ControladorJogo._controladoresTiros.length-1; i >= 0; i--)
    //deseha todos os inimigos desse controlador e os tiros de cada um
      ControladorJogo._controladoresTiros[i].draw();

    // desenha os obstaculos (do ultimo pro primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresObstaculos.length-1; i >= 0; i--)
    //desenha todos os obstaculos desse controlador
      ControladorJogo._controladoresObstaculos[i].draw();

    //desenha o personagem e os tiros dele (sua vida e suas pocoes ainda nao)
    ControladorJogo._personagemPrincipal.draw(false);

    if (ControladorJogo._escuridao !== undefined)
      ControladorJogo._escuridao.draw();
      //desenha a escuridao por cima de tudo a nao ser da vida do personagem, de suas pocoes e do level

    //desenha a vida e as pocoes do personagem
    ControladorJogo._personagemPrincipal.draw(true);

    if (ControladorJogo._colocarLvXTela)
    {
      textSize(40);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Level " + ControladorJogo._level, width/2, height/2);
      textAlign(LEFT, BASELINE);
    }

    if (ControladorJogo._personagemPrincipal.vivo && ControladorJogo._acabouLevel())
    {
      const persGanhou = ControladorJogo._passarLevel();
      if (persGanhou)
        ControladorJogo._estadoJogo = EstadoJogo.Ganhou;
    }

    if (!ControladorJogo._personagemPrincipal.vivo)
      ControladorJogo._estadoJogo = EstadoJogo.Morto;
  }

  static _acabouLevel()
  {
    //verificar se o level jah acabou
    switch (ControladorJogo._level)
    {
      case 3: //ultimo level
        return false;
      default:
        for (let i = 0; i<ControladorJogo._controladoresInimigos.length; i++)
          if (ControladorJogo._controladoresInimigos[i].ehDeInimigosEssenciais && ControladorJogo._controladoresInimigos[i].algumInimNaTela())
          //se ha algum inimigo essencial na tela, nao acabou
            return false;
        return true;
    }

    return false;
  }



  /* INFORMACOES DE PERSONAGEM, INIMIGOS E OBSTACULOS */
 //PERSONAGEM PRINCIPAL
  static infoPersonagemPrincPadrao()
  {
    //InfoPersonagemPrincipal: formaGeometrica, corImgMorto, vida, qtdAndar, configuracoesAtirar
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 90;
    const porcentagemImagem = 1.02;
    infoPersonagemPrincipal.formaGeometrica =  new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.19083969465648856*tamanho, 1*tamanho, 0.17557251908396945*tamanho),
        new Quadrilatero(new Ponto(0.37659033078880405, 0).multiplicado(tamanho), new Ponto(0.6055979643765903, 0.010178117048346057).multiplicado(tamanho), new Ponto(0.5241730279898219, 0.7786259541984732).multiplicado(tamanho), new Ponto(0.4681933842239186, 0.7735368956743003).multiplicado(tamanho)),
        new Retangulo(0.2875318066157761*tamanho,0.6437659033078881*tamanho, 0.4198473282442748*tamanho, 0.10687022900763359*tamanho),
      ],
      "Imagens/Aviao.png", porcentagemImagem);
    infoPersonagemPrincipal.corImgMorto = {fill: "black"};
    infoPersonagemPrincipal.vida = vida(1);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.65);

    // atirar do pers
    // ConfigAtirar: infoTiroPadrao, freqAtirar, direcaoSairTiro, qntPraDentroObj, ehTiroDuplo, distanciaTiroVert, mudarDirAndarTiroDirSai
    let configuracaoAtirar = new ConfigAtirar();
    configuracaoAtirar.infoTiroPadrao = ControladorJogo.infoTiroPersPadrao();
    configuracaoAtirar.freqAtirar = 1;
    configuracaoAtirar.direcaoSairTiro = Direcao.Cima;
    configuracaoAtirar.porcPraDentroObj = 0.2;
    configuracaoAtirar.ehTiroDuplo = false;
    configuracaoAtirar.mudarDirAndarTiroDirSai = false;

    infoPersonagemPrincipal.configuracoesAtirar = [configuracaoAtirar];

    return infoPersonagemPrincipal;
  }

 //TIROS
  //do pers
  static infoTiroPersPadrao()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroPersPadrao = new InfoTiro();
    infoTiroPersPadrao.formaGeometrica = new Retangulo(undefined,undefined, 5, 8, {fill: color(0, 0, 102)});
    infoTiroPersPadrao.corImgMorto = {fill: "black"};
    infoTiroPersPadrao.infoAndar = new InfoAndar(0, -22, TipoAndar.Normal);
    infoTiroPersPadrao.ehDoPers = true;
    infoTiroPersPadrao.mortalidade = 5;

    return infoTiroPersPadrao;
  }
  static infoTiroMissilPers()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoMissil = new InfoTiro();
    infoMissil.formaGeometrica = new Retangulo(undefined,undefined, 6, 10, {fill: "white"});
    infoMissil.corImgMorto = {fill: "black"};
    infoMissil.infoAndar = new InfoAndar(0, -10, TipoAndar.SeguirInimMaisProx);
    infoMissil.ehDoPers = true;
    infoMissil.mortalidade = 20;

    return infoMissil;
  }
  //nao do pers
  static infoTiroInim()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroInim = new InfoTiro();
    infoTiroInim.formaGeometrica = new Retangulo(undefined,undefined, 2.7, 5, {fill: "red"});
    infoTiroInim.corImgMorto = {fill: "black"};
    infoTiroInim.infoAndar = new InfoAndar(0, 13, TipoAndar.Normal);
    infoTiroInim.ehDoPers = false;
    infoTiroInim.mortalidade = 3;

    return infoTiroInim;
  }
  static infoTiroTela()
  {
    //InfoTiroPadrao: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroTela = new InfoTiro();
    infoTiroTela.formaGeometrica = new Retangulo(undefined,undefined, 25, 25, {fill: "black"});
    infoTiroTela.corImgMorto = {fill: "white"};
    infoTiroTela.infoAndar = new InfoAndar(6, 0, TipoAndar.Normal);
    infoTiroTela.ehDoPers = false;
    infoTiroTela.mortalidade = 3;

    return infoTiroTela;
  }
}

  //ATRIBUTOS

//velocidade
const velPadrao = 10;
function velocidade(nivel)
{ return nivel*velPadrao; }

//vida
const vidaPadrao = 100;
function vida(nivel)
{
  let ret = nivel*vidaPadrao
  if (Operacoes.primAlgoritDpVirgulaEhZero(ret))
    return ret;
  else
    return ret.toFixed(1);
}
