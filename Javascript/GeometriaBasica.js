const qtdConsideradoQuaseExato = 0.005;
class Exatidao
{
  static ehQuaseExato(n1, n2)
  {
    let diferenca = n1 - n2;
    return diferenca >= -qtdConsideradoQuaseExato && diferenca <= qtdConsideradoQuaseExato;
  }
}

//ponto, reta e semirreta (bases da geometria)
class Ponto
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }

  static max(p1, p2)
  //mais de baixo (maior Y) e da direita (maior X)
  {
    if (p1.y > p2.y)
      return p1;
    if (p2.y > p1.y)
      return p2;
    // p1.y == p2.y
    return (p1.x > p2.x ? p1 : p2);
  }

  static min(p1, p2)
  //mais de cima (menor Y) e da esquerda (menor X)
  {
    if (p1.y < p2.y)
      return p1;
    if (p2.y < p1.y)
      return p2;
    // p1.y == p2.y
    return (p1.x < p2.x ? p1 : p2);
  }

  mais(outro)
  { return new Ponto(this.x + outro.x, this.y + outro.y); }
  menos(outro)
  { return new Ponto(this.x - outro.x, this.y - outro.y); }

  dividido(divisor)
  { return new Ponto(this.x/divisor, this.y/divisor); }
  multiplicado(mult)
  { return new Ponto(this.x*mult, this.y*mult); }

  compareTo(outro)
  // <0 : se this for menor (acima e esquerda)
  // >0 : se this for maior (abaixo e direita)
  // 0: se forem iguais
  {
    if (this.y < outro.y)
      return -1;
    if (this.y > outro.y)
      return 1;

    //y eh igual
    if (this.x < outro.x)
      return -1;
    if (this.x > outro.x)
      return 1;

    //iguais
    return 0;
  }

  equals(outro, exato)
  {
    if (this.x == outro.x && this.y == outro.y)
      return true;
    else
    if (exato)
      return false;

    return Exatidao.ehQuaseExato(this.x, outro.x) && Exatidao.ehQuaseExato(this.y, outro.y);
  }

  toString()
  { return "(" + this.x + "," + this.y + ")"; }

  clone()
  { return new Ponto(this.x, this.y); }
}

class Reta
{
  constructor(a, b)
  {
    //if (a.x == b.x && a.y == b.y)
    //  throw "Esses dois pontos não formam uma reta!";

    //nao precisa ser necessariamente de cima para baixo
    this._a = a;
    this._b = b;

    this._height = this._a.y - this._b.y;
    this._width = this._a.x - this._b.x;
  }

  //retorna 0 se estah em cima, >0 se estah a direita e <0 se estiver a esquerda
  ondePontoEstah(ponto)
  {
    if (this._a.y == this._b.y)
      return ponto.y - this._a.y;

    let widthDeveria = (ponto.y - this._a.y)*this._width/this._height;
    let xDeveria = this._a.x + widthDeveria;

    return ponto.x - xDeveria;
  }
}

class Semirreta extends Reta
{
  constructor(a, b)
  { super(a,b); }

  interseccao(semirreta)
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

class Angulo
{
  constructor(a, b, c, tipoAngulo)
  {
    if (tipoAngulo == null)
      tipoAngulo = Angulo.MENOR_180;

    let ba = a.menos(b);
    let bc = c.menos(b);

    this._anguloRad = Math.acos(
      Angulo._vezes(ba, bc) / (Angulo._magnitude(ba)*Angulo._magnitude(bc))
    );

    //deixar angulo maior que 180 graus
    if (tipoAngulo != Angulo.MENOR_180)
    {
      let ondeEstah = new Reta(a,b).ondePontoEstah(c);
      if ((tipoAngulo == Angulo.MAIOR_180_CIMA && ondeEstah < 0) ||
        (tipoAngulo == Angulo.MAIOR_180_BAIXO && ondeEstah > 0))
        this._anguloRad = 2*Math.PI - this._anguloRad;
    }

    this._anguloGraus = this._anguloRad *180/Math.PI;

    this._a = a;
    this._b = b;
    this._c = c;
  }
  static get MENOR_180()
  { return 0; }
  static get MAIOR_180_CIMA()
  { return 1; }
  static get MAIOR_180_BAIXO()
  { return 2; }

  //getters
  get valorRad()
  { return this._anguloRad; }
  get valorGraus()
  { return this._anguloGraus; }
  //vertices: AB^C
  get a()
  { return this._a; }
  get b()
  { return this._b; }
  get c()
  { return this._c; }

  //aux
  static _magnitude(vetor)
  { return Math.sqrt(vetor.x*vetor.x + vetor.y*vetor.y); }
  static _vezes(vetor1, vetor2)
  { return (vetor1.x*vetor2.x) + (vetor1.y*vetor2.y); }
}

//direcao
class Direcao
{
  //obj2 em relacao a obj1 (direcao relativa de obj2 em relacao a obj1)
  static emQualDirecaoObjEsta(obj1, obj2) //obj1 e obj2 sao formas geometricas
  {
    let angulo = new Angulo(obj1.pontoAngInicial, obj1.centroMassa, obj2.centroMassa, Angulo.MAIOR_180_CIMA).valorGraus;

    if (angulo <= obj1.ultimoAngDir) //angulo >= 0
      return Direcao.Direita;
    if (angulo <= obj1.ultimoAngBaixo)
      return Direcao.Baixo;
    if (angulo <= obj1.ultimoAngEsq)
      return Direcao.Esquerda;
    //if (angulo <= 360)
    return Direcao.Cima;
  }

