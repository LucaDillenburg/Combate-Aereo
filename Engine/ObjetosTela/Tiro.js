//TIRO
class InfoTiro extends InfoObjetoTela
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, infoAndar, mortalidade, ehDoPers)
  //ehDoPers: soh vai ser preenchido pelo ControladorTiros
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto);
    this.infoAndar = infoAndar;
    this.mortalidade = mortalidade;
    this.ehDoPers = ehDoPers;
  }

  clone()
  { return new InfoTiro(this.formaGeometrica, this.infoImgVivo.clone(), this.infoImgMorto.clone(), this.infoAndar.clone(), this.mortalidade, this.ehDoPers); }
}
class Tiro extends ObjetoTela
{
  constructor(pontoInicial, infoTiro)
  {
    super(pontoInicial, infoTiro);

    //eh do pers
    this._ehDoPers = infoTiro.ehDoPers;

    //andar
    this._seEhImpossivelExcep(infoTiro.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoTiro.infoAndar, this._formaGeometrica);

    //mortalidade
    this._mortalidade = infoTiro.mortalidade;
  }

  //procedimentos quando criar obstaculo
  procCriou()
  {
    let colidiu;
    if (!this._ehDoPers)
    //se tiro de inimigo ou da tela, verifica se bateu em personagem
      colidiu = ControladorJogo.pers.procColidirTiroCriado(this);
    else
    {
      // soh os tiros do personagem verificam colisao com inimigos (tem que passar por todos de qualquer jeito nao apenas saber se algum colidiu)
      colidiu = ControladorJogo.controladoresInimigos.reduce((acc, controladorInims) =>
        controladorInims.procTiroCriadoColidirInims(this) || acc, false/*valor inicial*/);
      colidiu = ControladorJogo.controladorSuportesAereos.suportesAereos.reduce((acc, suporteAereo) =>
        suporteAereo.procColidirTiroCriado(this) || acc, colidiu/*valor inicial*/);
    }

    //verificar colisao com obstaculos (tem que passar por todos de qualquer jeito nao apenas saber se algum colidiu)
    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      colidiu = controladorObsts.procObstsColidirTiroCriado(this) || colidiu);

