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
{
  if (vetor === undefined) return undefined;

  let ret = [];
  vetor.forEach(function(valor, index) { ret[index] = valor; }); //copiar
  return ret;
}

function cloneVetorComClone(vetor)
{
  if (vetor === undefined) return undefined;

  let ret = [];
  vetor.forEach(function(valor, index) { ret[index] = valor.clone(); }); //copiar
  return ret;
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
