class ListaDuplamenteLigada
{
  constructor()
  {
    this._prim = null;
    this._ultimo = null;
    this._atual = null;
  }

  //getters
  get primeiroElemento()
  {
    if (this._prim == null)
      throw "Nao ha elementos! - em get primeiroElemento";
    return this._prim.info;
  }
  get ultimoElemento()
  {
    if (this._ultimo == null)
      throw "Nao ha elementos! - em get ultimoElemento";
    return this._ultimo.info;
  }
  get vazia()
  { return this._prim == null; }

  //adicionar no comeco
  inserirNoComeco(info)
  {
    this._prim = new _No(null, info, this._prim);

    if (this._ultimo == null)
      this._ultimo = this._prim;
  }

  //tirar do final
  removerDoFinal()
  {
    if (this._ultimo == null)
      throw "Nao ha elementos! - em removerDoFinal()";

    this._ultimo = this._ultimo.ant;
    if (this._ultimo == null)
      this._prim = null;
    else
      this._ultimo.prox = null;
  }


  //atual
  colocarAtualComeco()
  { this._atual = this._prim; }
  andarAtual()
  {
    if (this._atual == null)
      throw "Jah esta no ultimo! - em andarAtual() ";
    this._atual = this._atual.prox;
  }
  atualEstahNoFinal()
  { return this._atual == this._ultimo; }
  get atual()
  {
    if (this._atual == null)
      throw "Atual eh nulo!";
    return this._atual.info;
  }
  get atualEhNulo()
  { return this._atual == null; }

  //metodos com atual (remover)
  removerAtual()
  {
    if (this._atual == null)
      throw "Atual eh nulo! - em removerAtual() ";
      
    if (this._atual.ant == null)
    {
        this._prim = null;
        this._ultimo = null;
    }else        
        this._atual.ant.prox = this._atual.prox;
  }
}

// no
class _No
{
  constructor(ant, info, prox)
  {
    this._ant = ant;
    this._info = info;
    this.prox = prox;
  }

  get ant()
  { return this._ant; }
  set ant(ant)
  { this._ant = ant; }

  get info()
  { return this._info; }
  set info(info)
  { this._info = info; }

  get prox()
  { return this._prox; }
  set prox(prox)
  {
    this._prox = prox;

    //jah coloca o proximo apontando para o anterior
    if (prox != null)
      prox._ant = this;
  }
}
