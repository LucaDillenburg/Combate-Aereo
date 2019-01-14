//constantes executarPocao
const porcentagemSetTam = 0.5;
const porcentagemSetVelRuim = 0.5;
const porcentagemDeixarTempoLento = 0.25;

const qtdTiroAndarMaisRapido = 7;
const porcentagemSetVel = 1.4;
const qtdTiroMaisMortalidade = 3;
const porcentagemVelTiroSeVoltarPers = 0.4;
const porcentagemMortalidadeTiroSeVoltarPers = 0.15;

const qtdGanhaPoucaVida = 7;
const qtdPerdeVida = 10;
const qtdGanhaMuitaVida = 12;

const qtdTiraVidaTodosInim = 70;

const indexArmaMissilPers = 0; //de acordo com "TER EM MENTE.txt"
const freqMissilPers = 22;

//POCAO
class Pocao
{
  constructor(codPocao)
  {
    this._codPocao = codPocao;
    this._informacoesPocao = Pocao.informacoesPocaoFromCod(codPocao);
    this._personagemJahPegou = false;
  }

  //getters
  get nome()
  { return this._informacoesPocao.nome; }
  get ativadoInstant()
  { return this._informacoesPocao.ativadoInstant; }
  get temDesexecutar() { return this._informacoesPocao.temDesexecutar; }
  get codPocao() { return this._codPocao; }