  //static getters
  static get Direita()
  { return 1; }
  static get Esquerda()
  { return 2; }
  static get Cima()
  { return 3; }
  static get Baixo()
  { return 4; }

  //direcoes: horizontal e vertical
  static get HORIZONTAL()
  { return 5; }
  static get VERTICAL()
  { return 6; }
  static get HORIZONTAL_E_VERTICAL()
  { return 7; }
}

//operacoes e funcoes basicas de geometria
const qntNaoColidir = 0.2;
class Interseccao
{
	//ESTAH INTERSECTANDO
	static intersecDirecao(inicio1, distancia1, inicio2, distancia2)
  // retorna se estah intersectando
	{
		if (distancia1 <= distancia2)
			return (inicio1 >= inicio2 && inicio1 <= inicio2 + distancia2)
				|| (inicio1 + distancia1 >= inicio2 && inicio1 + distancia1 <= inicio2 + distancia2);
		else
			return (inicio2 >= inicio1 && inicio2 <= inicio1 + distancia1)
				|| (inicio2 + distancia2 >= inicio1 && inicio2 + distancia2 <= inicio1 + distancia1);
	}

  static inteiroDentroDeDirecao(inicio1, distancia1, inicio2, distancia2)
  // 2 dentro de 1 ou 2 dentro de 1
	{
    return (inicio2 >= inicio1 && inicio2 + distancia2 <= inicio1 + distancia1)
     || (inicio1 >= inicio2 && inicio1 + distancia1 <= inicio2 + distancia2);
	}

	static interseccao(obj1, obj2) //obj1 e obj2 sao FormaGeometricas
  // retorna se estah intersectando
	{
		if (obj1.codForma > obj2.codForma)
			return obj1.interseccao(obj2);
		else
			return obj2.interseccao(obj1);
	}

	static interseccaoRetDesmontado(x1, y1, width1, height1, x2, y2, width2, height2)
	{
		return Interseccao.intersecDirecao(x1, width1, x2, width2) &&
			Interseccao.intersecDirecao(y1, height1, y2, height2);
	}

  static xOuYDePontoEstahDentroDirecao(xOuYDePonto, inicio, distancia)
  { return xOuYDePonto >= inicio && xOuYDePonto <= inicio + distancia; }

  static menorQtdObjColidePararColidir(objParado, objVaiAndar) //objParado e objVaiAndar sao formasGeometricas
  {
    //ver "Explicacao procCriou(...) obstaculo em relacao a colisao com pers.png"
    let xDireita = {
      valor: objParado.x + objParado.width - objVaiAndar.x,
      dir: Direcao.Direita
    };
    let xEsquerda = {
      valor: objVaiAndar.x + objVaiAndar.width - objParado.x,
      dir: Direcao.Esquerda
    };
    let yBaixo = {
      valor: objParado.y + objParado.height - objVaiAndar.y,
      dir: Direcao.Baixo
    };
    let yCima = {
      valor: objVaiAndar.y + objVaiAndar.height - objParado.y,
      dir: Direcao.Cima
    };

    let menorValorDir = minDirecao(minDirecao(yBaixo, yCima), minDirecao(xDireita, xEsquerda));
    let qtdAndar = {};
    switch (menorValorDir.dir)
    {
      case Direcao.Direita:
        qtdAndar.x = menorValorDir.valor + qntNaoColidir;
        qtdAndar.y = 0;
        break;
      case Direcao.Esquerda:
        qtdAndar.x = -menorValorDir.valor -qntNaoColidir;
        qtdAndar.y = 0;
        break;
      case Direcao.Baixo:
        qtdAndar.x = 0;
        qtdAndar.y = menorValorDir.valor + qntNaoColidir;
        break;
      case Direcao.Cima:
        qtdAndar.x = 0;
        qtdAndar.y = -menorValorDir.valor -qntNaoColidir;
        break;
    }
    return qtdAndar;
  }

	//VAI INTERSECTAR
  static qntPodeAndarAntesIntersec(obj1, obj2, qtdAndarX, qtdAndarY, andarProporcional) //Obj1 e Obj2 devem ser formas geometricas
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
  //retorna qtdPodeAndar (x,y) para nao intersectar
  {
    if (andarProporcional == null) andarProporcional = true;
    return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, false, andarProporcional);
  }

