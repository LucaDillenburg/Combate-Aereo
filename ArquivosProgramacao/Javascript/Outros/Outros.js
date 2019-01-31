//Novo metodo RANDOM de um numero a outro
Math.myrandom = function (min, max)
//inclusive min e exclusive max
{
  if (min + 1 === max)
  //se eh Math.myrandom(x, x+1), vai retornar x
    return min;

  return Math.floor(Math.random() * (max - min) + min);
};
Math.randomComDesvio = function(valor, desvio)
{
  return Math.myrandom(Math.max(valor-desvio, 0), valor+desvio);
                        //para ser sempre maior que zero (valor e desvio nunca serao negativos entao nao precisa fazer isso no segundo parametro)
}
//PS: Math isn't a constructor, so it doesn't have prototype property. Instead, just add your method to Math itself as an own property.


//clones prontos
function cloneVetor(vetor)
//acessa soh os indexes que sao numeros
{
  if (vetor === undefined) return undefined;
  return vetor.map(elem => elem);
}
function cloneVetorComClone(vetor)
//acessa soh os indexes que sao numeros
{
  if (vetor === undefined) return undefined;
  return vetor.map(elem => elem.clone());
}
function cloneDicionario(vetor)
//acessa todos os indexes (numeros, palavras,...). ps: soh metodos que nao
{
  if (vetor === undefined) return undefined;

  let novoVet = [];
  for (let chave in vetor)
    if (typeof vetor[chave] !== 'function')
      novoVet[chave] = vetor[chave];
  return novoVet;
}

//Probabilidade
class Probabilidade
{
  static chance(num, den) //retorna true ou false, de uma chance de num/den
  {
    for(let i = 0; i<num; i++)
      if (Math.myrandom(0,den) === 0)
        return true;
    return false;
  }

  static porcentagemVoltarNormal(porcentagemMudou)
  { return 1/porcentagemMudou; }
}
