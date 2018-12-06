//import "FormasGeometricas.js";
//import "ListaDuplamenteLigada.js";

//Explicacao:
  //class Info: tem atributos publicos (pois em todos podem fazer get e set)
  //class ObjetoTela: recebe apenas uma classe Info por parametro e adiciona em seus proprios atributos

class InfoObjetoTela
{
  constructor(formaGeometrica, corImgMorto)
  {
    this.formaGeometrica = formaGeometrica;
    this.corImgMorto = corImgMorto;
  }
}
class ObjetoTela //recebe apenas uma classe informacao como parametro
{
  constructor(pontoInicial, infoObjetoTela)
  {
    this._formaGeometrica = infoObjetoTela.formaGeometrica.clone(pontoInicial.x, pontoInicial.y);

    //posicaoX: Meio, ParedeEsquerda, ParedeDireita
    switch (pontoInicial.posicaoX)
    {
      case PosicaoX.Meio: this._formaGeometrica.colocarNoMeioX(); break;
      case PosicaoX.ParedeEsquerda: this._formaGeometrica.colocarParedeEsquerda(); break;
      case PosicaoX.ParedeDireita: this._formaGeometrica.colocarParedeDireita(); break;
    }
    //posicaoY: Meio, ParedeCima, ParedeBaixo
    switch (pontoInicial.posicaoY)
    {
      case PosicaoY.Meio: this._formaGeometrica.colocarNoMeioY(); break;
      case PosicaoY.ParedeCima: this._formaGeometrica.colocarParedeCima(); break;
      case PosicaoY.ParedeBaixo: this._formaGeometrica.colocarParedeBaixo(); break;
    }

    this._corImgMorto = infoObjetoTela.corImgMorto;
    this._vivo = true;
  }

  get formaGeometrica()
  { return this._formaGeometrica; }
  colocarNoMeioX()
  { this._formaGeometrica.colocarNoMeioX(); }

  //getters e setters
  get corImgMorto()
  { return this._corImgMorto; }
  set corImgMorto(corImgMorto)
  { this._corImgMorto = corImgMorto; }

  //outros metodos
  _mudarCorImgMorto()
  { this._formaGeometrica.corImg = this._corImgMorto; }

  draw()
  { this._formaGeometrica.draw(); }
}

// IMPORTANTE: nao fazer clone de NADA (nem para new Info, nem para new Objeto)
//Infos de Objetos tem InfoAndar e Objetos em si tem ClasseAndar

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

  procColidiuTiro(tiro)
  {
    //se tiro nao for do personagem (for do inimigo ou da tela, nao tira vida)
    if (!tiro.ehDoPers) return;

    if (ConjuntoObjetosTela.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.MatarObjetos1Tiro)
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

  // TODO: draw (vai desenhar a vida? se sim, como?)
}


function minDirecao(valorDir1, valorDir2)
{
  if (valorDir1.valor <= valorDir2.valor)
    return valorDir1;
  else
    return valorDir2;
}

class AuxInfo
{
  static cloneImgCor(imgCor)
  {
    if (imgCor.stroke === undefined)
      return imgCor; //nao precisa de clone
    else
      return {stroke: imgCor.stroke, fill: imgCor.fill}; //clone
  }
}
