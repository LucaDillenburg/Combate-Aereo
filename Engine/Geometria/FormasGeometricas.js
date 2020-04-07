//FORMAS: quadrado, retangulo, triangulo, paralelogramo, quadrilatero, FormaGeometricaComposta

// Base para formasGeometricas SEM atributo corImg
class FormaGeometricaBasica {
	constructor() { }

	get width() { return this.maiorX - this.menorX; }
	get height() { return this.maiorY - this.menorY; }

	get anguloRotacionouTotal() {
		if (this._anguloRotacionouTotal === undefined)
			return 0;
		else
			return this._anguloRotacionouTotal;
	}

	//interseccao
	interseccao(obj) {
		return Interseccao.intersecDirecao(this.x, this.width, obj.x, obj.width)
			&& Interseccao.intersecDirecao(this.y, this.height, obj.y, obj.height);
	}

	//para mudarTamanho
	_setXYMudarTamanho(porcentagem, pontoReferenciaCentral) {
		//deixar (x,y) certo de acordo com o pontoReferenciaCentral
		if (pontoReferenciaCentral === undefined) {
			//para aumentar ou diminui igual para os dois lados
			const qtdCresceu = this._qtdCresceuMedidasMudarTamanho(porcentagem);
			this.x -= qtdCresceu.width / 2;
			this.y -= qtdCresceu.height / 2;
		} else {
			//para mudarTamanho baseado num outro ponto de referencia central sem ser o proprio
			//O porque:
			//- se eu quero mudar o tamanho de uma formaGeometrica sem que o ponto central seja o centroMassa eu nao posso simplesmente fazer o mesmo que o if de cima (se nao a formaComposta ficaria "descompensada", o tamanho das formas estaria certo mas seu (x,y) nao)
			//- entao para deixar tudo compensado precisa-se mudar o tamanho das formasGeometricas fazendo com que o ponto central seja o centroMassa da FormasComposta
			//Explicacao:
			//- a divisao/proporcao entre [a diferenca do x novo (que queremos achar) e do x de pontoReferenciaCentral] e [a diferenca do x antigo (antes de mudarTamanho) e do x de pontoReferenciaCentral] eh porcentagem. Assim descobrimos o novo x de acordo com o pontoReferenciaCentral
			//- fazendo o mesmo procedimento para o y, descobrimos o valor dele

			/*
			  Regra de 3:
			   novoX - pontoReferenciaCentral.x  ---  antX - pontoReferenciaCentral.x
									porcentagem  ---  1
			   novoX  = (antX - pontoReferenciaCentral.x)*porcentagem + pontoReferenciaCentral.x
			*/
			this.x = (this.x - pontoReferenciaCentral.x) * porcentagem + pontoReferenciaCentral.x;
			this.y = (this.y - pontoReferenciaCentral.y) * porcentagem + pontoReferenciaCentral.y;
		}
	}
	_qtdCresceuMedidasMudarTamanho(porcentagem) {
		return {
			width: (porcentagem - 1.00) * this.width,
			height: (porcentagem - 1.00) * this.height
		};
	}

	//arestas
	get arestas() {
		if (this._arestas === undefined) {
			this._arestas = new Array(this.vertices.length);
			//Ex: se tiver quatro lados (0 -> 1), (1 -> 2), (2 -> 3), (3 -> 0)
			for (let i = 0; i < this._arestas.length; i++)
				this._arestas[i] = new Semirreta(this._vertices[i],
					this._vertices[(i + 1) % this._arestas.length]);
		}

		return this._arestas;
	}

	get centroMassa() {
		if (this._centroMassa === undefined)
			this._centroMassa = new Ponto(this.x + this.width / 2, this.y + this.height / 2);
		return this._centroMassa;
	}
	// serve perfeitamente para quadrado e retangulo e mais ou menos para o resto

	// retornar x ou y especifico
	get xParaEstarNoMeio() { return Tela.xParaEstarNoMeio(this.width); }
	get xParaEstarParedeDireita() { return width - this.width; }
	get yParaEstarNoMeio() { return Tela.yParaEstarNoMeio(this.height); }
	get yParaEstarParedeBaixo() { return height - heightVidaUsuario - this.height; }

	// mudar (x,y)
	colocarParedeEsquerda() { this.x = 0; }
	colocarNoMeioX() { this.x = this.xParaEstarNoMeio; }
	colocarParedeDireita() { this.x = this.xParaEstarParedeDireita; }
	colocarParedeCima() { this.y = 0; }
	colocarNoMeioY() { this.y = this.yParaEstarNoMeio; }
	colocarParedeBaixo() { this.y = this.yParaEstarParedeBaixo; }
	//
	colocarLugarEspecificado(x, y) {
		if (x !== undefined) this.x = x;
		if (y !== undefined) this.y = y;
	}

	//Metodos Obrigatorios
	//para clone()
	_procedimentosClone(ret, x, y)
	//muda ret por passagem por referencia
	{
		ret.colocarLugarEspecificado(x, y); //coloca no lugar certo
	}
	//toString
	toString() { return "{x: " + this.x + ", y:" + this.y + "}\nwidth: " + this.width + "; height: " + this.height; }
}

// Base para formasGeometricas COM atributo corImg
class FormaGeometrica extends FormaGeometricaBasica {
	constructor(corImg, porcentagemImagem = 1)
	// corImg: imagem ou {fill: cor, stroke: cor}
	{
		super();
		this.corImg = corImg;
		this._porcentagemImagem = porcentagemImagem;
	}

	//imagem/cor
	get corImg() { return this._corImg; }
	set corImg(corImg) // se for adicionar imagem tem que setar porcentagemImagem
	{
		if (corImg === undefined)//se nao estah querendo soh a parte de backend (sem colocar na tela) ou se eh pro draw sair transparente
		{
			delete this._ehCor;
			delete this._corImg;
			return;
		}

		this._ehCor = corImg.fill !== undefined || corImg.stroke !== undefined;
		if (this._ehCor) {
			if (this._corImg === undefined || this._corImg.drawingContext !== undefined/*se eh p5.Image*/)
				this._corImg = {};

			//isso impossibilita que se o corImg for mudado aqui ou la fora o outro seja mudado tambem
			this._corImg.stroke = corImg.stroke;
			this._corImg.fill = corImg.fill;
		} else
			//se for imagem, passa soh o caminho dela como parametro
			this._corImg = corImg;
	}
	set porcentagemImagem(porc) { this._porcentagemImagem = porc; }
	get ehCor() { return this._ehCor; }

	//imagens por cima da orginal
	//adicionar e remover
	adicionarImagemSecundaria(chave, img, porcWidth, porcLadosCentroImg)
	// porcLadosCentroImg deve ser (x,y), sendo x a porcentagem de this.width onde estah xCentro, e ,y a porcentagem de this.height onde estah yCentro
	{
		if (this._imagensSecundarias === undefined)
			this._imagensSecundarias = [];

		let infoImgSec = { img: img, porcWidth: porcWidth, porcLadosCentroImg: porcLadosCentroImg, rotacao: 0 };

		//Medidas da Imagem
		//descobrir height proporcionalmente a width:
		//Regra de 3: [width da imagem] estah para [height da imagem] assim como [width] esta para [x]
		infoImgSec.width = porcWidth * this.widthSemRotac;
		infoImgSec.height = infoImgSec.img.height * infoImgSec.width / infoImgSec.img.width;

		if (chave === undefined) {
			this._imagensSecundarias.push(infoImgSec);
			return this._imagensSecundarias.length;
		} else
			this._imagensSecundarias[chave] = infoImgSec;
	}
	removerImagemSecundaria(chave) {
		if (!isNaN(chave)) //se for numero, dar splice
			this._imagensSecundarias.splice(chave, 1);
		else
			delete this._imagensSecundarias[chave];
	}
	removerTodasImagensSecundarias() { delete this._imagensSecundarias; }
	//rotacao
	rotacionarImagemSecundaria(chave, qtdMuda) {
		this._imagensSecundarias[chave].rotacao = Angulo.entrePIeMenosPI(this._imagensSecundarias[chave].rotacao + qtdMuda);
		//deixar "rotacao" sempre entre -PI a PI
	}
	getRotacaoImgSecundaria(chave) { return this._imagensSecundarias[chave].rotacao; }
	//pontoCentral (usa porcLadosCentroImg)
	getPontoCentralAbsolutoImagemSecundaria(chave) //ponto central absoluto (considerando o ponto mais em cima e da direita do canvas (0,0))
	{
		const porcLadosCentroImg = this._imagensSecundarias[chave].porcLadosCentroImg;
		return new Ponto(this.x + porcLadosCentroImg.x * this.width, this.y + porcLadosCentroImg.y * this.height);
	}
	//medidas (width, height)
	getMedidaImagemSecundaria(chave, ehWidth) {
		if (ehWidth)
			return this._imagensSecundarias[chave].width;
		else
			return this._imagensSecundarias[chave].height;
	}
	//desenhar
	_desenharImagensSecundarias(opacidade) {
		let jahSetouOpacidade = false;

		//porque usei for...in aqui? find "*PORQUE FOR...IN EM IMAGENSSECUNDARIAS"
		for (let chave in this._imagensSecundarias)
			if (typeof this._imagensSecundarias[chave] !== 'function') {
				const infoImgSec = this._imagensSecundarias[chave];

				//opacidade (ZERO ou 1 vez por metodo)
				if (jahSetouOpacidade === false) {
					push();

					//opacidade
					this._colocarOpacidadeParaImg(opacidade); //opacidade imagens secundarias
					jahSetouOpacidade = true;

					//rotacionar
					if (this.anguloRotacionouTotal !== 0) {
						translate(this.centroMassa.x, this.centroMassa.y);
						rotate(this._anguloRotacionouTotal);
					}
				}

				//desenhar imagem
				let centroX = infoImgSec.porcLadosCentroImg.x * this.widthSemRotac;
				let centroY = infoImgSec.porcLadosCentroImg.y * this.heightSemRotac;
				if (this.anguloRotacionouTotal !== 0) {
					centroX -= this.distXCentroAbs;
					centroY -= this.distYCentroAbs;
				} else {
					centroX += this.x;
					centroY += this.y;
				}

				this._desenharImagemRotacionada(infoImgSec.img, infoImgSec.rotacao,
					centroX, centroY, infoImgSec.width, infoImgSec.height);
			}

		if (jahSetouOpacidade === true)
			pop(); //por causa da opacidade
	}
	_mudarTamanhoImgsSecundarias(porcentagem) {
		//porque usei for...in aqui? find "*PORQUE FOR...IN EM IMAGENSSECUNDARIAS"
		for (let chave in this._imagensSecundarias)
			if (typeof this._imagensSecundarias[chave] !== 'function') {
				const infoImgSec = this._imagensSecundarias[chave];
				//medidas
				infoImgSec.width *= porcentagem;
				infoImgSec.height *= porcentagem;
			}
	}

