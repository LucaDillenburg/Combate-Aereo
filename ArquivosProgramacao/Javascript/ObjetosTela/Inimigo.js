//INIMIGO
 //backend
const tempoMostrarVidaPadrao = 1000;
const maxRotacionarArmaGiratoriaInim = PI/32;
 //visual:
const heightVidaInim = 10;
const porcWidthVidaInim = 0.25;
const absWidthVidaInim = 40;
class InfoInimigo extends InfoObjetoComArmas_e_Vida
{
  constructor(formaGeometrica, infoImgMorto, vida, corVida, mostrarVidaSempre=true, porcentagemTempoVida, qtdTiraVidaPersQndIntersec, infoAndar, rotacionarInimAnguloAnda=false, infoArmas, qtdHelices, qtdsRotateDifHelices, ehInimEssencial)
  //ehInimEssencial: soh o controladorInimigos que coloca
  {
    super(formaGeometrica, infoImgMorto, vida, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.corVida = corVida;
    this.mostrarVidaSempre = mostrarVidaSempre;
    if (porcentagemTempoVida !== undefined)
      this.porcentagemTempoVida = porcentagemTempoVida;
    this.qtdTiraVidaPersQndIntersec = qtdTiraVidaPersQndIntersec;
    this.infoAndar = infoAndar;
    this.rotacionarInimAnguloAnda = rotacionarInimAnguloAnda;
    this.ehInimEssencial = ehInimEssencial;
  }

  clone()
  { return new InfoInimigo(this.formaGeometrica, this.infoImgMorto.clone(), this.vida, AuxInfo.cloneImgCor(this.corVida), this.mostrarVidaSempre, this.porcentagemTempoVida, this.qtdTiraVidaPersQndIntersec, this.infoAndar.clone(), this.rotacionarInimAnguloAnda, cloneVetorComClone(this.infoArmas), this.qtdHelices, cloneVetor(this.qtdsRotateDifHelices), this.ehInimEssencial); }
}
class Inimigo extends ObjetoComArmas_e_Vida
{
  constructor(pontoInicial, infoInimigo)
  {
    super(pontoInicial, infoInimigo);

    //andar
    this._seEhImpossivelExcep(infoInimigo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoInimigo.infoAndar, this._formaGeometrica);
    this._rotacionarInimAnguloAnda = infoInimigo.rotacionarInimAnguloAnda;

    //tirar vida pers
    this._qtdTiraVidaPersQndIntersec = infoInimigo.qtdTiraVidaPersQndIntersec;
    this._auxTirarVidaPers = 0;

    //para desenhar vida
    this._corVida = AuxInfo.cloneImgCor(infoInimigo.corVida);
    this._mostrarVidaSempre = infoInimigo.mostrarVidaSempre;
    if (!this._mostrarVidaSempre)
      this._tempoMostrarVida = (infoInimigo.porcentagemTempoVida===undefined) ? tempoMostrarVidaPadrao : infoInimigo.porcentagemTempoVida*tempoMostrarVidaPadrao;
    if (this._mostrarVidaSempre)
    //se soh vai mostrar sempre
      this._mostrarVida = true;
    else
    //se soh vai mostrar vida quando levar tiro
    {
      this._funcCamadasMostrarVida = new FuncEmCamadas();
      this._mostrarVidaCertoTempo();
    }

    //essencial
    this._ehInimEssencial = infoInimigo.ehInimEssencial;

    //congelado
    this._funcCamadasCongelar = new FuncEmCamadas();
    this._estahCongelado = false;
  }

  //procedimento ao criar: colisao com tiros do pers (nao precisa verificar colidir com o personagem aqui! pois quando ele for andar jah vai colidir jah que Interseccao.vaiTerInterseccao(...) verifica se jah estah intersectando antes)
  procCriou()
  { ControladorJogo.pers.procObjCriadoColideTiros(this); }

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
  //retorna se deve continuar no vetor de inimigos
  //indexContrInim: precisa pra colidir com pers
  {
    if (this._estahCongelado) return true; //se estah congelado nao anda nem atira

    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    if (this._rotacionarInimAnguloAnda)
    {
      //rotacionar inim de modo a ele ficar com o angulo de rotacao igual ao angulo que ele vai andar
      /*NAO MUDAR ISSO!!:*/this._formaGeometrica = this._formaGeometrica.setRotacao(this._classeAndar.anguloQtdAndar);
      //ps: "this._formaGeometrica = " para funcionar para FormasGeometricasSimples tambem
    }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair do vetor de tiros porque esse inimigo andou, ele sai
    ControladorJogo.pers.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y);

