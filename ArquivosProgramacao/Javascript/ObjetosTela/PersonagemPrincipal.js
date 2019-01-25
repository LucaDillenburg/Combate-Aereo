//PERSONAGEM PRINCIPAL
class InfoPersonagemPrincipal extends InfoObjetoComArmas
{
  constructor(formaGeometrica, corImgMorto, vida, qtdAndar, infoArmas, qtdHelices, qtdsRotateDifHelices)
  {
    super(formaGeometrica, corImgMorto, vida, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.qtdAndar = qtdAndar;
  }
}
const heightVidaUsuario = 30;
//para aviao Master: (de acordo com "TER EM MENTE.txt")
const indexArmaNaoAutomaticaAviaoMasterPers = 0;
const numeroAviaoMasterPers = 3; //eh o Terceiro aviao
const maxRotacionarArmaGiratoriaPers = PI/24;
class PersonagemPrincipal extends ObjetoComArmas
{
  constructor(infoPersonagemPrincipal, pontoInicial = {}, numeroAviao=1)
  {
    super(pontoInicial, infoPersonagemPrincipal);

    //andar
    this.qtdAndar = infoPersonagemPrincipal.qtdAndar;

    //para sistema de colisao com inimigos
    this.zerarInimigosIntersectados();

    //pocoes do pers
    this._controladorPocoesPegou = new ControladorPocoesPers();

    //numero aviao (pra saber qual aviao eh). Comeca em ZERO
    this._numeroAviao = numeroAviao;
  }

  get numeroAviao() { return this._numeroAviao; }
  get ehAviaoMaster() { return this._numeroAviao===numeroAviaoMasterPers; }
  //quando for trocar de nave
  novaNave(infoPersonagemPrincipal)
  //soh o (x,y) vai ser "igual" (ajeitar por causa do tamanho da nova formaGeometrica)
  // TODO: o tanto de vida que resta vai fazer alguma diferenca na vida da nova nave
  {
    // (x,y) para nave crescer o mesmo tanto em todos os lados
    const qtdMudouEmWidth = this._formaGeometrica.width - infoPersonagemPrincipal.formaGeometrica.width;
    const qtdMudouEmHeight = this._formaGeometrica.height - infoPersonagemPrincipal.formaGeometrica.height;
    const pontoInicial = new Ponto(this._formaGeometrica.x + qtdMudouEmWidth/2, this._formaGeometrica.y + qtdMudouEmHeight/2);

    // cria proxima nave do personagem
    let persNovaNave = new PersonagemPrincipal(infoPersonagemPrincipal, pontoInicial, this._numeroAviao+1);

    // adicionar os tiros da nave "antiga" na nova (para tiros do personagem nao desaparecerem simplesmente depois dele mudar de nave)
    this._armas.forEach(arma =>
        persNovaNave._armas[0].controlador.concatenarTiros(arma.controlador));

    // se aumentou de tamanho, fazer os devidos procedimentos
    if (infoPersonagemPrincipal.formaGeometrica.width > this._formaGeometrica.width //se cresceu em width
      || infoPersonagemPrincipal.formaGeometrica.height > this._formaGeometrica.height) // ou se cresceu em height
      persNovaNave._aumentouTamanho();

    // retorna nova
    return persNovaNave;
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
    ConjuntoTimers.excluirTimers();
  }

  //mudar (x,y)
  colocarLugarInicial()
  //nao verifica se vai bater em alguem
  {
    this._formaGeometrica.colocarNoMeioX();
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
    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      controladorObsts.qtdPersPodeAndar(infoQtdMudar));
    //aqui tudo o que devia ser feito com obstaculos estah OK

    // quando personagem eh barrado, ele perde vida
    infoQtdMudar.obstaculosBarram.forEach(obstaculoBarrou => obstaculoBarrou.tirarVidaPersBateu());

    //nao conseguiu andar nada (por colidir com obstaculo)
    if (infoQtdMudar.qtdPodeMudarX === 0 && infoQtdMudar.qtdPodeMudarY === 0)
      return false;

