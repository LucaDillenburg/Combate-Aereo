//clones prontos
class Clone {
	static cloneVetor(vetor)
	//acessa soh os indexes que sao numeros
	{
		if (vetor === undefined) return undefined;
		return vetor.map(elem => elem);
	}

	static cloneVetorCadaElemento(vetor)
	//acessa soh os indexes que sao numeros
	{
		if (vetor === undefined) return undefined;
		return vetor.map(elem => elem.clone());
	}

	static cloneDicionario(vetor)
	//acessa todos os indexes (numeros, palavras,...). ps: soh metodos que nao
	{
		if (vetor === undefined) return undefined;

		let novoVet = [];
		for (let chave in vetor)
			if (typeof vetor[chave] !== 'function')
				novoVet[chave] = vetor[chave];
		return novoVet;
	}
}
