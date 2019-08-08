//OBSTACULO
const porcPerdaColisaoObst = 0.8;
class InfoObstaculo extends InfoObjetoTela
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, infoAndar, qtdTiraVidaBatePers, qtdTiraVidaNaoConsegueEmpurrarPers, anguloRotacionarObst)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto);
    this.infoAndar = infoAndar;
    this.qtdTiraVidaBatePers = qtdTiraVidaBatePers;
    this.qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;
    this.anguloRotacionarObst = anguloRotacionarObst;
  }

  clone()
  { return new InfoObstaculo(this.formaGeometrica, this.infoImgVivo.clone(), this.infoImgMorto.clone(), this.infoAndar.clone(), this.qtdTiraVidaBatePers, this.qtdTiraVidaNaoConsegueEmpurrarPers, this.anguloRotacionarObst); }
}
class Obstaculo extends ObjetoTela
{
  constructor(pontoInicial, infoObstaculo)
  {
    super(pontoInicial, infoObstaculo);

    //tirar vida
    this._qtdTiraVidaBatePers = infoObstaculo.qtdTiraVidaBatePers;
    this._qtdTiraVidaNaoConsegueEmpurrarPers = infoObstaculo.qtdTiraVidaNaoConsegueEmpurrarPers;

    //andar
    this._seEhImpossivelExcep(infoObstaculo.infoAndar.tipoAndar);
    this._classeAndar = new ClasseAndar(infoObstaculo.infoAndar, this._formaGeometrica);

    //para rotacionar obstaculos (nao necessario)
    if (infoObstaculo.anguloRotacionarObst !== undefined)
      this._anguloRotacionarObst = infoObstaculo.anguloRotacionarObst;
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
    //colisao com tiros dos suportesAereos (nao tira vida do obstaculo)
    ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.procObjCriadoColideTiros(this, false));
    //colisao com tiros sem dono (nao tira vida do obstaculo)
    ControladorJogo.controladorOutrosTirosNaoPers.procObjCriadoColideTiros(this, false);