    //nao precisa zerarInimigosColididos aqui porque jah vai zerar depois que tirar a vida do personagem (ateh poderia, porem se andar inimigos antes do personagem nao daria erro)
    //inimigos e tiros deles
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      {
        //ve se vai colidir com inimigos e adiciona no vetor de inimigos intersectados
        controladorInims.procPersAndar(infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
        //ve se vai colidir com tiros dos inimigos e tira vida do pers
        controladorInims.procObjAndarColidirTirosInims(this, infoQtdMudar.qtdPodeMudarX,
          infoQtdMudar.qtdPodeMudarY);
      });

    //controladoresTiros do jogo
    ControladorJogo.controladoresTirosJogo.forEach(controladorTirosJogo =>
      controladorTirosJogo.procObjVaiAndarColideTiros(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY));

    //verifica se colidiu com pocao
    ControladorJogo.controladorPocaoTela.verificarPersPegouPocao(infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);

    //aqui qtdVaiMudarX e qtdVaiMudarY sao os maiores possiveis (a menor distancia que bateu)
    this._formaGeometrica.x += infoQtdMudar.qtdPodeMudarX;
    this._formaGeometrica.y += infoQtdMudar.qtdPodeMudarY;

    // verifica se personagem estah completamente dentro da oficina agora
    if (ControladorJogo.oficina !== undefined)
      ControladorJogo.oficina.verificarEstahConsertando();

    //se consegue andar tudo o que deveria
    return infoQtdMudar.qtdPodeMudarX === qtdMudaX && infoQtdMudar.qtdPodeMudarY === qtdMudaY;
  }

  //mudar tamanho
  mudarTamanho(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    this._formaGeometrica.mudarTamanho(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
      this._aumentouTamanho();
  }
  _aumentouTamanho()
  {
    //tem que verificar se colidiu com inimigos, obstaculos e tiros se aumentou de tamanho

    //colisao com tiros dos inimigos e inimigos em si
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      {
        controladorInims.procObjCriadoColidirTirosInims(this)
        controladorInims.procPersCresceu();
      });
    //colisao com tiros do jogo
    ControladorJogo.controladoresTirosJogo.forEach(controladorTirosJogo =>
      controladorTirosJogo.procObjCriadoColideTiros(this)); //tiros jogo
    //colisao com obstaculos
    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      controladorObsts.procPersCresceu());
  }

  //sobre ter intersectar com inimigos
  zerarInimigosIntersectados()
  {
    this._infoInimsIntersec = [];
    this._qtdTirarVidaIntersecInim = 0;
  }
  colidiuInim(indexContrInim, indexInim, qtdTiraVidaPersQndIntersec)
  //indexContrInim: index controlador inimigo colidiu (para saber se jah contou que colidiu ou nao: pois podem colidir no andar do personagem e/ou no andar do inimigo)
  {
    if (this._jahColidiuInim(indexContrInim, indexInim))
    //se personagem jah adicionou que colidiu nao precisa adicionar de novo
      return;

    //inserir no vetor e somar
    this._infoInimsIntersec.push({indexContrInim: indexContrInim, indexInim: indexInim});
    this._qtdTirarVidaIntersecInim += qtdTiraVidaPersQndIntersec;
  }
  _jahColidiuInim(indexContrInim, indexInim)
  //indexContrInim: index controlador inimigo quer saber se colidiu
  {
    // retorna se jah tem algum info no vetor com o mesmo indexContrInim e indexInim
    return this._infoInimsIntersec.some(infoInimIntersec =>
      infoInimIntersec.indexContrInim === indexContrInim && infoInimIntersec.indexInim === indexInim);
  }
  procPerderVidaIntersecInim()
  {
    this.mudarVida(-this._qtdTirarVidaIntersecInim);
    this.zerarInimigosIntersectados();
  }

  //POCOES
  get controladorPocoesPegou()
  { return this._controladorPocoesPegou; }

  //draw
  draw(desenharPainel)
  //desenharPainel: se for true, soh desenha vida e pocoes do personagem; se for false, soh desenha o personagem e seus tiros
  //ps: se for undefined, desenhar os dois
  {
    if (!desenharPainel || desenharPainel===undefined)
      super.draw();

    if (desenharPainel || desenharPainel===undefined)
    {
      this._colocacarVidaTela();
      this._controladorPocoesPegou.draw(); //desenha as pocoes que o personagem tem guardados
    }
  }
  _colocacarVidaTela()
  {
    stroke(0);
    fill(255);
    rect(0, height - heightVidaUsuario, width, heightVidaUsuario);

    noStroke(0);
    fill("green");
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