	//PARA DRAW:
	//opacidade e cores
	_colocarCores(opacidade) {
		let strokeAtual;
		if (opacidade === undefined) {
			strokeAtual = this._corImg.stroke;
			fill(this._corImg.fill);
		} else {
			//deixar cores com opacidade
			if (this._corImg.stroke !== undefined)
				strokeAtual = color(red(this._corImg.stroke), green(this._corImg.stroke), blue(this._corImg.stroke), opacidade * 255/*base 1 para base 255*/);
			fill(color(red(this._corImg.fill), green(this._corImg.fill), blue(this._corImg.fill), opacidade * 255/*base 1 para base 255*/));
		}

		if (strokeAtual === undefined) //se nao tem stroke, eh noStroke()
			noStroke();
		else
			stroke(strokeAtual);
	}
	//opacidade e imagem
	_colocarOpacidadeParaImg(opacidade) {
		//opacidade
		if (opacidade !== undefined)
			tint(255, opacidade * 255/*base 1 para base 255*/);
	}
	//imagem
	_desenharImagem() {
		//deixar imagem no meio da formaGeometrica
		const widthImg = this.width * this._porcentagemImagem;
		const heightImg = this.height * this._porcentagemImagem;
		const x = this.x + (this.width - widthImg) / 2;
		const y = this.y + (this.height - heightImg) / 2;
		image(this._corImg, x, y, widthImg, heightImg);
	}
	// para desenhar this._corImg quando a formaGeometrica for rotacionada e this._ehCor E para desenhar imagens secundarias
	_desenharImagemRotacionada(img, anguloRotacao, centroX, centroY, widthImg, heightImg,
		distXCentroAbs = widthImg / 2, distYCentroAbs = heightImg / 2)
	// distXCentroAbs e distYCentroAbs: distancia absoluta do centro rotacao ateh (x,y). (ps: quando o centro eh como o de um retangulo a distancia eh width/2 e height/2)
	{
		push();
		translate(centroX, centroY); //muda o (0,0) para a posicao onde (x,y) (os dois parametros sao, respectivamente, o x e o y de acordo com a medida atual de (x,y) que sera considerada (0,0))
		rotate(anguloRotacao); //rotaciona ("gira")
		image(img, -distXCentroAbs, -distYCentroAbs, widthImg, heightImg);
		pop();
	}

	// para clone
	_procedimentosClone(ret, x, y)
	//muda ret por passagem por referencia
	{
		super._procedimentosClone(ret, x, y); //coloca lugar especificado
		this._passarImagensSecundariasParaOutraForma(ret); //passa imagens secundarias dessa forma para o clone
	}
	_passarImagensSecundariasParaOutraForma(formaGeom) {
		//*PORQUE FOR...IN EM IMAGENSSECUNDARIAS
		//usei for...in porque forEach nao tras as propriedades que nao sao numeraveis (e nesse caso a chave pode ser uma string)
		for (let chave in this._imagensSecundarias)
			if (typeof this._imagensSecundarias[chave] !== 'function')
			// for...in tras tudo do objeto inclusive suas funcoes que nao sao necessarias
			{
				const infoImgSec = this._imagensSecundarias[chave];
				//adicionar imagem secundaria
				formaGeom.adicionarImagemSecundaria(chave, infoImgSec.img, infoImgSec.porcWidth, infoImgSec.porcLadosCentroImg);
				//rotaciona como ela estava
				formaGeom.rotacionarImagemSecundaria(chave, infoImgSec.rotacao);
			}
	}
}
/*Quem der extends em FormaGeometrica tem que ter:
  //forma
  -> get codForma()
  -> get nLados()
  -> get vertices() //SENTIDO HORARIO
  -> interseccao(obj) //retorna se estah intersectando

  -> get menorX()
  -> get maiorX()
  -> get menorY()
  -> get maiorY()

  -> get x()
  -> get y()
  -> set x()
  -> set y()

  -> get centroMassa() (se for diferete do simples)

  -> mudarTamanho(porcentagem)

  -> rotacionar(angulo)
  -> setRotacao(angulo)
  -> get distXCentroAbs()
  -> get distYCentroAbs()
  -> get widthSemRotac()
  -> get heightSemRotac()

  //desenho
  -> draw(opacidade)

  //clone
  -> clone(x,y)

ps: nao fiz com interface, pois nao faz muito sentido em javascript
*/


// FORMAS SIMPLES
class FormaGeometricaSimples extends FormaGeometrica {
	constructor(x = 0, y = 0, corImg, porcentagemImagem) {
		super(corImg, porcentagemImagem);
		this._x = x;
		this._y = y;
	}

	get nLados() { return 4; }
	get vertices() {
		if (this._vertices === undefined) {
			this._vertices = new Array(4);
			this._vertices[0] = new Ponto(this._x, this._y);
			this._vertices[1] = new Ponto(this._x + this.width, this._y);
			this._vertices[2] = new Ponto(this._x + this.width, this._y + this.height);
			this._vertices[3] = new Ponto(this._x, this._y + this.height);
		}

		return this._vertices;
	}

	_mudouArestasVertices() {
		delete this._vertices;
		delete this._arestas;
	}
	_mudouArestas() { delete this._arestas; }

	//forma
	get x() { return this._x; }
	set x(x) {
		if (this._x === undefined) this._x = 0;
		this.mudarX(x - this._x);
	}
	mudarX(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar X)
	{
		if (qtdMuda !== 0) {
			this._mudouArestas();

			this._x += qtdMuda;
			if (this._vertices !== undefined)
				this._vertices.forEach(vert => vert.x += qtdMuda);
			if (this._centroMassa !== undefined)
				this._centroMassa.x += qtdMuda;
		}

		//se aparece um pouco
		return this._x + this._width > 0 && this._x <= width;
	}
	get y() { return this._y; }
	set y(y) {
		if (this._y === undefined) this._y = 0;
		this.mudarY(y - this._y);
	}
	mudarY(qtdMuda) //retorna se aparece um pouco do objeto pelo menos (nos objetos que tem que ficar sempre dentro da tela, verifica-se se vai estar totalmente dentro antes de mudar Y)
	{
		if (qtdMuda !== 0) {
			this._mudouArestas();

			this._y += qtdMuda;
			if (this._vertices !== undefined)
				this._vertices.forEach(vert => vert.y += qtdMuda);
			if (this._centroMassa !== undefined)
				this._centroMassa.y += qtdMuda;
		}

		//se aparece um pouco
		return this._y + this._height > 0 && this._y <= height - heightVidaUsuario;
	}

	//get maior/menor x/y
	get menorX() { return this._x; }
	get maiorX() { return this._x + this.width; }
	get menorY() { return this._y; }
	get maiorY() { return this._y + this.height; }

	//get angulos direcoes
	get pontoAngInicial() { return this.vertices[1]; }
	get ultimoAngDir() {
		if (this._ultimoAngDir === undefined)
			this._ultimoAngDir = new Angulo(this.pontoAngInicial, this.centroMassa, this.vertices[2],
				Angulo.MAIOR_180_CIMA).valorGraus;
		return this._ultimoAngDir;
	}
	get ultimoAngBaixo() { return 180; }
	get ultimoAngEsq() { return this.ultimoAngDir + 180; }