  static vaiTerInterseccao(obj1, obj2, qtdAndarX, qtdAndarY) //Obj1 e Obj2 devem ser formas geometricas
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
  { return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, true); }

	static _interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, returnTrueFalse, andarProporcional)
  //Obj1 e Obj2 devem ser formas geometricas
	//se returnTrueFalse, retorna para VaiTerInterseccao; else, retorna para QntPodeAndarAntesIntersec
  //andarProporcional eh soh para qntPodeAndarAntesIntersec
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
	{
    //se jah estah intersectando antes de andar
		if (Interseccao.interseccao(obj1, obj2))
    {
      if (returnTrueFalse)
        return true;
      else
        return {x: 0, y: 0};
    }

    //se nao quer andar nada
    if (qtdAndarX == 0 && qtdAndarY == 0)
    {
      if (returnTrueFalse)
        return false;
      else
        return {x: 0, y: 0};
    }
    // daqui pra baixo tem que querer andar alguma coisa...

		let qtdPodeAndar = {x: qtdAndarX, y: qtdAndarY};

		//caso especial mais simples: se o objeto que anda eh um quadrado ou retangulo
    //e soh andou em uma direcao
    // TODO: ABAIXO SOH FUNCIONA SE AMBOS OS OBJETOS FOREM QUADRADOS OU RETANGULOS (PROGRAMAR EM _montarParalelogramosAndar(...) PARALELOGRAMO PARA QTDANDARX E QTDANDARY = 0)
		if ((obj2.codForma == Geometria.COD_QUADRADO || obj2.codForma == Geometria.COD_RETANGULO) &&
        (qtdAndarX == 0 || qtdAndarY == 0))
		{
			// SE ANDA SOH EM UMA DIRECAO:
			if (qtdAndarX == 0)
			{
				if (qtdAndarY < 0)
				{
					let nvRetangulo = new Retangulo(obj2.x, obj2.y + qtdAndarY, obj2.width, -qtdAndarY);

          if (Interseccao.interseccao(obj1, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY);
          }else
            if (returnTrueFalse)
              return false;
				}
        //if (qtdAndarY > 0)
        else
				{
					let nvRetangulo = new Retangulo(obj2.x, obj2.y + obj2.height, obj2.width, qtdAndarY);

          if (Interseccao.interseccao(obj1, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY);
          }else
            if (returnTrueFalse)
              return false;
				}
			}else
			//if (qtdAndarY == 0)
			{
				if (qtdAndarX < 0)
				{
					let nvRetangulo = new Retangulo(obj2.x + qtdAndarX, obj2.y, -qtdAndarX, obj2.height);

          if (Interseccao.interseccao(obj1, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX);
          }else
            if (returnTrueFalse)
              return false;
				}
        //if (qtdAndarX > 0)
        else
				{
					let nvRetangulo = new Retangulo(obj2.x + obj2.width, obj2.y, qtdAndarX, obj2.height);

          if (Interseccao.interseccao(obj1, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX);
          }else
            if (returnTrueFalse)
              return false;
				}
			}

      return qtdPodeAndar;
		}

		// daqui pra baixo nao pode ser um quadrado e retangulo que soh anda pra alguma direcao... (tambem quer andar alguma coisa pelo menos)

    //EXPLICACAO: qualquer quadrado, retangulo, triangulo ou paralelogramo quando vai andar forma
    // um ou dois paralelogramos que representa(m) o caminho por onde a figura geometrica passará
    let paralelogramos = Interseccao._montarParalelogramosAndar(obj2, qtdAndarX, qtdAndarY);

		//daqui pra baixo o(s) paralelogramo(s) jah está(ão) montado(s)...

    //verificar se alguma parte do caminho do obj2 (oq vai andar) colidira com obj2
    let colidiu = Interseccao.interseccao(paralelogramos[0], obj1);
    if (paralelogramos[1] != null)
      colidiu = colidiu || Interseccao.interseccao(paralelogramos[1], obj1);

    if (returnTrueFalse)
      return colidiu;
      //retorna se vai intersectar

    if (!colidiu)
      return qtdPodeAndar;

    //daqui pra frente colidiu e eh pra retornar quanto pode andar antes de intersectar

    // TODO : isso soh funciona se os dois forem quadrados ou retangulos

    if (andarProporcional)
    {
      // a partir apenas de X
      let qtdPodeAndarX1;
      if (Interseccao.intersecDirecao(obj2.x, obj2.width, obj1.x, obj1.width))
        qtdPodeAndarX1 = 0;
      else
        qtdPodeAndarX1 = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX);
      // regra de 3 (a partir de X):
      let qtdPodeAndarY1 = (qtdPodeAndarX1*qtdAndarY)/qtdAndarX;

      // a partir apenas de Y
      let qtdPodeAndarY2;
      if (Interseccao.intersecDirecao(obj2.y, obj2.height, obj1.y, obj1.height))
        qtdPodeAndarY2 = 0;
      else
        qtdPodeAndarY2 = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY);

      if (Math.abs(qtdPodeAndarY1) >= Math.abs(qtdPodeAndarY2))
      // 1: a partir de X
        return {x: qtdPodeAndarX1, y: qtdPodeAndarY1};
      else
      // 2: a partir de Y
        return {x: (qtdPodeAndarY2*qtdAndarX)/qtdAndarY, // regra de 3 (vai andar em X proporcional de quanto andara em Y)
          y: qtdPodeAndarY2};
    }else
    //se nao precisa andar proporcional (anda o maximo que pode nas duas direcoes)
    {
      let qtdPodeAndarY;
      if (Interseccao.intersecDirecao(obj2.x, obj2.width, obj1.x, obj1.width))
      //se estah intersectando em X (eh trocado mesmo)
        qtdPodeAndarY = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY);
      else
        qtdPodeAndarY = qtdAndarY;

      let qtdPodeAndarX;
      if (Interseccao.intersecDirecao(obj2.y, obj2.height, obj1.y, obj1.height))
      //se estah intersectando em Y (eh trocado mesmo)
        qtdPodeAndarX = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX);
      else
        qtdPodeAndarX = qtdAndarX;

      return {x: qtdPodeAndarX, y: qtdPodeAndarY};
    }
	}
  static _qtdPodeAndarEmX(obj1, obj2, qtdAndarX)
  // se jah sabe que vai colidir em X
  {
    if (qtdAndarX < 0)
      return obj1.x + obj1.width - obj2.x +qntNaoColidir;
    else
    if (qtdAndarX > 0)
      return obj1.x - (obj2.x + obj2.width) -qntNaoColidir;
    else
      return 0;
  }
  static _qtdPodeAndarEmY(obj1, obj2, qtdAndarY)
  // se jah sabe que vai colidir em Y
  {
    if (qtdAndarY < 0)
      return obj1.y + obj1.height - obj2.y +qntNaoColidir;
    else
    if (qtdAndarY > 0)
      return obj1.y - (obj2.y + obj2.height) -qntNaoColidir;
    else
      return 0;
  }
  static _montarParalelogramosAndar(obj, qtdAndarX, qtdAndarY)
  //esse metodo vai retornar o(s) paralelogramo(s) que o andar de obj formaria (1 ou 2)
  {
    let paralelogramo1;
    let paralelogramo2 = null; //dependendo de qual for a figura e como andar, pode nao ter um segundo paralelogramo
    // PONTOS EM SENTIDO HORARIO
		switch (obj.codForma)
		{
			case Geometria.COD_RETANGULO:
			case Geometria.COD_QUADRADO:
        if (qtdAndarY < 0)
        {
          //paralelogramo que sai de cima
          let p1 = new Ponto(obj.x + qtdAndarX, obj.y + qtdAndarY);
          let p2 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + qtdAndarY);
          let p3 = new Ponto(obj.x + obj.width, obj.y);
          let p4 = new Ponto(obj.x, obj.y);
          paralelogramo1 = new Paralelogramo(p1, p2, p3, p4);
        }else
        {
          //paralelogramo que sai de baixo
          let p1 = new Ponto(obj.x, obj.y + obj.height);
          let p2 = new Ponto(obj.x + obj.width, obj.y + obj.height);
          let p3 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + obj.height + qtdAndarY);
          let p4 = new Ponto(obj.x + qtdAndarX, obj.y + obj.height + qtdAndarY);
          paralelogramo1 = new Paralelogramo(p1, p2, p3, p4);
        }

        if (qtdAndarX < 0)
        {
          //paralelogramo que sai do lado esquerdo
          let p1 = new Ponto(obj.x + qtdAndarX, obj.y + qtdAndarY);
          let p2 = new Ponto(obj.x, obj.y);
          let p3 = new Ponto(obj.x, obj.y + obj.height);
          let p4 = new Ponto(obj.x + qtdAndarX, obj.y + obj.height + qtdAndarY);

          if (qtdAndarY < 0)
            paralelogramo2 = new Paralelogramo(p1, p2, p3, p4);
          else
            paralelogramo2 = new Paralelogramo(p2, p3, p4, p1);
        }else
        {
          //paralelogramo que sai do lado esquerdo
          let p1 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + qtdAndarY);
          let p2 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + obj.height + qtdAndarY);
          let p3 = new Ponto(obj.x + obj.width, obj.y + obj.height);
          let p4 = new Ponto(obj.x + obj.width, obj.y);

          if (qtdAndarY < 0)
            paralelogramo2 = new Paralelogramo(p1, p2, p3, p4);
          else
            paralelogramo2 = new Paralelogramo(p4, p1, p2, p3);
        }
				break;
			case Geometria.COD_TRIANGULO:
        //a unica difereca entre o procedimento que serah feito se entrar no if ou else a seguir
        //sao as variaveis usadas e a invercao de direita e esquerda...

        //pontos
        let a, b, c;
        //o que invertera direita e esquerda
        let mult;
        if ((qtdAndarY < 0) || (qtdAndarY == 0 && qtdAndarX > 0))
        // se (qtdAndarY < 0) e uma opcao de (qtdAndarY == 0): se (qtdAndarX > 0)
        {
          // A: obj.vertices[0], B: obj.vertices[1], C: obj.vertices[2]
          a = obj.vertices[0];
          b = obj.vertices[1];
          c = obj.vertices[2];

          // direita serah considerado direita e o mesmo com a esquerda
          mult = 1;
        }else
        //if ((qtdAndarY > 0) || (qtdAndarY == 0 && qtdAndarX < 0))
        // se (qtdAndarY > 0) e uma opcao de (qtdAndarY == 0): se (qtdAndarX < 0)
        // ps: soh faltou (qtdAndarY == 0 && qtdAndarX == 0) porem nao queria andar nada jah foi tratado
        {
          // QUASE IGUAL O IF ANTERIOR. O QUE MUDA:
            //1) A -> ContraA (obj.contrVertices[0]), B -> ContraA (obj.contrVertices[1]), C -> ContraA (obj.contrVertices[2]),...
            //2) trocar DIREITA por ESQUERDA
          a = obj.contrVertices[0];
          b = obj.contrVertices[1];
          c = obj.contrVertices[2];

          // direita serah considerado esquerda e esquerda, direita (trocar esquerda e direita)
          mult = -1;
        }

        // A': A + qtdAndar, B': B + qtdAndar, C': C + qtdAndar,
        let qtdAndar = new Ponto(qtdAndarX, qtdAndarY);
        let a2 = a.mais(qtdAndar); //A'
        let b2 = b.mais(qtdAndar); //B'
        let c2 = c.mais(qtdAndar); //C'

        //linha da parte mais alta do triangulo original com a parte mais alta do triangulo
        //onde ficara se andar (reta por dois pontos: A e A')
        let linha = new Reta(a2, a);

        // Obs: Esquerda da linha: reta.ondePontoEstah(p) < 0. Direita da linha: reta.ondePontoEstah(p) > 0

        // se B' estah a esquerda da linha ou em cima dela
        if (linha.ondePontoEstah(b2)*mult <= 0)
        {
          // se B' estah a direita ou na Reta formada pelos pontos C e C'
          if (new Reta(c2, c).ondePontoEstah(b2)*mult >= 0)
            //Paralelogramo: A' - A - C - C'
            paralelogramo1 = new Paralelogramo(a2, a, c, c2);
          else
          {
            //Paralelogramos (C' eh o vertice central):
              //1) C' - C - B - B'
            paralelogramo1 = new Paralelogramo(c2, c, b, b2);
              //2) A' - A - C - C'
            paralelogramo2 = new Paralelogramo(a2, a, c, c2);
          }
        }else
        // se C' estah a direita da linha ou em cima dela
        if (linha.ondePontoEstah(c2)*mult >= 0)
        {
          if (new Reta(b2, obj.vertices[1]).ondePontoEstah(c2)*mult <= 0)
            //Paralelogramo: A' - B' - B - A
            paralelogramo1 = new Paralelogramo(a2, b2, b, a);
          else
          {
            //Paralelogramos (B' eh o vertice central):
              //1) A' - B' - B - A
              paralelogramo1 = new Paralelogramo(a2, b2, b, a);
              //2) B' - C' - C - B
              paralelogramo2 = new Paralelogramo(b2, c2, c, b);
          }
        }else
        {
          //Paralelogramos (A' eh o vertice central):
            //1) A' - B' - B - A
            paralelogramo1 = new Paralelogramo(a2, b2, b, a);
            //2) A' - A - C - C'
            paralelogramo2 = new Paralelogramo(a2, a, c, c2);
        }
				break;
			case Geometria.COD_PARALELOGRAMO:
        // TODO :
        throw "FUNCIONALIDADE AINDA NAO EXISTE!!";
				break;
			case Geometria.COD_QUADRILATERO:
        // TODO:
        throw "FUNCIONALIDADE AINDA NAO EXISTE!!";
				break;
		}

    let ret = new Array(2);
    ret[0] = paralelogramo1;
    ret[1] = paralelogramo2;
    return ret;
  }
}

