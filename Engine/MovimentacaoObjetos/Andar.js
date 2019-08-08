const TipoAndar = {
    "Normal":1,

    //sair tela
    "PermanecerEmRetangulo": 2,
    //tem opcao para inverter o qtdAndar das duas direcoes ou soh de uma
    //o retangulo pode ser o ceu inteiro ou nao

    //seguir
    "SeguirPers": 3,
    "SeguirInimMaisProx": 4,
    "SeguirPonto": 5,

    //direcao
    "DirecaoPers": 6,
    "DirecaoInimMaisProx": 7
  };

class InfoAndar
{
  constructor(qtdAndarX, qtdAndarY, tipoAndar, outrasInformacoes={}, aceleracao, guardarAnguloQtdAndar=false)
  //eh public mesmo porque tem get e set em todos sem verificacao
  //aceleracao: valor, ehPorcentagem, qntsVezes
  //outrasInformacoes:
    //para TipoAndar.Seguir... e TipoAndar.Direcao...:
      //outrasInformacoes.limitarCurva: {maiorAnguloMudanca, porcVelCurva, [primMaiorAngMud]}
        //- maiorAnguloMudanca: maior angulo que pode mudar a rota (para limitar a curva quando for TipoAndar.Seguir...)
        //- porcVelCurva: para ir mais devagar quando for limitado pela curva
        //- primMaiorAngMud: o maior angulo na primeira execucao do andar
    //para TipoAndar.SeguirPonto: outrasInformacoes.pontoSeguir
    //para TipoAndar.PermanecerEmRetangulo:
      //outrasInformacoes.retangulo: se for undefined, o retangulo serah o ceu inteiro; caso nao seja ({x,y,width,height}), o retangulo deve ser relativo ao centroMassa(como de retangulo) da formaGeometrica e todos os dados devem ser porcentagens de width e height
        //ps: Nesse ultimo caso, se width ou height forem undefined ou NaN nao serah verificado se estah dentro do retangulo nessa direcao
        //ps2: toma-se como pressuposto de que a formaGeometrica estah dentro do retangulo no inicio da execucao
      //outrasInformacoes.inverterAmbasDirecoes: se for true, sempre que bater em qualquer uma das paredes do retangulo inverte o qtdAndar em todas as direcoes; se for false, inverte soh a direcao que bateu (padrao eh InverterAmbas)
  {
    //informacoes basicas
    this.qtdAndarX = qtdAndarX;
    this.qtdAndarY = qtdAndarY;
    this.tipoAndar = tipoAndar;

    //outras informacoes do tipoAndar
    this.outrasInformacoes = outrasInformacoes;

    //mais informacoes
    this.aceleracao = aceleracao;
    this.guardarAnguloQtdAndar = guardarAnguloQtdAndar;
  }

  clone()
  {
    let cloneOutrasInfo = Clone.cloneDicionario(this.outrasInformacoes);
    if (cloneOutrasInfo !== undefined)
      cloneOutrasInfo.limitarCurva = Clone.cloneDicionario(cloneOutrasInfo.limitarCurva);

    return new InfoAndar(this.qtdAndarX, this.qtdAndarY, this.tipoAndar, cloneOutrasInfo,
      Clone.cloneDicionario(this.aceleracao), this.guardarAnguloQtdAndar);
  }

