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

//TIRO
class Tiro extends ObjetoTela
{
  constructor(formaGeometrica, corMorto, qtdAndarX, qtdAndarY, tipoAndar, ehDoPers, mortalidade, controladoresInimigos)
  //soh precisa colocar controladoresInimigos se tipoAndar for SEGUIR_INIM_MAIS_PROX
  {
    super(formaGeometrica);

    //cor
    this._corMorto = corMorto;

    //eh do pers
    this._ehDoPers = ehDoPers;

    //andar
    this.setTipoAndar(tipoAndar, controladoresInimigos);
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    //mortalidade
    this._mortalidade = mortalidade;

    //morto
    this._vivo = true;
    this._emQuemBateu = {quem: null, index: -1};
  }

  //getters e setters
  get tipoAndar()
  { this._tipoAndar; }
  get inimSeguir()
  { return this._inimSeguir; }
  setTipoAndar(tipo, controladoresInimigos) //soh precisa colocar controladoresInimigos se tipo for SEGUIR_INIM_MAIS_PROX
  {
    //se eh para andar atras do personagem e o tiro eh do proprio personagem, da erro
    if ((tipo == Andar.SEGUIR_PERS && this._ehDoPers) || (tipo == Andar.SEGUIR_INIM_MAIS_PROX && !this._ehDoPers))
      throw "Tipo andar ou ehDoPers nao combinam! em new Tiro";

    //se tipo eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
    {
      let qntQrAndar = null;
      let menorHipotenusa = null;
      for (let i=0; i<controladoresInimigos.length; i++)
      {
        let qntQrAndarAtual = controladoresInimigos[i].qntAndarInimigoMaisProximo(formaGeometrica);
        let hipotenusaAtual = Operacoes.hipotenusa(qntQrAndarAtual.x, qntQrAndarAtual.y);
        if (qntQrAndarAtual.inim != null && //se tem algum inimigo nesse controlador
          (menorHipotenusa == null || hipotenusaAtual < menorHipotenusa))
        {
          qntQrAndar = qntQrAndarAtual;
          menorHipotenusa = hipotenusaAtual;
        }
      }

      if (qntQrAndar == null || qntQrAndar.inim == null)
        throw "Nao ha inimigos para seguir!";

      this._inimSeguir = qntQrAndar.inim;

      this._ultimoQtdAndarX = this._qtdAndarX;
      this._ultimoQtdAndarY = this._qtdAndarY;
    }else
    if (this._ultimoQtdAndarX != null || this._ultimoQtdAndarY != null)
    {
      this._ultimoQtdAndarX = null;
      this._ultimoQtdAndarY = null;
    }

    this._tipoAndar = tipo;
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
  }
  ehQuemBateu(quemAndou, indexAndou)
  {
    if (this._emQuemBateu.quem == Tiro.COLIDIU_COM_PERSONAGEM)
      return this._emQuemBateu.quem == quemAndou;
    return this._emQuemBateu.quem == quemAndou && this._emQuemBateu.index == indexAndou;
  }

  //andar
  andar(pers, controladoresObstaculos, controladoresInimigos)
  //retorna se continua na lista ou nao
  {
    //se tiro estah seguindo um inimigo que jah morreu, continuar andando normal
    if (this.tipoAndar == Andar.SEGUIR_INIM_MAIS_PROX && !this._inimSeguir.vivo)
    {
      this._qtdAndarX = this._ultimoQtdAndarX;
      this._qtdAndarY = this._ultimoQtdAndarY;
      this.setTipoAndar(Andar.ANDAR_NORMAL);
    }

    let qtdAndar = Andar.qtdAndarFromTipo(this._qtdAndarX, this._qtdAndarY, this._formaGeometrica, this._tipoAndar, pers, this._inimSeguir);
    if (qtdAndar.inverterDirQtdAndar)
    {
      //inverte a direcao do obstaculo
      this._qtdAndarX = -this._qtdAndarX;
      this._qtdAndarY = -this._qtdAndarY;
    }

    if (this._ehDoPers)
    //ver se colidiu com obstaculos e inimigos
      return this._estadoTiroPosAndarEhPers(qtdAndar.x, qtdAndar.y, controladoresObstaculos, controladoresInimigos);
    else
    //ver se colidiu com personagem
      return this._estadoTiroPosAndarNaoEhPers(qtdAndar.x, qtdAndar.y, pers);
  }