  static informacoesPocaoFromCod(codPocao, strQuer)
  {
    // TODO: fazer isso certo (soh fiz pra nao ter que fazer em tudo (depois mudar))
    if (strQuer === "img")
      return {fill: "white", stroke: "white"};
    if (strQuer === "imgMorreu")
      return {fill: "orange", stroke: "orange"};

    switch(codPocao) //nao estah na ordem dos levels
    {
      case TipoPocao.DiminuirTamanhoPers:
        /* if (strQuer === "img") return ;
        if (strQuer === "imgMorreu") return ; */
        return {nome: "Poção anão", ativadoInstant: true, temDesexecutar: true};
      case TipoPocao.MatarObjetos1Tiro:
        return {nome: "Poção Fácil de Matar", ativadoInstant: false, temDesexecutar: true};
      case TipoPocao.RUIMPersPerdeVel:
        return {nome: "Poção Space-Mud", ativadoInstant: true, temDesexecutar: true};
      case TipoPocao.TiroPersMaisRapidoMortal:
        return {nome: "Poção Tiro Master", ativadoInstant: false, temDesexecutar: true};
      case TipoPocao.MatarInimigosNaoEssenc:
        return {nome: "Poção Destruição em Massa", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.ReverterTirosJogoInimDirInim:
        return {nome: "Poção Tiros se Rebelam", ativadoInstant: false, temDesexecutar: false};
      case TipoPocao.GanharPoucaVida:
        return {nome: "Poção Ajuda dos Deuses", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.RUIMPersPerdeVida:
        return {nome: "Poção Burn Alive", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.ReverterTirosJogoInimSeguirInim:
        return {nome: "Poção Fúria contra Inimigos", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.DeixarTempoMaisLento:
        return {nome: "Poção Flash", ativadoInstant: true, temDesexecutar: true};
      case TipoPocao.RUIMTirosPersDirEle:
        return {nome: "Poção Feitiço Contra Feiticeiro", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.GanharMuitaVida:
        return {nome: "Poção os Deuses te Amam", ativadoInstant: false, temDesexecutar: false};
      case TipoPocao.PersMaisRapido:
        return {nome: "Poção Bolt", ativadoInstant: false, temDesexecutar: true};
      case TipoPocao.PersComMissil:
        return {nome: "Poção Míssil", ativadoInstant: true, temDesexecutar: true};
      case TipoPocao.TirarVidaTodosInim:
        return {nome: "Poção Ácido Corrosivo", ativadoInstant: true, temDesexecutar: false};
      case TipoPocao.CongelarInimigos:
        return {nome: "Poção Freeze", ativadoInstant: true, temDesexecutar: true};

      default:
        throw "Esse codigo pocao nao existe!";
    }
  }

  getFormaGeometrica(sohWidthHeight = false)
  //toma em consideracao se this._personagemJahPegou
  {
    let width, height; //1 -> 1.5 | w -> h
    if (this._personagemJahPegou)
    {
      //tamanho padrao (pequeno)
      width = 28;
      height = 42;
    }
    else
    {
      //tamanho padrao (maior)
      width = 26;
      height = 39;
    }
    if (sohWidthHeight) //soh retornar tamanho
      return {width: width, height: height};

    //se tiver que retornar forma geometrica em si
    let formaGeometrica = new Retangulo(undefined,undefined,width,height);
    formaGeometrica.corImg = Pocao.informacoesPocaoFromCod(this._codPocao, "img");
    return formaGeometrica;
  }


 //NA TELA PARA PERSONAGEM PERGAR
  getImgMorreu()
  { return Pocao.informacoesPocaoFromCod(this._codPocao, "imgMorreu"); }

  procMorreu()
  // retorna se jah foi usado
  {
    this._personagemJahPegou = true;

    if (this._informacoesPocao.ativadoInstant)
      ControladorJogo.pers.controladorPocoesPegou.adicionarPocaoUsando(this);
    else
      ControladorJogo.pers.controladorPocoesPegou.adicionarPocao(this);

    return this._informacoesPocao.ativadoInstant;
  }


  //QUANDO USUARIO JAH PEGOU (se for imediatamente) ou quando ele usar (nao imediatamente)
  executarPocao()
  {
    let tempoPocaoResta = null; //quanto tempo a pocao fica ativo ateh desaparecer de novo (em milisegundos)

    switch(this._codPocao)
    {
      case TipoPocao.DiminuirTamanhoPers:
        tempoPocaoResta = 7500;
        ControladorJogo.pers.mudarTamLados(porcentagemSetTam); //50% do tamanho
        break;

      case TipoPocao.MatarObjetos1Tiro:
        //mudanca na propria classe Obstaculo e Inimigo
        tempoPocaoResta = 3000;
        break;

      case TipoPocao.RUIMPersPerdeVel:
        tempoPocaoResta = 5000;
        ControladorJogo.pers.mudarVelocidade(porcentagemSetVelRuim);
        break;

      case TipoPocao.TiroPersMaisRapidoMortal:
        tempoPocaoResta = 8500;

        const infoTiroPersPadrao = ControladorJogo.infoTiroPersPadrao();
        let infoTiroMaisRapido = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMaisRapido.formaGeometrica = new Retangulo(undefined,undefined, 4, 6, {fill: "black", stroke: "black"});
        infoTiroMaisRapido.corImgMorto = {fill: color(30), stroke: color(30)};
        infoTiroMaisRapido.infoAndar = infoTiroPersPadrao.infoAndar;
        infoTiroMaisRapido.infoAndar.qtdAndarY -= qtdTiroAndarMaisRapido;
        infoTiroMaisRapido.mortalidade = infoTiroPersPadrao.mortalidade + qtdTiroMaisMortalidade;

        // TODO: todos os tiros vao ficar bons ou soh um deles? DEPENDE DAS NAVES DO PERSONAGEM. MUDAR FREQUENCIA TAMBEM? (ver desexecutar tambem)
        ControladorJogo.pers.procComTodosContrTiros(function(controladorTirosAtual)
          { controladorTirosAtual.colocarInfoTiroEspecial(infoTiroMaisRapido); });
        break;

      case TipoPocao.MatarInimigosNaoEssenc:
        for (let i = 0; i<ControladorJogo.controladoresInimigos.length; i++)
          if (!ControladorJogo.controladoresInimigos[i].ehDeInimigosEssenciais)
          //soh mata os inimigos nao essenciais
            ControladorJogo.controladoresInimigos[i].matarTodosInim();
        break;

      case TipoPocao.ReverterTirosJogoInimDirInim:
        this._reverterTirosContraInimigos(false);
        break;

      case TipoPocao.GanharPoucaVida:
        ControladorJogo.pers.mudarVida(qtdGanhaPoucaVida);
        break;

      case TipoPocao.RUIMPersPerdeVida:
        ControladorJogo.pers.mudarVida(-qtdPerdeVida);
        break;

      case TipoPocao.ReverterTirosJogoInimSeguirInim:
        this._reverterTirosContraInimigos(true);
        break;

      case TipoPocao.DeixarTempoMaisLento:
        tempoPocaoResta = 5000;
        /* para deixar tempo mais lento
        aqui:
          -> tiros tela. OK
          -> inimigos (incluindo tiros deles, atirar e inimigosSurgindo). OK
          -> obstaculos. OK
          -> Timers (aqui soh os que jah existem). OK
          ps1: verificar se nao existem Timers no PersonagemPrincipal
          ps2: verificar se nao podem ser criados freqFuncs sem ser do pers durante esse tempo

        resto:
          -> quando Timers forem criados. OK
          -> quando tiros(sem ser do personagem), obstaculos ou inimigos(freqFuncAtirar tambem) forem criados. OK
        */
        //tiros tela
        for (let i = 0; i<ControladorJogo.controladoresTirosJogo.length; i++)
          ControladorJogo.controladoresTirosJogo[i].mudarTempo(porcentagemDeixarTempoLento);
        //inimigos (incluindo tiros deles e freqFuncAtirar)
        for (let i = 0; i<ControladorJogo.controladoresInimigos.length; i++)
          ControladorJogo.controladoresInimigos[i].mudarTempo(porcentagemDeixarTempoLento);
        //obstaculos
        for (let i = 0; i<ControladorJogo.controladoresObstaculos.length; i++)
          ControladorJogo.controladoresObstaculos[i].mudarTempo(porcentagemDeixarTempoLento);
        //Timers
        ConjuntoTimers.mudarTempo(porcentagemDeixarTempoLento);
        break;

      case TipoPocao.RUIMTirosPersDirEle:
        ControladorJogo.pers.procComTodosContrTiros(function(controladorTirosAtual)
          {
            controladorTirosAtual.seVirarContraCriador(false);
            controladorTirosAtual.mudarQtdAndarTiros(porcentagemVelTiroSeVoltarPers);
            controladorTirosAtual.mudarMortalidadeTiros(porcentagemMortalidadeTiroSeVoltarPers, true);
          });
        break;

      case TipoPocao.GanharMuitaVida:
        ControladorJogo.pers.mudarVida(qtdGanhaMuitaVida);
        break;

      case TipoPocao.PersMaisRapido:
        tempoPocaoResta = 7500;
        ControladorJogo.pers.mudarVelocidade(porcentagemSetVel);
        break;

      case TipoPocao.PersComMissil: //maior, mais devagar e segue inimigo
        tempoPocaoResta = 4500;

        let infoTiroMissil = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMissil.formaGeometrica = new Retangulo(undefined,undefined, 8, 10, {fill: "white", stroke: "white"});
        infoTiroMissil.corImgMorto = {fill: color(200), stroke: color(200)};
        infoTiroMissil.infoAndar = new InfoAndar(0, -12, TipoAndar.SeguirInimMaisProx);
        infoTiroMissil.mortalidade = 20;

        //setar novo tiro
        ControladorJogo.pers.getControladorTiros(indexArmaMissilPers).colocarInfoTiroEspecial(infoTiroMissil);

        //guardar frequencia e atirarDireto antigo
        this._informacoesNaoMissil = {freq: ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq,
          atirarDireto: ControladorJogo.pers.getConfigAtirar(indexArmaMissilPers).atirarDireto};

        //mudar freqAtirar e atirarDireto
        ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq = freqMissilPers;
        ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).setContadorUltimaEtapa(); //ele jah vai atirar missil em seguida
        ControladorJogo.pers.getConfigAtirar(indexArmaMissilPers).atirarDireto = true;
        break;

      case TipoPocao.TirarVidaTodosInim:
        //passa por todos os controladores de inimigos
        for (let i = 0; i<ControladorJogo.controladoresInimigos.length; i++)
          ControladorJogo.controladoresInimigos[i].tirarVidaTodosInim(qtdTiraVidaTodosInim);
        break;

      case TipoPocao.CongelarInimigos:
        tempoPocaoResta = 5000;
        //congelar todos os inimigos
        for (let i=0; i<ControladorJogo.controladoresInimigos.length; i++)
          ControladorJogo.controladoresInimigos[i].mudarCongelarTodosInim(true);
        break;

      default:
        throw "Esse codigo pocao nao existe!";
    }

    if (tempoPocaoResta !== null) //se tem que desexecutar depois de um tempo, programa esse Timer (pode ser soh uma acao pontual)
    {
      //programa quando quando vai parar com esse pocao
      const _this = this;
      new Timer(function() { _this.desexecutarPocao(); }, tempoPocaoResta, false, false /*pocao transcende o level (mesmo se o level acabar ainda vai ter que desexecutar)*/,
        	{obj: this, atr: "_tempoRestante", estahEmMiliseg: true}); //atualiza quanto tempo falta

      this._tempoTotal = tempoPocaoResta;
      //this._tempoRestante = tempoPocaoResta; nao precisa setar tempoRestante porque Timer jah faz isso
    }
  }
  desexecutarPocao()
  // se sohSaberSeTem, eh soh pra saber se tem ou nao desexecutar (nao desexecuta)
  {
    // SE FOR MUDAR SE UMA POCAO TEM OU NAO DESEXECUTAR COLAR DE NOVO EM "get temDesexecutar()"
    switch(this._codPocao)
    {
      //case TipoPocao.MatarInimigosNaoEssenc: (acao pontual)
      //case TipoPocao.ReverterTirosJogoInimDirInim: (acao pontual)
      //case TipoPocao.GanharPoucaVida: (acao pontual)
      //case TipoPocao.RUIMPersPerdeVida: (acao pontual)
      //case TipoPocao.ReverterTirosJogoInimSeguirInim: (acao pontual)
      //case TipoPocao.RUIMTirosPersDirEle: (acao pontual)
      //case TipoPocao.GanharMuitaVida: (acao pontual)
      //case TipoPocao.TirarVidaTodosInim: (acao pontual)

      case TipoPocao.MatarObjetos1Tiro: //(nao eh acao pontual: porem nao tem que fazer nada de diferente, apenas falar que a pocao acabou - pois como a programacao para isso depende do personagem estar usando esse poder, quando o poder acaba o tempo ele jah para automaticamente)
        break;

      case TipoPocao.DiminuirTamanhoPers:
        ControladorJogo.pers.mudarTamLados(Probabilidade.porcentagemVoltarNormal(porcentagemSetTam)); //200% do tamanho (50%) => vai voltar a 100% (proporcionalmente)
        break;

      case TipoPocao.RUIMPersPerdeVel:
        ControladorJogo.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVelRuim)); //aumenta a velocidade (proporcionalmente)
        break;

      case TipoPocao.TiroPersMaisRapidoMortal:
        // TODO: todos os tiros vao ficar bons ou soh um deles? DEPENDE DAS NAVES DO PERSONAGEM
        ControladorJogo.pers.procComTodosContrTiros(function(controladorTirosAtual)
          { controladorTirosAtual.voltarInfoTiroPadrao(); /*volta tiro padrao (volta uma camada)*/ });
        break;

      case TipoPocao.PersComMissil:
        //volta tiro padrao (volta uma camada)
        ControladorJogo.pers.getControladorTiros(indexArmaMissilPers).voltarInfoTiroPadrao();

        //voltar frequencia e atirarDireto antiga
        ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq = this._informacoesNaoMissil.freq;
        ControladorJogo.pers.getConfigAtirar(indexArmaMissilPers).atirarDireto = this._informacoesNaoMissil.atirarDireto;

        // zerar contagem do freqFunc
        ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).zerarContador();

        //se for atirarDireto, falar que nao pode atirar
        if (!ControladorJogo.pers.getConfigAtirar(indexArmaMissilPers).atirarDireto)
          ControladorJogo.pers.getConfigAtirar(indexArmaMissilPers).podeAtirar = false;

        //deletar variavel que guardava frequencia antiga
        delete this._informacoesNaoMissil;
        break;

      case TipoPocao.PersMaisRapido:
        ControladorJogo.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVel)); //diminui a velocidade de novo (proporcionalmente)
        break;

      case TipoPocao.CongelarInimigos:
        //descongelar todos os inimigos (voltar etapa)
        for (let i=0; i<ControladorJogo.controladoresInimigos.length; i++)
          ControladorJogo.controladoresInimigos[i].mudarCongelarTodosInim(false);
        break;

      case TipoPocao.DeixarTempoMaisLento:
      //voltar tempo ao normal
        const porcVoltarTempoNormal = Probabilidade.porcentagemVoltarNormal(porcentagemDeixarTempoLento);
        //tiros tela
        for (let i = 0; i<ControladorJogo.controladoresTirosJogo.length; i++)
          ControladorJogo.controladoresTirosJogo[i].mudarTempo(porcVoltarTempoNormal);
        //inimigos (incluindo tiros deles e freqFuncAtirar)
        for (let i = 0; i<ControladorJogo.controladoresInimigos.length; i++)
          ControladorJogo.controladoresInimigos[i].mudarTempo(porcVoltarTempoNormal);
        //obstaculos
        for (let i = 0; i<ControladorJogo.controladoresObstaculos.length; i++)
          ControladorJogo.controladoresObstaculos[i].mudarTempo(porcVoltarTempoNormal);
        //Timers
        ConjuntoTimers.mudarTempo(porcVoltarTempoNormal);
        break;

      default:
        console.trace();
    }

