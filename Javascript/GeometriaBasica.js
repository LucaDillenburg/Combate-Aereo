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

  clone()
  { return new Ponto(this.x, this.y); }
}

class Reta
{
  constructor(a, b)
  {
    if (a.x == b.x && a.y == b.y)
      throw "Esses dois pontos não formam uma reta!"

    //nao precisa ser necessariamente de cima para baixo
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

    this._angulo = Math.acos(
      Angulo._vezes(ba, bc) / (Angulo._magnitude(ba)*Angulo._magnitude(bc))
    );

    //deixar angulo maior que 180 graus
    if (tipoAngulo != Angulo.MENOR_180)
    {
      let ondeEstah = new Reta(a,b).ondePontoEstah(c);
      if ((tipoAngulo == Angulo.MAIOR_180_CIMA && ondeEstah < 0) ||
        (tipoAngulo == Angulo.MAIOR_180_BAIXO && ondeEstah > 0))
        this._angulo = 2*Math.PI - this._angulo;
    }

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
  get valor()
  { return this._angulo; }
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
  //direcao relativa de obj2 em relacao a obj2
  static emQualDirecaoObjEsta(obj1, obj2) //obj1 e obj2 sao formas geometricas
  {
    let aux = new Angulo(obj1.centroMassa.mais(new Ponto(3, -3)),
      obj1.centroMassa, obj2.centroMassa, Angulo.MAIOR_180_CIMA);
    let angulo = aux.valor;

    stroke(255);
    line(aux.a.x, aux.a.y, aux.b.x, aux.b.y);
    line(aux.c.x, aux.c.y, aux.b.x, aux.b.y);

    if (angulo <= 90) //angulo >= 0
      return Direcao.Direita;
    if (angulo <= 180) //angulo > 90
      return Direcao.Baixo;
    if (angulo <= 270) //angulo > 180
      return Direcao.Esquerda;
    //if (angulo <= 360) //angulo > 270
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

	static interseccao(obj1, obj2) //obj1 e obj2 = ObjetoTela
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

	//VAI INTERSECTAR
  static qntPodeAndarAntesIntersec(obj1, obj2, qtdAndarX, qtdAndarY) //Obj1 e Obj2 devem ser formas geometricas
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
  //retorna qtdPodeAndar (x,y) para nao intersectar
  { return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, false); }

  static vaiTerInterseccao(obj1, obj2, qtdAndarX, qtdAndarY) //Obj1 e Obj2 devem ser formas geometricas
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
  { return Interseccao._interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, true); }

