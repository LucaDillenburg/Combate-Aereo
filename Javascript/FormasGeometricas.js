//import "GeometriaBasica.js";

//FORMAS: quadrado, retangulo, triangulo, paralelogramo, quadrilatero

// BASICO
class FormaGeometrica /*implements InterfaceFormaGeometrica*/
{
  constructor (strokeColor, fillColor, img)
  {
    //cor
    this._strokeColor = strokeColor;
    this._fillColor = fillColor;

    this._img = img;
  }

  //cor
  get strokeColor()
  { return this._strokeColor; }
  set strokeColor(stroke)
  { this._strokeColor = stroke; }

  get fillColor()
  { return this._fillColor; }
  set fillColor(fill)
  { this._fillColor = fill; }

  _colocarCores()
  {
    stroke(this._strokeColor);
    fill(this._fillColor);
  }

  //img
  get img()
  { return this._img; }
  set img(img)
  { this._img = img; }

  get width()
  { return this.maiorX - this.menorX; }
  get height()
  { return this.maiorY - this.menorY; }

  colocarNoMeioX()
  { this.x = Tela.xParaEstarNoMeio(this.width); }

  //desenhar imagem
  _desenharImagem()
  {
    image(this._img, this.x, this.y, this.width, this.height);
  }
}
/*interface InterfaceFormaGeometrica
{
  //forma
  get codForma()
  get nLados()
  get vertices()
  get arestas()
  interseccao(obj)

  get menorX()
  get maiorX()
  get menorY()
  get maiorY()

  get width()
  get height()

  get x()
  set x()
  get y()
  set y()

  //cor
  get strokeColor()
  set strokeColor(stroke)
  get fillColor()
  set fillColor(fill)

  //forma e cor
  draw()
} */


// FORMAS SIMPLES
class FormaGeometricaSimples extends FormaGeometrica
{
  constructor(x, y, strokeColor, fillColor, img)
  {
    super(strokeColor, fillColor, img);
    this._x = x;
    this._y = y;

    this._vertices = null;
    this._arestas = null;
  }

  get nLados()
  { return 4; }
  get vertices()
  {
    if (this._vertices == null)
    {
      this._vertices = new Array(4);
      this._vertices[0] = new Ponto(this._x, this._y);
      this._vertices[1] = new Ponto(this._x + this.width, this._y);
      this._vertices[2] = new Ponto(this._x, this._y + this.height);
      this._vertices[3] = new Ponto(this._x + this.width, this._y + this.height);
    }

    return this._vertices;
  }
  get arestas()
  {
    if (this._arestas == null)
    {
      this._arestas = new Array(4);
      this._arestas[0] = new Semirreta(this._vertices[0], this._vertices[1]);
      this._arestas[1] = new Semirreta(this._vertices[1], this._vertices[3]);
      this._arestas[2] = new Semirreta(this._vertices[2], this._vertices[3]);
      this._arestas[3] = new Semirreta(this._vertices[0], this._vertices[2]);
    }

    return this._arestas;
  }

  _mudouArestasVertices()
  {
    this._vertices = null;
    this._arestas = null;
  }

  //forma
  set x(x)
  {
    if (this._x == x)
      return;
    this._mudouArestasVertices();

    this._x = x;
  }
  get x()
  { return this._x; }
  mudarX(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar X)
  {
    this._x += qtdMuda;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    //se aparece um pouco
    return this._x + this._width > 0 && this._x <= width;
  }
  set y(y)
  {
    if (this._y == y)
      return;
    this._mudouArestasVertices();

    this._y = y;
  }
  get y()
  { return this._y; }
  mudarY(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar Y)
  {
    this._y += qtdMuda;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    //se aparece um pouco
    return this._y + this._height > 0 && this._y <= height - heightVidaUsuario;
  }

  menorX()
  { return this._x; }
  maiorX()
  { return this._x + this.width; }
  menorY()
  { return this._y; }
  maiorY()
  { return this._y + this.height; }

  //draw
  draw()
  {
    if (this._img == null)
    {
      this._colocarCores();
      //desenhar retangulo
      rect(this._x, this._y, this.width, this.height);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }
}

class Retangulo extends FormaGeometricaSimples
{
  constructor(x, y, width, height, strokeColor, fillColor, img)
  {
    super(x, y, strokeColor, fillColor, img);

    if (width < 0 || height < 0)
      throw "Dados inválidos para criar retângulo!";

    this._width = width;
    this._height = height;
  }

