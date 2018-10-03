class PersComTiros extends ObjetoTela
{
  constructor(x, y, width, height, cor, vida, ehPersPrincipal,
		widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao)
	{
		//personagem
    super(x, y, width, height, cor);
		this._vida = vida;
		this._vidaMAX = vida;
		this._ehPersPrincipal = ehPersPrincipal;

		//tiro
    this._widthTiroPadrao = widthTiroPadrao;
    this._heightTiroPadrao = heightTiroPadrao;
    this._corTiroPadrao = corTiroPadrao;
		this._qtdAndarXTiroPadrao = qtdAndarXTiroPadrao;
		this._qtdAndarYTiroPadrao = qtdAndarYTiroPadrao;
		this._qtdMortalidadeTiroPadrao = qtdMortalidadeTiroPadrao;

		//LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
		// ir adicionando os tiros no comeco e ir tirando os que jah sairam da tela do final
    this._tiros = new ListaDuplamenteLigada();
  }

  //getter vida
  get vida()
  { return this._vida; }
  get vidaMAX()
  { return this._vidaMAX; }

	//mudar vida
	colocarMAXVida()
	{ this._vida = this._vidaMAX; }
	zerarVida()
	{ this._vida = 0; }
	mudarVida(qtdMuda)
	{
		this._vida += qtdMuda;
		if (this._vida < 0)
			this._vida = 0;
		return this._vida != 0;
	}

  //getters and setters tiro
  mudarWidthTiroPadrao(qtdMuda)
  {
    this._widthTiroPadrao += qtdMuda;
    if (this._widthTiroPadrao < 0)
      this._widthTiroPadrao = 0;
    return this._widthTiroPadrao != 0;
  }
  mudarHeightTiroPadrao(qtdMuda)
  {
    this._heightTiroPadrao += qtdMuda;
    if (this._heightTiroPadrao < 0)
      this._heightTiroPadrao = 0;
    return this._heightTiroPadrao != 0;
  }
	get widthTiroPadrao()
	{ return this._widthTiroPadrao; }
	get heightTiroPadrao()
	{ return this._heightTiroPadrao; }


  //TIROS
  adicionarTiro(qtdAndarX, qtdAndarY, qtdMortalidade, cor, x, y, width, height)
	//essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
		if (x == null)
			x = this._x + (this._width - this._widthTiroPadrao)/2;
		if (y == null)
			y = this._y - (this._heightTiroPadrao + 1);
		if (width == null)
			width = this._widthTiroPadrao;
		if (height == null)
			height = this._heightTiroPadrao;
		if (cor == null)
			cor = this._corTiroPadrao;
		if (qtdAndarX == null)
			qtdAndarX = this._qtdAndarXTiroPadrao;
		if (qtdAndarY == null)
			qtdAndarY = this._qtdAndarYTiroPadrao;
		if (qtdMortalidade == null)
			qtdMortalidade = this._qtdMortalidadeTiroPadrao;

		//criar tiro e adicionar ao comeco da lista
    let novoTiro = new Tiro(x, y, width, height, cor, qtdAndarX, qtdAndarY, this._ehPersPrincipal, qtdMortalidade);
		this._tiros.inserirNoComeco(novoTiro);
  }
  andarTiros(pers, obstaculos, inimigos)
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
			let estahDentroTela = this._tiros.atual.andar(pers, obstaculos, inimigos);
			if (!estahDentroTela) //saiu
				this._tiros.removerAtual();
      this._tiros.andarAtual();
		}
  }

	//draw
	draw()
	{
		super.draw();

		this._tiros.colocarAtualComeco();
		while (!this._tiros.atualEhNulo)
    {
      this._tiros.atual.draw();
      this._tiros.andarAtual();
    }
	}
}


class PersonagemPrincipal extends PersComTiros
{
  constructor(x, y, tamLado, qtdAndar, cor, vida,
    widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao)
  {
    super(x, y, tamLado, tamLado, cor, vida, true,
      widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao);
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
    let retSair = Tela.objVaiSairEmX(this, qtdMuda);

    if (retSair == Tela.SAIU_ESQUERDA
        || (retSair == Tela.SAIU_DIREITA_E_ESQUERDA && qtdMuda < 0))
      this._x = 0;
    else
    if (retSair == Tela.SAIU_DIREITA
        || (retSair == Tela.SAIU_DIREITA_E_ESQUERDA && qtdMuda > 0))
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
    let retSair = Tela.objVaiSairEmY(this, qtdMuda);

    if (retSair == Tela.SAIU_EM_CIMA
      	|| (retSair == Tela.SAIU_EM_CIMA_E_EMBAIXO && qtdMuda < 0))
      this._y = 0;
    else
    if (retSair == Tela.SAIU_EMBAIXO
        || (retSair == Tela.SAIU_EM_CIMA_E_EMBAIXO && qtdMuda > 0))
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


class Inimigo extends PersComTiros
{
  constructor(x, y, width, height, cor, vida, corVida,
    widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao)
  {
    super(x, y, width, height, cor, vida, false,
      widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarXTiroPadrao, qtdAndarYTiroPadrao, qtdMortalidadeTiroPadrao);

    this._corVida = corVida;
    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;
  }

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