    if (colidiu)
      this.morreu();
  }

  //getters e setters
  _seEhImpossivelExcep(tipo)
  {
    //se eh para andar atras do personagem e o tiro eh do proprio personagem, da erro
    if ((this._ehDoPers && (tipo === TipoAndar.SeguirPers || tipo === TipoAndar.DirecaoPers)) ||
      (!this._ehDoPers && (tipo === TipoAndar.SeguirInimMaisProx || tipo === TipoAndar.DirecaoInimMaisProx)))
        throw "Tipo andar ou ehDoPers nao combinam!";
  }
  setTipoAndar(tipo, outrasInformacoes)
  {
    this._seEhImpossivelExcep(tipo);
    this._classeAndar.setTipoAndar(tipo, this._formaGeometrica, outrasInformacoes);
  }

  virarContraCriador(seguir)
  {
    //inverte dono
    this._ehDoPers = !this._ehDoPers;

    //adiciona limitacao curva (sem muita limitacao)
    const outrasInformacoes = {limitarCurva: {maiorAnguloMudanca: PI/12, porcVelCurva: 0.6}};

    //muda tipoAndar
    if (this._ehDoPers)
      this.setTipoAndar(seguir?TipoAndar.SeguirInimMaisProx:TipoAndar.DirecaoInimMaisProx, outrasInformacoes);
    else
      this.setTipoAndar(seguir?TipoAndar.SeguirPers:TipoAndar.DirecaoPers, outrasInformacoes);
  }

  get mortalidade()
  { return this._mortalidade; }
  set mortalidade(qtd)
  { this._mortalidade = qtd; }
  mudarMortalidade(qtdMudar, ehPorcentagem)
  {
    if (ehPorcentagem)
      this._mortalidade *= qtdMudar;
    else
      this._mortalidade += qtdMudar;
  }

  get ehDoPers()
  { return this._ehDoPers; }
  get classeAndar()
  { return this._classeAndar; }

  get vivo()
  { return this._vivo; }

  //andar
  andar()
  //retorna se continua no vetor de tiros ou nao
  {
    //se tiro estah seguindo um ObjTela que jah morreu, continuar andando normal
    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //rotacionar tiro de modo a ele ficar com o angulo de rotacao igual ao angulo que ele vai andar
    /*NAO MUDAR ISSO!!:*/this._formaGeometrica = this._formaGeometrica.setRotacao(this._classeAndar.anguloQtdAndar);
    //ps: "this._formaGeometrica = " para funcionar para FormasGeometricasSimples tambem

    //info: menorHipotenusa, objsColidiram, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
    let info = {
      objsColidiram: [],
      menorWidth: width,
      menorHeight: height,
      qtdPodeAndarX: qtdAndar.x,
      qtdPodeAndarY: qtdAndar.y,
      menorHipotenusa: Operacoes.hipotenusa(qtdAndar.x, qtdAndar.y),
      qtdAndarXPadrao: qtdAndar.x, //nunca vai ser mudado
      qtdAndarYPadrao: qtdAndar.y //nunca vai ser mudado
    };

    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      controladorObsts.verifTiroVaiAndarColideObsts(info, this));

    if (this._ehDoPers) //tiros de inimigos nao colidem com inimigos
    {
      ControladorJogo.controladoresInimigos.forEach(controladorInims =>
        controladorInims.verifTiroVaiAndarColideInims(info, this));
      ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo =>
        ClasseAndar.infoQtdAndarNaoColidir(info, suporteAereo, this, true));
    }

    if (this._ehDoPers)
      return this._andarEhPers(info, qtdAndar.x, qtdAndar.y);
    else
      return this._andarNaoEhPers(info, qtdAndar.x, qtdAndar.y);
  }
  _andarEhPers(info, qtdAndarX, qtdAndarY)
  {
    //anda oq tem que andar:
    if (info.objsColidiram.length > 0) //se colidiu com inimigo ou obstaculo
    {
      //andar propriamente dito (se colidiu)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
      this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
      this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

      //tirar vida de todos os inimigos que bateu (soh ha mais de um objeto se eles estao no mesmo Y)
      info.objsColidiram.forEach(objBateu =>
        {
          if (objBateu instanceof Inimigo)
            this.tirarVidaObjCmVida(objBateu, true);
          else
          if (objBateu instanceof Obstaculo)
            objBateu.procColidiuTiro(this);
            //se tiver com pocao TipoPocao.MatarObjetos1Tiro mata, else se tem vida, tira
        });
    }else
    {
      //andar propriamente dito se nao colidiu
      this._formaGeometrica.x += info.qtdPodeAndarX;
      this._formaGeometrica.y += info.qtdPodeAndarY;
    }

    //soh verifica se continua no vetor agora pois o tiro pode acertar o inimigo fora da tela
    if (!AuxObjetos.continuaNoVetor(this))
      return false;

    if (info.objsColidiram.length > 0) //se colidiu com inimigo ou obstaculo
      this.morreu();

    return true;
  }
  _andarNaoEhPers(info, qtdAndarX, qtdAndarY)
  {
    //se qnt[Tiro]PodeAndarAntesIntersec[cm pers] for menor do que quanto pode andar no info.menorHipotenusa (qntPodeAndarAntesIntersec ateh obstaculo),
     //entao tira vida do pers e morre para ele
    //else, se bateu em obstaculo morre para ele, caso contrario soh anda

    const qtdPodeAndar = ControladorJogo.pers.qntPodeAndarAntesIntersecObjAndar(this._formaGeometrica, qtdAndarX, qtdAndarY);
    const hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    //se bateu no pers antes de qntPodeAndarAntesIntersec com o obstaculo
    if (hipotenusa < info.menorHipotenusa)
    {
      //andar propriamente dito (se colidiu com pers)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, ControladorJogo.pers.formaGeometrica.width, ControladorJogo.pers.formaGeometrica.height);
      this._formaGeometrica.x += qtdPodeAndar.x + qntEntra.x;
      this._formaGeometrica.y += qtdPodeAndar.y + qntEntra.y;

      //colidir
      this.tirarVidaObjCmVida(ControladorJogo.pers);
      this.morreu();
    }else
    if (info.objsColidiram.length > 0) //se colidiu com obstaculo (obstaculo parou o tiro antes de ele chegar no pers - ps: talvez o tiro nem chegasse no pers sem a interceptacao do obstaculo)
    {
      //andar propriamente dito (se colidiu com obstaculo)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
      this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
      this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

      this.morreu();
    }
    else //se nao colidiu com ninguem
    {
      //andar propriamente dito (se nao colidiu)
      this._formaGeometrica.x += qtdAndarX;
      this._formaGeometrica.y += qtdAndarY;
    }

    //retorna se nao saiu da tela
    return AuxObjetos.continuaNoVetor(this);
  }
  _qntEntra(qtdAndarX, qtdAndarY, menorWidth, menorHeight)
  // eh proporcional a qtdAndar
  {
    //ver quanto o tiro deve entrar no obstaculo ou inimigo
    const mult = 0.2; //multiplicador do qtdAndarX e qtdAndarY
    let mudarQntEntra = 0;
    if (Math.abs(mult*qtdAndarX) > menorWidth/2)
      mudarQntEntra++;
    if (Math.abs(mult*qtdAndarY) > menorHeight/2)
      mudarQntEntra += 2;

    let qntEntraX, qntEntraY;
    switch (mudarQntEntra)
    {
      case 0:
        qntEntraX = mult*qtdAndarX;
        qntEntraY = mult*qtdAndarY;
        break;
      case 1:
        //regra de tres: qtdAndarX/qtdAndarY = (menorWidth/2)/qntEntraY
        qntEntraX = menorWidth/2 * (qtdAndarX>0?1:-1);
        qntEntraY = (qntEntraX*qtdAndarY)/qtdAndarX;
        break;
      case 2:
        //regra de tres: qtdAndarX/qtdAndarY = qntEntraX/(menorHeight/2)
        qntEntraY = menorHeight/2 * (qtdAndarY>0?1:-1);
        qntEntraX = (qntEntraY*qtdAndarX)/qtdAndarY;
        break;
      case 3:
        //regra de tres: qtdAndarX/qtdAndarY = (menorWidth/2)/qntEntraY
        const qntEntraX1 = menorWidth/2 * (qtdAndarX>0?1:-1);
        const qntEntraY1 = (qntEntraX1*qtdAndarY)/qtdAndarX;

        const qntEntraY2 = menorHeight/2 * (qtdAndarY>0?1:-1);

        if (Math.abs(qntEntraY1) <= Math.abs(qntEntraY2))
        {
          qntEntraX = qntEntraX1;
          qntEntraY = qntEntraY1;
        }else
        {
          //regra de tres: qtdAndarX/qtdAndarY = qntEntraX/(menorHeight/2)
          qntEntraY = qntEntraY2;
          qntEntraX = (qntEntraY*qtdAndarX)/qtdAndarY;
        }
        break;
    }

    return {x: qntEntraX, y: qntEntraY};
  }

  //procedimentos colisao
  procColisaoObjVaiAndar(objTelaColide, qtdMudarX, qtdMudarY, podeTirarVidaObjTela=true)
  {
    if (Interseccao.vaiTerInterseccao(this._formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudarY))
    {
      //se objeto tela tem vida e eh pra tirar vida
      if (podeTirarVidaObjTela && objTelaColide.vida!==undefined)
        this.tirarVidaObjCmVida(objTelaColide);
      this.morreu();
    }
  }
  procColisaoObjCriado(objTelaColide, podeTirarVidaObjTela=true)
  {
    if (Interseccao.interseccao(this._formaGeometrica, objTelaColide.formaGeometrica))
    {
      //se objeto tela tem vida e eh para tirar vida
      if (podeTirarVidaObjTela && objTelaColide.vida!==undefined)
        this.tirarVidaObjCmVida(objTelaColide);
      this.morreu();
    }
  }

  tirarVidaObjCmVida(obj)
  { obj.mudarVida(-this._mortalidade); }
}


