//import "FormasGeometricas.js";
//import "ListaDuplamenteLigada.js";

class ObjetoTela
{
  constructor(formaGeometrica)
  {
    this._formaGeometrica = formaGeometrica;
  }

  get formaGeometrica()
  { return this._formaGeometrica; }

  colocarNoMeioX()
  { this._formaGeometrica.colocarNoMeioX(); }

  draw()
  { this._formaGeometrica.draw(); }
}

class ObjetoTelaMorre extends ObjetoTela
{
  constructor(formaGeometrica, corImgMorto)
  {
    super(formaGeometrica);
    this._corImgMorto = corImgMorto;
    this._vivo = true;
  }

  //getters e setters
  get corImgMorto()
  { return this._corImgMorto; }
  set corImgMorto(corImgMorto)
  { this._corImgMorto = corImgMorto; }

  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }
}


//TIRO
class Tiro extends ObjetoTelaMorre
{
  constructor(formaGeometrica, corImgMorto, infoAndar, conjuntoObjetosTela, ehDoPers, mortalidade)
  //soh precisa colocar conjuntoObjetosTela se tipoAndar for SEGUIR_INIM_MAIS_PROX, DIRECAO_INIM_MAIS_PROX ou DIRECAO_PERS
  //infoAndar: qtdAndarX, qtdAndarY, tipoAndar
  {
    super(formaGeometrica, corImgMorto);

    //eh do pers
    this._ehDoPers = ehDoPers;

    //andar
    this._seEhImpossivelExcep(infoAndar.tipoAndar);
    if (conjuntoObjetosTela==null)
      this._infoAndar = infoAndar.clone();
    else
      this._infoAndar = infoAndar.clone(this._formaGeometrica, conjuntoObjetosTela.pers,
        conjuntoObjetosTela.controladoresInimigos);

    //mortalidade
    this._mortalidade = mortalidade;
  }

  //procedimentos quando criar obstaculo
  procCriou(conjuntoObjetosTela)
  {
    if (!this._ehDoPers && Interseccao.interseccao(conjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica))
    //se tiro de inimigo ou da tela, verifica se bateu em personagem
    {
      //colidir
      this.tirarVidaObjCmVida(conjuntoObjetosTela.pers);
      this.morreu(Tiro.COLIDIU_COM_PERSONAGEM);
    }

    let quemBateu = null;
    //verificar colisao com obstaculos
    for (let i = 0; i<conjuntoObjetosTela.controladoresObstaculos.length; i++)
    {
      let colidiu = conjuntoObjetosTela.controladoresObstaculos[i].procColidirTiroCriadoTodosObst(this);
      if (colidiu && quemBateu == null)
        quemBateu = {quemAndou: Tiro.COLIDIU_COM_OBSTACULO, indexAndou: i};
    }

    if (this._ehDoPers)
    // soh os tiros do personagem verificam colisao com inimigos
      for (let i = 0; i<conjuntoObjetosTela.controladoresInimigos.length; i++)
      {
        let colidiu = conjuntoObjetosTela.controladoresInimigos[i].procColidirTiroCriadoTodosInim(this);
        if (colidiu && quemBateu == null)
          quemBateu = {quemAndou: Tiro.COLIDIU_COM_INIMIGO, indexAndou: i};
      }

    if (quemBateu != null)
      this.morreu(quemBateu.quemAndou, quemBateu.indexAndou);
  }

  //getters e setters
  _seEhImpossivelExcep(tipo)
  {
    //se eh para andar atras do personagem e o tiro eh do proprio personagem, da erro
    if ((this._ehDoPers && (tipo == Andar.SEGUIR_PERS || tipo == Andar.DIRECAO_PERS)) ||
      (!this._ehDoPers && (tipo == Andar.SEGUIR_INIM_MAIS_PROX || tipo == Andar.DIRECAO_INIM_MAIS_PROX)))
        throw "Tipo andar ou ehDoPers nao combinam!";
  }
  setTipoAndar(tipo, pers, controladoresInimigos) //soh precisa colocar conjuntoObjetosTela se tipo for SEGUIR_...
  {
    this._seEhImpossivelExcep(tipo);
    this._infoAndar.setTipoAndar(tipo, this._formaGeometrica, pers, controladoresInimigos);
  }
  //pode mudar o qtdAndarXY direto da classe

  get mortalidade()
  { return this._mortalidade; }
  set mortalidade(qtd)
  { this._mortalidade = qtd; }
  mudarMortalidade(qtdMudar)
  { this._mortalidade += qtdMudar; }

