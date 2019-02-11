//PERSONAGEM PRINCIPAL
class InfoPersonagemPrincipal extends InfoObjetoComArmas_e_Vida
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, vida, qtdAndar, infoArmas, qtdHelices, qtdsRotateDifHelices)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto, vida, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.qtdAndar = qtdAndar;
  }
}
const heightVidaUsuario = 30;
//para aviao Master: (de acordo com "TER EM MENTE.txt")
const indexArmaNaoAutomaticaAviaoMasterPers = 0;
const numeroAviaoMasterPers = 3; //eh o Terceiro aviao
const maxRotacionarArmaGiratoriaPers = PI/24;
//para painel
const opacidadePainelPersObjsEmBaixo = 0.4;
class PersonagemPrincipal extends ObjetoComArmas_e_Vida
{
  constructor(infoPersonagemPrincipal, pontoInicial = {}, controladorPocoesPegou)
  //pontoInicial e controladorPocoesPegou eh soh para quando for trocar de Aviao
  {
    super(pontoInicial, infoPersonagemPrincipal);

    //andar
    this.qtdAndar = infoPersonagemPrincipal.qtdAndar;

    //para sistema de colisao com inimigos
    this.zerarInimigosIntersectados();

    //pocoes do pers
    if (controladorPocoesPegou === undefined)
    //primeiro aviao
      this._controladorPocoesPegou = new ControladorPocoesPers();
    else
    //para quando trocar de aviao nao perder as pocoes
    {
      this._controladorPocoesPegou = controladorPocoesPegou;
      this._controladorPocoesPegou.procPersMudouAviao();
    }

    //numero aviao (pra saber qual aviao eh). Comeca em ZERO
    this._numeroAviao = infoPersonagemPrincipal.numeroAviao;

    if (this.ehAviaoMaster)
      this._vetorMiraArmaGiratoria = [];
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
    let persNovaNave = new PersonagemPrincipal(infoPersonagemPrincipal, pontoInicial, this._controladorPocoesPegou);

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
  get indexTiroMelhor() //para Pocao
  { return (this.ehAviaoMaster) ? 1 : 0; }

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
      objetosBarraram : []
    };

    //nao conseguiu andar nada (por colidir com parede)
    if (infoQtdMudar.qtdPodeMudarX === 0 && infoQtdMudar.qtdPodeMudarY === 0)
      return false;

