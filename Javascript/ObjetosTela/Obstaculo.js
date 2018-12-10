//CONTROLADOR OBSTACULOS
class ControladorObstaculos
{
  //O OBSTACULO MORTO SOH VAI SAIR DA LISTA [...] QUANDO OS TIROS DO PERSONAGEM ANDAREM (e o obstaculo tiver colidido com os tiros do pers)
  //ou QUANDO O PERSONAGEM ANDAR (e o obstaculo tiver colidido com o personagem- TEORICAMENTE ESSE ESTAH CERTO em verificarColidirComTiro(...))

  constructor(infoObstaculoPadrao, indexContr)
  {
    //padrao
    this._infoObstaculoPadrao = infoObstaculoPadrao;

    //index controlador
    this._indexContr = indexContr;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._obstaculos = new ListaDuplamenteLigada();
    //pode ter obstaculos sem vida e outroscom
  }

  get infoObstaculoPadrao()
  { return this._infoObstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculoDif(pontoInicial, infoObst, direcaoX, direcaoY, todoQtdDirecao=false)
  {
    if (infoObst === undefined)
    {
      infoObst = this._infoObstaculoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoObst.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, [vida]

      //infoAndar
      AuxControladores.qtdAndarDif(infoObst, this._infoObstaculoPadrao, direcaoX, direcaoY, todoQtdDirecao);

      //qtdTiraVidaNaoConsegueEmpurrarPers, corImgMorto
      if (infoObst.qtdTiraVidaNaoConsegueEmpurrarPers === undefined)
        infoObst.qtdTiraVidaNaoConsegueEmpurrarPers = this._infoObstaculoPadrao.qtdTiraVidaNaoConsegueEmpurrarPers;
      if (infoObst.corImgMorto === undefined)
        infoObst.corImgMorto = this._infoObstaculoPadrao.corImgMorto;

      //corImgEspecial (pode ser nulo)
      if (infoObst.corImgEspecial === undefined)
        infoObst.corImgEspecial = this._infoObstaculoPadrao.corImgEspecial;

      //formaGeometrica
      if (infoObst.formaGeometrica === undefined)
        infoObst.formaGeometrica = this._infoObstaculoPadrao.formaGeometrica;

      //[vida]
      if (infoObst instanceof ObstaculoComVida && infoObst.vida === undefined)
        infoObst.vida = this._infoObstaculoPadrao.vida;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoObstaculoPadrao.formaGeometrica);

    let novoObstaculo;
    if (infoObst instanceof InfoObstaculoComVida) // se eh obstaculo com vida
      novoObstaculo = new ObstaculoComVida(pontoInicial, infoObst);
    else
      novoObstaculo = new Obstaculo(pontoInicial, infoObst);

    this._adicionarObstaculo(novoObstaculo);
  }
  adicionarObstaculo(pontoInicial, infoObstaculo)
  {
		if (infoObstaculo === undefined)
      infoObstaculo = this._infoObstaculoPadrao;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoObstaculo.formaGeometrica);

    const novoObstaculo = new Obstaculo(pontoInicial, infoObstaculo);
    this._adicionarObstaculo(novoObstaculo);
  }
  _adicionarObstaculo(novoObstaculo)
  {
    const podeCriar = novoObstaculo.procCriou(this._indexContr);
    if (podeCriar)
    {
      if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
      // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do obstaculo que for adicionar)
        novoObstaculo.classeAndar.mudarTempo(porcentagemDeixarTempoLento);
      //adicionar novo obstaculo ao comeco da lista
  		this._obstaculos.inserirNoComeco(novoObstaculo);
    }
  }


 //andar
  //andar objetos
  andarObstaculos()
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        this._obstaculos.guardarAtual();

        //retorna se obstaculo continua na lista (o morreu() eh feito la dentro)
        const continuaNaLista = this._obstaculos.atual.andar(this._indexContr);

        this._obstaculos.colocarGuardadoNoAtual();
        //em andar do obstaculo ele percorre toda a lista this._obstaculos em qtdAndarSemColidirOutrosObst(...),
        // entao preciso voltar para onde a lista estava

