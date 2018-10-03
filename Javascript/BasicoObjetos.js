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

	get y()
	{ return this._y; }
	set y(y)
	{ this._y = y; }
	mudarY(qtdMuda)
	{
		this._y += qtdMuda;
		return this._y + this._height > 0 && this._y < height - heightVidaUsuario;
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

class Interseccao
{
	static IntersecX(obj1, obj2)
	{
		return Interseccao._IntersecDirecao(obj1.x, obj1._width, obj2.x, obj2._width);
	}

	static IntersecY(obj1, obj2)
	{
		return Interseccao._IntersecDirecao(obj1.y, obj1._height, obj2.y, obj2._height);
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
		return Interseccao.IntersecX(obj1, obj2) && Interseccao.IntersecY(obj1, obj2);
	}
}

class Tela
{
	static objSaiuTotalmente(obj)
	{
		//SAIU EM X
		if (obj.x + obj.width <= 0 || obj.x >= width)
			return true;
		//SAIU EM Y
		if (obj.y + obj.height <= 0 || obj.y >= height - heightVidaUsuario)
			return true;
		return false; //nao saiu
	}

	//OBJETO VAI SAIR
	static get SAIU_ESQUERDA()
	{ return 1; }
	static get SAIU_DIREITA()
	{ return 2; }
	static get SAIU_DIREITA_E_ESQUERDA()
	{ return 3; }
	static objVaiSairEmX(obj, qtdMuda)
	{
		let saiuEsquerda = (obj.x + qtdMuda < 0);
		let saiuDireita = (obj.x + obj.width + qtdMuda > width);

		if (saiuEsquerda && saiuDireita)
			return Tela.SAIU_DIREITA_E_ESQUERDA;
		if (saiuDireita)
			return Tela.SAIU_DIREITA;
		if (saiuEsquerda)
			return Tela.SAIU_ESQUERDA;
		return 0; //nao saiu
	}

	static get SAIU_EM_CIMA()
	{ return 4; }
	static get SAIU_EMBAIXO()
	{ return 5; }
	static get SAIU_EM_CIMA_E_EMBAIXO()
	{ return 6; }
	static objVaiSairEmY(obj, qtdMuda)
	{
		let saiuEmCima = (obj.y + qtdMuda < 0);
		let saiuEmbaixo = (obj.y + obj.height + qtdMuda > height - heightVidaUsuario);

		if (saiuEmCima && saiuEmbaixo)
			return Tela.SAIU_EM_CIMA_E_EMBAIXO;
		if (saiuEmCima)
			return Tela.SAIU_EM_CIMA;
		if (saiuEmbaixo)
			return Tela.SAIU_EMBAIXO;
		return 0; //nao saiu
	}
}