	//intersecccao
	contem(obj) {
		//todos os pontos tem que estar dentro
		return obj.vertices.every(vert =>
			vert.x >= this._x && vert.x <= this._x + this.width //estah dentro em X
			&& vert.y >= this._y && vert.y <= this._y + this.height); //estah dentro em Y);
	}

	//ROTACAO
	//atributos
	get distXCentroAbs() { return this._getMedidasSemRotacionar().width / 2; }
	get distYCentroAbs() { return this._getMedidasSemRotacionar().height / 2; }
	get widthSemRotac() { return this._getMedidasSemRotacionar().width; }
	get heightSemRotac() { return this._getMedidasSemRotacionar().height; }
	//rotacionar
	setRotacao(anguloRotacaoTotal, centroRotacao)
	//retorna formaGeometrica rotacionada
	{
		// soh comeca a gastar a memoria dessa variavel quando usa pela primeira vez
		if (this._anguloRotacionouTotal === undefined) this._anguloRotacionouTotal = 0;

		// tenta rotacionar como formaGeometricaSimples mesmo
		const conseguiuRotacionar = this._rotacionarFormaSimples(anguloRotacaoTotal - this._anguloRotacionouTotal, centroRotacao);
		if (conseguiuRotacionar)
			//se deu pra rotacionar como oforma simples mesmo
			return this;

		return this.rotacionar(anguloRotacaoTotal - this._anguloRotacionouTotal, centroRotacao, true);
		// jah tentou rotacionar a formaGeometricaSimples, entao nao precisa tentar de novo
	}
	rotacionar(angulo, centroRotacao, jahTentouRotacionar = false)
	//retorna formaGeometrica rotacionada
	{
		// soh comeca a gastar a memoria dessa variavel quando usa pela primeira vez
		if (this._anguloRotacionouTotal === undefined) this._anguloRotacionouTotal = 0;

		if (!jahTentouRotacionar) {
			// tenta rotacionar como formaGeometricaSimples mesmo
			const conseguiuRotacionar = this._rotacionarFormaSimples(angulo, centroRotacao);
			if (conseguiuRotacionar)
				//se deu pra rotacionar como oforma simples mesmo
				return this;
		}

		// fazer um "clone" dessa forma porem com formado de quadrilatero
		let quadrilatero = new Quadrilatero(
			new Ponto(this.x, this.y), //(x, y)
			new Ponto(this.x + this.width, this.y), //(x+w, y)
			new Ponto(this.x + this.width, this.y + this.height), //(x+w, y+h)
			new Ponto(this.x, this.y + this.height), //(x, y+h)
			this._corImg, this._porcentagemImagem
		);
		this._passarImagensSecundariasParaOutraForma(quadrilatero); //passa imagens secundarias dessa forma para o quadrilatero
		// nao precisa colocarLugarEspecificado() pois jah estah no lugar certo

		// rotacionar ateh como essa formaGeometrica estah e mais o que foi pedido
		const medidasSemRotacionar = this._getMedidasSemRotacionar();
		quadrilatero.cloneVariaveisRotacionar(this._anguloRotacionouTotal, medidasSemRotacionar.width, medidasSemRotacionar.height);
		quadrilatero.rotacionar(angulo, centroRotacao);

		// retorna quadrilatero com as mesmas propriedades dessa forma porem rotacionado
		return quadrilatero;
	}
	_rotacionarFormaSimples(angulo, centroRotacao)
	//retorna se conseguiu rotacionar
	// para Otimizar: todos os metodos com FormaGeometricaSimples sao mais rapidos do que com FormaGeometricaComplexa
	{
		angulo = Angulo.entrePIeMenosPI(angulo);

		// se nao precisa rotacionar (se eh)
		if (Exatidao.ehQuaseExato(angulo, 0))
			return true;

		// mudar as medidas de width e height, e, saber se da pra rotacionar:

		// Math.abs(angulo) = 90 ou 180 => consegue rotacionar em FormaGeometricaSimples mesmo
		const eh90GrausAbs = Exatidao.ehQuaseExato(PI / 2, Math.abs(angulo));
		const eh180GrausAbs = Exatidao.ehQuaseExato(PI, Math.abs(angulo));
		const conseguiuRotacionar = eh90GrausAbs || eh180GrausAbs;

		if (conseguiuRotacionar) {
			//MUDAR (X,Y)
			if (centroRotacao !== undefined)
			//se rotacionou em volta de outro eixo (que nao o centroMassa dessa formaGeometrica), tem que mudar o (x,y)
			{
				if (eh90GrausAbs) {
					//Explicacao:
					//- todos os pontos de uma formaGeometrica que gira +90graus ao entorno de um ponto central se transforma de (x,y) para (-y, x), e -90graus, de(x,y) para (y, -x) (considerando o centroRotacao = (0,0))
					//ps: eh ao contrario da rotacao de 90graus de pontos no plano cartesiano, porque nesse caso o y aumenta pra baixo
					//- se gira em sentido horario o proximo ponto que sera o pontoInicial da formaGeometrica, isto eh, o (x,y) da forma eh vertices[3], e, em sentido anti-horario, vertices[1]
					let novoPontoInicial;
					if (angulo > 0) //+90 => vertices[3]
						novoPontoInicial = this.vertices[3];
					else //-90 => vertices[1]
						novoPontoInicial = this.vertices[1];

					// considerando centroRotacao = (0,0)
					novoPontoInicial = novoPontoInicial.menos(centroRotacao);

					// rotacionando ponto
					if (angulo < 0) //-90 => (y, -x)
						novoPontoInicial = new Ponto(novoPontoInicial.y, -novoPontoInicial.x);
					else //+90 => (-y, x)
						novoPontoInicial = new Ponto(-novoPontoInicial.y, novoPontoInicial.x);

					//voltando a considerar centroRotacao o qnt ele valia
					novoPontoInicial = novoPontoInicial.mais(centroRotacao);

					//mudar (x,y)
					this.x = novoPontoInicial.x;
					this.y = novoPontoInicial.y;
				} else {
					//Explicacao: a distancia do ponto medio dos lados horizontais da formaGeometrica antes de rotacionar ao X do centro de rotacao, eh a mesma distancia do X do centro de rotacao ao ponto medio dos lados horizontais da formaGeometrica depois de rotacionar (o mesmo acontece com a direcao vertical)
					const distCentroFormaCentroRot = centroRotacao.menos(this.centroMassa);
					this.x += 2 * distCentroFormaCentroRot.x;
					this.y += 2 * distCentroFormaCentroRot.y;
				}
			} else
				if (eh90GrausAbs && this instanceof Retangulo)
				//se eh Retangulo e girou 90graus ao redor do centroMassa, tem que mudar o (x,y)
				{
					// x: (widthInicial - widthFinal)/2
					// y: (heightInicial - heightFinal)/2
					this.x += (this._width - this._height) / 2;
					this.y += (this._height - this._width) / 2;
				}

			// MUDAR MEDIDAS WIDTH E HEIGHT
			// se for rotacionar 90graus (pra que lado seja) em um retangulo, as medidas de width e height vao se inverter
			// caso contrario e se conseguiu rotacionar, nao muda nada na formaGeometrica em si (soh rotaciona a imagem quando for colocar)
			if (eh90GrausAbs && this instanceof Retangulo) {
				const height = this.height;
				this._height = this.width;
				this._width = height;

				//como consequencia de mudar width e height:
				if (this._ultimoAngDir !== undefined)
					this._ultimoAngDir = PI - this._ultimoAngDir; //180 - angulo (eh o suplementar)
			}

			// se rotacionou em outro eixo senao o centroMassa, centroMassa mudou
			if (centroRotacao !== undefined && this._centroMassa !== undefined && !this._centroMassa.equals(centroRotacao))
				delete this._centroMassa;

			this._anguloRotacionouTotal = Angulo.entrePIeMenosPI(this._anguloRotacionouTotal + angulo);
			//para imagem tambem aparecer rotacionada no lugar certo
		}

		return conseguiuRotacionar;
	}
	_getMedidasSemRotacionar() {
		//anguloRotacionou: -180, -90, 0(jah foi tratado), 90, 180
		//soh pode ser esses angulos porque se fosse diferente disso, nao teria sido possivel rotacionar a formaGeometricaSimples, e entao agora seria FormaGeometricaComplexa

		// se for um retangulo que rotacionou 90graus (independente do sentido), o widthImg e heightImg sao, respectivamente, this.height e this.width (fora esse caso, eh normal: this.width e this.height)
		if (this instanceof Retangulo && Exatidao.ehQuaseExato(Math.abs(this._anguloRotacionouTotal), PI / 2))
			return { width: this.height, height: this.width };
		else
			return { width: this.width, height: this.height };
	}

