//ponto, reta e semirreta
class Ponto
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }

  static max(p1, p2)
  {
    if (p1.y < p2.y)
      return p1;
    if (p2.y < p1.y)
      return p2;
    return (p1.x<p2.x ? p1 : p2);
  }
}

class Reta
{
  constructor(a, b)
  {
    if (a.x == b.x && a.y == b.y)
      throw "Esses dois pontos não formam uma reta!"

    //de cima para baixo, da esquerda para direita
    this._a = a;
    this._b = b;

    this._height = this._a.y - this._b.y;
    this._width = this._a.x - this._b.x;
  }

  //retorna 0 se estah em cima, >0 se estah a direita e <0 se estiver a esquerda
  ondePontoEstah(ponto)
  {
    let widthDeveria = (ponto.y - this._a.y)*this._width/this._height;
    let xDeveria = this._a.x + widthDeveria;

    return ponto.x - xDeveria;
  }
}

class Semirreta extends Reta
{
  constructor(a, b)
  { super(a,b); }

  intersecta(semirreta)
  {
    // https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

    // Find the four orientations needed for general and
    // special cases
    let orient1 = Geometria.orientacao(this._a, this._b, semirreta._a);
    let orient2 = Geometria.orientacao(this._a, this._b, semirreta._b);
    let orient3 = Geometria.orientacao(semirreta._a, semirreta._b, this._a);
    let orient4 = Geometria.orientacao(semirreta._a, semirreta._b, this._b);

    // General case
    if (orient1 != orient2 && orient3 != orient4)
        return true;

    // Special Cases
    // this._a, this._b and semirreta._a are colinear and semirreta._a lies on segment this._athis._b
    if (orient1 == 0 && this.pontoEstah(semirreta._a)) return true;

    // this._a, this._b and semirreta._b are colinear and semirreta._b lies on segment this._athis._b
    if (orient2 == 0 && this.pontoEstah(semirreta._b)) return true;

    // semirreta._a, semirreta._b and this._a are colinear and this._a lies on segment semirreta._asemirreta._b
    if (orient3 == 0 && semirreta.pontoEstah(this._a)) return true;

     // semirreta._a, semirreta._b and this._b are colinear and this._b lies on segment semirreta._asemirreta._b
    if (orient4 == 0 && semirreta.pontoEstah(this._b)) return true;

    return false; // Doesn't fall in any of the above cases
  }

  pontoEstah(ponto)
  {
    return (ponto.x <= max(this._a.x, this._b.x) && ponto.x >= min(this._a.x, this._b.x) &&
        ponto.y <= max(this._a.y, this._b.y) && ponto.y >= min(this._a.y, this._b.y));
  }

  ondePontoEstah(ponto)
  {
    if (ponto.y > this._a.y || ponto.y < this._b.y)
        throw "Ponto não está no Y certo!";
    return super.ondePontoEstah(ponto);
  }
}

const Direcao = {"Direita":1, "Esquerda":2, "Cima":3, "Baixo":4};

//operacoes e funcoes basicas de geometria
class Interseccao
{
	//ESTAH INTERSECTANDO
	static intersecDirecao(inicio1, distancia1, inicio2, distancia2)
	{
		if (distancia1 <= distancia2)
			return (inicio1 >= inicio2 && inicio1 <= inicio2 + distancia2)
				|| (inicio1 + distancia1 >= inicio2 && inicio1 + distancia1 <= inicio2 + distancia2);
		else
			return (inicio2 >= inicio1 && inicio2 <= inicio1 + distancia1)
				|| (inicio2 + distancia2 >= inicio1 && inicio2 + distancia2 <= inicio1 + distancia1);
	}

	static interseccao(obj1, obj2) //obj1 e obj2 = ObjetoTela
	{
		if (obj1.codForma > obj2.codForma)
			return obj1.intersectar(obj2);
		else
			return obj2.intersectar(obj1);
	}

	static interseccaoRetDesmontado(x1, y1, width1, height1, x2, y2, width2, height2)
	{
		return Interseccao._intersecDirecao(x1, width1, x2, width2) &&
			Interseccao._intersecDirecao(y1, height1, y2, height2);
	}