    //verificar se nao vai intersectar personagem
    if (this._vivo && Interseccao.vaiTerInterseccao(ControladorJogo.pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y))
      ControladorJogo.pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return AuxObjetos.continuaNoVetor(this);
  }

  //mudar tamanho
  mudarTamanho(porcentagem, indexContr, indexInim)
  {
    //muda o tamanho de formaGeometrica
    this._formaGeometrica.mudarTamanho(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
    //soh tem que verificar se colidiu com tiros do personagem e personagem
    {
      //verificar colisao com tiros do personagem
      ControladorJogo.pers.procObjTelaColideCriarTodosContrTiros(this);

      //verificar colisao com personagem
      this.procVerifColisaoPersInimEstatico(indexContr, indexInim);
    }
  }

  //ATIRAR
  atirar()
  {
    if (this._estahCongelado) return; //se estah congelado nao anda nem atira

    // atirar propriamente dito
    super.atirar();
  }

  //tirar vida personagem quando intersecta com inimigo
  get qtdTiraVidaPersQndIntersec()
  { return this._qtdTiraVidaPersQndIntersec; }

  //vida
  mudarVida(qtdMuda, colidiuTiroPers = true)
  //mudar vida de inimigo: verificar se deve colocar vida na tela ou nao
  {
    if (colidiuTiroPers && !this._ehInimEssencial &&
      ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
    //se nao eh inimigo essencial e nesse momento mata-se inimigos com 1 tiro, se matar
    // PARTE DA EXECUCAO DA POCAO
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
    this._funcCamadasMostrarVida.subirCamada();
    new Timer(() =>
      {
        if (this._funcCamadasMostrarVida.descerCamada())
          this._mostrarVida = false;
      }, this._tempoMostrarVida);
  }
  get mostrarVidaSempre()
  { return this._mostrarVidaSempre; }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndar(indexContrInim, indexInim, qtdAndarX, qtdAndarY) //quando personagem for andar
  //indexContrInim: precisa pra colidir com pers
  {
    if (Interseccao.vaiTerInterseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica, qtdAndarX, qtdAndarY))
      ControladorJogo.pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);
  }
  procVerifColisaoPersInimEstatico(indexContrInim, indexInim) //quando personagem ou inimigo for aumentar de tamanho
  //indexContrInim: precisa pra colidir com pers
  {
    if (Interseccao.interseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica))
      ControladorJogo.pers.colidiuInim(indexContrInim, indexInim, this._qtdTiraVidaPersQndIntersec);
  }

  // para ControladorInimigos
  procVaiSerRemovido()
  {
    //para tiros com TipoAndar.SeguirInimMaisProx pararem de seguir ele
    this._vivo = false;

    // passar todos os tiros para o controladorTirosJogo (se nao os tiros do inimigo simplesmente sumiriam)
    this._armas.forEach(arma =>
      ControladorJogo.controladorOutrosTirosNaoPers.concatenarTiros(arma.controlador));
  }


  //POCAO
  //congelar e descongelar
  congelar()
  {
    this._funcCamadasCongelar.subirCamada();
    this._estahCongelado = true;
  }
  descongelar()
  {
    if (this._funcCamadasCongelar.descerCamada())
      this._estahCongelado = false;
  }

  //desenho
  get corVida()
  { return this._corVida; }
  set corVida(vida)
  { this._corVida = vida; }
  draw()
  //retorna se precisa remover do vetor depois de printar
  {
    // TODO: SE ESTAH CONGELADO, COLOCAR TEXTURA

    //desenha inimigo e tiros dele
    const ret = super.draw();

    if (this._mostrarVida && this._vivo)
      this._desenharVida();

    return ret;
  }
  _desenharVida()
  {
    push();

    //DRAW VIDA:
    //draw vida em cima do inimigo
    const tamStrokeAtual = 1.5;
    strokeWeight(tamStrokeAtual);
    const qtdPxlsAcimaInim = 5;

    const widthVidaInim = absWidthVidaInim + porcWidthVidaInim*this._vidaMAX;

    let xInim, yInim;
    const anguloRotacionouTotal = this._formaGeometrica.anguloRotacionouTotal - PI;
    //ps: em ArmazenadorInfoObjetos sempre rotaciona-se 180graus inicialmente para o inimigo ficar apontado pra baixo
    if (anguloRotacionouTotal !== 0)
    // se inimigo estah rotacionado
    {
      translate(this._formaGeometrica.centroMassa.x, this._formaGeometrica.centroMassa.y); //muda o (0,0) para a posicao onde (x,y)
      rotate(anguloRotacionouTotal); //rotaciona ("gira")
      xInim = -this._formaGeometrica.distXCentroAbs;
      yInim = -this._formaGeometrica.distYCentroAbs;
    }else
    {
      xInim = this._formaGeometrica.x;
      yInim = this._formaGeometrica.y;
    }
    const xVida = xInim + (this._formaGeometrica.width - widthVidaInim)/2;
    const yVida = yInim - (heightVidaInim + qtdPxlsAcimaInim);

    //desenhar parte branca da vida
    stroke(this._corVida.stroke);
    fill(255); //branco
    rect(xVida, yVida, widthVidaInim, heightVidaInim);

    //desenhar a parte verdadeira
    const tamNoStroke = tamStrokeAtual/2;
    noStroke();
    fill(this._corVida.fill);
    rect(xVida + tamNoStroke, yVida + tamNoStroke,
      (widthVidaInim - 2*tamNoStroke)*(this._vida/this._vidaMAX), heightVidaInim - 2*tamNoStroke);

    pop();
  }
}