	//draw
	draw(opacidade) {
		if (this._ehCor !== undefined) //pode querer printar soh as imagens secundarias
		{
			push(); //opacidadeImg ou fill/stroke
			if (this._ehCor) {
				//cor e opacidade
				this._colocarCores(opacidade);
				//desenhar retangulo
				rect(this._x, this._y, this.width, this.height);
			} else {
				//opacidade
				this._colocarOpacidadeParaImg(opacidade);
				//desenhar a imagem
				this._desenharImagem();
			}
			pop(); //opacidadeImg ou fill/stroke
		}

		//imagens secundarias
		this._desenharImagensSecundarias(opacidade);
	}
	// para quando forma estiver sido rotacionada tambem funcionar
	_desenharImagem() {
		if (this._anguloRotacionouTotal === undefined || Exatidao.ehQuaseExato(this._anguloRotacionouTotal, 0))
			// se nao rotacionou nada (ou estah como se nao tivesse rotacionado), printa normal (por otimizacao de tempo)
			super._desenharImagem();
		else {
			const medidasSemRotacionar = this._getMedidasSemRotacionar();

			//desenhar imagem rotacionada
			this._desenharImagemRotacionada(this._corImg, this._anguloRotacionouTotal,
				this.centroMassa.x, this.centroMassa.y, medidasSemRotacionar.width, medidasSemRotacionar.height);
		}
	}

	// para clone
	_procedimentosClone(ret, x, y)
	//muda ret por passagem por referencia
	{
		super._procedimentosClone(ret, x, y); //coloca lugar especificado + passa imagens secundarias dessa forma para o clone

		if (this.anguloRotacionouTotal !== 0)
			ret._anguloRotacionouTotal = this._anguloRotacionouTotal;
		//jah estah rotacionado (entao soh precisa colocar variaveis de rotacao no ret)
	}
}

class Retangulo extends FormaGeometricaSimples {
	constructor(x, y, width, height, corImg, porcentagemImagem) {
		super(x, y, corImg, porcentagemImagem);

		this._width = width;
		this._height = height;
	}

	//getters basicos
	get codForma() { return Geometria.COD_RETANGULO; }

	get width() { return this._width; }
	get height() { return this._height; }

	//mudar tamanho
	mudarTamanho(porcentagem, pontoReferenciaCentral) {
		if (porcentagem < 0) porcentagem = 0;

		//imagens secundarias (tem que ser antes de tudo mesmo)
		this._mudarTamanhoImgsSecundarias(porcentagem);

		//deixar (x,y) certo de acordo com o pontoReferenciaCentral
		this._setXYMudarTamanho(porcentagem, pontoReferenciaCentral);

		//mudar tamanho
		this._width *= porcentagem;
		this._height *= porcentagem;

		// se ele cresceu com pontoReferenciaCentral sendo seu proprio centroMassa, centroMassa nao muda (ele vai crescer igualmente para todos os lados)
		if (pontoReferenciaCentral !== undefined)
			delete this._centroMassa;

		this._mudouArestasVertices();
		return this._width > 0 && this._height > 0;
	}

	//clone
	clone(x, y) {
		let ret = new Retangulo(this._x, this._y, this._width, this._height, this._corImg, this._porcentagemImagem);
		this._procedimentosClone(ret, x, y) //coloca lugar especificado + passa imagens secundarias dessa forma para o clone + rotaciona o clone como esse this estah
		return ret;
	}
}

class Quadrado extends FormaGeometricaSimples {
	constructor(x, y, tamanhoLado, corImg, porcentagemImagem) {
		super(x, y, corImg, porcentagemImagem);
		this._tamLado = tamanhoLado;
	}

	//getters basicos
	get codForma() { return Geometria.COD_QUADRADO; }

	get tamanhoLado() { return this._tamLado; }
	get width() { return this._tamLado; }
	get height() { return this._tamLado; }

	//setters tamanho
	mudarTamanho(porcentagem, pontoReferenciaCentral) {
		if (porcentagem < 0) porcentagem = 0;

		//imagens secundarias (tem que ser antes de tudo mesmo)
		this._mudarTamanhoImgsSecundarias(porcentagem);

		//deixar (x,y) certo de acordo com o pontoReferenciaCentral
		this._setXYMudarTamanho(porcentagem, pontoReferenciaCentral);

		//muda tamanho
		this._tamLado *= porcentagem;

		// se ele cresceu com pontoReferenciaCentral sendo seu proprio centroMassa, centroMassa nao muda (ele vai crescer igualmente para todos os lados)
		if (pontoReferenciaCentral !== undefined)
			delete this._centroMassa;

		this._mudouArestasVertices();
		return this._tamLado > 0;
	}

	//clone
	clone(x, y) {
		let ret = new Quadrado(this._x, this._y, this._tamLado, this._corImg, this._porcentagemImagem);
		this._procedimentosClone(ret, x, y) //coloca lugar especificado + passa imagens secundarias dessa forma para o clone + rotaciona o clone como esse this estah
		return ret;
	}
}


//FORMA ROTACIONA TUDO
class FormaGeometricaRotacionaTudo extends FormaGeometrica {
	//setar variaveis
	_setarVariaveisRotacionar() {
		// para desenhar a imagem se rotacionou alguma coisa...
		//angulo rotate
		this._anguloRotacionouTotal = 0;
		//medidas de tamanho da imagem (width e height)
		this._widthSemRotacionar = this.width;
		this._heightSemRotacionar = this.height;
		//(x,y) relativa ao centroRotacao onde vai desenhar a imagem
		this._distXCentroAbs = this.centroMassa.x - this.x; //pra ficar absoluto/positivo
		this._distYCentroAbs = this.centroMassa.y - this.y; //pra ficar absoluto/positivo
	}

	//getters
	get distXCentroAbs() { return this._distXCentroAbs; }
	get distYCentroAbs() { return this._distYCentroAbs; }
	get widthSemRotac() {
		if (this._widthSemRotacionar === undefined)
			return this.width;
		else
			return this._widthSemRotacionar;
	}
	get heightSemRotac() {
		if (this._heightSemRotacionar === undefined)
			return this.height;
		else
			return this._heightSemRotacionar;
	}

	//rotacionar
	setRotacao(anguloRotacaoTotal, centroRotacao)
	//retorna formaGeometrica rotacionada (para funcionar para FormasGeometricasSimples tambem)
	{
		// soh comeca a gastar a memoria dessa variavel quando usa pela primeira vez
		if (this._anguloRotacionouTotal === undefined) this._setarVariaveisRotacionar();

		return this.rotacionar(anguloRotacaoTotal - this._anguloRotacionouTotal, centroRotacao);
	}

	//desenhar imagem (pode ter rotacionado)
	_desenharImagem() {
		if (this._anguloRotacionouTotal === undefined || Exatidao.ehQuaseExato(this._anguloRotacionouTotal, 0))
			// se nao rotacionou nada (ou estah como se nao tivesse rotacionado), printa normal (por otimizacao de tempo)
			super._desenharImagem();
		else
			this._desenharImagemRotacionada(this._corImg, this._anguloRotacionouTotal,
				this.centroMassa.x, this.centroMassa.y, this._widthSemRotacionar, this._heightSemRotacionar,
				this._distXCentroAbs, this._distYCentroAbs);
	}

	//para mudarTamanho
	_mudarTamanhoVariaveisRotacionar(porcentagem) {
		if (this._anguloRotacionouTotal !== undefined)
		//se as variaveis rotacionar jah foram setadas
		{
			this._widthSemRotacionar *= porcentagem;
			this._heightSemRotacionar *= porcentagem;
			this._distXCentroAbs *= porcentagem;
			this._distYCentroAbs *= porcentagem;
		}
	}

	//para clone
	_procedimentosClone(ret, x, y)
	//muda ret por passagem por referencia
	{
		super._procedimentosClone(ret, x, y); //coloca lugar especificado + passa imagens secundarias dessa forma para o clone

		//jah estah rotacionado (entao soh precisa colocar variaveis de rotacao no ret)
		ret.cloneVariaveisRotacionar(this._anguloRotacionouTotal, this._widthSemRotacionar, this._heightSemRotacionar,
			this._distXCentroAbs, this._distYCentroAbs);
	}
	cloneVariaveisRotacionar(anguloRotacionou, widthSemRotacionar, heightSemRotacionar,
		distXCentroAbs = widthSemRotacionar / 2, distYCentroAbs = heightSemRotacionar / 2) {
		if (anguloRotacionou !== undefined)
		// se jah rotacionou alguma coisa pode gastar espaco
		{
			this._anguloRotacionouTotal = anguloRotacionou;
			this._widthSemRotacionar = widthSemRotacionar;
			this._heightSemRotacionar = heightSemRotacionar;
			this._distXCentroAbs = distXCentroAbs;
			this._distYCentroAbs = distYCentroAbs;
		}
	}
}


//FORMAS COMPLEXAS
class FormaGeometricaComplexa extends FormaGeometricaRotacionaTudo {
	//PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
	constructor(a, corImg, porcentagemImagem) {
		super(corImg, porcentagemImagem);

		//forma
		this._a = a;
	}

	//getters (x,y) e (width,height)
	get x() { return this.menorX; }
	get y() { return this.menorY; }

	_mudouArestasTriang() {
		delete this._arestas;
		delete this._triangulos;
	}

