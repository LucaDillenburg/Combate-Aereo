class PersonagemPrincipal extends PersComTiros
{
  constructor(x, y, tamLado, qtdAndar, cor, vida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarTiro)
  {
    super(x, y, tamLado, tamLado, cor, vida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarTiro);
    this._qtdAndar = qtdAndar;
  }

  //mudar (x,y)
  set x(x)
  {
    if (x >= 0 && x + this._width <= width)
      this._x = x;
  }
  get x()
  { return this._x; }
  mudarX(qtdMuda)
  {
    let retSair = this.vaiSairTelaX(qtdMuda);

    if (retSair == PersonagemPrincipal.SAIU_ESQUERDA
        || (retSair == PersonagemPrincipal.SAIU_DIREITA_E_ESQUERDA && qtdMuda < 0))
      this._x = 0;
    else
    if (retSair == PersonagemPrincipal.SAIU_DIREITA
        || (retSair == PersonagemPrincipal.SAIU_DIREITA_E_ESQUERDA && qtdMuda > 0))
      this._x = width - this._width;
    else
      this._x += qtdMuda;
  }
  andarX(direita)
  {
    if (direita)
      this.mudarX(this._qtdAndar);
    else
      this.mudarX(-this._qtdAndar);
  }
  set y(y)
  {
    if (y >= 0 && y + this._height <= height - heightVidaUsuario)
      this._y = y;
  }
  get y()
  { return this._y; }
  mudarY(qtdMuda)
  {
    let retSair = this.vaiSairTelaY(qtdMuda);

    if (retSair == PersonagemPrincipal.SAIU_EM_CIMA
      	|| (retSair == PersonagemPrincipal.SAIU_EM_CIMA_E_EMBAIXO && qtdMuda < 0))
      this._y = 0;
    else
    if (retSair == PersonagemPrincipal.SAIU_EMBAIXO
        || (retSair == PersonagemPrincipal.SAIU_EM_CIMA_E_EMBAIXO && qtdMuda > 0))
      this._y = height - this._height - heightVidaUsuario;
    else
      this._y += qtdMuda;
  }
  andarY(baixo)
  {
    if (baixo)
      this.mudarY(this._qtdAndar);
    else
      this.mudarY(-this._qtdAndar);
  }

  //mudar qtdAndar
  get qtdAndar()
  { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  { this._qtdAndar = qtdAndar; }

  //mudarTamLado
  set tamLado(nvTamLado)
  {
    if (nvTamLado < 0)
      throw "Tamanho de lado inválido!";
    this._width = nvTamLado;
    this._height = nvTamLado;
  }
  mudarTamLado(qtdMuda)
  {
    if (this._width + qtdMuda < 0)
      throw "QtdMuda tamanho de lado inválido!";
    this._width += qtdMuda;
    this._height += qtdMuda;
  }
}

class Tiro extends ObjetoTela
{
  constructor(x, y, height, width, cor, qtdAndar, qntTiraVida)
  {
    super(x, y, height, width, cor);
    this._qtdAndar = qtdAndar;
    this._qntTiraVida = qntTiraVida;
  }

  andar()
  {
    this._y -= this._qtdAndar;
    return this._y + this._height > 0;
  }

  tirarVidaPers(pers)
  {
    pers.mudarVida(-this._qntTiraVida);
  }
}

class Inimigo extends PersComTiros
{
  constructor(x, y, width, height, cor, vida, corVida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarTiro)
  {
    super(x, y, width, height, cor, vida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarTiro);
    this._corVida = corVida;

    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;
  }
  
  set height(height)
  { this._height = height; }
  mudarHeight(qtdMuda)
  {
    this._height += qtdMuda;
    if (this._height < 0)
      this._height = 0;
    return this._height > 0;
  }

  set width(width)
  { this._width = width; }
  mudarwidth(qtdMuda)
  {
    this._width += qtdMuda;
    if (this._width < 0)
      this._width = 0;
    return this._width > 0;
  }
  
  draw()
  {
    super.draw();
    
    //draw vida em cima do inimigo
    let xVida = this._x + (this._width - this._widthVida)/2;
    let yVida = this._y - (this._heightVida + 5);
    
    //desenhar parte branca da vida
    stroke(0);
    fill(255);
    rect(xVida, yVida, this._widthVida, this._heightVida);
    
    //desenhar a parte verdadeira
    noStroke();
    fill(this._corVida);
    rect(xVida, yVida, this._widthVida*(this._vida/this._vidaMAX), this._heightVida);
  }
}

class Obstaculo extends ObjetoTela
{
  set height(height)
  { this._height = height; }
  mudarHeight(qtdMuda)
  {
    this._height += qtdMuda;
    if (this._height < 0)
      this._height = 0;
    return this._height > 0;
  }

  set width(width)
  { this._width = width; }
  mudarwidth(qtdMuda)
  {
    this._width += qtdMuda;
    if (this._width < 0)
      this._width = 0;
    return this._width > 0;
  }
}