    ControladorJogo.pers.controladorPocoesPegou.acabouUsarPocao();
  }


  //auxiliares
  _reverterTirosContraInimigos(seguir)
  {
    //tiros tela
    for (let i = 0; i<ControladorJogo.controladoresTirosJogo.length; i++)
      ControladorJogo.controladoresTirosJogo[i].seVirarContraCriador(seguir);

    //tiros dos inimigos
    for (let i = 0; i<ControladorJogo.controladoresInimigos.length; i++)
      ControladorJogo.controladoresInimigos[i].virarTirosContraCriador(seguir);
  }

  get tempoTotal() { return this._tempoTotal; }
  get tempoRestante() { return this._tempoRestante; }
}
//ps: tudo que eh execucao da pocao feito fora dessa classe estah escrito: "PARTE DA EXECUCAO DA POCAO"...

const TipoPocao = {
  "DiminuirTamanhoPers": 1,
  "TiroPersMaisRapidoMortal": 2,

  "RUIMPersPerdeVel": 3,
  "PersMaisRapido": 4,

  "PersComMissil": 5,
  "GanharPoucaVida": 6,

  "RUIMPersPerdeVida": 7,
  "MatarObjetos1Tiro": 8,

  "MatarInimigosNaoEssenc": 9,

  "TirarVidaTodosInim": 10,
  "GanharMuitaVida": 11,

  "ReverterTirosJogoInimDirInim": 12,
  "RUIMTirosPersDirEle": 13,

  "DeixarTempoMaisLento": 14,

  "ReverterTirosJogoInimSeguirInim": 15,

  "CongelarInimigos": 16
};
/* IDEIAS DE POCOES:
- Poção para diminuir tamanho do personagem (imediatamente)
- Poção para tiro do pers andar mais rápido e ser mais mortal (nao imediatamente)
- RUIM: Pocao para personagem perder velocidade
- Poção para deixar personagem mais rápido (nao imediatamente)
- Poção para personagem ter tiro de missil (imediatamente)
- Poção para ganhar um pouco de vida (imediatamente)
- RUIM: Pocao personagem perde vida
- Poção para matar com um tiro todos os inimigos nao essenciais e obstaculos da tela (nao imediatamente)
- Poção para matar todos os inimigos nao essenciais (imediatamente)
- Poção para tirar um pouco de vida de todos os inimigos (imediatamente)
- Poção para ganhar muita vida (nao imediatamente)
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e direcao o inimigo mais proximo (nao imediatamente)
- RUIM: Pocao para os tiros do personagem se voltarem na direcao dele (feitico contra o feiticeiro)
- Poção para deixar o tempo mais lento (tudo anda X%) (imediatamente)
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e seguindo o inimigo mais proximo (imediatamente)
- Poção para congelar inimigos (imediatamente)
*/


