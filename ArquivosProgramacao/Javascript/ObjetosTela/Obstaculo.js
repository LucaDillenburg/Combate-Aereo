//CONTROLADOR OBSTACULOS
class ControladorObstaculos
{
  constructor(indexContr, infoObstaculoPadrao, infoObjAparecendoPadrao)
  {
    //padrao
    this._infoObstaculoPadrao = infoObstaculoPadrao.clone();

    //index controlador
    this._indexContr = indexContr;

    // obstaculos que interagem com o meio
    this._obstaculos = [];
    // obstaculos que NAO interagem com o meio (soh sao printados). para ObjetosTelaAparecendo:
    this._obstaculosSurgindo = []; //fila
    this._infoObjAparecendoPadrao = infoObjAparecendoPadrao;
  }

  get infoObstaculoPadrao()
  { return this._infoObstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculoDif(pontoInicial, alteracoesAndar, infoObst, infoObjAparecendo)
  // alteracoesAndar: {direcao} ou {angulo} (ver explicacao em AuxControladores)
  {
    if (infoObst === undefined)
    {
      infoObst = this._infoObstaculoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      ClasseAndar.qtdAndarDifMudarDir(infoObst.infoAndar, alteracoesAndar); //pode ter alteracoesAndar ainda
    }else
    {
      //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, [vida]

      //infoAndar
      ClasseAndar.qtdAndarDif(infoObst, this._infoObstaculoPadrao, alteracoesAndar);

      //qtdTiraVidaBatePers, qtdTiraVidaNaoConsegueEmpurrarPers, corImgMorto
      if (infoObst.qtdTiraVidaBatePers === undefined)
        infoObst.qtdTiraVidaBatePers = this._infoObstaculoPadrao.qtdTiraVidaBatePers;
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

    this._adicionarObstaculo(pontoInicial, infoObst, infoObjAparecendo);
  }
  adicionarObstaculo(pontoInicial, infoObstaculo, infoObjAparecendo)
  {
		if (infoObstaculo === undefined)
      infoObstaculo = this._infoObstaculoPadrao;

    this._adicionarObstaculo(pontoInicial, infoObstaculo, infoObjAparecendo);
  }
  _adicionarObstaculo(pontoInicial, infoObstaculo, infoObjAparecendo)
  {
    //mesclar InfoObjAparecendo com InfoObjAparecendoPadrao
    infoObjAparecendo = AuxControladores.infoObjAparecendoCorreto(infoObjAparecendo, this._infoObjAparecendoPadrao);
    infoObjAparecendo.formaGeometrica = infoObstaculo.formaGeometrica;

    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    this._obstaculosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoObjAparecendo, () =>
      {
        //remover esse obstaculo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
        this._obstaculosSurgindo.pop();

        //adicionar obstaculo que interage com o meio
        let novoObstaculo;
        if (infoObstaculo instanceof InfoObstaculoComVida) // se eh obstaculo com vida
          novoObstaculo = new ObstaculoComVida(pontoInicial, infoObstaculo);
        else
          novoObstaculo = new Obstaculo(pontoInicial, infoObstaculo);

        novoObstaculo.procCriou();

        if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
        // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do obstaculo que for adicionar)
          novoObstaculo.classeAndar.mudarTempo(porcentagemDeixarTempoLento);
        //adicionar novo obstaculo ao final do vetor
    		this._obstaculos.push(novoObstaculo);
      }));
  }


