//import "OutrosControladores.js";
// import "ObjetosSimples.js"; (jah foi importado por OutrosControladores.js)

class PersComTiros extends ObjetoTelaMorre
{
  constructor(formaGeometrica, corImgMorto, vida, tiroPadrao, ehPersPrinc)
  {
    //personagem
    super(formaGeometrica, corImgMorto);
    this._vida = vida;
    this._vidaMAX = vida;
    this._ehPersPrincipal = ehPersPrinc;

    //tiros
    this._controladorTiros = new ControladorTiros(tiroPadrao, ehPersPrinc);

    //vivo
    this._vivo = true;
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
  {
    this._vida = 0;
    this._vivo = false;
  }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida < 0)
        this._vida = 0;
    this._vivo = this._vida != 0;
    return this._vivo;
  }

  //getters e setters vivo
  get vivo()
  { return this._vivo; }
  morreu()
  { this._vivo = false; }

  //TIROS
  //novo tiro
  atirar(pers, controladoresObstaculos, controladoresInimigos, ondeColocar)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (ondeColocar == null)
      ondeColocar = this._direcaoPadrao();
    let onde = this._lugarCertoTiro(ondeColocar);

    this._controladorTiros.adicionarTiro(onde.x, onde.y, pers, controladoresObstaculos, controladoresInimigos);
  }
  _direcaoPadrao()
  {
    if (this._ehPersPrincipal)
      return Direcao.Cima;
    else
      return Direcao.Baixo;
  }
  _lugarCertoTiro(ondeColocar)
  {
    let x = null;
    let y = null;

    let tiro = this._controladorTiros.tiroPadrao;

    //calcular qual o (x,y) em que o tiro vai ser criado
    let mult = 0.35;
    if (ondeColocar == Direcao.Cima || ondeColocar == Direcao.Baixo)
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.height, tiro.height)*mult;
      x = this._formaGeometrica.x + (this._formaGeometrica.width - tiro.formaGeometrica.width)/2;

      if (ondeColocar == Direcao.Cima)
        y = this._formaGeometrica.y - tiro.formaGeometrica.height + qntEntra;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntEntra;
    }else
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.width, tiro.width)*mult;
      y = this._formaGeometrica.y + (this._formaGeometrica.height - tiro.formaGeometrica.height)/2;

      if (ondeColocar == Direcao.Esquerda)
        x = this._formaGeometrica.x - tiro.formaGeometrica.width + qntEntra;
      else
        x = this._formaGeometrica.x + this._formaGeometrica.width - qntEntra;
    }

    return {x: x, y: y};
  }

	//draw
    //desenha o personagem e todos seus tiros
	draw()
	{
    this._mudarImgCorSeMorto();
		super.draw();
    this._controladorTiros.draw(); //desenha tiros
	}


  //MUDAR TAMANHOS
  set width(nvWidth)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_QUADRADO
      && this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o width de um objeto que não o tem!";

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
      throw "Não é possível mudar o height de um objeto que não o tem!";

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
  constructor(formaGeometrica, corImgMorto, vida, tiroPadrao, qtdAndar)
  {
    super(formaGeometrica, corImgMorto, vida, tiroPadrao, true);
    this.qtdAndar = qtdAndar;
  }

  //mudar qtdAndar
  get qtdAndar()
  { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  {
    this._qtdAndar = qtdAndar;
    this._qtdAndarCadaDirDiag = this._qtdAndar*Math.sqrt(2)/2;
  }

  //mudar (x,y)
  colocarLugarInicial()
  {
    this.colocarMeioX();
    this._formaGeometrica.y = 0.75*height;
  }
  andar(direcaoX, direcaoY, controladoresObstaculos, controladoresInimigos, controladoresTirosJogo)
  //usuario soh usa esse metodo
  {
    let qtdAndarX, qtdAndarY;
    if (direcaoX != null && direcaoY != null)
    //se personagem quer andar pra alguma diagonal
    {
      qtdAndarX = this._qtdAndarCadaDirDiag;
      qtdAndarY = this._qtdAndarCadaDirDiag;
    }else
    //soh anda em X
    if (direcaoX != null)
    {
      if (direcaoX == Direcao.Direita)
        qtdAndarX = this._qtdAndar;
      else
        qtdAndarX = -this._qtdAndar;
      qtdAndarY = 0;
    }else
    //soh anda em Y
    if (direcaoY != null)
    {
      if (direcaoY == Direcao.Baixo)
        qtdAndarY = this._qtdAndar;
      else
        qtdAndarY = -this._qtdAndar;
      qtdAndarX = 0;
    }else
    //se ele nao quer andar pra nenhuma direcao
      return;

    this.mudarXY(qtdAndarX, qtdAndarY,  controladoresObstaculos, controladoresInimigos, controladoresTirosJogo);
  }
  mudarXY(qtdMudaX, qtdMudaY, controladoresObstaculos, controladoresInimigos, controladoresTirosJogo)
  //soh obstaculo usa diretamente
  //retorna se pode andar tudo aquilo ou nao (para andar do obstaculo)
  {
    //colisao com:
      // - tiros de inimigos e do jogo => perde vida e mata tiros
      // - inimigos => perde vida
      // - obstaculos => anda menos (soh ateh encostar nele)

    //se nao vai mudar nada
    if (qtdMudaX == 0 && qtdMudaY == 0)
      return true;

    let infoQtdMudar =
    {
      qtdPodeMudarX : Tela.qtdAndarObjNaoSairX(this._formaGeometrica, qtdMudaX),
      qtdPodeMudarY : Tela.qtdAndarObjNaoSairY(this._formaGeometrica, qtdMudaY);
      menorHipotenusa : Operacoes.hipotenusa(qtdPodeAndarX, qtdPodeAndarY);
    };

    if (infoQtdMudar.qtdPodeMudarX == 0 && infoQtdMudar.qtdPodeMudarY == 0)
      return false;

    //obstaculos
    //colisao com obstaculos, vai definir quanto pode andar em cada direcao
    for (let i = 0; i<controladoresObstaculos.length; i++)
      controladoresObstaculos[i].qtdPersPodeAndar(infoQtdMudar, this._formaGeometrica);
    //aqui tudo o que devia ser feito com obstaculos estah OK

    //inimigos e tiros deles
    for (let i = 0; i<controladoresInimigos.length; i++)
    {
      controladoresInimigos[i].procPersAndar(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
      controladoresInimigos[i].procPersColidirTirosTodosInim(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
    }

    //controladoresTiros do jogo
    for (let i = 0; i<controladoresTirosJogo.length; i++)
      controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, ControladorTiros.PERSONAGEM_ANDOU);

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += infoQtdMudar.qtdPodeMudarX;
    this._formaGeometrica.y += infoQtdMudar.qtdPodeMudarY;

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX == qtdMudaX && infoQtdMudar.qtdPodeMudarY == qtdMudaY;
  }

  //draw
  draw()
  {
    super.draw();
    this._colocacarVidaTela();
  }
  _colocacarVidaTela()
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
  constructor(formaGeometrica, corImgMorto, vida, corVida, tiroPadrao, qtdTiraVidaPersQndIntersec, qtdAndarX, qtdAndarY, tipoAndar)
  {
    super(formaGeometrica, corImgMorto, vida, tiroPadrao, false);

    this._corVida = corVida;

    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;

    this._qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;

    //andar
    this._tipoAndar = null;
    this.tipoAndar = tipoAndar;
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    this._auxTirarVidaPers = 0;
  }

  procCriou(pers, indexContrInim)
  {
    //colisao com tiros
    pers.controladorTiros.procedimentoObjTelaColideCriar(this, ControladorTiros.INIMIGO_CRIADO, indexContrInim);
    //colisao com personagem
    if (this._vivo && Interseccao.interseccao(this._formaGeometrica, pers.formaGeometrica))
      this.tirarVidaPersIntersec(pers);
  }

  //getters e setters andar
  get tipoAndar()
  { return this._tipoAndar; }
  set tipoAndar(tipo)
  {
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
      throw "Inimigo nao pode seguir inimigos";
      this._tipoAndar = tipo;
  }
  get qtdAndarX()
  { return this._qtdAndarX; }
  get qtdAndarY()
  { return this._qtdAndarY; }

  andar(pers, indexContrInim)
  //retorna se deve continuar na lista
  {
    let qtdAndar = Andar.qtdAndarFromTipo(this._qtdAndarX, this._qtdAndarY, this._formaGeometrica, this._tipoAndar);
    if (qtdAndar.inverterDirQtdAndar)
    {
      //inverte a direcao do obstaculo
      this._qtdAndarX = -this._qtdAndarX;
      this._qtdAndarY = -this._qtdAndarY;
    }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse inimigo andou, ele sai
    pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
      controladorTiros.INIMIGOS_ANDOU, indexContrInim);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      this.tirarVidaPersIntersec(pers);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }
  tirarVidaPersIntersec(pers)
  {
    pers.mudarVida(-this._qtdTiraVidaPersQndIntersec);

    //se personagem ficar dentro do inimigo ir tirando vida
    this._auxTirarVidaPers++;
    let t = this;
    setTimeout(
      function()
      {
        t._auxTirarVidaPers--;
        if (t._auxTirarVidaPers == 0 && Interseccao.interseccao(t._formaGeometrica, pers.formaGeometrica))
          t.tirarVidaPersIntersec(pers);
      }, frameRatePadrao);
  }

  //desenho
  get corVida()
  { return this._corVida; }
  set corVida(vida)
  { this._corVida = vida; }
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

  //clone
  clone()
  {
    return new Inimigo(this._formaGeometrica, this._corImgMorto, this._vida, this._corVida, this._controladorTiros.tiroPadrao,
      this._qtdTiraVidaPersQndIntersec, this._qtdAndarX, this._qtdAndarY, this._tipoAndar);
  }

 //outros...
  //para quando um tiro for criado (ver se colide com esse inimigo)
  //retorna se colidiu
  procColidirTiroCriado(tiro)
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      tiro.tirarVidaObjCmVida(this);
      return true;
    }
    return false;
  }
}
