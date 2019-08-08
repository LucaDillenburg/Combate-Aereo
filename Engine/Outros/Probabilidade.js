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
