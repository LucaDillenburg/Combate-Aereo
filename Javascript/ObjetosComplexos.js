//import "OutrosControladores.js";
// import "ObjetosSimples.js"; (jah foi importado por OutrosControladores.js)

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
    this._vivo = this._vida != 0;

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
  atirar(ondeColocar)
  {
    if (ondeColocar == null)
      ondeColocar = this._direcaoPadrao();
    let onde = this._lugarCertoTiro(ondeColocar);

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
    let x = null;
    let y = null;

    let infoTiroPadrao = this._controladorTiros.infoTiroPadraoAtual;

    //calcular qual o (x,y) em que o tiro vai ser criado
    let mult = 0.05;
    if (ondeColocar == Direcao.Cima || ondeColocar == Direcao.Baixo)
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.height, infoTiroPadrao.formaGeometrica.height)*mult;
      x = this._formaGeometrica.x + (this._formaGeometrica.width - infoTiroPadrao.formaGeometrica.width)/2;

      if (ondeColocar == Direcao.Cima)
        y = this._formaGeometrica.y - infoTiroPadrao.formaGeometrica.height + qntEntra;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntEntra;
    }else
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.width, infoTiroPadrao.formaGeometrica.width)*mult;
      y = this._formaGeometrica.y + (this._formaGeometrica.height - infoTiroPadrao.formaGeometrica.height)/2;

      if (ondeColocar == Direcao.Esquerda)
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
  // TODO : VERIFICAR SE PODE AUMENTAR E FAZER COLISOES
  set width(nvWidth)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o width de um objeto que não o tem!";

    if (nvWidth < 0)
      throw "Width inválido!";
    this._formaGeometrica.width = nvWidth;
  }
  set height(nvHeight)
  {
    if (this._formaGeometrica.codForma != Geometria.COD_RETANGULO)
      throw "Não é possível mudar o height de um objeto que não o tem!";

    if (nvHeight < 0)
      throw "Height inválido!";
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


//INIMIGO
class InfoInimigo extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, proporcTempoVida, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar)
  {
    super(formaGeometrica, corImgMorto, vida, infoTiroPadrao);
    this.corVida = corVida;
    this.mostrarVidaSempre = mostrarVidaSempre;
    if (proporcTempoVida != null)
      this.proporcTempoVida = proporcTempoVida;
    this.freqTiro = freqTiro;
    this.podeAtirarQualquerLado = podeAtirarQualquerLado;
    this.qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
    this.infoAndar = infoAndar;
  }

  clone()
  { return new InfoInimigo(this.formaGeometrica, this.corImgMorto, this.vida, this.corVida, this.mostrarVidaSempre, this.proporcTempoVida, this.infoTiroPadrao, this.freqTiro, this.podeAtirarQualquerLado, this.qtdTiraVidaPersQndIntersec, this.infoAndar); }
}
const tempoMostrarVidaPadrao = 675;
class Inimigo extends ObjComTiros
{
  constructor(pontoInicial, infoInimigo)
  {
    super(pontoInicial, infoInimigo);

    //tiro
    this._auxFreqTiro = infoInimigo.freqTiro;
    this._freqTiro = infoInimigo.freqTiro;
    this._podeAtirarQualquerLado = infoInimigo.podeAtirarQualquerLado;
    this._colocarProcedimentoAtirar();
    this.procPosMudarTiro();

    //andar
    this._seEhImpossivelExcep(infoInimigo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoInimigo.infoAndar, this._formaGeometrica);

    //tirar vida pers
    this._qtdTiraVidaPersQndIntersec = infoInimigo.qtdTiraVidaPersQndIntersec;
    this._auxTirarVidaPers = 0;

    //para desenhar vida
    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;
    this._corVida = infoInimigo.corVida;
    this._mostrarVidaSempre = infoInimigo.mostrarVidaSempre;
    if (!this._mostrarVidaSempre)
      this._tempoMostrarVida = (infoInimigo.proporcTempoVida==null) ? tempoMostrarVidaPadrao :
        infoInimigo.proporcTempoVida*tempoMostrarVidaPadrao;
    if (this._mostrarVidaSempre)
    //se soh vai mostrar sempre
      this._mostrarVida = true;
    else
    //se soh vai mostrar vida quando levar tiro
    {
      this._auxMostrarVida = 0;
      this._mostrarVidaCertoTempo();
    }
  }