//CONTROLADOR TIROS
class ControladorTiros
{
  constructor(infoTiroPadrao, ehPersPrinc)
  {
    //padrao
    if (infoTiroPadrao !== null)
    // pode nao ser definido, se no level nao houver controladores de tiros do jogo (porem tem que criar um pelo menos para colocar quando inimigos morrerem)
      this._infoTiroPadrao = infoTiroPadrao.clone();
    this._ehPersPrinc = ehPersPrinc;

    //vetor de tiros
    this._tiros = new List();

    this._funcCamadasColTirarTirosEsp = new FuncEmCamadas();

    //para remocao
    this._indexesRemover = [];
  }

  //infoTiroPadrao
  get infoTiroPadrao()
  { return this._infoTiroPadrao; }

  colocarInfoTiroEspecial(novoInfoTiro)
  {
    this._infoTiroEspecial = novoInfoTiro;
    this._funcCamadasColTirarTirosEsp.subirCamada();
  }
  voltarInfoTiroPadrao()
  {
    if (this._funcCamadasColTirarTirosEsp.descerCamada())
      delete this._infoTiroEspecial;
  }

  get infoTiroPadraoAtual()
  {
    if (this._infoTiroEspecial === undefined)
      return this._infoTiroPadrao;
    else
      return this._infoTiroEspecial;
  }