//quando personagem ainda nao pegou
class ObjetoTelaPocao
{
  constructor(x, y, pocao, formaGeomPocao)
  // nao faz clone no pocao
  {
    //backend propriamente dito
    this._pocao = pocao;

    //tela
    if (formaGeomPocao === undefined)
      this._formaGeometrica = this._pocao.getFormaGeometrica();
    else
      this._formaGeometrica = formaGeomPocao;
    this._formaGeometrica.x = x;
    this._formaGeometrica.y = y;

    //vivo
    this._vivo = true;
  }

  get vivo() { return this._vivo; }

  intersectaPers(qtdAndarX, qtdAndarY)
  {
    if (qtdAndarX === undefined && qtdAndarY === undefined)
      return Interseccao.interseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica);
    else
      return Interseccao.vaiTerInterseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica, qtdAndarX, qtdAndarY);
  }

  morreu()
  //jah faz o procedimento depois de morrer (jah faz o procedimento ou deixa a pocao guardado para o usuario quiser usar)
  {
    this._vivo = false;
    this._formaGeometrica.corImg = this._pocao.getImgMorreu(); //mudar para imgMorto
    this._pocao.procMorreu(); //faz o procedimento depois de morrer
  }

  draw()
  { this._formaGeometrica.draw(); }
}

