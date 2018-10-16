class ControladorTiros
{
  constructor(tiroPadrao, ehPersPrinc)
  {
    //tiro
    this._tiroPadrao = tiroPadrao;
    this._ehPersPrinc = ehPersPrinc;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os tiros no comeco e ir tirando os que jah sairam da tela do final
    this._tiros = new ListaDuplamenteLigada();
  }

  //TIROS
  //novo tiro
  adicionarTiro(x, y, qtdAndarX, qtdAndarY, corMorto, mortalidade, formaGeomTiro)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (qtdAndarX == null)
      qtdAndarX = this._tiroPadrao.qtdAndarX;
    if (qtdAndarY == null)
      qtdAndarY = this._tiroPadrao.qtdAndarY;
    if (corMorto == null)
      corMorto = this._tiroPadrao.corMorto;
    if (mortalidade == null)
      mortalidade = this._tiroPadrao.mortalidade;
    if (formaGeomTiro == null)
      formaGeomTiro = this._tiroPadrao.formaGeomTiro;

    formaGeomTiro.x = x;
    formaGeomTiro.y = y;

    this._adicionarTiro(new Tiro(formaGeomTiro, corMorto, qtdAndarX, qtdAndarY, this._ehPersPrinc, mortalidade));
  }
  adicionarTiroDif(x, y, tiro)
  {
		if (tiro == null)
      tiro = this._tiroPadrao;

    let novoTiro = tiro.clone();
    novoTiro.ehDoPers = this._ehPersPrinc;
    novoTiro.formaGeometrica.x = x;
    novoTiro.formaGeometrica.y = y;
    this._adicionarTiro(novoTiro);
  }
  _adicionarTiro(novoTiro)
  {
    //criar tiro e adicionar ao comeco da lista
		this._tiros.inserirNoComeco(novoTiro);
  }

  //mover tiros
  andarTiros(pers, obstaculos, inimigos)
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
      if (this._tiros.atual.morto)
      // se ele estava morto e soh nao foi tirado da lista porque colidiu e queria-se mostrar a colisao, agora remove (pois jah mostrou)
        this._tiros.removerAtual();
      else
      {
        //retorna o estado do tiro depois dele andar: SAIU_TELA, ESTAH_VIVO ou COLIDIU
        let estadoTiro = this._tiros.atual.andar(pers, obstaculos, inimigos);
        if (estadoTiro == Tiro.SAIU_TELA)
  				this._tiros.removerAtual();
        else
        if (estadoTiro == Tiro.COLIDIU)
          this._tiros.atual.morreu();
      }

      this._tiros.andarAtual();
		}
  }

  //quando personagem com vida  ou obstaculo se mover
  procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY)
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
      if (!this._tiros.atual.morto && Interseccao.vaiTerInterseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudaY))
      {
        //se objeto tela tem vida
        if (objTelaColide instanceof PersComTiros || objTelaColide instanceof ObstaculoComVida)
          this_tiros.atual.tirarVidaObjComVida(objTelaColide);
        this._tiros.atual.morreu();
      }

      this._tiros.andarAtual();
		}
  }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
	{
		this._tiros.colocarAtualComeco();
		while (!this._tiros.atualEhNulo)
    {
      this._tiros.atual.draw();
      this._tiros.andarAtual();
    }
	}
}