  //getters basicos
  get codForma()
  { return 2; }


  //getters e setters tamanho
  set width(width)
  {
    if (width == this._width)
      return;
    this._mudouArestasVertices();

    this._width = width;
  }
  get width()
  { return this._width; }
  mudarWidth(qtdMuda)
  {
    this._width += qtdMuda;
    if (this._width < 0)
      this._width = 0;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    return this._width > 0;
  }
  set height(height)
  {
    if (height == this._height)
      return;
    this._mudouArestasVertices();

    this._height = height;
  }
  get height()
  { return this._height; }
  mudarHeight(qtdMuda)
  {
    this._height += qtdMuda;
    if (this._height < 0)
      this._height = 0;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    return this._height > 0;
  }

  interseccao(obj)
  {
    return Interseccao.intersecDirecao(this._x, this._width, obj._x, obj._width)
      && Interseccao.intersecDirecao(this._y, this._height, obj._y, obj._height);
  }
}

class Quadrado extends FormaGeometricaSimples
{
  constructor(x, y, tamanhoLado, strokeColor, fillColor, img)
  {
    super(x, y, strokeColor, fillColor, img);

    if (width < 0 || height < 0)
      throw "Dados inválidos para criar quadrado!";

    this._tamLado = tamanhoLado;

    this._vertices = null;
    this._arestas = null;
  }

  //getters basicos
  get codForma()
  { return 1; }

  //getters e setters tamanho
  set tamanhoLado(tamLado)
  {
    if (this._tamLado == tamLado)
      return;
    this._mudouArestasVertices();

    this._tamLado = tamLado;
  }
  get tamanhoLado()
  { return this._tamLado; }
  mudarTamanhoLado(qtdMuda)
  {
    this._tamLado += qtdMuda;
    if (this._tamLado < 0)
      this._tamLado = 0;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    return this._tamLado > 0;
  }
  get width()
  { return this._tamLado; }
  get height()
  { return this._tamLado; }

  interseccao(obj)
  {
    return Interseccao.intersecDirecao(this._x, this._tamLado, obj._x, obj._tamLado)
      && Interseccao.intersecDirecao(this._y, this._tamLado, obj._y, obj._tamLado);
  }
}


//FORMAS COMPLEXAS
class FormaGeometricaComplexa extends FormaGeometrica /*implements InterfaceFormaGeometricaComplexa */
{
  constructor (a, strokeColor, fillColor, img)
  {
    super(strokeColor, fillColor, img);

    //forma
    this._a = a;

    this._width = null;

    this._maiorX = null;
    this._menorX = null;

    this._vertices = null;
    this._arestas = null;
  }

  _mudouArestasVertices()
  {
    this._vertices = null;
    this._arestas = null;
  }

  //forma
  set x(novoX) //muda todos os vertices
  { this.mudarX(novoX - this._a.x); }
  get x()
  { return this._a.x; }
  mudarX(qtdMuda) //muda todos os vertices
  {
    let maior = qtdMuda;
    let menor = width + qtdMuda;
    for (let i = 0; i<this.vertices.length; i++)
    {
      this._mudarVerticeX(i, vertices[i].x + qtdMuda);
      if (this.vertices[i].x < menor)
        menor = this.vertices[i].x;
      if (this.vertices[i].x > maior)
        maior = this.vertices[i].x;
    }

    this._maiorX = maior;
    this._menorX = menor;

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    return (maior > 0 && maior < width) || (menor > 0 && menor < width);
  }
  set y(novoY) //muda todos os vertices
  { this.mudarY(novoY - this._a.y); }
  get y()
  { return this._a.y; }
  mudarY(qtdMuda) //muda todos os vertices
  {
    for (let i = 0; i<this.vertices.length; i++)
      this._mudarVerticeY(i, vertices[i].y + qtdMuda);

    if (qtdMuda != 0)
      this._mudouArestasVertices();

    return (this.vertices[this.vertices.length-1].x > 0 &&
      this.vertices[this.vertices.length-1].x < height - heightVidaUsuario) ||
      (this.vertices[0].x > 0 && this.vertices[0].x < height - heightVidaUsuario);
  }

