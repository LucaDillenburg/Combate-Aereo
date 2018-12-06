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


//INIMIGO
class InfoInimigo extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar, ehInimEssencial)
  {
    super(formaGeometrica, corImgMorto, vida, infoTiroPadrao);
    this.corVida = corVida;
    this.mostrarVidaSempre = mostrarVidaSempre;
    if (porcentagemTempoVida !== undefined)
      this.porcentagemTempoVida = porcentagemTempoVida;
    this.freqTiro = freqTiro;
    this.podeAtirarQualquerLado = podeAtirarQualquerLado;
    this.qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
    this.infoAndar = infoAndar;

    this.ehInimEssencial = ehInimEssencial; //soh o controladorInimigos que coloca
  }

  clone()
  { return new InfoInimigo(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), this.vida, this.corVida, this.mostrarVidaSempre, this.porcentagemTempoVida, this.infoTiroPadrao.clone(), this.freqTiro, this.podeAtirarQualquerLado, this.qtdTiraVidaPersQndIntersec, this.infoAndar.clone(), this.ehInimEssencial); }
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
    const _this = this;
    this._funcFreqAtirar = new FreqFunction(function() { _this._procedimentoAtirar(); }, this._freqTiro, true);
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
      this._tempoMostrarVida = (infoInimigo.porcentagemTempoVida===undefined) ? tempoMostrarVidaPadrao : infoInimigo.porcentagemTempoVida*tempoMostrarVidaPadrao;
    if (this._mostrarVidaSempre)
    //se soh vai mostrar sempre
      this._mostrarVida = true;
    else
    //se soh vai mostrar vida quando levar tiro
    {
      this._auxMostrarVida = 0;
      this._mostrarVidaCertoTempo();
    }

    //essencial
    this._ehInimEssencial = infoInimigo.ehInimEssencial;

    //congelado
    this._auxCongelar = 0;
    this._estahCongelado = false;
  }

  //procedimento ao criar: colisao com tiros do pers (nao precisa verificar colidir com o personagem aqui!)
  procCriou(indexContrInim)
  { ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, indexContrInim); }

  procPosMudarTiro()
  { this._decidirDirecaoTiro = this._podeAtirarQualquerLado && this._controladorTiros.infoTiroPadraoAtual.infoAndar.tipoAndar === Andar.SEGUIR_PERS; }

  //getters e setters andar
  get classeAndar()
  { return this._classeAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo === TipoAndar.SeguirInimMaisProx)
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
    if (this._estahCongelado) return true; //se estah congelado nao anda nem atira

    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse inimigo andou, ele sai
    ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y, indexContrInim);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      this._procColidiuPers(indexContrInim, indexInim);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //mudar tamanho
  mudarTamLados(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    super.mudarTamLados(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
    //soh tem que verificar se colidiu com tiros do personagem e personagem
    {
      //verificar colisao com tiros do personagem
      ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, indexContrInim);

      //verificar colisao com personagem
      procVerifColisaoPersInimEstatico(indexContr, indexInim);
    }
  }

  //ATIRAR
  atirar()
  {
    if (this._estahCongelado) return true; //se estah congelado nao anda nem atira

    this._funcFreqAtirar.contar(); //conta e se jah estiver na hora de atirar de acordo com a frequencia atira
  }
  _procedimentoAtirar()
  {
    if (this._decidirDirecaoTiro)
      super.atirar(Direcao.emQualDirecaoObjEsta(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica));
    else
      super.atirar();
  }

  get freqTiro()
  { return this._freqTiro; }
  get podeAtirarQualquerLado()
  { return this._podeAtirarQualquerLado; }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }

  //vida
  mudarVida(qtdMuda, colidiuTiroPers = false)
  //mudar vida de inimigo: verificar se deve colocar vida na tela ou nao
  {
    if (colidiuTiroPers && this._ehInimEssencial &&
      ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
    //se nao eh inimigo essencial e nesse momento mata-se inimigos com 1 tiro, se matar
      this.seMatar();
    else
    {
      super.mudarVida(qtdMuda);

      //a vida nao pode ser maior do que o maximo
      if (this._vida > this._vidaMAX)
        this._vida = this._vidaMAX;
    }

    //se soh mostra vida quando leva tiro
    //(mostra a vida ateh ficar um certo tempo sem levar tiro)
    if (!this._mostrarVidaSempre)
      this._mostrarVidaCertoTempo();
  }
  seMatar()
  {
    this._vida = 0;
    this.morreu();
  }
  _mostrarVidaCertoTempo()
  {
    this._mostrarVida = true;
    this._auxMostrarVida++;
    const _this = this;
    new Timer(
      function()
      {
        _this._auxMostrarVida--;
        if (_this._auxMostrarVida === 0)
          _this._mostrarVida = false;
      }, this._tempoMostrarVida, false, false
    );
  }
  get mostrarVidaSempre()
  { return this._mostrarVidaSempre; }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndar(indexContr, indexInim, qtdAndarX, qtdAndarY) //quando personagem for andar
  {
    if (Interseccao.vaiTerInterseccao(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica, qtdAndarX, qtdAndarY))
      this._procColidiuPers(indexContr, indexInim);
  }
  procVerifColisaoPersInimEstatico(indexContr, indexInim) //quando personagem ou inimigo for aumentar de tamanho
  {
    if (Interseccao.interseccao(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica))
      this._procColidiuPers(indexContr, indexInim);
  }
  _procColidiuPers(indexContr, indexInim)
  { ConjuntoObjetosTela.pers.colidiuInim(indexContr, indexInim, this._qtdTiraVidaPersQndIntersec); }

  //para quando um tiro for criado (ver se colide com esse inimigo)
  procColidirTiroCriado(tiro)
  //retorna se colidiu
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      tiro.tirarVidaObjCmVida(this, true);
      return true;
    }else
      return false;
  }

  //congelar e descongelar (POCAO)
  congelar()
  {
    this._auxCongelar++;
    this._estahCongelado = true;
  }
  descongelar()
  {
    this._auxCongelar--;
    if (this._auxCongelar === 0)
      this._estahCongelado = false;
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

    if (this._mostrarVida)
      this._desenharVida();
  }
  _desenharVida()
  {
    //desenha vida:
    const tamStrokeAtual = 0.8;
    strokeWeight(tamStrokeAtual);

    //DRAW VIDA:
    //draw vida em cima do inimigo
    const xVida = this._formaGeometrica.x + (this._formaGeometrica.width - this._widthVida)/2;
    const yVida = this._formaGeometrica.y - (this._heightVida + 5);

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


//PERSONAGEM PRINCIPAL
class InfoPersonagemPrincipal extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, infoTiroPadrao, qtdAndar)
  {
    super(formaGeometrica, corImgMorto, vida, infoTiroPadrao);
    this.qtdAndar = qtdAndar;
  }

  clone()
  { return new InfoPersonagemPrincipal(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), this.vida, this.infoTiroPadrao.clone(), this.qtdAndar); }
}
const freqMissilPers = 28;
class PersonagemPrincipal extends ObjComTiros
{
  constructor(infoPersonagemPrincipal, pontoInicial = {})
  {
    super(pontoInicial, infoPersonagemPrincipal);

    this._ehMissil = false; // o primeiro tiro tem que ser o normal

    this.qtdAndar = infoPersonagemPrincipal.qtdAndar;
    this._porcentagemAndarPadrao = 1;

    //lista de inimigos que intersectou
    this._qtdTirarVidaIntersecInim = 0;
    this._listaInfoInimIntersec = new ListaDuplamenteLigada();

    //pocoes do pers
    this._controladorPocoesPegou = new ControladorPocoesPers();

    //para nave especial
    //futuro atributo: this._direcaoTiroSaiPersEscolheu (nao precisa ocupar espaco agora)
  }

