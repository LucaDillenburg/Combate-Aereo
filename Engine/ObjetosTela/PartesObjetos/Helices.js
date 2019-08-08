const qtdRotateHelicePadrao = PI/7;
class Helices
{
  constructor(qtdHelices, qtdsRotateDifHelices=[])
  {
    this._qtdHelices = qtdHelices;
    this._qtdsRotateDifHelices = qtdsRotateDifHelices;

    //para mudarTempo
    this._porcVelocidadeTempo = 1;
  }

  //metodos importantes
  girar(formaGeometrica)
  {
    //rotacionar as helices se tiver
    for (let i = 0; i<this._qtdHelices; i++)
    // as helices sempre vao ficar nas primeiras posicoes de ImagemSecundaria
    {
      let qtdRotateHeliceAtual;
      if (this._qtdsRotateDifHelices[i] === undefined)
        qtdRotateHeliceAtual = qtdRotateHelicePadrao; //padrao
      else
        qtdRotateHeliceAtual = this._qtdsRotateDifHelices[i]; //diferente
      formaGeometrica.rotacionarImagemSecundaria("helice"+i, qtdRotateHeliceAtual * this._porcVelocidadeTempo/*para mudarTempo*/);
    }
  }

  //outros
  mudarTempo(porcentagem)
  { this._porcVelocidadeTempo *= porcentagem; }
}
