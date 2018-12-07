//OBJETO TELA COM TIROS
class InfoObjComTiros extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, vida, infoTiroPadrao)
  {
    super(formaGeometrica, corImgMorto);
    this.vida = vida;
    this.vidaMAX = vida;
    this.infoTiroPadrao = infoTiroPadrao;
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
  }

  //get ControladorTiros
  get controladorTiros()
  { return this._controladorTiros; }

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
    const onde = this._lugarCertoTiro(ondeColocar);

    if (mudarDirAndarTiroDirSai)
      this._controladorTiros.adicionarTiroDif(onde, undefined, ondeColocar, ondeColocar, true);
      //se colocar Direcao.Baixo como DirecaoX por exemplo que nao vai dar problema
    else
      this._controladorTiros.adicionarTiro(onde);
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
    let x, y;
    const infoTiroPadrao = this._controladorTiros.infoTiroPadraoAtual;

    //calcular qual o (x,y) em que o tiro vai ser criado
    const mult = 0.05;
    if (ondeColocar === Direcao.Cima || ondeColocar === Direcao.Baixo)
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      const qntEntra = Math.min(this._formaGeometrica.height, infoTiroPadrao.formaGeometrica.height)*mult;
      x = this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2;

      if (ondeColocar === Direcao.Cima)
        y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntEntra;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntEntra;
    }else
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      const qntEntra = Math.min(this._formaGeometrica.width, infoTiroPadrao.formaGeometrica.width)*mult;
      y = this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2;

      if (ondeColocar === Direcao.Esquerda)
        x = this._formaGeometrica.x - infoTiroPadrao.formaGeometrica.width + qntEntra;
      else
        x = this._formaGeometrica.x + this._formaGeometrica.width - qntEntra;
    }

    return {x: x, y: y};
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
