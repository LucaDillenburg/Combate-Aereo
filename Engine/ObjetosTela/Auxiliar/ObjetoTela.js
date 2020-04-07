//Explicacao:
//class Info: tem atributos publicos (pois em todos podem fazer get e set sem verificacoes)
//class ObjetoTela: recebe apenas uma classe Info por parametro e adiciona em seus proprios atributos

//simples
class InfoObjetoTelaSimples {
	constructor(formaGeometrica, infoImgVivo) {
		this.formaGeometrica = formaGeometrica;
		this.infoImgVivo = infoImgVivo;
	}
}
class InfoImg {
	constructor(vetorImg, qtdVezesPrintarCadaImg = 1) {
		this.vetorImg = vetorImg;
		this.qtdVezesPrintarCadaImg = qtdVezesPrintarCadaImg;
	}

	clone() { return new InfoImg(Clone.cloneVetor(this.vetorImg), this.qtdVezesPrintarCadaImg); }
}
class InfoImgVivo extends InfoImg {
	constructor(vetorImg, qtdVezesPrintarCadaImg, indexInicial = 0) {
		super(vetorImg, qtdVezesPrintarCadaImg);
		this.indexInicial = indexInicial;
	}

	clone() { return new InfoImgVivo(Clone.cloneVetor(this.vetorImg), this.qtdVezesPrintarCadaImg, this.indexInicial); }
}
class ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
	constructor(pontoInicial, infoObjetoTelaSimples)
	// pontoInicial pode ser null se deseja-se ficar com a formaGeometrica como estava
	{
		if (infoObjetoTelaSimples !== undefined)
			//pode ser que seja undefined (em ObjPocaoPers por exemplo)
			this._constructor(pontoInicial, infoObjetoTelaSimples);
	}
	_constructor(pontoInicial, infoObjetoTelaSimples) {
		//criar clonar formaGeometrica de acordo com o ponto inicial
		if (pontoInicial !== null) {
			// em Y
			let x;
			switch (pontoInicial.posicaoX) {
				// case PosicaoX.ParedeEsquerda: x = 0; break; (jah eh zero)
				case PosicaoX.Meio: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarNoMeio; break;
				case PosicaoX.ParedeDireita: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarParedeDireita; break;
				default: x = 0;
			}
			if (pontoInicial.x !== undefined)
				x += pontoInicial.x;

			// em X
			let y;
			switch (pontoInicial.posicaoY) {
				// case PosicaoY.ParedeCima: y = 0; break; (jah eh zero)
				case PosicaoY.Meio: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarNoMeio; break;
				case PosicaoY.ParedeBaixo: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarParedeBaixo; break;
				default: y = 0;
			}
			if (pontoInicial.y !== undefined)
				y += pontoInicial.y;

			this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(x, y);
		} else
			this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone();

		//imagens vivo
		if (infoObjetoTelaSimples.infoImgVivo.vetorImg !== undefined) {
			this._vetorImgsVivo = infoObjetoTelaSimples.infoImgVivo.vetorImg;
			this._qtdVezesPrintarCadaImgVivo = infoObjetoTelaSimples.infoImgVivo.qtdVezesPrintarCadaImg;
			this._indexImgVivo = infoObjetoTelaSimples.infoImgVivo.indexInicial;
			this._qtdVezesPrintouImgVivo = 0;
			this._colocarImgVivoAtual();
		}
	}

	//getter
	get formaGeometrica() { return this._formaGeometrica; }

	//tratamento das imagens vivo (sprite sheet)
	_proximaImgVivo() {
		//mudar index (como vetor circular)
		this._indexImgVivo = (this._indexImgVivo + 1) % this._vetorImgsVivo.length;
		//mudar img em formaGeometrica
		this._colocarImgVivoAtual();
	}
	_colocarImgVivoAtual() {
		//mudar corImg da formaGeometrica
		this._formaGeometrica.corImg = this._vetorImgsVivo[this._indexImgVivo];
	}

	draw(opacidade) {
		if (this._vetorImgsVivo !== undefined && this._vetorImgsVivo.length > 1)
		//se tem mais de uma imagem no vetor de imagens vivo, vai para a proxima
		{
			this._qtdVezesPrintouImgVivo++;
			if (this._qtdVezesPrintouImgVivo >= this._qtdVezesPrintarCadaImgVivo) {
				this._proximaImgVivo();
				this._qtdVezesPrintouImgVivo = 0;
			}
		}

		this._formaGeometrica.draw(opacidade);
	}
}

//normal
class InfoObjetoTela extends InfoObjetoTelaSimples {
	constructor(formaGeometrica, infoImgVivo, infoImgMorto) {
		super(formaGeometrica, infoImgVivo);
		this.infoImgMorto = infoImgMorto;
	}
}
class InfoImgMorto extends InfoImg {
	constructor(vetorImg, qtdVezesPrintarCadaImg, infoAdicionarImgSec)
	//infoAdicionarImgSec: undefined=>substituir a imagem (nao adicionar img secundaria); caso contrario: {porcWidth, porcLadosCentroImg}
	{
		super(vetorImg, qtdVezesPrintarCadaImg);
		this.infoAdicionarImgSec = infoAdicionarImgSec;
	}

	clone() { return new InfoImgMorto(Clone.cloneVetor(this.vetorImg), this.qtdVezesPrintarCadaImg, this.infoAdicionarImgSec); }
}
class ObjetoTela extends ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
	constructor(pontoInicial, infoObjetoTela)
	//recebe apenas uma classe informacao como parametro
	{
		super(pontoInicial, infoObjetoTela);
		this._vivo = true;

		//imagens morto
		this._vetorImgsMorto = infoObjetoTela.infoImgMorto.vetorImg;
		this._infoAdicionarImgSec = infoObjetoTela.infoImgMorto.infoAdicionarImgSec;
		this._qtdVezesPrintarCadaImgMorto = infoObjetoTela.infoImgMorto.qtdVezesPrintarCadaImg;
	}

	morreu() {
		this._vivo = false;

		//mudar imagem
		this._indexImgMorto = 0;
		this._colocarImgMortoAtual();
	}
	_colocarImgMortoAtual() {
		this._qtdVezesPrintouImgMortoAtual = 0;

		//muda a imagem ou cor para a de morto
		const img = this._vetorImgsMorto[this._indexImgMorto];
		if (this._infoAdicionarImgSec === undefined)
			this._formaGeometrica.corImg = img;
		else
			this._formaGeometrica.adicionarImagemSecundaria(undefined/*para soh dar push no vetor de imgs secundarias*/,
				img, this._infoAdicionarImgSec.porcWidth, this._infoAdicionarImgSec.porcLadosCentroImg);
	}

	draw(opacidade)
	//retorna se deve retirar objeto do vetor depois de printa-lo
	{
		super.draw(opacidade);

		//se jah estah na ultima posicao, printa a ultima vez e entao retorna true
		let ret = false;
		if (!this._vivo) //se jah morreu e ainda nao vai remover objeto, colocar na proxima imagem morto
		{
			this._qtdVezesPrintouImgMortoAtual++;

			if (this._qtdVezesPrintouImgMortoAtual === this._qtdVezesPrintarCadaImgMorto) {
				if (this._indexImgMorto === this._vetorImgsMorto.length - 1)
					//se jah printou todas as imagens do vetor quantas vezes precisa
					ret = true;
				else {
					this._indexImgMorto++;
					this._colocarImgMortoAtual();
				}
			}
		}
		return ret;
	}
}