	//setters (x,y)
	set x(novoX) //muda todos os vertices
	{ this.mudarX(novoX - this.x); }
	mudarX(qtdMuda) //muda todos os vertices
	{
		if (qtdMuda !== 0) {
			const jahTemMaiorMenorXY = this._maiorX !== undefined;
			if (!jahTemMaiorMenorXY)
				var maiorX = null, menorX = null, maiorY = null; //soh cria essas variaveis se for usa-las (tem que ser var para poder ser vista fora desse escopo)

			this.vertices.forEach((vert, index) => {
				this._mudarXYVertice(index, true, vert.x + qtdMuda);
				//mudar X do vertice (em {a,b,c,...} e no vetor)

				if (!jahTemMaiorMenorXY) {
					if (menorX === null || vert.x < menorX)
						menorX = vert.x;
					if (maiorX === null || vert.x > maiorX)
						maiorX = vert.x;
					if (maiorY === null || vert.y > maiorY)
						maiorY = vert.y;
				}
			});

			if (jahTemMaiorMenorXY) {
				this._maiorX += qtdMuda;
				this._menorX += qtdMuda;
				//nao muda nada em maiorY
			} else {
				this._maiorX = maiorX;
				this._menorX = menorX;
				this._maiorY = maiorY;
			}

			if (this._centroMassa !== undefined)
				this._centroMassa.x += qtdMuda;

			this._mudouArestasTriang();
		}

		//retorna se aparece um pouco
		return (maiorX > 0 && maiorX < width) || (menorX > 0 && menorX < width);
	}
	set y(novoY) //muda todos os vertices
	{ this.mudarY(novoY - this.y); }
	mudarY(qtdMuda) //muda todos os vertices
	{
		if (qtdMuda !== 0) {
			const jahTemMaiorMenorXY = this._maiorY !== undefined;
			if (!jahTemMaiorMenorXY)
				var maiorX = null, menorX = null, maiorY = null; //soh cria essas variaveis se for usa-las (tem que ser var para poder ser vista fora desse escopo)

			this.vertices.forEach((vert, index) => {
				this._mudarXYVertice(index, false, vert.y + qtdMuda);
				//mudar Y do vertice (em {a,b,c,...} e no vetor)

				if (!jahTemMaiorMenorXY) {
					if (menorX === null || vert.x < menorX)
						menorX = vert.x;
					if (maiorX === null || vert.x > maiorX)
						maiorX = vert.x;
					if (maiorY === null || vert.y > maiorY)
						maiorY = vert.y;
				}
			});

			if (jahTemMaiorMenorXY) {
				this._maiorY += qtdMuda;
				//nao muda nada em maiorX e menorX
			} else {
				this._maiorX = maiorX;
				this._menorX = menorX;
				this._maiorY = maiorY;
			}

			if (this._centroMassa !== undefined)
				this._centroMassa.y += qtdMuda;

			this._mudouArestasTriang();
		}

		//retorna se aparece um pouco
		return (this._maiorY > 0 && this._maiorY < height - heightVidaUsuario) ||
			(this.menorY > 0 && this.menorY < height - heightVidaUsuario);
	}

	//interseccao
	interseccao(obj) {
		//Otimizacao: verificar se estah intersectando como retangulo antes
		if (!super.interseccao(obj))
			return false;

		// EXPLICACAO:
		// 1. Se algum vertice de obj estah dentro de algum dos triangulos dessa figura
		// ou
		// 2. Se alguma arestas de obj intersecta com alguma aresta de this
		//ps: se todos os pontos estao dentro, o primeiro ponto estah dentro tbm e ent vai retornar true em 1
		//ps: se nem todos os pontos estao dentro, alguma aresta vai intersectar e
		//ent vai retornar true em 1 (se o primeiro ponto estiver dentro) ou em 2 (caso ele nao esteja)

		// 1.
		if ((obj.vertices[0].y >= this.menorY && obj.vertices[0].y <= this.maiorY))
			// se vertice estah dentro do menor e maior Y do this
			if (this.pontoEstahDentroAlgumTriang(obj.vertices[0]))
				// verificar se esse ponto estah dentro de algum dos triangulos
				return true;

		// 2. verificar se a aresta atual de obj intersecta com alguma aresta do this
		return obj.arestas.some(aresta => this.semirretaIntersectaAlgumaAresta(aresta));
	}
	pontoEstahDentroAlgumTriang(p) {
		// verificar se esse ponto estah dentro de algum dos triangulos
		return this.triangulos.some(triang => triang.pontoEstahDentro(p));
	}
	semirretaIntersectaAlgumaAresta(semirreta) {
		// verificar se a semirreta intersecta com alguma aresta do this
		return this.arestas.some(aresta => semirreta.interseccao(aresta));
	}

	// TODO: esse metodo nao funciona perfeitamente para FormaGeometricaComposta, porque os vertices retornados por ele sao o de um quadrado
	contem(obj) {
		//todos os pontos tem que estar dentro
		return obj.vertices.every(vert => this.pontoEstahDentroAlgumTriang(vert));
	}

	//rotacionar
	rotacionar(angulo, centroRotacao = this.centroMassa)
	//retorna formaGeometrica rotacionada (para funcionar para FormasGeometricasSimples tambem)
	{
		if (angulo === 0) return this; //nao tem que fazer nada

		// soh comeca a gastar a memoria dessa variavel quando usa pela primeira vez
		if (this._anguloRotacionouTotal === undefined) this._setarVariaveisRotacionar();

		//Explicacao: para rotacionar uma formaComplexo precisa-se rotacionar todos os vertices com centroRotacao=centroMassa
		this.vertices.forEach((vert, i) => this._mudarVertice(i, vert.rotacionar(angulo, centroRotacao)));

		// com o rotacionar os vertices podem ter ficado de maneira em que o primeiro nao eh o mais alto da esquerda
		// porem ainda estah em sentido horario, entao this.colocarVerticesOrdemCorreta() faria muitas coisas desnecessarias.

		//Solucao: (1.) descobrir qual eh o index com o menor x e menor y, e, (2.) considerar esse o primeiro vertice seguido pelos proximos
		// 1.
		let primeiroIndex = 0;
		for (let i = 1; i < this._vertices.length; i++) {
			if (this._vertices[i].y < this._vertices[primeiroIndex].y || //se estah mais pra cima
				(this._vertices[i].y == this._vertices[primeiroIndex].y && this._vertices[i].x < this._vertices[primeiroIndex].x)) //ou estah na mesma altura mas mais pra esquerda
				primeiroIndex = i;
		}
		// 2.
		let novosVertices = new Array(this.nLados);
		for (let i = 0; i < novosVertices.length; i++)
			novosVertices[i] = this._vertices[(primeiroIndex + i) % novosVertices.length];
		novosVertices.forEach((vert, i) => this._mudarVertice(i, vert)); //mudar (this._a,this._b,this._c,...) e (this._vertices)

		this._anguloRotacionouTotal = Angulo.entrePIeMenosPI(this._anguloRotacionouTotal + angulo);
		// deixar this._anguloRotacionouTotal entre -PI e PI

		// ATRIBUTOS QUE MUDARAM:
		// se rotacionou em outro eixo senao o centroMassa, centroMassa mudou
		if (this._centroMassa !== undefined && !this._centroMassa.equals(centroRotacao))
			delete this._centroMassa;
		//menorX, maiorX e maiorY mudaram
		this._mudouMenorMaiorXY();

		// pra ficar igual FormaGeometricaSimples
		return this;
	}

	//setters tamanho
	mudarTamanho(porcentagem, pontoReferenciaCentral) {
		if (porcentagem < 0) porcentagem = 0;

		//imagens secundarias (tem que ser antes de tudo mesmo)
		this._mudarTamanhoImgsSecundarias(porcentagem);

		//deixar (x,y) certo de acordo com o pontoReferenciaCentral
		this._setXYMudarTamanho(porcentagem, pontoReferenciaCentral);

		//mudar tamanho propriamente dito
		let pontoInicial = new Ponto(this.menorX, this.menorY);
		this.vertices.forEach((vert, index) => {
			//Procedimento:
			// - subtrair (x,y) de todos os vertices
			// - multiplicar pela porcentagem
			// - somar (x,y)
			this._mudarVertice(index, vert.menos(pontoInicial).multiplicado(porcentagem).mais(pontoInicial));
		});

		// arrumar maiorX e maiorY
		const qtdCresceu = this._qtdCresceuMedidasMudarTamanho(porcentagem);
		//como this._setXYMudarTamanho(...) mudou this._maiorX e this._maiorY, tem que adicionar todo o qtdCrescer e nao sobre dois
		if (this._maiorX !== undefined)
			this._maiorX += qtdCresceu.width;
		if (this._maiorY !== undefined)
			this._maiorY += qtdCresceu.height;

		// arrumar width e height para printar image
		if (this._widthSemRotacionar !== undefined)
			this._widthSemRotacionar *= porcentagem;
		if (this._heightSemRotacionar !== undefined)
			this._heightSemRotacionar *= porcentagem;

		// se ele cresceu com pontoReferenciaCentral sendo seu proprio centroMassa, centroMassa nao muda (ele vai crescer igualmente para todos os lados)
		if (pontoReferenciaCentral !== undefined)
			delete this._centroMassa;

		//para rotacao
		this._mudarTamanhoVariaveisRotacionar(porcentagem);

		this._mudouArestasTriang();
		return this.width > 0 && this.height > 0;
	}