const espacoLadosTela = 4;
class Tela
{
	//JAH SAIU
	static objSaiuTotalmente(obj) //obj = formageometrica
	{
		//      saiu p/ direita || saiu p/ esquerda
		if (obj.menorX >= width || obj.maiorX <= 0) //X
			return true;
		//         saiu p/ baixo                     || saiu p/ cima
		if (obj.menorY >= height - heightVidaUsuario || obj.maiorY <= 0) //Y
			return true;
		return false;
	}

	//OBJETO VAI SAIR
	static objVaiSairEmX(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ direita
		if (obj.maiorX + qtdMuda > width - espacoLadosTela)
			return Direcao.Direita;
    //saiu p/ esquerda
    if (obj.menorX + qtdMuda < espacoLadosTela)
      return Direcao.Esquerda;
    return 0; //nao saiu
	}
  static objSaiuEmX(obj) //obj = formageometrica
  { return Tela.objVaiSairEmX(obj, 0); }
  static qtdAndarObjNaoSairX(obj, qtdMuda) //obj = formageometrica
  {
    let direcaoSair = Tela.objVaiSairEmX(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair == Direcao.Direita)
      return (width - espacoLadosTela) - (obj.x + obj.width);
    else
    //if (direcaoSair == Direcao.Esquerda)
      return -obj.x + espacoLadosTela;
  }