  // metodos diferentes de soh armazenar informacoes
  mudarAnguloQtdAndar(angulo)
  // angulo em radianos segundo o Ciclo Trigonometrico
  //obs: angulo nao precisa ser entre PI e -PI...
  {
    const qtdAndarEmAngulo = ClasseAndar.qtdAndarEmAngulo(this.qtdAndarX, this.qtdAndarY, angulo);
    this.qtdAndarX = qtdAndarEmAngulo.x;
    this.qtdAndarY = qtdAndarEmAngulo.y;
  }
}
const porcentQrEntrar = 0.05; //quanto maior esse numero, mais efetivo
class ClasseAndar
{
  constructor(infoAndar, formaGeom)
  //infoAndar nao precisa estar clonado (ele mesmo "clona")
  //formaGeom eh de quem vai andar
  {
    this._qtdAndarX = infoAndar.qtdAndarX;
    this._qtdAndarY = infoAndar.qtdAndarY;

    if (infoAndar.aceleracao !== undefined && infoAndar.aceleracao.qntsVezes !== 0)
    {
      this._aceleracao = {valor: infoAndar.aceleracao.valor, ehPorcentagem: infoAndar.aceleracao.ehPorcentagem};
      if (infoAndar.aceleracao.qntsVezes !== undefined)
      {
        this._aceleracao.qntsVezes = infoAndar.aceleracao.qntsVezes;
        this._aceleracao.qtdSomarCadaVez = 1; //para funcionar certo quando mudarTempo
        this._aceleracao.qntsVezesCompletas = 0;
      }
    }

    if (infoAndar.guardarAnguloQtdAndar || infoAndar.outrasInformacoes.limitarCurva!==undefined/*se for limitar a curva tambem precisa guardar esse angulo*/)
      this._setAnguloQtdAndar(); // o anguloQtdAndar dos objetos comeca com o angulo de rotacao que sua formaGeometrica estah

    //TipoAndar e outrasInformacoes
    this.setTipoAndar(infoAndar.tipoAndar, formaGeom, infoAndar.outrasInformacoes);
  }

  //getters basicos
  get qtdAndarX() { return this._qtdAndarX; }
  get qtdAndarY() { return this._qtdAndarY; }
  get tipoAndar() { return this._tipoAndar; }

  get ehParado()
  { return this._qtdAndarX===0 && this._qtdAndarY===0; }