	//maior/menor x/y
	_mudouMenorMaiorXY() {
		delete this._maiorX;
		delete this._menorX;
		delete this._maiorY;
	}
	_pegarMenorMaiorXY() {
		let maiorX = this.vertices[0].x; //constroi this._vertices se ainda nao estava construido
		let menorX = this._vertices[0].x;
		let maiorY = this._vertices[0].y;

		this._vertices.forEach(vert => {
			if (vert.x < menorX)
				menorX = vert.x;
			if (vert.x > maiorX)
				maiorX = vert.x;
			if (vert.y > maiorY)
				maiorY = vert.y;
		});

		this._maiorX = maiorX;
		this._menorX = menorX;
		this._maiorY = maiorY;
	}
	get menorX() {
		if (this._menorX === undefined)
			this._pegarMenorMaiorXY();
		return this._menorX;
	}
	get maiorX() {
		if (this._maiorX === undefined)
			this._pegarMenorMaiorXY();
		return this._maiorX;
	}
	get menorY() { return this._a.y; }
	get maiorY() {
		if (this._maiorY === undefined)
			this._pegarMenorMaiorXY();
		return this._maiorY;
	}

	//get angulo direcoes
	get pontoAngInicial() { return this.centroMassa.mais(new Ponto(10, -10)); }
	get ultimoAngDir() { return 90; }
	get ultimoAngBaixo() { return 180; }
	get ultimoAngEsq() { return 270; }

	//vertices
	get vertices()
	//primeiro vertice mais alto (menor Y) depois em sentido horario
	{
		if (this._vertices === undefined) {
			this._vertices = new Array(this.nLados);
			for (let i = 0; i < this._vertices.length; i++) {
				let vert;
				switch (i) {
					case 0: vert = this._a; break;
					case 1: vert = this._b; break;
					case 2: vert = this._c; break;
					case 3: vert = this._d; break;
					// Para novas figuras complexas: ...
				}
				this._vertices[i] = vert;
			}
		}

		return this._vertices;
	}
	_mudarXYVertice(i, ehX, novoValor) //mudar no vetor e no a,b,c,d
	{
		switch (i) {
			case 0:
				if (ehX)
					this._a.x = novoValor;
				else
					this._a.y = novoValor;
				break;
			case 1:
				if (ehX)
					this._b.x = novoValor;
				else
					this._b.y = novoValor;
				break;
			case 2:
				if (ehX)
					this._c.x = novoValor;
				else
					this._c.y = novoValor;
				break;
			case 3:
				if (ehX)
					this._d.x = novoValor;
				else
					this._d.y = novoValor;
				break;
			// Para novas figuras complexas: ...
		}

		if (this._vertices !== undefined) {
			if (ehX)
				this._vertices[i].x = novoValor;
			else
				this._vertices[i].y = novoValor;
		}
	}
	_mudarVertice(i, novoValor) //mudar no vetor e no a,b,c,d
	{
		switch (i) {
			case 0:
				this._a = novoValor;
				break;
			case 1:
				this._b = novoValor;
				break;
			case 2:
				this._c = novoValor;
				break;
			case 3:
				this._d = novoValor;
				break;
			// Para novas figuras complexas: ...
		}

		if (this._vertices !== undefined)
			this._vertices[i] = novoValor;
	}

	//triangulos
	get triangulos() {
		if (this._triangulos === undefined) {
			this._triangulos = new Array(this.nLados - 2);
			//colocar vertices na ordem certa!!
			for (let i = 0; i < this._triangulos.length; i++) {
				let triang;
				switch (i) {
					case 0: triang = new Triangulo(this._a, this._b, this._c); break;
					case 1: triang = new Triangulo(this._a, this._c, this._d); break;
					// Para novas figuras complexas: ...
				}
				this._triangulos[i] = triang;
			}
		}

		return this._triangulos;
	}

	//centro
	get centroMassa() {
		if (this._centroMassa === undefined) {
			//o centro de qualquer formaGeometricaComposta eh: a media dos vertices
			const somaVert = this.vertices.reduce((soma, vert) => soma.mais(vert)); //soma todos os vertices
			this._centroMassa = somaVert.dividido(this._vertices.length); //divide pelo numero total de vertices (faz a media)
		}
		return this._centroMassa;
	}

	//colocar pontos na ordem certa (primeiro o menor y e mais da esquerda, depois em sentido horario)
	colocarVerticesOrdemCorreta() //o(s) nulo(s) sera(ao) o(s) ultimo(s)
	//para entrar nesse metodo as variaveis {a,b,c,...} jah devem estar preenchidas
	{
		let vertices = this._organizarVertices(true);
		// colocar pontos na classe
		vertices.forEach((vert, index) => this._mudarVertice(index, vert));

		this._mudouArestasTriang();
		if (this._centroMassa !== undefined)
			delete this._centroMassa;
	}
	_organizarVertices(menorPrimeiro = true)
	// se menorPrimeiro, primeiro os mais de cima
	{
		// descobrir qual eh o vertice mais alto da esqueda (o menor)
		//e colocar os outros nesse vetor
		let infoOutrosVert = new Array(this.nLados - 1); // vetor de {vert: , angulo: "valor"}
		let primeiroPonto = null; // vertice mais de cima da esquerda
		let soma = new Ponto(0, 0); // soma dos pontos
		let qtdNaoNulos = 0;

		//vai definir se vai pegar o maior ou o menor
		let mult = menorPrimeiro ? 1 : -1;
		let tipoAngulo = menorPrimeiro ? Angulo.MAIOR_180_CIMA : Angulo.MAIOR_180_BAIXO;
		for (let i = 0; i < this.vertices.length; i++) //ao chamar this.vertices.length ele faz o vetor _vertices ser montado
		{
			if (primeiroPonto === null)
				primeiroPonto = this._vertices[i];
			else {
				if (this._vertices[i] !== undefined && this._vertices[i].compareTo(primeiroPonto) * mult < 0)
				//ps: pode ter vertices "nulos"
				{
					infoOutrosVert[i - 1] = { vert: primeiroPonto }; //vai ter .angulo tambem
					primeiroPonto = this._vertices[i];
				} else
					infoOutrosVert[i - 1] = { vert: this._vertices[i] }; //vai ter .angulo tambem
			}

			if (this._vertices[i] !== undefined) {
				soma = soma.mais(this._vertices[i]);
				qtdNaoNulos++;
			}
		}

		let pontoCentral = soma.dividido(qtdNaoNulos);
		// o ponto central vai estar dentro do poligno mesmo que alguns vertices nao tenham sido dados (sejam nulos)

		//aqui pra baixo primeiroPonto jah estah com o ponto que serah o this._a
		//e os outros pontos estao no vetor infoOutrosVert...
		// ps: todos os nulos estarao no vetor infoOutrosVert

		//EXPLICACAO: para ordenar os outros em sentido horario,
		// deve-se pegar o angulo (PrimeiroPonto-PontoCentral-VerticeAtual) de todos os
		// esses vertices e ordena-los de maneira crescente de acordo com ele

		//colocar os angulos no vetor
		infoOutrosVert.forEach(infoVert => {
			if (infoVert.vert !== undefined)
				infoVert.angulo = new Angulo(primeiroPonto, pontoCentral, infoVert.vert, tipoAngulo).valorRad;
		});

		//ordenar de maneira crescente os angulos PrimeiroPonto-PontoCentral-VerticeAtual dos vertices
		this._ordenarOutrosVert(infoOutrosVert);

		let ret = new Array(infoOutrosVert.length + 1);
		ret[0] = primeiroPonto;
		infoOutrosVert.forEach((infoVert, i) => ret[i + 1] = infoVert.vert);
		return ret;
	}
	_ordenarOutrosVert(infoOutrosVert) {
		//ordenar crescentemente e com os nulos por ultimo
		for (let lento = 0; lento < infoOutrosVert.length; lento++) {
			let oMenor = lento;
			for (let rapido = lento + 1; rapido < infoOutrosVert.length; rapido++)
				if (infoOutrosVert[rapido].angulo !== undefined && (infoOutrosVert[oMenor].angulo === undefined
					|| infoOutrosVert[rapido].angulo < infoOutrosVert[oMenor].angulo))
					//os nulos por ultimo
					oMenor = rapido;

			if (oMenor !== lento) {
				//trocar lento com oMenor
				const aux = infoOutrosVert[lento];
				infoOutrosVert[lento] = infoOutrosVert[oMenor];
				infoOutrosVert[oMenor] = aux;
			}
		}
	}
}
/*Quem der extends em FormaGeometricaComplexa tem que ter:
  -> get _triangulos()
ps: nao fiz com interface, pois nao faz muito sentido em javascript
*/

// FormaGeometricaComplexa mais simples de todas (eh a que "forma" todas as outras FormasGeometricasComplexas)
class Triangulo extends FormaGeometricaComplexa {
	//PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
	constructor(a, b, c, corImg, porcentagemImagem) {
		super(a, corImg, porcentagemImagem);

		this._b = b;
		this._c = c;
	}

