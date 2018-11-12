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
    this._qtdAndarX = infoAndar.qtdAndarX;
    this._qtdAndarY = infoAndar.qtdAndarY;
    if (conjuntoObjetosTela == null) // se eh soh para tiro padrao por exemplo
    {
      this._seEhImpossivelExcep(infoAndar.tipoAndar)
      this._tipoAndar = infoAndar.tipoAndar;
    }
    else
      this.setTipoAndar(infoAndar.tipoAndar, conjuntoObjetosTela.controladoresInimigos, conjuntoObjetosTela.pers); //tem que ser depois

    //mortalidade
    this._mortalidade = mortalidade;

    //morto
    this._vivo = true;
    this._emQuemBateu = {quem: null, index: -1};
  }

  //procedimentos quando criar obstaculo
  procCriou(conjuntoObjetosTela)
  {
    if (this._ehDoPers)
    {
      let quemBateu = null;
      //verificar colisao com obstaculos, inimigos
      for (let i = 0; i<conjuntoObjetosTela.controladoresObstaculos.length; i++)
      {
        let colidiu = conjuntoObjetosTela.controladoresObstaculos[i].procColidirTiroCriadoTodosObst(this);
        if (colidiu && quemBateu == null)
          quemBateu = {quemAndou: Tiro.COLIDIU_COM_OBSTACULO, indexAndou: i};
      }
      for (let i = 0; i<conjuntoObjetosTela.controladoresInimigos.length; i++)
      {
        let colidiu = conjuntoObjetosTela.controladoresInimigos[i].procColidirTiroCriadoTodosInim(this);
        if (colidiu && quemBateu == null)
          quemBateu = {quemAndou: Tiro.COLIDIU_COM_INIMIGO, indexAndou: i};
      }
      if (quemBateu != null)
        this.morreu(quemBateu.quemAndou, quemBateu.indexAndou);
    }else
    // se nao eh do personagem
      if (Interseccao.interseccao(conjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica))
      {
        //colidir
        this.tirarVidaObjCmVida(conjuntoObjetosTela.pers);
        this.morreu(Tiro.COLIDIU_COM_PERSONAGEM);
      }
  }

  //getters e setters
  get tipoAndar()
  { return this._tipoAndar; }
  get inimSeguir()
  { return this._inimSeguir; }
  _seEhImpossivelExcep(tipo)
  {
    //se eh para andar atras do personagem e o tiro eh do proprio personagem, da erro
    if ((this._ehDoPers && (tipo == Andar.SEGUIR_PERS || tipo == Andar.DIRECAO_PERS)) ||
      (!this._ehDoPers && (tipo == Andar.SEGUIR_INIM_MAIS_PROX || tipo == Andar.DIRECAO_INIM_MAIS_PROX)))
        throw "Tipo andar ou ehDoPers nao combinam!";
  }
  setTipoAndar(tipo, controladoresInimigos, pers) //soh precisa colocar controladoresInimigos se tipo for SEGUIR_INIM_MAIS_PROX
  {
    this._seEhImpossivelExcep(tipo);

    this._tipoAndar = tipo;

    //se tipo eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
    {
      // se for pra um tiro seguir um inimigo sempre, seguir um dos mais importantes soh
      let praOndeAndar;
      if (controladoresInimigos.length > 0) // se tem algum controlador
        praOndeAndar = controladoresInimigos[0].qntAndarInimigoMaisProximo(this._formaGeometrica);
      if (praOndeAndar == null || praOndeAndar.inim == null)
        this._tipoAndar = Andar.ANDAR_NORMAL;
        //throw "Nao ha inimigos para seguir!";
      else
      {
        this._inimSeguir = praOndeAndar.inim;
        this._ultimoQtdAndarX = this._qtdAndarX;
        this._ultimoQtdAndarY = this._qtdAndarY;
      }
    }else
    {
      if (this._ultimoQtdAndarX != null || this._ultimoQtdAndarY != null)
      {
        this._ultimoQtdAndarX = null;
        this._ultimoQtdAndarY = null;
      }

      if (tipo == Andar.DIRECAO_PERS)
        this._setarQtdAndarTipoDIRECAO(pers);
      else
      if (tipo == Andar.DIRECAO_INIM_MAIS_PROX)
      {
        //descobrir qual inimigo estah mais perto para seguir
        let praOndeAndar = null;
        let menorHipotenusa = null;
        for (let i=0; i<controladoresInimigos.length; i++)
        {
          let praOndeAndarAtual = controladoresInimigos[i].qntAndarInimigoMaisProximo(this._formaGeometrica);

          if (praOndeAndarAtual.inim != null) //se tem algum inimigo nesse controlador
          {
            let hipotenusaAtual = Operacoes.hipotenusa(praOndeAndarAtual.x, praOndeAndarAtual.y);

            if (menorHipotenusa == null || hipotenusaAtual < menorHipotenusa)
            {
              praOndeAndar = praOndeAndarAtual;
              menorHipotenusa = hipotenusaAtual;
            }
          }
        }

        if (praOndeAndar == null || praOndeAndar.inim == null)
          this._tipoAndar = Andar.ANDAR_NORMAL;
          //throw "Nao ha inimigos para seguir!";
        else
          this._setarQtdAndarTipoDIRECAO(praOndeAndar.inim);
      }
    }

    if (tipo == Andar.SEGUIR_PERS || tipo == Andar.SEGUIR_INIM_MAIS_PROX)
      this._hipotenusaAndarPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY);
    else if (this._hipotenusaAndarPadrao != null) this._hipotenusaAndarPadrao = null;
  }
  _setarQtdAndarTipoDIRECAO(objSeguir)
  {
    let qtdAndar = Andar.qtdAndarFromTipo({qtdAndarXPadrao: this._qtdAndarX, qtdAndarYPadrao: this._qtdAndarY,
      tipoAndar: (objSeguir instanceof Inimigo)?Andar.SEGUIR_INIM_MAIS_PROX:Andar.SEGUIR_PERS,
      hipotenusaPadrao: Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY)}, this._formaGeometrica, objSeguir);
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;
  }
  get mortalidade()
  { return this._mortalidade; }
  set mortalidade(qtd)
  { this._mortalidade = qtd; }
  mudarMortalidade(qtdMudar)
  { this._mortalidade += qtdMudar; }

  get ehDoPers()
  { return this._ehDoPers; }
  get qtdAndarX()
  { return this._qtdAndarX; }
  get qtdAndarY()
  { return this._qtdAndarY; }
  //se for adicionar set qtdAndar, mudar this._hipotenusaAndarPadrao de acordo com o tipoAndar

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
        (!this.ehDoPers && quem != Tiro.COLIDIU_COM_PERSONAGEM))
        throw "ehDoPers e com quem colidiu nao coincidem!";

    if (index != null)
      this._emQuemBateu.index = index;
    this._emQuemBateu.quem = quem;
    this._vivo = false;

    //muda a imagem ou cor para a de morto
    this._mudarCorImgMorto();
  }
  ehQuemBateu(quemAndou, indexAndou)
  {
    if (this._emQuemBateu.quem == Tiro.COLIDIU_COM_PERSONAGEM)
      return this._emQuemBateu.quem == quemAndou;
    return this._emQuemBateu.quem == quemAndou && this._emQuemBateu.index == indexAndou;
  }

  //andar
  andar(conjuntoObjetosTela)
  //retorna se continua na lista ou nao
  {
    //se tiro estah seguindo um inimigo que jah morreu, continuar andando normal
    if (this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX && !this._inimSeguir.vivo)
    {
      this._qtdAndarX = this._ultimoQtdAndarX;
      this._qtdAndarY = this._ultimoQtdAndarY;
      this.setTipoAndar(Andar.ANDAR_NORMAL);
    }

    //objSeguir para Andar.qtdAndarFromTipo(...)
    let objSeguir;
    if (this._tipoAndar == Andar.SEGUIR_PERS)
      objSeguir = conjuntoObjetosTela.pers;
    else
    if (this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX)
      objSeguir = this._inimSeguir;

    let qtdAndar = Andar.qtdAndarFromTipo({qtdAndarXPadrao: this._qtdAndarX, qtdAndarYPadrao: this._qtdAndarY,
      tipoAndar: this._tipoAndar, hipotenusaPadrao: this._hipotenusaAndarPadrao},
      this._formaGeometrica, objSeguir);
    if (this._tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX)
    {
      this._ultimoQtdAndarX = qtdAndar.x;
      this._ultimoQtdAndarY = qtdAndar.y;
    }else
    if (qtdAndar.inverterDirQtdAndar)
    {
      //inverte a direcao do obstaculo
      this._qtdAndarX = -this._qtdAndarX;
      this._qtdAndarY = -this._qtdAndarY;
    }

    if (this._ehDoPers)
    //ver se colidiu com obstaculos e inimigos
      return this._estadoTiroPosAndarEhPers(qtdAndar.x, qtdAndar.y, conjuntoObjetosTela.controladoresObstaculos,
        conjuntoObjetosTela.controladoresInimigos, conjuntoObjetosTela.controladoresTirosJogo);
    else
    //ver se colidiu com personagem
      return this._estadoTiroPosAndarNaoEhPers(qtdAndar.x, qtdAndar.y, conjuntoObjetosTela.pers);
  }
  _estadoTiroPosAndarEhPers(qtdAndarX, qtdAndarY, controladoresObstaculos, controladoresInimigos, controladoresTirosJogo)
  {
    //ret: menorHipotenusa, listaBateu, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, colidiu
    let info = {
      colidiu: false,
      listaBateu: new ListaDuplamenteLigada(),
      menorWidth: width,
      menorHeight: height,
      qtdPodeAndarX: qtdAndarX,
      qtdPodeAndarY: qtdAndarY,
      menorHipotenusa: Operacoes.hipotenusa(qtdAndarX, qtdAndarY)
    };

    let emQuemBateu = {quem: null, index: -1};
    //passa por todos inimigos e obstaculos
    for(let i = 0; i < controladoresObstaculos.length + controladoresInimigos.length; i++)
    {
      let inseriu;
      if (i < controladoresObstaculos.length)
      //primeiro controlador de obstaculos
        inseriu = controladoresObstaculos[i].verificarColidirComTiro(info, this, true);
      else
      //depois de inimigos
        inseriu = controladoresInimigos[i-controladoresObstaculos.length].verificarColidirComTiro(info, this, controladoresTirosJogo, true);
      //ateh aqui ele vai passar por todos os controladores

      if (inseriu)
      {
        if (i < controladoresObstaculos.length)
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_OBSTACULO;
          emQuemBateu.index = i;
        }
        else
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_INIMIGO;
          emQuemBateu.index = i - controladoresObstaculos.length;
        }
      }
    }

    let qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, info.menorWidth, info.menorHeight);
    this._formaGeometrica.x += info.qtdPodeAndarX + qntEntra.x;
    this._formaGeometrica.y += info.qtdPodeAndarY + qntEntra.y;

    //tirar vida de todos os inimigos que bateu (soh ha mais de um objeto se eles estao no mesmo Y)
    info.listaBateu.colocarAtualComeco();
    while (!info.listaBateu.atualEhNulo)
    {
      if (info.listaBateu.atual instanceof Inimigo || info.listaBateu.atual instanceof ObstaculoComVida)
      //se tem vida, tira
        this.tirarVidaObjCmVida(info.listaBateu.atual);
      info.listaBateu.andarAtual();
    }

    //soh verifica se tiro saiu agora pois o tiro pode acertar o inimigo fora da tela
    if (Tela.objSaiuTotalmente(this._formaGeometrica))
      return false;

    if (info.colidiu)
      this.morreu(emQuemBateu.quem, emQuemBateu.index);

    return true;
  }
  _estadoTiroPosAndarNaoEhPers(qtdAndarX, qtdAndarY, pers)
  {
    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(pers.formaGeometrica, this._formaGeometrica, qtdAndarX, qtdAndarY);
    if (qtdPodeAndar.x < qtdAndarX || qtdPodeAndar.y < qtdAndarY)
    {
      let qntEntra = this._qntEntra(qtdAndarX, qtdAndarY, pers.formaGeometrica.width, pers.formaGeometrica.height);
      this._formaGeometrica.x += qtdPodeAndar.x;
      this._formaGeometrica.y += qtdPodeAndar.y;

      //colidir
      this.tirarVidaObjCmVida(pers);
      this.morreu(Tiro.COLIDIU_COM_PERSONAGEM);
      return true;
    }else
    {
      this._formaGeometrica.x += qtdAndarX;
      this._formaGeometrica.y += qtdAndarY;

      return !Tela.objSaiuTotalmente(this._formaGeometrica);
    }
  }
  _qntEntra(qtdAndarX, qtdAndarY, menorWidth, menorHeight)
  {
    //ver quanto o tiro deve entrar no obstaculo ou inimigo
    let mult = 0.2; //multiplicador do this._qtdAndarX e this._qtdAndarY
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
          //regra de tres: this._qtdAndarX/this._qtdAndarY = qntEntraX/(menorHeight/2)
          qntEntraY = menorHeight/2 * (qtdAndarY>0?1:-1);
          qntEntraX = (qntEntraY*qtdAndarX)/qtdAndarY;
          break;
        case 3:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = (menorWidth/2)/qntEntraY
          let qntEntraX1 = menorWidth/2 * (qtdAndarX>0?1:-1);
          let qntEntraY1 = (qntEntraX1*qtdAndarY)/qtdAndarX;

          let qntEntraY2 = menorHeight/2 * (qtdAndarY>0?1:-1);

          if (Math.abs(qntEntraY1) <= Math.abs(qntEntraY2))
          {
            qntEntraX = qntEntraX1;
            qntEntraY = qntEntraY1;
          }else
          {
            //regra de tres: this._qtdAndarX/this._qtdAndarY = qntEntraX/(menorHeight/2)
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

  //desenho
  draw()
  {
    //se estah morto, jah estah com a cor ou imagem de morto
    super.draw();
  }

  //clone
  clone(conjuntoObjetosTela)
  {
    return new Tiro(this._formaGeometrica.clone(), this._corImgMorto,
      {qtdAndarX: this._qtdAndarX, qtdAndarY: this._qtdAndarY, tipoAndar: this._tipoAndar},
      conjuntoObjetosTela, this._ehDoPers, this._mortalidade);
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
    this._qtdAndarX = infoAndar.qtdAndarX;
    this._qtdAndarY = infoAndar.qtdAndarY;
    if (pers == null) // se eh soh para obstaculo padrao por exemplo
    {
      this._seEhImpossivelExcep(infoAndar.tipoAndar)
      this._tipoAndar = infoAndar.tipoAndar;
    }
    else
      this.setTipoAndar(infoAndar.tipoAndar, pers); //tem que ser depois

    this._vivo = true;
  }

  //procedimentos quando criar obstaculo
  procCriou(conjuntoObjetosTela, indexContrObst)
  {
    //colisao com personagem
    if (Interseccao.interseccao(this._formaGeometrica, conjuntoObjetosTela.pers.formaGeometrica))
    {
      //verifica qual direcao eh mais facil para o personagem sair de cima do obstaculo
      let qtdAndar = this._qtdPersAndarCriou(conjuntoObjetosTela.pers);
      conseguiuAndarTudo = conjuntoObjetosTela.pers.mudarXY(qtdAndar.x, qtdAndar.y, conjuntoObjetosTela);
      if (!conseguiuAndarTudo)
      {
        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar(conjuntoObjetosTela.pers);
      }
    }
    //colisao com tiros
    conjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideCriar(this, ControladorTiros.OBSTACULOS_CRIADO, indexContrObst);
  }
  _qtdPersAndarCriou(pers)
  {
    //ver "Explicacao procCriou(...) obstaculo em relacao a colisao com pers.png"
    let xDireita = {
      valor: this._formaGeometrica.x + this._formaGeometrica.width - pers.formaGeometrica.x,
      dir: Direcao.Direita
    };
    let xEsquerda = {
      valor: pers.formaGeometrica.x + pers.formaGeometrica.width - this._formaGeometrica.x,
      dir: Direcao.Esquerda
    };
    let yBaixo = {
      valor: this._formaGeometrica.y + this._formaGeometrica.height - pers.formaGeometrica.y,
      dir: Direcao.Baixo
    };
    let yCima = {
      valor: pers.formaGeometrica.y + pers.formaGeometrica.height - this._formaGeometrica.y,
      dir: Direcao.Cima
    };

    let menorValorDir = minDirecao(minDirecao(yBaixo, yCima), minDirecao(xDireita, xEsquerda));
    let qtdAndar;
    switch (menorValorDir.dir)
    {
      case Direcao.Direita:
        qtdAndar.x = menorValorDir.valor;
        qtdAndar.y = 0;
        break;
      case Direcao.Esquerda:
        qtdAndar.x = -menorValorDir.valor;
        qtdAndar.y = 0;
        break;
      case Direcao.Baixo:
        qtdAndar.x = 0;
        qtdAndar.y = menorValorDir.valor;
        break;
      case Direcao.Cima:
        qtdAndar.x = 0;
        qtdAndar.y = -menorValorDir.valor;
        break;
    }
    return qtdAndar;
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
  get tipoAndar()
  { this._tipoAndar; }
  _seEhImpossivelExcep(tipo)
  {
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX || tipo == Andar.DIRECAO_INIM_MAIS_PROX)
      throw "Obstaculo nao pode seguir inimigos";
  }
  setTipoAndar(tipo, pers)
  {
    this._seEhImpossivelExcep(tipo);

    if (tipo == Andar.DIRECAO_PERS)
    {
      let qtdAndar = Andar.qtdAndarFromTipo({qtdAndarXPadrao: this._qtdAndarX, qtdAndarYPadrao: this._qtdAndarY,
        tipoAndar: Andar.SEGUIR_PERS, hipotenusaPadrao: Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY)},
        this._formaGeometrica, pers);
      this._qtdAndarX = qtdAndar.x;
      this._qtdAndarY = qtdAndar.y;
    }else
    if (tipo == Andar.SEGUIR_PERS)
      this._hipotenusaAndarPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY);
    else if (this._hipotenusaAndarPadrao != null) this._hipotenusaAndarPadrao = null;

    this._tipoAndar = tipo;
  }
  get qtdAndarX()
  { return this._qtdAndarX; }
  get qtdAndarY()
  { return this._qtdAndarY; }
  /*
  //se for adicionar set qtdAndar, mudar this._hipotenusaAndarPadrao de acordo com o tipoAndar
  set qtdAndarX(qtd)
  { this._qtdAndarX = qtd; }
  set qtdAndarY(qtd)
  { this._qtdAndarY = qtd; } */

  andar(conjuntoObjetosTela, indexContrObst)
  //contrObst, contrInim e contrTiros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  //retorna se continua na lista
  {
    let qtdAndar = Andar.qtdAndarFromTipo({qtdAndarXPadrao: this._qtdAndarX, qtdAndarYPadrao: this._qtdAndarY,
      tipoAndar: this._tipoAndar, hipotenusaPadrao: this._hipotenusaAndarPadrao},
      this._formaGeometrica, conjuntoObjetosTela.pers);
    if (qtdAndar.inverterDirQtdAndar)
    {
      //inverte a direcao do obstaculo
      this._qtdAndarX = -this._qtdAndarX;
      this._qtdAndarY = -this._qtdAndarY;
    }

    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(conjuntoObjetosTela.pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y);
    let conseguiuAndarTudo = true;
    //se vai intersectar antes de andar tudo
    if (qtdPodeAndar.x < qtdAndar.x || qtdPodeAndar.y < qtdAndar.y)
    {
      let xPersAntes = conjuntoObjetosTela.pers.formaGeometrica.x;
      let yPersAntes = conjuntoObjetosTela.pers.formaGeometrica.y;
      conseguiuAndarTudo = conjuntoObjetosTela.pers.mudarXY(qtdAndar.x - qtdPodeAndar.x, qtdAndar.y - qtdPodeAndar.y, conjuntoObjetosTela);
      if (!conseguiuAndarTudo)
      {
        qtdAndar.x = qtdPodeAndar.x + conjuntoObjetosTela.pers.formaGeometrica.x - xPersAntes;
        qtdAndar.y = qtdPodeAndar.y + conjuntoObjetosTela.pers.formaGeometrica.y - yPersAntes;

        //obstaculo explode
        this.morreu(true);
        this.tirarVidaPersNaoConsegueEmpurrar(conjuntoObjetosTela.pers);
      }
    }

    //verificar se vai bater em tiros do personagem e se tiro tem que sair da lista porque esse obstaculo andou, ele sai
    conjuntoObjetosTela.pers.controladorTiros.procedimentoObjTelaColideAndar(this, qtdAndar.x, qtdAndar.y,
      ControladorTiros.OBSTACULOS_ANDOU, indexContrObst);
    // dentro desse metodo vai tirar da lista os tiros que jah tinham sido mortos por esse obstaculo
    // e colidir com outros tiros (mata o tiro e se eh obstaculo com vida, tira vida dele)

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
      {qtdAndarX: this._qtdAndarX, qtdAndarY: this._qtdAndarY, tipoAndar: this._tipoAndar},
      pers, this._qtdTiraVidaNaoConsegueEmpurrarPers);
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
      {qtdAndarX: this._qtdAndarX, qtdAndarY: this._qtdAndarY, tipoAndar: this._tipoAndar},
      pers, this._qtdTiraVidaNaoConsegueEmpurrarPers, this._vidaMAX);
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