const distanciaMinPersPocao = 350; //calculado a distancia entre os centro-de-massas
const tempoVaiFicarTela = 7000;
const qtdPocoesUltimosLvs = 5; //se certa probabilidade vai escolher uma pocao dentro os 5 ultimos
class ControladorPocaoTela
{
  constructor()
  {
    //futuro atributo: this._objPocao (nao precisa gastar memoria agora)
    this._jahProgramouDeixarPocaoTela = false; //se jah criou o Timer para colocar Pocao tela
    this._funcCamadasColTirPocaoTempo = new FuncEmCamadas();
  }

  //antes da pocao ter sido adicionado a tela
  colocarPocaoEmTempoSeChance(level)
  //esse metodo vai adicionar uma pocao randomico possivel depois de certo tempo (dependendo de uma probabilidade para colocar ou nao pocoes na tela naquele level) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
  {
    if (this._jahProgramouDeixarPocaoTela || //se jah fez um timer para colocar pocao na tela
     !ControladorPocaoTela._probabilidadeExistirPocaoFromLevel(level)) // cada level tem uma chance de ter pocao diferente (os primeiros levels tem menos, e vai aumentando)
      return;

    // estah programando para colocar poder na tela (soh pode programar para colocar outro quando esse jah tiver sumido)
    this._jahProgramouDeixarPocaoTela = true;

    //random de tempo para colocar na tela e jah setar timer para colocar pocao na tela
    const qntTempoFaltaPraColocar = Math.myrandom(100, (ControladorJogo.tempoEstimadoLevel(level)-1)*1000 - tempoVaiFicarTela - tempoPocaoAparecerDuranteLv); //no minimo 0.1 segundos e no maximo para acabar um segundo antes do tempo previsto para o level
    const _this = this;
    new Timer(function() {
      _this._colocarPocaoTela(level);
    }, qntTempoFaltaPraColocar, false, false /*pocao transcende o level*/);

    //programar tira-lo depois de certo tempo
    new Timer(function() { _this.tirarPocaoTela(); }, tempoVaiFicarTela + qntTempoFaltaPraColocar + tempoPocaoAparecerDuranteLv, false, false /*pocao transcende o level*/);
  }
  _colocarPocaoTela(level)
  {
    this._funcCamadasColTirPocaoTempo.subirCamada();

    //pega todos as pocoes disponiveis naquele level
    const pocoesPossiveis = ControladorPocaoTela._pocoesPossiveisFromLevel(level);

    //deixar mais provavel pegar pocoes dos ultimos levels (3/5 de chance)
    let qtdPocoesPossiveis;
    if (pocoesPossiveis.length > qtdPocoesUltimosLvs && Probabilidade.chance(3,5))
    //se ha mais pocoes disponiveis do que [qtdPocoesUltimosLvs] E se a chance de 3/5 (entao ele pega soh um dos 5 primeiros)
    //os melhores pocoes estao no comeco do vetor (os ultimos levels colocam a pocao antes)
      qtdPocoesPossiveis = qtdPocoesUltimosLvs;
    else
      qtdPocoesPossiveis = pocoesPossiveis.length;

    //escolher pocao randomly
    const pocao = new Pocao(pocoesPossiveis[Math.myrandom(0, qtdPocoesPossiveis)]); //cria pocao a partir do codigo

    //ponto onde pocao nao estah em cima do pers nem muuito perto dele
    const pontoPode = this._pontoPodeColocar(pocao.getFormaGeometrica(true));

    //fazer pocao ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    const _this = this;
    const infoObjAparecendo = new InfoObjetoTelaAparecendo(false, true, undefined, pocao.getFormaGeometrica());
    this._objPocao = new ObjetoTelaAparecendo(pontoPode, infoObjAparecendo, function(){ //(funcao callback)
      //adicionar objPocao propriamente dito (e jah tirando o ObjetoTelaAparecendo)
      _this._objPocao = new ObjetoTelaPocao(pontoPode.x, pontoPode.y, pocao, _this._objPocao.formaGeometrica);
    });
  }

