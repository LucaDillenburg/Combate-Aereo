//constantes executarPocao
const porcentagemSetTam = 0.5;
const porcentagemSetVelRuim = 0.7;
const porcentagemDeixarTempoLento = 0.5;

const qtdAndarMaisRapido = 7;
const porcentagemSetVel = 1.4;
const qtdTiroMaisMortalidade = 3;

const qtdGanhaPoucaVida = 7;
const qtdPerdeVida = 10;
const qtdGanhaMuitaVida = 12;

const qtdTiraVidaTodosInim = 40;

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
  get codPocao() { return this._codPocao; }

  static informacoesPocaoFromCod(codPocao, strQuer)
  {
    // TODO: fazer isso certo (soh fiz pra nao ter que fazer em tudo (depois mudar))
    if (strQuer === "img")
      return {fill: color("white"), stroke: color("white")};
    if (strQuer === "imgMorreu")
      return {fill: color("orange"), stroke: color("orange")};

    switch(codPocao) //nao estah na ordem dos levels
    {
      case TipoPocao.DiminuirTamanhoPers:
        /* if (strQuer === "img") return ;
        if (strQuer === "imgMorreu") return ; */
        return {nome: "Poção anão", ativadoInstant: true};
      case TipoPocao.MatarObjetos1Tiro:
        return {nome: "Poção Fácil de Matar", ativadoInstant: false};
      case TipoPocao.RUIMPersPerdeVel:
        return {nome: "Poção Space-Mud", ativadoInstant: true};
      case TipoPocao.TiroPersMaisRapidoMortal:
        return {nome: "Poção Tiro Master", ativadoInstant: false};
      case TipoPocao.MatarInimigosNaoEssenc:
        return {nome: "Poção Destruição em Massa", ativadoInstant: true};
      case TipoPocao.ReverterTirosJogoInimDirInim:
        return {nome: "Poção Tiros se Rebelam", ativadoInstant: false};
      case TipoPocao.GanharPoucaVida:
        return {nome: "Poção Ajuda dos Deuses", ativadoInstant: true};
      case TipoPocao.RUIMPersPerdeVida:
        return {nome: "Poção Burn Alive", ativadoInstant: true};
      case TipoPocao.ReverterTirosJogoInimSeguirInim:
        return {nome: "Poção Fúria contra Inimigos", ativadoInstant: true};
      case TipoPocao.DeixarTempoMaisLento:
        return {nome: "Poção Flash", ativadoInstant: true};
      case TipoPocao.RUIMTirosPersDirEle:
        return {nome: "Poção Feitiço Contra Feiticeiro", ativadoInstant: true};
      case TipoPocao.GanharMuitaVida:
        return {nome: "Poção os Deuses te Amam", ativadoInstant: false};
      case TipoPocao.PersMaisRapido:
        return {nome: "Poção Bolt", ativadoInstant: false};
      case TipoPocao.PersComMissil:
        return {nome: "Poção Míssil", ativadoInstant: true};
      case TipoPocao.TirarVidaTodosInim:
        return {nome: "Poção Ácido Corrosivo", ativadoInstant: true};
      case TipoPocao.CongelarInimigos:
        return {nome: "Poção Freeze", ativadoInstant: true};

      default:
        throw "Esse codigo pocao nao existe!";
    }
  }

  getFormaGeometrica(sohWidthHeight = false)
  //toma em consideracao se this._personagemJahPegou
  {
    let width, height;
    if (this._personagemJahPegou)
    {
      //tamanho padrao (pequeno)
      width = 7.5;
      height = 15;
    }
    else
    {
      //tamanho padrao (maior)
      width = 15;
      height = 30;
    }
    if (sohWidthHeight) //soh retornar tamanho
      return {width: width, height: height};

    //se tiver que retornar forma geometrica em si
    let formaGeometrica = new Retangulo(0,0,width,height);
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
      ConjuntoObjetosTela.pers.controladorPocoesPegou.adicionarPocaoUsando(this);
    else
      ConjuntoObjetosTela.pers.controladorPocoesPegou.adicionarPocao(this);

    return this._informacoesPocao.ativadoInstant;
  }


  //QUANDO USUARIO JAH PEGOU (se for imediatamente) ou quando ele usar (nao imediatamente)
  executarPocao()
  //usar apenas ConjuntoObjetosTela
  {
    let tempoPocaoResta = null; //quanto tempo a pocao fica ativo ateh desaparecer de novo (em milisegundos)

    switch(this._codPocao)
    {
      case TipoPocao.DiminuirTamanhoPers:
        tempoPocaoResta = 7500;
        ConjuntoObjetosTela.pers.mudarTamLados(porcentagemSetTam); //50% do tamanho
        break;

      case TipoPocao.MatarObjetos1Tiro:
        //mudanca na propria classe Obstaculo e Tiro
        break;

      case TipoPocao.RUIMPersPerdeVel:
        tempoPocaoResta = 5000;
        ConjuntoObjetosTela.pers.mudarVelocidade(porcentagemSetVelRuim);
        break;

      case TipoPocao.TiroPersMaisRapidoMortal:
        tempoPocaoResta = 8500;

        const infoTiroPersPadrao = ControladorJogo.infoTiroPersPadrao();
        let infoTiroMaisRapido = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMaisRapido.formaGeometrica = new Retangulo(0,0, 4, 6, {fill: color("black"), stroke: color("black")});
        infoTiroMaisRapido.corImgMorto = {fill: color(30), stroke: color(30)};
        infoTiroMaisRapido.infoAndar = infoTiroPersPadrao.infoAndar;
        infoTiroMaisRapido.infoAndar.qtdAndarY -= qtdAndarMaisRapido;
        infoTiroMaisRapido.mortalidade = infoTiroPersPadrao.mortalidade + qtdTiroMaisMortalidade;

        ConjuntoObjetosTela.pers.controladorTiros.colocarInfoTiroEspecial(infoTiroMaisRapido);
        break;

      case TipoPocao.MatarInimigosNaoEssenc:
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].persMatouTodosInimNaoEssenc();
        break;

      case TipoPocao.ReverterTirosJogoInimDirInim:
        this._reverterTirosContraInimigos(false);
        break;

      case TipoPocao.GanharPoucaVida:
        ConjuntoObjetosTela.pers.mudarVida(qtdGanhaPoucaVida);
        break;

      case TipoPocao.RUIMPersPerdeVida:
        ConjuntoObjetosTela.pers.mudarVida(-qtdPerdeVida);
        break;

      case TipoPocao.ReverterTirosJogoInimSeguirInim:
        this._reverterTirosContraInimigos(true);
        break;

      case TipoPocao.DeixarTempoMaisLento:
        tempoPocaoResta = 5000;
        /* para deixar tempo mais lento
        aqui:
          -> tiros tela. OK
          -> inimigos (incluindo tiros deles e atirar). OK
          -> obstaculos. OK
          -> Timers (aqui soh os que jah existem). OK
          ps1: verificar se nao existem Timers no PersonagemPrincipal
          ps2: verificar se nao podem ser criados freqFuncs sem ser do pers durante esse tempo

        resto:
          -> quando Timers forem criados. OK
          -> quando tiros(sem ser do personagem), obstaculos ou inimigos(freqFuncAtirar tambem) forem criados. OK
        */
        //tiros tela
        for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
          ConjuntoObjetosTela.controladoresTirosJogo[i].mudarTempo(porcentagemDeixarTempoLento);
        //inimigos (incluindo tiros deles e freqFuncAtirar)
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarTempo(porcentagemDeixarTempoLento);
        //obstaculos
        for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
          ConjuntoObjetosTela.controladoresObstaculos[i].mudarTempo(porcentagemDeixarTempoLento);
        //Timers
        ConjuntoTimers.mudarTempo(porcentagemDeixarTempoLento);
        break;

      case Tipo.RUIMTirosPersDirEle:
        ConjuntoObjetosTela.pers.controladorTiros.seVirarContraCriador(false);
        break;

      case TipoPocao.GanharMuitaVida:
        ConjuntoObjetosTela.pers.mudarVida(qtdGanhaMuitaVida);
        break;

      case TipoPocao.PersMaisRapido:
        tempoPocaoResta = 7500;
        ConjuntoObjetosTela.pers.mudarVelocidade(porcentagemSetVel);
        break;

      case TipoPocao.PersComMissil: //maior, mais devagar e segue inimigo
        tempoPocaoResta = 4500;

        let infoTiroMissil = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMissil.formaGeometrica = new Retangulo(0,0, 8, 10, {fill: color("white"), stroke: color("white")});
        infoTiroMissil.corImgMorto = {fill: color(200), stroke: color(200)};
        infoTiroMissil.infoAndar = new InfoAndar(0, -12, TipoAndar.SeguirInimMaisProx);
        infoTiroMissil.mortalidade = 20;

        ConjuntoObjetosTela.pers.controladorTiros.colocarInfoTiroEspecial(infoTiroMissil);
        break;

      case TipoPocao.TirarVidaTodosInim:
        //passa por todos os controladores de inimigos
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].tirarVidaTodosInim(qtdTiraVidaTodosInim);
        break;

      case TipoPocao.CongelarInimigos:
        //congelar todos os inimigos
        for (let i=0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarCongelarTodosInim(true);
        break;

      default:
        throw "Esse codigo pocao nao existe!";
    }

    if (tempoPocaoResta !== null) //se tem que desexecutar depois de um tempo, programa esse Timer (pode ser soh uma acao pontual)
    {
      //programa quando quando vai parar com esse pocao
      const _this = this;
      new Timer(function() { _this.desexecutarPocao(); }, tempoPocaoResta, false, false,
        	{obj: this, atr: "_tempoTotal", estahEmMiliseg: false}); //atualiza quanto tempo falta

      this._tempoTotal = tempoPocaoResta;
      //this._tempoRestante = tempoPocaoResta; nao precisa setar tempoRestante porque Timer jah faz isso
    }
  }
  desexecutarPocao()
  {
    switch(this._codPocao)
    {
      //case TipoPocao.MatarObjetos1Tiro: (acao pontual)
      //case TipoPocao.MatarInimigosNaoEssenc: (acao pontual)
      //case TipoPocao.ReverterTirosJogoInimDirInim: (acao pontual)
      //case TipoPocao.GanharPoucaVida: (acao pontual)
      //case TipoPocao.RUIMPersPerdeVida: (acao pontual)
      //case TipoPocao.ReverterTirosJogoInimSeguirInim: (acao pontual)
      //case Tipo.RUIMTirosPersDirEle: (acao pontual)
      //case TipoPocao.GanharMuitaVida: (acao pontual)
      //case TipoPocao.TirarVidaTodosInim: (acao pontual)

      case TipoPocao.DiminuirTamanhoPers:
        ConjuntoObjetosTela.pers.mudarTamLados(Probabilidade.porcentagemVoltarNormal(porcentagemSetTam)); //200% do tamanho (50%) => vai voltar a 100% (proporcionalmente)
        break;

      case TipoPocao.RUIMPersPerdeVel:
        ConjuntoObjetosTela.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVelRuim)); //aumenta a velocidade (proporcionalmente)
        break;

      case TipoPocao.TiroPersMaisRapidoMortal:
      case TipoPocao.PersComMissil:
        ConjuntoObjetosTela.pers.controladorTiros.voltarInfoTiroPadrao(); //volta tiro padrao (volta uma camada)
        break;

      case TipoPocao.PersMaisRapido:
        ConjuntoObjetosTela.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVel)); //diminui a velocidade de novo (proporcionalmente)
        break;

      case TipoPocao.CongelarInimigos:
        //descongelar todos os inimigos (voltar etapa)
        for (let i=0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarCongelarTodosInim(false);
        break;

      case TipoPocao.DeixarTempoMaisLento:
      //voltar tempo ao normal
        const porcVoltarTempoNormal = Probabilidade.porcentagemVoltarNormal(porcentagemDeixarTempoLento);
        //tiros tela
        for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
          ConjuntoObjetosTela.controladoresTirosJogo[i].mudarTempo(porcVoltarTempoNormal);
        //inimigos (incluindo tiros deles e freqFuncAtirar)
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarTempo(porcVoltarTempoNormal);
        //obstaculos
        for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
          ConjuntoObjetosTela.controladoresObstaculos[i].mudarTempo(porcVoltarTempoNormal);
        //Timers
        ConjuntoTimers.mudarTempo(porcVoltarTempoNormal);
        break;

      default:
        throw "Esse codigo pocao nao existe!";
    }

    ConjuntoObjetosTela.pers.controladorPocoesPegou.acabouUsarPocao();
  }

  //auxiliares
  _reverterTirosContraInimigos(seguir)
  {
    //tiros tela
    for (let i = 1; i<ConjuntoObjetosTela.controladoresTirosJogo; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[i].seVirarContraCriador(seguir);

    //tiros dos inimigos
    for (let i = 1; i<ConjuntoObjetosTela.controladoresInimigos; i++)
      ConjuntoObjetosTela.controladoresInimigos[i].controladorTiros.seVirarContraCriador(seguir);
  }

  get tempoTotal() { return this._tempoTotal; }
  get tempoRestante() { return this._tempoRestante.toFixed(1); }
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
  Level 3
- Poção para diminuir tamanho do personagem (imediatamente)
- Poção para tiro do pers andar mais rápido e ser mais mortal (nao imediatamente)

  Level 4
- RUIM: Pocao para personagem perder velocidade
- Poção para deixar personagem mais rápido (nao imediatamente)

  Level 5
- Poção para personagem ter tiro de missil (imediatamente)
- Poção para ganhar um pouco de vida (imediatamente)

  Level 6
- RUIM: Pocao personagem perde vida
- Poção para matar com um tiro todos os inimigos nao essenciais e obstaculos da tela (nao imediatamente)

  Level 7
- Poção para matar todos os inimigos nao essenciais (imediatamente)

  Level 8
- Poção para tirar um pouco de vida de todos os inimigos (imediatamente)
- Poção para ganhar muita vida (nao imediatamente)

  Level 9
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e direcao o inimigo mais proximo (nao imediatamente)
- RUIM: Pocao para os tiros do personagem se voltarem na direcao dele (feitico contra o feiticeiro)

  Level 10
FALTA - Poção para deixar o tempo mais lento (tudo anda X%) (imediatamente)

  Level 11
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e seguindo o inimigo mais proximo (imediatamente)

  Level 12
- Poção para congelar inimigos (imediatamente)


DEIXAR TEMPO LENTO: DEIXAR TUDO QUE ANDA MAIS DEVAGAR E AUMENTAR O AUX ATIRAR
*/


//quando personagem ainda nao pegou
class ObjetoTelaPocao
{
  constructor(x, y, pocao)
  // nao faz clone no pocao
  {
    //backend propriamente dito
    this._pocao = pocao;

    //tela
    this._formaGeometrica = this._pocao.getFormaGeometrica();
    this._formaGeometrica.x = x;
    this._formaGeometrica.y = y;

    //vivo
    this._vivo = true;
  }

  get vivo() { return this._vivo; }

  intersectaPers(qtdAndarX, qtdAndarY)
  { return Interseccao.vaiTerInterseccao(this._formaGeometrica, ConjuntoObjetosTela.pers, qtdAndarX, qtdAndarY); }

  morreu()
  //jah faz o procedimento depois de morrer (jah faz o procedimento ou deixa a pocao guardado para o usuario quiser usar)
  {
    this._vivo = false;
    this._formaGeometrica.corImg = this._pocao.getImgMorreu(); //mudar para imgMorto
    this._pocao.procMorre(); //faz o procedimento depois de morrer
  }

  draw()
  { this._formaGeometrica.draw(); }
}

const distanciaMinPersPocao = 350; //calculado a distancia entre os centro-de-massas
const tempoVaiFicarTela = 7000;
const primeiroLvComPocao = 3; //se for mudar, mudar ControladorPocaoTela.pocoesPossiveisFromLevel(...)
const qtdPocoesUltimosLvs = 5; //se certa probabilidade vai escolher uma pocao dentro os 5 ultimos
class ControladorPocaoTela
{
  constructor()
  {
    //futuro atributo: this._objPocao (nao precisa gastar memoria agora)
    this._jahProgramouDeixarPocaoTela = false; //se jah criou o Timer para colocar Pocao tela
    this._auxColTirPocaoTempo = 0;
  }

  get jahProgramouDeixarPocaoTela() { return this._jahProgramouDeixarPocaoTela; }
  static levelTemPocao(level) { return level >= primeiroLvComPocao; }

  //antes da pocao ter sido adicionado a tela
  colocarPocaoEmTempoSeChance(level)
  //esse metodo vai adicionar uma pocao randomico possivel depois de certo tempo (depois de fazer a verificacao de se o
  //level atual tem pocoes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
  {
    if (this._jahProgramouDeixarPocaoTela || !ControladorPocaoTela.levelTemPocao(level) || //se jah fez um timer para colocar pocao na tela ou se o level atual nao tem pocoes possiveis
      !ControladorPocoesPers.probabilidadeFromLevel(level)) // cada level tem uma chance de ter pocao diferente (os primeiros levels tem menos, e vai aumentando)
      return;

    //random de tempo para colocar na tela e jah setar timer para colocar pocao na tela
    const qntTempoFaltaPraColocar = Math.myrandom(2000, (ControladorJogo.tempoEstimadoLevel(level)-1)*1000 - tempoVaiFicarTela); //no minimo 2 segundos e no maximo para acabar um segundo antes do tempo previsto para o level
    const _this = this;
    new Timer(function() {
      _this._colocarPocaoTela(level);
    }, qntTempoFaltaPraColocar, false, false);
    this._jahProgramouDeixarPocaoTela = true;

    //programar tira-lo depois de certo tempo
    new Timer(function() { _this.tirarPocaoTela(); }, tempoVaiFicarTela + qntTempoFaltaPraColocar, false, false);
  }
  _colocarPocaoTela(level)
  {
    this._auxColTirPocaoTempo++;

    //pega todos as pocoes disponiveis naquele level
    const pocoesPossiveis = ControladorPocaoTela.pocoesPossiveisFromLevel(level);

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
    const pontoPode = this._pontoPodeColocar( pocao.getFormaGeometrica(true) );

    //adicionar objPocao propriamente dito
    this._objPocao = new ObjetoPocao(pontoPode.x, pontoPode.y, pocao);
  }

  //onde colocar
  _pontoPodeColocar(medidasFormaGeom)
  {
    let pontoPode = new Ponto(0, 0);
    do
    {
      pontoPode.x = Math.myrandom(espacoLadosTela, width - medidasFormaGeom.width - espacoLadosTela);
      pontoPode.y = Math.myrandom(espacoLadosTela, height - heightVidaUsuario - medidasFormaGeom.height - espacoLadosTela);
    }while(!this._estahLongeSuficientePers(pontoPode, medidasFormaGeom));
    return pontoPode;
  }
  _estahLongeSuficientePers(pontoPode, medidasFormaGeom)
  {
    //ve se estah intersectando
    if (Interseccao.interseccaoRetDesmontado(ConjuntoObjetosTela.pers.formaGeometrica.x, ConjuntoObjetosTela.pers.formaGeometrica.y,
      ConjuntoObjetosTela.pers.formaGeometrica.width, ConjuntoObjetosTela.pers.formaGeometrica.height,
      pontoPode.x, pontoPode.y, medidasFormaGeom.width, medidasFormaGeom.height))
      return false;

    //calcula distancia do centro de massa do personagem ateh o centro de massa da pocao
    return ConjuntoObjetosTela.pers.formaGeometrica.centroMassa.distancia
      (pontoPode.mais({x: medidasFormaGeom.width/2, y: medidasFormaGeom.height/2})) //centroMassa da pocao
        >= distanciaMinPersPocao;
  }

  //qual pocao
  static pocoesPossiveisFromLevel(level)
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
        pocoesPossiveis[qtd++] = TipoPocao.RUIMPersPerdeVel;
        pocoesPossiveis[qtd++] = TipoPocao.PersMaisRapido;
      case primeiroLvComPocao:
        pocoesPossiveis[qtd++] = TipoPocao.DiminuirTamanhoPers;
        pocoesPossiveis[qtd++] = TipoPocao.TiroPersMaisRapidoMortal;
        break;
    }

    return pocoesPossiveis;
  }

  //probabilidade
  static probabilidadeFromLevel(level)
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
    }
  }

  tirarPocaoTela(tirouPorFaltaTempo = true)
  {
    if (tirouPorFaltaTempo)
    {
      this._auxColTirPocaoTempo--;
      if (this._auxColTirPocaoTempo !== 0 || this._objPocao === undefined)
        break;
    }
    delete this._objPocao;
    this._jahProgramouDeixarPocaoTela = false;
  }

  //depois que pocao jah foi adicionado a tela
  verificarPersPegouPocao(qtdAndarX, qtdAndarY)
  {
    //soh pode pegar a pocao se nao tiver usando
    if (!ConjuntoObjetosTela.pers.controladorPocoesPegou.estahUsandoPocao &&
      this._objPocao !== undefined && this._objPocao.intersectaPers(qtdAndarX, qtdAndarY))
      this._objPocao.morreu(); //ainda nao tira da tela (soh quando desenhar a ultima vez)
  }

  draw()
  {
    if (this._objPocao !== undefined)
    {
      this._objPocao.draw();

      //se morreu, mostra o objeto pela ultima vez e depois tira ele
      if (!this._objPocao.vivo)
        this.tirarPocaoTela(false);
    }
  }
}