  get width()
  { return this.maiorX - this.menorX; }
  get height()
  { return this.maiorY - this.menorY; }

  _pegarMenorMaiorX()
  {
    let maior = 0;
    let menor = width;
    for (let i = 0; i<this.vertices.length; i++)
    {
      if (this.vertices[i].x < menor)
        menor = this.vertices[i].x;
      if (this.vertices[i].x > maior)
        maior = this.vertices[i].x;
    }

    this._maiorX = maior;
    this._menorX = menor;
  }
  menorX()
  {
    if (this._menorX == null)
      this._pegarMenorMaiorX();
    return this._menorX;
  }
  maiorX()
  {
    if (this._maiorX == null)
      this._pegarMenorMaiorX();
    return this._maiorX;
  }
  menorY()
  { return this.vertices[0].y; }
  maiorY()
  { return this.vertices[this.vertices.length-1].y; }


  //interseccao
  interseccao(obj)
  {
    for(let i = 0; i<obj.vertices.length; i++)
      if ((obj.vertices[i].y >= this._a.y && obj.vertices[i].y <= this._d.y))
        for (let j = 0; j<this._triangulos.length; j++)
          if (this._trianglos[j].pontoEstahDentro(obj.vertices[i]))
            return true;

    for (let i=0; i<obj.arestas.length; i++)
      for (let j = 0; j<this.arestas.length; j++)
        if (obj.arestas[i].intersecta(this.arestas[j]))
          return true;

    return false;
  }
}
/*interface InterfaceFormaGeometricaComplexa extends InterfaceFormaGeometrica
{
  get _triangulos()
  _mudarVerticeX(i, novoValor) //mudar no vetor e no a,b,c,d
  _mudarVerticeY(i, novoValor) //mudar no vetor e no a,b,c,d
}*/

class Quadrilatero extends FormaGeometricaComplexa
{
  constructor(a, b, c, d, strokeColor, fillColor, img)
  {
    super(a, strokeColor, fillColor, img);

    //de cima para baixo, da esquerda pra direita:
    this._b = b;
    this._c = c;
    this._d = d;
  }

  //getters basicos
  get codForma()
  { return 5; }
  get nLados()
  { return 4; }
  get vertices()
  {
    if (this._vertices == null)
    {
      this._vertices = new Array(4);
      this._vertices[0] = this._a;
      this._vertices[1] = this._b;
      this._vertices[2] = this._c;
      this._vertices[3] = this._d;
    }

    return this._vertices;
  }
  get arestas()
  {
    if (this._arestas == null)
    {
      this._arestas = new Array(4);
      this._arestas[0] = new Semirreta(this._vertices[0], this._vertices[1]);
      this._arestas[1] = new Semirreta(this._vertices[1], this._vertices[3]);
      this._arestas[2] = new Semirreta(this._vertices[2], this._vertices[3]);
      this._arestas[3] = new Semirreta(this._vertices[0], this._vertices[2]);
    }

    return this._arestas;
  }

  _mudarVerticeX(i, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        this._a.x = novoValor;
        break;
      case 1:
        this._b.x = novoValor;
        break;
      case 2:
        this._c.x = novoValor;
        break;
      case 3:
        this._d.x = novoValor;
        break;
    }
    let i = this.vertices.length; //soh pra montar o vetor dos vertices (pode ser que ainda nao tivesse montado)
    this._vertices[i].x = novoValor;
  }
  _mudarVerticeY(i, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        this._a.y = novoValor;
        break;
      case 1:
        this._b.y = novoValor;
        break;
      case 2:
        this._c.y = novoValor;
        break;
      case 3:
        this._d.y = novoValor;
        break;
    }
    let i = this.vertices.length; //soh pra montar o vetor dos vertices (pode ser que ainda nao tivesse montado)
    this._vertices[i].y = novoValor;
  }

  draw()
  {
    if (this._img == null)
    {
      //colocar cores
      this._colocarCores();
      //desenhar o quadrilatero
      quad(this._a.x, this._a.y,
           this._b.x, this._b.y,
           this._d.x, this._d.y,
           this._c.x, this._c.y);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }
}