        if (!continuaNaLista)
        //nao aparece mais na tela
          this._obstaculos.removerAtual();
      }
  }

  //para andar obstaculos
  qtdAndarSemColidirOutrosObst(info, obst)
  //retorna se pode andar sem colidir
  //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual !== obst && this._obstaculos.atual.vivo)
      //se nao eh o mesmo obst e estah vivo
        AuxControladores.auxAndarTiro(info, this._obstaculos.atual, obst, false);
  }

  //para procCriou do obstaculo
  obstVaiColidir(obstVaiCriar)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo && Interseccao.interseccao(obstVaiCriar.formaGeometrica, this._obstaculos.atual.formaGeometrica))
      //obstVaiCriar nao estah em nenhuma lista ainda, entao nao precisa verificar se eh o obstaculo atual eh o proprio obstVaiCriar
        return this._obstaculos.atual;
    return null;
  }

  //andar personagem
  qtdPersPodeAndar(infoQtdMudar)
  {
    //ve quanto que personagem pode mudar
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
        this._obstaculos.atual.qtdPersPodeAndar(infoQtdMudar);
  }

  //colisao com personagem quando cresce (POCAO)
  procPersonagemCresceuTodosObst()
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
        this._obstaculos.atual.verificarColisaoPersEstatico();
  }

  //colisao com tiro
  verifColidirTiroPersTodosObst(info, tiro)
  //esses metodos funcionam por passagem por referencia
  {
    //soh os tiros do personagem podem matar obstaculos, entao se um obstaculo estah morto mas o tiro nao veio do personagem,
    //nao precisa tirar o obstaculo da tela

    let inseriu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._obstaculos.atual, tiro, true) || inseriu;
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com obstaculos)
  procColidirTiroCriadoTodosObst(tiro)
  {
    let colidiu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
        colidiu = this._obstaculos.atual.procColidirTiroCriado(tiro) || colidiu;
    return colidiu;
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
        this._obstaculos.atual.classeAndar.mudarTempo(porcentagem);
  }

	//draw
    //desenha todos os obstaculos
	draw()
	{
		for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
    {
      this._obstaculos.atual.draw();
      //se obstaculo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._obstaculos.atual.vivo)
        this._obstaculos.removerAtual();
    }
	}
}


//OBSTACULO
class InfoObstaculo extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers)
  //corImgEspecial pode ser nulo
  {
    super(formaGeometrica, corImgMorto);
    this.corImgEspecial = corImgEspecial;
    this.qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;
    this.infoAndar = infoAndar;
  }

  clone()
  { return new InfoObstaculo(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), AuxInfo.cloneImgCor(this.corImgEspecial), this.infoAndar.clone(), this.qtdTiraVidaNaoConsegueEmpurrarPers); }
}
class Obstaculo extends ObjetoTela
{
  constructor(pontoInicial, infoObstaculo)
  {
    super(pontoInicial, infoObstaculo);

    //cor
    this._corImgEspecial = infoObstaculo.corImgEspecial;
    this._especial = false;

    //tirar vida
    this._qtdTiraVidaNaoConsegueEmpurrarPers = infoObstaculo.qtdTiraVidaNaoConsegueEmpurrarPers;

    //andar
    this._seEhImpossivelExcep(infoObstaculo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoObstaculo.infoAndar, this._formaGeometrica);
  }

  //procedimentos quando criar obstaculo
  procCriou(indexContrObst)
  //retorna se pode colocar na tela (se obstaculo nao vai colidir com nenhum outro)
  {
    //se o lugar destino jah estiver ocupado, retornar false
    for (let i = 0; i < ConjuntoObjetosTela.controladoresObstaculos.length; i++)
      if (ConjuntoObjetosTela.controladoresObstaculos[i].obstVaiColidir(this) !== null)
      //se iria colidir com algum obstaculo de outro controlador, retorna falso
        return false;

    //colisao com personagem
    this.verificarColisaoPersEstatico();

    //colisao com tiros do pers
    ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, indexContrObst);

    //colisao com tiros dos inimigos (nao tira vida do obstaculo)
    for (let i = 0; i < ConjuntoObjetosTela.controladoresInimigos.length; i++)
      ConjuntoObjetosTela.controladoresInimigos[i].procObjCriadoColidirTirosInim(this, indexContrObst);
    //colisao com tiros da tela (nao tira vida do obstaculo)
    for (let i = 0; i < ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideCriar(this, indexContrObst, false);

    return true;
  }

  //para procCriou obstaculo e aumentar tamanho personagem (eh estatico pois nao nao qtdAndar envolvido)
  verificarColisaoPersEstatico()
  {
    if (Interseccao.interseccao(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica))
    {
      //verifica qual direcao eh mais facil para o personagem sair de cima do obstaculo
      const qtdAndar = Interseccao.menorQtdObjColidePararColidir(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica);
      //tenta empurrar personagem para parar de colidir
      const conseguiuAndarTudo = ConjuntoObjetosTela.pers.mudarXY(qtdAndar.x, qtdAndar.y);
      if (!conseguiuAndarTudo)
      {
        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar();
      }
    }
  }

