//OBJETO TELA COM TIROS
class InfoObjComTiros extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, vida, infoTiroPadrao, tiroDuplo=false, distanciaTiroVert)
  {
    super(formaGeometrica, corImgMorto);
    this.vida = vida;
    this.vidaMAX = vida;
    this.infoTiroPadrao = infoTiroPadrao;
    this.tiroDuplo = tiroDuplo;
    if (distanciaTiroVert !== undefined)
      this.distanciaTiroVert = distanciaTiroVert;
  }
}
class ObjComTiros extends ObjetoTela
{
  constructor(pontoInicial, infoObjComTiros)
  {
    //personagem
    super(pontoInicial, infoObjComTiros);
    this._vida = infoObjComTiros.vida;
    this._vidaMAX = infoObjComTiros.vida;

    //tiros
    this._controladorTiros = new ControladorTiros(infoObjComTiros.infoTiroPadrao, this.ehPersPrincipal);
    this._tiroDuplo = infoObjComTiros.tiroDuplo;
    if (this._tiroDuplo)
      this._distanciaTiroVert = infoObjComTiros.distanciaTiroVert;
  }

  //get ControladorTiros
  get controladorTiros()
  { return this._controladorTiros; }

  //tiro duplo
  colocarTiroDuplo(distanciaTiroVert)
  {
    this._tiroDuplo = true;
    this._distanciaTiroVert = distanciaTiroVert;
  }
  colocarTiroSimples()
  {
    this._tiroDuplo = false;
    delete this._distanciaTiroVert;
  }

  //getter vida
  get vida()
  { return this._vida; }
  get vidaMAX()
  { return this._vidaMAX; }

  //mudar vida
  colocarMAXVida()
  { this._vida = this._vidaMAX; }
  zerarVida()
  { this.mudarVida(-this._vida); }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida < 0)
        this._vida = 0;
    this._vivo = this._vida !== 0;

    return this._vivo;
  }

  //getters e setters vivo
  get vivo()
  { return this._vivo; }
  morreu()
  {
    this._vivo = false;
    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }

  //TIROS
  //novo tiro
  atirar(ondeColocar, mudarDirAndarTiroDirSai = false)
  {
    if (ondeColocar === undefined)
      ondeColocar = this._direcaoPadrao();

    const pontosIniciais = this._lugarCertoTiro(ondeColocar); //vetor com 1 ou 2 posicoes (se this._tiroDuplo)
    this._atirar(pontosIniciais[0], mudarDirAndarTiroDirSai, ondeColocar);
    if (pontosIniciais.length>1)
      this._atirar(pontosIniciais[1], mudarDirAndarTiroDirSai, ondeColocar);
  }
  _atirar(pontoInicial, mudarDirAndarTiroDirSai, ondeColocar)
  {
    if (mudarDirAndarTiroDirSai)
      this._controladorTiros.adicionarTiroDif(pontoInicial, undefined, ondeColocar, ondeColocar, true);
      //se colocar Direcao.Baixo como DirecaoX, por exemplo, nao vai dar problema
    else
      this._controladorTiros.adicionarTiro(pontoInicial);
  }
  _direcaoPadrao()
  {
    if (this.ehPersPrincipal)
      return Direcao.Cima;
    else
      return Direcao.Baixo;
  }
  _lugarCertoTiro(ondeColocar)
  {
    let vetorPontos = new Array(this._tiroDuplo?2:1); //se tiro duplo, retorna vetor com a posicao inicial dos dois tiros

    const infoTiroPadrao = this._controladorTiros.infoTiroPadraoAtual;
    //calcular qual o (x,y) em que o tiro vai ser criado
    const mult = 0.05;
    if (ondeColocar === Direcao.Cima || ondeColocar === Direcao.Baixo)
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      const qntEntra = Math.min(this._formaGeometrica.height, infoTiroPadrao.formaGeometrica.height)*mult;

      let y;
      if (ondeColocar === Direcao.Cima)
        y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntEntra;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntEntra;

      if (this._tiroDuplo)
      {
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + this._distanciaTiroVert, y);
        vetorPontos[1] = new Ponto(this._formaGeometrica.x + this._formaGeometrica.width - this._distanciaTiroVert, y);
      }else
        vetorPontos[0] = new Ponto(this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2, y);
    }else
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      const qntEntra = Math.min(this._formaGeometrica.width, infoTiroPadrao.formaGeometrica.width)*mult;

      let x;
      if (ondeColocar === Direcao.Esquerda)
        x = this._formaGeometrica.x - infoTiroPadrao.formaGeometrica.width + qntEntra;
      else
        x = this._formaGeometrica.x + this._formaGeometrica.width - qntEntra;

      if (this._tiroDuplo)
      {
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + this._distanciaTiroVert); //tiro 1 (mais em cima)
        vetorPontos[1] = new Ponto(x, this._formaGeometrica.y + this._formaGeometrica.height - this._distanciaTiroVert); //tiro 2 (mais em baixo)
      }else
        vetorPontos[0] = new Ponto(x, this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2);
    }

    return vetorPontos;
  }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
	{
    //se persComTiro estah morto jah estah com a cor/img de morto
		super.draw();
    this._controladorTiros.draw(); //desenha tiros
	}


  //MUDAR TAMANHOS
  mudarTamLados(porcentagem)
  //soh tem opcao para mudar o tamanho os lados proporcionalmente ao valor atual deles (mantem a proporcao dos lados)
  {
    switch (this._formaGeometrica.codForma)
    {
      case Geometria.COD_QUADRADO:
        this._formaGeometrica.setTamanhoLadoPorcentagem(porcentagem);
        break;
      case Geometria.COD_RETANGULO:
        this._formaGeometrica.setWidthPorcentagem(porcentagem);
        this._formaGeometrica.setHeightPorcentagem(porcentagem);
        break;
      default:
        throw "Não é possível mudar o width e height de um objeto que não tem!";
    }
  }
}
