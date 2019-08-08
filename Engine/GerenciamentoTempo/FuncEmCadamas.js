//FUNCAO EM CAMADAS (lembra Quiasmo)
class FuncEmCamadas
{
  constructor(funcao)
  {
    this._funcao = funcao;
    this._count = 0;
  }

  subirCamada()
  { this._count++; }

  descerCamada()
  {
    this._count--;
    if (this._count === 0 && this._funcao !== undefined)
      this._funcao();
    return this._count===0;
  }
}