  //onde colocar
  _pontoPodeColocar(medidasFormaGeom)
  {
    let pontoPode = new Ponto(0, 0);
    do
    {
      pontoPode.x = Math.myrandom(0, width - medidasFormaGeom.width);
      pontoPode.y = Math.myrandom(0, height - heightVidaUsuario - medidasFormaGeom.height);
    }while(!this._estahLongeSuficientePers(pontoPode, medidasFormaGeom));
    return pontoPode;
  }
  _estahLongeSuficientePers(pontoPode, medidasFormaGeom)
  {
    //ve se estah intersectando
    if (Interseccao.interseccaoRetDesmontado(ControladorJogo.pers.formaGeometrica.x, ControladorJogo.pers.formaGeometrica.y,
      ControladorJogo.pers.formaGeometrica.width, ControladorJogo.pers.formaGeometrica.height,
      pontoPode.x, pontoPode.y, medidasFormaGeom.width, medidasFormaGeom.height))
      return false;

    //calcula distancia do centro de massa do personagem ateh o centro de massa da pocao
    return ControladorJogo.pers.formaGeometrica.centroMassa.distancia
      (pontoPode.mais({x: medidasFormaGeom.width/2, y: medidasFormaGeom.height/2})) //centroMassa da pocao
        >= distanciaMinPersPocao;
  }

  //qual pocao
  static _pocoesPossiveisFromLevel(level)
  //retorna um vetor com todos os indexes de pocoes possiveis
  {
    let pocoesPossiveis = [];
    let qtd = 0;

    if (level > 12) level = 12;

    switch(level)
    {
      case 12:
        pocoesPossiveis[qtd++] = TipoPocao.CongelarInimigos;
      case 11:
        pocoesPossiveis[qtd++] = TipoPocao.ReverterTirosJogoInimSeguirInim;
      case 10:
        pocoesPossiveis[qtd++] = TipoPocao.DeixarTempoMaisLento;
      case 9:
        pocoesPossiveis[qtd++] = TipoPocao.RUIMTirosPersDirEle;
        pocoesPossiveis[qtd++] = TipoPocao.ReverterTirosJogoInimDirInim;
      case 8:
        pocoesPossiveis[qtd++] = TipoPocao.TirarVidaTodosInim;
        pocoesPossiveis[qtd++] = TipoPocao.GanharMuitaVida;
      case 7:
        pocoesPossiveis[qtd++] = TipoPocao.MatarInimigosNaoEssenc;
      case 6:
        pocoesPossiveis[qtd++] = TipoPocao.RUIMPersPerdeVida;
        pocoesPossiveis[qtd++] = TipoPocao.MatarObjetos1Tiro;
      case 5:
        pocoesPossiveis[qtd++] = TipoPocao.PersComMissil;
        pocoesPossiveis[qtd++] = TipoPocao.GanharPoucaVida;
      case 4:
      case 3:
        pocoesPossiveis[qtd++] = TipoPocao.RUIMPersPerdeVel;
        pocoesPossiveis[qtd++] = TipoPocao.PersMaisRapido;
      case 2:
      case 1:
        pocoesPossiveis[qtd++] = TipoPocao.DiminuirTamanhoPers;
        pocoesPossiveis[qtd++] = TipoPocao.TiroPersMaisRapidoMortal;
        break;
    }

    return pocoesPossiveis;
  }

  //probabilidade
  static _probabilidadeExistirPocaoFromLevel(level)
  {
    if (level > 13) level = 13; //para entrar no ultimo case
    switch(level)
    {
      case 13:
        return true; //100%
      case 12:
      case 11:
        return Probabilidade.chance(9,10); //90%
      case 10:
      case 9:
        return Probabilidade.chance(4,5); //80%
      case 8:
      case 7:
        return Probabilidade.chance(7,10); //70%
      case 6:
      case 5:
      case 4:
        return Probabilidade.chance(3,5); //60%
      case 3:
        return Probabilidade.chance(2,5); //40%
      case 2:
        return Probabilidade.chance(3,10); //30%
      case 1:
        return Probabilidade.chance(1,5); //20%
    }
  }

