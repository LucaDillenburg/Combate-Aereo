//Novo metodo RANDOM de um numero a outro
Math.prototype.myrandom = function (min, max)
//inclusive min e exclusive max
{
  return Math.random() * (max - min) + min;
};


//Probabilidade
class Probabilidade
{
  static chance(num, den) //retorna true ou false, de uma chance de num/den
  {
    for(let i = 0; i<num; i++)
      if (Math.myrandom(0,den) == 0)
        return true;
    return false;
  }
}