  //procedimento ao criar: colisao com tiros do pers (nao precisa verificar colidir com o personagem aqui!)
  procCriou(indexContrInim)
  { ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, ControladorTiros.INIMIGO_CRIADO, indexContrInim); }

  procPosMudarTiro()
  { this._decidirDirecaoTiro = this._podeAtirarQualquerLado && this._controladorTiros.infoTiroPadraoAtual.infoAndar.tipoAndar == Andar.SEGUIR_PERS; }

  //getters e setters andar
  get classeAndar()
  { return this._classeAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo == TipoAndar.SeguirInimMaisProx)
      throw "Inimigo nao pode seguir inimigos";
  }
  setTipoAndar(tipo)
  {
    this._seEhImpossivelExcep(tipo);
    this._classeAndar.setTipoAndar(tipo, this._formaGeometrica);
  }
  //se for adicionar set qtdAndar, mudar this._hipotenusaAndarPadrao de acordo com o tipoAndar

  //ANDAR
  andar(indexContrInim, indexInim)
  //retorna se deve continuar na lista
  {
    let qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse inimigo andou, ele sai
    ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
      ControladorTiros.INIMIGOS_ANDOU, indexContrInim);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      ConjuntoObjetosTela.pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //ATIRAR
  atirar()
  { this._funcFreqAtirar.contar(); /*conta e se jah estiver na hora de atirar de acordo com a frequencia atira*/ }
  _colocarProcedimentoAtirar()
  {
    let _this = this;
    this._funcFreqAtirar = new FreqFunction(
      function()
      {
        if (_this._decidirDirecaoTiro)
          _this._atirarSuper(Direcao.emQualDirecaoObjEsta(_this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica));
        else
          _this._atirarSuper();
      }, this._freqTiro, true
    );
  }
  _atirarSuper(direcao) { super.atirar(direcao); } //auxiliar para _colocarProcedimentoAtirar (infelizmente nao tem outro jeito de fazer)

  get freqTiro()
  { return this._freqTiro; }
  get podeAtirarQualquerLado()
  { return this._podeAtirarQualquerLado; }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }

  //mudar vida de inimigo: verificar se deve colocar vida na tela ou nao
  mudarVida(qtdMuda)
  {
    super.mudarVida(qtdMuda);

    //se soh mostra vida quando leva tiro
    //(mostra a vida ateh ficar um certo tempo sem levar tiro)
    if (!this._mostrarVidaSempre)
      this._mostrarVidaCertoTempo();
  }
  _mostrarVidaCertoTempo()
  {
    this._mostrarVida = true;
    this._auxMostrarVida++;
    let _this = this;
    new Timer(
      function()
      {
        _this._auxMostrarVida--;
        if (_this._auxMostrarVida == 0)
          _this._mostrarVida = false;
      }, this._tempoMostrarVida, false, false
    );
  }

  get mostrarVidaSempre()
  { return this._mostrarVidaSempre; }

  //desenho
  get corVida()
  { return this._corVida; }
  set corVida(vida)
  { this._corVida = vida; }
  draw()
  {
    //desenha inimigo e tiros dele
    super.draw();

    if (this._mostrarVida)
      this._desenharVida();
  }
  _desenharVida()
  {
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


//PERSONAGEM PRINCIPAL
class InfoPersonagemPrincipal extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, infoTiroPadrao, qtdAndar)
  {
    super(formaGeometrica, corImgMorto, vida, infoTiroPadrao);
    this.qtdAndar = qtdAndar;
  }

  clone()
  { return new InfoPersonagemPrincipal(this.formaGeometrica, this.corImgMorto, this.vida, this.infoTiroPadrao, this.qtdAndar); }
}
const freqMissilPers = 28;
class PersonagemPrincipal extends ObjComTiros
{
  constructor(infoPersonagemPrincipal, pontoInicial)
  {
    if (pontoInicial==null) pontoInicial = [];
    super(pontoInicial, infoPersonagemPrincipal);

    this._ehMissil = false; // o primeiro tiro tem que ser o normal

    this.qtdAndar = infoPersonagemPrincipal.qtdAndar;

    //lista de inimigos que intersectou
    this._qtdTirarVidaIntersecInim = 0;
    this._listaInfoInimIntersec = new ListaDuplamenteLigada();
  }

  get ehPersPrincipal() { return true; }

  //mudar qtdAndar
  get qtdAndar()
  { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  {
    this._qtdAndar = qtdAndar;
    this._qtdAndarCadaDirDiag = this._qtdAndar*Math.sqrt(2)/2;
  }

  procPosMudarTiro() //se for mudar o infoTiroPadrao (ou voltarTiroPadrao ou tipoAndar do tiro) chamar esse metodo
  {
    if (this._controladorTiros.infoTiroPadraoAtual.infoAndar.tipoAndar == TipoAndar.SeguirInimMaisProx) //se for missil
    {
      this._ehMissil = true;
      this._colocarProcedimentoAtirarMissil();
    }else
    {
      this._freqFuncAtirarMissil = null;
      this._ehMissil = false;
    }
  }

  morreu()
  {
    super.morreu();
    ConjuntoTimers.personagemMorreu();
  }

  //mudar (x,y)
  colocarLugarInicial()
  //nao verifica se vai bater em alguem
  {
    this.colocarNoMeioX();
    this._formaGeometrica.y = 0.75*height;
  }
  andar(direcaoX, direcaoY)
  //usuario soh usa esse metodo
  {
    if (direcaoX == null && direcaoY == null)
      return;

    let qtdAndarPadrao;
    if (direcaoX != null && direcaoY != null)
    //se personagem quer andar pra alguma diagonal
      qtdAndarPadrao = this._qtdAndarCadaDirDiag;
    else
      qtdAndarPadrao = this._qtdAndar;

    let qtdAndarX, qtdAndarY;
    //anda em X
    if (direcaoX != null)
    {
      if (direcaoX == Direcao.Direita)
        qtdAndarX = qtdAndarPadrao;
      else
        qtdAndarX = -qtdAndarPadrao;
    }else
      qtdAndarX = 0;
    //anda em Y
    if (direcaoY != null)
    {
      if (direcaoY == Direcao.Baixo)
        qtdAndarY = qtdAndarPadrao;
      else
        qtdAndarY = -qtdAndarPadrao;
    }else
      qtdAndarY = 0;

    this.mudarXY(qtdAndarX, qtdAndarY);
  }
  mudarXY(qtdMudaX, qtdMudaY)
  //soh obstaculo usa diretamente
  //retorna se pode andar tudo aquilo
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
      qtdPodeMudarY : Tela.qtdAndarObjNaoSairY(this._formaGeometrica, qtdMudaY)
    };

