//Novo metodo RANDOM de um numero a outro
Math.myrandom = function (min, max)
//inclusive min e exclusive max
{
  return Math.random() * (max - min) + min;
};
//PS: Math isn't a constructor, so it doesn't have prototype property. Instead, just add your method to Math itself as an own property.


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
