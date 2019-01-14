//andar
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

    if (infoAndar.aceleracao !== undefined)
      this._aceleracao = {valor: infoAndar.aceleracao.valor, ehPorcentagem: infoAndar.aceleracao.ehPorcentagem}; //nunca vai ser null pois o valor padrao dele la no InfoAndar eh 1
    if (infoAndar.atehQualXYPodeAndar !== undefined)
    //soh precisa se for INVERTER_..._NAO_PASSAR_XY
      this._atehQualXYPodeAndar = infoAndar.atehQualXYPodeAndar;
  }

  get qtdAndarX() { return this._qtdAndarX; }
  get qtdAndarY() { return this._qtdAndarY; }
  get tipoAndar() { return this._tipoAndar; }

  get atehQualXYPodeAndar() { return this._atehQualXYPodeAndar; }
  set atehQualXYPodeAndar(ponto) { this._atehQualXYPodeAndar = ponto; }

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
          this._setarQtdAndarTipoDirecao(formaGeom, infoInimSeguir.inimigo, infoInimSeguir.qtdQrAndar);
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
    for (let i=0; i<ControladorJogo.controladoresInimigos.length; i++)
    {
      //se tiver que ser soh inimigos essenciais e esse nao for, ele volta pro "cabecalho" do for
      if (sohEssenciais && !ControladorJogo.controladoresInimigos[i].ehDeInimigosEssenciais) continue;

      //informacoes de quanto andaria ateh inimigo mais proximo desse controlador
      const praOndeAndarAtual = ControladorJogo.controladoresInimigos[i].qntAndarInimigoMaisProximo(formaGeom);
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

    if (praOndeAndar === null) return null;
    return {inimigo: praOndeAndar.inim, qtdQrAndar: {x: praOndeAndar.x, y: praOndeAndar.y}};
  }
  _setarQtdAndarTipoDirecao(formaGeomVaiAndar, objSeguir, qtdQrAndar)
  //objSeguir eh ObjetoTela
  {
    //tem que colocar hipotenusa padrao porque this._qtdAndarSeguir vai usar
    this._colocarHipotenusaPadrao();

    //ve o qtdAndar
    const qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar, objSeguir, qtdQrAndar);
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;

    //vai andar sempre isso
    this.setTipoAndar(TipoAndar.Normal, formaGeomVaiAndar); //tira hipotenusaPadrao
  }

  procAndar(formaGeom, vaiAndar=true)
  {
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

    if (vaiAndar && this._aceleracao !== undefined)
    // se for andar deixa acelerado para a proxima vez
    {
      if (this._aceleracao.ehPorcentagem)
      {
        this._qtdAndarX *= this._aceleracao.valor;
        this._qtdAndarY *= this._aceleracao.valor;
      }else
      {
        this._qtdAndarX += this._aceleracao.valor * (this._qtdAndarX<0?-1:1);
        this._qtdAndarY += this._aceleracao.valor * (this._qtdAndarY<0?-1:1);
      }
      this._mudarHipotenusaSePrecisa();
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
  _qtdAndarSeguir(formaGeomVaiAndar, objPerseguido, qntQrAndar)
  {
    if (qntQrAndar === undefined)
      qntQrAndar = ClasseAndar.qntAndarParaBater(formaGeomVaiAndar, objPerseguido.formaGeometrica);
      //calcular quanto teria que andar em cada direcao para chegar ao objeto

    //calcular quanto andar em cada direcao para andar sempre o mesmo que o padrao
    const k = this._hipotenusaPadrao/Operacoes.hipotenusa(qntQrAndar.x, qntQrAndar.y);
    return {x: k*qntQrAndar.x, y: k*qntQrAndar.y};
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
    //direcao de formaGeomVaiAndar em relacao a formaGeomPerseguido
    const direcao = Direcao.emQualDirecaoObjEsta(formaGeomPerseguido, formaGeomVaiAndar);

    let x,y;
    if (direcao === Direcao.Cima || direcao === Direcao.Baixo)
    {
      x = formaGeomPerseguido.x + (formaGeomPerseguido.width - formaGeomVaiAndar.width)/2;

      const k = porcentQrEntrar*formaGeomPerseguido.height;
      if (direcao === Direcao.Cima)
        y = formaGeomPerseguido.y - formaGeomVaiAndar.height + k;
      else
        y = formaGeomPerseguido.y + formaGeomPerseguido.height - k;
    }else
    //if (direcao === Direcao.Esquerda || direcao === Direcao.Direita)
    {
      y = formaGeomPerseguido.y + (formaGeomPerseguido.height - formaGeomVaiAndar.height)/2;

      const k = porcentQrEntrar*formaGeomPerseguido.width;
      if (direcao === Direcao.Esquerda)
        x = formaGeomPerseguido.x - formaGeomVaiAndar.width + k;
      else
        x = formaGeomPerseguido.x + formaGeomPerseguido.width - k;
    }

    //return formaGeomPerseguido.centroMassa.menos(formaGeomVaiAndar.centroMassa); //assim fica muito efetivo
    return {x: x - formaGeomVaiAndar.x, y: y - formaGeomVaiAndar.y};
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    this._qtdAndarX *= porcentagem;
    this._qtdAndarY *= porcentagem;
    this._mudarHipotenusaSePrecisa();
  }
}

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
//qtdAndarX, qtdAndarY, tipoAndar, [atehQualXYPodeAndar]
{
  constructor(qtdAndarX, qtdAndarY, tipoAndar, aceleracao, atehQualXYPodeAndar)
  //eh public mesmo porque tem get e set em todos sem verificacao
  //aceleracao: valor, ehPorc
  {
    this.qtdAndarX = qtdAndarX;
    this.qtdAndarY = qtdAndarY;
    this.tipoAndar = tipoAndar;
    this.aceleracao = aceleracao;
    this.atehQualXYPodeAndar = atehQualXYPodeAndar;
  }

  clone()
  { return new InfoAndar(this.qtdAndarX, this.qtdAndarY, this.tipoAndar, (this.aceleracao===undefined?undefined:{valor: this.aceleracao.valor, ehPorcentagem: this.aceleracao.ehPorcentagem}), this.atehQualXYPodeAndar); }

  // metodos diferentes de soh armazenar informacoes
  mudarAnguloQtdAndar(angulo)
  // angulo em radianos segundo o Ciclo Trigonometrico
  {
    //Explicacao:
      //- O qtdAndarX e qtdAndarY vao mudar, porem a hipotenusa que esses dois qtdAndar formam deve continuar a mesma.
      //- Portanto, odemos construir um triangulo no Ciclo Trigonometrico com esse angulo, hipotenusaPadrao como hipotenusa e raio do circulo e qtdAndarX e qtdAndarY como respectivos cateto adjacente (sobre o eixo X) e cateto oposto (sobre o eixo Y).
      //- Entao basta resolver os valores de qtdAndarX e qtdAndarY usando Seno e Cosseno...

    const hipotenusaPadrao = Operacoes.hipotenusa(this.qtdAndarX, this.qtdAndarY);
    this.qtdAndarX = Math.cos(angulo)*hipotenusaPadrao;
    this.qtdAndarY = Math.sin(angulo)*hipotenusaPadrao;
  }
}