	//VAI INTERSECTAR
  static qntPodeAndarAntesIntersec(obj1, obj2, qtdAndarX, qtdAndarY) //Obj1 e Obj2 devem ser formas geometricas
  //retorna qtdPodeAndar (x,y) para nao intersectar
  { return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, false); }

  static vaiTerInterseccao(obj1, obj2, qtdAndarX, qtdAndarY) //Obj1 e Obj2 devem ser formas geometricas
  { return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, true); }

	static _interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, returnTrueFalse)
  //Obj1 e Obj2 devem ser formas geometricas
	//se returnTrueFalse, retorna para VaiTerInterseccao; else, retorna para QntPodeAndarAntesIntersec
	{
		if (Interseccao.interseccao(obj1, obj2) || qtdAndarX == 0 && qtdAndarY == 0)
			return new Ponto(0, 0);

		let qtdPodeAndar = new Ponto(qtdAndarX, qtdAndarY);

		//caso especial mais simples: se o que anda eh um retangulo
		if (obj2.codForma == Geometria.COD_QUADRADO || obj2.codForma == Geometria.COD_RETANGULO)
		{
			// SE ANDA SOH EM UMA DIRECAO:
			if (qtdAndarX == 0)
			{
				if (qtdAndarY < 0)
				{
					let nvRetangulo = new Retangulo(obj2.x, obj2.y + qtdAndarY, obj2.width, obj2.height - qtdAndarY);

          if (returnTrueFalse)
            return Interseccao.interseccao(obj1, nvRetangulo);

					if (Interseccao.interseccao(obj1, nvRetangulo))
						qtdPodeAndar.y += obj2.y + qtdAndarY - obj1.y -1;
				}else
				{
					let nvRetangulo = new Retangulo(obj2.x, obj2.y, obj2.width, obj2.height - qtdAndarY);

          if (returnTrueFalse)
            return Interseccao.interseccao(obj1, nvRetangulo);

					if (Interseccao.interseccaoObjDesmontado(obj1, nvRetangulo))
						qtdPodeAndar.y += obj1.y - (obj2.y + obj2.height - qtdAndarY) -1;
				}

				return qtdPodeAndar;
			}
			if (qtdAndarY == 0)
			{
				if (qtdAndarX < 0)
				{
					let nvRetangulo = new Retangulo(obj2.x + qtdAndarX, obj2.y, obj2.width - qtdAndarX, obj2.height);

          if (returnTrueFalse)
            return Interseccao._interseccao(obj1, nvRetangulo);

					if (Interseccao.interseccaoObjDesmontado(obj1, nvRetangulo)
						qtdPodeAndar.x += obj2.x + qtdAndarX - obj1.x -1;
				}else
				{
					let nvRetangulo = new Retangulo(obj2.x, obj2.y, obj2.width - qtdAndarX, obj2.height);

          if (returnTrueFalse)
            return Interseccao.interseccao(obj1, nvRetangulo);

					if (Interseccao.interseccaoObjDesmontado(obj1, nvRetangulo))
						qtdPodeAndar.x += obj1.x - (obj2.x + obj2.width - qtdAndarX) -1;
				}

				return qtdPodeAndar;
			}
		}

		// daqui pra baixo andar pras duas direcoes e/ou eh triangulo, paralelogramo ou quadrilatero
		ARRUMAR DAQUI PRA FRENTE!!

		let paralelogramo1;
		switch (obj2.codForma)
		{
			case Geometria.COD_RETANGULO:
			case Geometria.COD_QUADRADO:
				if ((qtdAndarX > 0 && qtdAndarY > 0) || (qtdAndarX < 0 && qtdAndarY > 0))
				{
					paralelogramo1.x1 = obj2.x;
					paralelogramo1.y1 = obj2.y + obj2.height;
					paralelogramo1.x2 = obj2.x + qtdAndarX;
					paralelogramo1.y2 = obj2.y + obj2.height + qtdAndarY;
				}else
				//if ((qtdAndarX > 0 && qtdAndarY < 0) || (qtdAndarX < 0 && qtdAndarY < 0))
				{
					paralelogramo1.x1 = obj2.x + qtdAndarX;
					paralelogramo1.y1 = obj2.y + qtdAndarY;
					paralelogramo1.x2 = obj2.x;
					paralelogramo1.y2 = obj2.y;
				}


				break;
			case Geometria.COD_TRIANGULO:

				break;
			case Geometria.COD_PARALELOGRAMO:

				break;
			case Geometria.COD_QUADRILATERO:

				break;
		}

		//daqui pra baixo paralelogramo jah estah montado...




		/*
		//se <= ZERO: quanto tem q diminuir no qtdAndarX (diminuir um a mais).
		 //ps: soh vai diminuir se os dois (qtdMudaAndarX e qtdMudaAndarY) forem <= ZERO
		let qtdMudaAndarX;
		if (qtdAndarX > 0)
				qtdMudaAndarX = obj1.x - (obj2.x + obj2.width + qtdAndarX);
		else
		if (qtdAndarX < 0)
			qtdMudaAndarX = (obj2.x - qtdAndarX) - obj1.x;
		else
			qtdMudaAndarX = 0;

		//se <= ZERO: quanto tem q diminuir no qtdAndarX (diminuir um a mais).
		 //ps: soh vai diminuir se os dois (qtdMudaAndarX e qtdMudaAndarY) forem <= ZERO
		let qtdMudaAndarY;
		if (qtdAndarY > 0)
			qtdMudaAndarY = obj1.y - (obj2.y + obj2.height + qtdAndarY);
		else
		if (qtdAndarY < 0)
			qtdMudaAndarY = (obj2.y - qtdAndarY) - obj1.y;
		else
			qtdMudaAndarY = 0;

		//TEM QUE SER PROPORCIONAL!! (MAIOR PROPORCIONAL)
			//pensar se eh pelo proporcional ou nao, e se eh o maior ou menor
		let proporcaoMudarX = ; */
	}
}

