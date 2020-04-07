//PARA ADICIONAR OBJETOS DIF
class AuxiliarInfo {
	static mergeInfoNovoComPadrao(infoNovo, infoPadrao) {
		for (let chave in infoPadrao)
			if (typeof infoPadrao[chave] !== 'function' && infoNovo[chave] === undefined)
				infoNovo[chave] = infoPadrao[chave];
	}
}