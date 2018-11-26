//TIMER
//quando eu uso um setTimeout ou setInterval, ele nao leva em consideracao se estah pausado (parando de contar o tempo) ou nao, entao isso eh uma solucao para isso
class Timer
{
  constructor(funcao, tempoOuFreq, ehFreq, ehInterval)
  //tempo em milisegundo
  {
    this._funcao = funcao;

    if (ehFreq)
      this._freq = tempoOuFreq;
    else
      this._freq = tempoOuFreq*(frameRatePadrao/1000); //porque tempo esta em milisegundo
    this._ehInterval = ehInterval;

    this._count = -1;
    this.procDraw();

    //jah adiciona o timer
    ConjuntoTimers.adicionarTimer(this);
  }

  procDraw() //retorna se vai continuar na lista
  {
    this._count++;
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
}

class ConjuntoTimers
{
  //inicializacao
  static inicializar()
  { ConjuntoTimers._timers = new ListaDuplamenteLigada(); }

  //metodos
  static adicionarTimer(novoTimer)
  { ConjuntoTimers._timers.inserirNoFinal(novoTimer); }
  static procDraws()
  {
    for (ConjuntoTimers._timers.colocarAtualComeco(); !ConjuntoTimers._timers.atualEhNulo; ConjuntoTimers._timers.andarAtual())
      if (!ConjuntoTimers._timers.atual.procDraw())
        ConjuntoTimers._timers.removerAtual();
  }

  static personagemMorreu()
  { ConjuntoTimers._timers.esvaziar(); }
}
ConjuntoTimers.inicializar();


//FUNCAO DEPOIS DE DETERMINADA CONTAGEM
class FreqFunction //se for soh uma vez ou varias (se for soh uma vez, deixar classe como null depois que ele fizer a funcao)
{
  constructor(funcao, freq, indexAtual) //se indexAtual for null, serah zero; e se for true, sera o ultimo
  {
    this._funcao = funcao;
    this._freq = freq;

    if (indexAtual == null)
      this._count = -1;
    else
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
}


//NULO
// nulo proposital
class Nulo
{ constructor() {} }