  _estadoTiroPosAndarEhPers(qtdAndarX, qtdAndarY, controladoresObstaculos, controladoresInimigos)
  {
    //ret: menorHipotenusa, listaBateu, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, colidiu
    let info = {
      colidiu: false,
      listaBateu: new ListaDuplamenteLigada(),
      menorWidth: width,
      menorHeight: height,
      qtdPodeAndarX: qtdAndarX,
      qtdPodeAndarY: qtdAndarY,
      menorHipotenusa: menorHipotenusa = Operacoes.hipotenusa(qtdAndarX, qtdAndarY)};

    let qtdContrObstaculos = (controladoresObstaculos==null ? 0 : controladoresObstaculos.length);
    let qtdContrInimigos = (controladoresInimigos==null ? 0 : controladoresInimigos.length);

    let emQuemBateu = {quem: null, index: -1};
    //passa por todos inimigos e obstaculos
    for(let i = 0; i<qtdContrObstaculos+qtdContrInimigos; i++)
    {
      let controlador; //controlador de inimigos ou de obstaculos
      if (i < qtdContrObstaculos)
      //primeiro controlador de obstaculos
        controlador = controladoresObstaculos[i];
      else
      //depois de inimigos
        controlador = controladoresInimigos[i-qtdContrObstaculos];
      //ateh aqui ele vai passar por todos os controladores

      let inseriu = controlador.verificarColidirComTiro(info, this._ehDoPers);
      if (inseriu)
      {
        if (i < qtdContrObstaculos)
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_OBSTACULO;
          emQuemBateu.index = i;
        }
        else
        {
          emQuemBateu.quem = Tiro.COLIDIU_COM_INIMIGO;
          emQuemBateu.index = i-qtdContrObstaculos;
        }
      }
    }

    let qntEntra = this._qntEntra(info.menorWidth, info.menorHeight);
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

