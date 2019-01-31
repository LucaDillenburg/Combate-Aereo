const TipoAndar = {
    "Normal":1,

    //sair tela
    "NaoSairTelaInvTudo":2, //inverte as duas direcoes mesmo que soh fosse sair em uma
    "NaoSairTelaInvDir":3, //inverte soh a direcao que ia sair da tela

    //passar por XY
    "NaoPassarXYNemSairTelaInvTudo":4, //inverte as duas direcoes se fosse passar por um determinado XY (se for sair tela tambem inverte as duas direcoes)
    "NaoPassarXYNemSairTelaInvDir":5, //inverte soh a direcao que fosse passar pelo determinado XY (se for sair tela inverte soh a direcao que for sair)
    "NaoPassarXYPodeSairTelaInvTudo":6, //inverte as duas direcoes se fosse passar por um determinado XY (deixa sair da tela)
    "NaoPassarXYPodeSairTelaInvDir":7, //inverte soh a direcao que fosse passar pelo determinado XY (deixa sair da tela)

    //seguir
    "SeguirPers": 8,
    "SeguirInimMaisProx": 9,

    //direcao
    "DirecaoPers": 10,
    "DirecaoInimMaisProx":11
  };

class InfoAndar
{
  constructor(qtdAndarX, qtdAndarY, tipoAndar, atehQualXYPodeAndar, aceleracao, limitarCurva, guardarAnguloQtdAndar=false)
  //eh public mesmo porque tem get e set em todos sem verificacao
  //aceleracao: valor, ehPorcentagem, qntsVezes
  //limitarCurva: {maiorAnguloMudanca, porcVelCurva}
    //- maiorAnguloMudanca: maior angulo que pode mudar a rota (para limitar a curva quando for TipoAndar.Seguir...)
    //- porcVelCurva: para ir mais devagar quando for limitado pela curva
  {
    this.qtdAndarX = qtdAndarX;
    this.qtdAndarY = qtdAndarY;
    this.tipoAndar = tipoAndar;
    this.atehQualXYPodeAndar = atehQualXYPodeAndar;
    this.aceleracao = aceleracao;
    this.limitarCurva = limitarCurva;
    this.guardarAnguloQtdAndar = guardarAnguloQtdAndar;
  }

