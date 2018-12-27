//Explicacao:
  //class Info: tem atributos publicos (pois em todos podem fazer get e set sem verificacoes)
  //class ObjetoTela: recebe apenas uma classe Info por parametro e adiciona em seus proprios atributos

//simples
class InfoObjetoTelaSimples
{
  constructor(formaGeometrica)
  { this.formaGeometrica = formaGeometrica; }
}
class ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTelaSimples)
  {
    // em Y
    let x = 0;
    switch (pontoInicial.posicaoX)
    {
      // case PosicaoX.ParedeEsquerda: x = 0; break; (jah eh zero)
      case PosicaoX.Meio: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarNoMeio; break;
      case PosicaoX.ParedeDireita: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarParedeDireita; break;
    }
    if (pontoInicial.x !== undefined)
      x += pontoInicial.x;

    // em X
    let y = 0;
    switch (pontoInicial.posicaoY)
    {
      // case PosicaoY.ParedeCima: y = 0; break; (jah eh zero)
      case PosicaoY.Meio: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarNoMeio; break;
      case PosicaoY.ParedeBaixo: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarParedeBaixo; break;
    }
    if (pontoInicial.y !== undefined)
      y += pontoInicial.y;

    this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(x,y);
  }

  get formaGeometrica()
  { return this._formaGeometrica; }
  colocarNoMeioX()
  { this._formaGeometrica.colocarNoMeioX(); }

  draw()
  { this._formaGeometrica.draw(); }
}

//normal
class InfoObjetoTela extends InfoObjetoTelaSimples
{
  constructor(formaGeometrica, corImgMorto)
  {
    super(formaGeometrica);
    this.corImgMorto = corImgMorto;
  }
}
class ObjetoTela extends ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTela)
  //recebe apenas uma classe informacao como parametro
  {
    super(pontoInicial, infoObjetoTela);
    this._corImgMorto = infoObjetoTela.corImgMorto;
    this._vivo = true;
  }

  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }
}

// visual: fazer inimigos e obstaculos irem aparecendo aos poucos e ficando menos transparentes
const tempoObjetoAparecerAntesIniciarLv = 4000;
//inimigo
const tempoInimAparecerDuranteLv = 750;
//obstaculo
const tempoObstAparecerDuranteLv = 120;
//pocao
const tempoPocaoAparecerDuranteLv = 120;
class ObjetoTelaAparecendo extends ObjetoTelaSimples
{
  constructor(pontoInicial, infoObjetoTela, callback)
  {
    super(pontoInicial, infoObjetoTela);

    //pegar tempo objeto vai ficar aparecendo
    let tempoObjetosAparec;
    if (controladorJogo.criandoLevel)
    // se estah criando o level (nao estah no meio do level)
      tempoObjetosAparec = tempoObjetoAparecerAntesIniciarLv;
    else
    {
      //pode ser inimigo, obstaculo, tiro ou pocao
      if (infoObjetoTela instanceof InfoObstaculo)
        tempoObjetosAparec = tempoObstAparecerDuranteLv;
      else
      if (infoObjetoTela instanceof InfoInimigo)
        tempoObjetosAparec = tempoInimAparecerDuranteLv;
      else
        tempoObjetosAparec = tempoPocaoAparecerDuranteLv; //pocao tem que ser o ultimo pois nao tem um InfoPocao
    }

    //setar variaveis vitais
    this._cadaPorcentagem = 1/(tempoObjetosAparec/frameRatePadrao);
    this._porcentagemAtual = this._cadaPorcentagem;
    this._mudarTamanhoFormaGeom(true);

    if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do novo objeto aparecendo)
      this.mudarTempo(porcentagemDeixarTempoLento);

    //callback
    this._callback = callback;
  }

  draw()
  {
    //desenha
    this._formaGeometrica.draw(this._porcentagemAtual); //opacidade

    //deixa forma geometrica maior e aumenta a porcentagemAtual
    this._porcentagemAtual += this._cadaPorcentagem;
    if (this._porcentagemAtual >= 1)
      this._callback(); //chama funcao callback quando jah tiver aumentado
    else
      this._mudarTamanhoFormaGeom(false);
  }
  _mudarTamanhoFormaGeom(primeiraVez)
  {
    if (this._formaGeometrica instanceof Quadrado)
      this._formaGeometrica.setTamanhoLadoPorcentagem(primeiraVez?this._porcentagemAtual:this._getPorcentagemAumentar());
    else
    {
      const porcentagemAumentar = this._getPorcentagemAumentar();
      this._formaGeometrica.setWidthPorcentagem(primeiraVez?this._porcentagemAtual:porcentagemAumentar);
      this._formaGeometrica.setHeightPorcentagem(primeiraVez?this._porcentagemAtual:porcentagemAumentar);
    }
  }
  _getPorcentagemAumentar()
  {
    // se nao for primeira vez:
    // 100% --- porcentagemAtual - cadaPorcentagem
    //   x  --- porcentagemAtual
    // .: x = 100*porcentagemAtual/(porcentagemAtual - cadaPorcentagem) %
    return this._porcentagemAtual/(this._porcentagemAtual - this._cadaPorcentagem);
  }

  //POCAO
  mudarTempo(porcentagem)
  { this._cadaPorcentagem *= porcentagem; }
}