    //verificar se colidiu com algum obstaculo
    const colidiuObst = ControladorJogo.controladoresObstaculos.some(controladorObsts =>
      controladorObsts.colideOutroObstParado(this));
    if (colidiuObst)
    //se o lugar destino jah estiver ocupado, morre
      this.morreu();
  }

  //para procCriou obstaculo e aumentar tamanho personagem (eh estatico pois nao nao qtdAndar envolvido)
  procVerifColisaoPersEstatico()
  {
    const conseguiuEmpurrarSePrec = AuxObjetos.procColisaoEstaticaObstComPers(this);
    if (!conseguiuEmpurrarSePrec)
    {
      //obstaculo explode
      this.morreu(true);
      this.tirarVidaPersNaoConsegueEmpurrar();
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
  get qtdTiraVidaBatePers()
  { return this._qtdTiraVidaBatePers; }
  tirarVidaPersNaoConsegueEmpurrar()
  //tirar vida personagem quando nao consegue empurrar o pesonagem
  { ControladorJogo.pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

  //outros getters e setters
  get qtdTiraVidaNaoConsegueEmpurrarPers()
  { return this._qtdTiraVidaNaoConsegueEmpurrarPers; }

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
    //calcular quando eh pra andar
    let qtdAndar = this._classeAndar.procAndar(this._formaGeometrica);

    //andar
    this._mudarXY(qtdAndar);

    //se estah dentro da tela, nao deve ser removido do vetor (mesmo que esteja morto)
    return !Tela.objSaiuTotalmente(this._formaGeometrica);
  }
  _mudarXY(qtdAndar)
  {
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

    const qtdPodeAndar = ControladorJogo.pers.qntPodeAndarAntesIntersecObjAndar(this._formaGeometrica,
      info.qtdPodeAndarX, info.qtdPodeAndarY, true);
    const hipotenusaPers = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    // comparar hipotenusa dos obstaculos com a do personagem
    //opcoes: nao colidiu com ninguem, colidiu com obstaculo antes, colidiu com personagem antes
    if (hipotenusaPers < info.menorHipotenusa) //colidiu com pers
    {
      const xPersAntes = ControladorJogo.pers.formaGeometrica.x;
      const yPersAntes = ControladorJogo.pers.formaGeometrica.y;

      ControladorJogo.pers.colidiuObj(this); // para quando personagem encostar em obstaculo: quando for barrado por ele OU quando obstaculo empurrar pers
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
    if (info.menorHipotenusa <= hipotenusaPers || info.menorHipotenusa !== hipotenusaPadrao)
    //colidiu com outros obstaculos
    {
      //muda o qtdAndar baseado na colisao com obstaculos
      qtdAndar.x = info.qtdPodeAndarX;
      qtdAndar.y = info.qtdPodeAndarY;

      if (info.objsColidiram.length > 0)
      {
        //todos os obstaculos que colidiram vao morrer
        info.objsColidiram.forEach(obstBateu => obstBateu.morreu(true));
        this.morreu(true);
      }
    }

    //verificar se vai bater em tiros do personagem
    ControladorJogo.pers.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y);

    //colide com tiros dos inimigos, dos suportesAereos e dos sem dono
    ControladorJogo.controladorOutrosTirosNaoPers.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y, false);
    ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo =>
      suporteAereo.procObjVaiAndarColideTiros(this, qtdAndar.x, qtdAndar.y, false));
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      controladorInims.procObjAndarColidirTirosInims(this, qtdAndar.x, qtdAndar.y, false));

    // andar propriamente dito
    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    //aqui qtdAndar estah com o valor que andou e info.qtdAndar[X ou Y]Padrao estah com o valor padrao
    //retorna se conseguiu andar tudo
    return info.qtdAndarXPadrao===qtdAndar.x && info.qtdAndarYPadrao===qtdAndar.y;
  }

 //outros...
  qtdPersPodeAndar(infoQtdMudar)
  { AuxObjetos.qtdPersPodeAndar(this, infoQtdMudar); }

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

  draw()
  {
    //para rotacionar obstaculo
    if (this._anguloRotacionarObst !== undefined)
    {
      let formaGeomRotacionada = this._formaGeometrica.clone();
      formaGeomRotacionada.rotacionar(this._anguloRotacionarObst);
      //obs: nao pode jah rotacionar a formaGeometrica do this, porque dessa forma os objetos que colidirem nao andariam

      let objsColidem = []; //obstaculos serao adicionados ao vetor por passagem por referencia
      ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
        controladorObsts.quaisObstColidemOutroParado(this, objsColidem, formaGeomRotacionada));
      if (ControladorJogo.pers.interseccao(formaGeomRotacionada))
        objsColidem.push(ControladorJogo.pers);

      const precisaMorrer = objsColidem.reduce((resultado, objColide) =>
        {
          const qtdAndar = Interseccao.menorQtdObjColidePararColidir(formaGeomRotacionada, objColide.formaGeometrica);

          //tentar fazer com que esse objeto (obstaculo ou personagem) ande todo o necessario
          let conseguiuAndarTudo;
          if (objColide instanceof Obstaculo)
            conseguiuAndarTudo = objColide._mudarXY(qtdAndar);
          else
            conseguiuAndarTudo = objColide.mudarXY(qtdAndar.x, qtdAndar.y);

          return !resultado || !conseguiuAndarTudo;
        }, false);

      //this._formaGeometrica nao foi rotacionada mas sim formaGeomRotacionada, entao colocar forma geometrica rotacionada na forma geometrica do this
      this._formaGeometrica = formaGeomRotacionada;

      if (precisaMorrer)
        this.morreu(true);
    }

    return super.draw();
  }
}

// OBSTACULO COM VIDA
class InfoObstaculoComVida extends InfoObstaculo
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, vida, anguloRotacionarObst)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, anguloRotacionarObst);
    this.vida = vida;
  }

  clone()
  { return new InfoObstaculoComVida(this.formaGeometrica, this.infoImgVivo.clone(), this.infoImgMorto.clone(), this.infoAndar.clone(), this.qtdTiraVidaNaoConsegueEmpurrarPers, this.vida, this.anguloRotacionarObst); }
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


//CONTROLADOR OBSTACULOS
class ControladorObstaculos
{
  constructor(infoObstaculoPadrao, infoObjAparecendoPadrao)
  {
    //padrao
    this._infoObstaculoPadrao = infoObstaculoPadrao.clone();

    // obstaculos que interagem com o meio
    this._obstaculos = new List();
    // obstaculos que NAO interagem com o meio (soh sao printados). para ObjetosTelaAparecendo:
    this._obstaculosSurgindo = new List(); //fila
    this._infoObjAparecendoPadrao = infoObjAparecendoPadrao;

    //para remocao:
    this._indexesRemover = [];
  }

  //setter
  set indexContr(indexContr)
  { this._indexContr = indexContr; }

