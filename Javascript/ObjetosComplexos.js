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
  atirar(conjuntoObjetosTela, ondeColocar)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (ondeColocar == null)
      ondeColocar = this._direcaoPadrao();
    let onde = this._lugarCertoTiro(ondeColocar);

    this._controladorTiros.adicionarTiro(conjuntoObjetosTela, onde.x, onde.y);
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

    let tiro = this._controladorTiros.tiroPadraoAtual;

    //calcular qual o (x,y) em que o tiro vai ser criado
    let mult = 0.05;
    if (ondeColocar == Direcao.Cima || ondeColocar == Direcao.Baixo)
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.height, tiro.formaGeometrica.height)*mult;
      x = this._formaGeometrica.x + (this._formaGeometrica.width - tiro.formaGeometrica.width)/2;

      if (ondeColocar == Direcao.Cima)
        y = this._formaGeometrica.y - tiro.formaGeometrica.height + qntEntra;
      else
        y = this._formaGeometrica.y + this._formaGeometrica.height - qntEntra;
    }else
    {
      //calcular quanto vai entrar no personagem com tiro
      //menor altura de tiro e personagem /2
      let qntEntra = Math.min(this._formaGeometrica.width, tiro.formaGeometrica.width)*mult;
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

//PERSONAGEM PRINCIPAL
const freqMissilPers = 40;
class PersonagemPrincipal extends PersComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, tiroPadrao, qtdAndar)
  {
    super(formaGeometrica, corImgMorto, vida, tiroPadrao, true);
    this._ehMissil = false; // o primeiro tiro tem que ser o normal

    this.qtdAndar = qtdAndar;

    //lista de inimigos que intersectou
    this._qtdTirarVidaIntersecInim = 0;
    this._listaInfoInimIntersec = new ListaDuplamenteLigada();
  }

  //mudar qtdAndar
  get qtdAndar()
  { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  {
    this._qtdAndar = qtdAndar;
    this._qtdAndarCadaDirDiag = this._qtdAndar*Math.sqrt(2)/2;
  }

  procPosMudarTiro() //se for mudar o tiroPadrao (ou voltarTiroPadrao ou tipoAndar do tiro) chamar esse metodo
  {
    if (this._controladorTiros.tiroPadraoAtual.infoAndar.tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX) //se for missil
    {
      this._auxFreqTiro = freqMissilPers;
      this._ehMissil = true;
    }else
    {
      this._auxFreqTiro = null;
      this._ehMissil = false;
    }
  }

  //mudar (x,y)
  colocarLugarInicial()
  {
    this.colocarNoMeioX();
    this._formaGeometrica.y = 0.75*height;
  }
  andar(direcaoX, direcaoY, conjuntoObjetosTela)
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

    this.mudarXY(qtdAndarX, qtdAndarY, conjuntoObjetosTela);
  }
  mudarXY(qtdMudaX, qtdMudaY, conjuntoObjetosTela)
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
    for (let i = 0; i<conjuntoObjetosTela.controladoresObstaculos.length; i++)
      conjuntoObjetosTela.controladoresObstaculos[i].qtdPersPodeAndar(infoQtdMudar, this._formaGeometrica);
    //aqui tudo o que devia ser feito com obstaculos estah OK

    //PS: NAO ZERA A LISTA AQUI POIS SE ALGUM INIMIGO FOR CRIADO TERA SIDO ADICIONADO A LISTA E AINDA NAO

    //inimigos e tiros deles
    for (let i = 0; i<conjuntoObjetosTela.controladoresInimigos.length; i++)
    {
      //ve se vai colidir com inimigos e adiciona na lista de inimigos intersectados
      conjuntoObjetosTela.controladoresInimigos[i].procPersAndar(i, this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
      //ve se vai colidir com tiros dos inimigos e tira vida do pers
      conjuntoObjetosTela.controladoresInimigos[i].procObjTelaAndarColidirTirosTodosInim(this, infoQtdMudar.qtdPodeMudarX,
        infoQtdMudar.qtdPodeMudarY, ControladorTiros.PERSONAGEM_ANDOU);
    }

    //controladoresTiros do jogo
    for (let i = 0; i<conjuntoObjetosTela.controladoresTirosJogo.length; i++)
      conjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, ControladorTiros.PERSONAGEM_ANDOU);

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += infoQtdMudar.qtdPodeMudarX;
    this._formaGeometrica.y += infoQtdMudar.qtdPodeMudarY;

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX == qtdMudaX && infoQtdMudar.qtdPodeMudarY == qtdMudaY;
  }

  atirar(conjuntoObjetosTela)
  {
    if (this._ehMissil)
    {
      this._auxFreqTiro++;
      if (this._auxFreqTiro >= freqMissilPers)
      {
        this._auxFreqTiro = 0;
        super.atirar(conjuntoObjetosTela, null);
      }
    }else
      super.atirar(conjuntoObjetosTela, null);
  }

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