//quando personagem jah pegou
//frontend
const heightCadaPocao = 50;
const qtdSubirAdicionarPocao = 3;
const tempoNomePocaoApareceTela = 2500;

const xPocoes = espacoLadosTela + 5;
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
  {
    this._estahSendoUsado = true;

    //escrever o nome da pocao na tela por um certo periodo de tempo
    this._escreverNomePocao = true;
    const _this = this;
    new Timer(function() { _this._escreverNomePocao = false; }, tempoNomePocaoApareceTela, false, false);
  }
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
      const porcentagemDisponivel = this._pocaoSendoUsado.tempoRestante / this._pocaoSendoUsado.tempoTotal;

      //visual/tela
      fill(100);
      const raio = 55;
      const x = this._formaGeometrica.x - 3;
      const y = this._formaGeometrica.y - 4;
      const cor = color("blue");

      if (porcentagemDisponivel === 1)
      {
        strokeWeight(6);
        stroke(cor);
        ellipse(x, y, raio);
      }else
      {
        strokeWeight(5); //8.5 para 10 (desse strokeWeight para o de baixo)
        stroke(30);
        ellipse(x, y, raio);

        strokeWeight(6);
        stroke(cor);
        arc(x, y, raio, raio, -PI/2, porcentagemDisponivel*2*PI - PI/2);
        // (x, y, "raio width", "raio height", angulo em radiano onde comeca, angulo em radiano onde termina o circulo)
        // o circulo trigonometrico usado deve ser no sentido contrario (aumenta em sentido horario)
      }

      noStroke(); fill(255);
      // TODO: design
      text(this._pocao.tempoRestante + "s", x + 2*raio - 4, y + 2*raio + 2); //quanto tempo falta

      if (this._escreverNomePocao)
      {
        // TODO: design
        text(this._pocao.nome, x + 2*raio + 5, y + 2*raio + 2); //escrever nome da pocao
      }
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
    yPrimeiroPocao = height - heightVidaUsuario - 75;
    Object.freeze(yPrimeiroPocao);
  }

  get codPocaoSendoUsado()
  {
    if (this._pocoesPers.qtdElem === 0 || !this._pocoesPers.primeiroElemento.estahSendoUsado)
    //se personagem nao tem nenhum pocao ou se a primeira pocao nao estah sendo usado
      return null;
    return this._pocoesPers.primeiroElemento.pocao.codPocao;
  }
  estahUsandoPocao() { return this.codPocaoSendoUsado !== null; }

  adicionarPocaoUsando(pocao)
  //jah tem que ter verificado se nao tem um usando no momento
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
      this._pocoesPers.primeiroElemento.comecouAUsar(); //dizer que comecou a usar a pocao

      //arrumar lugar das pocoes agora que comecou a usar (circulo em volta)
      this._arrumarLugarPocoes(InstrucaoArrumarLugar.comecouAUsar);
    }
  }

  acabouUsarPocao()
  {
    //remover pocao que acabou de se usado
    this._pocoesPers.removerDoComeco();
    //(agora a primeira pocao do personagem nao estah sendo usado mais)

    //arrumar lugar das pocoes agora que removeu o de baixo
    this._arrumarLugarPocoes(InstrucaoArrumarLugar.removeu);

    //personagem podia estar em cima da pocao mas nao poder pegar porque jah estava usando um, quando esse acaba verifica se pode pegar instantaneamente (sem esperar ele andar)
    ConjuntoObjetosTela.controladorPocaoTela.verificarPersPegouPocao();
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
  }
}

const InstrucaoArrumarLugar = {"removeu": 0, "comecouAUsar": 1, "adicionou": 2};