  clone()
  {
    const cloneAceleracao = (this.aceleracao===undefined?undefined:{valor: this.aceleracao.valor, ehPorcentagem: this.aceleracao.ehPorcentagem, qntsVezes: this.aceleracao.qntsVezes});
    const cloneLimitarCurva = (this.limitarCurva===undefined?undefined:{maiorAnguloMudanca: this.limitarCurva.maiorAnguloMudanca, porcVelCurva: this.limitarCurva.porcVelCurva});
    return new InfoAndar(this.qtdAndarX, this.qtdAndarY, this.tipoAndar, this.atehQualXYPodeAndar, cloneAceleracao, cloneLimitarCurva, this.guardarAnguloQtdAndar);
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
//qtdAndarX, qtdAndarY, tipoAndar, [atehQualXYPodeAndar], [ultimoQtdAndar e [inimSeguir]]
{
  constructor(infoAndar, formaGeom)
  //infoAndar nao precisa estar clonado (ele mesmo "clona")
  //formaGeom eh de quem vai andar
  {
    this._qtdAndarX = infoAndar.qtdAndarX;
    this._qtdAndarY = infoAndar.qtdAndarY;

    this.setTipoAndar(infoAndar.tipoAndar, formaGeom);

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

    if (infoAndar.atehQualXYPodeAndar !== undefined)
    //soh precisa se for INVERTER_..._NAO_PASSAR_XY
      this._atehQualXYPodeAndar = infoAndar.atehQualXYPodeAndar; //nao precisa clonar porque nao vai mudar isso

    if (infoAndar.guardarAnguloQtdAndar || infoAndar.limitarCurva!==undefined/*se for limitar a curva tambem precisa guardar esse angulo*/)
      this._setAnguloQtdAndar();

    //para limitar a curva de TipoAndar.Seguir...
    if (infoAndar.limitarCurva!==undefined)
      this._limitarCurva = cloneDicionario(infoAndar.limitarCurva);
  }

  get qtdAndarX() { return this._qtdAndarX; }
  get qtdAndarY() { return this._qtdAndarY; }
  get tipoAndar() { return this._tipoAndar; }

  get atehQualXYPodeAndar() { return this._atehQualXYPodeAndar; } //nao mudar por aqui (mudar no set)
  set atehQualXYPodeAndar(ponto) { this._atehQualXYPodeAndar = ponto; }

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

  //setters
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
  mudarQtdAndar(porcentagem)
  {
    this.qtdAndarX = this._qtdAndarX*porcentagem;
    this.qtdAndarY = this._qtdAndarY*porcentagem;
  }
  setTipoAndar(tipo, formaGeom)
  //formaGeom eh de quem vai andar
  {
    this._tipoAndar = null;

    //se tipo eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipo === TipoAndar.SeguirInimMaisProx)
    {
      // se for pra um tiro seguir um inimigo sempre, seguir um dos mais importantes (essenciais)
      const infoInimSeguir = this._getInfoInimigoMaisProximo(formaGeom, true);
      if (infoInimSeguir !== null)
        this._inimSeguir = infoInimSeguir.inimigo;
      else
        this._tipoAndar = TipoAndar.Normal;
    } //sem else mesmo, porque seguir inim mais proximo tambem vai adicionar ultimo qtdAndar

    if (tipo === TipoAndar.SeguirPers || tipo === TipoAndar.SeguirInimMaisProx)
      this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
    else
    {
      if (this._ultimoQtdAndar !== undefined)
        delete this._ultimoQtdAndar;
      if (this._hipotenusaPadrao !== undefined)
        delete this._hipotenusaPadrao;

      if (tipo === TipoAndar.DirecaoPers)
        this._setarQtdAndarTipoDirecao(formaGeom, ControladorJogo.pers);
      else
      if (tipo === TipoAndar.DirecaoInimMaisProx)
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

    if (this._tipoAndar === null) this._tipoAndar = tipo;

    // se o tipo precisa de hipotenusa padrao vai colocar
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
    //tem que colocar hipotenusa padrao porque this._qtdAndarSeguir vai usar
    this._colocarHipotenusaPadrao();

    //ve o qtdAndar
    const qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar, objSeguir, true);
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;

    //vai andar sempre isso
    this.setTipoAndar(TipoAndar.Normal, formaGeomVaiAndar); //tira hipotenusaPadrao
  }

  procAndar(formaGeom, vaiAndar=true)
  {
    // se quem o objeto estava seguindo morreu
    if ((this._tipoAndar === TipoAndar.SeguirInimMaisProx && !this._inimSeguir.vivo) ||
      (this._tipoAndar === TipoAndar.SeguirPers && !ControladorJogo.pers.vivo))
    {
      this.mudarQtdAndarParaUltimoAndar();
      this.setTipoAndar(TipoAndar.Normal);
    }

    //objSeguir para this._qtdAndarFromTipo(...)
    let objSeguir;
    if (this._tipoAndar === TipoAndar.SeguirPers)
      objSeguir = ControladorJogo.pers;
    else
    if (this._tipoAndar === TipoAndar.SeguirInimMaisProx)
      objSeguir = this._inimSeguir;

    //jah faz procedimentos de inverter qtdAndar(se precisar) e adicionar qtdAndar no ultimoQtdAndar
    const qtdAndar = this._qtdAndarFromTipo(formaGeom, objSeguir);

    if (this._anguloQtdAndar!==undefined)
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
  { return this._tipoAndar === TipoAndar.SeguirPers || this._tipoAndar === TipoAndar.SeguirInimMaisProx; }
  _colocarHipotenusaPadrao()
  { this._hipotenusaPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY); }

  //metodos auxiliares
  _qtdAndarFromTipo(formaGeomVaiAndar, objPerseguido, fazerProcsInvUlt)
  //jah faz procedimentos de inverter qtdAndar e adicionar qtdAndar no ultimoQtdAndar
  //objPerseguido eh ObjetoTela
  //retorna {x, y}
  {
    let qtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};

    let inverter = {x: false, y: false}; // comum ao 2o e 3o case
    switch(this._tipoAndar)
    {
      case TipoAndar.Normal:
        break;
      case TipoAndar.NaoPassarXYNemSairTelaInvTudo: //tambem nao pode sair da tela
      case TipoAndar.NaoPassarXYNemSairTelaInvDir: //tambem nao pode sair da tela
      case TipoAndar.NaoSairTelaInvTudo:
      case TipoAndar.NaoSairTelaInvDir:
        const inverteApenasDirecao = (this._tipoAndar === TipoAndar.NaoSairTelaInvDir ||
          this._tipoAndar === TipoAndar.NaoPassarXYNemSairTelaInvDir);

        const vaiSairX = Tela.objVaiSairEmX(formaGeomVaiAndar, this._qtdAndarX);
        const vaiSairY = Tela.objVaiSairEmY(formaGeomVaiAndar, this._qtdAndarY);

        //se obstaculo vai sair, inverte a direcao
        if (vaiSairX || vaiSairY)
        {
          if (!inverteApenasDirecao || vaiSairX)
          {
            inverter.x = true;
            qtdAndar.x = -this._qtdAndarX;
          }
          if (!inverteApenasDirecao || vaiSairY)
          {
            inverter.y = true;
            qtdAndar.y = -this._qtdAndarY;
          }

          if (inverter.x && inverter.y)
            break;
          //se jah inverteu nas duas direcoes, jah fez tudo
        }

        if (this._tipoAndar === TipoAndar.NaoSairTelaInvTudo ||
          this._tipoAndar === TipoAndar.NaoSairTelaInvDir)
          break; //se for INVERTER_..._NAO_SAIR_TELA, jah fez tudo

      case TipoAndar.NaoPassarXYPodeSairTelaInvTudo:
      case TipoAndar.NaoPassarXYPodeSairTelaInvDir:
      // os outros tipos andar de "nao passar XY" jah entraram no bloco anterior e se nao inverteram os dois lados continuam nesse bloco...
        this._mudarDadosTipoNaoPassarXY(qtdAndar, inverter, formaGeomVaiAndar); //muda as coisas no metodo e volta diferente (passagem por referencia)
        break;

      case TipoAndar.SeguirPers:
      case TipoAndar.SeguirInimMaisProx:
        qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar, objPerseguido);

        //muda o ultimoQtdAndar se for TipoAnda.Seguir...
        this._ultimoQtdAndar.x = qtdAndar.x;
        this._ultimoQtdAndar.y = qtdAndar.y;
        break;
    }

    //inverter qtdAndarX e/ou Y se precisar
    this.inverterDirecoesQtdAndar(inverter.x, inverter.y);

    return qtdAndar;
  }
  _mudarDadosTipoNaoPassarXY(qtdAndar, inverter, formaGeometrica)
  //funciona por passagem por referencia
  {
    const inverteApenasDirecao = (this._tipoAndar === TipoAndar.NaoPassarXYNemSairTelaInvDir ||
      this._tipoAndar === TipoAndar.NaoPassarXYPodeSairTelaInvDir);

    //se vai passar de X (de qual lado para o outro que seja)
    if (!inverter.x && (this._qtdAndarX !== 0 || !inverteApenasDirecao) && this._atehQualXYPodeAndar.x !== undefined)
    //se ainda nao inverteu em X e quer andar alguma coisa
    {
      let inicio;
      if (this._qtdAndarX >= 0)
        inicio = formaGeometrica.x;
      else
        inicio = formaGeometrica.x + this._qtdAndarX;
      const distancia = Math.abs(this._qtdAndarX) + formaGeometrica.width;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(this._atehQualXYPodeAndar.x, inicio, distancia))
      {
        inverter.x = true;
        qtdAndar.x = -this._qtdAndarX;

        if (!inverteApenasDirecao)
        {
          //inverte Y tambem
          inverter.y = true;
          qtdAndar.y = -this._qtdAndarY;
        }
      }
    }