  //novo tiro
  adicionarTiroDif(pontoInicial, alteracoesAndarRotacionar, infoTiro)
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo} e {direcaoAnguloAponta, ehAngulo}
  //os atributos que forem nulos serao substituidos pelos padronizados e os que forem da classe Nulo serao substituidos por null (soh vai ser verificado se eh dessa classe se puder ser nulo)
  {
    const infoTiroPadraoAtual = this.infoTiroPadraoAtual;

    if (infoTiro === undefined)
    {
      infoTiro = infoTiroPadraoAtual.clone(); //tem que fazer clone porque pode inverter qtdAndar
      ClasseAndar.qtdAndarDifMudarDir(infoTiro.infoAndar, alteracoesAndarRotacionar); //pode ter alteracoesAndarRotacionar ainda
    }else
    {
      //infoAndar
      ClasseAndar.qtdAndarDif(infoTiro, infoTiroPadraoAtual, alteracoesAndarRotacionar);

      //outros atributos
      AuxiliarInfo.mergeInfoNovoComPadrao(infoTiro, infoTiroPadraoAtual);
    }

    //rotacionar tiro
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoTiro, alteracoesAndarRotacionar);

    // isso eh padrao do ControladorTiros
    infoTiro.ehDoPers = this._ehPersPrinc;

    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  adicionarTiro(pontoInicial, infoTiro)
  {
		if (infoTiro === undefined)
      infoTiro = this.infoTiroPadraoAtual;

    infoTiro.ehDoPers = this._ehPersPrinc;
    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  _adicionarTiro(novoTiro)
  {
    novoTiro.procCriou();

    if (!this._ehPersPrinc && ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // soh os tiros da tela ou do personagem vao estar mais devagar
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do tiro que for adicionar)
      novoTiro.classeAndar.mudarTempo(porcentagemDeixarTempoLento);

    //adicionar novo tiro ao final do array
		this._tiros.push(novoTiro);
  }

  //mover tiros
  andarTiros()
  {
    this._tiros.forEach((tiro, index) =>
      {
        if (tiro.vivo)
        {
          const continuaNoVetor = tiro.andar(); //soh retorna que eh para remover se estah totalmente fora da tela
          if (!continuaNoVetor)
            this._querRemoverTiro(index);
        }
      });

    this._removerTiros();
  }

  //quando personagem, inimigos ou obstaculos se moverem
  procObjVaiAndarColideTiros(objTelaColide, qtdMudarX, qtdMudarY, podeTirarVidaObjTela)
  {
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.procColisaoObjVaiAndar(objTelaColide, qtdMudarX, qtdMudarY, podeTirarVidaObjTela);
      });
  }
  procObjCriadoColideTiros(objTelaColide, podeTirarVidaObjTela)
  {
    const objTemVida = objTelaColide.vida !== undefined;
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.procColisaoObjCriado(objTelaColide, podeTirarVidaObjTela);
      });
  }

  //uso: quando os inimigos morrerem passar os tiros deles para controladoresTirosJogo[0]
  concatenarTiros(controladorTiros)
  {
    //os tiros do outro controlador serao passados para esse (todos os elementos de controladorTiros._tiros serao adicionados ao final de this._tiros)
    this._tiros.concat(controladorTiros._tiros);
  }

  //POCAO
  virarTirosContraCriador(seguir)
  //seguir: true = seguir, false = direcao
  {
    //transformar todos os tiros em dePers e mudar tipoAndar
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.virarContraCriador(seguir);
          //se era do pers fica sendo da tela, e se nao era do pers fica sendo dele, comeca a seguir o objeto adversario
      });

    //concatenar com controladorTirosJogo se tiros eram originalmente do personagem, e com controladorTiros do personagem se nao eram do personagem
    if (this._ehPersPrinc)
      ControladorJogo.controladorOutrosTirosNaoPers.concatenarTiros(this);
    else
      ControladorJogo.pers.getControladorTiros(0).concatenarTiros(this);

    //jah passou os tiros pra outro controladorTiro, entao esvazia esse
    this._tiros.clear();
  }
  mudarTempo(porcentagem)
  {
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.classeAndar.mudarTempo(porcentagem);
      });
  }
  mudarQtdAndarTiros(porcentagem)
  {
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.classeAndar.mudarQtdAndar(porcentagem);
      });
  }
  mudarMortalidadeTiros(qtdMudar, ehPorcentagem)
  {
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.mudarMortalidade(qtdMudar, ehPorcentagem);
      });
  }

	//draw
	draw() //desenha os tiros vivos
	{
    this._tiros.forEach(tiro =>
      {
        if (tiro.vivo)
          tiro.draw();
      });
	}
  drawMortos() //desenha os tiros mortos
  {
    this._tiros.forEach((tiro, index) =>
      {
        if (!tiro.vivo)
        {
          const removerDoVetor = tiro.draw(); //soh retorna que eh para remover se jah printou todas as imagens morto
          if (removerDoVetor)
            this._querRemoverTiro(index);
        }
      });

    this._removerTiros();
  }

  //remover tiros
  removerTodosTiros()
  {
    this._tiros.clear();
  }
  //obs: nao pode remover durante o forEach, se nao o loop nao iterarah sobre todos os elementos, entao tem que guardar todos os indices dos elementos que quer quer deletar e depois deletar todos
  _querRemoverTiro(index)
  {
    this._indexesRemover.push(index);
  }
  _removerTiros()
  {
    this._indexesRemover.forEach((indexRemover, i) => this._tiros.splice(indexRemover-i, 1));
    //"-i" porque a cada elemento que eh removido proximos elementos decaem uma posicao (e [i] eh o numero de elementos que jah foram removidos)

    this._indexesRemover = []; //jah removeu todos os inimigos
  }
}
