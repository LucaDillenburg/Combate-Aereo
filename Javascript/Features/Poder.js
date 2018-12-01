//constantes executarPoder
const porcMudaTam = 0.5;
const porcMudarVelRuim = 0.7;

const qtdAndarMaisRapido = 7;
const porcMudarVel = 1.4;
const qtdTiroMaisMortalidade = 3;

const qtdGanhaPoucaVida = 7;
const qtdPerdeVida = 10;
const qtdGanhaMuitaVida = 12;

const qtdTiraVidaTodosInim = 40;

//PODER
class Poder
{
  constructor(codPoder)
  {
    this._codPoder = codPoder;
    this._informacoesPoder = Poder.informacoesPoderFromCod(codPoder);
    this._personagemJahPegou = false;
  }

  //getters
  get nome()
  { return this._informacoesPoder.nome; }
  get ativadoInstant()
  { return this._informacoesPoder.ativadoInstant; }
  get codPoder() { return this._codPoder; }

  static informacoesPoderFromCod(codPoder, strQuer)
  {
    // TODO: fazer isso certo (soh fiz pra nao ter que fazer em tudo (depois mudar))
    if (strQuer == "img")
      return {fill: color("white"), stroke: color("white")};
    if (strQuer == "imgMorreu")
      return {fill: color("orange"), stroke: color("orange")};

    switch(codPoder) //nao estah na ordem dos levels
    {
      case TipoPoder.DiminuirTamanhoPers:
        /* if (strQuer == "img") return ;
        if (strQuer == "imgMorreu") return ; */
        return {nome: "Poção anão", ativadoInstant: true};
      case TipoPoder.MatarObjetos1Tiro:
        return {nome: "Poção Fácil de Matar", ativadoInstant: false};
      case TipoPoder.RUIMPersPerdeVel:
        return {nome: "Poção Space-Mud", ativadoInstant: true};
      case TipoPoder.TiroPersMaisRapidoMortal:
        return {nome: "Poção Tiro Master", ativadoInstant: false};
      case TipoPoder.MatarInimigosNaoEssenc:
        return {nome: "Poção Destruição em Massa", ativadoInstant: true};
      case TipoPoder.ReverterTirosJogoInimDirInim:
        return {nome: "Poção Tiros se Rebelam", ativadoInstant: false};
      case TipoPoder.GanharPoucaVida:
        return {nome: "Poção Ajuda dos Deuses", ativadoInstant: true};
      case TipoPoder.RUIMPersPerdeVida:
        return {nome: "Poção Burn Alive", ativadoInstant: true};
      case TipoPoder.ReverterTirosJogoInimSeguirInim:
        return {nome: "Poção Fúria contra Inimigos", ativadoInstant: true};
      case TipoPoder.DeixarTempoMaisLento:
        return {nome: "Poção Flash", ativadoInstant: true};
      case TipoPoder.RUIMTirosPersDirEle:
        return {nome: "Poção Feitiço Contra Feiticeiro", ativadoInstant: true};
      case TipoPoder.GanharMuitaVida:
        return {nome: "Poção os Deuses te Amam", ativadoInstant: false};
      case TipoPoder.PersMaisRapido:
        return {nome: "Poção Bolt", ativadoInstant: false};
      case TipoPoder.PersComMissil:
        return {nome: "Poção Míssil", ativadoInstant: true};
      case TipoPoder.TirarVidaTodosInim:
        return {nome: "Poção Ácido Corrosivo", ativadoInstant: true};
      case TipoPoder.CongelarInimigos:
        return {nome: "Poção Freeze", ativadoInstant: true};

      default:
        throw "Esse codigo poder nao existe!";
    }
  }

  getFormaGeometrica(sohWidthHeight = false)
  //tomar em consideracao se this._personagemJahPegou
  {
    let formaGeometrica = null;

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
    if (sohWidthHeight)
      return {width: width, height: height};
    formaGeometrica = new Retangulo(0,0,width,height);

    formaGeometrica.corImg = Poder.informacoesPoderFromCod(this._codPoder, "img");
    return formaGeometrica;
  }


 //NA TELA PARA PERSONAGEM PERGAR
  getImgMorreu()
  { return Poder.informacoesPoderFromCod(this._codPoder, "imgMorreu"); }

  procMorreu()
  // retorna se jah foi usado
  {
    this._personagemJahPegou = true;

    if (this._informacoesPoder.ativadoInstant)
      this.executarPoder();
    else
      ConjuntoObjetosTela.pers.controladorPoderesPers.adicionarPoder(this);

    return this._informacoesPoder.ativadoInstant;
  }