class Tela
{
	//JAH SAIU
	static objSaiuTotalmente(obj) //obj = formageometrica
	{
		//      saiu p/ direita || saiu p/ esquerda
		if (obj.menorX >= width || obj.maiorX <= 0) //X
			return true;
		//                           saiu p/ direita || saiu p/ esquerda
		if (obj.menorY >= height - heightVidaUsuario || obj.maiorY <= 0) //Y
			return true;
		return false;
	}

	//OBJETO VAI SAIR
	static get SAIU_ESQUERDA()
	{ return 1; }
	static get SAIU_DIREITA()
	{ return 2; }
	static objVaiSairEmX(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ direita
		if (obj.menorX + qtdMuda >= width)
			return Tela.SAIU_DIREITA;
    //saiu p/ esquerda
    if (obj.maiorX + qtdMuda <= 0)
      return Tela.SAIU_ESQUERDA;
    return 0; //nao saiu
	}
  static objSaiuEmX(obj) //obj = formageometrica
  { return Tela.objVaiSairEmX(obj, 0); }
  static qtdAndarObjNaoSairX(obj, qtdMuda) //obj = formageometrica
  {
    let direcaoSair = Tela.objVaiSairEmX(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair == Direcao.SAIU_DIREITA)
      return width - (obj.x + obj.width);
    else
    if (direcaoSair == Direcao.SAIU_ESQUERDA)
      return obj.x;
    return -1;
  }

	static get SAIU_EM_CIMA()
	{ return 4; }
	static get SAIU_EMBAIXO()
	{ return 5; }
	static objVaiSairEmY(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ direita
		if (obj.menorY + qtdMuda >= height - heightVidaUsuario)
			return Tela.SAIU_EMBAIXO;
    //saiu p/ esquerda
    if (obj.maiorY + qtdMuda <= 0)
      return Tela.SAIU_EM_CIMA;
    return 0; //nao saiu
	}
  static objSaiuEmY(obj) //obj = formageometrica
  { return Tela.objVaiSairEmY(obj, 0); }
  static qtdAndarObjNaoSairY(obj, qtdMuda) //obj = formageometrica
  {
    let direcaoSair = Tela.objVaiSairEmY(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair == Direcao.SAIU_EMBAIXO)
      return height - heightVidaUsuario - (obj.y + obj.height);
    else
    if (direcaoSair == Direcao.SAIU_EM_CIMA)
      return obj.y;
    return -1;
  }

  //OUTROS
  static xParaEstarNoMeio(widthObj)
  { return (width-widthObj)/2; }
}

class Operacoes
{
	hipotenusa(cateto1, cateto2)
	{
		return Math.sqrt(cateto1*cateto1 + cateto2*cateto2);
	}
}

class Geometria
{
  //0: colinear, 1: sentido horário, 2: sentido anti-horário
  static orientacao(p1, p2, p3)
  {
      // https://www.geeksforgeeks.org/orientation-3-ordered-points/
      var val = (p2.y - p1.y)*(p3.x - p2.x) -
                (p2.x - p1.x)*(p3.y - p2.y);

      if (val == 0) return 0; // colinear

      return (val > 0)? 1: 2; // sentido horário ou anti-horário
  }

  //FORMAS: quadrado, retangulo, triangulo, paralelogramo, quadrilatero
  static get COD_QUADRADO()
  { return 1; }
  static get COD_RETANGULO()
  { return 2; }
  static get COD_TRIANGULO()
  { return 3; }
  static get COD_PARALELOGRAMO()
  { return 4; }
  static get COD_QUADRILATERO()
  { return 5; }
}