//CONTROLADOR INIMIGOS
class ControladorInimigos
{
  constructor(indexContr, infoInimigoPadrao, ehDeInimigosEssenciais = false, infoObjAparecendoPadrao)
  {
    //padrao
    this._infoInimigoPadrao = infoInimigoPadrao.clone();

    //index controlador
    this._indexContr = indexContr;

    // inimigos que interagem com o meio
    this._inimigos = [];
    // inimigos que NAO interagem com o meio (soh sao printados). para ObjetosTelaAparecendo:
    this._inimigosSurgindo = []; //fila
    this._infoObjAparecendoPadrao = infoObjAparecendoPadrao;

    this._ehDeInimigosEssenciais = ehDeInimigosEssenciais;
  }

  //getters basicos
  get infoInimigoPadrao()
  { return this._infoInimigoPadrao; }
  get ehDeInimigosEssenciais()
  { return this._ehDeInimigosEssenciais; }
  get inimigos()
  { return this._inimigos; }

  //novo inimigo
  adicionarInimigoDif(pontoInicial, alteracoesAndarRotacionar, infoInimigo, infoObjAparecendo)
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo} e {direcaoAnguloAponta, ehAngulo}
  {
    if (infoInimigo === undefined)
    {
      infoInimigo = this._infoInimigoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      ClasseAndar.qtdAndarDifMudarDir(infoInimigo.infoAndar, alteracoesAndarRotacionar); //pode ter alteracoesAndar ainda
    }else
    {
      //InfoInimigo: formaGeometrica, infoImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, qtdTiraVidaPersQndIntersec, infoAndar, infoArmas

      //infoAndar
      ClasseAndar.qtdAndarDif(infoInimigo, this._infoInimigoPadrao, alteracoesAndarRotacionar);

      if (infoInimigo.infoImgMorto === undefined)
        infoInimigo.infoImgMorto = this._infoInimigoPadrao.infoImgMorto;
      if (infoInimigo.vida === undefined)
        infoInimigo.vida = this._infoInimigoPadrao.vida;
      if (infoInimigo.corVida === undefined)
        infoInimigo.corVida = this._infoInimigoPadrao.corVida;
      if (infoInimigo.mostrarVidaSempre === undefined)
        infoInimigo.mostrarVidaSempre = this._infoInimigoPadrao.mostrarVidaSempre;
      if (infoInimigo.qtdTiraVidaPersQndIntersec === undefined)
        infoInimigo.qtdTiraVidaPersQndIntersec = this._infoInimigoPadrao.qtdTiraVidaPersQndIntersec;
      if (infoInimigo.infoArmas === undefined)
        infoInimigo.infoArmas = this._infoInimigoPadrao.infoArmas;

      //porcentagemTempoVida (pode ser nulo)
      if (infoInimigo.porcentagemTempoVida === undefined)
        infoInimigo.porcentagemTempoVida = this._infoInimigoPadrao.porcentagemTempoVida;

      //formaGeometrica
      if (infoInimigo.formaGeometrica === undefined)
        infoInimigo.formaGeometrica = this._infoInimigoPadrao.formaGeometrica;
    }

    //rotacionar inimigo
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoInimigo, alteracoesAndarRotacionar);

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    this._adicionarInimigo(pontoInicial, infoInimigo, infoObjAparecendo);
  }
  adicionarInimigo(pontoInicial, infoInimigo, infoObjAparecendo)
  {
		if (infoInimigo === undefined)
      infoInimigo = this._infoInimigoPadrao;

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    this._adicionarInimigo(pontoInicial, infoInimigo, infoObjAparecendo);
  }
  _adicionarInimigo(pontoInicial, infoInimigo, infoObjAparecendo)
  {
    //mesclar InfoObjAparecendo com InfoObjAparecendoPadrao
    infoObjAparecendo = AuxControladores.infoObjAparecendoCorreto(infoObjAparecendo, this._infoObjAparecendoPadrao);
    //atributos que o controlador coloca (formaGeometrica, qtdHelices e qtdsRotateDifHelices):
    infoObjAparecendo.formaGeometrica = infoInimigo.formaGeometrica;
    infoObjAparecendo.qtdHelices = infoInimigo.qtdHelices;
    infoObjAparecendo.qtdsRotateDifHelices = infoInimigo.qtdsRotateDifHelices;


    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    this._inimigosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoObjAparecendo, TipoObjetos.Inimigo, (formaGeomApareceu) => //(funcao callback)
      {
        //remover esse inimigo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
        this._inimigosSurgindo.pop();

        //adicionar inimigo que interage com o meio
        infoInimigo.formaGeometrica = formaGeomApareceu; //usa a mesma forma porque a formaGeometrica em infoInimigo pode nao estar com a mesma rotacao das helices por exemplo
        const novoInim = new Inimigo(pontoInicial, infoInimigo);
        novoInim.procCriou();

        if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
        // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do inimigo que for adicionar)
          novoInim.mudarTempoSemTiros(porcentagemDeixarTempoLento); //ainda nao tem nenhum tiro

        //adicionar novo inimigo no final
    		this._inimigos.push(novoInim);
      }));
  }

  //tiros inimigos
  andarTirosTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    this._inimigos.forEach(inim => inim.andarTiros());
    //ps: estando vivo ou nao
  }
  atirarTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.atirar();
      });
  }

  //andar
  andarInimigos()
  {
    this._inimigos.forEach((inim, indexInim) =>
      {
        if (inim.vivo)
        {
          //retorna se tiro continua em this._inimigos (pode estar morto ou nao)
          const continuaNoVetor = inim.andar(this._indexContr, indexInim);
          if (!continuaNoVetor)
          //inimigo nao aparece na tela
            this._removerInimAtualCompleto(indexInim);
        }
      });
  }

  //para ver se level acabou
  algumInimNaTela()
  { return this._inimigos.length>0 || this._inimigosSurgindo.length>0; }

  //para ver se pode atirar missil em AviaoMaster
  algumInimVivo()
  { return this._inimigos.some(inim => inim.vivo); }

  //colisao com tiro
  verifTiroVaiAndarColideInims(info, tiro)
  //esses metodos funcionam por passagem por referencia de info
  {
    let inseriu = false;
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
        //passa por todos os obstaculos
          inseriu = ClasseAndar.infoQtdAndarNaoColidir(info, inim, tiro, true) || inseriu;
      });
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com inimigos)
  procTiroCriadoColidirInims(tiro)
  {
    let colidiu = false;
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          colidiu = inim.procColidirTiroCriado(tiro) || colidiu;
      });
    return colidiu;
  }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndar(qtdAndarX, qtdAndarY) //personagem andou
  //pers andou colidir com inimigos
  {
    this._inimigos.forEach((inim, indexInim) =>
      {
        if (inim.vivo)
          inim.procPersAndar(this._indexContr, indexInim, qtdAndarX, qtdAndarY);
      });
  }
  procPersCresceu() //personagem cresceu de tamanho
  //pers andou colidir com inimigos
  {
    this._inimigos.forEach((inim, indexInim) =>
      {
        if (inim.vivo)
          inim.procVerifColisaoPersInimEstatico(this._indexContr, indexInim);
      });
  }

  //para andar ateh inimigo
	qntAndarInimigoMaisProximo(formaGeometrica)
  // formaGeometrica do objeto que vai andar ateh inimigo mais proximo
	{
    let menorHipotenusa = null;
    let praOndeAndar = {}; //x, y, inim
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
        {
          const qntAndar = ClasseAndar.qntAndarParaBater(formaGeometrica, inim.formaGeometrica);
          const hipotenusa = Operacoes.hipotenusa(qntAndar.x, qntAndar.y);
          if (menorHipotenusa === null || hipotenusa < menorHipotenusa)
          {
            praOndeAndar.x = qntAndar.x;
            praOndeAndar.y = qntAndar.y;
            praOndeAndar.inim = inim;
            menorHipotenusa = hipotenusa;
          }
        }
      });
    return praOndeAndar;
	}

  //para obstaculo criado e personagem que aumentar de tamanho colidir com tiros dos inimigos
  procObjCriadoColidirTirosInims(objCriado)
  {
    const tirarVida = !(objCriado instanceof Obstaculo || objCriado instanceof SuporteAereo);
    this._inimigos.forEach(inim => inim.procObjCriadoColideTiros(objCriado, tirarVida));
  }
  //andar personagem e obstaculo colidindo com tiros dos inimigos
  procObjAndarColidirTirosInims(objTelaColide, qtdMudarX, qtdMudarY, podeTirarVidaObjTela)
  //pers andou colidir com tiros de inimigos
  {
    this._inimigos.forEach(inim =>
      inim.procObjVaiAndarColideTiros(objTelaColide, qtdMudarX, qtdMudarY, podeTirarVidaObjTela)
    );
  }

  //POCAO
  matarTodosInim()
  {
    //mata todos os inimigos
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.seMatar();
      });
  }
  tirarVidaTodosInim(qtdTira)
  {
    //tirar um pouco de vida de todos inimigos
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.mudarVida(-qtdTira, false); //nao eh o tiro que estah tirando a vida dele
      });
  }
  virarTirosInimsContraCriador(seguir)
  {
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.virarTirosContraCriador(seguir);
      });
  }
  mudarCongelarTodosInim(congelar)
  //congelar: true = congelar, false = descongelar
  {
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
        {
          if (congelar)
            inim.congelar();
          else
            inim.descongelar();
        }
      });
  }
  mudarTempo(porcentagem)
  {
    //inimigos surgindo
    this._inimigosSurgindo.forEach(inimSurgindo => inimSurgindo.mudarTempo(porcentagem));

    //inimigos que jah interagem com o meio
    this._inimigos.forEach(inim => inim.mudarTempo(porcentagem));
    //ps: todos os inimigos (inclusive os mortos) devem fazer o procedimento pois os inimigos mortos tambem tem tiros que tambem precisam mudarTempo
  }

  //para saber se painel personagem vai ser printado normal ou um pouco opaco
  algumInimNesseEspaco(formaGeomEspaco)
  {
    //Inimigo
    const interseccaoInim = this._inimigos.some(inim =>
      Interseccao.interseccaoComoRetangulos(formaGeomEspaco, inim.formaGeometrica));
    if (interseccaoInim)
      return true;

    //Inimigo SURGINDO
    const interseccaoInimSurgindo = this._inimigosSurgindo.some(inimSurg =>
      Interseccao.interseccaoComoRetangulos(formaGeomEspaco, inimSurg.formaGeometrica));
    if (interseccaoInimSurgindo)
      return true;

    //nao intersectou nenhum inimigo
    return false;
  }

  //draw
  draw() //soh desenha inimigos que jah interagem com o meio (nao inimgosSurgindo)
	{
    this._inimigos.forEach((inim, indexInim) =>
      {
        const removerDoVetor = inim.draw();
        if (removerDoVetor)
          this._removerInimAtualCompleto(indexInim);
      });
	}
  drawTirosMortosInims()
  { this._inimigos.forEach(inim => inim.drawTirosMortos()); }
  drawSurgindo() //desenha inimigos surgindo
  { this._inimigosSurgindo.forEach(inimSurgindo => inimSurgindo.draw()); }

  //auxiliar
  _removerInimAtualCompleto(indexInim)
  {
    this._inimigos[indexInim].procVaiSerRemovido();
    this._inimigos.splice(indexInim,1); //remover 1 elemento a partir de indexInim
  }
}
