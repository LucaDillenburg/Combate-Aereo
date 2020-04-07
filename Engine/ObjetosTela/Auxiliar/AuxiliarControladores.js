class AuxControladores {
	//para Adicionar Objetos:
	//rotacionar
	static alteracoesRotacionarFormaGeometrica(infoObj, alteracoesRotacionar)
	// alteracoesRotacionar: {direcaoAnguloAponta, ehAngulo, setRotacao=true}
	//a nao ser que setRotacao=false, vai fazer forma.setRotacao(). caso contrario, forma.rotacionar
	{
		// se nao estah pedindo pra mudar nada
		if (alteracoesRotacionar === undefined || alteracoesRotacionar.ehAngulo === undefined)
			return;

		let anguloRotacaoFinal;
		if (alteracoesRotacionar.ehAngulo === true)
			anguloRotacaoFinal = alteracoesRotacionar.direcaoAnguloAponta;
		else
			switch (alteracoesRotacionar.direcaoAnguloAponta)
			// cima, baixo, direita, esquerda
			{
				case Direcao.Cima: anguloRotacaoFinal = 0; break; //0
				case Direcao.Baixo: anguloRotacaoFinal = PI; break; //180
				case Direcao.Direita: anguloRotacaoFinal = PI / 2; break; //90
				case Direcao.Esquerda: anguloRotacaoFinal = -PI / 2; break; //-90
			}

		if (alteracoesRotacionar.setRotacao === false)
			infoObj.formaGeometrica = infoObj.formaGeometrica.rotacionar(anguloRotacaoFinal);
		else
			infoObj.formaGeometrica = infoObj.formaGeometrica.setRotacao(anguloRotacaoFinal);
	}

	//aparecer
	static infoObjAparecendoCorreto(infoObjAparecendo, infoObjAparecendoPadrao) {
		if (infoObjAparecendo === undefined)
			infoObjAparecendo = infoObjAparecendoPadrao;
		else
			AuxiliarInfo.mergeInfoNovoComPadrao(infoObjAparecendo, infoObjAparecendoPadrao);
		return infoObjAparecendo;
	}
}
