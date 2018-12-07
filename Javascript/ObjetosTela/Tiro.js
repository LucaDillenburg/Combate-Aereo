//CONTROLADOR TIROS
class ControladorTiros
{
  constructor(infoTiroPadrao, ehPersPrinc)
  {
    //padrao
    this._infoTiroPadrao = infoTiroPadrao;
    this._ehPersPrinc = ehPersPrinc;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os tiros no comeco e quando eles sairem da tela ou baterem tirar da lista
    this._tiros = new ListaDuplamenteLigada();

    this._auxColTirarTirosEsp = 0;
  }

  //infoTiroPadrao
  get infoTiroPadrao()
  { return this._infoTiroPadrao; }
  set infoTiroPadrao(novoInfoTiro)
  { this._infoTiroPadrao = novoInfoTiro; }

  colocarInfoTiroEspecial(novoInfoTiro)
  {
    this._infoTiroEspecial = novoInfoTiro;
    this._auxColTirarTirosEsp++;
  }
  voltarInfoTiroPadrao()
  {
    this._auxColTirarTirosEsp--;

    if (this._auxColTirarTirosEsp === 0)
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
  adicionarTiroDif(pontoInicial, infoTiro, direcaoX, direcaoY, todoQtdDirecao=false)
  //os atributos que forem nulos serao substituidos pelos padronizados e os que forem da classe Nulo serao substituidos por null (soh vai ser verificado se eh dessa classe se puder ser nulo)
  {
    const infoTiroPadraoAtual = this.infoTiroPadraoAtual;

    if (infoTiro === undefined)
    {
      infoTiro = infoTiroPadraoAtual.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoTiro.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //infoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade

      //infoAndar
      AuxControladores.qtdAndarDif(infoTiro, infoTiroPadraoAtual, direcaoX, direcaoY, todoQtdDirecao);

      //corMorto, mortalidade
      if (infoTiro.corImgMorto === undefined)
        infoTiro.corImgMorto = infoTiroPadraoAtual.corImgMorto;
      if (infoTiro.mortalidade === undefined)
        infoTiro.mortalidade = infoTiroPadraoAtual.mortalidade;

      //formaGeometrica
      if (infoTiro.formaGeometrica === undefined)
        infoTiro.formaGeometrica = infoTiroPadraoAtual.formaGeometrica;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiroPadraoAtual.formaGeometrica);

    infoTiro.ehDoPers = this._ehPersPrinc;

    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  adicionarTiro(pontoInicial, infoTiro)
  {
		if (infoTiro === undefined)
      infoTiro = this.infoTiroPadraoAtual;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiro.formaGeometrica);

    infoTiro.ehDoPers = this._ehPersPrinc;
    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  _adicionarTiro(novoTiro)
  {
    novoTiro.procCriou();

    if (!this._ehPersPrinc && ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // soh os tiros da tela ou do personagem vao estar mais devagar
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do tiro que for adicionar)
      novoTiro.classeAndar.mudarTempo(porcentagemDeixarTempoLento);

    //adicionar novo tiro ao comeco da lista
		this._tiros.inserirNoComeco(novoTiro);
  }

  //mover tiros
  andarTiros()
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (!this._tiros.atual.vivo)
      // se ele estava morto e soh nao foi tirado da lista porque colidiu e queria-se mostrar a colisao, agora remove
        this._tiros.removerAtual();
      else
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        const continuaLista = this._tiros.atual.andar();
        if (!continuaLista)
  				this._tiros.removerAtual();
      }
  }