  get ehPersPrincipal() { return true; }

  //mudar qtdAndar e adicionar qtdAndarEspecial
  set qtdAndar(qtdAndar)
  {
    this._qtdAndar = qtdAndar;
    this._qtdAndarCadaDirDiag = Operacoes.diagonalQuad(qtdAndar);
  }
  mudarVelocidade(porcentagem)
  {
    this._porcentagemAndarPadrao *= porcentagem;
    this.qtdAndar = porcentagem*this._qtdAndar;
  }
  voltarVelocidadePadrao()
  {
    this.qtdAndar = this._qtdAndar / this._porcentagemAndarPadrao; //regra de 3 para voltar ao qtdAndar normal
    this._porcentagemAndarPadrao = 1;
  }

  procPosMudarTiro() //se for mudar o infoTiroPadrao (ou voltarTiroPadrao ou tipoAndar do tiro) chamar esse metodo
  {
    if (this._controladorTiros.infoTiroPadraoAtual.infoAndar.tipoAndar === TipoAndar.SeguirInimMaisProx) //se for missil
    {
      this._ehMissil = true;
      this._colocarProcedimentoAtirarMissil();
    }else
    {
      delete this._freqFuncAtirarMissil;
      this._ehMissil = false;
    }
  }

  mudarVida(qtdMuda)
  {
    const ret = super.mudarVida(qtdMuda);

    //se ganha vida e passa do suposto MAXIMO, ele nao para no maximo, mas sim aumenta o MAXIMO
    if (this._vida > this._vidaMAX)
      this._vidaMAX = this._vida;

    return ret;
  }
  morreu()
  {
    super.morreu();
    ConjuntoTimers.esvaziarTimers();
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
    if (direcaoX === null && direcaoY === null)
      return;

    let qtdAndarPadrao;
    if (direcaoX !== null && direcaoY !== null)
    //se personagem quer andar pra alguma diagonal
      qtdAndarPadrao = this._qtdAndarCadaDirDiag;
    else
      qtdAndarPadrao = this._qtdAndar;

    let qtdAndarX, qtdAndarY;
    //anda em X
    if (direcaoX !== null)
    {
      if (direcaoX === Direcao.Direita)
        qtdAndarX = qtdAndarPadrao;
      else
        qtdAndarX = -qtdAndarPadrao;
    }else
      qtdAndarX = 0;
    //anda em Y
    if (direcaoY !== null)
    {
      if (direcaoY === Direcao.Baixo)
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
    if (qtdMudaX === 0 && qtdMudaY === 0)
      return true;

    let infoQtdMudar =
    {
      qtdPodeMudarX : Tela.qtdAndarObjNaoSairX(this._formaGeometrica, qtdMudaX),
      qtdPodeMudarY : Tela.qtdAndarObjNaoSairY(this._formaGeometrica, qtdMudaY)
    };

    //nao conseguiu andar nada (por colidir com parede)
    if (infoQtdMudar.qtdPodeMudarX === 0 && infoQtdMudar.qtdPodeMudarY === 0)
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
      ConjuntoObjetosTela.controladoresInimigos[i].procPersAndarTodosInim(infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
      //ve se vai colidir com tiros dos inimigos e tira vida do pers
      ConjuntoObjetosTela.controladoresInimigos[i].procObjTelaAndarColidirTirosTodosInim(this, infoQtdMudar.qtdPodeMudarX,
        infoQtdMudar.qtdPodeMudarY);
    }

    //controladoresTiros do jogo
    for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);

    //verifica se colidiu com pocao
    ConjuntoObjetosTela.controladorPocaoTela.verificarPersPegouPocao(infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += infoQtdMudar.qtdPodeMudarX;
    this._formaGeometrica.y += infoQtdMudar.qtdPodeMudarY;

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX === qtdMudaX && infoQtdMudar.qtdPodeMudarY === qtdMudaY;
  }

  //mudar tamanho
  mudarTamLados(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    super.mudarTamLados(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
    //soh tem que verificar se colidiu com inimigos, obstaculos e tiros se aumentou de tamanho
    {
      //ver se colidiu com tiros do inimigo e do jogo
      for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
        ConjuntoObjetosTela.controladoresInimigos[i].procObjCriadoColidirTirosInim(this); //tiros inimigos
      for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
        ConjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideCriar(this); //tiros jogo

      //ver se colidiu com inimigo
      for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
        ConjuntoObjetosTela.controladoresInimigos[i].procPersCresceuTodosInim();

      //ver se colidiu com obstaculos: se colidiu ver qtdAndar e andar, se nao conseguir explode obstaculo (como procCriou do obstaculo)
      for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
        ConjuntoObjetosTela.controladoresObstaculos[i].procPersonagemCresceuTodosObst();
    }
  }

  //atirar
  atirar()
  {
    if (this._ehMissil)
      this._freqFuncAtirarMissil.contar(); //conta e se jah estiver na hora de atirar de acordo com a frequencia atira
    else
      super.atirar(this._direcaoTiroSaiPersEscolheu, this._direcaoTiroSaiPersEscolheu!==undefined);
      //soh precisa ajustar a direcao do tiro do pers se personagem estah com nave especial e escolhe para que lado atirar
  }
  _colocarProcedimentoAtirarMissil()
  {
    const _this = this;
    this._freqFuncAtirarMissil = new FreqFunction(function() { _this._atirarSuper(); }, freqMissilPers, true);
  }
  _atirarSuper() { super.atirar(this._direcaoTiroSaiPersEscolheu, false); }

  //posicao tiro
  colocarNaveEspecial(formaGeomNaveEsp)
  //pode atirar para todos os lados (usuario escolhe)
  {
    this._formaGeometrica = formaGeomNaveEsp.clone(this._formaGeometrica.x, this._formaGeometrica.y);
    this._direcaoTiroSaiPersEscolheu = Direcao.Cima;
  }
  mudarDirecaoTiroSai(direcao)
  {
    if (this._direcaoTiroSaiPersEscolheu !== undefined)
    //se ele jah pode escolher o lado do tiro
      this._direcaoTiroSaiPersEscolheu = direcao;
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
      if (this._listaInfoInimIntersec.atual.indexContr === indexContr &&
        this._listaInfoInimIntersec.atual.indexInim === indexInim)
        return true;
    return false;
  }
  procTirarVidaIntersecInim()
  {
    this.mudarVida(-this._qtdTirarVidaIntersecInim);
    this.zerarInimigosIntersectados();
  }

  //POCOES
  get controladorPocoesPegou()
  { return this._controladorPocoesPegou; }

  //draw
  draw()
  {
    super.draw();
    this._colocacarVidaTela();
    this._controladorPocoesPegou.draw(); //desenha as pocoes que o personagem tem guardados
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
    const fontSize = 22;
    textSize(fontSize);
    text("Vida: " + this._vida + "/" + this._vidaMAX, 5, height - heightVidaUsuario + fontSize);
  }
}