    //colisao com obstaculos e suportesAereos: vai definir quanto pode andar em cada direcao
    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      controladorObsts.qtdPersPodeAndar(infoQtdMudar));
    ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.qtdPersPodeAndar(infoQtdMudar));

    // quando personagem eh barrado, ele perde vida
    infoQtdMudar.objetosBarraram.forEach(objBarrou =>
        {
          if (objBarrou instanceof Obstaculo)
            objBarrou.tirarVidaPersBateu();
        });

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

    //tiros sem dono e dos suportesAereos
    ControladorJogo.controladorOutrosTirosNaoPers.procObjVaiAndarColideTiros(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
    ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo =>
      suporteAereo.procObjVaiAndarColideTiros(this, infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY));

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
    //colisao com tiros sem dono
    ControladorJogo.controladorOutrosTirosNaoPers.procObjCriadoColideTiros(this);
    //colisao com tiros dos suportesAereos
    ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.procObjCriadoColideTiros(this));
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
  draw(tipoDrawPers)
  //desenharPainel: se for true, soh desenha vida e pocoes do personagem; se for false, soh desenha o personagem e seus tiros
  //ps: se for undefined, desenhar os dois
  {
    //parte do ceu
    if (tipoDrawPers === TipoDrawPersonagem.ParteDoCeu || tipoDrawPers===undefined)
      this._desenharParteCeu();

    //mira arma giratoria
    if (this.ehAviaoMaster &&
      (tipoDrawPers === TipoDrawPersonagem.MiraArmaGiratoria || tipoDrawPers===undefined))
      this._desenharMiraArmaGiratoria();

    //painel
    if (tipoDrawPers === TipoDrawPersonagem.Painel || tipoDrawPers===undefined)
      this._desenharPainelPers();
  }

  //auxiliares draw

    //parte do ceu
  _desenharParteCeu()
  //desenhar coisas do personagem que estao no ceu (Personagem, Tiros e MiraArmaGiratoria)
  {
    //desenha personagem e tiros
    super.draw();
  }

    //mira arma giratoria
  _desenharMiraArmaGiratoria()
  {
    push();

    //DESENHAR MIRA ARMA GIRATORIA
    const maxMirasArmaGiratoria = 6;
    const raioPrimeiraMira = 8;
    const porcTamUltimaMira = 0.2;
    const opacidadeUltimaMira = 0.3;
    const corMira = color(230, 0, 0);
    const strokeMira = color(128, 0, 0);

    //se antes de adicionar a mira mais recente jah estah com o maximo de miras, tem que tirar a mais antiga (a primeira)
    if (this._vetorMiraArmaGiratoria.length >= maxMirasArmaGiratoria)
      this._vetorMiraArmaGiratoria.shift();

    //a mira da arma giratoria mais recente estarah por ultimo
    this._vetorMiraArmaGiratoria.push(new Ponto(mouseX, mouseY));

    //tem que mudar o raio e a opacidade a cada miraArma desenhada
      //raio
    const qtdMudaTamanhoCadaMira = (raioPrimeiraMira - porcTamUltimaMira*raioPrimeiraMira)/(maxMirasArmaGiratoria-1);
    let raioMiraAtual = raioPrimeiraMira - qtdMudaTamanhoCadaMira*(this._vetorMiraArmaGiratoria.length-1)/*raio mira mais antiga (primeira posicao do array)*/;
      //opacidade
    const qtdMudaOpacidadeCadaMira = (1 - opacidadeUltimaMira)/(maxMirasArmaGiratoria-1);
    let opacidadeMiraAtual = 1 - qtdMudaOpacidadeCadaMira*(this._vetorMiraArmaGiratoria.length-1)/*opacidade mira mais antiga (primeira posicao do array)*/;
      //stroke
    stroke(strokeMira);
    this._vetorMiraArmaGiratoria.forEach(miraArma =>
      {
        fill(color(red(corMira), green(corMira), blue(corMira), opacidadeMiraAtual*255));
        ellipse(miraArma.x, miraArma.y, raioMiraAtual*2, raioMiraAtual*2);

        //mudar raioMiraAtual e opacidadeMiraAtual
        raioMiraAtual += qtdMudaTamanhoCadaMira;
        opacidadeMiraAtual += qtdMudaOpacidadeCadaMira;
      });

    //soh para dar um efeito
    const diametroCirculoFinal = 10;
    const ultimaMiraArma = this._vetorMiraArmaGiratoria[this._vetorMiraArmaGiratoria.length-1];
    noStroke();
    fill("red");
    ellipse(ultimaMiraArma.x, ultimaMiraArma.y, diametroCirculoFinal);

    pop();
  }

    //parte do painel
  _desenharPainelPers()
  {
    //vida
    this._desenharVida();

    //as pocoes que o personagem tem guardados
    this._controladorPocoesPegou.draw();

    //retangulos que simbolizam quanto falta para personagem poder atirar com arma nao automatica
    if (this.ehAviaoMaster && this._controladorPocoesPegou.codPocaoSendoUsado!==TipoPocao.PersComMissil)
      this._desenharFreqArmaNaoAutom();
  }
  _desenharFreqArmaNaoAutom()
  {
    push();

    //constantes de front-end
    const widthRet = 120;
    const heightRet = 13;
    const qtdPxlsEntreRet = 4;
    const qtdPxlsAfastadoParede = 8;
    const qtdPxlsAfastadoVida = 8;

    //qtd retangulos
    const freqFuncArmaNaoAutom = this._armas[indexArmaNaoAutomaticaAviaoMasterPers].freqFunc;
    const qtdRetangulos = 5; //porque a frequencia eh muito grande e eu nao quero que desenhem tantos retangulos assim;
    const count = (freqFuncArmaNaoAutom.count===0) ? freqFuncArmaNaoAutom.freq : freqFuncArmaNaoAutom.count; //porque quando
    // para saber quantos retangulos prontos: Regra de 3 ([frequencia] estah para [qtdRetangulos] assim como [count] estah para [qtdRetProntos])
    const qtdRetProntos = Math.floor(qtdRetangulos*count/freqFuncArmaNaoAutom.freq);

    //(x,y)
    const x = width - (widthRet + qtdPxlsAfastadoParede);
    let y = height - (heightVidaUsuario + qtdPxlsAfastadoVida + heightRet);
    let qtdMudaY = - (heightRet + qtdPxlsEntreRet);

    //se tem algum objeto importante no espaco onde iria printar a frequencia do atirar nao automatico
    let opacidadeRetangulos;
    if (ControladorJogo.algumObjetoImportanteNesseEspaco(new Retangulo(x, y + qtdMudaY*(qtdRetangulos-1),
      widthRet, qtdPxlsEntreRet*(qtdRetangulos-1) + heightRet*qtdRetangulos)))
      opacidadeRetangulos = opacidadePainelPersObjsEmBaixo*255;
    else {} //deixa undefined mesmo

    for (let i = 0; i<qtdRetangulos; i++)
    {
      let corRet;
      if (i < qtdRetProntos)
      //desenhar retangulo pronto
        corRet = {fill: color(13, 13, 13, opacidadeRetangulos), stroke: color(0,0,0, opacidadeRetangulos)};
      else
      //desenhar retangulo nao pronto
        corRet = {fill: color(191, 191, 191, opacidadeRetangulos), stroke: color(176, 176, 176, opacidadeRetangulos)};

      stroke(corRet.stroke);
      fill(corRet.fill);
      rect(x, y, widthRet, heightRet);

      //o y muda
      y += qtdMudaY;
    }

    pop();
  }
  _desenharVida()
  {
    push();

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
    textAlign(CENTER, LEFT);
    text("Vida: " + (this._vida.toFixed(Operacoes.primAlgoritDpVirgulaEhZero(this._vida)?0:1)) + "/" +
      (this._vidaMAX.toFixed(Operacoes.primAlgoritDpVirgulaEhZero(this._vidaMAX)?0:1)),
      15, height - heightVidaUsuario + fontSize);

    pop();
  }
}

const TipoDrawPersonagem = {"ParteDoCeu": 1, "MiraArmaGiratoria": 2, "Painel": 3}