  tirarPocaoTela(tirouPorFaltaTempo = true)
  {
    if (tirouPorFaltaTempo && (!this._funcCamadasColTirPocaoTempo.descerCamada() || this._objPocao === undefined))
      // se ainda nao eh a hora de tirar (por causa das camadas) ou se pocao jah foi tirada ou se ele jah estah morto
        return;
    delete this._objPocao;
    this._jahProgramouDeixarPocaoTela = false;
  }

  //depois que pocao jah foi adicionado a tela
  verificarPersPegouPocao(qtdAndarX, qtdAndarY)
  {
    if (this._objPocao !== undefined && this._objPocao instanceof ObjetoTelaPocao && //se for ObjetoTelaAparecendo nao interage com o meio
      !ControladorJogo.pers.controladorPocoesPegou.estahUsandoPocao && //soh pode pegar a pocao se pers nao tiver usando nenhuma no momento
      this._objPocao.intersectaPers(qtdAndarX, qtdAndarY))
      this._objPocao.morreu(); //ainda nao tira da tela (soh quando desenhar a ultima vez)
  }

  draw()
  {
    if (this._objPocao !== undefined)
    {
      const criouObjetoPocao = this._objPocao.draw();
      if (criouObjetoPocao === true) this._objPocao.draw(); //printa objeto pocao se ele acabou de ser criado (ObjetoTelaAparecendo nao vai ser printado se jah acabou seu tempo)

      //se morreu, mostra o objeto pela ultima vez e depois tira ele
      if (!(this._objPocao instanceof ObjetoTelaAparecendo) && !this._objPocao.vivo)
        this.tirarPocaoTela(false);
    }
  }
}


//quando personagem jah pegou
//frontend
const heightCadaPocao = 50;
const qtdSubirAdicionarPocao = 8;
const tempoNomePocaoApareceTela = 2500;

const xPocoes = 26;
var yPrimeiroPocao; //vai como uma constante quando ControladorPocoesPers for instanciado (porque o height nao estah definido aqui ainda)

class ObjPocaoPers
{
  constructor(pocao, qtdPocoes)
  //qtdPocoes eh com esse jah
  {
    //backend
    this._pocao = pocao;

    //tela
    this._formaGeometrica = this._pocao.getFormaGeometrica();
    this._formaGeometrica.x = xPocoes;
    this._formaGeometrica.y = yPrimeiroPocao;

    this._estahSendoUsado = false;
  }

  comecouAUsar()
  { this._estahSendoUsado = true; }
  get estahSendoUsado() { return this._estahSendoUsado; }

  get pocao()
  { return this._pocao; }

  mudarY(instrucao)
  //InstrucaoArrumarLugar: removeu, comecou a usar, adicionou
  {
    if (instrucao !== InstrucaoArrumarLugar.comecouAUsar) //adicionou ou removeu
      this._formaGeometrica.y += heightCadaPocao*(instrucao===InstrucaoArrumarLugar.adicionou?-1:1);
    else //comecou a usar
      this._formaGeometrica.y -= qtdSubirAdicionarPocao / (this._estahSendoUsado?2:1);
      //ps: se estah sendo usado soh sobe metade (soh pela metade de baixo do circlo)
  }

  draw()
  {
    //desenha semi-circulo antes (fica embaixo)
    if (this._estahSendoUsado)
    {
      //proporcao
      const porcentagemDisponivel = this._pocao.tempoRestante / this._pocao.tempoTotal;

      //visual/tela
      fill(100);
      const diametro = 60;
      const x = this._formaGeometrica.x + 13.8;
      const y = this._formaGeometrica.y + 21;
      const cor = "blue";

      const tamStrokeGrosso = 7;
      const tamStrokeFino = 3;

      if (porcentagemDisponivel === 1)
      {
        strokeWeight(tamStrokeGrosso);
        stroke(cor);
        ellipse(x, y, diametro);
      }else
      {
        strokeWeight(tamStrokeFino);
        stroke(30);
        ellipse(x, y, diametro);

        strokeWeight(tamStrokeGrosso);
        stroke(cor);
        arc(x, y, diametro, diametro, -PI/2, porcentagemDisponivel*2*PI - PI/2);
        // (x, y, "diametro width", "diametro height", angulo em radiano onde comeca, angulo em radiano onde termina o circulo)
        // o circulo trigonometrico usado deve ser no sentido contrario (aumenta em sentido horario)
      }
      strokeWeight(tamStroke);

      noStroke(); fill(255);
      textSize(17);
      // quanto tempo falta (tempoRestante estah em milisegundos)
      text((this._pocao.tempoRestante/1000).toFixed(1) + "s", x + diametro/2 - 6, y + diametro/2 + 8); //quanto tempo falta
    }

    //desenha pocao em si
    this._formaGeometrica.draw();
  }
}