	static objVaiSairEmY(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ baixo
		if (obj.maiorY + qtdMuda > height - heightVidaUsuario - espacoLadosTela)
			return Direcao.Baixo;
    //saiu p/ cima
    if (obj.menorY + qtdMuda < espacoLadosTela)
      return Direcao.Cima;
    return 0; //nao saiu
	}
  static objSaiuEmY(obj) //obj = formageometrica
  { return Tela.objVaiSairEmY(obj, 0); }
  static qtdAndarObjNaoSairY(obj, qtdMuda) //obj = formageometrica
  {
    let direcaoSair = Tela.objVaiSairEmY(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair == Direcao.Baixo)
      return (height - heightVidaUsuario - espacoLadosTela) - (obj.y + obj.height);
    else
    //if (direcaoSair == Direcao.Baixo)
      return -obj.y + espacoLadosTela;
  }

  static objVaiSair(obj, qtdMudaX, qtdMudaY)
  { return Tela.objVaiSairEmX(obj, qtdMudaX) || Tela.objVaiSairEmY(obj, qtdMudaY); }

  //OUTROS
  static xParaEstarNoMeio(widthObj)
  { return (width-widthObj)/2; }
}

class Operacoes
{
	static hipotenusa(cateto1, cateto2)
	{ return Math.sqrt(cateto1*cateto1 + cateto2*cateto2); }
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


//andar
const porcentQrEntrar = 0.05; //quanto maior esse numero, mais efetivo
class Andar
{
  //tipos andar
  static get ANDAR_NORMAL()
  { return 1; }

