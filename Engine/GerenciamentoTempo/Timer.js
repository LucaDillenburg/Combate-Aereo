//TIMER
//quando eu uso um setTimeout ou setInterval, ele nao leva em consideracao se estah pausado (parando de contar o tempo) ou nao, entao isso eh uma solucao para isso
class Timer
{
  constructor(funcao, tempo, ehInterval=false, apenasEmLevelAtual=true, mudaPers=false, infoMudarTempo)
  //ehInterval: boolean, Timer.ehIntervalFazerAoCriar ou Timer.ehIntervalNaoFazerAoCriar
  //tempo em milisegundo
  //infoMudarTempo: obj, atr (que a variavel onde tempo restante estah)
  {
    this._funcao = funcao;
    this._freq = tempo*frameRatePadrao/1000;
    this._ehInterval = ehInterval===true || ehInterval===Timer.ehIntervalFazerAoCriar || ehInterval===Timer.ehIntervalNaoFazerAoCriar;

    //variavel de controle para quando parar: (tem que ser antes do primeiro procDraw)
    this._continuar = true;

    //para mudarTempo (jah tem que setar agora pois jah vai executar o procDraw a primeira vez)
    this._qtdSomaCount = 1;

    if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento no Timer)
      this.mudarTempo(porcentagemDeixarTempoLento);

    if (ehInterval===Timer.ehIntervalFazerAoCriar)
    {
      this._funcao();
      this._count = 0;
    }
    else
    {
      // pra ver se tempo eh zero (se for, nao tem que esperar nada, entao ele jah vai fazer o metodo e nao vai nem adicionar no vetor)
      this._count = -1;
      const vaiEntrarVetor = this.procDraw(); //vaiEntrarVetor jah leva em conta se ehInterval ou nao
      if (!vaiEntrarVetor) return;
    }

    if (infoMudarTempo !== undefined)
    {
      this._infoMudarTempo = infoMudarTempo;
      this._qtdMudarTempoObj = -1000/frameRatePadrao;

      //seta valor inicial do tempo (tempo total)
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] = tempo;
    }

    this._mudaPers = mudaPers;

    //jah adiciona o timer
    ConjuntoTimers.adicionarTimer(this);

    this._apenasEmLevelAtual = apenasEmLevelAtual;
  }

  // "constantes" para interval (se for true nao faz agora)
  static get ehIntervalFazerAoCriar() { return 1; }
  static get ehIntervalNaoFazerAoCriar() { return 2; }
  //outros
  get apenasEmLevelAtual()
  { return this._apenasEmLevelAtual; }
  get freq()
  { return this._freq; }

  parar()
  { this._continuar = false; }

  procDraw()
  //retorna se vai continuar no vetor de Timers
  {
    if (!this._continuar) return false;

    this._count += this._qtdSomaCount;

    if (this._infoMudarTempo !== undefined)
    //atualiza a variavel de tempo do objeto
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] += this._qtdMudarTempoObj; //acessa a variavel de nome this._infoMudarTempo.atr

    if (this._count >= this._freq)
    {
      this._funcao();
      if (this._ehInterval)
        this._count = 0;
      else
        return false;
    }
    return true;
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    this._qtdSomaCount *= porcentagem;
  }
}

class ConjuntoTimers
{
  //inicializacao
  static inicializar()
  {
    ConjuntoTimers._timers = [];
    //para remover
    ConjuntoTimers._indexesRemover = [];
  }

  //para tirar Timers do ConjuntoTimers agora usar: timer.parar()

  //metodos
  static adicionarTimer(novoTimer)
  { ConjuntoTimers._timers.push(novoTimer); }
  static procDraws()
  {
    ConjuntoTimers._timers.forEach((tmrAtual, index) =>
    // em ordem crescente (em ordem de quem adicionou primeiro)
      {
        const continuaNoVetor = tmrAtual.procDraw();
        if (!continuaNoVetor)
          ConjuntoTimers._querRemoverTmr(index);
      });

    ConjuntoTimers._removerTodosTimers(); //nao pode remover dentro do forEach
  }

  static excluirTimers()
  { ConjuntoTimers._timers = []; }
  static excluirTimersDoLevel()
  {
    ConjuntoTimers._timers.forEach((tmrAtual, index) =>
      {
        // se Timer eh soh daquele level
        if (tmrAtual.apenasEmLevelAtual)
          ConjuntoTimers._querRemoverTmr(index);
      });

    ConjuntoTimers._removerTodosTimers(); //nao pode remover dentro do forEach
  }
  static excluirTimersMudamPers()
  {
    ConjuntoTimers._timers.forEach((tmrAtual, index) =>
      {
        // se Timer muda pers
        if (tmrAtual.mudaPers)
          ConjuntoTimers._querRemoverTmr(index);
      });

    ConjuntoTimers._removerTodosTimers(); //nao pode remover dentro do forEach
  }

  static _querRemoverTmr(index)
  {
    ConjuntoTimers._indexesRemover.push(index);
  }
  static _removerTodosTimers(index)
  {
    ConjuntoTimers._indexesRemover.forEach((indexRemAtual,i) => ConjuntoTimers._timers.splice(indexRemAtual-i, 1));
    ConjuntoTimers._indexesRemover = []; //jah removeu todos os timers
  }

  //POCAO
  static mudarTempo(porcentagem)
  { ConjuntoTimers._timers.forEach(tmrAtual => tmrAtual.mudarTempo(porcentagem)); }
}
ConjuntoTimers.inicializar();