//backend
const maxPocoesAcumulados = 4;
class ControladorPocoesPers
{
  constructor()
  {
    this._pocoesPers = new ListaDuplamenteLigada();
    //os que nao estao sendo usados e o que estah (se houver)

    //inicializa a variavel e a faz funcionar como uma contante (nao pode ser contante em si porque depende de height, que nao tem um valor literal)
    yPrimeiroPocao = height - heightVidaUsuario - 10;
    Object.freeze(yPrimeiroPocao);

    // se vai escrever o nome da primeira pocao, que estah sendo usada
    const _this = this;
    this._funcEscreverNomePocao = new FuncEmCamadas();
    //futuro atributo: this._nomePocaoEscrever;
  }

  get codPocaoSendoUsado()
  {
    if (this._pocoesPers.qtdElem === 0 || !this._pocoesPers.primeiroElemento.estahSendoUsado)
    //se personagem nao tem nenhum pocao ou se a primeira pocao nao estah sendo usado
      return null;
    return this._pocoesPers.primeiroElemento.pocao.codPocao;
  }
  get estahUsandoPocao() { return this.codPocaoSendoUsado !== null; }

  adicionarPocaoUsando(pocao)
  //jah tem que ter verificado se nao tem um usando no momento
  //soh chama essa funcao se nao estah usando nenhuma pocao
  {
    this.adicionarPocao(pocao, false); //nao remove a pocao se jah tiver no maximo
    this.usarPocaoAtual();
  }
  adicionarPocao(pocao, removerPorSePrec = true)
  {
    this._pocoesPers.inserirNoComeco(new ObjPocaoPers(pocao, this._pocoesPers.qtdElem+1));

    if (removerPorSePrec && this._pocoesPers.qtdElem >= maxPocoesAcumulados + 1)
    //se tem mais pocoes do que pode
      this._pocoesPers.removerDoFinal();

    //arrumar lugar das pocoes agora que adicionou um embaixo
    this._arrumarLugarPocoes(InstrucaoArrumarLugar.adicionou);
  }

  usarPocaoAtual()
  {
    if (this._pocoesPers.qtdElem > 0 && !this._pocoesPers.primeiroElemento.estahSendoUsado)
    // se tem alguma pocao para usar && se nao tem nenhuma pocao sendo usado (soh pode usar uma pocao por vez)
    {
      this._pocoesPers.primeiroElemento.pocao.executarPocao(); //executar pocao

      this._programarParaEscreverNomePocao(); //vai mostrar o nome da pocao tendo ela um desexecutar ou nao
      if (this._pocoesPers.primeiroElemento.pocao.temDesexecutar)
      {
        this._pocoesPers.primeiroElemento.comecouAUsar(); //dizer que comecou a usar a pocao
        //arrumar lugar das pocoes agora que comecou a usar (circulo em volta)
        this._arrumarLugarPocoes(InstrucaoArrumarLugar.comecouAUsar);
      }else
        this.acabouUsarPocao();
    }
  }
  _programarParaEscreverNomePocao()
  {
    //escrever o nome da pocao na tela por um certo periodo de tempo
    this._funcEscreverNomePocao.subirCamada();
    this._nomePocaoEscrever = this._pocoesPers.primeiroElemento.pocao.nome;

    // programar para tirar nome da tela
    //ps: tem que ser no esquema de camadas pois se o personagem ativa uma pocao instantanea e logo depois outra, nao daria certo. Dessa maneira da
    const _this = this;
    new Timer(function()
      {
        if (_this._funcEscreverNomePocao.descerCamada())
          delete _this._nomePocaoEscrever;
      }, tempoNomePocaoApareceTela, false, false /*transcende o level*/);
  }

  acabouUsarPocao()
  {
    //remover pocao que acabou de se usado
    this._pocoesPers.removerDoComeco();
    //(agora a primeira pocao do personagem nao estah sendo usado mais)

    //arrumar lugar das pocoes agora que removeu o de baixo
    this._arrumarLugarPocoes(InstrucaoArrumarLugar.removeu);

    //personagem podia estar em cima da pocao mas nao poder pegar porque jah estava usando um, quando esse acaba verifica se pode pegar instantaneamente (sem esperar ele andar)
    ControladorJogo.controladorPocaoTela.verificarPersPegouPocao();
  }

  _arrumarLugarPocoes(instrucao)
  //instrucao: removeu, comecou a usar ou adicionou
  {
    for (this._pocoesPers.colocarAtualComeco(); !this._pocoesPers.atualEhNulo; this._pocoesPers.andarAtual())
      this._pocoesPers.atual.mudarY(instrucao);
  }

  //desenhar todos as pocoes
  draw()
  {
    for (this._pocoesPers.colocarAtualComeco(); !this._pocoesPers.atualEhNulo; this._pocoesPers.andarAtual())
      this._pocoesPers.atual.draw();

    if (this._nomePocaoEscrever !== undefined)
    //nao necessariamente a primeira pocao estara sendo usada (pois se ela fosse instantanea ou muito rapida, nao daria certo)
    {
      // TODO: design
      noStroke();
      textSize(30);
      text(this._nomePocaoEscrever, width/2 - 10, (height-heightCadaPocao)/2 - 30); //escrever nome da pocao
    }
  }
}

const InstrucaoArrumarLugar = {"removeu": 0, "comecouAUsar": 1, "adicionou": 2};