  static get INVERTER_QTDANDAR_NAO_SAIR_TELA()
  { return 2; }
  static get INVERTER_DIRECAO_QTDANDAR_NAO_SAIR_TELA()
  { return 3; }

  //tem que falar os pontos ateh onde pode andar: se atehQualXYPodeAndar.x ou .y for nulo, simplesmente desconsiderar
  //ele nao vai andar ateh esse ponto (exclusivo/vai andar ateh "um" antes)
  static get INVERTER_QTDANDAR_NAO_PASSAR_XY()
  // inverte o qtdAndar se for sair da tela tambem
  // inverte o qtdAndar inteiro (nao soh a direcao que vai ultrapassar)
  { return 4; }
  static get INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY()
  // inverte o qtdAndar se for sair da tela tambem
  // inverte soh a direcao do qtdAndar que vai ultrapassar
  { return 5; }
  static get INVERTER_QTDANDAR_NAO_PASSAR_XY_PODE_SAIR_TELA()
  // pode sair da tela
  // inverte o qtdAndar inteiro (nao soh a direcao que vai ultrapassar)
  { return 6; }
  static get INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY_PODE_SAIR_TELA()
  // pode sair da tela
  // inverte soh a direcao do qtdAndar que vai ultrapassar
  { return 7; }

  static get SEGUIR_PERS()
  { return 8; }
  static get SEGUIR_INIM_MAIS_PROX()
  { return 9; }

  static get DIRECAO_PERS()
  { return 10; }
  static get DIRECAO_INIM_MAIS_PROX()
  { return 11; }

  static qtdAndarFromTipo(infoAndar, formaGeomVaiAndar, objPerseguido)
  //infoAndar: InfoAndar
    //*1: soh se for SEGUIR_PERS ou SEGUIR_INIM_MAIS_PROX
    //*2: soh se for um dos inverter o qtdAndar por passar de algum X ou Y
  //objPerseguido eh ObjetoTela
  //retorna {x, y, inverteuEmX, inverteuEmY}
  {
    let qtdAndar = {x: infoAndar.qtdAndarX, y: infoAndar.qtdAndarY};

    switch(infoAndar.tipoAndar)
    {
      case Andar.ANDAR_NORMAL:
        break;
      case Andar.INVERTER_QTDANDAR_NAO_PASSAR_XY: //tambem nao pode sair da tela
      case Andar.INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY: //tambem nao pode sair da tela
      case Andar.INVERTER_QTDANDAR_NAO_SAIR_TELA:
      case Andar.INVERTER_DIRECAO_QTDANDAR_NAO_SAIR_TELA:
        let inverteApenasDirecao = infoAndar.tipoAndar == Andar.INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY ||
          infoAndar.tipoAndar == Andar.INVERTER_DIRECAO_QTDANDAR_NAO_SAIR_TELA;

        let vaiSairX = Tela.objVaiSairEmX(formaGeomVaiAndar, infoAndar.qtdAndarX);
        let vaiSairY = Tela.objVaiSairEmY(formaGeomVaiAndar, infoAndar.qtdAndarY);

        //se obstaculo vai sair, inverte a direcao
        if (vaiSairX || vaiSairY)
        {
          if (!inverteApenasDirecao || vaiSairX)
          {
            qtdAndar.inverteuEmX = true;
            qtdAndar.x = -infoAndar.qtdAndarX;
          }
          if (!inverteApenasDirecao || vaiSairY)
          {
            qtdAndar.inverteuEmY = true;
            qtdAndar.y = -infoAndar.qtdAndarY;
          }

          if (qtdAndar.inverteuEmX && qtdAndar.inverteuEmY)
            break;
          //se jah inverteu nas duas direcoes, jah fez tudo
        }

        if (infoAndar.tipoAndar == Andar.INVERTER_QTDANDAR_NAO_SAIR_TELA ||
          infoAndar.tipoAndar == Andar.INVERTER_DIRECAO_QTDANDAR_NAO_SAIR_TELA)
          break; //se for INVERTER_..._NAO_SAIR_TELA, jah fez tudo

      case Andar.INVERTER_QTDANDAR_NAO_PASSAR_XY_PODE_SAIR_TELA:
      case Andar.INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY_PODE_SAIR_TELA:
      // os outros tipos andar de "nao passar XY" jah entraram no bloco anterior e se nao inverteram os dois lados continuam nesse bloco
        Andar._mudarDadosTipoNaoPassarXY(infoAndar, qtdAndar, formaGeomVaiAndar); //muda as coisas no metodo e volta diferente (passagem por referencia)
        break;

      case Andar.SEGUIR_PERS:
      case Andar.SEGUIR_INIM_MAIS_PROX:
        //calcular quanto teria que andar em cada direcao para chegar ao objeto
        let qntQrAndar = Andar.qntAndarParaBater(formaGeomVaiAndar, objPerseguido.formaGeometrica);

        //calcular quanto andar em cada direcao para andar sempre o mesmo que o padrao
        let k = infoAndar.hipotenusaPadrao/Operacoes.hipotenusa(qntQrAndar.x, qntQrAndar.y);
        qtdAndar.x = k*qntQrAndar.x;
        qtdAndar.y = k*qntQrAndar.y;
        break;
    }

    return qtdAndar;
  }
  static _mudarDadosTipoNaoPassarXY(infoAndar, qtdAndar, formaGeometrica)
  {
    let inverteApenasDirecao = infoAndar.tipoAndar == Andar.INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY ||
      infoAndar.tipoAndar == Andar.INVERTER_DIRECAO_QTDANDAR_NAO_PASSAR_XY_PODE_SAIR_TELA;

    //se vai passar de X (de qual lado para o outro que seja)
    if (!qtdAndar.inverteuEmX && (infoAndar.qtdAndarX != 0 || !inverteApenasDirecao) && infoAndar.atehQualXYPodeAndar.x != null)
    //se ainda nao inverteu em X e quer andar alguma coisa
    {
      let inicio;
      if (infoAndar.qtdAndarX >= 0)
        inicio = formaGeometrica.x;
      else
        inicio = formaGeometrica.x + infoAndar.qtdAndarX;
      let distancia = Math.abs(infoAndar.qtdAndarX) + formaGeometrica.width;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(infoAndar.atehQualXYPodeAndar.x, inicio, distancia))
      {
        qtdAndar.inverteuEmX = true;
        qtdAndar.x = -infoAndar.qtdAndarX;

        if (!inverteApenasDirecao)
        {
          //inverte Y tambem
          qtdAndar.inverteuEmY = true;
          qtdAndar.y = -infoAndar.qtdAndarY;
        }
      }
    }

