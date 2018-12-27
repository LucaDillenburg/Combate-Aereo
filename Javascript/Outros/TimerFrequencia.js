//TIMER
//quando eu uso um setTimeout ou setInterval, ele nao leva em consideracao se estah pausado (parando de contar o tempo) ou nao, entao isso eh uma solucao para isso
class Timer
{
  constructor(funcao, tempo, ehInterval, infoMudarTempo)
  //tempo em milisegundo
  //infoMudarTempo: obj, atr (que a variavel onde tempo restante estah), estahEmMiliseg (se variavel estah em milisegundos)
  {
    this._funcao = funcao;
    this._freq = tempo/frameRatePadrao;
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
      // pra ver se tempo eh zero
      this._count = -1;
      const vaiEntrarLista = this.procDraw();
      if (!vaiEntrarLista) return;
    }

    if (infoMudarTempo !== undefined)
    {
      this._infoMudarTempo = infoMudarTempo;
      //seta valor inicial do tempo (tempo total)
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] = tempo;
    }

    if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento no Timer)
      this.mudarTempo(porcentagemDeixarTempoLento);

    //jah adiciona o timer
    ConjuntoTimers.adicionarTimer(this);

    this._codTimer = ConjuntoTimers.proximoCodTimer;
  }

  // "constantes" para interval (se for true nao faz agora)
  static get ehIntervalFazerAoCriar() { return 1; }
  static get ehIntervalNaoFazerAoCriar() { return 2; }

  get codTimer() { return this._codTimer; }

  parar() { this._continuar = false; }

  procDraw()
  //retorna se vai continuar na lista
  {
    if (!this._continuar) return false;

    this._count++;

    if (this._infoMudarTempo !== undefined)
    //atualiza a variavel de tempo do objeto
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] -= frameRatePadrao / (this._infoMudarTempo.estahEmMiliseg?1:1000);
                            //isso acessa a variavel de nome this._infoMudarTempo.atr

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
    const k = 1/porcentagem; //inversamente proporcional ao tempo
    this._freq *= k;
    this._count *= k;
  }
}

class ConjuntoTimers
{
  //inicializacao
  static inicializar()
  {
    ConjuntoTimers._timers = new ListaDuplamenteLigada();
    ConjuntoTimers._ultimoCodTimer = 0; //ele incrementa antes de passar o codigo
  }

  //para tirar Timers do ConjuntoTimers
  static get proximoCodTimer()
  {
    //o proximo codTimer eh um a mais que o anterior
    ConjuntoTimers._ultimoCodTimer++;
    return ConjuntoTimers._ultimoCodTimer;
  }
  static removeTimer(codTimerRemover)
  {
    for (ConjuntoTimers._timers.colocarAtualComeco(); !ConjuntoTimers._timers.atualEhNulo; ConjuntoTimers._timers.andarAtual())
      if (ConjuntoTimers._timers.atual.codTimer === codTimerRemover) //se o no atual eh oq se quer remover
      {
        ConjuntoTimers._timers.removerAtual();
        break;
      }
  }

  //metodos
  static adicionarTimer(novoTimer)
  { ConjuntoTimers._timers.inserirNoFinal(novoTimer); }
  static procDraws()
  {
    for (ConjuntoTimers._timers.colocarAtualComeco(); !ConjuntoTimers._timers.atualEhNulo; ConjuntoTimers._timers.andarAtual())
    {
      ConjuntoTimers._timers.guardarAtual();
      const continuaNaLista = ConjuntoTimers._timers.atual.procDraw();
      ConjuntoTimers._timers.colocarGuardadoNoAtual();
      if (!continuaNaLista)
        ConjuntoTimers._timers.removerAtual();
    }
  }

  static esvaziarTimers()
  { ConjuntoTimers._timers.esvaziar(); }

  //POCAO
  static mudarTempo(porcentagem)
  {
    for (ConjuntoTimers._timers.colocarAtualComeco(); !ConjuntoTimers._timers.atualEhNulo; ConjuntoTimers._timers.andarAtual())
      ConjuntoTimers._timers.atual.mudarTempo(porcentagem);
  }
}
ConjuntoTimers.inicializar();

//controlador timers (diferente dos demais)
class ControladorTimersLevel
{
  constructor()
  { this._timers = []; } //usando vetor do javascript porque eh rapido para adicionar e devagar para remover porem aqui nao vou remover, apenas reinicializar

  adicionarTimer(timer) //ao terem criado os timers, ele jah foi adicionado ao ConjuntoTimers (nao precisa adicionar)
  { this._timers.push(timer); }

  excluirTimers()
  {
    this._timers.forEach(function(value, key)
    //vai passar por todos os timers
    {
      value.parar();
      //vai tirar o Timer do ConjuntoTimers (nao vai mais fazer o seu procedimento)
    });

    this._timers = [];
    //nao tem mais nenhum timer efetivo (nao parado)
  }
}


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
    const k = 1/porcentagem; //inversamente proporcional ao tempo
    this._freq *= k;
    this._count *= k;
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
