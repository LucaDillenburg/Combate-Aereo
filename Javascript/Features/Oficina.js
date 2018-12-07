const porcentagemTamPersMinimoTamOficina = 125;
class Oficina
{
  constructor(level)
  {
    //eh quadrado que fica no meio
    this._formaGeometrica = new Quadrado(null,null, Oficina.tamanhoOficinaPorLv(level), {fill: color("green"), stroke: color("green")});
    this._formaGeometrica.colocarNoMeioX();
    this._formaGeometrica.colocarNoMeioY();

    //jah verifica pois o personagem pode nao andar nada logo na primeira vez
    this.verificarEstahConsertando();
  }

  verificarEstahConsertando() { this._persEstahConsertando = this._formaGeometrica.contem(ConjuntoObjetosTela.pers.formaGeometrica); /* se tiver inteiramente dentro */ }
  ganharVidaSeConsertando(level)
  {
    if (this._persEstahConsertando)
      ConjuntoObjetosTela.pers.mudarVida(Oficina.qtdGanhaVidaEmOficinaLevel(level));
  }

  static tamanhoOficinaPorLv(level)
  {
    let porcentagemTamPers = 500 - level*25;
    if (porcentagemTamPers < porcentagemTamPersMinimoTamOficina)
      porcentagemTamPers = porcentagemTamPersMinimoTamOficina;
    return ConjuntoObjetosTela.pers.formaGeometrica.width*porcentagemTamPers/100;
  }
  static qtdGanhaVidaEmOficinaLevel(level)
  { return level*0.015 + 0.1; }

  draw()
  { this._formaGeometrica.draw(); }
}
