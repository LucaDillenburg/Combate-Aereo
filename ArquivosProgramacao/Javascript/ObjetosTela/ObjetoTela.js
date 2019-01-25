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
  // pontoInicial pode ser null se deseja-se ficar com a formaGeometrica como estava
  {
    if (pontoInicial !== null)
    {
      // em Y
      let x;
      switch (pontoInicial.posicaoX)
      {
        // case PosicaoX.ParedeEsquerda: x = 0; break; (jah eh zero)
        case PosicaoX.Meio: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarNoMeio; break;
        case PosicaoX.ParedeDireita: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarParedeDireita; break;
        default: x = 0;
      }
      if (pontoInicial.x !== undefined)
        x += pontoInicial.x;

      // em X
      let y;
      switch (pontoInicial.posicaoY)
      {
        // case PosicaoY.ParedeCima: y = 0; break; (jah eh zero)
        case PosicaoY.Meio: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarNoMeio; break;
        case PosicaoY.ParedeBaixo: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarParedeBaixo; break;
        default: y = 0;
      }
      if (pontoInicial.y !== undefined)
        y += pontoInicial.y;

      this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(x,y);
    }else
      this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone();
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

  morreu()
  {
    this._vivo = false;
    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }
}