    //[igual o if de cima porem com Y ao inves de X]
    //se vai passar de Y (de qual lado para o outro que seja)
    if (!qtdAndar.inverteuEmY && (infoAndar.qtdAndarY != 0 || !inverteApenasDirecao) && infoAndar.atehQualXYPodeAndar.y != null)
    //se ainda nao inverteu em Y e quer andar alguma coisa
    {
      let inicio;
      if (infoAndar.qtdAndarY >= 0)
        inicio = formaGeometrica.y;
      else
        inicio = formaGeometrica.y + infoAndar.qtdAndarY;
      let distancia = Math.abs(infoAndar.qtdAndarY) + formaGeometrica.height;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(infoAndar.atehQualXYPodeAndar.y, inicio, distancia))
      {
        qtdAndar.inverteuEmY = true;
        qtdAndar.y = -infoAndar.qtdAndarY;

        if (!inverteApenasDirecao)
        {
          //inverte X tambem
          qtdAndar.inverteuEmX = true;
          qtdAndar.x = -infoAndar.qtdAndarX;
        }
      }
    }
  }

  static qntAndarParaBater(formaGeomVaiAndar, formaGeomPerseguido)
  {
    //direcao de formaGeomVaiAndar em relacao a formaGeomPerseguido
    let direcao = Direcao.emQualDirecaoObjEsta(formaGeomPerseguido, formaGeomVaiAndar);

    let x,y;
    if (direcao == Direcao.Cima || direcao == Direcao.Baixo)
    {
      x = formaGeomPerseguido.x + (formaGeomPerseguido.width - formaGeomVaiAndar.width)/2;
      let k = porcentQrEntrar*formaGeomPerseguido.height;

      if (direcao == Direcao.Cima)
        y = formaGeomPerseguido.y - formaGeomVaiAndar.height + k;
      else
        y = formaGeomPerseguido.y + formaGeomPerseguido.height - k;
    }else
    //if (direcao == Direcao.Esquerda || direcao == Direcao.Direita)
    {
      y = formaGeomPerseguido.y + (formaGeomPerseguido.height - formaGeomVaiAndar.height)/2;
      let k = porcentQrEntrar*formaGeomPerseguido.width;

      if (direcao == Direcao.Esquerda)
        x = formaGeomPerseguido.x - formaGeomVaiAndar.width + k;
      else
        x = formaGeomPerseguido.x + formaGeomPerseguido.width - k;
    }

    //return formaGeomPerseguido.centroMassa.menos(formaGeomVaiAndar.centroMassa); //assim fica muito efetivo
    return {x: x - formaGeomVaiAndar.x, y: y - formaGeomVaiAndar.y};
  }
}

class InfoAndar //qtdAndarX, qtdAndarY, tipoAndar, [atehQualXYPodeAndar], [ultimoQtdAndar e [inimSeguir]]
{
  constructor(qtdAndarX, qtdAndarY, tipoAndar, atehQualXYPodeAndar, pers, controladoresInimigos, formaGeometrica)
  {
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    if (pers == null && controladoresInimigos == null) //soh armazena (tipo obst/tiro padrao)
      this._tipoAndar = tipoAndar;
    else
      this.setTipoAndar(tipoAndar, formaGeometrica, pers, controladoresInimigos);

    if (atehQualXYPodeAndar != null)
    //soh precisa se for INVERTER_..._NAO_PASSAR_XY
      this.atehQualXYPodeAndar = atehQualXYPodeAndar; //public
  }

  get qtdAndarX() { return this._qtdAndarX; }
  get qtdAndarY() { return this._qtdAndarY; }
  get tipoAndar() { return this._tipoAndar; }