	//getters basicos
	get codForma() { return Geometria.COD_TRIANGULO; }
	get nLados() { return 3; }

	//contrVertices: [0]: o mais baixo, [1] e [2] os proximos em sentido horario
	get contrVertices() {
		if (this._contrVertices === undefined)
			this._contrVertices = this._organizarVertices(false);
		return this._contrVertices;
	}

	pontoEstahDentro(p) {
		const areaTriangulo = this.area;

		const triang1 = new Triangulo(p, this._a, this._b);
		const triang2 = new Triangulo(p, this._b, this._c);
		const triang3 = new Triangulo(p, this._a, this._c);

		return triang1.area + triang2.area + triang3.area === areaTriangulo;
	}

	get area()
	//para este metodo nao interessa a ordem de {a,b,c}
	{
		if (this._area === undefined)
			this._area = Math.abs((this._a.x * (this._b.y - this._c.y) + this._b.x * (this._c.y - this._a.y)
				+ this._c.x * (this._a.y - this._b.y)) / 2);
		return this._area;
	}

	mudarTamanho(porcentagem, pontoReferenciaCentral) {
		const ret = super.mudarTamanho(porcentagem, pontoReferenciaCentral);

		if (porcentagem !== 1) {
			if (this._area !== undefined)
				//quando se multiplica todos os lados por um numero a area de uma figura fica multiplicada por esse numero ao quadrado
				this._area *= porcentagem * porcentagem;
			delete this._contrVertices;
		}

		return ret;
	}

	draw(opacidade) {
		if (this._ehCor !== undefined) //pode querer printar soh as imagens secundarias
		{
			push(); //opacidade ou fill/stroke
			if (this._ehCor) {
				//cor e opacidade
				this._colocarCores(opacidade);
				//desenhar triangulo
				triangle(this._a.x, this._a.y,
					this._b.x, this._b.y,
					this._c.x, this._c.y);
			} else {
				//opacidade
				this._colocarOpacidadeParaImg(opacidade);
				//desenhar a imagem
				this._desenharImagem();
			}
			pop(); //opacidadeImg ou fill/stroke
		}

		//imagens secundarias
		this._desenharImagensSecundarias(opacidade);
	}

	//clone
	clone(x, y) {
		let ret = new Triangulo(this._a.clone(), this._b.clone(), this._c.clone(), this._corImg, this._porcentagemImagem);
		this._procedimentosClone(ret, x, y) //coloca lugar especificado + passa imagens secundarias dessa forma para o clone + rotaciona o clone como esse this estah
		return ret;
	}
}

// FormasGeometricasComplexas formada por Triangulos
class Quadrilatero extends FormaGeometricaComplexa {
	//PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
	constructor(a, b, c, d, corImg, porcentagemImagem) {
		super(a, corImg, porcentagemImagem);

		this._b = b;
		this._c = c;
		this._d = d;
	}

	//getters basicos
	get codForma() { return Geometria.COD_QUADRILATERO; }
	get nLados() { return 4; }

	draw(opacidade) {
		if (this._ehCor !== undefined) //pode querer printar soh as imagens secundarias
		{
			push(); //opacidade ou fill/stroke
			if (this._ehCor) {
				//cor e opacidade
				this._colocarCores(opacidade);
				//desenhar o quadrilatero
				quad(this._a.x, this._a.y,
					this._b.x, this._b.y,
					this._c.x, this._c.y,
					this._d.x, this._d.y);
			} else {
				//opacidade
				this._colocarOpacidadeParaImg(opacidade);
				//desenhar a imagem
				this._desenharImagem();
			}
			pop(); //opacidadeImg ou fill/stroke
		}

		//imagens secundarias
		this._desenharImagensSecundarias(opacidade);
	}

	//clone
	clone(x, y) {
		let ret = new Quadrilatero(this._a.clone(), this._b.clone(), this._c.clone(), this._d.clone(), this._corImg, this._porcentagemImagem);
		this._procedimentosClone(ret, x, y) //coloca lugar especificado + passa imagens secundarias dessa forma para o clone + rotaciona o clone como esse this estah
		return ret;
	}
}

class Paralelogramo extends Quadrilatero {
	//PRIMEIRO VERTICE SENDO O MAIS ALTO (COM MENOS Y) E O RESTO EM SENTIDO HORARIO
	constructor(a, b, c, d, corImg, porcentagemImagem, colocarVerticesOrdemCorreta = false) {
		super(a, b, c, d, corImg, porcentagemImagem);
		if (colocarVerticesOrdemCorreta)
			this.colocarVerticesOrdemCorreta();
		//os nulos serao os ultimos

		//verificar se sao pontos de um quadrilatero
		const pontoDCerto = this._a.mais(this._c.menos(this._b));
		if (this._d === undefined) {
			this._d = pontoDCerto;

			//se o novo D estah mais pra cima e esquerda que A, D deve se tornar A, A -> B,...
			if (this._d.y < this._a.y || (this._d.y === this._a.y && this._d.x < this._a.x)) {
				const auxD = this._d;
				this._d = this._c;
				this._c = this._b;
				this._b = this._a;
				this._a = auxD;
			}
		}
		else
			if (!pontoDCerto.equals(this._d, false)) //quase exato (em javascript ha um problema de exatidao nas contas)
			{
				console.log(this._d.toString() + " !== " + pontoDCerto.toString());
				throw "Esses pontos não formam um paralelogramo!";
			}
	}

	//getters basicos
	get codForma() { return Geometria.COD_PARALELOGRAMO; }

	//clone
	clone(x, y) {
		let ret = new Paralelogramo(this._a.clone(), this._b.clone(), this._c.clone(), this._d.clone(), this._corImg, this._porcentagemImagem, false);
		// ps: colocarVerticesOrdemCorreta eh false porque mesmo se quando essa formaGeometrica era true, o construtor jah colocou os vertices jah estao na ordem certa (nao tem porque a proxima formaGeometrica fazer o mesmo)
		this._procedimentosClone(ret, x, y) //coloca lugar especificado + passa imagens secundarias dessa forma para o clone + rotaciona o clone como esse this estah
		return ret;
	}
}

//se for adicionar novas formas geometricas complexas,
// adicionar conteudo em: "// Para novas figuras complexas: ..."


