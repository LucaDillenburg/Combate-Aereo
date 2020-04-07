//Novo metodo RANDOM de um numero a outro
Math.myrandom = function (min, max, retornarInteiro = true)
//inclusive min e exclusive max
{
	if (min + 1 === max)
		//se eh Math.myrandom(x, x+1), vai retornar x
		return min;

	const randomFloat = Math.random() * (max - min) + min;
	if (retornarInteiro)
		return Math.floor(randomFloat);
	else
		return randomFloat;
};
Math.randomComDesvio = function (valor, desvio) {
	return Math.myrandom(Math.max(valor - desvio, 0), valor + desvio);
	//para ser sempre maior que zero (valor e desvio nunca serao negativos entao nao precisa fazer isso no segundo parametro)
}
//PS: Math isn't a constructor, so it doesn't have prototype property. Instead, just add your method to Math itself as an own property.