//INIMIGO
const tempoMostrarVidaPadrao = 675;
class Inimigo extends PersComTiros
{
  constructor(formaGeometrica, corImgMorto, infoVida, tiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar, pers)
  // infoVida: vida, corVida, mostrarVidaSempre, [proporcTempoVida] (ultimo eh opcional)
  // infoAndar: qtdAndarX, qtdAndarY, tipoAndar
  {
    super(formaGeometrica, corImgMorto, infoVida.vida, tiroPadrao, false);

    //tiro
    this._auxFreqTiro = freqTiro;
    this._freqTiro = freqTiro;
    this._podeAtirarQualquerLado = podeAtirarQualquerLado;
    this.procPosMudarTiro();

    //andar
    this._seEhImpossivelExcep(infoAndar.tipoAndar);
    this._infoAndar = infoAndar.clone(this._formaGeometrica, pers);

    //tirar vida pers
    this._qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
    this._auxTirarVidaPers = 0;

    //para desenhar vida
    this._widthVida = this._vidaMAX*0.25;
    this._heightVida = 10;
    this._corVida = infoVida.corVida;
    this._mostrarVidaSempre = infoVida.mostrarVidaSempre;
    if (!this._mostrarVidaSempre)
      this._tempoMostrarVida = (infoVida.proporcTempoVida==null) ? tempoMostrarVidaPadrao :
        infoVida.proporcTempoVida*tempoMostrarVidaPadrao;
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
  procCriou(pers, indexContrInim)
  { pers.controladorTiros.procedimentoObjTelaColideCriar(this, ControladorTiros.INIMIGO_CRIADO, indexContrInim); }

  procPosMudarTiro()
  { this._decidirDirecaoTiro = this._podeAtirarQualquerLado && this._controladorTiros.tiroPadraoAtual.infoAndar.tipoAndar == Andar.SEGUIR_PERS; }

  //getters e setters andar
  get infoAndar()
  { return this._infoAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
      throw "Inimigo nao pode seguir inimigos";
  }
  setTipoAndar(tipo, pers)
  {
    this._seEhImpossivelExcep(tipo);
    this._infoAndar.setTipoAndar(tipo, this._formaGeometrica, pers);
  }
  //se for adicionar set qtdAndar, mudar this._hipotenusaAndarPadrao de acordo com o tipoAndar

  //ANDAR
  andar(pers, indexContrInim, indexInim)
  //retorna se deve continuar na lista
  {
    let qtdAndar = this._infoAndar.procAndar(pers, this._formaGeometrica);

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse inimigo andou, ele sai
    pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
      ControladorTiros.INIMIGOS_ANDOU, indexContrInim);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //ATIRAR
  atirar(conjuntoObjetosTela)
  {
    this._auxFreqTiro++;
    if (this._auxFreqTiro >= this._freqTiro)
    {
      this._auxFreqTiro = 0;
      console.log(this._decidirDirecaoTiro);
      if (this._decidirDirecaoTiro)
        super.atirar(conjuntoObjetosTela, Direcao.emQualDirecaoObjEsta(this._formaGeometrica, conjuntoObjetosTela.pers.formaGeometrica));
      else
        super.atirar(conjuntoObjetosTela);
    }
  }
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
    let t = this;
    setTimeout(
      function()
      {
        t._auxMostrarVida--;
        if (t._auxMostrarVida == 0)
          t._mostrarVida = false;
      }, this._tempoMostrarVida);
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

  //clone
  clone(pers)
  {
    return new Inimigo(this._formaGeometrica.clone(), this._corImgMorto,
      {vida: this._vida, corVida: this._corVida, mostrarVidaSempre: this._mostrarVidaSempre},
      this._controladorTiros.tiroPadrao.clone(), this._freqTiro, this._podeAtirarQualquerLado, this._qtdTiraVidaPersQndIntersec, this._infoAndar, pers);
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