  //QUANDO USUARIO JAH PEGOU (se for imediatamente) ou quando ele usar (nao imediatamente)
  // TODO: colocar poderes
  executarPoder()
  //usar apenas ConjuntoObjetosTela
  {
    let tempoPoderResta; //quanto tempo o poder fica ativo ateh desaparecer de novo (em milisegundos)

    switch(this._codPoder)
    {
      case TipoPoder.DiminuirTamanhoPers:
        tempoPoderResta = 7500;
        ConjuntoObjetosTela.pers.mudarTamLados(porcMudaTam); //50% do tamanho
        break;

      case TipoPoder.MatarObjetos1Tiro:
        //mudanca na propria classe Obstaculo e Tiro
        break;

      case TipoPoder.RUIMPersPerdeVel:
        tempoPoderResta = 5000;
        ConjuntoObjetosTela.pers.mudarVelocidade(porcMudarVelRuim);
        break;

      case TipoPoder.TiroPersMaisRapidoMortal:
        tempoPoderResta = 8500;

        let infoTiroPersPadrao = ControladorJogo.infoTiroPersPadrao();
        let infoTiroMaisRapido = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMaisRapido.formaGeometrica = new Retangulo(0,0, 4, 6, {fill: color("black"), stroke: color("black")});
        infoTiroMaisRapido.corImgMorto = {fill: color(30), stroke: color(30)};
        infoTiroMaisRapido.infoAndar = infoTiroPersPadrao.infoAndar;
        infoTiroMaisRapido.infoAndar.qtdAndarY -= qtdAndarMaisRapido;
        infoTiroMaisRapido.mortalidade = infoTiroPersPadrao.mortalidade + qtdTiroMaisMortalidade;

        ConjuntoObjetosTela.pers.controladorTiros.colocarInfoTiroEspecial(infoTiroMaisRapido);
        break;

      case TipoPoder.MatarInimigosNaoEssenc:
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].persMatouTodosInimNaoEssenc();
        break;

      case TipoPoder.ReverterTirosJogoInimDirInim:
        this._reverterTirosContraInimigos(false);
        break;

      case TipoPoder.GanharPoucaVida:
        ConjuntoObjetosTela.pers.mudarVida(qtdGanhaPoucaVida);
        break;

      case TipoPoder.RUIMPersPerdeVida:
        ConjuntoObjetosTela.pers.mudarVida(-qtdPerdeVida);
        break;

      case TipoPoder.ReverterTirosJogoInimSeguirInim:
        this._reverterTirosContraInimigos(true);
        break;

      case TipoPoder.DeixarTempoMaisLento:
        // TODO: poder deixar tempo mais lento
        tempoPoderResta = 10000;
        //...
        break;

      case Tipo.RUIMTirosPersDirEle:
        ConjuntoObjetosTela.pers.controladorTiros.seVirarContraCriador(false);
        break;

      case TipoPoder.GanharMuitaVida:
        ConjuntoObjetosTela.pers.mudarVida(qtdGanhaMuitaVida);
        break;

      case TipoPoder.PersMaisRapido:
        tempoPoderResta = 7500;
        ConjuntoObjetosTela.pers.mudarVelocidade(porcMudarVel);
        break;

      case TipoPoder.PersComMissil: //maior, mais devagar e segue inimigo
        tempoPoderResta = 4500;

        let infoTiroMissil = new InfoTiro(); //formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
        infoTiroMissil.formaGeometrica = new Retangulo(0,0, 8, 10, {fill: color("white"), stroke: color("white")});
        infoTiroMissil.corImgMorto = {fill: color(200), stroke: color(200)};
        infoTiroMissil.infoAndar = new InfoAndar(0, -12, TipoAndar.SeguirInimMaisProx);
        infoTiroMissil.mortalidade = 20;

        ConjuntoObjetosTela.pers.controladorTiros.colocarInfoTiroEspecial(infoTiroMissil);
        break;

      case TipoPoder.TirarVidaTodosInim:
        //passa por todos os controladores de inimigos
        for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].tirarVidaTodosInim(qtdTiraVidaTodosInim);
        break;

      case TipoPoder.CongelarInimigos:
        //congelar todos os inimigos
        for (let i=0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarCongelarTodosInim(true);
        break;

      default:
        throw "Esse codigo poder nao existe!";
    }

