const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3, "Ganhou": 4};

const testando = true;

// ControladorJogo eh static class porque sempre soh vai existir 1 e eh mais pratico (pq nao precisar ficar passando os objetoTela necessarios, nem level, estadoJogo e outros getters)
class ControladorJogo
{
  static inicializar(previaJogo)
  {
    ControladorJogo._previaJogo = previaJogo;
    //PREVIA JOGO: se eh previaJogo, vai ter apenas um level com todos os diferenciais (vai mostrar a estrutura de interseccao de X de tempo ateh o final, vai ter soh as pocoes mais legais, o level vai acabar depois de um certo tempo e falar quais sao os diferenciais desse jogo)
    //ps: ver se da pra mostrar as formasGeometricas de Interseccao.vaiIntersectar(...) (printar de outra cor)
    //ps2: colocar texto na tela explicando que vao aparecer figuras na tela pra demonstrar como a estrutura de Colisao eh feita
    //ps3: deixar o personagem com muito mais vida (pra ele nao morrer antes de acabar o tempo)

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
    //personagem original
    if (ControladorJogo._previaJogo) //se eh a previa
      ControladorJogo._personagemPrincipal = new PersonagemPrincipal(ArmazenadorInfoObjetos.infoAviaoMasterPers);
    else
      ControladorJogo._personagemPrincipal = new PersonagemPrincipal(ArmazenadorInfoObjetos.infoAviaoOriginalPers);
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

    //Para tiros de inimigos e tiros da tela nao simplesmente sumirem:
    //concatenar tiros dos inimigos e do jogo em controladorTiros[0] quando for passar de level (antes de deletar os controladoresTirosJogo e controladoresInimigos)
    const controladorTirosTirosSemDono = new ControladorTiros(null, false);
    //se jah estah no 2o level em diante (antes do 1o level nao tinha nenhum tiro sem dono)
    if (ControladorJogo._level > 1)
    {
      ControladorJogo._controladoresTiros.forEach(controladorTiros =>
        controladorTirosTirosSemDono.concatenarTiros(controladorTiros)); // concatenar todos os tiros da tela nesse controlador
      ControladorJogo._controladoresInimigos.forEach(controladorInims => /*cada um dos controladores*/
        {
          controladorInims.inimigos.forEach(inim => /*cada um dos inimigos dentro de cada controladores*/
            inim.armas.forEach(arma => /*cada uma das armas de cada um dos inimigos dentro de cada controladores*/
              controladorTirosTirosSemDono.concatenarTiros(arma.controlador)
              // concatenar todos os tiros dos inimigos nesse controlador
            ));
        });
    }

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
    ControladorJogo._controladoresTiros[0] = controladorTirosTirosSemDono;

    if (ControladorJogo._previaJogo)
    {
      //PREVIA JOGO: fazer dois levels (pra poder ver a Oficina)
      //obs: quando comecar o segundo level, depois de um certo tempo, mostrar o Sistema de Colisao!
    }else
    {
      switch(ControladorJogo._level)
      {
        case 1:
        case 2:
        // inimigos
          //Inimigo Normal Fraco (essencial)
          const infoInimigo = ArmazenadorInfoObjetos.infoInim("AviaoNormalFraco", null);
          const infoInimAparecendo = new InfoObjetoTelaAparecendo(false, false, new Ponto(0, -70)); //ObjetoAparecendo
          ControladorJogo._controladoresInimigos[0] = new ControladorInimigos(0, infoInimigo, true, infoInimAparecendo);

          const qtdAfastadoParede = 20;
          ControladorJogo._controladoresInimigos[0].adicionarInimigo({posicaoX: PosicaoX.Meio, y: 15});
          ControladorJogo._controladoresInimigos[0].adicionarInimigo({posicaoX: PosicaoX.ParedeEsquerda, y: 15});
          ControladorJogo._controladoresInimigos[0].adicionarInimigo({posicaoX: PosicaoX.ParedeDireita, y: 15});


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
          ControladorJogo._controladoresObstaculos[0].adicionarObstaculo({posicaoY: PosicaoY.ParedeDireita, posicaoX: PosicaoX.Meio, x: -40, y: 20})
          ControladorJogo._controladoresObstaculos[0].adicionarObstaculo({posicaoY: PosicaoY.ParedeEsquerda, posicaoX: PosicaoX.Meio, x: 40, y: 20})


        // tiros tela (comecar a partir do index 1)
          //tiros tela propriamente dito
          ControladorJogo._controladoresTiros[1] = new ControladorTiros(ArmazenadorInfoObjetos.infoTiro("TiroFraco", false, Direcao.Direita), false);

          break;

        case 10:
          //ganha nave espacial
          ControladorJogo._personagemPrincipal = ControladorJogo._personagemPrincipal.novaNave(ArmazenadorInfoObjetos.infoAviaoMasterPers);
          break;

        //se tiver mais levels colocar aqui, mudar em: ControladorJogo.tempoEstimadoLevel(), ControladorJogo._acabouLevel(), ControladorPocaoTela.pocoesPossiveisFromLevel(...), ControladorPocaoTela.probabilidadeFromLevel(...)

        default:
          console.log("Acabaram as fases... vishh Luca tá fraco!!");
          return false; //acabaram os levels
      }
    }

    ControladorJogo._criandoLevel = false;

    // programar para o "Level X" da tela desaparecer
    new Timer(() => { ControladorJogo._colocarLvXTela = false; }, 3000);
    //adicionar timers do level atual depois que os ObjetosTela criados acabarem de aparecer
    new Timer(() => { ControladorJogo._adicionarObjetosTmrLv(); }, tempoObjetoAparecerAntesIniciarLv);

    return true; //ainda tem mais levels
  }
  static _adicionarObjetosTmrLv()
  {
    if (ControladorJogo._previaJogo)
    {
      //PREVIA JOGO
    }else
    {
      //criar:
        // - todos os controladores que soh terao objetos adicionados por Timers e esses Timers
        // - outros Timers que vao ser usados no Level
        // - Escuridao (tambem tem um Timer dentro dele)
      switch(ControladorJogo._level)
      {
        case 1:
          //adicionar tiros horizontais
          new Timer(() =>
            {
              ControladorJogo._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeDireita, posicaoY: PosicaoY.Meio},
                {direcao: Direcao.Esquerda});
              ControladorJogo._controladoresTiros[1].adicionarTiroDif({posicaoX: PosicaoX.ParedeEsquerda, posicaoY: PosicaoY.Meio},
                {direcao: Direcao.Direita});
            }, 5000, Timer.ehIntervalFazerAoCriar); //jah chama esse procedimento agora

          /*//inimigos
          //criar controlador: Inimigo Segue PersPrincipal
          const infoInimSegue = ArmazenadorInfoObjetos.infoInim("AviaoNormalFraco", undefined,
            TipoAndar.SeguirPers, {mostrarVidaSempre: false}, true, {maiorAnguloMudanca: PI/100, porcVelCurva: 0.5});
          const infoInimSegueAparecendo = new InfoObjetoTelaAparecendo(true, true); //ObjetoAparecendo
          ControladorJogo._controladoresInimigos[1] = new ControladorInimigos(0, infoInimSegue, false, infoInimSegueAparecendo);
          //criar Timer
          new Timer(() =>
            {
              ControladorJogo._controladoresInimigos[1].adicionarInimigo({posicaoX: PosicaoX.ParedeEsquerda, x: 10, posicaoY: PosicaoY.Meio});
              console.log(ControladorJogo._controladoresInimigos[1]._inimigosSurgindo[ControladorJogo._controladoresInimigos[1]._inimigosSurgindo.length-1].formaGeometrica.clone());
            }, 5000, Timer.ehIntervalFazerAoCriar); */
          break;

        case 2:
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
    new Timer(() => { delete ControladorJogo._oficina; }, 5000);

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
  //andar tiros
  static _andarTiros()
  {
    //tiros do controlador jogo
    ControladorJogo._controladoresTiros.forEach(controladorTiro => controladorTiro.andarTiros());

    //tiros do personagem
    ControladorJogo._personagemPrincipal.andarTiros();

    //tiros dos inimigos
    ControladorJogo._controladoresInimigos.forEach(controladorInims => controladorInims.andarTirosTodosInim());
  }
  //andar inimigos e obstaculos
  static _andarInimObst()
  {
    //andar obstaculos
    ControladorJogo._controladoresObstaculos.forEach(controladorObsts => controladorObsts.andarObstaculos());

    //andar inimigos
    ControladorJogo._controladoresInimigos.forEach(controladorInims => controladorInims.andarInimigos());
  }
  //atirar automatico
  static _atirarAutomatico() //automatico
  {
    //personagem
    ControladorJogo._personagemPrincipal.atirar(Direcao.Cima);

    //inimigos
    ControladorJogo._controladoresInimigos.forEach(controladorInims => controladorInims.atirarTodosInim());
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

    if (ControladorJogo._criandoLevel)
    //quando enquanto estiver no processo de criar o level (ainda estah dentro do procedimento ControladorJogo._iniciarLevel), soh printa pers e
    {
      //desenha o personagem, os tiros dele e a vida
      ControladorJogo._personagemPrincipal.draw();
      //andar tiros do personagem
      ControladorJogo._personagemPrincipal.andarTiros();
      return;
    }

    //procedimento dos Timers (antes de tudo)
    ConjuntoTimers.procDraws();

    //nessa ordem especificamente
    ControladorJogo._andarInimObst();
    ControladorJogo._personagemPrincipal.procPerderVidaIntersecInim();

    ControladorJogo._andarTiros();
    ControladorJogo._atirarAutomatico();

    if (ControladorJogo._oficina !== undefined)
    {
      ControladorJogo._oficina.draw();
      ControladorJogo._oficina.procVerificarConsertando(ControladorJogo._level);
    }

    //desenha Inimigos e Obstaculos SURGINDO (ObjetosTela surgindo ficam atras dos que jah surgiram)
    for (let i = ControladorJogo._controladoresInimigos.length-1; i >= 0; i--)
      ControladorJogo._controladoresInimigos[i].drawSurgindo();
    for (let i = ControladorJogo._controladoresObstaculos.length-1; i >= 0; i--)
      ControladorJogo._controladoresObstaculos[i].drawSurgindo();

    // OBJETOS JAH INTERAGEM COM O MEIO:
    // Tiros do Jogo
    for (let i = ControladorJogo._controladoresTiros.length-1; i >= 0; i--)
      ControladorJogo._controladoresTiros[i].draw();
    // Inimigos (do ultimo para o primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresInimigos.length-1; i >= 0; i--)
      ControladorJogo._controladoresInimigos[i].draw(); // tambem desenha os tiros dos inimigos
    // Obstaculos (do ultimo pro primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresObstaculos.length-1; i >= 0; i--)
      ControladorJogo._controladoresObstaculos[i].draw();
    //Pocao
    ControladorJogo._controladorPocaoTela.draw();

    //desenha o personagem e os tiros dele (sua vida e suas pocoes ainda nao)
    ControladorJogo._personagemPrincipal.draw(false);

    //desenha mira do personagem (se tem ArmaGiratoria)
    if (ControladorJogo.pers.ehAviaoMaster)
    {
      const diametro = 8;
      noStroke();
      fill("red");
      ellipse(mouseX, mouseY, diametro);
    }

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
      default:
        //se nao tem nenhum inimigo essencial na tela
        return ControladorJogo._controladoresInimigos.every(controladorInims =>
          !controladorInims.ehDeInimigosEssenciais || !controladorInims.algumInimNaTela());
    }

    return false;
  }
}

window.addEventListener("click", function()
{
  if (ControladorJogo.estadoJogo === EstadoJogo.NaoComecou) return;

  if (ControladorJogo._personagemPrincipal.numeroAviao == 1)
    ControladorJogo._personagemPrincipal = ControladorJogo._personagemPrincipal.novaNave(ArmazenadorInfoObjetos.infoAviaoBrutoPers);
  else
  if (ControladorJogo._personagemPrincipal.numeroAviao == 2)
    ControladorJogo._personagemPrincipal = ControladorJogo._personagemPrincipal.novaNave(ArmazenadorInfoObjetos.infoAviaoMasterPers);
});
