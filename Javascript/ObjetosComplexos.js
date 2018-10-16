class PersComTiros extends Objeto
{
  constructor(formaGeometrica, vida, tiroPadrao, ehPersPrinc)
  {
    //personagem
    super(formaGeometrica);
    this._vida = vida;
    this._vidaMAX = vida;
    this._ehPersPrincipal = ehPersPrinc;

    this._controladorTiros = new ControladorTiros(tiroPadrao, ehPersPrinc);
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
  { this._vida = 0; }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida < 0)
        this._vida = 0;
    return this._vida != 0;
  }

  //getters and setters tiro
  get tiroPadrao()
  { return this._tiroPadrao; }
  set tiroPadrao(tiro)
  { this._tiroPadrao = tiro; }

  //TIROS
  //novo tiro
  adicionarTiro(ondeColocar, qtdAndarX, qtdAndarY, corMorto, mortalidade, formaGeomTiro)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (ondeColocar == null)
      ondeColocar = direcaoPadrao();
    let onde = lugarCertoTiro(ondeColocar);
    this._controladorTiros.adicionarTiro(onde.x, onde.y, ondeColocar, qtdAndarX, qtdAndarY, corMorto, mortalidade, formaGeomTiro);
  }
  adicionarTiroDif(tiro, ondeColocar)
  {
    if (ondeColocar == null)
      ondeColocar = direcaoPadrao();
    let onde = lugarCertoTiro(ondeColocar);
    //criar tiro e adicionar ao comeco da lista
		this._controladorTiros.adicionarTiroDif(onde.x, onde.y, tiro);
  }
  direcaoPadrao()
  {
    if (this._ehPersPrincipal)
      return Direcao.Cima;
    else
      return Direcao.Baixo;
  }
  lugarCertoTiro(ondeColocar)
  {
    let x = null;
    let y = null;
    switch (ondeColocar)
    {
      case Direcao.Cima:
        x = this._formaGeometrica.x + (this._formaGeometrica.width - tiro.formaGeometrica.width)/2;
        y = this._formaGeometrica.y - tiro.formaGeometrica.height;
        break;
      case Direcao.Baixo:
        x = this._formaGeometrica.x + (this._formaGeometrica.width - formaGeometrica.width)/2;
        y = this._formaGeometrica.y + this._formaGeometrica.height;
        break;
      case Direcao.Esquerda:
        x = this._formaGeometrica.x - tiro.formaGeometrica.width;
        y = this._formaGeometrica.y + (this._formaGeometrica.height - tiro.formaGeometrica.height)/2;
        break;
      case Direcao.Direita:
        x = this._formaGeometrica.x + this._formaGeometrica.width;
        y = this._formaGeometrica.y + (this._formaGeometrica.height - tiro.formaGeometrica.height)/2;
        break;
    }

    return {x: x, y: y};
  }

  //mover tiros
  andarTiros(pers, obstaculos, inimigos)
  {
    this._controladorTiros.andarTiros();
  }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
	{
		super.draw();
    this._controladorTiros.draw(); //desenha tiros
	}


  //MUDAR TAMANHOS
  set width(nvWidth)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_QUADRADO
      && this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o width de um objeto que não tem!";

    if (nvWidth < 0)
      throw "Width inválido!";

    if (this._formaGeometrica.codForma == Geometria.COD_QUADRADO)
      this._formaGeometrica.tamanhoLado = nvWidth;
    else
      this._formaGeometrica.width = nvWidth;
  }
  set height(nvHeight)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_QUADRADO
      && this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o width de um objeto que não tem!";

    if (nvHeight < 0)
      throw "Height inválido!";

    if (this._formaGeometrica.codForma == Geometria.COD_QUADRADO)
      this._formaGeometrica.tamanhoLado = nvHeight;
    else
      this._formaGeometrica.height = nvHeight;
  }
  mudarTamLados(qtdMudar)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_QUADRADO
      && this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o width e height de um objeto que não tem!";

    if (this._formaGeometrica.width + qtdMudar < 0 || this._formaGeometrica.height + qtdMudar < 0)
      throw "QtdMuda tamanho lados inválido!";

    if (this._formaGeometrica.codForma == Geometria.COD_QUADRADO)
      this._formaGeometrica.mudaTamanhoLado(qtdMudar);
    else
    {
      this._formaGeometrica.mudarWidth(qtdMudar);
      this._formaGeometrica.mudarHeight(qtdMudar);
    }
  }
}


class PersonagemPrincipal extends PersComTiros
{
  constructor(formaGeometrica, vida, tiroPadrao, qtdAndar)
  {
    super(formaGeometrica, vida, tiroPadrao, true);
    this._qtdAndar = qtdAndar;
  }

