class List
{
  constructor()
  {
    this._prim = null;
    this._ultimo = null;
    this._length = 0;

    this._atual = null;
    this._indexAtual = -1;

    this._atuaisGuardados = []; //pilha
  }

  //getters
  get primeiroElemento()
  {
    if (this._prim === null)
      throw "Nao ha elementos! - em get primeiroElemento";
    return this._prim.info;
  }
  get ultimoElemento()
  {
    if (this._ultimo === null)
      throw "Nao ha elementos! - em get ultimoElemento";
    return this._ultimo.info;
  }
  get vazia()
  { return this._prim === null; }

  esvaziar()
  {
    this._prim = null;
    this._ultimo = null;
    this._length = 0;
  }

  //atual
  colocarAtualComeco()
  { this._atual = this._prim; }
  colocarAtualEm(index)
  {
    this._atual = this._prim;
    for (let i = 1; i<=index; i++)
      this._atual = this._atual.prox;
  }
  andarAtual()
  {
    if (this._atual === null)
      throw "Atual eh nulo!";
    this._atual = this._atual.prox;
  }
  atualEstahNoFinal()
  { return this._atual === this._ultimo; }
  get atual()
  {
    if (this._atual === null)
      throw "Atual eh nulo!";
    return this._atual.info;
  }
  get atualEhNulo()
  { return this._atual === null; }

  // funciona por sistema de Pilha
  guardarAtual()
  {
    this._atuaisGuardados.push(this._atual);
    // adiciona no final do vetor
  }
  colocarGuardadoNoAtual()
  {
    this._atual = this._atuaisGuardados.pop();
    // remove do final do vetor e retorna o item removido
  }

  //metodos com atual (remover)
  removerAtual()
  {
    if (this._atual === null)
      throw "Atual eh nulo!";

    if (this._atual.ant === null) //quando ta no primeiro
    {
        this._prim = this._atual.prox;
        if (this._prim === null)
          this._ultimo = null;
        else
          this._prim.ant = null;
    }else
    {
      this._atual.ant.prox = this._atual.prox;
      if (this._atual === this._ultimo) //se removeu o ultimo
        this._ultimo = this._ultimo.ant;
    }

    this._length--;
  }

  //outros
  concatenar(outraLista)
  {
    if (this._prim === null)
    //se this eh uma lista vazia, a primeira e ultima posicao dessa lista vai ser a do outro
    //(sendo a outra vazia ou nao)
    {
      this._prim = outraLista._prim;
      this._ultimo = outraLista._ultimo;
    }
    else
    if (outraLista._ultimo !== null)
    //se this nao for vazia e nem a outra lista
    {
      outraLista._prim.ant = this._ultimo;
      this._ultimo.prox = outraLista._prim;

      this._ultimo = outraLista._ultimo;
    }
    //nao tem else porque se a outra lista for vazia nao tem mais o que fazer

    this._length += outraLista._length;
  }

  //outros/aux
  printar()
  {
    let atual = this._prim;
    let string = "";
    while(atual !== null)
    {
      string += atual.info + " -> ";
      atual = atual.prox;
    }
    console.log(string + "null");
  }

//ARRAY-LIKE GETTERS
  get length()
  { return this._length; }

//ARRAY-LIKE METHODS
  //adicionar
  unshift(info)
  {
    this._prim = new _No(null, info, this._prim);
    if (this._ultimo === null)
      this._ultimo = this._prim;
    this._length++;

    return this._length;
  }
  push(info)
  {
    this._ultimo = new _No(this._ultimo, info, null);
    if (this._prim === null)
      this._prim = this._ultimo;
    this._length++;

    return this._length;
  }

  //remover
  shift()
  {
    if (this._prim === null)
      throw "Nao ha elementos!";

    const elemRemovido = this._prim;
    this._prim = this._prim.prox;

    if (this._prim === null)
      this._ultimo = null;
    else
      this._prim.ant = null;
    this._length--;

    return elemRemovido;
  }
  pop()
  {
    if (this._ultimo === null)
      throw "Nao ha elementos!";

    const elemRemovido = this._ultimo;
    this._ultimo = this._ultimo.ant;

    if (this._ultimo === null)
      this._prim = null;
    else
      this._ultimo.prox = null;
    this._length--;

    return elemRemovido;
  }

  //loops
  forEach(funcao)
  {
    let i = 0;
    for (this.colocarAtualComeco(); !this.atualEhNulo; this.andarAtual(), i++)
    {
      this.guardarAtual();
      funcao(atual.info, i); //os parametros sao: elemento atual e indice do elemento
      this.colocarGuardadoNoAtual();
    }
  }
  every(funcao)
  {
    let i = 0;
    for (this.colocarAtualComeco(); !this.atualEhNulo; this.andarAtual(), i++)
    {
      this.guardarAtual();
      if (!funcao(atual.info, i)) //os parametros sao: elemento atual e indice do elemento
        return false;
      this.colocarGuardadoNoAtual();
    }
    return true;
  }
  some(funcao)
  {
    let i = 0;
    for (this.colocarAtualComeco(); !this.atualEhNulo; this.andarAtual(), i++)
    {
      this.guardarAtual();
      if (funcao(atual.info, i)) //os parametros sao: elemento atual e indice do elemento
        return true;
      this.colocarGuardadoNoAtual();
    }
    return false;
  }
}

// no
class _No
{
  constructor(ant, info, prox)
  {
    this.ant = ant;
    this._info = info;
    this.prox = prox;
  }

  get ant()
  { return this._ant; }
  set ant(ant)
  {
    this._ant = ant;

    //jah coloca o anterior apontando para o proximo
    if (ant !== null)
      ant._prox = this;
  }

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
    if (prox !== null)
      prox._ant = this;
  }
}
