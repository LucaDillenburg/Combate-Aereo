//TIMER
//quando eu uso um setTimeout ou setInterval, ele nao leva em consideracao se estah pausado (parando de contar o tempo) ou nao, entao isso eh uma solucao para isso
class Timer
{
  constructor(funcao, tempoOuFreq, ehFreq, ehInterval, infoMudarTempo)
  //tempo em milisegundo
  //infoMudarTempo: obj, atr (que a variavel onde tempo restante estah), estahEmMiliseg (se variavel estah em milisegundos)
  {
    this._funcao = funcao;

    if (ehFreq)
      this._freq = tempoOuFreq;
    else
      this._freq = tempoOuFreq*(frameRatePadrao/1000); //porque tempo esta em milisegundo
    this._ehInterval = ehInterval;

    //variavel de controle para quando parar: (tem que ser antes do primeiro procDraw)
    this._continuar = true;

    // pra ver se count eh zero
    this._count = -1;
    const vaiEntrarLista = this.procDraw();
    if (!vaiEntrarLista) return;

    if (infoMudarTempo !== undefined)
    {
      this._infoMudarTempo = infoMudarTempo;
      //seta valor inicial do tempo (tempo total)
      this._infoMudarTempo.obj[this._infoMudarTempo.atr] = tempoOuFreq / (ehFreq?frameRatePadrao:1);
    }

    if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento no Timer)
      this.mudarTempo(porcentagemDeixarTempoLento);

    //jah adiciona o timer
    ConjuntoTimers.adicionarTimer(this);

    this._codTimer = ConjuntoTimers.proximoCodTimer;
  }

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
  { console.log("%c adicionou", 'font-weight: bold; color: red'); ConjuntoTimers._timers.inserirNoFinal(novoTimer); ConjuntoTimers._timers.printar(); }
  static procDraws()
  {
    for (ConjuntoTimers._timers.colocarAtualComeco(); !ConjuntoTimers._timers.atualEhNulo; ConjuntoTimers._timers.andarAtual())
    {
      const continuaNaLista = ConjuntoTimers._timers.atual.procDraw();
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
  constructor(funcao, freq, indexAtual = 0) //se indexAtual for null, serah zero; e se for true, sera o ultimo
  {
    this._funcao = funcao;
    this._freq = freq;

    if (indexAtual === true)
      this._count = freq-1;
    else
      this._count = indexAtual-1;

    this.contar();
  }

  contar()
  {
    this._count++;
    if (this._count >= this._freq)
    {
      this._funcao();
      this._count = 0;
      return true;
    }else
      return false;
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    const k = 1/porcentagem; //inversamente proporcional ao tempo
    this._freq *= k;
    this._count *= k;
  }
}