  get ehDoPers()
  { return this._ehDoPers; }
  get infoAndar()
  { return this._infoAndar; }

  get vivo()
  { return this._vivo; }
  static get COLIDIU_COM_PERSONAGEM()
  { return 1; }
  static get COLIDIU_COM_INIMIGO()
  { return 2; }
  static get COLIDIU_COM_OBSTACULO()
  { return 3; }
  morreu(quem, index)
  {
    if ((this._ehDoPers && quem == Tiro.COLIDIU_COM_PERSONAGEM) ||
        (!this.ehDoPers && quem == Tiro.COLIDIU_COM_INIMIGO))
        throw "ehDoPers e com quem colidiu nao coincidem!";

    this._emQuemBateu = {index: index, quem: quem};
    this._vivo = false;

    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  ehQuemBateu(quemAndou, indexAndou)
  {
    //if (this._emQuemBateu == null) return false; acho que nao precisa
    if (this._emQuemBateu.quem == Tiro.COLIDIU_COM_PERSONAGEM)
      return this._emQuemBateu.quem == quemAndou;
    return this._emQuemBateu.quem == quemAndou && this._emQuemBateu.index == indexAndou;
  }

  //andar
  andar(conjuntoObjetosTela)
  //retorna se continua na lista ou nao
  {
    //se tiro estah seguindo um ObjTela que jah morreu, continuar andando normal
    let qtdAndar = this._infoAndar.procAndar(conjuntoObjetosTela.pers, this._formaGeometrica);

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

    let emQuemBateu = {quem: null, index: -1};
    let qtd = conjuntoObjetosTela.controladoresObstaculos.length + ((this._ehDoPers)?conjuntoObjetosTela.controladoresInimigos.length:0);
    let tiroPersAndou = this._ehDoPers;
    //passa por todos obstaculos (e inimigos se for tiro do personagem)
    for(let i = 0; i < qtd; i++)
    {
      let inseriu;
      if (i < conjuntoObjetosTela.controladoresObstaculos.length)
      //primeiro controlador de obstaculos
        inseriu = conjuntoObjetosTela.controladoresObstaculos[i].verificarColidirComTiro(info, this, tiroPersAndou);
      else
      //depois de inimigos (soh tiros do pesonagem)
        inseriu = conjuntoObjetosTela.controladoresInimigos[i-conjuntoObjetosTela.controladoresObstaculos.length].
          verificarColidirComTiro(info, this, conjuntoObjetosTela.controladoresTirosJogo, true);
      //ateh aqui ele vai passar por todos os controladores

      if (inseriu)
      {
        if (i < conjuntoObjetosTela.controladoresObstaculos.length)
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_OBSTACULO;
          emQuemBateu.index = i;
        }
        else
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_INIMIGO;
          emQuemBateu.index = i - conjuntoObjetosTela.controladoresObstaculos.length;
        }
      }
    }

    //colidiu = emQuemBateu == null;