//FORMAS COMPOSTAS
class FormaGeometricaComposta extends FormaGeometricaRotacionaTudo
// uma FormaGeometrica com 1 corImg porem com varias subdivisoes de formasGeometricas para a interseccao e outros metodos ficarem mais condizentes com a imagem
{
	constructor(x = 0, y = 0, formasGeometricas, corImg, porcentagemImagem)
	// (x,y) das formasGeometricas eh relativo aos parametros x e y
	{
		super(undefined, porcentagemImagem);
		//ps: tem que ser undefined porque this._formasGeometricas nao estah construido ainda entao se corImg fosse uma cor daria erro

		//formasGeometricas
		this._formasGeometricas = [];
		formasGeometricas.forEach(formaGeom =>
			this._formasGeometricas.push(formaGeom.clone(formaGeom.x + x, formaGeom.y + y)));
		// as this._formasGeometricas ficarao com valor absoluto (nao relativo ao (this._x, this._y) como passado por parametro)

		this._setarXY();

		if (corImg !== undefined)
			this.corImg = corImg;
	}

	//getters
	get codForma() { return Geometria.COD_FORMA_COMPOSTA; }
	get formasGeometricas() { return this._formasGeometricas; }

	get corImg() {
		if (this._ehCor === true)
			return this._formasGeometricas[0].corImg;
		return this._corImg;
	}
	set corImg(corImg) {
		//super
		super.corImg = corImg;

		//se for cor, colocar em todos as formasGeometricas
		if (this._ehCor === true) {
			// setar as formasGeometricas com essa cor, pois elas serao printadas
			this._formasGeometricas.forEach(formaGeom => formaGeom.corImg = corImg);

			delete this._corImg;
		}
		// se for imagem, jah colocou em super.corImg = corImg
	}

	// getters e setters de (x,y)
	_setarXY()
	// colocar os valores adequados em this._x e this._y
	{
		let menorX = null, menorY = null;
		this._formasGeometricas.forEach(formaGeom => {
			//menorX e menorY
			if (menorX == null || formaGeom.menorX < menorX)
				menorX = formaGeom.menorX;
			if (menorY == null || formaGeom.menorY < menorY)
				menorY = formaGeom.menorY;
		});
		this._x = menorX;
		this._y = menorY;
	}
	get x() { return this._x; }
	get y() { return this._y; }
	set x(x) {
		if (x === this._x) return;

		let qtdMudaX = x - this._x;
		// setar a corImg em todas as formas
		this._formasGeometricas.forEach(formaGeom => formaGeom.x += qtdMudaX);
		this._x += qtdMudaX;

		// arrumar outras variaveis que dependem de (x,y)
		if (this._maiorX !== undefined)
			this._maiorX += qtdMudaX; //nao precisa arrumar menorX, pq ele retorna this._x
		if (this._centroMassa !== undefined)
			this._centroMassa.x += qtdMudaX;
		this._mudouArestasVertices();
	}
	set y(y) {
		if (y === this._y) return;

		let qtdMudaY = y - this._y;
		// setar a corImg em todas as formas
		this._formasGeometricas.forEach(formaGeom => formaGeom.y += qtdMudaY);
		this._y += qtdMudaY;

		// arrumar outras variaveis que dependem de (x,y)
		if (this._maiorY !== undefined)
			this._maiorY += qtdMudaY; //nao precisa arrumar menorY, pq ele retorna this._ys
		if (this._centroMassa !== undefined)
			this._centroMassa.y += qtdMudaY;
		this._mudouArestasVertices();
	}

	interseccao(obj, retornarIntersectou = true)
	// se retornarIntersectou=true, retorna se estah intersectando;
	// caso contrario, retorna um vetor de elementos={indice, formaGeometrica} (o vetor tem que conter cada formaGeometrica do this que intersecta com obj)
	{
		//Otimizacao: verificar se estah intersectando como retangulo antes
		if (super.interseccao(obj) === false) {
			if (retornarIntersectou)
				return false;
			else
				return [];
		}

		if (retornarIntersectou) {
			// retorna se ha algum/some forma intersectando
			return this._formasGeometricas.some(formaGeom => Interseccao.interseccao(formaGeom, obj));
			//ps: esse codForma eh maior que todos os outros entao em Interseccao.interseccao() entre essa formaGeometrica e outra, sempre vira para a funcao interseccao dessa classe
			//porem nao necessariamente as formas dentro da FormaComposta terao codForma maior que obj
		} else {
			let infoFormasIntersecta = []; //vetor de elementos={indice, formaGeometrica} com todas formasGeometricas que intersectam com obj
			this._formasGeometricas.forEach((formaGeom, indice) => {
				if (Interseccao.interseccao(formaGeom, obj))
					infoFormasIntersecta.push({ indice: indice, formaGeometrica: formaGeom });
			});
			return infoFormasIntersecta;
		}
	}

	mudarTamanho(porcentagem) {
		if (porcentagem < 0) porcentagem = 0;

		//imagens secundarias (tem que ser antes de tudo mesmo)
		this._mudarTamanhoImgsSecundarias(porcentagem);

		const pontoReferenciaCentral = this.centroMassa;
		//ps: tem que ser antes de mudar o (x,y)

		//mudar (x,y)
		// obs: NAO "this.x" E "this.y" POIS AS FORMAS GEOMETRICAS JAH ESTAO NO LUGAR CERTO
		const qtdCresceu = this._qtdCresceuMedidasMudarTamanho(porcentagem);
		this._x -= qtdCresceu.width / 2; //eh this.menorX
		this._y -= qtdCresceu.height / 2; //eh this.menorY

		// mudarTamanho das outras formasGeometricas
		this._formasGeometricas.forEach(forma => forma.mudarTamanho(porcentagem, pontoReferenciaCentral));

		// arrumar maiorX e maiorY
		//como mudou this._x e this._y mas nao this._maiorX e this._maiorY, adiciona qtdCresceu sobre dois e nao ele todo
		if (this._maiorX !== undefined)
			this._maiorX += qtdCresceu.width / 2;
		if (this._maiorY !== undefined)
			this._maiorY += qtdCresceu.height / 2;

		//para rotacao
		this._mudarTamanhoVariaveisRotacionar(porcentagem);

		this._mudouArestasVertices();
		return this.width > 0 && this.height > 0;
	}

	//rotacao
	rotacionar(angulo, centroRotacao = this.centroMassa)
	//retorna formaGeometrica rotacionada (para funcionar para FormasGeometricasSimples tambem)
	{
		if (angulo === 0) return this; //nao tem que fazer nada

		// soh comeca a gastar a memoria dessa variavel quando usa pela primeira vez
		if (this._anguloRotacionouTotal === undefined) this._setarVariaveisRotacionar();

		//Explicacao: rotacionar todas as formasGeometricas e computar quando rotacionou (pra desenhar imagem rotacionada certa)
		this._formasGeometricas.forEach((formaGeom, i) =>
			this._formasGeometricas[i] = formaGeom.rotacionar(angulo, centroRotacao));

		this._anguloRotacionouTotal = Angulo.entrePIeMenosPI(this._anguloRotacionouTotal + angulo);
		// deixar this._anguloRotacionouTotal entre -PI e PI

		//atualizar atributos que mudaram:
		//(x,y)
		this._setarXY();
		//maiorX e maiorY
		this._mudouMaiorXY();
		//arestas e vertices
		this._mudouArestasVertices();
		//centroMassa (se nao rotacionou nesse eixo)
		if (this._centroMassa !== undefined && !this._centroMassa.equals(centroRotacao))
			// se rotacionou em outro eixo senao o centroMassa, centroMassa mudou
			delete this._centroMassa;

		// pra ficar igual FormaGeometricaSimples
		return this;
	}

	get centroMassa() {
		if (this._centroMassa === undefined) {
			let nVertices = 0;
			const somaVertices = this._formasGeometricas.reduce((soma, formaGeom) => {
				nVertices += formaGeom.nLados;
				return soma.mais(formaGeom.centroMassa.multiplicado(formaGeom.nLados));
			}, new Ponto(0, 0));
			this._centroMassa = somaVertices.dividido(nVertices);
		}
		return this._centroMassa;
	}

	_mudouMaiorXY() {
		delete this._maiorX;
		delete this._maiorY;
	}
	_setarMaiorXY()
	// colocar os valores adequados em this._maiorX e this._maiorY (faz para os dois simultaneamente)
	{
		this._formasGeometricas.forEach(formaGeom => {
			if (this._maiorX === undefined || this._maiorY === undefined)
			// se eh a primeira execucao
			//ps: coloquei as duas condicoes porque se, por alguma razao, um dos dois for deletado e o outro nao, esse metodo continuara funcionando
			{
				this._maiorX = formaGeom.maiorX;
				this._maiorY = formaGeom.maiorY;
			}
			else {
				//testar qual eh maior: o this._maior ou o formaGeom.maior
				if (formaGeom.maiorX > this._maiorX)
					this._maiorX = formaGeom.maiorX;
				if (formaGeom.maiorY > this._maiorY)
					this._maiorY = formaGeom.maiorY;
			}
		});
	}
	get menorX() { return this._x; }
	get menorY() { return this._y; }
	get maiorX() {
		if (this._maiorX === undefined)
			this._setarMaiorXY();
		return this._maiorX;
	}
	get maiorY() {
		if (this._maiorY === undefined)
			this._setarMaiorXY();
		return this._maiorY;
	}

	//desenho
	draw(opacidade) {
		if (this._ehCor !== undefined) //pode querer printar soh as imagens secundarias
		{
			// se corImg for cor, desenhar todas as formas, senao desenhar apenas a imagem
			if (this._ehCor)
				this._formasGeometricas.forEach(formaGeom => formaGeom.draw(opacidade));
			else {
				push(); //opacidade

				//opacidade
				this._colocarOpacidadeParaImg(opacidade);
				//desenhar a imagem
				this._desenharImagem();

				pop(); //opacidadeImg ou fill/stroke
			}
		}

		//imagens secundarias
		this._desenharImagensSecundarias(opacidade);

		//AQUI
		if (testando)
			this._formasGeometricas.forEach(formaGeom => {
				formaGeom.corImg = { fill: "green" };
				formaGeom.draw(opacidade);
			});
	}

	clone(x, y) {
		// o parametro das formasGeometricas eh relativo ao parametro x e y (e this._formasGeometricas tem o x e y absoluto)
		let formasGeometricas = this._formasGeometricas.map(formaGeom =>
			formaGeom.clone(formaGeom.x - this._x, formaGeom.y - this._y));

		let ret = new FormaGeometricaComposta(this._x, this._y, formasGeometricas, this.corImg, this._porcentagemImagem);
		this._procedimentosClone(ret, x, y); //coloca lugar especificado + passa imagens secundarias dessa forma para o clone
		return ret;
	}

	//QUANDO FOR CONSIDERAR THIS COMO UM RETANGULO:
	get nLados() { return 4; }
	_mudouArestasVertices() {
		delete this._vertices;
		delete this._arestas;
	}
	get vertices() {
		if (this._vertices === undefined) {
			this._vertices = new Array(4);
			this._vertices[0] = new Ponto(this._x, this._y);
			this._vertices[1] = new Ponto(this._x + this.width, this._y);
			this._vertices[2] = new Ponto(this._x + this.width, this._y + this.height);
			this._vertices[3] = new Ponto(this._x, this._y + this.height);
		}

		return this._vertices;
	}

	// angulo
	get pontoAngInicial() { return this.vertices[1]; }
	get ultimoAngDir() {
		if (this._ultimoAngDir === undefined)
			this._ultimoAngDir = new Angulo(this.pontoAngInicial, this.centroMassa, this.vertices[2],
				Angulo.MAIOR_180_CIMA).valorGraus;
		return this._ultimoAngDir;
	}
	get ultimoAngBaixo() { return 180; }
	get ultimoAngEsq() { return this.ultimoAngDir + 180; }
}