  //setters basicos
  set qtdAndarX(qtdAndarX)
  {
    this._qtdAndarX = qtdAndarX;
    this._mudarHipotenusaSePrecisa();
  }
  set qtdAndarY(qtdAndarY)
  {
    this._qtdAndarY = qtdAndarY;
    this._mudarHipotenusaSePrecisa();
  }
  mudarQtdAndar(qtdAndar)
  {
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;
    this._mudarHipotenusaSePrecisa();
  }
  inverterDirecoesQtdAndar(horizontal, vertical)
  {
    if (horizontal || vertical)
    {
      if (horizontal)
        this._qtdAndarX *= -1;
      if (vertical)
        this._qtdAndarY *= -1;
      this._mudarHipotenusaSePrecisa();
    }
  }
  mudarQtdAndar(porcentagem)
  {
    this._qtdAndarX *= porcentagem;
    this._qtdAndarY *= porcentagem;
    this._mudarHipotenusaSePrecisa();
  }
  setTipoAndar(tipoAndar, formaGeom, outrasInformacoes)
  //formaGeom eh de quem vai andar
  {
    //inserir outrasInformacoes (se nao for undefined)
    if (outrasInformacoes !== undefined)
    {
      if (tipoAndar === TipoAndar.PermanecerEmRetangulo)
      //para TipoAndar.PermanecerEmRetangulo
      {
        if (outrasInformacoes.retangulo !== undefined)
        //para limitar o espaco onde pode ir (pode ser undefined)
        {
          this._retangulo = {};
          this._retangulo.x = outrasInformacoes.retangulo.x*width + (formaGeom.x + formaGeom.width/2);
          this._retangulo.y = outrasInformacoes.retangulo.y*height + (formaGeom.y + formaGeom.height/2);
          this._retangulo.width = outrasInformacoes.retangulo.width * width;
          this._retangulo.height = outrasInformacoes.retangulo.height * height;
        }

        this._inverterAmbasDirecoes = outrasInformacoes.inverterAmbasDirecoes!==false/*true ou undefined*/;
      }

      //para limitar a curva de TipoAndar.Seguir... e TipoAndar.Direcao... (nao necessario em nenhum dos dois)
      if (outrasInformacoes.limitarCurva!==undefined)
        this._limitarCurva = Clone.cloneDicionario(outrasInformacoes.limitarCurva);
    }
    //daqui pra frente eh setTipoAndar somente...

    this._tipoAndar = null;

    //se tipoAndar eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipoAndar === TipoAndar.SeguirInimMaisProx)
    {
      // se for pra um tiro seguir um inimigo sempre, seguir um dos mais importantes (essenciais)
      const infoInimSeguir = this._getInfoInimigoMaisProximo(formaGeom, false);
      if (infoInimSeguir !== null)
        this._inimSeguir = infoInimSeguir.inimigo;
      else
        this._tipoAndar = TipoAndar.Normal;
    } //sem else mesmo, porque seguir inim mais proximo tambem vai adicionar ultimo qtdAndar

    if (tipoAndar === TipoAndar.SeguirPers || tipoAndar === TipoAndar.SeguirInimMaisProx)
      this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
    else
    {
      if (this._ultimoQtdAndar !== undefined)
        delete this._ultimoQtdAndar;
      if (this._hipotenusaPadrao !== undefined)
        delete this._hipotenusaPadrao;
      if (this._inimSeguir !== undefined)
        delete this._inimSeguir;

      if (tipoAndar === TipoAndar.DirecaoPers)
        this._setarQtdAndarTipoDirecao(formaGeom, ControladorJogo.pers);
      else
      if (tipoAndar === TipoAndar.DirecaoInimMaisProx)
      {
        //retorna inimigo mais proximo em .inimigo e qtd quer andar em .qtdQrAndar
        const infoInimSeguir = this._getInfoInimigoMaisProximo(formaGeom);
        if (infoInimSeguir !== null)
          this._setarQtdAndarTipoDirecao(formaGeom, infoInimSeguir.inimigo);
        else
          this._tipoAndar = TipoAndar.Normal;
          //nao tem nenhum inimigo para ir na direcao, entao anda normal
      }
    }

    if (this._tipoAndar === null) this._tipoAndar = tipoAndar;

    if (this._tipoAndar === TipoAndar.SeguirPonto)
      this._pontoSeguir = outrasInformacoes.pontoSeguir;

    // se o tipoAndar precisa de hipotenusa padrao vai colocar
    if (this._tipoTemHipotenusaPadrao())
      this._colocarHipotenusaPadrao();
  }
  _getInfoInimigoMaisProximo(formaGeom, sohEssenciais = false)
  {
    //descobrir qual inimigo estah mais perto para seguir
    let praOndeAndar=null, menorHipotenusa=null;
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      {
        //se nao precisar ser soh os essenciais ou se for controlador de inimigos essenciais
        if (!sohEssenciais || controladorInims.ehDeInimigosEssenciais)
        {
          //informacoes de quanto andaria ateh inimigo mais proximo desse controlador
          const praOndeAndarAtual = controladorInims.qntAndarInimigoMaisProximo(formaGeom);
          if (praOndeAndarAtual.inim !== undefined) //se tem algum inimigo nesse controlador
          {
            const hipotenusaAtual = Operacoes.hipotenusa(praOndeAndarAtual.x, praOndeAndarAtual.y);
            if (menorHipotenusa === null || hipotenusaAtual < menorHipotenusa)
            {
              praOndeAndar = praOndeAndarAtual;
              menorHipotenusa = hipotenusaAtual;
            }
          }
        }
      });