    if (tempoPoderResta != null) //se tem que desexecutar depois de um tempo, programa esse Timer (pode ser soh uma acao pontual)
    {
      //programa quando quando vai parar com esse poder
      let _this = this;
      new Timer(function() { _this.desexecutarPoder(); }, tempoPoderResta, false, false,
        	{obj: this, atr: "_tempoTotal", estahEmMiliseg: false}); //atualiza quanto tempo falta

      this._tempoTotal = tempoPoderResta;
      //this._tempoRestante = tempoPoderResta; nao precisa setar tempoRestante porque Timer jah faz isso
    }
  }
  desexecutarPoder()
  {
    switch(this._codPoder)
    {
      //case TipoPoder.MatarObjetos1Tiro: (acao pontual)
      //case TipoPoder.MatarInimigosNaoEssenc: (acao pontual)
      //case TipoPoder.ReverterTirosJogoInimDirInim: (acao pontual)
      //case TipoPoder.GanharPoucaVida: (acao pontual)
      //case TipoPoder.RUIMPersPerdeVida: (acao pontual)
      //case TipoPoder.ReverterTirosJogoInimSeguirInim: (acao pontual)
      //case Tipo.RUIMTirosPersDirEle: (acao pontual)
      //case TipoPoder.GanharMuitaVida: (acao pontual)
      //case TipoPoder.TirarVidaTodosInim: (acao pontual)

      case TipoPoder.DiminuirTamanhoPers:
        ConjuntoObjetosTela.pers.mudarTamLados(Probabilidade.porcVoltarNormal(porcMudaTam)); //200% do tamanho (50%) => vai voltar a 100% (proporcionalmente)
        break;

      case TipoPoder.RUIMPersPerdeVel:
        ConjuntoObjetosTela.pers.mudarVelocidade(Probabilidade.porcVoltarNormal(porcMudarVelRuim)); //aumenta a velocidade (proporcionalmente)
        break;

      case TipoPoder.TiroPersMaisRapidoMortal:
      case TipoPoder.PersComMissil:
        ConjuntoObjetosTela.pers.controladorTiros.voltarInfoTiroPadrao(); //volta tiro padrao (volta uma camada)
        break;

      case TipoPoder.PersMaisRapido:
        ConjuntoObjetosTela.pers.mudarVelocidade(Probabilidade.porcVoltarNormal(porcMudarVel)); //diminui a velocidade de novo (proporcionalmente)
        break;

      case TipoPoder.CongelarInimigos:
        //descongelar todos os inimigos (voltar etapa)
        for (let i=0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
          ConjuntoObjetosTela.controladoresInimigos[i].mudarCongelarTodosInim(false);
        break;

      case TipoPoder.DeixarTempoMaisLento:
        // TODO: fazer isso aqui
        //...
        break;

      default:
        throw "Esse codigo poder nao existe!";
    }

    ConjuntoObjetosTela.pers.controladorPoderesPers.acabouUsarPoder();
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

const TipoPoder = {
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
/* IDEIAS DE PODERES:
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
class ObjetoTelaPoder
{
  constructor(x, y, poder)
  // nao faz clone no poder
  {
    //backend propriamente dito
    this._poder = poder;

    //tela
    this._formaGeometrica = this._poder.getFormaGeometrica();
    this._formaGeometrica.x = x;
    this._formaGeometrica.y = y;

    //vivo
    this._vivo = true;
  }

  get vivo() { return this._vivo; }

  intersectaPers(qtdAndarX, qtdAndarY)
  { return Interseccao.vaiTerInterseccao(this._formaGeometrica, ConjuntoObjetosTela.pers, qtdAndarX, qtdAndarY); }

  morreu()
  //jah faz o procedimento depois de morrer (jah faz o procedimento ou deixa o poder guardado para o usuario quiser usar)
  {
    this._vivo = false;
    this._formaGeometrica.corImg = this._poder.getImgMorreu(); //mudar para imgMorto
    this._poder.procMorre(); //faz o procedimento depois de morrer
  }

  draw()
  { this._formaGeometrica.draw(); }
}

const distanciaMinPersPoder = 350; //calculado a distancia entre os centro-de-massas
const tempoVaiFicarTela = 7000;
const primeiroLvComPoder = 3;
const qtdPoderesUltimosLvs = 5; //se certa probabilidade vai escolher um poder dentro os 5 ultimos
class ControladorPoderTela
{
  constructor()
  {
    this._objPoder = null;
    this._jahProgramouDeixarPoderTela = false; //se jah criou o Timer para colocar Poder tela
    this._auxColTirPoderTempo = 0;
  }

  get jahProgramouDeixarPoderTela() { return this._jahProgramouDeixarPoderTela; }
  static levelTemPoder(level) { return level >= primeiroLvComPoder; }

  //antes do poder ter sido adicionado a tela
  colocarPoderEmTempoSeChance(level)
  //esse metodo vai adicionar um poder randomico possivel depois de certo tempo (depois de fazer a verificacao de se o
  //level atual tem poderes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
  {
    if (this._jahProgramouDeixarPoderTela || !ControladorPoderTela.levelTemPoder(level) || //se jah fez um timer para colocar poder na tela ou se o level atual nao tem poderes possiveis
      !ControladorPoderesPers.probabilidadeFromLevel(level)) // cada level tem uma chance de ter poder diferente (os primeiros levels tem menos, e vai aumentando)
      return;

    //random de tempo para colocar na tela e jah setar timer para colocar poder na tela
    let qntTempoFaltaPraColocar = Math.myrandom(2000, (ControladorJogo.tempoEstimadoLevel(level)-1)*1000 - tempoVaiFicarTela); //no minimo 2 segundos e no maximo para acabar um segundo antes do tempo previsto para o level
    let _this = this;
    new Timer(function() {
      _this._colocarPoderTela(level);
    }, qntTempoFaltaPraColocar, false, false);
    this._jahProgramouDeixarPoderTela = true;

    //programar tira-lo depois de certo tempo
    new Timer(function() { _this.tirarPoderTela(); }, tempoVaiFicarTela + qntTempoFaltaPraColocar, false, false);
  }
  _colocarPoderTela(level)
  {
    this._auxColTirPoderTempo++;

    //pega todos os poderes disponiveis naquele level
    let poderesPossiveis = ControladorPoderTela.poderesPossiveisFromLevel(level);

    //deixar mais provavel pegar pocoes dos ultimos levels (3/5 de chance)
    let qtdPoderesPossiveis;
    if (poderesPossiveis.length > qtdPoderesUltimosLvs && Probabilidade.chance(3,5))
    //se ha mais poderes disponiveis do que [qtdPoderesUltimosLvs] E se a chance de 3/5 (entao ele pega soh um dos 5 primeiros)
    //os melhores poderes estao no comeco do vetor (os ultimos levels colocam o poder antes)
      qtdPoderesPossiveis = qtdPoderesUltimosLvs;
    else
      qtdPoderesPossiveis = poderesPossiveis.length;

    //escolher poder randomly
    let codPoder = poderesPossiveis[Math.myrandom(0, qtdPoderesPossiveis)];
    let poder = new Poder(codPoder); //cria poder a partir do codigo

    //ponto onde poder nao estah em cima do pers nem muuito perto dele
    let medidasFormaGeom = poder.getFormaGeometrica(true);
    let pontoPode = this._pontoPodeColocar(medidasFormaGeom);

    this._objPoder = new ObjetoPoder(pontoPode.x, pontoPode.y, poder);
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

    //calcula distancia do centro de massa do personagem ateh o centro de massa do poder
    return ConjuntoObjetosTela.pers.formaGeometrica.centroMassa.distancia
      (pontoPode.mais({x: medidasFormaGeom.width/2, y: medidasFormaGeom.height/2})) //centroMassa do poder
        >= distanciaMinPersPoder;
  }

  //qual poder
  static poderesPossiveisFromLevel(level)
  //retorna um vetor com todos os indexes de poderes possiveis
  {
    let poderesPossiveis = [];
    let qtd = 0;

    switch(level)
    {
      // TODO: Se houver mais levels colocar mais cases aqui... (mudar levelTemPoderExclus se colocar poderes em outros levels)
      case primeiroLvComPoder + 9: //12
        poderesPossiveis[qtd++] = TipoPoder.CongelarInimigos;
      case primeiroLvComPoder + 8: //11
        poderesPossiveis[qtd++] = TipoPoder.ReverterTirosJogoInimSeguirInim;
      case primeiroLvComPoder + 7: //10
        poderesPossiveis[qtd++] = TipoPoder.DeixarTempoMaisLento;
      case primeiroLvComPoder + 6: //9
        poderesPossiveis[qtd++] = TipoPoder.RUIMTirosPersDirEle;
        poderesPossiveis[qtd++] = TipoPoder.ReverterTirosJogoInimDirInim;
      case primeiroLvComPoder + 5: //8
        poderesPossiveis[qtd++] = TipoPoder.TirarVidaTodosInim;
        poderesPossiveis[qtd++] = TipoPoder.GanharMuitaVida;
      case primeiroLvComPoder + 4: //7
        poderesPossiveis[qtd++] = TipoPoder.MatarInimigosNaoEssenc;
      case primeiroLvComPoder + 3: //6
        poderesPossiveis[qtd++] = TipoPoder.RUIMPersPerdeVida;
        poderesPossiveis[qtd++] = TipoPoder.MatarObjetos1Tiro;
      case primeiroLvComPoder + 2: //5
        poderesPossiveis[qtd++] = TipoPoder.PersComMissil;
        poderesPossiveis[qtd++] = TipoPoder.GanharPoucaVida;
      case primeiroLvComPoder + 1: //4
        poderesPossiveis[qtd++] = TipoPoder.RUIMPersPerdeVel;
        poderesPossiveis[qtd++] = TipoPoder.PersMaisRapido;
      case primeiroLvComPoder: //3
        poderesPossiveis[qtd++] = TipoPoder.DiminuirTamanhoPers;
        poderesPossiveis[qtd++] = TipoPoder.TiroPersMaisRapidoMortal;
        break;
    }

    return poderesPossiveis;
  }

  //probabilidade
  static probabilidadeFromLevel(level)
  {
    switch(level)
    {
      // TODO: Se houver mais levels colocar mais cases aqui... (mudar levelTemPoderExclus se colocar poderes em outros levels)
      case 12:
      case 11:
      case 10:
        return Probabilidade.chance(4,5); //80%
      case 9:
      case 8:
      case 7:
        return Probabilidade.chance(2,3); //66%
      case 6:
      case 5:
      case 4:
        return Probabilidade.chance(1,2); //50%
      case 3:
        return Probabilidade.chance(1,3); //33%
    }
  }

  tirarPoderTela(tirouPorFaltaTempo = true)
  {
    if (tirouPorFaltaTempo)
    {
      this._auxColTirPoderTempo--;
      if (this._auxColTirPoderTempo != 0 || this._objPoder == null)
        break;
    }
    this._objPoder = null;
    this._jahProgramouDeixarPoderTela = false;
  }

  //depois que poder jah foi adicionado a tela
  verificarPersPegouPoder(qtdAndarX, qtdAndarY)
  {
    if (this._objPoder != null && this._objPoder.intersectaPers(qtdAndarX, qtdAndarY))
      this._objPoder.morreu(); //ainda nao tira da tela (soh quando desenhar a ultima vez)
  }

  draw()
  {
    if (this._objPoder != null)
    {
      this._objPoder.draw();

      //se morreu, mostra o objeto pela ultima vez e depois tira ele
      if (!this._objPoder.vivo)
        this.tirarPoderTela(false);
    }
  }
}


//quando personagem jah pegou
//frontend
const heightCadaPoder = 45;
const espacoEntrePoderes = 5;
const qtdSubirAdicionarPoder = 3;
const tempoNomePoderApareceTela = 2500;

const xPoderes = espacoLadosTela + 5;
var yPrimeiroPoder; //vai como uma constante quando ControladorPoderesPers for instanciado (porque o height nao estah definido aqui ainda)

class ObjPoderPers
{
  constructor(poder, qtdPoderes)
  //qtdPoderes eh com esse jah
  {
    //backend
    this._poder = poder;

    //tela
    this._formaGeometrica = this._poder.getFormaGeometrica();
    this._formaGeometrica.x = xPoderes;
    this._formaGeometrica.y = yPrimeiroPoder - qtdPoderes*heightCadaPoder - (qtdPoderes-1)*espacoEntrePoderes;

    this._estahSendoUsado = false;
  }

  comecouAUsar()
  {
    this._estahSendoUsado = true;

    //escrever o nome do poder na tela por um certo periodo de tempo
    this._escreverNomePoder = true;
    let _this = this;
    new Timer(function() { _this._escreverNomePoder = false; }, tempoNomePoderApareceTela, false, false);
  }
  get estahSendoUsado() { return this._estahSendoUsado; }

  get poder()
  { return this._poder; }

  mudarY(instrucao)
  //instrucao: 0 = removeu, 1 = comecou a usar, 2 = adicionou
  {
    if (instrucao != 1)
      this._formaGeometrica.y += heightCadaPoder*(adicionou?-1:1);
    else
      this._formaGeometrica.y -= qtdSubirAdicionarPoder / (this._estahSendoUsado?2:1);
      //ps: se estah sendo usado soh sobe metade (soh pela metade de baixo do circlo)
  }

  draw()
  {
    //desenha semi-circulo antes
    if (this._estahSendoUsado)
    {
      let porcDisponivel = this._poderSendoUsado.tempoRestante / this._poderSendoUsado.tempoTotal;

      fill(100);
      let raio = 55;
      let x = this._formaGeometrica.x - 3;
      let y = this._formaGeometrica.y - 4;

      let cor = color("blue");
      if (porcDisponivel == 1)
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
        arc(x, y, raio, raio, -PI/2, porcDisponivel*2*PI - PI/2);
        // (x, y, "raio width", "raio height", angulo em radiano onde comeca, angulo em radiano onde termina o circulo)
        // o circulo trigonometrico usado deve ser no sentido contrario (aumenta em sentido horario)
      }

      noStroke(); fill(255);
      // TODO: colocar font tops
      text(this._poder.tempoRestante + "s", x + 2*raio - 4, y + 2*raio + 2); //quanto tempo falta

      if (this._escreverNomePoder)
      {
        // TODO: aumentar tamanho font
        text(this._poder.nome, x + 2*raio + 5, y + 2*raio + 2); //escrever nome do poder
      }
    }

    //desenha poder em si
    this._formaGeometrica.draw();
  }
}

//backend
const maxPoderesAcumulados = 4;
class ControladorPoderesPers
{
  constructor()
  {
    this._poderesPers = new ListaDuplamenteLigada();
    //os que nao estao sendo usados e o que estah (se houver)

    //inicializa a variavel e a faz funcionar como uma contante (nao pode ser contante em si porque depende de height, que nao tem um valor literal)
    yPrimeiroPoder = height - heightVidaUsuario - 75;
    Object.freeze(yPrimeiroPoder);
  }

  get codPoderSendoUsado()
  {
    if (this._poderesPers.qtdElem == 0 || !this._poderesPers.primeiroElemento.estahSendoUsado)
    //se personagem nao tem nenhum poder ou se o primeiro poder nao estah sendo usado
      return null;
    return this._poderesPers.primeiroElemento.poder.codPoder;
  }

  usarPoder()
  {
    if (this._poderesPers.qtdElem > 0 && !this._poderesPers.primeiroElemento.estahSendoUsado)
    // se tem algum poder para usar && se nao tem nenhum poder sendo usado (soh pode usar um poder por vez)
    {
      this._poderesPers.primeiroElemento.poder.executarPoder(); //executar poder
      this._poderesPers.primeiroElemento.comecouAUsar(); //dizer que comecou a usar o poder

      //arrumar lugar dos poderes agora que comecou a usar (circulo em volta)
      this._arrumarLugarPoderes(InstrucaoArrumarLugar.comecouAUsar);
    }
  }
  adicionarPoder(poder)
  {
    this._poderesPers.inserirNoComeco(new ObjPoderPers(poder, this._poderesPers.qtdElem+1));

    if (this._poderesPers.qtdElem >= maxPoderesAcumulados + 1)
    //se tem mais poderes do que pode
      this._poderesPers.removerDoFinal();

    //arrumar lugar dos poderes agora que adicionou um embaixo
    this._arrumarLugarPoderes(InstrucaoArrumarLugar.adicionou);
  }

  acabouUsarPoder()
  {
    //remover poder que acabou de se usado
    this._poderesPers.removerDoComeco();
    //(agora o primeiro poder do personagem nao estah sendo usado mais)

    //arrumar lugar dos poderes agora que removeu o de baixo
    this._arrumarLugarPoderes(InstrucaoArrumarLugar.removeu);
  }

  _arrumarLugarPoderes(instrucao)
  //instrucao: removeu, comecou a usar ou adicionou
  {
    for (this._poderesPers.colocarAtualComeco(); !this._poderesPers.atualEhNulo; this._poderesPers.andarAtual())
      this._poderesPers.atual.mudarY(instrucao);
  }

  //desenhar todos os poderes
  draw()
  {
    for (this._poderesPers.colocarAtualComeco(); !this._poderesPers.atualEhNulo; this._poderesPers.andarAtual())
      this._poderesPers.atual.draw();
  }
}

const InstrucaoArrumarLugar = {"removeu": 0, "comecouAUsar": 1, "adicionou": 2};