    if (this._ehDoPers)
      return this._andarEhPers(info, emQuemBateu, qtdAndar.x, qtdAndar.y);
    else
      return this._andarNaoEhPers(info, emQuemBateu, conjuntoObjetosTela.pers, qtdAndar.x, qtdAndar.y);
  }
  _andarEhPers(info, emQuemBateu, qtdAndarX, qtdAndarY)
  {
    if (emQuemBateu.quem != null) //se colidiu
    {
      //andar propriamente dito (se colidiu)
      let qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
      this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
      this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

      //tirar vida de todos os inimigos que bateu (soh ha mais de um objeto se eles estao no mesmo Y)
      for (info.listaBateu.colocarAtualComeco(); !info.listaBateu.atualEhNulo; info.listaBateu.andarAtual())
        if (info.listaBateu.atual instanceof Inimigo || info.listaBateu.atual instanceof ObstaculoComVida)
        //se tem vida, tira
          this.tirarVidaObjCmVida(info.listaBateu.atual);
    }else
    {
      //andar propriamente dito se nao colidiu
      this._formaGeometrica.x += info.qtdPodeAndarX;
      this._formaGeometrica.y += info.qtdPodeAndarY;
    }

    //soh verifica se tiro saiu agora pois o tiro pode acertar o inimigo fora da tela
    if (Tela.objSaiuTotalmente(this._formaGeometrica))
      return false;

    if (emQuemBateu.quem != null) //se colidiu
      this.morreu(emQuemBateu.quem, emQuemBateu.index);

    return true;
  }
  _andarNaoEhPers(info, emQuemBateu, pers, qtdAndarX, qtdAndarY)
  {
    //se qnt[Tiro]PodeAndarAntesIntersec[cm pers] for menor do que quanto pode andar no info.menorHipotenusa (qntPodeAndarAntesIntersec ateh obstaculo),
     //entao tira vida do pers e morre para ele
    //else, se bateu em obstaculo morre para ele, caso contrario soh anda

    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(pers.formaGeometrica, this._formaGeometrica, qtdAndarX, qtdAndarY);
    let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);
    if (hipotenusa < info.menorHipotenusa)
    //se bateu no pers antes de qntPodeAndarAntesIntersec com o obstaculo
    {
      //andar propriamente dito (se colidiu com pers)
      let qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, pers.formaGeometrica.width, pers.formaGeometrica.height);
      this._formaGeometrica.x += qtdPodeAndar.x + qntEntra.x;
      this._formaGeometrica.y += qtdPodeAndar.y + qntEntra.y;

      //colidir
      this.tirarVidaObjCmVida(pers);
      this.morreu(Tiro.COLIDIU_COM_PERSONAGEM);
    }else
    if (emQuemBateu.quem != null) //se colidiu com obstaculo antes de com o pers
    {
      //andar propriamente dito (se colidiu com obstaculo)
      let qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
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
    let mult = 0.2; //multiplicador do qtdAndarX e qtdAndarY
    let mudarQntEntra = 0;
    if (Math.abs(mult*qtdAndarX) > menorWidth/2)
      mudarQntEntra++;
    if (Math.abs(mult*qtdAndarY) > menorHeight/2)
      mudarQntEntra += 2;

    let qntEntraX;
    let qntEntraY;
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
          let qntEntraX1 = menorWidth/2 * (qtdAndarX>0?1:-1);
          let qntEntraY1 = (qntEntraX1*qtdAndarY)/qtdAndarX;

          let qntEntraY2 = menorHeight/2 * (qtdAndarY>0?1:-1);

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

  //clone
  clone(x, y, conjuntoObjetosTela)
  {
    return new Tiro(this._formaGeometrica.clone(x,y), this._corImgMorto,
      this._infoAndar, conjuntoObjetosTela, this._ehDoPers, this._mortalidade);
  }
}


//OBSTACULO
class Obstaculo extends ObjetoTelaMorre
{
  constructor(formaGeometrica, coresImgsDiferentes, infoAndar, pers, qtdTiraVidaNaoConsegueEmpurrarPers)
  // coresImgsDiferentes: corImgEspecial, corImgMorto
  // infoAndar: qtdAndarX, qtdAndarY, tipoAndar
  // pers eh necessario apenas se tipo andar for DIRECAO_PERS
  {
    super(formaGeometrica, coresImgsDiferentes.corImgMorto);

    //cor
    this._corImgEspecial = coresImgsDiferentes.corImgEspecial;
    this._especial = false;

    //tirar vida
    this._qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;

    //andar
    this._seEhImpossivelExcep(infoAndar.tipoAndar);
    this._infoAndar = infoAndar.clone(this._formaGeometrica, pers);
  }

  //procedimentos quando criar obstaculo
  procCriou(conjuntoObjetosTela, indexContrObst)
  //retorna se pode colocar na tela (se obstaculo nao vai colidir com nenhum outro)
  {
    //se o lugar destino jah estiver ocupado, retornar false
    for (let i = 0; i<conjuntoObjetosTela.controladoresObstaculos.length; i++)
      if (conjuntoObjetosTela.controladoresObstaculos[i].obstVaiColidir(this) != null)
      //se iria colidir com algum obstaculo de outro controlador, retorna falso
        return false;

    //colisao com personagem
    if (Interseccao.interseccao(this._formaGeometrica, conjuntoObjetosTela.pers.formaGeometrica))
    {
      //verifica qual direcao eh mais facil para o personagem sair de cima do obstaculo
      let qtdAndar = Interseccao.menorQtdObjColidePararColidir(this._formaGeometrica, conjuntoObjetosTela.pers.formaGeometrica);
      let conseguiuAndarTudo = conjuntoObjetosTela.pers.mudarXY(qtdAndar.x, qtdAndar.y, conjuntoObjetosTela);
      if (!conseguiuAndarTudo)
      {
        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar(conjuntoObjetosTela.pers);
      }
    }

    //colisao com tiros do pers
    conjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, ControladorTiros.OBSTACULOS_CRIADO, indexContrObst);

