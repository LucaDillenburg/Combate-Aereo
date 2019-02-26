const PI = 3.141592653589; //nao precisa ser mais exato que isso e deixar mais exato deixaria o programa mais lento (otimizacao)

const qtdConsideradoQuaseExato = 0.0005;
class Exatidao
{
  static ehQuaseExato(n1, n2)
  {
    const diferenca = n1 - n2;
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

  //operacoes
  mais(outro) //ponto
  { return new Ponto(this.x + outro.x, this.y + outro.y); }
  menos(outro) //ponto
  { return new Ponto(this.x - outro.x, this.y - outro.y); }
  dividido(divisor) //numero
  { return new Ponto(this.x/divisor, this.y/divisor); }
  multiplicado(mult) //numero
  { return new Ponto(this.x*mult, this.y*mult); }

  distancia(ponto)
  { return Operacoes.hipotenusa(ponto.x - this.x, ponto.y - this.y); }

  //maior ou menor
  static max(p1, p2)
  //mais de baixo (maior Y) e da direita (maior X)
  {
    if (p1.y > p2.y)
      return p1;
    if (p2.y > p1.y)
      return p2;
    // p1.y === p2.y
    return (p1.x > p2.x ? p1 : p2);
  }
  static min(p1, p2)
  //mais de cima (menor Y) e da esquerda (menor X)
  {
    if (p1.y < p2.y)
      return p1;
    if (p2.y < p1.y)
      return p2;
    // p1.y === p2.y
    return (p1.x < p2.x ? p1 : p2);
  }

  //rotacionar
  rotacionar(angulo, centroRotacao = new Ponto(0,0))
  //retorna ponto rotacionado
  {
    //Explicacao: para rotacionar um ponto precisa-se:
      // 1. subtrair o centroRotacao (para deixar o centroRotacao sendo (0,0))
      // 2. rotacionar (x,y) com como se centroRotacao fosse (0,0)
        /* ps: a partir das formulas:
        x' = cos(angulo)*x - sin(angulo)*y
        y' = sin(angulo)*x + cos(angulo)*y */
      // 3. somar o centroRotacao antigo (para voltar para a posicao certa)

    // 1.
    let pontoRotacionado = this.menos(centroRotacao);

    // 2.
    const x = pontoRotacionado.x;
    const y = pontoRotacionado.y;
    //ps: pontoRotacionado.x jah vai estar diferente quando for calcular o valor de pontoRotacionado.y
    pontoRotacionado.x = Math.cos(angulo)*x - Math.sin(angulo)*y;
    pontoRotacionado.y = Math.sin(angulo)*x + Math.cos(angulo)*y;

    // 3.
    return pontoRotacionado.mais(centroRotacao);
  }

  //metodos obrigatorios
  toString()
  { return "(" + this.x + "," + this.y + ")"; }
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
  equals(outro, exato=true)
  {
    if (this.x === outro.x && this.y === outro.y)
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
    //if (a.x === b.x && a.y === b.y)
    //  throw "Esses dois pontos não formam uma reta!";

    //nao precisa ser necessariamente de cima para baixo
    this._a = a.clone();
    this._b = b.clone();

    this._height = this._a.y - this._b.y;
    this._width = this._a.x - this._b.x;
  }

  //retorna 0 se estah em cima, >0 se estah a direita e <0 se estiver a esquerda
  ondePontoEstah(ponto)
  {
    if (this._a.y === this._b.y)
      return ponto.y - this._a.y;

    const widthDeveria = (ponto.y - this._a.y)*this._width/this._height;
    const xDeveria = this._a.x + widthDeveria;

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
    const orient1 = Geometria.orientacao(this._a, this._b, semirreta._a);
    const orient2 = Geometria.orientacao(this._a, this._b, semirreta._b);
    const orient3 = Geometria.orientacao(semirreta._a, semirreta._b, this._a);
    const orient4 = Geometria.orientacao(semirreta._a, semirreta._b, this._b);

    // General case
    if (orient1 !== orient2 && orient3 !== orient4)
        return true;

    // Special Cases
    // this._a, this._b and semirreta._a are colinear and semirreta._a lies on segment this._athis._b
    if (orient1 === 0 && this.pontoEstah(semirreta._a)) return true;

    // this._a, this._b and semirreta._b are colinear and semirreta._b lies on segment this._athis._b
    if (orient2 === 0 && this.pontoEstah(semirreta._b)) return true;

    // semirreta._a, semirreta._b and this._a are colinear and this._a lies on segment semirreta._asemirreta._b
    if (orient3 === 0 && semirreta.pontoEstah(this._a)) return true;

     // semirreta._a, semirreta._b and this._b are colinear and this._b lies on segment semirreta._asemirreta._b
    if (orient4 === 0 && semirreta.pontoEstah(this._b)) return true;

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
  constructor(a, b, c, tipoAngulo = Angulo.MENOR_180)
  {
    const ba = a.menos(b);
    const bc = c.menos(b);

    this._anguloRad = Math.acos(
      Angulo._vezes(ba, bc) / (Angulo._magnitude(ba)*Angulo._magnitude(bc))
    );

    //deixar angulo maior que 180 graus
    if (tipoAngulo !== Angulo.MENOR_180)
    {
      const ondeEstah = new Reta(a,b).ondePontoEstah(c);
      if ((tipoAngulo === Angulo.MAIOR_180_CIMA && ondeEstah < 0) ||
        (tipoAngulo === Angulo.MAIOR_180_BAIXO && ondeEstah > 0))
        this._anguloRad = 2*Math.PI - this._anguloRad;
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
  get valorRad()
  { return this._anguloRad; }
  get valorGraus()
  {
    if (this._anguloGraus === undefined)
      this._anguloGraus = this._anguloRad *180/Math.PI;
    return this._anguloGraus;
  }
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

  //Outros
  static entrePIeMenosPI(angulo)
  {
    //deixar "rotacao" sempre entre -PI a PI (-180graus a 180graus)
    while (Math.abs(angulo) > PI)
      angulo += 2*PI*((angulo > 0)?-1:1);
    return angulo;
  }
  static anguloDirecao(direcao) //angulo ciclo trigonometrico
  {
    switch (direcao)
    {
      case Direcao.Direita: return 0;

      case Direcao.Cima: return PI/2;

      case Direcao.Esquerda: return PI;

      case Direcao.Baixo: return 3*PI/2;
    }
  }
  static anguloRotacaoDirecao(direcao) //anguloRotacao
  {
    switch (direcao)
    {
      case Direcao.Direita: return PI/2;

      case Direcao.Cima: return 0;

      case Direcao.Esquerda: return -PI/2;

      case Direcao.Baixo: return PI;
    }
  }

  // Angulo Rotacao <--> Angulo Ciclo Trigonometrico
  //o angulo das rotacoes comeca a contar de cima e o angulo do ciclo trigonometrico comeca da direita
  static angRotacaoParaAngCicloTrig(anguloRotacao)
  { /*NAO MUDAR ISSO!!:*/return anguloRotacao - PI/2; }
}

//direcao e direcao
class Direcao
{
  //obj2 em relacao a obj1 (direcao relativa de obj2 em relacao a obj1)
  static emQualDirecaoObjEsta(obj1, obj2) //obj1 e obj2 sao formas geometricas
  {
    const angulo = new Angulo(obj1.pontoAngInicial, obj1.centroMassa, obj2.centroMassa, Angulo.MAIOR_180_CIMA).valorGraus;

    if (angulo <= obj1.ultimoAngDir)
      return Direcao.Direita;
    if (angulo <= obj1.ultimoAngBaixo)
      return Direcao.Baixo;
    if (angulo <= obj1.ultimoAngEsq)
      return Direcao.Esquerda;
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
const PosicaoX = {"Meio": 1, "ParedeEsquerda": 2, "ParedeDireita": 3};
const PosicaoY = {"Meio": 4, "ParedeCima": 5, "ParedeBaixo": 5};

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
  static formasInterseccao(obj1, obj2) //obj1 e obj2 sao FormaGeometricas
  // retorna um vetor de elementos={indice, formaGeometrica} (cada formaGeometrica eh uma formaGeometrica de obj2 e indice eh o index dessa formaGeometrica no vetor das formasGeometricas)
  // ps: se obj2 nao for FormaGeometricaComposta e colidiu deixar indice=0
	{
    let interseccao;
    if (obj1.codForma > obj2.codForma)
    //aqui obj2.codForma eh menor que obj1.codForma, entao ele nao pode ser FormaGeometricaComposta
      interseccao = obj1.interseccao(obj2);
		else
    //obj2.codForma eh maior ou igual obj1.codForma, entao ele pode ser FormaGeometricaComposta
    {
      if (obj2 instanceof FormaGeometricaComposta)
        return obj2.interseccao(obj1, false); //retorna o vetor de elementos {indice, formaGeometrica}
      interseccao = obj2.interseccao(obj1);
    }
    //daqui pra frente obj2 nao eh FormaGeometricaComposta e jah se tem o resultado da interseccao

    if (interseccao)
      return [{indice: 0, formaGeometrica: obj2}];
    else
      return [];
	}

  static interseccaoComoRetangulos(obj1, obj2)
  {
    return Interseccao.intersecDirecao(obj1.x, obj1.width, obj2.x, obj2.width) &&
			Interseccao.intersecDirecao(obj1.y, obj1.height, obj2.y, obj2.height);
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
    // TODO: fazer com outras formasGeometricas (isso soh eh verdadeiro e eficiente com retangulos/quadrados)

    //se nao tem nenhuma formaGeometrica sendo composta, nao precisa fazer nada de especial
    //if (!(objParado instanceof FormaGeometricaComposta) && !(objVaiAndar instanceof FormaGeometricaComposta)) //AQUI
      return Interseccao._qtdAndarPararColidirFormasNaoCompost(objParado, objVaiAndar);

    //se objAndar for FormaGeometricaComposta:
      //fazer Interseccao._qtdAndarPararColidirObjAndarNaoCompost(...) com todas as formas de objAndar que intersectam,
      //retornar os maiores valores absolutos em ambas as direcoes que alguma forma precisa andar
    //se objParado for FormaGeometricaComposta: verificar quanto tem que andar comparando
      //fazer Interseccao._qtdAndarPararColidirFormasNaoCompost(...) com todas as formas de objParado que intersectam a formaNaoComposta de objAndar,
      //retornar os maiores valores absolutos em ambas as direcoes que alguma forma precisa andar
    //problema: pode ser que esse metodo retorne um qtdAndar que ainda continue intersectando
    //TODO: melhorar isso
    const qtdAndar = Interseccao._qtdAndarPararColidirObjsCompost(objParado, objVaiAndar);
    let formaAndada = objVaiAndar.clone(objVaiAndar.x + qtdAndar.x, objVaiAndar.y + qtdAndar.y);
    if (!Interseccao.interseccao(formaAndada, objVaiAndar))
      return qtdAndar;
    return Interseccao._qtdAndarPararColidirFormasNaoCompost(objParado, objVaiAndar);
  }
  static _qtdAndarPararColidirObjsCompost(objParado, objVaiAndar)
  {
    const objVaiAndarEhFormaCompost = objVaiAndar instanceof FormaGeometricaComposta;
    let formasGeomObjCompost;
    if (objVaiAndarEhFormaCompost)
      formasGeomObjCompost = objVaiAndar.formasGeometricas;
    else
    {
      if (objParado instanceof FormaGeometricaComposta)
        formasGeomObjCompost = objVaiAndar.formasGeometricas;
      else
        return Interseccao._qtdAndarPararColidirFormasNaoCompost(objParado, objVaiAndar);
    }

    const qtdAndar = formasGeomObjCompost.reduce((formaGeom, accumulator) =>
      {
        //calcular qtdAndarAtual
        let qtdAndarAtual;
        if (objVaiAndarEhFormaCompost)
          qtdAndarAtual = Interseccao._qtdAndarPararColidirObjsCompost(objParado, formaGeom);
        else
          qtdAndarAtual = Interseccao._qtdAndarPararColidirFormasNaoCompost(formaGeom, objVaiAndar);

        //mudar accumulator e retornar
        if (Math.abs(qtdAndarAtual.x) > Math.abs(accumulator.x))
          accumulator.x = qtdAndarAtual.x;
        if (Math.abs(qtdAndarAtual.y) > Math.abs(accumulator.y))
          accumulator.y = qtdAndarAtual.y;
        return accumulator;
      }, new Ponto(0,0));
    return qtdAndar;
  }
  static _qtdAndarPararColidirFormasNaoCompost(objParado, objVaiAndar)
  {
    const xDireita = {
      valor: objParado.x + objParado.width - objVaiAndar.x,
      dir: Direcao.Direita
    };
    const xEsquerda = {
      valor: objVaiAndar.x + objVaiAndar.width - objParado.x,
      dir: Direcao.Esquerda
    };
    const yBaixo = {
      valor: objParado.y + objParado.height - objVaiAndar.y,
      dir: Direcao.Baixo
    };
    const yCima = {
      valor: objVaiAndar.y + objVaiAndar.height - objParado.y,
      dir: Direcao.Cima
    };

    const minDirecao = function(valorDir1, valorDir2)
      {
        if (valorDir1.valor <= valorDir2.valor)
          return valorDir1;
        else
          return valorDir2;
      }
    const menorValorDir = minDirecao(minDirecao(yBaixo, yCima), minDirecao(xDireita, xEsquerda));
    let qtdAndar = new Ponto(0,0);
    switch (menorValorDir.dir)
    {
      case Direcao.Direita:
        qtdAndar.x = menorValorDir.valor + qntNaoColidir;
        break;
      case Direcao.Esquerda:
        qtdAndar.x = -menorValorDir.valor - qntNaoColidir;
        break;
      case Direcao.Baixo:
        qtdAndar.y = menorValorDir.valor + qntNaoColidir;
        break;
      case Direcao.Cima:
        qtdAndar.y = -menorValorDir.valor -qntNaoColidir;
        break;
    }
    return qtdAndar;
  }

	//VAI INTERSECTAR
  static qntPodeAndarAntesIntersec(objParado, objQuerAndar, qtdAndarX, qtdAndarY, andarProporcional = true) //ObjParado e ObjQuerAndar devem ser formas geometricas
  //explicacao: "objQuerAndar quer andar qtdAndarX em X e qtdAndarY em Y"
  //retorna qtdPodeAndar (x,y) para nao intersectar
  { return Interseccao._interseccaoObjAndando(objParado, objQuerAndar, qtdAndarX, qtdAndarY, false, andarProporcional); }

  static vaiTerInterseccao(objParado, objQuerAndar, qtdAndarX, qtdAndarY) //ObjParado e ObjQuerAndar devem ser formas geometricas
  //explicacao: "objQuerAndar quer andar qtdAndarX em X e qtdAndarY em Y"
  { return Interseccao._interseccaoObjAndando(objParado, objQuerAndar, qtdAndarX, qtdAndarY, true); }

	static _interseccaoObjAndando(objParado, objQuerAndar, qtdAndarX, qtdAndarY, returnTrueFalse, andarProporcional)
  //ObjParado e ObjQuerAndar devem ser formas geometricas
	//se returnTrueFalse, retorna para VaiTerInterseccao; else, retorna para QntPodeAndarAntesIntersec
  //andarProporcional eh soh para qntPodeAndarAntesIntersec
  //explicacao: "objQuerAndar quer andar qtdAndarX em X e qtdAndarY em Y"
	{
    //se jah estah intersectando antes de andar
		if (Interseccao.interseccao(objParado, objQuerAndar))
    {
      if (returnTrueFalse)
        return true;
      else
        return {x: 0, y: 0};
    }

    //se nao quer andar nada
    if (qtdAndarX === 0 && qtdAndarY === 0)
    {
      if (returnTrueFalse)
        return false;
      else
        return {x: 0, y: 0};
    }
    // daqui pra baixo tem que querer andar alguma coisa...

		let qtdPodeAndar = {x: qtdAndarX, y: qtdAndarY};

		//CASO ESPECIAL (simples): se objQuerAndar eh FormaGeometricaSimples e SOH ANDA EM UMA DIRECAO
		if (objQuerAndar instanceof FormaGeometricaSimples && (qtdAndarX === 0 || qtdAndarY === 0))
		{
			if (qtdAndarX === 0)
			{
				if (qtdAndarY < 0)
				{
					const nvRetangulo = new Retangulo(objQuerAndar.x, objQuerAndar.y + qtdAndarY, objQuerAndar.width, -qtdAndarY);

          if (Interseccao.interseccao(objParado, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(objParado, objQuerAndar, qtdAndarY);
          }else
            if (returnTrueFalse)
              return false;
				}
        //if (qtdAndarY > 0)
        else
				{
					const nvRetangulo = new Retangulo(objQuerAndar.x, objQuerAndar.y + objQuerAndar.height, objQuerAndar.width, qtdAndarY);

          if (Interseccao.interseccao(objParado, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.y = Interseccao._qtdPodeAndarEmY(objParado, objQuerAndar, qtdAndarY);
          }else
            if (returnTrueFalse)
              return false;
				}
			}else
			//if (qtdAndarY === 0)
			{
				if (qtdAndarX < 0)
				{
					const nvRetangulo = new Retangulo(objQuerAndar.x + qtdAndarX, objQuerAndar.y, -qtdAndarX, objQuerAndar.height);

          if (Interseccao.interseccao(objParado, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(objParado, objQuerAndar, qtdAndarX);
          }else
            if (returnTrueFalse)
              return false;
				}
        //if (qtdAndarX > 0)
        else
				{
					const nvRetangulo = new Retangulo(objQuerAndar.x + objQuerAndar.width, objQuerAndar.y, qtdAndarX, objQuerAndar.height);

          if (Interseccao.interseccao(objParado, nvRetangulo))
          {
            if (returnTrueFalse)
              return true;
            qtdPodeAndar.x = Interseccao._qtdPodeAndarEmX(objParado, objQuerAndar, qtdAndarX);
          }else
            if (returnTrueFalse)
              return false;
				}
			}

      return qtdPodeAndar;
		}


    // OTIMIZACAO:
    //considerar um quadradao (de onde estava pra onde foi) antes de verificar a colisao perfeita
    // obs: economiza tempo pois na maioria das vezes que esse metodo for executado, os dois objetos vao estar longe e soh considerando os dois como se fossem retangulos jah conclui-se que nao estah intersectando
    const x2 = (qtdPodeAndar.x >= 0) ? objQuerAndar.x : objQuerAndar.x + qtdPodeAndar.x /*eh soma porque qtdPodeAndar.x eh negativo*/;
    const y2 = (qtdPodeAndar.y >= 0) ? objQuerAndar.y : objQuerAndar.y + qtdPodeAndar.y /*eh soma porque qtdPodeAndar.x eh negativo*/;
    if (!Interseccao.interseccaoRetDesmontado(objParado.x, objParado.y, objParado.width, objParado.height,
      x2, y2, objQuerAndar.width + Math.abs(qtdPodeAndar.x), objQuerAndar.height + Math.abs(qtdPodeAndar.y)))
    {
      if (returnTrueFalse)
        return false;
      else
        return qtdPodeAndar;
    }


		// daqui pra baixo nao pode ser um quadrado e retangulo que soh anda pra alguma direcao... (tambem quer andar alguma coisa pelo menos)

    //verificar se alguma parte do caminho do objQuerAndar (oq vai andar) colidirah com objParado
    const precisaSaberTodasFormasColidiu = !returnTrueFalse;
    const infoColidiu = Interseccao._colidiuCaminho(objParado, objQuerAndar, qtdAndarX, qtdAndarY, precisaSaberTodasFormasColidiu);
    //retorna {colidiu, infoFormasObjParadoColidiuCaminho}, sendo que infoFormasObjParadoColidiuCaminho eh um vetor em que cada elemento={indice, formaGeometrica} e representa cada formaGeometrica do ObjetoParado que o caminho do ObjVaiAndar vai intersectar

    if (returnTrueFalse)
      return infoColidiu.colidiu;
    if (!infoColidiu.colidiu)
      return qtdPodeAndar;

    //daqui pra frente colidiu e eh pra retornar quanto pode andar antes de intersectar

    //fazer um loop por cada formaGeometrica do ObjParado com quem o andar de ObjVaiAndar colidiu e guardar o menor qtdAndar
    let menorQtdAndar;
    infoColidiu.infoFormasObjParadoColidiuCaminho.some(infoFormaObjParadoColidiuCaminho =>
      {
        const qtdPodeAndarAtual = Interseccao._qtdPodeAndarSemColidir(infoFormaObjParadoColidiuCaminho.formaGeometrica,
          objQuerAndar, qtdAndarX, qtdAndarY, andarProporcional);

        //verificar se qtdPodeAndarAtual eh menor que menorQtdAndar
        if (menorQtdAndar === undefined)
          menorQtdAndar = qtdPodeAndarAtual;
        else
        if (andarProporcional)
        {
          if (Math.abs(qtdPodeAndarAtual.x) < Math.abs(menorQtdAndar.x))
          //nao precisa verificar de qtdPodeAndarAtual.y pois eh proporcional
            menorQtdAndar = qtdPodeAndarAtual;
        }else
        //nao proporcional
        {
          if (Math.abs(qtdPodeAndarAtual.x) < Math.abs(menorQtdAndar.x))
            menorQtdAndar.x = qtdPodeAndarAtual.x;
          if (Math.abs(qtdPodeAndarAtual.y) < Math.abs(menorQtdAndar.y))
            menorQtdAndar.y = qtdPodeAndarAtual.y;
        }

        if (menorQtdAndar.x===0 && menorQtdAndar.y===0)
          return true; //"break"
        return false;
      });
    return menorQtdAndar;
	}

  //AUXILIAR CAMINHO
  static _colidiuCaminho(objParado, objQuerAndar, qtdAndarX, qtdAndarY, retornarTodasFormasColidiu, qtdFormasGeometricasObjParado/*soh para o proprio metodo preencher durante a recursao*/)
  //retorna {colidiu, infoFormasObjParadoColidiuCaminho} (todas as formaGeometricas que colidem, se ela for null eh porque nao colidiu)
  //(pois em formasGeometricasCompostas pode-se ter colidido em varias formas)
  //se nao precisa saber todas as formasGeometricas que colidiram, soh retorna {colidiu}
  //infoFormasObjParadoColidiuCaminho eh um vetor em que cada elemento={indice, formaGeometrica} e representa cada formaGeometrica do ObjetoParado que o caminho do ObjVaiAndar vai intersectar
  {
    //EXPLICACAO:
      //- qualquer quadrado, retangulo, triangulo ou paralelogramo quando vai andar forma 1 ou 2 paralelogramos que representa(m) o caminho por onde a figura geometrica passara
      //- desta maneira, ao verificar a interseccao de objParado a essas formas, determina-se se relamente colidiu ou nao
    //Otimizacao: montar as formasGeometricas que representam o caminho e verificar se intersectam com objParado "simultanemente" (Loop: {criar forma, verificar, se colidiu=>retorna})

    //para soh fazer isso uma vez durante todas as vezes que a recursao for chamada
    if (qtdFormasGeometricasObjParado===undefined)
      qtdFormasGeometricasObjParado = (objParado instanceof FormaGeometricaComposta) ? objParado.formasGeometricas.length : 1;

    if (objQuerAndar instanceof FormaGeometricaComposta ||
       (objQuerAndar instanceof FormaGeometricaComplexa && !(objQuerAndar instanceof Triangulo))) //FormasComplexas sem ser Triangulo
    {
      let vetorFormasMaisSimples;
      if (objQuerAndar instanceof FormaGeometricaComposta)
      //vetor de quaisquer formas nao compostas (mais simples do que FormaComposta)
        vetorFormasMaisSimples = objQuerAndar.formasGeometricas;
      else
      //vetor de triangulos (mais simples do que Quadrilateros ou Paralelogramos)
        vetorFormasMaisSimples = objQuerAndar.triangulos;

      //para evitar repeticao de codigo
      const funcaoColidiuCaminho = (formaMaisSimples) =>
        Interseccao._colidiuCaminho(objParado, formaMaisSimples, qtdAndarX, qtdAndarY, retornarTodasFormasColidiu);
      if (!retornarTodasFormasColidiu)
      //se nao precisa saber todas as formasGeometricas soh retorna {colidiu}
      {
        const colidiu = vetorFormasMaisSimples.some(formaMaisSimples => //soh faz loop ateh algum ter colidido
            funcaoColidiuCaminho(formaMaisSimples).colidiu);
        return {colidiu: colidiu};
      }else
      {
        //verificar em qual formaGeometricaSimples
        let infoFormasObjParadoColidiuCaminho = [];
        vetorFormasMaisSimples.some(formaMaisSimples => //passa por todos os elementos independente de jah ter colidido ou nao (para conseguir todos as formasGeometricas); a nao ser que o vetor jah tenha todas as formasGeometricas do objeto parado
          {
            const novosInfoFormasObjParadoColidiu = funcaoColidiuCaminho(formaMaisSimples).infoFormasObjParadoColidiuCaminho;
            Interseccao._concatenarVetoresFormasGeomColidiu(infoFormasObjParadoColidiuCaminho, novosInfoFormasObjParadoColidiu) //concatena as formasGeometricas de objParado que nao estao em infoFormasObjParadoColidiuCaminho no proprio infoFormasObjParadoColidiuCaminho

            //se infoFormasObjParadoColidiuCaminho jah tem todas as formasGeometricas de ObjParado, pode sair
            if (infoFormasObjParadoColidiuCaminho.length === qtdFormasGeometricasObjParado)
              return true; //"break"
            return false;
          });
        return {colidiu: infoFormasObjParadoColidiuCaminho.length>0, infoFormasObjParadoColidiuCaminho: infoFormasObjParadoColidiuCaminho};
      }
    }else
    // por recursao, sempre vai chegar ateh aqui (se objQuerAndar era Triangulo, Quadrado ou Retangulo, ou se era FormaGeometricaComplexas ou FormaGeometricaComposta e foi reduzido a Quadrados, Retangulos e Triangulos
    {
      //monta formas geometricas
      const formasGeometricasMontadas = Interseccao._montarFormasGeomCaminho(objQuerAndar, qtdAndarX, qtdAndarY); //1 ou 2 formas geometricas

      if (!retornarTodasFormasColidiu)
      //se nao precisa saber todas as formasGeometricas soh retorna {colidiu}
      {
        //testa se alguma das formas geometricas montadas (que representam o caminho de objQuerAndar) intersecta com objParado
        const colidiu = formasGeometricasMontadas.some(formaGeom => //soh faz o loop ateh descobrir que alguma formaGeometrica colidiu
          Interseccao.interseccao(formaGeom, objParado)); //verificar se alguma parte do caminho do objQuerAndar (oq vai andar) colidirah com objQuerAndar
        return {colidiu: colidiu};
      }else
      {
        //verificar em qual formaGeometricaSimples
        let infoFormasObjParadoColidiuCaminho = [];
        formasGeometricasMontadas.some(formaGeom => //passa por todos os elementos independente de jah ter colidido ou nao (para conseguir todos as formasGeometricas); a nao ser que o vetor jah tenha todas as formasGeometricas do objeto parado
          {
            const novosInfoFormasObjParadoColidiu = Interseccao.formasInterseccao(formaGeom, objParado); //verificar em quais formasGeometricas de objParado o caminho do objQuerAndar (oq vai andar) colidirah
            Interseccao._concatenarVetoresFormasGeomColidiu(infoFormasObjParadoColidiuCaminho, novosInfoFormasObjParadoColidiu) //concatena as formasGeometricas de objParado que nao estao em infoFormasObjParadoColidiuCaminho no proprio infoFormasObjParadoColidiuCaminho

            //se infoFormasObjParadoColidiuCaminho jah tem todas as formasGeometricas de ObjParado, pode sair
            if (infoFormasObjParadoColidiuCaminho.length === qtdFormasGeometricasObjParado)
              return true; //"break"
            return false;
          });
        return {colidiu: infoFormasObjParadoColidiuCaminho.length>0, infoFormasObjParadoColidiuCaminho: infoFormasObjParadoColidiuCaminho};
      }
    }
  }
  static _concatenarVetoresFormasGeomColidiu(infoFormasObjParadoColidiuCaminho, novosInfoFormasObjParadoColidiu)
  {
    novosInfoFormasObjParadoColidiu.forEach(novaFormaGeomAtual =>
      {
        //se essa nova forma geometrica que colidiu nao existe no vetor, adiciona-se ela
        if (!infoFormasObjParadoColidiuCaminho.some(formaGeomColidiu => formaGeomColidiu.indice === novaFormaGeomAtual.indice))
          infoFormasObjParadoColidiuCaminho.push(novaFormaGeomAtual);
      });
  }
  static _montarFormasGeomCaminho(obj, qtdAndarX, qtdAndarY)
  //esse metodo vai retornar o(s) paralelogramo(s) que o andar de obj formaria (1 ou 2)
  {
    // obj nao eh FormaGeometricaComposta nem FormaGeometricaComplexa
    let formasGeomAndar = [];
		switch (obj.codForma)
		{
      case Geometria.COD_TRIANGULO:
        //a unica difereca entre o procedimento que serah feito se entrar no if ou else a seguir
        //sao as variaveis usadas e a invercao de direita e esquerda...

        //pontos
        let a, b, c;
        //o que invertera direita e esquerda
        let mult;
        const andarParaCima = (qtdAndarY < 0) || (qtdAndarY === 0 && qtdAndarX > 0);
        if (andarParaCima)
        // se (qtdAndarY < 0) e uma opcao de (qtdAndarY === 0): se (qtdAndarX > 0)
        {
          // A: obj.vertices[0], B: obj.vertices[1], C: obj.vertices[2]
          a = obj.vertices[0];
          b = obj.vertices[1];
          c = obj.vertices[2];

          // direita serah considerado direita e o mesmo com a esquerda
          mult = 1;
        }else
        //if ((qtdAndarY > 0) || (qtdAndarY === 0 && qtdAndarX < 0))
        // se (qtdAndarY > 0) e uma opcao de (qtdAndarY === 0): se (qtdAndarX < 0)
        // ps: soh faltou (qtdAndarY === 0 && qtdAndarX === 0) porem nao queria andar nada jah foi tratado
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
        const qtdAndar = new Ponto(qtdAndarX, qtdAndarY);
        const a2 = a.mais(qtdAndar); //A'
        const b2 = b.mais(qtdAndar); //B'
        const c2 = c.mais(qtdAndar); //C'

        //linha da parte mais alta do triangulo original com a parte mais alta do triangulo
        //onde ficara se andar (reta por dois pontos: A e A')
        const linha = new Reta(a2, a);

        // Obs: Esquerda da linha: reta.ondePontoEstah(p) < 0. Direita da linha: reta.ondePontoEstah(p) > 0

        // se B' estah a esquerda da linha ou em cima dela (se mult=-1, eh as direcoes se invertem)
        if (linha.ondePontoEstah(b2)*mult <= 0)
        {
          //Paralelogramo 1:
          if (andarParaCima)
          //A' - A - C - C' (andarParaCima/normal)
            formasGeomAndar.push(new Paralelogramo(a2, a, c, c2));
          else
          //C - C' - A' - A (!andarParaCima/contrario)
            formasGeomAndar.push(new Paralelogramo(c, c2, a2, a));

          // se B' estah a esquerda da Reta formada pelos pontos C e C'
          if (new Reta(c2, c).ondePontoEstah(b2)*mult < 0)
          {
            //(C' eh o vertice central):
            //Paralelogramo 2:
            if (andarParaCima)
            //C' - C - B - B' (andarParaCima/normal)
              formasGeomAndar.push(new Paralelogramo(c2, c, b, b2));
            else
            //B - B' - C' - C (!andarParaCima/contrario)
              formasGeomAndar.push(new Paralelogramo(b, b2, c2, c));
          }
        }else
        // se C' estah a direita da linha ou em cima dela (se mult=-1, eh as direcoes se invertem)
        if (linha.ondePontoEstah(c2)*mult >= 0)
        {
          //Paralelogramo 1:
          if (andarParaCima)
          //A' - B' - B - A (andarParaCima/normal)
            formasGeomAndar.push(new Paralelogramo(a2, b2, b, a));
          else
          //B - A - A' - B' (!andarParaCima/contrario)
            formasGeomAndar.push(new Paralelogramo(b, a, a2, b2));

          // se C' estah a direita da Reta formada pelos pontos B e B'
          if (new Reta(b2, b).ondePontoEstah(c2)*mult > 0)
          {
            //(B' eh o vertice central):
            //Paralelogramo 2:
            if (andarParaCima)
            //B' - C' - C - B (andarParaCima/normal)
              formasGeomAndar.push(new Paralelogramo(b2, c2, c, b));
            else
            //C - B - B' - C' (!andarParaCima/contrario)
              formasGeomAndar.push(new Paralelogramo(c, b, b2, c2));
          }
        }else
        {
          //(A' eh o vertice central):

          //Paralelogramo 1:
          if (andarParaCima)
          //A' - B' - B - A (andarParaCima/normal)
            formasGeomAndar.push(new Paralelogramo(a2, b2, b, a));
          else
          //B - A - A' - B' (!andarParaCima/contrario)
            formasGeomAndar.push(new Paralelogramo(b, a, a2, b2));

          //Paralelogramo 2:
          if (andarParaCima)
          //A' - A - C - C' (andarParaCima/normal)
            formasGeomAndar.push(new Paralelogramo(a2, a, c, c2));
          else
          //C - C' - A' - A (!andarParaCima/contrario)
            formasGeomAndar.push(new Paralelogramo(c, c2, a2, a));
        }
				break;

			case Geometria.COD_RETANGULO:
      case Geometria.COD_QUADRADO:
        if (qtdAndarY < 0)
        {
          //paralelogramo que sai de cima
          const p1 = new Ponto(obj.x + qtdAndarX, obj.y + qtdAndarY);
          const p2 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + qtdAndarY);
          const p3 = new Ponto(obj.x + obj.width, obj.y);
          const p4 = new Ponto(obj.x, obj.y);
          formasGeomAndar.push(new Paralelogramo(p1, p2, p3, p4));
        }else
        {
          //paralelogramo que sai de baixo
          const p1 = new Ponto(obj.x, obj.y + obj.height);
          const p2 = new Ponto(obj.x + obj.width, obj.y + obj.height);
          const p3 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + obj.height + qtdAndarY);
          const p4 = new Ponto(obj.x + qtdAndarX, obj.y + obj.height + qtdAndarY);
          formasGeomAndar.push(new Paralelogramo(p1, p2, p3, p4));
        }

        if (qtdAndarX < 0)
        {
          //paralelogramo que sai do lado esquerdo
          const p1 = new Ponto(obj.x + qtdAndarX, obj.y + qtdAndarY);
          const p2 = new Ponto(obj.x, obj.y);
          const p3 = new Ponto(obj.x, obj.y + obj.height);
          const p4 = new Ponto(obj.x + qtdAndarX, obj.y + obj.height + qtdAndarY);

          if (qtdAndarY < 0)
            formasGeomAndar.push(new Paralelogramo(p1, p2, p3, p4));
          else
            formasGeomAndar.push(new Paralelogramo(p2, p3, p4, p1));
        }else
        {
          //paralelogramo que sai do lado esquerdo
          const p1 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + qtdAndarY);
          const p2 = new Ponto(obj.x + obj.width + qtdAndarX, obj.y + obj.height + qtdAndarY);
          const p3 = new Ponto(obj.x + obj.width, obj.y + obj.height);
          const p4 = new Ponto(obj.x + obj.width, obj.y);

          if (qtdAndarY < 0)
            formasGeomAndar.push(new Paralelogramo(p1, p2, p3, p4));
          else
            formasGeomAndar.push(new Paralelogramo(p4, p1, p2, p3));
        }
				break;
		}

    return formasGeomAndar;
  }

  //AUXILIAR QTDANDAR NAO COLIDIR
  static _qtdPodeAndarSemColidir(objParado, objQuerAndar, qtdAndarX, qtdAndarY, andarProporcional)
  //objParado eh na verdade cada formaGeometrica de ObjParado que o caminho de ObjQuerAndar colidiu
  {
    //esse procedimento eh essencialmente para retangulos, mas vai ser usado por outras formasGeometricas, nessas formasGeometricas pode-se jah ter entrado um pouco
    if ((objQuerAndar instanceof FormaGeometricaComplexa || objQuerAndar instanceof FormaGeometricaComposta ||
      objParado instanceof FormaGeometricaComplexa || objParado instanceof FormaGeometricaComposta) &&
      Interseccao.interseccaoRetDesmontado(objParado.x, objParado.y, objParado.width, objParado.height, objQuerAndar.x, objQuerAndar.y, objQuerAndar.width, objQuerAndar.height))
      return {x: 0, y: 0};

    // TODO : isso soh funciona perfeitamente se os dois forem quadrados ou retangulos (poderia-se fazer para FormasGeometricasComplexas tambem - para FormasGeometricasCompostas nao precisa porque dentro nesse metodo soh entram FormasGeometricasNaoCompostas)
    if (andarProporcional)
    {
      // a partir apenas de X
      let qtdPodeAndarX1;
      if (Interseccao.intersecDirecao(objQuerAndar.x, objQuerAndar.width, objParado.x, objParado.width))
        qtdPodeAndarX1 = 0;
      else
        qtdPodeAndarX1 = Interseccao._qtdPodeAndarEmX(objParado, objQuerAndar, qtdAndarX);
      // regra de 3 (a partir de X):
      let qtdPodeAndarY1 = (qtdPodeAndarX1*qtdAndarY)/qtdAndarX;

      // a partir apenas de Y
      let qtdPodeAndarY2;
      if (Interseccao.intersecDirecao(objQuerAndar.y, objQuerAndar.height, objParado.y, objParado.height))
        qtdPodeAndarY2 = 0;
      else
        qtdPodeAndarY2 = Interseccao._qtdPodeAndarEmY(objParado, objQuerAndar, qtdAndarY);

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
      // verifica se nao estah intersectando nas duas direcoes
      const estahIntersectandoX = Interseccao.intersecDirecao(objQuerAndar.x, objQuerAndar.width, objParado.x, objParado.width);
      const estahIntersectandoY = Interseccao.intersecDirecao(objQuerAndar.y, objQuerAndar.height, objParado.y, objParado.height);

      // se nao estiver intersectando em nenhuma das direcoes, tambem tem que calcular quanto tem que andar...
      const naoEstahIntersectandoNenhum = !estahIntersectandoX && !estahIntersectandoY;

      let qtdPodeAndarY;
      if (estahIntersectandoX || naoEstahIntersectandoNenhum)
      //se estah intersectando em X (eh trocado mesmo)
        qtdPodeAndarY = Interseccao._qtdPodeAndarEmY(objParado, objQuerAndar, qtdAndarY);
      else
        qtdPodeAndarY = qtdAndarY;
      let qtdPodeAndarX;
      if (estahIntersectandoY || naoEstahIntersectandoNenhum)
      //se estah intersectando em Y (eh trocado mesmo)
        qtdPodeAndarX = Interseccao._qtdPodeAndarEmX(objParado, objQuerAndar, qtdAndarX);
      else
        qtdPodeAndarX = qtdAndarX;

      return {x: qtdPodeAndarX, y: qtdPodeAndarY};
    }
  }
  static _qtdPodeAndarEmX(objParado, objQuerAndar, qtdAndarX)
  // considera que vai colidir em X
  {
    // TODO: fazer isso considerando que os objetos podem nao ser Retangulos
    if (qtdAndarX < 0)
      return Interseccao._qtdAndarComMargem(objParado.x + objParado.width - objQuerAndar.x);
    else
    if (qtdAndarX > 0)
      return Interseccao._qtdAndarComMargem(objParado.x - (objQuerAndar.x + objQuerAndar.width));
    else
      return 0;
  }
  static _qtdPodeAndarEmY(objParado, objQuerAndar, qtdAndarY)
  // considera que vai colidir em Y
  {
    // TODO: fazer isso considerando que os objetos podem nao ser Retangulos
    if (qtdAndarY < 0)
      return Interseccao._qtdAndarComMargem(objParado.y + objParado.height - objQuerAndar.y);
    else
    if (qtdAndarY > 0)
      return Interseccao._qtdAndarComMargem(objParado.y - (objQuerAndar.y + objQuerAndar.height));
    else
      return 0;
  }
  static _qtdAndarComMargem(qtdAndar)
  {
    if (qtdAndar < 0)
      return Math.min(qtdAndar + qntNaoColidir, 0);
    else
    //if (qtdAndar >= 0)
      return Math.max(qtdAndar - qntNaoColidir, 0);
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
		//         saiu p/ baixo                     || saiu p/ cima
		if (obj.menorY >= height - heightVidaUsuario || obj.maiorY <= 0) //Y
			return true;
		return false;
	}

	//OBJETO VAI SAIR
	static objVaiSairEmX(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ direita
		if (obj.maiorX + qtdMuda > width)
			return Direcao.Direita;
    //saiu p/ esquerda
    if (obj.menorX + qtdMuda < 0)
      return Direcao.Esquerda;
    return 0; //nao saiu
	}
  static objSaiuEmX(obj) //obj = formageometrica
  { return Tela.objVaiSairEmX(obj, 0); }
  static qtdAndarObjNaoSairX(obj, qtdMuda) //obj = formageometrica
  {
    const direcaoSair = Tela.objVaiSairEmX(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair === Direcao.Direita)
      return width - (obj.x + obj.width);
    else
    //if (direcaoSair === Direcao.Esquerda)
      return -obj.x;
  }

	static objVaiSairEmY(obj, qtdMuda) //obj = formageometrica
	{
    //saiu p/ baixo
		if (obj.maiorY + qtdMuda > height - heightVidaUsuario)
			return Direcao.Baixo;
    //saiu p/ cima
    if (obj.menorY + qtdMuda < 0)
      return Direcao.Cima;
    return 0; //nao saiu
	}
  static objSaiuEmY(obj) //obj = formageometrica
  { return Tela.objVaiSairEmY(obj, 0); }
  static qtdAndarObjNaoSairY(obj, qtdMuda) //obj = formageometrica
  {
    const direcaoSair = Tela.objVaiSairEmY(obj, qtdMuda);
    if (!direcaoSair)
      return qtdMuda;
    if (direcaoSair === Direcao.Baixo)
      return (height - heightVidaUsuario) - (obj.y + obj.height);
    else
    //if (direcaoSair === Direcao.Baixo)
      return -obj.y;
  }

  static objVaiSair(obj, qtdMudaX, qtdMudaY)
  { return Tela.objVaiSairEmX(obj, qtdMudaX) || Tela.objVaiSairEmY(obj, qtdMudaY); }

  //OUTROS
  static xParaEstarNoMeio(widthObj)
  { return (width-widthObj)/2; }
  static yParaEstarNoMeio(heightObj)
  { return (height - heightVidaUsuario - heightObj)/2; }
}

class Operacoes
{
	static hipotenusa(cateto1, cateto2)
	{ return Math.sqrt(cateto1*cateto1 + cateto2*cateto2); }

  static diagonalQuad(lado)
  { return lado*Math.sqrt(2)/2; }

  static ultimoAlgarismo(num) //retorna um numero inteiro
  { return Math.floor(num%10); }
  static primAlgoritDpVirgulaEhZero(num)
  { return Operacoes.ultimoAlgarismo(num*10)===0; }
}

class Geometria
{
  //0: colinear, 1: sentido horário, 2: sentido anti-horário
  static orientacao(p1, p2, p3)
  {
      // https://www.geeksforgeeks.org/orientation-3-ordered-points/
      var val = (p2.y - p1.y)*(p3.x - p2.x) -
                (p2.x - p1.x)*(p3.y - p2.y);

      if (val === 0) return 0; // colinear

      return (val > 0)? 1: 2; // sentido horário ou anti-horário
  }

  //FORMAS: quadrado, retangulo, triangulo, paralelogramo, quadrilatero, formaComposta
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
  static get COD_FORMA_COMPOSTA()
  { return 10; }
}