  //vida
  get vivo()
  { return this._vivo; }
  morreu(explodiu = true)
  //obstaculo normal sempre vai explodir e obstaculo com vida pode ser morto pelo tiro do personagem ou explodir
  {
    this._explodiu = explodiu;
    this._vivo = false;

    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  get explodiu()
  { return this._explodiu; }

  //tirar vida personagem quando nao consegue empurrar o pesonagem
  tirarVidaPersNaoConsegueEmpurrar()
  { ConjuntoObjetosTela.pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

  //outros getters e setters
  get qtdTiraVidaNaoConsegueEmpurrarPers()
  { return this._qtdTiraVidaNaoConsegueEmpurrarPers; }
  get corImgEspecial()
  { return this._corImgEspecial; }

  //andar
  get classeAndar()
  { return this._classeAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo === TipoAndar.SeguirInimMaisProx || tipo === TipoAndar.DirecaoInimMaisProx)
      throw "Obstaculo nao pode seguir inimigos";
  }
  setTipoAndar(tipo)
  {
    this._seEhImpossivelExcep(tipo);
    this._classeAndar.setTipoAndar(tipo, this._formaGeometrica);
  }
  //pode mudar o qtdAndarXY direto da classe

  andar(indexContrObst)
  //contrObst eh usado apenas para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  //retorna se continua na lista
  {
    let qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
    const hipotenusaPadrao = Operacoes.hipotenusa(qtdAndar.x, qtdAndar.y);
    let info =
    {
      menorHipotenusa: hipotenusaPadrao,
      listaBateu: new ListaDuplamenteLigada(),
      qtdPodeAndarX: qtdAndar.x,
      qtdPodeAndarY: qtdAndar.y,
      qtdAndarXPadrao: qtdAndar.x, //nao muda
      qtdAndarYPadrao: qtdAndar.y //nao muda
    };
    for (let i = 0; i<ConjuntoObjetosTela.controladoresObstaculos.length; i++)
      ConjuntoObjetosTela.controladoresObstaculos[i].qtdAndarSemColidirOutrosObst(info, this);
    //colidiu = !info.listaBateu.vazia

    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(ConjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica,
      qtdAndar.x, qtdAndar.y, false);
    const hipotenusaPers = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    // comparar hipotenusa dos obstaculos com a do personagem
    //opcoes: nao colidiu com ninguem, colidiu com obstaculo antes, colidiu com personagem antes
    if (hipotenusaPers < info.menorHipotenusa) //colidiu com pers
    {
      const xPersAntes = ConjuntoObjetosTela.pers.formaGeometrica.x;
      const yPersAntes = ConjuntoObjetosTela.pers.formaGeometrica.y;

      const conseguiuAndarTudo = ConjuntoObjetosTela.pers.mudarXY(qtdAndar.x - qtdPodeAndar.x, qtdAndar.y - qtdPodeAndar.y);
      if (!conseguiuAndarTudo)
      {
        qtdAndar.x = qtdPodeAndar.x + ConjuntoObjetosTela.pers.formaGeometrica.x - xPersAntes;
        qtdAndar.y = qtdPodeAndar.y + ConjuntoObjetosTela.pers.formaGeometrica.y - yPersAntes;

        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar();
      }
    }else
    if (info.menorHipotenusa <= hipotenusaPers || info.meonrHipotenusa !== hipotenusaPadrao)
    //colidiu com outros obstaculos
    {
      // TODO: ta muito porco...

      //muda o qtdAndar baseado na colisao com obstaculos
      qtdAndar.x = info.qtdPodeAndarX;
      qtdAndar.y = info.qtdPodeAndarY;

      //inverter o andar dos outros obstaculos
      let qualInverter = 0; //1: X, 2: Y, 3: X e Y
      for (info.listaBateu.colocarAtualComeco(); !info.listaBateu.atualEhNulo; info.listaBateu.andarAtual())
        if (info.listaBateu.atual.formaGeometrica instanceof FormaGeometricaComplexa)
        {
          qualInverter = 3;
          info.listaBateu.atual.classeAndar.inverterDirecoesQtdAndar(true, true);
        }else
        if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.y + qtdAndar.y, this._formaGeometrica.height,
          info.listaBateu.atual.formaGeometrica.y, info.listaBateu.atual.formaGeometrica.height))
        //se um ficara completamente dentro do outro em Y, muda-se apenas em X
        {
          info.listaBateu.atual.classeAndar.inverterDirecoesQtdAndar(true, false);
          if (qualInverter === 0 || qualInverter === 2)
            qualInverter++; //1: X
        }else
        if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.x + qtdAndar.x, this._formaGeometrica.width,
          info.listaBateu.atual.formaGeometrica.x, info.listaBateu.atual.formaGeometrica.width))
        //se um ficara completamente dentro do outro em X, muda-se apenas em Y
        {
          info.listaBateu.atual.classeAndar.inverterDirecoesQtdAndar(false, true);
          if (qualInverter < 2) // mesma coisa que: (qualInverter === 0 || qualInverter === 1)
            qualInverter += 2; //2: Y
        }else
        //muda as duas direcoes
        {
          qualInverter = 3;
          info.listaBateu.atual.classeAndar.inverterDirecoesQtdAndar(true, true);
        }

      //inverte
      switch (qualInverter)
      {
        case 1:
          this._classeAndar.inverterDirecoesQtdAndar(true, false);
          break;
        case 2:
          this._classeAndar.inverterDirecoesQtdAndar(false, true);
          break;
        case 3:
          this._classeAndar.inverterDirecoesQtdAndar(true, true);
          break;
      }
    }else //se nao colidiu
    { }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse obstaculo andou, ele sai
    ConjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y, indexContrObst, true);
    // dentro desse metodo vai tirar da lista os tiros que jah tinham sido mortos por esse obstaculo
    // e colidir com outros tiros (mata o tiro e se eh obstaculo com vida, tira vida dele)

    //colide com tiros dos inimigos e tiros da tela
    for (let i = 0; i<ConjuntoObjetosTela.controladoresTirosJogo.length; i++)
      ConjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y, indexContrObst, false);
    for (let i = 0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
      ConjuntoObjetosTela.controladoresInimigos[i].procObjTelaAndarColidirTirosTodosInim(this, qtdAndar.x, qtdAndar.y, indexContrObst, false);

    // andar propriamente dito
    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //se estah dentro da tela, continua na lista
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }

  //desenhar
  get especial()
  { return this._especial; }
  set especial(esp)
  {
    // se nao vai mudar nada (morreu ou queria mudar para a mesma coisa)
    if (!this._vivo || this._especial === esp)
      return;

    //mudar cor
    if (esp)
    // nao era especial e agora se tornou
    {
      this._corImgNaoEspecial = this._formaGeometrica.corImg;
      this._formaGeometrica.corImg = this._corImgEspecial;
    }else
    // era especial e agora voltou ao normal
      this._formaGeometrica.corImg = this._corImgNaoEspecial;

    this._especial = esp;
  }
  draw()
  {
    //se estah morto jah estah com cor ou imagem de morto e
    //se estah especial, jah estah com cor ou imagem de morto
    super.draw();
  }

 //outros...
  procColidirTiroCriado(tiro)
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      this.procColidiuTiro(tiro);
      return true;
    }
    return false;
  }

  qtdPersPodeAndar(infoQtdMudar)
  {
    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(this._formaGeometrica, ConjuntoObjetosTela.pers.formaGeometrica,
      infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, false);

    //se tiro vai bater em um obstaculo mais perto que o outro
    if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX))
      infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
    if (Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
      infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
  }

  procColidiuTiro(tiro)
  {
    //se tiro nao for do personagem (for do inimigo ou da tela, nao tira vida)
    if (!tiro.ehDoPers) return;

    if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
    // PARTE DA EXECUCAO DA POCAO
      this._seMatar();
    else
    if (this instanceof ObstaculoComVida)
      tiro.tirarVidaObjCmVida(this);
  }
  _seMatar()
  {
    this._vida = 0;
    this.morreu(false);
  }
}

class InfoObstaculoComVida extends InfoObstaculo
{
  constructor(formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, vida)
  //corImgEspecial pode ser nulo
  {
    super(formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers);
    this.vida = vida;
  }

  clone()
  { return new InfoObstaculoComVida(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), AuxInfo.cloneImgCor(this.corImgEspecial), this.infoAndar.clone(), this.qtdTiraVidaNaoConsegueEmpurrarPers, this.vida); }
}
class ObstaculoComVida extends Obstaculo
{
  //extends Obstaculo pq funcao igual a do obstaculo (mesmo andar()) e nao vai desenhar vida em varios casos

  constructor(pontoInicial, infoObstaculoComVida)
  {
    super(pontoInicial, infoObstaculoComVida);
    this._vida = infoObstaculoComVida.vida;
  }

  //getters e setters vida
  get vida()
  { return this._vida; }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida <= 0)
    {
      //obstaculo morreu pelo tiro do personagem
      this.morreu(false);
      this._vida = 0;
    }
    return this._vida !== 0;
  }

  //draw (nao desenha vida)
}