 //andar
  //andar objetos
  andarObstaculos()
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    this._obstaculos.forEach((obst, index) =>
      {
        if (obst.vivo)
        {
          //retorna se obstaculo continua no vetor de obstaculos (pode estar morto ou nao)
          const continuaNoVetor = obst.andar();
          if (!continuaNoVetor)
          //nao aparece mais na tela
            this._removerObst(index);
        }
      });
  }

  //para andar obstaculos
  qtdAndarSemColidirOutrosObsts(info, obstQuerAndar)
  //retorna se pode andar sem colidir
  {
    this._obstaculos.forEach(obstAtual =>
      {
        if (obstAtual !== obstQuerAndar && obstAtual.vivo)
        //se nao eh o mesmo obst e estah vivo
          ClasseAndar.infoQtdAndarNaoColidir(info, obstAtual, obstQuerAndar, false);
      });
  }

  //para procCriou do obstaculo
  vaiColidirOutroObst(obstVaiCriar)
  {
    return this._obstaculos.some(obstAtual =>
      obstAtual.vivo && Interseccao.interseccao(obstVaiCriar.formaGeometrica, obstAtual.formaGeometrica));
    //ps: obstVaiCriar nao estah em nenhum vetor de obstaculo de nenhum controlador ainda, entao nao precisa verificar se eh o obstaculo atual eh o proprio obstVaiCriar
  }

  //andar personagem (obstaculo barrando personagem)
  qtdPersPodeAndar(infoQtdMudar)
  {
    //ve quanto que personagem pode mudar
    this._obstaculos.forEach(obst =>
      {
        if (obst.vivo)
          obst.qtdPersPodeAndar(infoQtdMudar);
      });
  }

  //colisao com personagem quando cresce (POCAO)
  procPersCresceu()
  {
    this._obstaculos.forEach(obst =>
      {
        if (obst.vivo)
          obst.procVerifColisaoPersEstatico();
      });
  }

  //colisao com tiro
  verifTiroVaiAndarColideObsts(info, tiro)
  //esses metodos funcionam por passagem por referencia
  {
    let inseriu = false;
    this._obstaculos.forEach(obst =>
      {
        if (obst.vivo)
          inseriu = ClasseAndar.infoQtdAndarNaoColidir(info, obst, tiro, true) || inseriu;
      });
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com obstaculos)
  procObstsColidirTiroCriado(tiro)
  {
    let colidiu = false;
    this._obstaculos.forEach(obst =>
      {
        if (obst.vivo)
          colidiu = obst.procColidirTiroCriado(tiro) || colidiu;
      });
    return colidiu;
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    this._obstaculos.forEach(obst =>
      {
        if (obst.vivo)
          obst.classeAndar.mudarTempo(porcentagem);
      });
  }

	//draw
    //desenha todos os obstaculos
	draw() //soh obstaculos que jah interagem com o meio (nao obstaculosSurgindo)
	{
    this._obstaculos.forEach((obst, index) =>
      {
        obst.draw();

        //se obstaculo jah morreu (desenhar ele a ultima vez e depois remove-lo do vetor de obstaculos)
        if (!obst.vivo)
          this._removerObst(index);
      });
	}
  drawSurgindo() //desenha obstaculos surgindo
  { this._obstaculosSurgindo.forEach(obstSurgindo => obstSurgindo.draw()); }

  //auxiliar
  _removerObst(index)
  {
    this._obstaculos.splice(index,1);
    //remover 1 elemento a partir de indexInim
  }
}


