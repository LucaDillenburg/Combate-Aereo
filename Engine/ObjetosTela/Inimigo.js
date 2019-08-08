//INIMIGO
  //vida
const tempoMostrarVidaPadrao = 1100;
const heightVidaInim = 10;
const porcWidthVidaInim = 0.25;
const absWidthVidaInim = 40;
  //rotacao arma giratoria
const maxRotacionarArmaGiratoriaInim = maxRotacionarArmaGiratoriaPers * 0.3;
class InfoInimigo extends InfoObjetoComArmas_e_Vida
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, vida, corVida, mostrarVidaSempre=true, porcentagemTempoVida, qtdTiraVidaBatePers, qtdTiraVidaNaoConsegueEmpurrarPers, infoAndar, rotacionarInimAnguloAnda=false, infoArmas, qtdHelices, qtdsRotateDifHelices, ehInimEssencial)
  //ehInimEssencial: soh o controladorInimigos que coloca
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto, vida, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.corVida = corVida;
    this.mostrarVidaSempre = mostrarVidaSempre;
    if (porcentagemTempoVida !== undefined)
      this.porcentagemTempoVida = porcentagemTempoVida;
    this.qtdTiraVidaBatePers = qtdTiraVidaBatePers;
    this.qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;
    this.infoAndar = infoAndar;
    this.rotacionarInimAnguloAnda = rotacionarInimAnguloAnda;
    this.ehInimEssencial = ehInimEssencial;
  }

  clone()
  { return new InfoInimigo(this.formaGeometrica, this.infoImgVivo.clone(), this.infoImgMorto.clone(), this.vida, AuxInfo.cloneImgCor(this.corVida), this.mostrarVidaSempre, this.porcentagemTempoVida, this.qtdTiraVidaBatePers, this.qtdTiraVidaNaoConsegueEmpurrarPers, this.infoAndar.clone(), this.rotacionarInimAnguloAnda, Clone.cloneVetorCadaElemento(this.infoArmas), this.qtdHelices, Clone.cloneVetor(this.qtdsRotateDifHelices), this.ehInimEssencial); }
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
    this._qtdTiraVidaBatePers = infoInimigo.qtdTiraVidaBatePers;
    this._qtdTiraVidaNaoConsegueEmpurrarPers = infoInimigo.qtdTiraVidaNaoConsegueEmpurrarPers;

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
  {
    ControladorJogo.pers.procObjCriadoColideTiros(this);
    this.procVerifColisaoPersInimEstatico();
  }

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
  andar()
  //retorna se deve continuar no vetor de inimigos
  {
    if (this._estahCongelado) return true; //se estah congelado nao anda nem atira

    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    if (this._rotacionarInimAnguloAnda)
    {
      //rotacionar inim de modo a ele ficar com o angulo de rotacao igual ao angulo que ele vai andar
      /*NAO MUDAR ISSO!!:*/this._formaGeometrica = this._formaGeometrica.setRotacao(PI + this._classeAndar.anguloQtdAndar);
      //ps: nao eh apenas o anguloQtdAndar pois a frente do inimigo eh em 180graus
      //ps: "this._formaGeometrica = " para funcionar para FormasGeometricasSimples tambem
    }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair do vetor de tiros porque esse inimigo andou, ele sai
    ControladorJogo.pers.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y);

    //verificar se nao vai intersectar personagem
    let qtdPodeAndar = ControladorJogo.pers.qntPodeAndarAntesIntersecObjAndar(this._formaGeometrica, qtdAndar.x, qtdAndar.y);
    if (qtdPodeAndar.x!==qtdAndar.x || qtdPodeAndar.y!==qtdAndar.y) //!equals
    //se nao pode andar tudo o que deve
      ControladorJogo.pers.colidiuObj(this);

    // soh anda o suficiente para nao colidir com personagem
    this._formaGeometrica.x += qtdPodeAndar.x;
    this._formaGeometrica.y += qtdPodeAndar.y;

    //soh ve agr pois ele pode ter passado por cima de um personagem e depois saido
    return AuxObjetos.continuaNoVetor(this);
  }

  //mudar tamanho
  mudarTamanho(porcentagem)
  {
    //muda o tamanho de formaGeometrica
    this._formaGeometrica.mudarTamanho(porcentagem);

    if (porcentagem > 1) //se aumentou de tamanho (mais de 100%)
    //soh tem que verificar se colidiu com tiros do personagem e personagem
    {
      //verificar colisao com tiros do personagem
      ControladorJogo.pers.procObjCriadoColideTiros(this);

      //verificar colisao com personagem
      this.procVerifColisaoPersInimEstatico();
    }
  }

  //ATIRAR
  atirar()
  {
    if (this._estahCongelado) return; //se estah congelado nao anda nem atira

    // atirar propriamente dito
    super.atirar();
  }

  //tirar vida personagem quando colidir com ele
  get qtdTiraVidaBatePers()
  { return this._qtdTiraVidaBatePers; }
  tirarVidaPersNaoConsegueEmpurrar()
  //tirar vida personagem quando nao consegue empurrar o pesonagem
  { ControladorJogo.pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

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
  qtdPersPodeAndar(infoQtdMudar)
  { AuxObjetos.qtdPersPodeAndar(this, infoQtdMudar); }
  procVerifColisaoPersInimEstatico() //quando personagem ou inimigo for aumentar de tamanho
  {
    const conseguiuEmpurrarSePrec = AuxObjetos.procColisaoEstaticaObstComPers(this);
    if (!conseguiuEmpurrarSePrec)
    {
      //obstaculo explode
      this.morreu();
      this.tirarVidaPersNaoConsegueEmpurrar();
    }
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
    const anguloRotacionouTotal = this._formaGeometrica.anguloRotacionouTotal;
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
  constructor(infoInimigoPadrao, ehDeInimigosEssenciais = false, infoObjAparecendoPadrao)
  {
    //padrao
    this._infoInimigoPadrao = infoInimigoPadrao.clone();

    // inimigos que interagem com o meio
    this._inimigos = new List();
    // inimigos que NAO interagem com o meio (soh sao printados). para ObjetosTelaAparecendo:
    this._inimigosSurgindo = new List(); //fila
    this._infoObjAparecendoPadrao = infoObjAparecendoPadrao;

    this._ehDeInimigosEssenciais = ehDeInimigosEssenciais;

    //para remocao
    this._indexesRemover = [];
  }

  //setter
  set indexContr(indexContr)
  { this._indexContr = indexContr; }

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
      //infoAndar
      ClasseAndar.qtdAndarDif(infoInimigo, this._infoInimigoPadrao, alteracoesAndarRotacionar);

      //merge dos outros atributos
      AuxiliarInfo.mergeInfoNovoComPadrao(infoInimigo, this._infoInimigoPadrao);
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
    infoObjAparecendo.infoImgVivo = infoInimigo.infoImgVivo;
    infoObjAparecendo.qtdHelices = infoInimigo.qtdHelices;
    infoObjAparecendo.qtdsRotateDifHelices = infoInimigo.qtdsRotateDifHelices;

    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    this._inimigosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoObjAparecendo, TipoObjetos.Inimigo, (formaGeomApareceu, indexInicialImgVivo) => //(funcao callback)
      {
        //remover esse inimigo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
        this._inimigosSurgindo.pop();

        //adicionar inimigo que interage com o meio
        infoInimigo.formaGeometrica = formaGeomApareceu; //usa a mesma forma porque a formaGeometrica em infoInimigo pode nao estar com a mesma rotacao das helices por exemplo
        infoInimigo.infoImgVivo.indexInicial = indexInicialImgVivo; //para que o index da imagem vivo seja o mesmo (ideia de continuidade e nao quebra)
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
          const continuaNoVetor = inim.andar(); //soh retorna que eh para remover se inimigo estah totalmente fora da tela
          if (!continuaNoVetor)
          //inimigo nao aparece na tela
            this._querRemoverInim(indexInim);
        }
      });

    this._removerInims(); //realmente remove os inimigos que queria remover
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

  qtdPersPodeAndar(infoQtdMudar) //personagem quer andar
  {
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.qtdPersPodeAndar(infoQtdMudar);
      });
  }
  procPersCresceu() //personagem cresceu de tamanho
  //pers andou colidir com inimigos
  {
    this._inimigos.forEach(inim =>
      {
        if (inim.vivo)
          inim.procVerifColisaoPersInimEstatico();
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

  //para adicionar pocao
  pocaoIntersectaInimParado(formaGeomPocao)
  {
    return this._inimigos.some(inim =>
      {
        if (inim.vivo && inim.classeAndar.ehParado)
          return Interseccao.interseccaoComoRetangulos(inim.formaGeometrica, formaGeomPocao)
      });
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
        const removerDoVetor = inim.draw(); //soh retorna que eh para remover se jah foi printado todos as imagens morto do inimigo
        if (removerDoVetor)
          this._querRemoverInim(indexInim);
      });

    this._removerInims(); //realmente remove os inimigos que queria remover
	}
  drawTirosMortosInims()
  { this._inimigos.forEach(inim => inim.drawTirosMortos()); }
  drawSurgindo() //desenha inimigos surgindo
  { this._inimigosSurgindo.forEach(inimSurgindo => inimSurgindo.draw()); }

  //auxiliar
  //remover inimigos:
  //obs: nao pode remover durante o forEach, se nao o loop nao iterarah sobre todos os elementos, entao tem que guardar todos os indices dos elementos que quer quer deletar e depois deletar todos
  _querRemoverInim(index)
  {
    this._indexesRemover.push(index);
  }
  _removerInims()
  {
    this._indexesRemover.forEach((indexRemover, i) =>
      {
        const indexRemoverAtualizado = indexRemover-i;
        this._inimigos.getElem(indexRemoverAtualizado).procVaiSerRemovido();
        this._inimigos.splice(indexRemoverAtualizado, 1);
      });
    //"-i" porque a cada elemento que eh removido proximos elementos decaem uma posicao (e [i] eh o numero de elementos que jah foram removidos)

    this._indexesRemover = []; //jah removeu todos os inimigos
  }
}