    //colisao com tiros dos inimigos (nao tira vida do obstaculo)
    for (let i = 0; i < conjuntoObjetosTela.controladoresInimigos.length; i++)
      conjuntoObjetosTela.controladoresInimigos[i].procObstCriadoColidirTirosInim(this, indexContrObst);
    //colisao com tiros da tela (nao tira vida do obstaculo)
    for (let i = 0; i<conjuntoObjetosTela.controladoresTirosJogo.length; i++)
      conjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideCriar(this, ControladorTiros.OBSTACULOS_CRIADO, indexContrObst, false);

    return true;
  }

  //vida
  get vivo()
  { return this._vivo; }
  morreu(explodiu)
  //obstaculo normal sempre vai explodir e obstaculo com vida pode ser morto pelo tiro do personagem ou explodir
  {
    if (explodiu == null)
      explodiu = true;
    this._explodiu = explodiu;
    this._vivo = false;

    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  get explodiu()
  { return this._explodiu; }

  //tirar vida personagem quando nao consegue empurrar o pesonagem
  tirarVidaPersNaoConsegueEmpurrar(pers)
  { pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

  //outros getters e setters
  get qtdTiraVidaNaoConsegueEmpurrarPers()
  { return this._qtdTiraVidaNaoConsegueEmpurrarPers; }
  get corImgEspecial()
  { return this._corImgEspecial; }

  //andar
  get infoAndar()
  { return this._infoAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX || tipo == Andar.DIRECAO_INIM_MAIS_PROX)
      throw "Obstaculo nao pode seguir inimigos";
  }
  setTipoAndar(tipo, pers) //soh precisa colocar conjuntoObjetosTela se tipo for SEGUIR_...
  {
    this._seEhImpossivelExcep(tipo);
    this._infoAndar.setTipoAndar(tipo, this._formaGeometrica, pers);
  }
  //pode mudar o qtdAndarXY direto da classe

  inverterQtdAndarX()
  { this._infoAndar.qtdAndarX = -this._infoAndar.qtdAndarX; }
  inverterQtdAndarY()
  { this._infoAndar.qtdAndarY = -this._infoAndar.qtdAndarY; }
  inverterQtdAndarXY()
  {
    this._infoAndar.qtdAndarX = -this._infoAndar.qtdAndarX;
    this._infoAndar.qtdAndarY = -this._infoAndar.qtdAndarY;
  }

  andar(conjuntoObjetosTela, indexContrObst)
  //contrObst eh usado apenas para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  //retorna se continua na lista
  {
    let qtdAndar = this._infoAndar.procAndar(conjuntoObjetosTela.pers, this._formaGeometrica);

    //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
    let hipotenusaPadrao = Operacoes.hipotenusa(qtdAndar.x, qtdAndar.y);
    let info =
    {
      menorHipotenusa: hipotenusaPadrao,
      listaBateu: new ListaDuplamenteLigada(),
      qtdPodeAndarX: qtdAndar.x,
      qtdPodeAndarY: qtdAndar.y,
      qtdAndarXPadrao: qtdAndar.x, //nao muda
      qtdAndarYPadrao: qtdAndar.y //nao muda
    };
    for (let i = 0; i<conjuntoObjetosTela.controladoresObstaculos.length; i++)
      conjuntoObjetosTela.controladoresObstaculos[i].qtdAndarSemColidirOutrosObst(info, this);
    //colidiu = !info.listaBateu.vazia

    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(conjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica,
      qtdAndar.x, qtdAndar.y, false);
    let hipotenusaPers = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    // comparar hipotenusa dos obstaculos com a do personagem
    //opcoes: nao colidiu com ninguem, colidiu com obstaculo antes, colidiu com personagem antes
    if (hipotenusaPers < info.menorHipotenusa) //colidiu com pers
    {
      let xPersAntes = conjuntoObjetosTela.pers.formaGeometrica.x;
      let yPersAntes = conjuntoObjetosTela.pers.formaGeometrica.y;

      let conseguiuAndarTudo = conjuntoObjetosTela.pers.mudarXY(qtdAndar.x - qtdPodeAndar.x, qtdAndar.y - qtdPodeAndar.y, conjuntoObjetosTela);
      if (!conseguiuAndarTudo)
      {
        qtdAndar.x = qtdPodeAndar.x + conjuntoObjetosTela.pers.formaGeometrica.x - xPersAntes;
        qtdAndar.y = qtdPodeAndar.y + conjuntoObjetosTela.pers.formaGeometrica.y - yPersAntes;

        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar(conjuntoObjetosTela.pers);
      }
    }else
    if (info.menorHipotenusa <= hipotenusaPers || info.meonrHipotenusa != hipotenusaPadrao)
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
          info.listaBateu.atual.inverterQtdAndarXY();
        }else
        if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.y + qtdAndar.y, this._formaGeometrica.height,
          info.listaBateu.atual.formaGeometrica.y, info.listaBateu.atual.formaGeometrica.height))
        //se um ficara completamente dentro do outro em Y, muda-se apenas em X
        {
          info.listaBateu.atual.inverterQtdAndarX();
          if (qualInverter == 0 || qualInverter == 2)
            qualInverter++; //1: X
        }else
        if (Interseccao.inteiroDentroDeDirecao(this._formaGeometrica.x + qtdAndar.x, this._formaGeometrica.width,
          info.listaBateu.atual.formaGeometrica.x, info.listaBateu.atual.formaGeometrica.width))
        //se um ficara completamente dentro do outro em X, muda-se apenas em Y
        {
          info.listaBateu.atual.inverterQtdAndarY();
          if (qualInverter < 2) // mesma coisa que: (qualInverter == 0 || qualInverter == 1)
            qualInverter += 2; //2: Y
        }else
        //muda as duas direcoes
        {
          qualInverter = 3;
          info.listaBateu.atual.inverterQtdAndarXY();
        }

      //inverte
      switch (qualInverter)
      {
        case 1:
          this.inverterQtdAndarX();
          break;
        case 2:
          this.inverterQtdAndarY();
          break;
        case 3:
          this.inverterQtdAndarXY();
          break;
      }
    }else //se nao colidiu
    { }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse obstaculo andou, ele sai
    conjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
      ControladorTiros.OBSTACULOS_ANDOU, indexContrObst, true);
    // dentro desse metodo vai tirar da lista os tiros que jah tinham sido mortos por esse obstaculo
    // e colidir com outros tiros (mata o tiro e se eh obstaculo com vida, tira vida dele)

    //colide com tiros dos inimigos e tiros da tela
    for (let i = 0; i<conjuntoObjetosTela.controladoresTirosJogo.length; i++)
      conjuntoObjetosTela.controladoresTirosJogo[i].procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
        ControladorTiros.OBSTACULOS_ANDOU, indexContrObst, false);
    for (let i = 0; i<conjuntoObjetosTela.controladoresInimigos.length; i++)
      conjuntoObjetosTela.controladoresInimigos[i].procObjTelaAndarColidirTirosTodosInim(this, qtdAndar.x, qtdAndar.y,
        ControladorTiros.OBSTACULOS_ANDOU, indexContrObst, false);

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
    if (!this._vivo || this._especial == esp)
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

  //clone
  clone(pers)
  {
    return new Obstaculo(this._formaGeometrica.clone(), {corImgEspecial: this._corImgEspecial, corImgMorto: this._corImgMorto},
      this._infoAndar, pers, this._qtdTiraVidaNaoConsegueEmpurrarPers);
  }

 //outros...
  procColidirTiroCriado(tiro)
  {
    if (Interseccao.interseccao(tiro.formaGeometrica, this._formaGeometrica))
    {
      if (this instanceof ObstaculoComVida)
        tiro.tirarVidaObjCmVida(this);
      return true;
    }
    return false;
  }
}

class ObstaculoComVida extends Obstaculo
{
  //extends Obstaculo pq funcao igual a do obstaculo (mesmo andar()) e nao vai desenhar vida em varios casos

  constructor(formaGeometrica, coresImgsDiferentes, infoAndar, pers, qtdTiraVidaNaoConsegueEmpurrarPers, vida)
  {
    super(formaGeometrica, coresImgsDiferentes, infoAndar, pers, qtdTiraVidaNaoConsegueEmpurrarPers);
    this._vidaMAX = vida;
    this._vida = vida;
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
    return this._vida != 0;
  }

  //clone
  clone(pers)
  {
    return new ObstaculoComVida(this._formaGeometrica.clone(), {corImgEspecial: this._corImgEspecial, corImgMorto: this._corImgMorto},
      this._infoAndar, pers, this._qtdTiraVidaNaoConsegueEmpurrarPers, this._vidaMAX);
  }

  //draw (vai desenhar a vida? se sim, como?)
}


function minDirecao(valorDir1, valorDir2)
{
  if (valorDir1.valor <= valorDir2.valor)
    return valorDir1;
  else
    return valorDir2;
}