  //mudar (x,y)
  colocarLugarInicial()
  {
    this.colocarMeioX();
    this._formaGeometrica.y = 0.75*height;
  }
  andar(direcaoX, direcaoY, obstaculos, inimigos, controladorTirosJogo)
  //usuario soh usa esse metodo
  {
    let qtdAndarX;
    switch(direcaoX)
    {
      case Direcao.Direita:
        qtdAndarX = this._qtdAndar;
        break;
      case Direcao.Esquerda:
        qtdAndarX = -this._qtdAndar;
        break;
      default:
        qtdAndarX = 0;
        break;
    }

    let qtdAndarY;
    switch(direcaoY)
    {
      case Direcao.Baixo:
        qtdAndarY = this._qtdAndar;
        break;
      case Direcao.Cima:
        qtdAndarY = -this._qtdAndar;
        break;
      default:
        qtdAndarX = 0;
        break;
    }

    this.mudarXY(qtdAndarX, qtdAndarY, obstaculos, inimigos, controladorTirosJogo);
  }
  mudarXY(qtdMudaX, qtdAndarY, obstaculos, inimigos, controladorTirosJogo)
  //retorna se pode andar tudo aquilo ou nao (para andar do obstaculo)
  {
    let qtdVaiMudarX = Tela.qtdAndarObjNaoSairX(this._formaGeometrica, qtdMudaX);
    let qtdVaiMudarY = Tela.qtdAndarObjNaoSairY(this._formaGeometrica, qtdMudaY);

    //obstaculos
    if (obstaculos != null)
    {
      let menorHipotenusa = Operacoes.hipotenusa(qtdPodeAndarX, qtdPodeAndarY);
      for(let i = 0; i<obstaculos.length; i++)
      {
        let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(obstaculos[i].formaGeometrica, this._formaGeometrica, qtdPodeAndarX, qtdPodeAndarY);
        let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

        //se tiro vai bater em um obstaculo mais perto que o outro
        if (hipotenusa < menorHipotenusa)
        {
          menorHipotenusa = hipotenusa;
          qtdVaiMudarX = qtdPodeAndar.x;
          qtdVaiMudarY = qtdPodeAndar.y;
        }
      }
    }//aqui tudo o que devia ser feito com obstaculos estah OK

    //controladoresTiros
    let qtdInimigos = (inimigos==null)?0:inimigos.length;
    for (let i = 0; i<qtdInimigos+1; i++)
    {
      let controladorTirosAtual;
      if (i<qtdInimigos)
        controladorTirosAtual = inimigos[i].controladorTiros;
      else
        controladorTirosAtual = controladorTirosJogo;
      //controladorTirosAtual passará por todos os controladores de tiros dos inimigos e do jogo em si

      controladorTirosAtual.procedimentoObjTelaColideAndar(this, qtdVaiMudarX, qtdVaiMudarY);
    }

    //inimigos
    for (let i = 0; i<qtdInimigos; i++)
      if (Interseccao.vaiTerInterseccao(inimigos[i].formaGeometrica, this._formaGeometrica, qtdVaiMudarX, qtdVaiMudarY))
      {
        inimigos[i].tirarVidaPersIntersec(this);
        //TODO: se personagem ficar dentro do inimigo ir tirando vida
      }

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += qtdVaiMudarX;
    this._formaGeometrica.y += qtdVaiMudarY;

    //se consegue andar tudo o que deveria
    return qtdVaiMudarX == qtdMudaX && qtdVaiMudarY == qtdMudaY;
  }

  get x()
  { return this._formaGeometrica.x; }
  get y()
  { return this._formaGeometrica.y; }

  //mudar qtdAndar
  get qtdAndar()
  { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  { this._qtdAndar = qtdAndar; }

  //draw
  colocacarVidaTela()
  {
    stroke(0);
    fill(255);
    rect(0, height - heightVidaUsuario, width, heightVidaUsuario);

    noStroke(0);
    fill(color("green"));
    rect(tamStroke, height - heightVidaUsuario + tamStroke,
      (width - 2*tamStroke)*(this._personagemPrincipal._vida/this._personagemPrincipal._vidaMAX), heightVidaUsuario - 2*tamStroke);

    fill(0);
    let fontSize = 22;
    textSize(fontSize);
    text("Vida: " + this._personagemPrincipal._vida + "/" + this._personagemPrincipal._vidaMAX, 5, height - heightVidaUsuario + fontSize);
  }
}


class Inimigo extends PersComTiros
{
  constructor(formaGeometrica, vida, corVida, tiroPadrao, qtdTiraVidaPersQndIntersec, objSaiuTotalmente)
  {
    super(formaGeometrica, vida, tiroPadrao, false);

    this._corVida = corVida;

    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;

    this._objSaiuTotalmente = objSaiuTotalmente;

    this._qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
  }

  //(x, y)
  mudarX(qtdMudar)
  {
    //verificar se nao bate em personagem
    this._formaGeometrica.x += qtdMudar;
    if (this._objSaiuTotalmente)
    //se querem saber se inimigo saiu totalmente
      return !Tela.objSaiuTotalmente(this._formaGeometrica);
    else
    //se querem saber se inimigo saiu pelo menos um pouco
      return !Tela.objSaiuEmX(this._formaGeometrica);
  }
  mudarY(qtdMudar)
  {
    //verificar se nao bate em personagem
    this._formaGeometrica.y += qtdMudar;
    if (this._objSaiuTotalmente)
    //se querem saber se inimigo saiu totalmente
      return !Tela.objSaiuTotalmente(this._formaGeometrica);
    else
    //se querem saber se inimigo saiu pelo menos um pouco
      return !Tela.objSaiuEmY(this._formaGeometrica);
  }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }
  tirarVidaPersIntersec(pers)
  { pers.mudarVida(-this._qtdTiraVidaPersQndIntersec); }

  //desenho
  draw()
  {
    //desenha inimigo e tiros dele
    super.draw();

    //desenha vida:

    let tamStrokeAtual = 0.8;
    strokeWeight(tamStrokeAtual);

    //DRAW VIDA:
    //draw vida em cima do inimigo
    let xVida = this._formaGeometrica.x + (this._formaGeometrica.width - this._widthVida)/2;
    let yVida = this._formaGeometrica.y - (this._heightVida + 5);

    //desenhar parte branca da vida
    stroke(0);
    fill(255);
    rect(xVida, yVida, this._widthVida, this._heightVida);
    //desenhar a parte verdadeira
    noStroke();
    fill(this._corVida);
    rect(xVida + tamStrokeAtual, yVida + tamStrokeAtual,
      (this._widthVida - 2*tamStrokeAtual)*(this._vida/this._vidaMAX), this._heightVida - 2*tamStrokeAtual);

    strokeWeight(tamStroke);
  }
}
