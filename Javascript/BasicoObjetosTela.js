class ObjetoTela
{
	constructor(x, y, width, height, cor)
	{
		this._x = x;
		this._y = y;
		this._height = height;
		this._width = width;
		this._cor = cor;
	}


	get height()
	{ return this._height; }

	get width()
	{ return this._width; }

	get x()
	{ return this._x; }
	set x(x)
	{ this._x = x; }
	mudarX(qtdMuda)
	{
		this._x += qtdMuda;
		return this._x + this._width > 0 && this._x < width;
	}

	static get SAIU_ESQUERDA()
	{ return 1; }
	static get SAIU_DIREITA()
	{ return 2; }
	static get SAIU_DIREITA_E_ESQUERDA()
	{ return 3; }
	vaiSairTelaX(qtdMuda)
	{
		let saiuEsquerda = (this._x + qtdMuda < 0);
		let saiuDireita = (this._x + this._width + qtdMuda > width);

		if (saiuEsquerda && saiuDireita)
			return ObjetoTela.SAIU_DIREITA_E_ESQUERDA;
		if (saiuDireita)
			return ObjetoTela.SAIU_DIREITA;
		if (saiuEsquerda)
			return ObjetoTela.SAIU_ESQUERDA;
		return 0; //nao saiu
	}

	get y()
	{ return this._y; }
	set y(y)
	{ this._y = y; }
	mudarY(qtdMuda)
	{
		this._y += qtdMuda;
		return this._y + this._height > 0 && this._y < height - heightVidaUsuario;
	}

	static get SAIU_EM_CIMA()
	{ return 4; }
	static get SAIU_EMBAIXO()
	{ return 5; }
	static get SAIU_EM_CIMA_E_EMBAIXO()
	{ return 6; }
	vaiSairTelaY(qtdMuda)
	{
		let saiuEmCima = (this._y + qtdMuda < 0);
		let saiuEmbaixo = (this._y + this._height + qtdMuda > height - heightVidaUsuario);

		if (saiuEmCima && saiuEmbaixo)
			return ObjetoTela.SAIU_EM_CIMA_E_EMBAIXO;
		if (saiuEmCima)
			return ObjetoTela.SAIU_EM_CIMA;
		if (saiuEmbaixo)
			return ObjetoTela.SAIU_EMBAIXO;
		return 0; //nao saiu
	}

	get cor()
	{ return this._cor; }
	set cor(novaCor)
	{ this._cor = novaCor; }

	//draw
	draw() //printar objeto
	{
		//mudar cores (da linha e de dentro)
		stroke(this._cor);
		fill(this._cor);

		//desenhar retangulo propriamente dito
		rect(this._x, this._y, this._width, this._height);
	}
}

class PersComTiros extends ObjetoTela
{
  constructor(x, y, width, height, cor, vida, widthTiroPadrao, heightTiroPadrao, corTiroPadrao, qtdAndarTiro)
	{
    super(x, y, width, height, cor);

    this._widthTiroPadrao = widthTiroPadrao;
    this._heightTiroPadrao = heightTiroPadrao;
    this._corTiroPadrao = corTiroPadrao;
    this._qtdAndarTiro = qtdAndarTiro;

    this._vida = vida;
		this._vidaMAX = vida;

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
  adicionarTiro()
  { 
      this.adicionarTiroLugarDif(this._x + (this._width - this._widthTiroPadrao)/2, this._y - (this._heightTiroPadrao + 1)); 
  }
  adicionarTiroLugarDif(x, y)
  { this.adicionarTiroLugarTamDif(x, y, this._widthTiroPadrao, this._heightTiroPadrao); }
  adicionarTiroLugarTamDif(x, y, widthTiro, heightTiro)
  { this.adicionarTiroLugarTamCorDif(x, y, widthTiro, heightTiro, this._corTiroPadrao); }
  adicionarTiroLugarTamCorDif(x, y, widthTiro, heigthTiro, cor)
  {
    let novoTiro = new Tiro(x, y, widthTiro, heigthTiro, cor, this._qtdAndarTiro);
    //adicionar ao comeco da lista ligada
		this._tiros.inserirNoComeco(novoTiro);
  }
  andarTiros()
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
			let estahDentroTela = this._tiros.atual.andar();
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

const _IntersecInterseccaoX = 1;
const _IntersecInterseccaoY = 2;
class Interseccao
{
	static IntersecX(obj1, obj2)
	{
		return Interseccao._IntersecDirecao(obj1.x, obj1.width, obj2.x, obj2.width);
	}

	static IntersecY(obj1, obj2)
	{
		return Interseccao._IntersecDirecao(obj1.y, obj1.height, obj2.y, obj2.height);
	}

	static _IntersecDirecao(inicio1, distancia1, inicio2, distancia2)
	{
		if (distancia1 <= distancia2)
			return (inicio1 >= inicio2 && inicio1 <= inicio2 + distancia2)
				|| (inicio1 + distancia1 >= inicio2 && inicio1 + distancia1 <= inicio2 + distancia2);
		else
			return (inicio2 >= inicio1 && inicio2 <= inicio1 + distancia1)
				|| (inicio2 + distancia2 >= inicio1 && inicio2 + distancia2 <= inicio1 + distancia1);
	}

	static Interseccao(obj1, obj2)
	{
		let intersecX = Interseccao.IntersecX(obj1, obj2);
		let intersecY = Interseccao.IntersecY(obj1, obj2);

		if (!intersecX && !intersecY)
			return 0;
		if (intersecX && !intersecY)
			return Interseccao.IntersecEmX;
		if (intersecY && !intersecX)
			return Interseccao.IntersecEmY;
		return Interseccao._IntersecNosDois;
	}

	//constantes interseccao X ou Y
	static get IntersecEmX()
	{ return 1; }
	static get IntersecEmY()
	{ return 2; }
	static get _IntersecNosDois()
	{ return 3; }
}
