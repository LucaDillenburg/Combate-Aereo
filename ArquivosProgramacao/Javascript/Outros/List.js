class List
{
  constructor()
  {
    this._prim = null;
    this._ultimo = null;
    this._length = 0;
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
    const elemRemovido = this._prim.info;
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
    const elemRemovido = this._ultimo.info;
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
    let atual = this._prim; //coloca atual no comeco
    for (let i = 0; atual!==null; i++)
    {
      funcao(atual.info, i); //os parametros sao: elemento atual e indice do elemento
      atual = atual.prox; //anda atual
    }
  }
  every(funcao)
  {
    let atual = this._prim; //coloca atual no comeco
    for (let i = 0; atual!==null; i++)
    {
      if (funcao(atual.info, i) === false) //os parametros sao: elemento atual e indice do elemento
        return false;
      atual = atual.prox; //anda atual
    }

    return true;
  }
  some(funcao)
  {
    let atual = this._prim; //coloca atual no comeco
    for (let i = 0; atual!==null; i++)
    {
      if (funcao(atual.info, i) === true) //os parametros sao: elemento atual e indice do elemento
        return true;
      atual = atual.prox; //anda atual
    }

    return false;
  }

  //almost array-like methods
  getElem(index)
  { return this._getNo(index).info; }
  _getNo(index)
  {
    //coloca atual no comeco
    let atual = this._prim;

    //anda ateh a posicao correta
    for (let i = 0; i<index; i++)
      atual = atual.prox;

    //retorna a informacao
    return atual;
  }
  concat(outraLista)
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
  clear()
  {
    this._prim = null;
    this._ultimo = null;
    this._length = 0;
  }
  splice(index, qtdRem)
  //se remover elementos durante um loop (quantos quiser), todos os elementos serao acessados mas deve-se cuidar porque cada elemento que eh removido, faz com que o index dos elementos seguintes caiam em uma unidade
  {
    //get no onde vai comecar a remover
    let noComecoRemover = this._getNo(index);

    //achar noh depois remover (pode querer remover mais que um no)
    let noDepoisRemover = noComecoRemover;
    for (let i = 0; i<qtdRem; i++)
      noDepoisRemover = noDepoisRemover.prox;

    if (noComecoRemover.ant === null) //quando ta no primeiro
    {
      this._prim = noDepoisRemover;
      if (this._prim === null)
        this._ultimo = null;
      else
        this._prim.ant = null;
    }else //se nao estah no primeiro
    {
      noComecoRemover.ant.prox = noDepoisRemover;
      if (noDepoisRemover === null) //se removeu ateh o ultimo
        this._ultimo = this._ultimo.ant;
    }

    this._length--;
  }

  //outros
  toString()
  {
    let atual = this._prim;
    let string = "";
    while(atual !== null)
    {
      string += atual.info + " -> ";
      atual = atual.prox;
    }
    return string + "null";
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
