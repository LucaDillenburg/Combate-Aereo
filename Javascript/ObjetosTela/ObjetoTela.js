//Explicacao:
  //class Info: tem atributos publicos (pois em todos podem fazer get e set sem verificacoes)
  //class ObjetoTela: recebe apenas uma classe Info por parametro e adiciona em seus proprios atributos

//simples
class InfoObjetoTelaSimples
{
  constructor(formaGeometrica)
  { this.formaGeometrica = formaGeometrica; }
}
class ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTelaSimples)
  {
    // em Y
    let x = 0;
    switch (pontoInicial.posicaoX)
    {
      // case PosicaoX.ParedeEsquerda: x = 0; break; (jah eh zero)
      case PosicaoX.Meio: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarNoMeio; break;
      case PosicaoX.ParedeDireita: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarParedeDireita; break;
    }
    if (pontoInicial.x !== undefined)
      x += pontoInicial.x;

    // em X
    let y = 0;
    switch (pontoInicial.posicaoY)
    {
      // case PosicaoY.ParedeCima: y = 0; break; (jah eh zero)
      case PosicaoY.Meio: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarNoMeio; break;
      case PosicaoY.ParedeBaixo: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarParedeBaixo; break;
    }
    if (pontoInicial.y !== undefined)
      y += pontoInicial.y;

    this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(x,y);
  }

  get formaGeometrica()
  { return this._formaGeometrica; }

  draw()
  { this._formaGeometrica.draw(); }
}

//normal
class InfoObjetoTela extends InfoObjetoTelaSimples
{
  constructor(formaGeometrica, corImgMorto)
  {
    super(formaGeometrica);
    this.corImgMorto = corImgMorto;
  }
}
class ObjetoTela extends ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTela)
  //recebe apenas uma classe informacao como parametro
  {
    super(pontoInicial, infoObjetoTela);
    this._corImgMorto = infoObjetoTela.corImgMorto;
    this._vivo = true;
  }

  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }
}