  get infoObstaculoPadrao()
  { return this._infoObstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculoDif(pontoInicial, alteracoesAndarRotacionar, infoObst, infoObjAparecendo)
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo} e {direcaoAnguloAponta, ehAngulo}
  {
    if (infoObst === undefined)
    {
      infoObst = this._infoObstaculoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      ClasseAndar.qtdAndarDifMudarDir(infoObst.infoAndar, alteracoesAndarRotacionar); //pode ter alteracoesAndar ainda
    }else
    {
      //infoAndar
      ClasseAndar.qtdAndarDif(infoObst, this._infoObstaculoPadrao, alteracoesAndarRotacionar);

      //outros atributos
      AuxiliarInfo.mergeInfoNovoComPadrao(infoObst, this._infoObstaculoPadrao);

      //[vida]
      if (!(infoObst instanceof ObstaculoComVida) && infoObst.vida !== undefined)
        delete infoObst.vida;
    }

    //rotacionar obstaculo
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoObst, alteracoesAndarRotacionar);

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
    infoObjAparecendo.infoImgVivo = infoObstaculo.infoImgVivo;

    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    this._obstaculosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoObjAparecendo, TipoObjetos.Obstaculo, (formaGeomApareceu, indexInicialImgVivo) =>
      {
        //remover esse obstaculo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
        this._obstaculosSurgindo.pop();

        //mudar propriedades do obstaculo para dar ideia de continuidade e nao quebra
        infoObstaculo.formaGeometrica = formaGeomApareceu; //usa a mesma forma (continuidade)
        infoObstaculo.infoImgVivo.indexInicial = indexInicialImgVivo; //para que o index da imagem vivo seja o mesmo
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
          const continuaNoVetor = obst.andar(); //soh retorna que eh para remover se o obstaculo ficar totalmente fora da tela
          if (!continuaNoVetor)
          //nao aparece mais na tela
            this._querRemoverObst(index);
        }
      });

    this._removerObsts(); //realmente remove os obstaculos que queria remover
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
  //para rotacionar obstaculo
  quaisObstColidemOutroParado(outroObst, vetorObsts = [], formaGeomOutroObst = outroObst.formaGeometrica)
  {
    this._obstaculos.forEach(obstAtual =>
      {
        if (obstAtual.vivo &&
          obstAtual !== outroObst && //se nao eh o mesmo objeto
          Interseccao.interseccao(obstAtual.formaGeometrica, formaGeomOutroObst))
          vetorObsts.push(obstAtual);
      });
    return vetorObsts;
  }

  //para procCriou do obstaculo
  colideOutroObstParado(obstVaiCriar)
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

  //para saber se painel personagem vai ser printado normal ou um pouco opaco
  algumObstNesseEspaco(formaGeomEspaco)
  {
    //Obstaculo
    const interseccaoObst = this._obstaculos.some(obst =>
      Interseccao.interseccaoComoRetangulos(formaGeomEspaco, obst.formaGeometrica));
    if (interseccaoObst)
      return true;

    //Obstaculo SURGINDO
    const interseccaoObstSurgindo = this._obstaculosSurgindo.some(obstSurg =>
      Interseccao.interseccaoComoRetangulos(formaGeomEspaco, obstSurg.formaGeometrica));
    if (interseccaoObstSurgindo)
      return true;

    //nao intersectou nenhum obstaculo
    return false;
  }

	//draw
    //desenha todos os obstaculos
	draw() //soh obstaculos que jah interagem com o meio (nao obstaculosSurgindo)
	{
    this._obstaculos.forEach((obst, index) =>
      {
        const removerDoVetor = obst.draw(); //soh retorna que eh pra remover se jah printou todas as imagens de morto
        if (removerDoVetor)
          this._querRemoverObst(index);
      });

    this._removerObsts(); //realmente remove os obstaculos que queria remover
	}
  drawSurgindo() //desenha obstaculos surgindo
  { this._obstaculosSurgindo.forEach(obstSurgindo => obstSurgindo.draw()); }

  //remover obstaculos
  //obs: nao pode remover durante o forEach, se nao o loop nao iterarah sobre todos os elementos, entao tem que guardar todos os indices dos elementos que quer quer deletar e depois deletar todos
  _querRemoverObst(index)
  {
    this._indexesRemover.push(index);
  }
  _removerObsts()
  {
    this._indexesRemover.forEach((indexRemover, i) => this._obstaculos.splice(indexRemover-i, 1));
    //"-i" porque a cada elemento que eh removido proximos elementos decaem uma posicao (e [i] eh o numero de elementos que jah foram removidos)

    this._indexesRemover = []; //jah removeu todos os inimigos
  }
}