    //[igual o if de cima porem com Y ao inves de X]
    //se vai passar de Y (de qual lado para o outro que seja)
    if (!inverter.y && (this._qtdAndarY !== 0 || !inverteApenasDirecao) && this._atehQualXYPodeAndar.y !== undefined)
    //se ainda nao inverteu em Y e quer andar alguma coisa
    {
      let inicio;
      if (this._qtdAndarY >= 0)
        inicio = formaGeometrica.y;
      else
        inicio = formaGeometrica.y + this._qtdAndarY;
      const distancia = Math.abs(this._qtdAndarY) + formaGeometrica.height;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(this._atehQualXYPodeAndar.y, inicio, distancia))
      {
        inverter.y = true;
        qtdAndar.y = -this._qtdAndarY;

        if (!inverteApenasDirecao)
        {
          //inverte X tambem
          inverter.x = true;
          qtdAndar.x = -this._qtdAndarX;
        }
      }
    }
  }
  _qtdAndarSeguir(formaGeomVaiAndar, objPerseguido, ehTipoDirecao=false)
  //objPerseguido: ObjetoTela que estah sendo perseguido
  {
    const qtdQuerAndar = objPerseguido.formaGeometrica.centroMassa.menos(formaGeomVaiAndar.centroMassa); // PosicaoFinal - PosicaoInicial
    // destino deve ser o centroMassa (ps: ClasseAndar.qntAndarParaBater(...) considera as duas formas como retangulos, portanto o algoritmo nao funcionaria se o objeto que vai andar jah estivesse dentro dele)

    const hipotenusaQuerAndar = Operacoes.hipotenusa(qtdQuerAndar.x, qtdQuerAndar.y);

    // verificar se mudar o angulo do sentido mais do que pode
    if (!ehTipoDirecao && this._limitarCurva !== undefined)
    {
      // se nao quer andar nada (o centroMassa do objVaiAndar jah estah em cima do centroMassa do objPerseguido)
      //ps: seguindo o fluxo do programa iria retornar (0,0) tambem mas ia fazer muitas contas desnecessarias
      if (Exatidao.ehQuaseExato(qtdQuerAndar.x, 0) && Exatidao.ehQuaseExato(qtdQuerAndar.y, 0))
        return new Ponto(0,0);

      const anguloMudaRota = Angulo.entrePIeMenosPI(ClasseAndar.getAnguloQtdAndar(qtdQuerAndar.x, qtdQuerAndar.y) - this._anguloQtdAndar); //angulo rotacao

      const maiorAnguloMudanca = this._limitarCurva.maiorAnguloMudanca * ((hipotenusaQuerAndar < this._hipotenusaPadrao) ?
        Math.min(this._hipotenusaPadrao/hipotenusaQuerAndar, 1.8) : 1);
      // se quer andar menos do que pode, o angulo de rotacao vai ser maior (ateh 1.8vezes maior)
      if (Math.abs(anguloMudaRota) > maiorAnguloMudanca) //angulos rotacao
      //se quer rotacionar mais do que pode
      {
        // rotaciona o maximo que pode no sentido desejado
        const anguloQtdAndarPossivel = this._anguloQtdAndar + this._limitarCurva.maiorAnguloMudanca*(anguloMudaRota<0?-1:1); //angulo rotacao

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

  inverterDirecoesQtdAndar(inverterX, inverterY)
  {
    if (inverterX)
      this._qtdAndarX *= -1;
    if (inverterY)
      this._qtdAndarY *= -1;
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
    {
      if (infoNovo.infoAndar.qtdAndarX === undefined)
        infoNovo.infoAndar.qtdAndarX = infoObjTelaPadrao.infoAndar.qtdAndarX;
      if (infoNovo.infoAndar.qtdAndarY === undefined)
        infoNovo.infoAndar.qtdAndarY = infoObjTelaPadrao.infoAndar.qtdAndarY;
      if (infoNovo.infoAndar.tipoAndar === undefined)
        infoNovo.infoAndar.tipoAndar = infoObjTelaPadrao.infoAndar.tipoAndar;

      if (infoNovo.infoAndar.atehQualXYPodeAndar === undefined)
        infoNovo.infoAndar.atehQualXYPodeAndar = infoObjTelaPadrao.infoAndar.atehQualXYPodeAndar;
    }

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
      this._limitarCurva.maiorAnguloMudanca *= porcentagem;
  }
}
