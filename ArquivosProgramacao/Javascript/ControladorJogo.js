const testando = false;

const EstadoJogo = {"NaoComecou":0, "Jogando":1, "Pausado":2, "Morto":3, "Ganhou": 4};
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

    //arrumar background inicio
    const medidasPadrao = {width: 2880, height: 1800}; //img.width e img.height nao estah funcionando
    const img = loadImage("ArquivosProgramacao/Imagens/Outros/background_inicio.jpg");
    const medidas = {height: height, width: medidasPadrao.width*height/medidasPadrao.height/*calcular width da imagem a partir do height*/};
    const ponto = new Ponto((width-medidas.width)/2, 0);
    ControladorJogo._infoBackgroundInicio = {img: img, medidas: medidas, ponto: ponto};
  }

 //GETTER
  // Atributos de Estado
  static get estadoJogo()
  { return ControladorJogo._estadoJogo; }
  static get criandoLevel()
  { return ControladorJogo._criandoLevel; }
  static get level()
  { return ControladorJogo._level; }
  static get previaJogo()
  { return ControladorJogo._previaJogo; }
  static get conjuntoDrawsEspeciais()
  { return ControladorJogo._conjuntoDrawsEspeciais; }
  // ObjetosTela
  static get pers()
  { return ControladorJogo._personagemPrincipal; }
  static get controladoresInimigos()
  { return ControladorJogo._controladoresInimigos; }
  static get controladorSuportesAereos()
  { return ControladorJogo._controladorSuportesAereos; }
  static get controladoresObstaculos()
  { return ControladorJogo._controladoresObstaculos; }
  static get controladorOutrosTirosNaoPers()
  { return ControladorJogo._controladorOutrosTirosNaoPers; }
  static get controladorPocaoTela()
  { return ControladorJogo._controladorPocaoTela; }
  static get oficina()
  { return ControladorJogo._oficina; }

  //inicializacao
  static comecarJogo()
  {
    //para setar tamanho dos objetos corretamente e ser proporcional ao width
    ArmazenadorInfoObjetos.inicializar();

    //para draws especiais
    ControladorJogo._conjuntoDrawsEspeciais = new ConjuntoDrawsEspeciaisJogo();

    //personagem original
    if (ControladorJogo._previaJogo) //se eh a previa
      ControladorJogo._personagemPrincipal = new PersonagemPrincipal(ArmazenadorInfoObjetos.infoAviaoMasterPers);
    else
      ControladorJogo._personagemPrincipal = new PersonagemPrincipal(ArmazenadorInfoObjetos.infoAviaoOriginalPers);
    ControladorJogo._personagemPrincipal.colocarLugarInicial();

    //controlador pocao (1 pra todos os levels)
    ControladorJogo._controladorPocaoTela = new ControladorPocaoTela();

    //controladorOutrosTirosNaoPers: para os tiros dos inimigos e dos suportes aereos que forem retirados do vetor nao sumirem
    ControladorJogo._controladorOutrosTirosNaoPers = new ControladorTiros(null, false);

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

    //Para tiros de inimigos e suportes aereos do level anterior nao sumirem:
    //concatenar tiros dos inimigos e do jogo em controladorTiros[0] quando for passar de level (antes de deletar os controladoresTirosJogo e controladoresInimigos)
    //se jah estah no 2o level em diante (antes do 1o level nao tinha nenhum tiro sem dono)
    if (ControladorJogo._level > 1)
    {
      let concatTirosEmSemDono = objComArmas => /*cada um dos objetos com armas*/
        {
          objComArmas.armas.forEach(arma => /*cada uma das armas do objeto com armas atual*/
            ControladorJogo._controladorOutrosTirosNaoPers.concatenarTiros(arma.controlador)
            // concatenar todos os tiros dessa arma em controladorOutrosTirosNaoPers
          );
        }

      ControladorJogo._controladorSuportesAereos.suportesAereos.forEach(concatTirosEmSemDono);
      ControladorJogo._controladoresInimigos.forEach(controladorInims => /*cada um dos controladores*/
          controladorInims.inimigos.forEach(concatTirosEmSemDono));
    }

    //zerar tudo
    ControladorJogo._controladoresInimigos = [];
    ControladorJogo._controladoresObstaculos = [];
    ControladorJogo._controladorSuportesAereos = null; //soh os dos inimigos
    delete ControladorJogo._escuridao;

    //mudar : ControladorJogo._controladoresInimigos, ControladorJogo._controladoresObstaculos, ControladorJogo._controladorSuportesAereos (opcional)
    // ATENCAO: NENHUM DESSES MEMBROS PODEM SER NULOS, POREM PODEM SER UM ARRAY DE ZERO POSICOES

    //TODO: DEFINIR COMO CADA LEVEL VAI SER
      //1. Um inimigo central que se mexe de um lado para o outro atirando e obstaculos com vida passando da esquerda para a direita (saindo da tela)
      //2. mais inimigos nao essenciais

    if (ControladorJogo._previaJogo)
    {
      //PREVIA JOGO: fazer dois levels (pra poder ver a Oficina)
      //obs: quando comecar o segundo level, depois de um certo tempo, mostrar o Sistema de Colisao!
      let length;
      switch(ControladorJogo._level)
      {
        case 1:
        {
          // inimigos
            //Aviao Brutao (parado no meio)
            const infoAviaoBrutao = ArmazenadorInfoObjetos.infoInim("AviaoBrutao", {ficarParado: true});
            const yAviaoBrutao = 25;
            const infoAparecAviaoBrutao = new InfoObjetoTelaAparecendo(false, false, new Ponto(0, -(infoAviaoBrutao.formaGeometrica.height + yAviaoBrutao + 40)));
            length = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoBrutao, true, infoAparecAviaoBrutao));
            ControladorJogo._controladoresInimigos[length-1].indexContr = length-1;
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigo({posicaoX: PosicaoX.Meio, y: yAviaoBrutao});

            //Helicoptero Bom (se movimentando um pouco dos lados)
            const porcWidthRetHelicopAndar = 0.25;
            const infoHelicopteroBom = ArmazenadorInfoObjetos.infoInim("HelicopteroBom", undefined/*alteracoesAndarRotacionar*/,
              {retangulo: {x: -porcWidthRetHelicopAndar/2, width: porcWidthRetHelicopAndar}});
            const infoAparecHelicopteroBom = new InfoObjetoTelaAparecendo(true, true);
            length = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoHelicopteroBom, true, infoAparecHelicopteroBom));
            ControladorJogo._controladoresInimigos[length-1].indexContr = length-1;
            const qtdHelicopAfastadoParede = (porcWidthRetHelicopAndar/2)*width + 20;
            const yHelicop = 28;
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigoDif({posicaoX: PosicaoX.ParedeEsquerda, x: qtdHelicopAfastadoParede, y: yHelicop},
              {direcao: Direcao.Direita});
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigoDif({posicaoX: PosicaoX.ParedeDireita, x: -qtdHelicopAfastadoParede, y: yHelicop},
              {direcao: Direcao.Esquerda});
        }
        break;

        case 2:
        {
          // inimigos
            //Aviao Master Inim (parado no meio)
            const infoAviaoMaster = ArmazenadorInfoObjetos.infoInim("AviaoMaster", {ficarParado: true});
            const yAviaoMaster = 20;
            const infoAparecAviaoMaster = new InfoObjetoTelaAparecendo(false, false, new Ponto(0, -(infoAviaoMaster.formaGeometrica.height + yAviaoMaster)));
            length = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoMaster, true, infoAparecAviaoMaster));
            ControladorJogo._controladoresInimigos[length-1].indexContr = length-1;
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigo({posicaoX: PosicaoX.Meio, y: yAviaoMaster});

            //Aviao Bruto SemHel
            const infoAviaoBruto = ArmazenadorInfoObjetos.infoInim("AviaoBrutoSemHel", undefined/*alteracoesAndarRotacionar*/,
              );
            const infoAparecAviaoBruto = new InfoObjetoTelaAparecendo(true, true);
            length = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoBruto, false, infoAparecAviaoBruto));
            ControladorJogo._controladoresInimigos[length-1].indexContr = length-1;
            const yAviaoBruto = 150;
            const qtdAfastadoParede = 40;
            const porcWidthRetBrutoAndar = 0.4;
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigoDif({posicaoX: PosicaoX.ParedeEsquerda, x: qtdAfastadoParede, y: yAviaoBruto},
              {direcao: Direcao.Direita}, {infoAndar: {outrasInformacoes: {retangulo: {x: 0, width: porcWidthRetBrutoAndar}}}});
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigoDif({posicaoX: PosicaoX.ParedeDireita, x: -qtdAfastadoParede, y: yAviaoBruto},
              {direcao: Direcao.Esquerda}, {infoAndar: {outrasInformacoes: {retangulo: {x: -porcWidthRetBrutoAndar, width: porcWidthRetBrutoAndar}}}});
        }
        break;

        //se tiver mais levels colocar aqui, mudar em: ControladorJogo.tempoEstimadoLevel(), ControladorJogo._acabouLevel(), ControladorPocaoTela.pocoesPossiveisFromLevel(...), ControladorPocaoTela.probabilidadeFromLevel(...)

        default:
          return false; //acabaram os levels
      }
    }else
    {
      let length;
      switch(ControladorJogo._level)
      {
        case 1:
        case 2:
        {
          // inimigos
            //Inimigo Normal Medio (essencial)
            const infoInimMedio = ArmazenadorInfoObjetos.infoInim("HelicopteroBom", {ficarParado: true});
            const infoInimMedioAparec = new InfoObjetoTelaAparecendo(false, false, new Ponto(0, -70)); //ObjetoAparecendo
            length = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoInimMedio, true, infoInimMedioAparec));
            ControladorJogo._controladoresInimigos[length-1].indexContr = length-1;
            ControladorJogo._controladoresInimigos[length-1].adicionarInimigo({posicaoX: PosicaoX.Meio, y: 15});
        }
        break;

        case 10:
        {
          //ganha nave espacial
          ControladorJogo._personagemPrincipal = ControladorJogo._personagemPrincipal.novaNave(ArmazenadorInfoObjetos.infoAviaoMasterPers);
        }
        break;

        //se tiver mais levels colocar aqui, mudar em: ControladorJogo.tempoEstimadoLevel(), ControladorJogo._acabouLevel(), ControladorPocaoTela.pocoesPossiveisFromLevel(...), ControladorPocaoTela.probabilidadeFromLevel(...)

        default:
          console.log("Acabaram as fases... vishh Luca tá fraco!!");
          return false; //acabaram os levels
      }
    }

    //para nao ter que ficar verificando se eh undefined toda hora:
    if (ControladorJogo._controladorSuportesAereos===null)
      ControladorJogo._controladorSuportesAereos = new ControladorSuportesAereos();

    ControladorJogo._criandoLevel = false;

    // programar para o "Level X" da tela desaparecer
    //programar para colocar "Level X" na tela
    ControladorJogo._conjuntoDrawsEspeciais.adicionarMetodoDraw(() =>
      {
        push();
          textSize(40);
          fill(0);
          textAlign(CENTER, CENTER);
          text("Level " + ControladorJogo._level, width/2, (height - heightVidaUsuario)/2);
        pop();
      }, 3000);

    //adicionar timers do level atual depois que os ObjetosTela criados acabarem de aparecer
    new Timer(() => { ControladorJogo._adicionarTimersLevel(); }, tempoObjetoAparecerAntesIniciarLv);

    return true; //ainda tem mais levels
  }
  static _adicionarTimersLevel()
  {
    if (ControladorJogo._previaJogo)
    {
      //PREVIA JOGO
      switch(ControladorJogo._level)
      {
        case 1:
        {
          // inimigos
            const infoMostrarVida = {mostrarVidaSempre: false};
            const tempoAddCadaInimigo = 27000;

            //Aviao Supersonico Rapido (se movimentando)
              //criar controlador
            const infoAviaoSupersonico = ArmazenadorInfoObjetos.infoInim("AviaoSupersonicoRapido", undefined/*alteracoesAndarRotacionar*/, undefined/*outrasInformacoesAndar*/,
              TipoAndar.PermanecerEmRetangulo/*permanecer dentro da tela, pois nao tem nenhuma*/, infoMostrarVida);
            const infoAparecAviaoSupersonico = new InfoObjetoTelaAparecendo(true, true);
            const lengthSupersonico = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoSupersonico, false, infoAparecAviaoSupersonico));
            ControladorJogo._controladoresInimigos[lengthSupersonico-1].indexContr = lengthSupersonico-1;
              //adicionar inimigo
            new Timer(() => // para esperar um tempo antes de criar o
            {
              new Timer(() =>
                {
                  const surgirEsquerda = Probabilidade.chance(1,2);

                  const qtdAfastadoParede = 20;
                  ControladorJogo._controladoresInimigos[lengthSupersonico-1].adicionarInimigo({posicaoX: (surgirEsquerda) ? PosicaoX.ParedeEsquerda : PosicaoX.ParedeDireita,
                    x: qtdAfastadoParede * (surgirEsquerda)?1:-1, y: 200});
                }, tempoAddCadaInimigo, Timer.ehIntervalFazerAoCriar);
            }, tempoAddCadaInimigo * 0.5, false);

            //Aviao Normal Bom Escuro (seguindo pers)
              //criar controlador
            const infoAviaoBom = ArmazenadorInfoObjetos.infoInim("AviaoNormalBomEscuro", undefined/*alteracoesAndarRotacionar*/, undefined/*outrasInformacoesAndar*/,
              TipoAndar.SeguirPers, infoMostrarVida);
            const infoAparecAviaoBom = new InfoObjetoTelaAparecendo(true, true);
            const lengthBom = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoBom, false, infoAparecAviaoBom));
            ControladorJogo._controladoresInimigos[lengthBom-1].indexContr = lengthBom-1;
              //adicionar inimigo
            new Timer(() =>
              {
                const surgirEsquerda = Probabilidade.chance(1,2);
                //ponto inicial
                const qtdAfastadoParede = 20;
                const pontoInicial = {posicaoX: (surgirEsquerda) ? PosicaoX.ParedeEsquerda : PosicaoX.ParedeDireita, x: qtdAfastadoParede * (surgirEsquerda)?1:-1, y: 25};
                //mudar qtdAndar e rotacao
                const anguloAponta = PI/4 * ((surgirEsquerda)?-1:1);
                const alteracoesAndarRotacionar = {/*ROTACIONAR:*/direcaoAnguloAponta: anguloAponta, ehAngulo: true,
                  /*ANDAR:*/angulo: -Angulo.angRotacaoParaAngCicloTrig(PI+anguloAponta)};

                ControladorJogo._controladoresInimigos[lengthBom-1].adicionarInimigoDif(pontoInicial, alteracoesAndarRotacionar);
              }, tempoAddCadaInimigo, Timer.ehIntervalNaoFazerAoCriar);

          // escuridao
            let infoEscuridao = new InfoEscuridao();
              //repeticoes: de 2 a 3
            infoEscuridao.qtdRepeticoes = 2.5;
            infoEscuridao.desvioQtdRep = 0.5;
              //tempo
            infoEscuridao.tempoEscurecendo = 900;
            infoEscuridao.tempoEscuroTotal = 200;
            infoEscuridao.intervaloEntreEscClarMsmBloco = 200; //tempo entre cada escurecer-clarear do mesmo bloco
            infoEscuridao.intervalo = 10000; //tempo sem escuridao
              //desvios
            infoEscuridao.desvioTempoEscurec = 0;
            infoEscuridao.desvioEscuroTotal = 20;
            infoEscuridao.desvioIntervalo = 0;
            ControladorJogo._escuridao = new Escuridao(infoEscuridao);
        }
        break;

        case 2:
        {
          // inimigos
            //Aviao Normal Bom Claro
              //criar controlador
            const infoAviaoBom = ArmazenadorInfoObjetos.infoInim("AviaoNormalBomClaro", undefined/*alteracoesAndarRotacionar*/, undefined/*outrasInformacoesAndar*/,
              TipoAndar.SeguirPers, {mostrarVidaSempre: false});
            const infoAparecAviaoBom = new InfoObjetoTelaAparecendo(true, true);
            const lengthBom = ControladorJogo._controladoresInimigos.push(new ControladorInimigos(infoAviaoBom, false, infoAparecAviaoBom));
            ControladorJogo._controladoresInimigos[lengthBom-1].indexContr = lengthBom-1;
              //adicionar inimigo
            new Timer(() =>
              {
                ControladorJogo._controladoresInimigos[lengthBom-1].adicionarInimigo({posicaoX: PosicaoX.Meio, y: 265});
              }, 18000, Timer.ehIntervalNaoFazerAoCriar);
        }
        break;
      }
    }else
    {
      //criar:
        // - todos os controladores que soh terao objetos adicionados por Timers e esses Timers
        // - outros Timers que vao ser usados no Level
        // - Escuridao (tambem tem um Timer dentro dele)
      switch(ControladorJogo._level)
      {
        case 1:
        {
          // escuridao
          /* let infoEscuridao = new InfoEscuridao();
          infoEscuridao.tempoEscurecendo = 800;
          infoEscuridao.desvioTempoEscurec = 0;
          infoEscuridao.tempoEscuroTotal = 0;
          infoEscuridao.desvioEscuroTotal = 0;
          infoEscuridao.intervaloEntreEscClarMsmBloco = 200;
          infoEscuridao.intervalo = 10000;
          infoEscuridao.desvioIntervalo = 0;
          infoEscuridao.qtdRepeticoes = 2;
          infoEscuridao.desvioQtdRep = 0;
          ControladorJogo._escuridao = new Escuridao(infoEscuridao); */
        }
        break;
      }
    }

    //POCAO (pode ter mais de uma pocao por level, mas apenas uma na tela de cada vez)
    //esse metodo vai programar para adicionar quantas pocoes o level permita (se Probabilidade.chance())
    //e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
    ControladorJogo._controladorPocaoTela.programarPocoesLevel();
  }
  //passar de level
  static _passarLevel()
  //retorna se pers ganhou
  {
    ControladorJogo._level++; //passa de level

    ConjuntoTimers.excluirTimersDoLevel(); //finaliza timers antigos atrelacados ao level e os exclui
    ControladorJogo._conjuntoDrawsEspeciais.procPassouLevel(); //remove funcoes draw que nao transcendem o level

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
    if (ControladorJogo.previaJogo)
      return 50;

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
    //tiros do personagem
    ControladorJogo._personagemPrincipal.andarTiros();

    //tiros sem dono
    ControladorJogo._controladorOutrosTirosNaoPers.andarTiros();
    //tiros dos suportes aereos
    ControladorJogo._controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.andarTiros());
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
  static _atirarAutomatico()
  {
    //personagem
    ControladorJogo._personagemPrincipal.atirar();

    //inimigos
    ControladorJogo._controladoresInimigos.forEach(controladorInims => controladorInims.atirarTodosInim());
    //suportes aereos
    ControladorJogo._controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.atirar());
  }


  //FUNCINALIDADES PERSONAGEM
  //andar
  static andarPers(direcaoX, direcaoY) //setinhas ou WASD
  {
    //se estah jogando (jah comecou, nao estah pausado e o personagem nao morreu)
    if (ControladorJogo._estadoJogo === EstadoJogo.Jogando)
      ControladorJogo._personagemPrincipal.andar(direcaoX, direcaoY);
  }

  //tiro nao automatico
  static persPuxouGatilho() //E
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

  //para saber se painel personagem vai ser printado normal ou um pouco opaco
  static algumObjetoImportanteNesseEspaco(retanguloEspaco)
  // ObjetosImportantes: PersonagemPrincipal, Pocao, Inimigos (normal ou aparecendo), Obstaculos (normal ou aparecendo)
  {
    //PersonagemPrincipal
    if (Interseccao.interseccaoComoRetangulos(retanguloEspaco, ControladorJogo._personagemPrincipal.formaGeometrica))
      return true;

    //Pocao
    if (ControladorJogo._controladorPocaoTela.temObjPocao && Interseccao.interseccaoComoRetangulos(retanguloEspaco, ControladorJogo._controladorPocaoTela.objPocao.formaGeometrica))
      return true;

    //Inimigos
    const interseccaoAlgumInim = ControladorJogo._controladoresInimigos.some(controladorInims =>
      controladorInims.algumInimNesseEspaco(retanguloEspaco));
    if (interseccaoAlgumInim)
      return true;

    //SuportesAereos
    const interseccaoAlgumSuporteAereo = ControladorJogo._controladorSuportesAereos.suportesAereos.some(suporteAereo =>
      Interseccao.interseccaoComoRetangulos(retanguloEspaco, suporteAereo.formaGeometrica));
    if (interseccaoAlgumSuporteAereo)
      return true;

    //Obstaculos
    const interseccaoAlgumObst = ControladorJogo._controladoresObstaculos.some(controladorObsts =>
      controladorObsts.algumObstNesseEspaco(retanguloEspaco));
    if (interseccaoAlgumObst)
      return true;

    // nao tem nenhum objeto importante nesse espaco
    return false;
  }

  //draw
  static draw()
  {
    if (ControladorJogo._estadoJogo === EstadoJogo.NaoComecou)
    {
      //desenhar imagem de fundo
      const infoImg = ControladorJogo._infoBackgroundInicio;
      image(infoImg.img, infoImg.ponto.x, infoImg.ponto.y, infoImg.medidas.width, infoImg.medidas.height);
      push();
        //desenhar texto
        textSize(40);
        textAlign(CENTER);
        text("Pressione [ESC] para começar a jogar", width/2, height*0.8);
      pop();
      return;
    }
    if (ControladorJogo._estadoJogo === EstadoJogo.Pausado) //pausa-se com [ENTER]
    {
      // TODO : design
      //deixa o que estava na tela de fundo mesmo
      push();
        stroke(0);
        fill(0);
        textSize(40);
        text("PAUSADO: Pressione [ENTER] para despausar", 50, 50);
      pop();
      return;
    }else
    if (ControladorJogo._estadoJogo === EstadoJogo.Ganhou)
    {
      // TODO : design (falar que ele passou todas as fases ateh ultima fase existente)
      background("green");
      push();
        stroke(0);
        fill(0);
        textSize(40);
        text("VOCE GANHOU!!", 50, 50);
      pop();
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
    ControladorJogo._controladorSuportesAereos.drawSurgindo();
    for (let i = ControladorJogo._controladoresInimigos.length-1; i >= 0; i--)
      ControladorJogo._controladoresInimigos[i].drawSurgindo();
    for (let i = ControladorJogo._controladoresObstaculos.length-1; i >= 0; i--)
      ControladorJogo._controladoresObstaculos[i].drawSurgindo();

    // OBJETOS JAH INTERAGEM COM O MEIO:
    // Tiros sem dono
    ControladorJogo._controladorOutrosTirosNaoPers.draw();
    //Suportes Aereos
    ControladorJogo._controladorSuportesAereos.draw(); // tambem desenha os tiros
    // Inimigos (do ultimo para o primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresInimigos.length-1; i >= 0; i--)
      ControladorJogo._controladoresInimigos[i].draw(); // tambem desenha os tiros dos inimigos
    // Obstaculos (do ultimo pro primeiro pois o primeiro eh mais importante)
    for (let i = ControladorJogo._controladoresObstaculos.length-1; i >= 0; i--)
      ControladorJogo._controladoresObstaculos[i].draw();
    //Pocao
    ControladorJogo._controladorPocaoTela.draw();

    //desenha o personagem e os tiros dele (sua vida e suas pocoes ainda nao)
    ControladorJogo._personagemPrincipal.draw(TipoDrawPersonagem.ParteDoCeu);

    //desenha os tiros mortos (eles tem que ficar por cima de todos os ObjetosTela)
    ControladorJogo._controladorOutrosTirosNaoPers.drawMortos(); //sem dono
    ControladorJogo._controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.drawTirosMortos()); //de Suportes Aereos
    ControladorJogo._controladoresInimigos.forEach(contrInims => contrInims.drawTirosMortosInims()); //de Inimigos
    ControladorJogo._personagemPrincipal.drawTirosMortos(); //de PersonagemPrincipal

    //desenha a mira arma giratoria (nao podia desenhar junto com a parte do ceu porque dessa forma os tiros mortos ficariam por cima da mira)
    ControladorJogo._personagemPrincipal.draw(TipoDrawPersonagem.MiraArmaGiratoria);

    if (ControladorJogo._escuridao !== undefined)
      ControladorJogo._escuridao.draw();
      //desenha a escuridao por cima de tudo a nao ser da vida do personagem, de suas pocoes e do level

    //desenha a vida e as pocoes do personagem
    ControladorJogo._personagemPrincipal.draw(TipoDrawPersonagem.Painel);

    //desenha draws especiais (informacoes em texto normalmente)
    ControladorJogo._conjuntoDrawsEspeciais.draw();

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

class ConjuntoDrawsEspeciaisJogo
{
  constructor()
  {
    //atributos basicos/importantes
    this._infoMetodosDraw = [];
    this._count = 0;

    //outros atributos
    this._qtdTranscendeLevel = 0;
  }

  adicionarMetodoDraw(funcaoDraw, tempoDraw, transcendeLevel=false)
  //tempoDraw: em segundos
  {
    this._count++;
    this._infoMetodosDraw.push({chavePrim: this._count, metodo: funcaoDraw, transcendeLevel: transcendeLevel});

    //para otimizar procPassouLevel
    if (transcendeLevel) this._qtdTranscendeLevel++;

    if (tempoDraw !== undefined)
    //se tempoDraw nao eh undefined, tem que se programar para remover esse elemento depois de tempoDraw milisegundos
    {
      const chavePrim = this._count;
      new Timer(() =>
        {
          this._infoMetodosDraw.some((infoMetodoDraw, index) =>
            {
              if (infoMetodoDraw.chavePrim === chavePrim)
              {
                //remove esse elemento
                this._infoMetodosDraw.splice(index, 1);

                //para otimizar procPassouLevel
                if (infoMetodoDraw.transcendeLevel) this._qtdTranscendeLevel--;

                return true;
              }
              return false;
            });
        }, tempoDraw);
    }
  }

  procPassouLevel()
  {
    //se todos transcendem o level, nao precisa remover nada
    if (this._qtdTranscendeLevel === this._infoMetodosDraw.length)
    {} else

    //se nenhum transcende o level, precisa deletar todos
    if (this._qtdTranscendeLevel === 0)
    { this._infoMetodosDraw = []; }

    else
    //precisa remover alguns (todos os que nao transcendem o level)
    {
      this._infoMetodosDraw.forEach((infoMetodoDraw, index) =>
        {
          if (!infoMetodoDraw.transcendeLevel)
          //se nao transcende level, remove esse elemento
            this._infoMetodosDraw.splice(index, 1);
        });
      this._qtdTranscendeLevel = this._infoMetodosDraw.length;
      //todos os que sobraram transcendem o level
    }
  }

  draw()
  {
    this._infoMetodosDraw.forEach(infoMetodoDraw => infoMetodoDraw.metodo());
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
