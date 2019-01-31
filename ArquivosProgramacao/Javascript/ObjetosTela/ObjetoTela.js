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
  // pontoInicial pode ser null se deseja-se ficar com a formaGeometrica como estava
  {
    if (pontoInicial !== null)
    {
      // em Y
      let x;
      switch (pontoInicial.posicaoX)
      {
        // case PosicaoX.ParedeEsquerda: x = 0; break; (jah eh zero)
        case PosicaoX.Meio: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarNoMeio; break;
        case PosicaoX.ParedeDireita: x = infoObjetoTelaSimples.formaGeometrica.xParaEstarParedeDireita; break;
        default: x = 0;
      }
      if (pontoInicial.x !== undefined)
        x += pontoInicial.x;

      // em X
      let y;
      switch (pontoInicial.posicaoY)
      {
        // case PosicaoY.ParedeCima: y = 0; break; (jah eh zero)
        case PosicaoY.Meio: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarNoMeio; break;
        case PosicaoY.ParedeBaixo: y = infoObjetoTelaSimples.formaGeometrica.yParaEstarParedeBaixo; break;
        default: y = 0;
      }
      if (pontoInicial.y !== undefined)
        y += pontoInicial.y;

      this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone(x,y);
    }else
      this._formaGeometrica = infoObjetoTelaSimples.formaGeometrica.clone();
  }

  get formaGeometrica()
  { return this._formaGeometrica; }

  draw()
  { this._formaGeometrica.draw(); }
}

//normal
class InfoObjetoTela extends InfoObjetoTelaSimples
{
  constructor(formaGeometrica, infoImgMorto)
  {
    super(formaGeometrica);
    this.infoImgMorto = infoImgMorto;
  }
}
class InfoImgMorto
{
  constructor(vetorImg, qtdVezesPrintarCadaImg=1, infoAdicionarImgSec)
  //infoAdicionarImgSec: undefined=>substituir a imagem (nao adicionar img secundaria); caso contrario: {porcWidth, porcLadosCentroImg}
  {
    this.vetorImg = vetorImg;
    this.infoAdicionarImgSec = infoAdicionarImgSec;
    this.qtdVezesPrintarCadaImg = qtdVezesPrintarCadaImg;
  }

  clone()
  { return new InfoImgMorto(cloneVetor(this.vetorImg), this.qtdVezesPrintarCadaImg, this.infoAdicionarImgSec); }
}
class ObjetoTela extends ObjetoTelaSimples //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTela)
  //recebe apenas uma classe informacao como parametro
  {
    super(pontoInicial, infoObjetoTela);
    this._vivo = true;

    //imagens morto
    this._vetorImgsMorto = infoObjetoTela.infoImgMorto.vetorImg;
    this._infoAdicionarImgSec = infoObjetoTela.infoImgMorto.infoAdicionarImgSec;
    this._qtdVezesPrintarCadaImgMorto = infoObjetoTela.infoImgMorto.qtdVezesPrintarCadaImg;
  }

  morreu()
  {
    this._vivo = false;

    //mudar imagem
    this._indexImgMorto = 0;
    this._colocarImgMortoAtual();
  }
  _colocarImgMortoAtual()
  {
    this._qtdVezesPrintouImgMortoAtual = 0;

    //muda a imagem ou cor para a de morto
    const img = this._vetorImgsMorto[this._indexImgMorto];
    if (this._infoAdicionarImgSec===undefined)
      this._formaGeometrica.corImg = img;
    else
      this._formaGeometrica.adicionarImagemSecundaria(undefined/*para soh dar push no vetor de imgs secundarias*/,
        img, this._infoAdicionarImgSec.porcWidth, this._infoAdicionarImgSec.porcLadosCentroImg);
  }

  draw()
  //retorna se deve retirar objeto do vetor depois de printa-lo
  {
    super.draw();

    //se jah estah na ultima posicao, printa a ultima vez e entao retorna true
    let ret = false;
    if (!this._vivo && !ret) //se jah morreu e ainda nao vai remover objeto, colocar na proxima imagem morto
    {
      this._qtdVezesPrintouImgMortoAtual++;

      if (this._qtdVezesPrintouImgMortoAtual === this._qtdVezesPrintarCadaImgMorto)
      {
        if (this._indexImgMorto===this._vetorImgsMorto.length-1)
        //se jah printou todas as imagens do vetor quantas vezes precisa
          ret = true;
        else
        {
          this._indexImgMorto++;
          this._colocarImgMortoAtual();
        }
      }
    }
    return ret;
  }
}
