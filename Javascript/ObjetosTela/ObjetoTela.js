//Explicacao:
  //class Info: tem atributos publicos (pois em todos podem fazer get e set sem verificacoes)
  //class ObjetoTela: recebe apenas uma classe Info por parametro e adiciona em seus proprios atributos

class InfoObjetoTelaSimples
{
  constructor(formaGeometrica)
  { this.formaGeometrica = formaGeometrica; }
}
class ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTelaSimples)
  {
    this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(pontoInicial.x, pontoInicial.y);

    //posicaoX: Meio, ParedeEsquerda, ParedeDireita
    switch (pontoInicial.posicaoX)
    {
      case PosicaoX.Meio: this._formaGeometrica.colocarNoMeioX(); break;
      case PosicaoX.ParedeEsquerda: this._formaGeometrica.colocarParedeEsquerda(); break;
      case PosicaoX.ParedeDireita: this._formaGeometrica.colocarParedeDireita(); break;
    }
    //posicaoY: Meio, ParedeCima, ParedeBaixo
    switch (pontoInicial.posicaoY)
    {
      case PosicaoY.Meio: this._formaGeometrica.colocarNoMeioY(); break;
      case PosicaoY.ParedeCima: this._formaGeometrica.colocarParedeCima(); break;
      case PosicaoY.ParedeBaixo: this._formaGeometrica.colocarParedeBaixo(); break;
    }
  }

  get formaGeometrica()
  { return this._formaGeometrica; }
  colocarNoMeioX()
  { this._formaGeometrica.colocarNoMeioX(); }

  draw()
  { this._formaGeometrica.draw(); }
}

class InfoObjetoTela extends InfoObjetoTelaSimples
{
  constructor(formaGeometrica, corImgMorto)
  {
    super(formaGeometrica);
    this.corImgMorto = corImgMorto;
  }
}
class ObjetoTela extends ObjetoTelaSimples
{
  constructor(pontoInicial, infoObjetoTela)
  //recebe apenas uma classe informacao como parametro
  {
    super(pontoInicial, infoObjetoTela);
    this._corImgMorto = infoObjetoTela.corImgMorto;
    this._vivo = true;
  }

  //getters e setters
  get corImgMorto()
  { return this._corImgMorto; }
  set corImgMorto(corImgMorto)
  { this._corImgMorto = corImgMorto; }

  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }
}