  //quando personagem ou obstaculo se mover
  procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY, indexAndou, podeTirarVidaObjTela = true)
  //soh precisa de indexAndou se quem andou for inimigo ou obstaculo
  {
    const tipoObjAndou = TipoObjetos.fromObj(objTelaColide);
    const objTemVida = objTelaColide.vida !== undefined;
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
      {
        if (Interseccao.vaiTerInterseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudarY))
        {
          //se objeto tela tem vida e eh pra tirar vida
          if (podeTirarVidaObjTela && objTemVida)
            this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
          this._tiros.atual.morreu(tipoObjAndou, indexAndou);
        }
      }else
        //O TIRO MORTO VAI SAIR DA LISTA [...] QUANDO EM QUEM ELE BATEU ANDAR
        if (this._tiros.atual.ehQuemBateu(tipoObjAndou, indexAndou))
          this._tiros.removerAtual();
  }
  procedimentoObjTelaColideCriar(objTelaColide, indexCriou, podeTirarVidaObjTela=true)
  {
    const tipoObjCriado = TipoObjetos.fromObj(objTelaColide);
    const objTemVida = objTelaColide.vida !== undefined;
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo && Interseccao.interseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica))
      {
        //se objeto tela tem vida e eh para tirar vida
        if (podeTirarVidaObjTela && temVida)
          this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
        this._tiros.atual.morreu(tipoObjCriado, indexCriou);
      }
  }

  //uso: quando os inimigos morrerem passar os tiros deles para controladoresTirosJogo[0]
  concatenarTiros(controladorTiros)
  {
    //os tiros do outro controlador serao passados para esse (sem fazer clone)
    this._tiros.concatenar(controladorTiros._tiros);
  }

  //POCAO
  seVirarContraCriador(seguir)
  //seguir: true = seguir, false = direcao
  {
    //transformar todos os tiros em dePers e mudar tipoAndar
    for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
      {
        this._tiros.atual.inverterDono(); //se era do pers fica sendo da tela, e se nao era do pers fica sendo dele

        if (this.ehPersPrinc)
          this._tiros.atual.setTipoAndar(seguir?TipoAndar.SeguirPers:TipoAndar.DirecaoPers);
        else
          this._tiros.atual.setTipoAndar(seguir?TipoAndar.SeguirInimMaisProx:TipoAndar.DirecaoInimMaisProx);
      }

    //concatenar com controladorTirosJogo se tiros eram originalmente do personagem, e com controladorTiros do personagem se nao eram do personagem
    if (this._ehPersPrinc)
      ConjuntoObjetosTela.controladoresTirosJogo[0].concatenarTiros(this);
    else
      ConjuntoObjetosTela.pers.controladorTiros.concatenarTiros(this);
  }
  mudarTempo(porcentagem)
  {
    for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
        this._tiros.classeAndar.mudarTempo(porcentagem);
  }

	//draw
    //desenha todos os tiros
	draw()
	{
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
    {
      this._tiros.atual.draw();
      //se tiro jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._tiros.atual.vivo)
        this._tiros.removerAtual();
    }
	}
}


