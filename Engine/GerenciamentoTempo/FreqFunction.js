//FUNCAO DEPOIS DE DETERMINADA CONTAGEM
class FreqFunction //se for soh uma vez ou varias (se for soh uma vez, deixar classe como null depois que ele fizer a funcao)
{
	constructor(freq, indexAtual = 0, funcao)
	// se freq for 1 vai fazer todas as vezes
	//se indexAtual for undefined, serah zero; e se for true, sera o ultimo
	{
		this._funcao = funcao;
		this._freq = freq;

		//soh pra ver se nao eh zero...
		if (indexAtual === true)
			this._count = freq - 1;
		else
			this._count = indexAtual - 1;
		this.contar();
	}

	get freq() { return this._freq; }
	set freq(novaFreq) { this._freq = novaFreq; }

	get count() { return this._count; }
	zerarContador() { this._count = 0; }
	setContadorUltimaEtapa() { this._count = this._freq - 1; /*a proxima vez que contar, ele vai executar a funcao*/ }

	contar() {
		this._count++;
		if (this._count >= this._freq) {
			if (this._funcao !== undefined)
				this._funcao();
			this._count = 0;
			return true; // iria chamar funcao
		} else
			return false; // nao iria chamar funcao
	}

	vaiExecutarFuncaoProximaVez()
	// retorna se da proxima vez que contar vai executar a funcao
	{ return this._count + 1 >= this._freq; }

	//POCAO
	mudarTempo(porcentagem) {
		//inversamente proporcional ao tempo
		this._freq /= porcentagem;
		this._count /= porcentagem;
	}
}