    //nao conseguiu andar tudo
    if (infoQtdMudar.qtdPodeMudarX == 0 && infoQtdMudar.qtdPodeMudarY == 0)
      return false;

    //obstaculos
    //colisao com obstaculos, vai definir quanto pode andar em cada direcao
    for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
      ConjuntoObjetosTela.controladoresObstaculos[i].qtdPersPodeAndar(infoQtdMudar, this._formaGeometrica);
    //aqui tudo o que devia ser feito com obstaculos estah OK

    //PS: NAO ZERA A LISTA AQUI POIS SE ALGUM INIMIGO FOR CRIADO TERA SIDO ADICIONADO A LISTA E AINDA NAO

    //inimigos e tiros deles
    for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
    {
      //ve se vai colidir com inimigos e adiciona na lista de inimigos intersectados
      ConjuntoObjetosTela.controladoresInimigos[i].procPersAndar(i, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
      //ve se vai colidir com tiros dos inimigos e tira vida do pers
      ConjuntoObjetosTela.controladoresInimigos[i].procObjTelaAndarColidirTirosTodosInim(this, infoQtdMudar.qtdPodeMudarX,
        infoQtdMudar.qtdPodeMudarY, ControladorTiros.PERSONAGEM_ANDOU);
    }

    //controladoresTiros do jogo
    for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, ControladorTiros.PERSONAGEM_ANDOU);

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += infoQtdMudar.qtdPodeMudarX;
    this._formaGeometrica.y += infoQtdMudar.qtdPodeMudarY;

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX == qtdMudaX && infoQtdMudar.qtdPodeMudarY == qtdMudaY;
  }

  atirar()
  {
    if (this._ehMissil)
      this._freqFuncAtirarMissil.contar(); //conta e se jah estiver na hora de atirar de acordo com a frequencia atira
    else
      super.atirar();
  }
  _colocarProcedimentoAtirarMissil()
  {
    let _this = this;
    this._freqFuncAtirarMissil = new FreqFunction(function() { _this._atirarSuper(); }, freqMissilPers, true);
  }
  _atirarSuper() { super.atirar(); } //auxiliar para _colocarProcedimentoAtirar (infelizmente nao tem como fazer de outro jeito)

  //sobre ter intersectar com inimigos
  zerarInimigosIntersectados()
  {
    this._listaInfoInimIntersec.esvaziar();
    this._qtdTirarVidaIntersecInim = 0;
  }
  colidiuInim(indexContr, indexInim, qtdTiraVidaPersQndIntersec)
  {
    if (this._jahColidiuInim(indexContr, indexInim))
    //se personagem jah adicionou que colidiu nao precisa adicionar de novo
      return;

    //inserir na lista e somar
    this._listaInfoInimIntersec.inserirNoComeco({indexContr: indexContr, indexInim: indexInim});
    this._qtdTirarVidaIntersecInim += qtdTiraVidaPersQndIntersec;
  }
  _jahColidiuInim(indexContr, indexInim)
  {
    for (this._listaInfoInimIntersec.colocarAtualComeco(); !this._listaInfoInimIntersec.atualEhNulo; this._listaInfoInimIntersec.andarAtual())
      if (this._listaInfoInimIntersec.atual.indexContr == indexContr &&
        this._listaInfoInimIntersec.atual.indexInim == indexInim)
        return true;
    return false;
  }
  procTirarVidaIntersecInim()
  {
    this.mudarVida(-this._qtdTirarVidaIntersecInim);
    this.zerarInimigosIntersectados();
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
      (width - 2*tamStroke)*(this._vida/this._vidaMAX), heightVidaUsuario - 2*tamStroke);

    fill(0);
    let fontSize = 22;
    textSize(fontSize);
    text("Vida: " + this._vida + "/" + this._vidaMAX, 5, height - heightVidaUsuario + fontSize);
  }
}