class Paralelogramo extends Quadrilatero
{
  constructor(a, b, c, d, strokeColor, fillColor, img)
  {
    super(a, b, c, d, strokeColor, fillColor, img);

    //verificar se sao pontos de um quadrilatero
    let pontoDCerto = new Ponto(b.x - a.x + c.x, b.y - a.y + c.y);
    if (this._d == null)
      this._d = pontoDCerto;
    else
    if (!pontoDCerto.equals(this._d))
      throw "Esses pontos não formam um paralelogramo!";
  }

  //getters basicos
  get codForma()
  { return 4; }
}

class Triangulo extends FormaGeometricaComplexa
{
  constructor(a, b, c, strokeColor, fillColor, img)
  {
    super(a, strokeColor, fillColor, img);

  //de cima para baixo, da esquerda para direita
    this._b = b;
    this._c = c;

    this._area = null;
  }

  //getters basicos
  get codForma()
  { return 3; }
  get nLados()
  { return 3; }
  get vertices()
  {
    if (this._vertices == null)
    {
      this._vertices = new Array(3);
      this._vertices[0] = this._a;
      this._vertices[1] = this._b;
      this._vertices[2] = this._c;
    }

    return this._vertices;
  }
  get arestas()
  {
    if (this._arestas == null)
    {
      this._arestas = new Array(3);
      this._arestas[0] = new Semirreta(this._vertices[0], this._vertices[1]);
      this._arestas[1] = new Semirreta(this._vertices[0], this._vertices[2]);
      this._arestas[2] = new Semirreta(this._vertices[1], this._vertices[2]);
    }

    return this._arestas;
  }

  arrumarVertices()
  {
    let auxA = new Ponto(this._a.x, this._a.y);
    let auxB = new Ponto(this._b.x, this._b.y);
    let auxC = new Ponto(this._c.x, this._c.y);

    let maior = Ponto.max(auxA, auxB);
    let menor = maior!=auxA?auxA:auxB;

    if (Ponto.max(maior, auxC) == auxC)
    {
      this._a = auxC;
      this._b = maior;
      this._c = menor;
    }else
    {
      this._a = maior;
      if (Ponto.max(auxC, menor) == auxC)
      {
        this._b = auxC;
        this._c = menor;
      }
      else
      {
        this._b = menor;
        this._c = auxC;
      }
    }

    this._mudouArestasVertices();
  }
  _mudarVerticeX(i, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        this._a.x = novoValor;
        break;
      case 1:
        this._b.x = novoValor;
        break;
      case 2:
        this._c.x = novoValor;
        break;
    }
    let i = this.vertices.length; //soh pra montar o vetor dos vertices (pode ser que ainda nao tivesse montado)
    this._vertices[i].x = novoValor;
  }
  _mudarVerticeY(i, novoValor) //mudar no vetor e no a,b,c,d
  {
    switch(i)
    {
      case 0:
        this._a.y = novoValor;
        break;
      case 1:
        this._b.y = novoValor;
        break;
      case 2:
        this._c.y = novoValor;
        break;
    }
    let i = this.vertices.length; //soh pra montar o vetor dos vertices (pode ser que ainda nao tivesse montado)
    this._vertices[i].y = novoValor;
  }

	pontoEstahDentro(p)
	{
		let areaTriangulo = this.area;

		let triang1 = new Triangulo(p, this._a, this._b);
		let triang2 = new Triangulo(p, this._b, this._c);
		let triang3 = new Triangulo(p, this._a, this._c);

    return triang1.area + triang2.area + triang3.area == areaTriangulo;
	}

	get area()
	{
		if (this._area == null)
			this._area = Math.abs((this._a.x*(this._b.y - this._c.y) + this._b.x*(this._c.y - this._a.y)
			+ this._c.x*(this._a.y - this._b.y))/2);
		return this._area;
	}

  draw()
  {
    if (this._img == null)
    {
      //colocar cores
      this._colocarCores();
      //desenhar triangulo
      triangle(this._a.x, this._a.y,
        this._b.x, this._b.y,
        this._c.x, this._c.y);
    }else
    //desenhar a imagem
      this._desenharImagem();
  }
}