	static _interseccaoObjAndando(obj1, obj2, qtdAndarX, qtdAndarY, returnTrueFalse) //Obj1 e Obj2 devem ser formas geometricas
  //explicacao: "obj2 quer andar qtdAndarX em X e qtdAndarY em Y"
	//se returnTrueFalse, retorna para VaiTerInterseccao; else, retorna para QntPodeAndarAntesIntersec
	{
    //se nao quer andar nada
    if (qtdAndarX == 0 && qtdAndarY == 0)
    {
      if (returnTrueFalse)
        return false;
      else
        return {x: 0, y: 0};
    }
    // daqui pra baixo tem que querer andar alguma coisa...

    //se jah estah intersectando antes de andar
		if (Interseccao.interseccao(obj1, obj2))
    {
      if (returnTrueFalse)
        return true;
      else
        return {x: 0, y: 0};
    }

		let qtdPodeAndar = {x: qtdAndarX, y: qtdAndarY};

		//caso especial mais simples: se o objeto que anda eh um quadrado ou retangulo
    //e soh andou em uma direcao
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
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY); // TODO : isso soh funciona se os dois forem quadrados ou retangulos
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
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(obj1, obj2, qtdAndarY); // TODO : isso soh funciona se os dois forem quadrados ou retangulos
          }else
            if (returnTrueFalse)
              return false;
				}

				return qtdPodeAndar;
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
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX); // TODO : isso soh funciona se os dois forem quadrados ou retangulos
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
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX); // TODO : isso soh funciona se os dois forem quadrados ou retangulos
          }else
            if (returnTrueFalse)
              return false;
				}

				return qtdPodeAndar;
			}
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

    // a partir apenas de X
    let qtdPodeAndarX1;
    if (Interseccao.intersecDirecao(obj2.x, obj2.width, obj1.x, obj1.width))
      qtdPodeAndarX1 = 0;
    else
      qtdPodeAndarX1 = Interseccao._qtdPodeAndarEmX(obj1, obj2, qtdAndarX);
    // regra de 3:
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
	static get SAIU_ESQUERDA()
	{ return 1; }
	static get SAIU_DIREITA()
	{ return 2; }
	static objVaiSairEmX(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ direita
		if (obj.maiorX + qtdMuda > width - espacoLadosTela)
			return Tela.SAIU_DIREITA;
    //saiu p/ esquerda
    if (obj.menorX + qtdMuda < espacoLadosTela)
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
    if (direcaoSair == Tela.SAIU_DIREITA)
      return (width - espacoLadosTela) - (obj.x + obj.width);
    else
    //if (direcaoSair == Tela.SAIU_ESQUERDA)
      return -obj.x + espacoLadosTela;
  }

	static get SAIU_EM_CIMA()
	{ return 4; }
	static get SAIU_EMBAIXO()
	{ return 5; }
	static objVaiSairEmY(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ baixo
		if (obj.maiorY + qtdMuda > height - heightVidaUsuario - espacoLadosTela)
			return Tela.SAIU_EMBAIXO;
    //saiu p/ cima
    if (obj.menorY + qtdMuda < espacoLadosTela)
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
    if (direcaoSair == Tela.SAIU_EMBAIXO)
      return (height - heightVidaUsuario - espacoLadosTela) - (obj.y + obj.height);
    else
    //if (direcaoSair == Tela.SAIU_EM_CIMA)
      return -obj.y + espacoLadosTela;
  }

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

  static get SEGUIR_PERS()
  { return 3; }
  static get SEGUIR_INIM_MAIS_PROX()
  { return 4; }

  static get DIRECAO_PERS()
  { return 3; }
  static get DIRECAO_INIM_MAIS_PROX()
  { return 4; }

  static qtdAndarFromTipo(infoAndar, formaGeomVaiAndar, objPerseguido)
  //infoAndar: qtdAndarXPadrao, qtdAndarYPadrao, tipoAndar, [hipotenusaPadrao] (ultimo soh se for SEGUIR_PERS ou SEGUIR_INIM_MAIS_PROX)
  //objPerseguido eh ObjetoTela
  {
    let qtdAndar = {x: infoAndar.qtdAndarXPadrao, y: infoAndar.qtdAndarYPadrao};

    switch(infoAndar.tipoAndar)
    {
      case Andar.ANDAR_NORMAL:
        break;
      case Andar.INVERTER_QTDANDAR_NAO_SAIR_TELA:
        //se obstaculo vai sair, inverte a direcao
        if (Tela.objVaiSairEmX(formaGeomVaiAndar, infoAndar.qtdAndarXPadrao) ||
          Tela.objVaiSairEmY(formaGeomVaiAndar, infoAndar.qtdAndarYPadrao))
        {
          qtdAndar.inverterDirQtdAndar = true;

          //jah anda pro outro lado
          qtdAndar.x = -infoAndar.qtdAndarXPadrao;
          qtdAndar.y = -infoAndar.qtdAndarYPadrao;
        }
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

  static qntAndarParaBater(formaGeomVaiAndar, formaGeomPerseguido)
  {
    //direcao de formaGeomVaiAndar em relacao a formaGeomPerseguido
    let direcao = Direcao.emQualDirecaoObjEsta(formaGeomPerseguido, formaGeomVaiAndar);
    console.log(direcao);

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

    return {x: x, y: y};
  }
}
