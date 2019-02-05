//TIMER
//quando eu uso um setTimeout ou setInterval, ele nao leva em consideracao se estah pausado (parando de contar o tempo) ou nao, entao isso eh uma solucao para isso
class Timer
{
  constructor(funcao, tempo, ehInterval=false, apenasEmLevelAtual=true, infoMudarTempo)
  //ehInterval: boolean, Timer.ehIntervalFazerAoCriar ou Timer.ehIntervalNaoFazerAoCriar
  //tempo em milisegundo
  //infoMudarTempo: obj, atr (que a variavel onde tempo restante estah), estahEmMiliseg (se variavel estah em milisegundos)
  {
    this._funcao = funcao;
    this._freq = tempo*frameRatePadrao/1000;
    this._ehInterval = ehInterval===true || ehInterval===Timer.ehIntervalFazerAoCriar || ehInterval===Timer.ehIntervalNaoFazerAoCriar;

    //variavel de controle para quando parar: (tem que ser antes do primeiro procDraw)
    this._continuar = true;

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
      this._qtdMudarTempoObj = -(this._infoMudarTempo.estahEmMiliseg?1000:1)/frameRatePadrao;

      //seta valor inicial do tempo (tempo total)
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] = tempo;
    }

    if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento no Timer)
      this.mudarTempo(porcentagemDeixarTempoLento);

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

    this._count++;

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
    //inversamente proporcional
    this._freq /= porcentagem;
    this._count /= porcentagem;
  }
}

class ConjuntoTimers
{
  //inicializacao
  static inicializar()
  { ConjuntoTimers._timers = []; }

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
          ConjuntoTimers._timers.splice(index, 1);
          //remover 1 elemento a partir de [index]
      });
  }

  static excluirTimers()
  { ConjuntoTimers._timers = []; }
  static excluirTimersDoLevel()
  {
    ConjuntoTimers._timers.forEach((tmrAtual, key) =>
      {
        // se Timer eh soh daquele level
        if (tmrAtual.apenasEmLevelAtual)
          delete ConjuntoTimers._timers[key];
      });
  }

  //POCAO
  static mudarTempo(porcentagem)
  { ConjuntoTimers._timers.forEach(tmrAtual => tmrAtual.mudarTempo(porcentagem)); }
}
ConjuntoTimers.inicializar();


//FUNCAO DEPOIS DE DETERMINADA CONTAGEM
class FreqFunction //se for soh uma vez ou varias (se for soh uma vez, deixar classe como null depois que ele fizer a funcao)
{
  constructor(freq, indexAtual = 0, funcao)
  // se freq for 1 vai fazer todas as vezes
  //se indexAtual for undefined, serah zero; e se for true, sera o ultimo
  {
    this._funcao = funcao;
    this._freq = freq;

    //soh pra ver se nao eh zero...
    if (indexAtual === true)
      this._count = freq-1;
    else
      this._count = indexAtual-1;
    this.contar();
  }

  get freq() { return this._freq; }
  set freq(novaFreq)
  { this._freq = novaFreq; }

  get count() { return this._count; }
  zerarContador() { this._count = 0; }
  setContadorUltimaEtapa()
  { this._count = this._freq - 1; /*a proxima vez que contar, ele vai executar a funcao*/ }

  contar()
  {
    this._count++;
    if (this._count >= this._freq)
    {
      if (this._funcao !== undefined)
        this._funcao();
      this._count = 0;
      return true; // iria chamar funcao
    }else
      return false; // nao iria chamar funcao
  }

  vaiExecutarFuncaoProximaVez()
  // retorna se da proxima vez que contar vai executar a funcao
  { return this._count + 1 >= this._freq; }

  //POCAO
  mudarTempo(porcentagem)
  {
    //inversamente proporcional ao tempo
    this._freq /= porcentagem;
    this._count /= porcentagem;
  }
}


//FUNCAO EM CAMADAS (lembra Quiasmo)
class FuncEmCamadas
{
  constructor(funcao)
  {
    this._funcao = funcao;
    this._count = 0;
  }

  subirCamada()
  { this._count++; }

  descerCamada()
  {
    this._count--;
    if (this._count === 0 && this._funcao !== undefined)
      this._funcao();
    return this._count===0;
  }
}