  //setters
  set qtdAndarX(qtdAndarX)
  {
    this._qtdAndarX = qtdAndarX;
    this._colocarHipotenusaSePrecisa();
  }
  set qtdAndarY(qtdAndarY)
  {
    this._qtdAndarY = qtdAndarY;
    this._colocarHipotenusaSePrecisa();
  }
  set tipoAndar(tipo) { this._tipoAndar = tipo; } //soh para guardar
  setTipoAndar(tipo, formaGeometrica, pers, controladoresInimigos)
  {
    this._tipoAndar = null;

    //se tipo eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
    {
      // se for pra um tiro seguir um inimigo sempre, seguir um dos mais importantes soh
      let praOndeAndar = null;
      if (controladoresInimigos.length > 0) // se tem algum controlador
        praOndeAndar = controladoresInimigos[0].qntAndarInimigoMaisProximo(formaGeometrica);
      if (praOndeAndar == null || praOndeAndar.inim == null)
        this._tipoAndar = Andar.ANDAR_NORMAL;
      else
      {
        this._inimSeguir = praOndeAndar.inim;
        this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
      }
    }else
    if (tipo == Andar.SEGUIR_PERS)
      this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
    else
    {
      if (this._ultimoQtdAndar != null)
        this._ultimoQtdAndar = null;

      if (tipo == Andar.DIRECAO_PERS)
        this._setarQtdAndarTipoDIRECAO(pers, formaGeometrica);
      else
      if (tipo == Andar.DIRECAO_INIM_MAIS_PROX)
      {
        //descobrir qual inimigo estah mais perto para seguir
        let praOndeAndar = null;
        let menorHipotenusa = null;
        for (let i=0; i<controladoresInimigos.length; i++)
        {
          let praOndeAndarAtual = controladoresInimigos[i].qntAndarInimigoMaisProximo(formaGeometrica);

          if (praOndeAndarAtual.inim != null) //se tem algum inimigo nesse controlador
          {
            let hipotenusaAtual = Operacoes.hipotenusa(praOndeAndarAtual.x, praOndeAndarAtual.y);

            if (menorHipotenusa == null || hipotenusaAtual < menorHipotenusa)
            {
              praOndeAndar = praOndeAndarAtual;
              menorHipotenusa = hipotenusaAtual;
            }
          }
        }

        if (praOndeAndar != null && praOndeAndar.inim != null)
          this._setarQtdAndarTipoDIRECAO(praOndeAndar.inim, this._formaGeometrica);
      }
    }

    if (this._tipoAndar == null) this._tipoAndar = tipo;
    this._colocarHipotenusaSePrecisa();
  }
  _setarQtdAndarTipoDIRECAO(infoAndar, formaGeomVaiAndar)
  {
    //mudar tipo para tipoAndar SEGUIR_...
    this._tipoAndar = (objSeguir instanceof Inimigo)?Andar.SEGUIR_INIM_MAIS_PROX:Andar.SEGUIR_PERS;

    //ve o qtdAndar
    let qtdAndar = Andar.qtdAndarFromTipo(this, formaGeomVaiAndar, objSeguir);
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;

    //vai andar sempre isso
    this._tipoAndar = Andar.ANDAR_NORMAL;
  }

  mudarQtdAndarParaUltimoAndar()
  {
    this.qtdAndarX = this._ultimoQtdAndar.x;
    this.qtdAndarY = this._ultimoQtdAndar.y;
  }
  procAndar(pers, formaGeometrica)
  {
    if ((this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX && (this._inimSeguir == null || !this._inimSeguir.vivo)) ||
      (this._tipoAndar == Andar.SEGUIR_PERS && !pers.vivo))
    {
      this.setTipoAndar(Andar.ANDAR_NORMAL);
      this.mudarQtdAndarParaUltimoAndar();
    }

    //objSeguir para Andar.qtdAndarFromTipo(...)
    let objSeguir;
    if (this._tipoAndar == Andar.SEGUIR_PERS)
      objSeguir = pers;
    else
    if (this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX)
      objSeguir = this._inimSeguir;

    let qtdAndar = Andar.qtdAndarFromTipo(this, formaGeometrica, objSeguir);
    if (this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX || this._tipoAndar == Andar.SEGUIR_PERS)
    {
      this._ultimoQtdAndar.x = qtdAndar.x;
      this._ultimoQtdAndar.y = qtdAndar.y;
    }
    else
      this.inverterDirecaoQtdAndarSePrec(qtdAndar.inverteuEmX, qtdAndar.inverteuEmY);

    return qtdAndar;
  }

  //aux
  inverterDirecaoQtdAndarSePrec(inverteuEmX, inverteuEmY)
  {
    if (inverteuEmX)
      this._qtdAndarX *= -1;
    if (inverteuEmY)
      this._qtdAndarY *= -1;
  }

  _colocarHipotenusaSePrecisa()
  {
    if (this._tipoTemHipotenusaPadrao())
      this._colocarHipotenusaPadrao();
  }
  _tipoTemHipotenusaPadrao()
  { return this._tipoAndar == Andar.SEGUIR_PERS || this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX; }
  _colocarHipotenusaPadrao()
  { this.hipotenusaPadrao = this.hipotenusaPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY); }

  clone(formaGeometrica, pers, controladoresInimigos)
  { return new InfoAndar(this._qtdAndarX, this._qtdAndarY, this._tipoAndar, this.atehQualXYPodeAndar, pers, controladoresInimigos, formaGeometrica); }
}