    if (praOndeAndar === null) return null;
    return {inimigo: praOndeAndar.inim, qtdQrAndar: {x: praOndeAndar.x, y: praOndeAndar.y}};
  }
  _setarQtdAndarTipoDirecao(formaGeomVaiAndar, objSeguir)
  //objSeguir eh ObjetoTela
  {
    if (objSeguir.vivo) //se objSeguir nao estah vivo, nao ir na direcao dele
    {
      //tem que colocar hipotenusa padrao porque this._qtdAndarSeguir vai usar
      this._colocarHipotenusaPadrao();

      //ve o qtdAndar
      const qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar, objSeguir.centroMassa, true);
      this._qtdAndarX = qtdAndar.x;
      this._qtdAndarY = qtdAndar.y;
    }

    //vai andar sempre isso
    this.setTipoAndar(TipoAndar.Normal, formaGeomVaiAndar); //tira hipotenusaPadrao
  }

  //getters e setters de TiposAndar especificos...
  get limitarCurva() { return this._limitarCurva; } //nao mudar por aqui (mudar no set)
  set limitarCurva(limitarCurva) { this._limitarCurva = limitarCurva; }

  //em angulo de rotacao (nao do ciclo trigonometrico)
  get anguloQtdAndar() { return this._anguloQtdAndar; }
  _setAnguloQtdAndar(qtdAndarX = this._qtdAndarX, qtdAndarY = this._qtdAndarY)
  {
    //se nao andou nada e this._anguloQtdAndar ainda jah foi inicializado, deixa como estah
    if (this._anguloQtdAndar===undefined || qtdAndarX!==0 || qtdAndarX!==0)
      this._anguloQtdAndar = ClasseAndar.getAnguloQtdAndar(qtdAndarX, qtdAndarY); /*angulo de -PI a +PI*/
  }
  static getAnguloQtdAndar(qtdAndarX, qtdAndarY)
  { return Math.atan2(qtdAndarX, qtdAndarY*-1); }

  //em angulo do ciclo trigonometrico
  static qtdAndarEmAngulo(qtdAndarX, qtdAndarY, angulo)
  {
    //Explicacao:
      //- O qtdAndarX e qtdAndarY vao mudar, porem a hipotenusa que esses dois qtdAndar formam deve continuar a mesma.
      //- Portanto, odemos construir um triangulo no Ciclo Trigonometrico com esse angulo, hipotenusaPadrao como hipotenusa e raio do circulo e qtdAndarX e qtdAndarY como respectivos cateto adjacente (sobre o eixo X) e cateto oposto (sobre o eixo Y).
      //- Entao basta resolver os valores de qtdAndarX e qtdAndarY usando Seno e Cosseno...

    const hipotenusaPadrao = Operacoes.hipotenusa(qtdAndarX, qtdAndarY);
    return new Ponto(Math.cos(angulo)*hipotenusaPadrao, Math.sin(angulo)*hipotenusaPadrao);
  }

  // metodos diferentes de soh armazenar informacoes
  mudarAnguloQtdAndar(angulo)
  // angulo em radianos segundo o Ciclo Trigonometrico
  //obs: angulo nao precisa ser entre PI e -PI...
  {
    const qtdAndarEmAngulo = ClasseAndar.qtdAndarEmAngulo(this.qtdAndarX, this.qtdAndarY, angulo);
    this._qtdAndarX = qtdAndarEmAngulo.x;
    this._qtdAndarY = qtdAndarEmAngulo.y;
    this._mudarHipotenusaSePrecisa();
  }

  procAndar(formaGeom, vaiAndar=true)
  {
    // se quem o objeto estava seguindo morreu
    const objSeguir = this._getObjSeguir();
    if (objSeguir !==undefined && !objSeguir.vivo)
    {
      this.mudarQtdAndarParaUltimoAndar();
      this.setTipoAndar(TipoAndar.Normal);
    }

    //jah faz procedimentos de inverter qtdAndar(se precisar) e adicionar qtdAndar no ultimoQtdAndar
    const qtdAndar = this._qtdAndarFromTipo(formaGeom, vaiAndar);

    if (this._anguloQtdAndar!==undefined && vaiAndar)
      this._setAnguloQtdAndar(qtdAndar.x, qtdAndar.y);

    if (vaiAndar && this._aceleracao !== undefined)
    // se for andar deixa acelerado para a proxima vez
    {
      if (this._aceleracao.ehPorcentagem)
      {
        this._qtdAndarX *= this._aceleracao.valor;
        this._qtdAndarY *= this._aceleracao.valor;
      }else
      {
        if (this._qtdAndarX !== 0)
          this._qtdAndarX += this._aceleracao.valor * (this._qtdAndarX<0?-1:1);
        if (this._qtdAndarY !== 0)
          this._qtdAndarY += this._aceleracao.valor * (this._qtdAndarY<0?-1:1);
      }
      this._mudarHipotenusaSePrecisa();

      if (this._aceleracao.qntsVezes !== undefined)
      // se vai acelerar/desacelerar um numero contado de vezes
      {
        this._aceleracao.qntsVezesCompletas += this._aceleracao.qtdSomarCadaVez; //para funcionar certo se mudarTempo

        //verificar se jah nao acelerar/desacelerar o numero desejado
        if (this._aceleracao.qntsVezesCompletas >= this._aceleracao.qntsVezes)
          delete this._aceleracao; //a forma da classe passar a considerar como se nao tivesse que acelerar/desacelerar eh this._aceleracao sendo 'undefined'
      }
    }

    return qtdAndar;
  }
  mudarQtdAndarParaUltimoAndar()
  {
    this._qtdAndarX = this._ultimoQtdAndar.x;
    this._qtdAndarY = this._ultimoQtdAndar.y;
  }

  _mudarHipotenusaSePrecisa()
  {
    if (this._hipotenusaPadrao !== undefined) //se estah com hipotenusa eh pra continuar colocando (atualizando essa variavel)
      this._colocarHipotenusaPadrao();
  }
  _tipoTemHipotenusaPadrao()
  { return this._tipoAndar === TipoAndar.SeguirPers || this._tipoAndar === TipoAndar.SeguirInimMaisProx || this._tipoAndar === TipoAndar.SeguirPonto; }
  _colocarHipotenusaPadrao()
  { this._hipotenusaPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY); }

  //metodos auxiliares
  _qtdAndarFromTipo(formaGeomVaiAndar, vaiAndar)
  //jah faz procedimentos de inverter qtdAndar e adicionar qtdAndar no ultimoQtdAndar
  //retorna {x, y}
  {
    switch(this._tipoAndar)
    {
      case TipoAndar.Normal:
        return {x: this._qtdAndarX, y: this._qtdAndarY};

      case TipoAndar.PermanecerEmRetangulo:
        //HORIZONTALMENTE
        let vaiSairX;
        if (this._retangulo === undefined) //eh pra considerar o ceu inteiro como o retangulo
          vaiSairX = Tela.objVaiSairEmX(formaGeomVaiAndar, this._qtdAndarX);
        else
        {
          if (!isNaN(this._retangulo.width))
          //se height ou width do retangulo for NaN, nao verificar se vai sair do retangulo naquela direcao
          {
            if (this._qtdAndarX < 0) //verificar a esquerda
              vaiSairX = (formaGeomVaiAndar.x + this._qtdAndarX) < this._retangulo.x;
            else //verificar a direita
              vaiSairX = (formaGeomVaiAndar.x + formaGeomVaiAndar.width + this._qtdAndarX) > this._retangulo.x + this._retangulo.width;
          }else
            vaiSairX = false;
        }

        //VERTICALMENTE
        let vaiSairY;
        if (this._inverterAmbasDirecoes && vaiSairX)
        //se for pra inverter os dois lados se colidir qualquer um e jah colidiu, nao precisa verificar nessa direcao
          vaiSairY = true;
        else
        {
          if (this._retangulo === undefined) //eh pra considerar o ceu inteiro como o retangulo
            vaiSairY =  Tela.objVaiSairEmY(formaGeomVaiAndar, this._qtdAndarY);
          else
          {
            if (!isNaN(this._retangulo.height))
            //se height ou width do retangulo for NaN, nao verificar se vai sair do retangulo naquela direcao
            {
              if (this._qtdAndarY < 0) //verificar a cima
                vaiSairY = (formaGeomVaiAndar.y + this._qtdAndarY) < this._retangulo.y;
              else //verificar a baixo
                vaiSairY = (formaGeomVaiAndar.y + formaGeomVaiAndar.height + this._qtdAndarY) > this._retangulo.y + this._retangulo.height;
            }else
              vaiSairY = false;
          }
        }

        //mudar qtdAndar baseado em qual direcao vai sair e em this._inverterAmbasDirecoes
        if (vaiSairX || vaiSairY)
        {
          if (vaiSairX || this._inverterAmbasDirecoes)
            this._qtdAndarX *= -1;
          if (vaiSairY || this._inverterAmbasDirecoes)
            this._qtdAndarY *= -1;
        }
        //retonar quanto vai andar
        return {x: this._qtdAndarX, y: this._qtdAndarY};

      case TipoAndar.SeguirPers:
      case TipoAndar.SeguirInimMaisProx:
      case TipoAndar.SeguirPonto:
        const qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar);

        if (vaiAndar && (this._tipoAndar===TipoAndar.SeguirInimMaisProx || this._tipoAndar===TipoAndar.SeguirPers))
        {
          //muda o ultimoQtdAndar se for TipoAnda.Seguir...
          this._ultimoQtdAndar.x = qtdAndar.x;
          this._ultimoQtdAndar.y = qtdAndar.y;
        }
        return qtdAndar;
    }
  }
  _getObjSeguir() //objSeguir para this._qtdAndarFromTipo(...)
  {
    if (this._tipoAndar === TipoAndar.SeguirPers)
      return ControladorJogo.pers;
    if (this._tipoAndar === TipoAndar.SeguirInimMaisProx)
      return this._inimSeguir;
  }
  _getPontoSeguir()
  {
    const objSeguir = this._getObjSeguir();
    if (objSeguir!==undefined)
      return objSeguir.formaGeometrica.centroMassa;
    else
      return this._pontoSeguir;
  }
  _qtdAndarSeguir(formaGeomVaiAndar, pontoSeguir=this._getPontoSeguir(), ehTipoDirecao=false)
  {
    const qtdQuerAndar = pontoSeguir.menos(formaGeomVaiAndar.centroMassa); // PosicaoFinal - PosicaoInicial
    // destino deve ser o centroMassa (ps: ClasseAndar.qntAndarParaBater(...) considera as duas formas como retangulos, portanto o algoritmo nao funcionaria se o objeto que vai andar jah estivesse dentro dele)

    const hipotenusaQuerAndar = Operacoes.hipotenusa(qtdQuerAndar.x, qtdQuerAndar.y);

    // verificar se mudar o angulo do sentido mais do que pode
    if (!ehTipoDirecao && this._limitarCurva !== undefined)
    {
      // se nao quer andar nada (o centroMassa do objVaiAndar jah estah em cima de pontoSeguir)
      //ps: seguindo o fluxo do programa iria retornar (0,0) tambem mas ia fazer muitas contas desnecessarias
      if (Exatidao.ehQuaseExato(qtdQuerAndar.x, 0) && Exatidao.ehQuaseExato(qtdQuerAndar.y, 0))
        return new Ponto(0,0);

      const anguloMudaRota = Angulo.entrePIeMenosPI(ClasseAndar.getAnguloQtdAndar(qtdQuerAndar.x, qtdQuerAndar.y) - this._anguloQtdAndar); //angulo rotacao

      //porque na primeira execucao o maiorAnguloMudanca pode ser diferente:
      const maiorAnguloMudancaAtual = (this._limitarCurva.primMaiorAngMud!==undefined) ? this._limitarCurva.primMaiorAngMud : this._limitarCurva.maiorAnguloMudanca;
      if (this._limitarCurva.primMaiorAngMud!==undefined)
      // se jah fez a primeira vez deleta essa variavel
        delete this._limitarCurva.primMaiorAngMud;

      const maiorAnguloMudanca = maiorAnguloMudancaAtual * ((hipotenusaQuerAndar < this._hipotenusaPadrao) ?
        Math.min(this._hipotenusaPadrao/hipotenusaQuerAndar, 1.8) : 1);
      // se quer andar menos do que pode, o angulo de rotacao vai ser maior (ateh 1.8vezes maior)
      if (Math.abs(anguloMudaRota) > maiorAnguloMudanca) //angulos rotacao
      //se quer rotacionar mais do que pode
      {
        // rotaciona o maximo que pode no sentido desejado
        const anguloQtdAndarPossivel = this._anguloQtdAndar + maiorAnguloMudancaAtual*(anguloMudaRota<0?-1:1); //angulo rotacao

        return ClasseAndar.qtdAndarEmAngulo(this._qtdAndarX, this._qtdAndarY, Angulo.angRotacaoParaAngCicloTrig(
          anguloQtdAndarPossivel)).multiplicado(this._limitarCurva.porcVelCurva);
      }
    }

    //daqui pra baixo pode andar nesse sentido mesmo...

    if (hipotenusaQuerAndar < this._hipotenusaPadrao)
    // se quer andar menos do que pode, anda menos
      return qtdQuerAndar;
    else
    {
      //calcular quanto andar em cada direcao para andar sempre o mesmo que o padrao
      const k = this._hipotenusaPadrao/hipotenusaQuerAndar;
      return qtdQuerAndar.multiplicado(k);
    }
  }

  static qntAndarParaBater(formaGeomVaiAndar, formaGeomPerseguido)
  {
    //nao pode verificar apenas qual centroMassa eh mais perto do outro porque se fosse assim as formasGeometricas muito grandes nunca seriam atingidas...
    // por isso, buscar a menor distancia ateh algum ponto das beiradas (se jah estah em alguma das beiradas ou dentro de alguma delas, tem que andar zero naquela direcao)

    // horizontalmente
    let qtdAndarX;
    if (Interseccao.intersecDirecao(formaGeomVaiAndar.x, formaGeomVaiAndar.width, formaGeomPerseguido.x, formaGeomPerseguido.width))
      qtdAndarX = 0;
    else
    {
      if (formaGeomVaiAndar.x > formaGeomPerseguido.x + formaGeomPerseguido.width)
      // se formaGeomVaiAndar estah a direita de formaGeomPerseguido
        qtdAndarX = formaGeomPerseguido.x + formaGeomPerseguido.width - formaGeomVaiAndar.x;
        // vai pra esquerda ateh chegar na borda direita da forma perseguida
      else
      // formaGeomVaiAndar estah a esquerda de formaGeomPerseguido
        qtdAndarX = formaGeomPerseguido.x - (formaGeomVaiAndar.x + formaGeomVaiAndar.width);
        // vai pra direita ateh chegar na borda direita da forma perseguida
    }

    // verticalmente
    let qtdAndarY;
    if (Interseccao.intersecDirecao(formaGeomVaiAndar.y, formaGeomVaiAndar.height, formaGeomPerseguido.y, formaGeomPerseguido.height))
      qtdAndarY = 0;
    else
    {
      if (formaGeomVaiAndar.y > formaGeomPerseguido.y + formaGeomPerseguido.height)
      // se formaGeomVaiAndar estah a baixo de formaGeomPerseguido
        qtdAndarY = formaGeomPerseguido.y + formaGeomPerseguido.height - formaGeomVaiAndar.y;
        // vai pra cima ateh chegar na borda baixo da forma perseguida
      else
      // formaGeomVaiAndar estah a cima de formaGeomPerseguido
        qtdAndarY = formaGeomPerseguido.y - (formaGeomVaiAndar.y + formaGeomVaiAndar.height);
        // vai pra baixo ateh chegar na borda baixo da forma perseguida
    }

    return {x: qtdAndarX, y: qtdAndarY};
  }
  static infoQtdAndarNaoColidir(info, objParado, objVaiAndar, comMenorWidthHeight)
  //retorna se inseriu
  //info: menorHipotenusa, objsColidiram, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao,
  // [menorWidth](nem smp), [menorHeight](nem smp)
  //em objsColidiram ficarao os objParado que colidirem antes com objVaiAndar
  {
    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objParado.formaGeometrica, objVaiAndar.formaGeometrica,
      info.qtdAndarXPadrao, info.qtdAndarYPadrao);
    const hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    //se objVaiAndar vai bater em um obstaculo mais perto ou igual a um que jah bateu
    if (hipotenusa < info.menorHipotenusa || (info.objsColidiram.length>0 && hipotenusa === info.menorHipotenusa))
    {
      //se a hipotenusa diminuiu (agora tudo serah apenas relacionado a ele)
      if (hipotenusa < info.menorHipotenusa)
      {
        info.objsColidiram = []; //esvaziar

        info.menorHipotenusa = hipotenusa;
        info.qtdPodeAndarX = qtdPodeAndar.x;
        info.qtdPodeAndarY = qtdPodeAndar.y;

        if (comMenorWidthHeight)
        {
          info.menorHeight = objParado.formaGeometrica.height;
          info.menorWidth = objParado.formaGeometrica.width;
        }
      }else
      //if (info.objsColidiram.length>0 && hipotenusa === info.menorHipotenusa)
        if (comMenorWidthHeight)
        {
          if (objParado.formaGeometrica.height < info.menorHeight)
            info.menorHeight = objParado.formaGeometrica.height;
          if (objParado.formaGeometrica.width < info.menorWidth)
            info.menorWidth = objParado.formaGeometrica.width;
        }

      info.objsColidiram.push(objParado);
      return true;
    }else
      return false;
  }

  //para ajudar em criar Objetos
  static qtdAndarDif(infoNovo, infoObjTelaPadrao, alteracoesAndar)
  {
    if (infoNovo.infoAndar === undefined)
      infoNovo.infoAndar = infoObjTelaPadrao.infoAndar;
    else
      AuxiliarInfo.mergeInfoNovoComPadrao(infoNovo.infoAndar, infoObjTelaPadrao.infoAndar)

    ClasseAndar.qtdAndarDifMudarDir(infoNovo.infoAndar, alteracoesAndar);
  }
  static qtdAndarDifMudarDir(infoAndar, alteracoesAndar)
  // alteracoesAndar: {direcao} ou {angulo}
  /* obs: se alteracoesAndar.angulo existir, eh porque quer alterar o andar definindo um angulo para o qtdAndar
         se alteracoesAndar.direcao existir: (1.) se {x E/OU y} muda o sentido dos qtdAndar sem mudar o modulo nem a direcao;
       (2.) caso contrario, soma qtdAndarX e Y e coloca no sentido especificado (a outra direcao tera qtdAndar igual a ZERO) */
  {
    if (alteracoesAndar===undefined || (alteracoesAndar.angulo===undefined && alteracoesAndar.direcao===undefined)) return;
    // se nao tem nada o que fazer...
    // ps: alteracoesAndar pode nao ser undefined mas tambem nao ter nenhuma informacao sobre angulo e direcao, pois em Tiro a mesma variavel eh usada para alteracoesRotacionar

    if (alteracoesAndar.angulo !== undefined)
      infoAndar.mudarAnguloQtdAndar(alteracoesAndar.angulo);
    else
    {
      if (alteracoesAndar.direcao.x!==undefined || alteracoesAndar.direcao.y!==undefined)
      //se soh quer alterar o sentido de
      {
        if (alteracoesAndar.direcao.x === Direcao.Direita)
          infoAndar.qtdAndarX = Math.abs(infoAndar.qtdAndarX);
        else if (alteracoesAndar.direcao.x === Direcao.Esquerda)
          infoAndar.qtdAndarX = -Math.abs(infoAndar.qtdAndarX);

        if (alteracoesAndar.direcao.y === Direcao.Baixo)
          infoAndar.qtdAndarY = Math.abs(infoAndar.qtdAndarY);
        else if (alteracoesAndar.direcao.y === Direcao.Cima)
          infoAndar.qtdAndarY = -Math.abs(infoAndar.qtdAndarY);
      }else
      //para somar as duas direcoes e colocar em apenas um sentido
      {
        if (alteracoesAndar.direcao===Direcao.Direita || alteracoesAndar.direcao===Direcao.Esquerda)
        {
          infoAndar.qtdAndarX = (Math.abs(infoAndar.qtdAndarX) + Math.abs(infoAndar.qtdAndarY)) * ((alteracoesAndar.direcao===Direcao.Esquerda)?-1:1);
          infoAndar.qtdAndarY = 0; //esse necessariamente depois
        }
        else
        if (alteracoesAndar.direcao===Direcao.Cima|| alteracoesAndar.direcao===Direcao.Baixo)
        {
          infoAndar.qtdAndarY = (Math.abs(infoAndar.qtdAndarX) + Math.abs(infoAndar.qtdAndarY)) * ((alteracoesAndar.direcao===Direcao.Cima)?-1:1);
          infoAndar.qtdAndarX = 0; //esse necessariamente depois
        }
      }
    }
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    //qtdAndar
    this._qtdAndarX *= porcentagem;
    this._qtdAndarY *= porcentagem;
    this._mudarHipotenusaSePrecisa();

    //aceleracao
    if (this._aceleracao!==undefined)
    {
      //valor
      if (this._aceleracao.ehPorcentagem)
        this._aceleracao.valor = Math.pow(this._aceleracao.valor, porcentagem);
      else
        this._aceleracao.valor *= porcentagem;

      //para parar de acelerar na hora certa
      if (this._aceleracao.qtdSomarCadaVez!==undefined)
        this._aceleracao.qtdSomarCadaVez *= porcentagem;
    }

    //limitarCurva.maiorAnguloMudanca
    if (this._limitarCurva !== undefined)
    {
      this._limitarCurva.maiorAnguloMudanca *= porcentagem;
      if (this._limitarCurva.primMaiorAngMud!==undefined)
        this._limitarCurva.primMaiorAngMud *= porcentagem;
    }
  }
}