//OBSTACULO
class InfoObstaculo extends InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaBatePers, qtdTiraVidaNaoConsegueEmpurrarPers)
  //corImgEspecial pode ser nulo
  {
    super(formaGeometrica, corImgMorto);
    this.corImgEspecial = corImgEspecial;
    this.infoAndar = infoAndar;
    this.qtdTiraVidaBatePers = qtdTiraVidaBatePers;
    this.qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;
  }

  clone()
  { return new InfoObstaculo(this.formaGeometrica, AuxInfo.cloneImgCor(this.corImgMorto), AuxInfo.cloneImgCor(this.corImgEspecial), this.infoAndar.clone(), this.qtdTiraVidaBatePers, this.qtdTiraVidaNaoConsegueEmpurrarPers); }
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
    this._qtdTiraVidaBatePers = infoObstaculo.qtdTiraVidaBatePers;
    this._qtdTiraVidaNaoConsegueEmpurrarPers = infoObstaculo.qtdTiraVidaNaoConsegueEmpurrarPers;

    //andar
    this._seEhImpossivelExcep(infoObstaculo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoObstaculo.infoAndar, this._formaGeometrica);
  }

  //procedimentos quando criar obstaculo
  procCriou()
  //se nao pode colocar na tela (se obstaculo nao vai colidir com nenhum outro), morre
  {
    //colisao com personagem
    this.procVerifColisaoPersEstatico();

    //colisao com tiros do pers
    ControladorJogo.pers.procObjCriadoColideTiros(this);

    //colisao com tiros dos inimigos (nao tira vida do obstaculo)
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      controladorInims.procObjCriadoColidirTirosInims(this));
    //colisao com tiros da tela (nao tira vida do obstaculo)
    ControladorJogo.controladoresTirosJogo.forEach(controladorTirosJogo =>
      controladorTirosJogo.procObjCriadoColideTiros(this, false));

    //verificar se colidiu com algum obstaculo
    const colidiuObst = ControladorJogo.controladoresObstaculos.some(controladorObsts =>
      controladorObsts.vaiColidirOutroObst(this));
    if (colidiuObst)
    //se o lugar destino jah estiver ocupado, morre
      this.morreu();
  }

  //para procCriou obstaculo e aumentar tamanho personagem (eh estatico pois nao nao qtdAndar envolvido)
  procVerifColisaoPersEstatico()
  {
    if (Interseccao.interseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica))
    {
      //verifica qual direcao eh mais facil para o personagem sair de cima do obstaculo
      const qtdAndar = Interseccao.menorQtdObjColidePararColidir(this._formaGeometrica, ControladorJogo.pers.formaGeometrica);
      //tenta empurrar personagem para parar de colidir
      const conseguiuAndarTudo = ControladorJogo.pers.mudarXY(qtdAndar.x, qtdAndar.y);
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
    super.morreu();
    this._explodiu = explodiu;
  }
  get explodiu()
  { return this._explodiu; }

  // tirar vida personagem
  tirarVidaPersBateu()
  //para quando personagem encostar em obstaculo: quando for barrado por ele OU quando obstaculo empurrar pers
  { ControladorJogo.pers.mudarVida(-this._qtdTiraVidaBatePers); }
  tirarVidaPersNaoConsegueEmpurrar()
  //tirar vida personagem quando nao consegue empurrar o pesonagem
  { ControladorJogo.pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

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

  andar()
  //contrObst eh usado apenas para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  //retorna se continua no vetor de obsaculos
  {
    let qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //info: menorHipotenusa, objsColidiram, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
    const hipotenusaPadrao = Operacoes.hipotenusa(qtdAndar.x, qtdAndar.y);
    let info =
    {
      menorHipotenusa: hipotenusaPadrao,
      objsColidiram: [],
      qtdPodeAndarX: qtdAndar.x,
      qtdPodeAndarY: qtdAndar.y,
      qtdAndarXPadrao: qtdAndar.x, //nao muda
      qtdAndarYPadrao: qtdAndar.y //nao muda
    };
    ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
      controladorObsts.qtdAndarSemColidirOutrosObsts(info, this));
    //colidiu: info.objsColidiram.length>0

    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(ControladorJogo.pers.formaGeometrica, this._formaGeometrica,
      info.qtdPodeAndarX, info.qtdPodeAndarY, false);
    const hipotenusaPers = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    // comparar hipotenusa dos obstaculos com a do personagem
    //opcoes: nao colidiu com ninguem, colidiu com obstaculo antes, colidiu com personagem antes
    if (hipotenusaPers < info.menorHipotenusa) //colidiu com pers
    {
      const xPersAntes = ControladorJogo.pers.formaGeometrica.x;
      const yPersAntes = ControladorJogo.pers.formaGeometrica.y;

      this.tirarVidaPersBateu(); // para quando personagem encostar em obstaculo: quando for barrado por ele OU quando obstaculo empurrar pers
      const conseguiuAndarTudo = ControladorJogo.pers.mudarXY(qtdAndar.x - qtdPodeAndar.x, qtdAndar.y - qtdPodeAndar.y);
      if (!conseguiuAndarTudo)
      {
        qtdAndar.x = qtdPodeAndar.x + ControladorJogo.pers.formaGeometrica.x - xPersAntes;
        qtdAndar.y = qtdPodeAndar.y + ControladorJogo.pers.formaGeometrica.y - yPersAntes;

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
      info.objsColidiram.forEach(obstBateu =>
        {
          if (obstBateu.formaGeometrica instanceof FormaGeometricaComplexa)
          {
            qualInverter = 3;
            obstBateu.classeAndar.inverterDirecoesQtdAndar(true, true);
          }else
          if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.y + qtdAndar.y, this._formaGeometrica.height,
            obstBateu.formaGeometrica.y, obstBateu.formaGeometrica.height))
          //se um ficara completamente dentro do outro em Y, muda-se apenas em X
          {
            obstBateu.classeAndar.inverterDirecoesQtdAndar(true, false);
            if (qualInverter === 0 || qualInverter === 2)
              qualInverter++; //1: X
          }else
          if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.x + qtdAndar.x, this._formaGeometrica.width,
            obstBateu.formaGeometrica.x, obstBateu.formaGeometrica.width))
          //se um ficara completamente dentro do outro em X, muda-se apenas em Y
          {
            obstBateu.classeAndar.inverterDirecoesQtdAndar(false, true);
            if (qualInverter < 2) // mesma coisa que: (qualInverter === 0 || qualInverter === 1)
              qualInverter += 2; //2: Y
          }else
          //muda as duas direcoes
          {
            qualInverter = 3;
            obstBateu.classeAndar.inverterDirecoesQtdAndar(true, true);
          }
        });

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
    }

    //verificar se vai bater em tiros do personagem
    ControladorJogo.pers.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y);

    //colide com tiros dos inimigos e tiros da tela
    ControladorJogo.controladoresTirosJogo.forEach(controladorTirosJogo =>
      controladorTirosJogo.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y, false));
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      controladorInims.procObjAndarColidirTirosInims(this, qtdAndar.x, qtdAndar.y, false));

    // andar propriamente dito
    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //se estah dentro da tela, nao deve ser removido do vetor (mesmo que esteja morto)
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
  qtdPersPodeAndar(infoQtdMudar)
  {
    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(this._formaGeometrica, ControladorJogo.pers.formaGeometrica,
      infoQtdMudar.qtdMudarXPadrao, infoQtdMudar.qtdMudarYPadrao, false);

    //se personagem vai bater em um obstaculo mais perto (pelo menos em alguma direcao) que o outro
    if ((qtdPodeAndar.x !== infoQtdMudar.qtdMudarXPadrao || qtdPodeAndar.y !== infoQtdMudar.qtdMudarYPadrao) && //se andou menos que alguma direcao em qtdAndarXYPadrao
      (Math.abs(qtdPodeAndar.x) <= Math.abs(infoQtdMudar.qtdPodeMudarX) || Math.abs(qtdPodeAndar.y) <= Math.abs(infoQtdMudar.qtdPodeMudarY)))
    {
      // se esse obstaculo estah mais perto que os outros (nas duas direcoes
      if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX) && Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
        infoQtdMudar.obstaculosBarram = [];
      infoQtdMudar.obstaculosBarram.push(this);

      if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX))
        infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
      if (Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
        infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
    }
  }

  procColidirTiroCriado(tiro)
  //retorna se colidiu com tiro
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      this.procColidiuTiro(tiro);
      return true;
    }
    return false;
  }
  procColidiuTiro(tiro)
  {
    //se tiro nao for do personagem (for do inimigo ou da tela, nao tira vida)
    if (!tiro.ehDoPers) return;

    if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
    // PARTE DA EXECUCAO DA POCAO
      this._seMatar();
    else
    if (this instanceof ObstaculoComVida)
      tiro.tirarVidaObjCmVida(this);
  }
  _seMatar()
  {
    if (this instanceof ObstaculoComVida)
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
