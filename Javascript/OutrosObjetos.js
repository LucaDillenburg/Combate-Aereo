class Tiro extends ObjetoTela
{
  constructor(x, y, width, height, cor, qtdAndarX, qtdAndarY, ehDoPers, qtdMortalidade)
  {
    super(x, y, width, height, cor);
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    this._qtdMortalidade = qtdMortalidade;

    this._ehDoPers = ehDoPers;
  }

  andar(pers, obstaculos, inimigos)
  //retorna se o tiro vai continuar "vivo" (nao bateu em algo nem saiu da tela)
  {
    this._x += this._qtdAndarX;
    this._y += this._qtdAndarY;

    if (Tela.objSaiuTotalmente(this))
      return false;
    return !this.colidiu(pers, obstaculos, inimigos);
  }

  colidiu(pers, obstaculos, inimigos)
  {
    if (this._ehDoPers)
    //ver se colidiu com obstaculos e inimigos
    {
      let colidiu = false;
      if (obstaculos != null)
        for(let i = 0; i<obstaculos.length; i++)
          if (Interseccao.Interseccao(obstaculos[i], this))
            colidiu = true;

      if (inimigos != null)
        for(let i = 0; i<inimigos.length; i++)
          if (Interseccao.Interseccao(inimigos[i], this))
          {
            this.tirarVidaObjCmVida(inimigos[i]);
            colidiu = true;
          }

      return colidiu;
    }else
    //ver se colidiu com personagem
    {
      if (Interseccao.Interseccao(pers, this))
      {
        this.tirarVidaObjCmVida(pers);
        return true;
      }else
        return false;
    }
  }

  tirarVidaObjCmVida(obj)
  { obj.mudarVida(-this._qtdMortalidade); }
}


class Obstaculo extends ObjetoTela
{
  set height(height)
  { this._height = height; }
  get height()
  { return this._height; }
  mudarHeight(qtdMuda)
  {
    this._height += qtdMuda;
    if (this._height < 0)
      this._height = 0;
    return this._height > 0;
  }

  set width(width)
  { this._width = width; }
  get width()
  { return this._width; }
  mudarwidth(qtdMuda)
  {
    this._width += qtdMuda;
    if (this._width < 0)
      this._width = 0;
    return this._width > 0;
  }
}