//TIRO
class InfoTiro extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade)
  {
    super(formaGeometrica, corImgMorto);
    this.ehDoPers = ehDoPers;
    this.infoAndar = infoAndar;
    this.mortalidade = mortalidade;
  }

  clone()
  { return new InfoTiro(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), this.infoAndar.clone(), this.ehDoPers, this.mortalidade); }
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
    if (!this._ehDoPers && Interseccao.interseccao(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica))
    //se tiro de inimigo ou da tela, verifica se bateu em personagem
    {
      //colidir
      this.tirarVidaObjCmVida(ConjuntoObjetosTela.pers);
      this.morreu(TipoObjetos.Personagem);
    }

    let quemBateu = null;
    //verificar colisao com obstaculos
    for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
    {
      const colidiu = ConjuntoObjetosTela.controladoresObstaculos[i].procColidirTiroCriadoTodosObst(this);
      if (colidiu && quemBateu === null)
        quemBateu = {quemAndou: TipoObjetos.Obstaculo, indexAndou: i};
    }

    if (this._ehDoPers)
    // soh os tiros do personagem verificam colisao com inimigos
      for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
      {
        const colidiu = ConjuntoObjetosTela.controladoresInimigos[i].procColidirTiroCriadoTodosInim(this, i);
        if (colidiu && quemBateu === null)
          quemBateu = {quemAndou: TipoObjetos.Inimigo, indexAndou: i};
      }

    if (quemBateu !== null)
      this.morreu(quemBateu.quemAndou, quemBateu.indexAndou);
  }

  //getters e setters
  _seEhImpossivelExcep(tipo)
  {
    //se eh para andar atras do personagem e o tiro eh do proprio personagem, da erro
    if ((this._ehDoPers && (tipo === TipoAndar.SeguirPers || tipo === TipoAndar.DirecaoPers)) ||
      (!this._ehDoPers && (tipo === TipoAndar.SeguirInimMaisProx || tipo === TipoAndar.DirecaoInimMaisProx)))
        throw "Tipo andar ou ehDoPers nao combinam!";
  }
  setTipoAndar(tipo)
  {
    this._seEhImpossivelExcep(tipo);
    this._classeAndar.setTipoAndar(tipo, this._formaGeometrica);
  }

  inverterDono()
  //inverte dono (soh para pocao)
  { this._ehDoPers = !this._ehDoPers; }

  get mortalidade()
  { return this._mortalidade; }
  set mortalidade(qtd)
  { this._mortalidade = qtd; }
  mudarMortalidade(qtdMudar)
  { this._mortalidade += qtdMudar; }

  get ehDoPers()
  { return this._ehDoPers; }
  get classeAndar()
  { return this._classeAndar; }

  get vivo()
  { return this._vivo; }
  morreu(quem, index)
  {
    if ((this._ehDoPers && quem === TipoObjetos.Personagem) ||
        (!this._ehDoPers && quem === TipoObjetos.Inimigo))
        throw "ehDoPers e com quem colidiu nao coincidem!";

    this._emQuemBateu = {index: index, quem: quem};
    this._vivo = false;

    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  ehQuemBateu(quemAndou, indexAndou)
  {
    if (this._emQuemBateu.quem === TipoObjetos.Personagem)
      return this._emQuemBateu.quem === quemAndou;
    return this._emQuemBateu.quem === quemAndou && this._emQuemBateu.index === indexAndou;
  }

  //andar
  andar()
  //retorna se continua na lista ou nao
  {
    //se tiro estah seguindo um ObjTela que jah morreu, continuar andando normal
    const qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //info: menorHipotenusa, listaBateu, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
    let info = {
      listaBateu: new ListaDuplamenteLigada(),
      menorWidth: width,
      menorHeight: height,
      qtdPodeAndarX: qtdAndar.x,
      qtdPodeAndarY: qtdAndar.y,
      menorHipotenusa: Operacoes.hipotenusa(qtdAndar.x, qtdAndar.y),
      qtdAndarXPadrao: qtdAndar.x, //nunca vai ser mudado
      qtdAndarYPadrao: qtdAndar.y //nunca vai ser mudado
    };

    let emQuemBateu = {}; //quem e index
    const qtd = ConjuntoObjetosTela.controladoresObstaculos.length + ((this._ehDoPers)?ConjuntoObjetosTela.controladoresInimigos.length:0);
    const tiroPersAndou = this._ehDoPers;
    //passa por todos obstaculos (e inimigos se for tiro do personagem)
    for(let i = 0; i < qtd; i++)
    {
      let inseriu;
      if (i < ConjuntoObjetosTela.controladoresObstaculos.length)
      //primeiro controlador de obstaculos
        inseriu = ConjuntoObjetosTela.controladoresObstaculos[i].verifColidirTiroPersTodosObst(info, this, tiroPersAndou);
      else
      //depois de inimigos (soh tiros do pesonagem)
        inseriu = ConjuntoObjetosTela.controladoresInimigos[i-ConjuntoObjetosTela.controladoresObstaculos.length].
          verifColidirTiroPersTodosInim(info, this, true);
      //ateh aqui ele vai passar por todos os controladores

      if (inseriu)
      {
        if (i < ConjuntoObjetosTela.controladoresObstaculos.length)
        {
          emQuemBateu.quem = TipoObjetos.Obstaculo;
          emQuemBateu.index = i;
        }
        else
        {
          emQuemBateu.quem = TipoObjetos.Inimigo;
          emQuemBateu.index = i - ConjuntoObjetosTela.controladoresObstaculos.length;
        }
      }
    }

    if (this._ehDoPers)
      return this._andarEhPers(info, emQuemBateu, qtdAndar.x, qtdAndar.y);
    else
      return this._andarNaoEhPers(info, emQuemBateu, qtdAndar.x, qtdAndar.y);
  }
  _andarEhPers(info, emQuemBateu, qtdAndarX, qtdAndarY)
  {
    if (emQuemBateu.quem !== undefined) //se colidiu
    {
      //andar propriamente dito (se colidiu)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
      this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
      this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

      //tirar vida de todos os inimigos que bateu (soh ha mais de um objeto se eles estao no mesmo Y)
      for (info.listaBateu.colocarAtualComeco(); !info.listaBateu.atualEhNulo; info.listaBateu.andarAtual())
        if (info.listaBateu.atual instanceof Inimigo)
          this.tirarVidaObjCmVida(info.listaBateu.atual, true);
        else
        if (info.listaBateu.atual instanceof Obstaculo)
          info.listaBateu.atual.procColidiuTiro(this);
          //se tiver com pocao TipoPocao.MatarObjetos1Tiro mata, else se tem vida, tira
    }else
    {
      //andar propriamente dito se nao colidiu
      this._formaGeometrica.x += info.qtdPodeAndarX;
      this._formaGeometrica.y += info.qtdPodeAndarY;
    }

    //soh verifica se tiro saiu agora pois o tiro pode acertar o inimigo fora da tela
    if (Tela.objSaiuTotalmente(this._formaGeometrica))
      return false;

    if (emQuemBateu.quem !== undefined) //se colidiu
      this.morreu(emQuemBateu.quem, emQuemBateu.index);

    return true;
  }
  _andarNaoEhPers(info, emQuemBateu, qtdAndarX, qtdAndarY)
  {
    //se qnt[Tiro]PodeAndarAntesIntersec[cm pers] for menor do que quanto pode andar no info.menorHipotenusa (qntPodeAndarAntesIntersec ateh obstaculo),
     //entao tira vida do pers e morre para ele
    //else, se bateu em obstaculo morre para ele, caso contrario soh anda

    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica, qtdAndarX, qtdAndarY);
    const hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);
    if (hipotenusa < info.menorHipotenusa)
    //se bateu no pers antes de qntPodeAndarAntesIntersec com o obstaculo
    {
      //andar propriamente dito (se colidiu com pers)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, ConjuntoObjetosTela.pers.formaGeometrica.width, ConjuntoObjetosTela.pers.formaGeometrica.height);
      this._formaGeometrica.x += qtdPodeAndar.x + qntEntra.x;
      this._formaGeometrica.y += qtdPodeAndar.y + qntEntra.y;

      //colidir
      this.tirarVidaObjCmVida(ConjuntoObjetosTela.pers);
      this.morreu(TipoObjetos.Personagem);
    }else
    if (emQuemBateu.quem !== undefined) //se colidiu com obstaculo antes de com o pers
    {
      //andar propriamente dito (se colidiu com obstaculo)
      const qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
      this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
      this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

      this.morreu(emQuemBateu.quem, emQuemBateu.index);
    }
    else //se nao colidiu com ninguem
    {
      //andar propriamente dito (se nao colidiu)
      this._formaGeometrica.x += qtdAndarX;
      this._formaGeometrica.y += qtdAndarY;
    }

    //retorna se nao saiu da tela
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }
  _qntEntra(qtdAndarX, qtdAndarY, menorWidth, menorHeight)
  {
    //ver quanto o tiro deve entrar no obstaculo ou inimigo
    const mult = 0.2; //multiplicador do qtdAndarX e qtdAndarY
    let mudarQntEntra = 0;
    if (Math.abs(mult*qtdAndarX) > menorWidth/2)
      mudarQntEntra++;
    if (Math.abs(mult*qtdAndarY) > menorHeight/2)
      mudarQntEntra += 2;

    let qntEntraX, qntEntraY;
    if (mudarQntEntra)
    {
      switch (mudarQntEntra)
      {
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
    }else
    {
      qntEntraX = mult*qtdAndarX;
      qntEntraY = mult*qtdAndarY;
    }

    return {x: qntEntraX, y: qntEntraY};
  }

  tirarVidaObjCmVida(obj)
  { obj.mudarVida(-this._mortalidade); }

  //se estah morto, jah estah com a cor ou imagem de morto: nao precisa de "draw()"
}