      if (Tela.objSaiuTotalmente(this._formaGeometrica))
        return false;
      return true;
    }
  }

  _qntEntra(qtdAndarX, qtdAndarY, menorWidth, menorHeight)
  {
    //ver quanto o tiro deve entrar no obstaculo ou inimigo
    let mult = 0.2; //multiplicador do this._qtdAndarX e this._qtdAndarY
    let mudarQntEntra = 0;
    if (mult*qtdAndarX > menorWidth/2)
      mudarQntEntra++;
    if (mult*qtdAndarY > menorHeight/2)
      mudarQntEntra += 2;

    let qntEntraX;
    let qntEntraY;
    if (mudarQntEntra)
    {
      switch (mudarQntEntra)
      {
        case 1:
          //regra de tres: qtdAndarX/qtdAndarY = (menorWidth/2)/qntEntraY
          qntEntraX = menorWidth/2;
          qntEntraY = (qntEntraX*qtdAndarY)/qtdAndarX;
          break;
        case 2:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = qntEntraX/(menorHeight/2)
          qntEntraY = menorHeight/2;
          qntEntraX = (qntEntraY*qtdAndarX)/qtdAndarY;
          break;
        case 3:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = (menorWidth/2)/qntEntraY
          let qntEntraX1 = menorWidth/2;
          let qntEntraY1 = (qntEntraX*qtdAndarY)/qtdAndarX;

          let qntEntraY2 = menorHeight/2;

          if (qntEntraY1 <= qntEntraY2)
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
  get corMorto()
  { return this._corMorto; }
  set fillMorto(fill)
  { this._corMorto.fill = fill; }
  set strokeMorto(stroke)
  { this._corMorto.stroke = stroke; }
  draw()
  {
    if (!this._vivo)
    {
      this._formaGeometrica.fillColor = this._corMorto.fill;
      this._formaGeometrica.strokeColor = this._corMorto.stroke;
    }
    super.draw();
  }

  clone()
  {
    return new Tiro(this._formaGeometrica, this._corMorto, this._qtdAndarX, this._qtdAndarY, this._ehDoPers, this._mortalidade);
  }
}

//OBSTACULO
class Obstaculo extends ObjetoTela
{
  constructor(formaGeometrica, corEspecial, qtdAndarX, qtdAndarY, tipoAndar, qtdTiraVidaNaoConsegueEmpurrarPers)
  {
    super(formaGeometrica);

    //cor
    this._corEspecial = corEspecial;
    this._especial = false;

    //tirar vida
    this._qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;

    //andar
    this._tipoAndar = null;
    this.tipoAndar = tipoAndar;
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    this._vivo = true;
  }

  get vivo()
  { return this._vivo; }
  morreu(explodiu)
  {
    if (explodiu == null)
      explodiu = true;
    this._explodiu = explodiu;
    this._vivo = false;
  }
  get explodiu()
  { return this._expodiu; }

  //getters e setters
  get tipoAndar()
  { this._tipoAndar; }
  set tipoAndar(tipo)
  {
    if (tipo == Andar.SEGUIR_INIM_MAIS_PROX)
      throw "Obstaculo nao pode seguir inimigos";
    this._tipoAndar = tipo;
  }
  get qtdAndarX()
  { return this._qtdAndarX; }
  get qtdAndarY()
  { return this._qtdAndarX; }
  set qtdAndarX(qtd)
  { this._qtdAndarX = qtd; }
  set qtdAndarY(qtd)
  { this._qtdAndarY = qtd; }
  get corEspecial()
  { return this._corEspecial; }

  //tirar vida personagem quando nao consegue empurrar o pesonagem
  tirarVidaPersNaoConsegueEmpurrar(pers)
  { pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers); }

  //andar
  andar(pers, contrObst, contrInim, contrTiros)
  //contrObst, contrInim e contrTiros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  //retorna se consegue andar tudo
  {
    let qtdAndar = Andar.qtdAndarFromTipo(this._qtdAndarX, this._qtdAndarY, this._formaGeometrica, this._tipoAndar, pers);
    if (qtdAndar.inverterDirQtdAndar)
    {
      //inverte a direcao do obstaculo
      this._qtdAndarX = -this._qtdAndarX;
      this._qtdAndarY = -this._qtdAndarY;
    }

    let qntPodeAndar = Interseccao.qntPodeAndarAntesIntersec(pers.formaGeometrica, this._formaGeometrica, qtdAndar.x, qtdAndar.y);
    let conseguiuAndarTudo = true;
    //se vai intersectar antes de andar tudo
    if (qtdPodeAndar.x < qtdAndar.x || qtdPodeAndar.y < qtdAndar.y)
    {
      let xPersAntes = pers.formaGeometrica.x;
      let yPersAntes = pers.formaGeometrica.y;
      conseguiuAndarTudo = pers.mudarXY(qtdAndar.x - qtdPodeAndar.x, qtdAndar.y - qtdPodeAndar.y, this, contrInim, contrTiros);
      if (!conseguiuAndarTudo)
      {
        qtdAndar.x = qtdPodeAndar.x + pers.formaGeometrica.x - xPersAntes;
        qtdAndar.y = qtdPodeAndar.y + pers.formaGeometrica.y - yPersAntes;
      }
    }

    this._formaGeometrica.x += qtdAndar.x;
    this._formaGeometrica.y += qtdAndar.y;

    return conseguiuAndarTudo;
  }

  //desenhar
  get especial()
  { return this._especial; }
  set especial(esp)
  { this._especial = esp; }
  draw()
  {
    if (this._especial)
    {
      this._formaGeometrica.fillColor = this._corEspecial.fill;
      this._formaGeometrica.strokeColor = this._corEspecial.stroke;
    }
    super.draw();
  }
}

class ObstaculoComVida extends Obstaculo
{
  //extends Obstaculo pq funcao igual a do obstaculo (mesmo andar()) e nao vai desenhar vida e varios casos

  constructor(formaGeometrica, corEspecial, qtdAndarXPadrao, qtdAndarYPadrao, tipoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, vida)
  {
    super(formaGeometrica, corEspecial, qtdAndarXPadrao, qtdAndarYPadrao, tipoAndar, qtdTiraVidaNaoConsegueEmpurrarPers);
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
      this.morreu(false);
      this._vida = 0;
    }
    return this._vida != 0;
  }

  //draw (como vai desenhar a vida, vai desenhar a vida?)
}
