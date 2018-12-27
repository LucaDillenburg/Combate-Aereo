//PERSONAGEM PRINCIPAL
class InfoPersonagemPrincipal extends InfoObjComTiros
{
  constructor(formaGeometrica, corImgMorto, vida, qtdAndar, configuracoesAtirar, qtdHelices, qtdsRotateDifHelices)
  {
    super(formaGeometrica, corImgMorto, vida, configuracoesAtirar, qtdHelices, qtdsRotateDifHelices);
    this.qtdAndar = qtdAndar;
  }
}
const freqMissilPers = 22;
const maxRotacionarArmaGiratoriaPers = PI/24;
class PersonagemPrincipal extends ObjComTiros
{
  constructor(infoPersonagemPrincipal, pontoInicial = {})
  {
    super(pontoInicial, infoPersonagemPrincipal);

    //andar
    this.qtdAndar = infoPersonagemPrincipal.qtdAndar;

    //lista de inimigos que intersectou
    this._qtdTirarVidaIntersecInim = 0;
    this._listaInfoInimIntersec = new ListaDuplamenteLigada();

    //pocoes do pers
    this._controladorPocoesPegou = new ControladorPocoesPers();
  }

  //quando for trocar de nave
  colocarOutraNave(formaGeometrica, corImgMorto, configuracoesAtirar)
  // soh nao precisa de: vida e qtdAndar (nao mudam)
  {
    // soma em (x,y) para nave crescer o mesmo tanto em todos os lados
    const somaX = this._formaGeometrica.width - formaGeometrica.width;
    const somaY = this._formaGeometrica.height - formaGeometrica.height;
    this._formaGeometrica = formaGeometrica.clone(this._formaGeometrica.x + somaX, this._formaGeometrica.y + somaY);

    this._corImgMorto = AuxInfo.cloneImgCor(corImgMorto);

    this._setarConfigContrTiros(configuracoesAtirar);

    if (formaGeometrica.width > this._formaGeometrica.width //se cresceu em width
      || formaGeometrica.height > this._formaGeometrica.height) // ou se cresceu em height
    // se aumentar, fazer os devidos procedimentos
      this._aumentouTamLados();
  }

  //mudar qtdAndar e adicionar qtdAndarEspecial
  get qtdAndar() { return this._qtdAndar; }
  set qtdAndar(qtdAndar)
  {
    this._qtdAndar = qtdAndar;
    this._qtdAndarCadaDirDiag = Operacoes.diagonalQuad(qtdAndar);
  }
  mudarVelocidade(porcentagem)
  { this.qtdAndar = porcentagem*this._qtdAndar; }

  // procedimentos com tiros
  procPosMudarTiroZero() //se for mudar o infoTiroPadrao (ou voltarTiroPadrao ou tipoAndar do tiro) chamar esse metodo
  // missil do personagem soh fica no index = 0
  {
    if (this._configContrTiros[0].controlador.infoTiroPadraoAtual.infoAndar.tipoAndar === TipoAndar.SeguirInimMaisProx)
    //se for missil
    {
      //guardar frequencia antiga
      this._freqAtirarNaoMissil = this._configContrTiros[0].freqFunc.freq;

      //soh precisa mudar o freqAtirar (infoTiroPadrao jah foi mudado)
      this._configContrTiros[0].freqFunc.freq = freqMissilPers;
    }
    else
    {
      //voltar frequencia antiga
      this._configContrTiros[0].freqFunc.freq = this._freqAtirarNaoMissil;

      //deletar variavel que guardava frequencia antiga
      delete this._freqAtirarNaoMissil;
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

    const qtdAndarNaoSairX = Tela.qtdAndarObjNaoSairX(this._formaGeometrica, qtdMudaX);
    const qtdAndarNaoSairY = Tela.qtdAndarObjNaoSairY(this._formaGeometrica, qtdMudaY);
    let infoQtdMudar =
    {
      qtdMudarXPadrao: qtdAndarNaoSairX,
      qtdMudarYPadrao: qtdAndarNaoSairY,
      qtdPodeMudarX : qtdAndarNaoSairX,
      qtdPodeMudarY : qtdAndarNaoSairY,
      obstaculosBarram : []
    };

    //nao conseguiu andar nada (por colidir com parede)
    if (infoQtdMudar.qtdPodeMudarX === 0 && infoQtdMudar.qtdPodeMudarY === 0)
      return false;

    //obstaculos
    //colisao com obstaculos, vai definir quanto pode andar em cada direcao
    for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
      ConjuntoObjetosTela.controladoresObstaculos[i].qtdPersPodeAndar(infoQtdMudar);
    //aqui tudo o que devia ser feito com obstaculos estah OK

    // quando personagem eh barrado, ele perde vida
    infoQtdMudar.obstaculosBarram.forEach(obstaculoBarrou => { obstaculoBarrou.tirarVidaPersBateu(); });

    //nao conseguiu andar nada (por colidir com obstaculo)
    if (infoQtdMudar.qtdPodeMudarX === 0 && infoQtdMudar.qtdPodeMudarY === 0)
      return false;

    //nao precisa zerarInimigosColididos aqui porque jah vai zerar depois que tirar a vida do personagem (ateh poderia, porem se andar inimigos antes do personagem nao daria erro)
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

    // verifica se personagem estah completamente dentro da oficina agora
    if (ConjuntoObjetosTela.oficina !== undefined)
      ConjuntoObjetosTela.oficina.verificarEstahConsertando();

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX === qtdMudaX && infoQtdMudar.qtdPodeMudarY === qtdMudaY;
  }

  //mudar tamanho
  mudarTamLados(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    super.mudarTamLados(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
      this._aumentouTamLados();
  }
  _aumentouTamLados()
  {
    //soh tem que verificar se colidiu com inimigos, obstaculos e tiros se aumentou de tamanho

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

  //com todos os controladores tiros
  procObjTelaColideCriarTodosContrTiros(obj, indexContr)
  {
    for (let i = 0; i<this._configContrTiros.length; i++)
      this._configContrTiros[i].controlador.procedimentoObjTelaColideCriar(obj, indexContr);
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
    text("Vida: " + (this._vida.toFixed(Operacoes.primAlgoritDpVirgulaEhZero(this._vida)?0:1)) + "/" +
      (this._vidaMAX.toFixed(Operacoes.primAlgoritDpVirgulaEhZero(this._vidaMAX)?0:1)),
      5, height - heightVidaUsuario + fontSize);
  }
}
