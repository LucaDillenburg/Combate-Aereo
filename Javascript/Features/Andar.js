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

    if (infoAndar.atehQualXYPodeAndar != null)
    //soh precisa se for INVERTER_..._NAO_PASSAR_XY
      this.atehQualXYPodeAndar = infoAndar.atehQualXYPodeAndar; //public
  }

  get qtdAndarX() { return this._qtdAndarX; }
  get qtdAndarY() { return this._qtdAndarY; }
  get tipoAndar() { return this._tipoAndar; }

  //setters
  set qtdAndarX(qtdAndarX)
  {
    this._qtdAndarX = qtdAndarX;
    this._colocarHipotenusaSePrecisa();
  }
  set qtdAndarY(qtdAndarY)
  {
    this._qtdAndarY = qtdAndarY;
    this._colocarHipotenusaSePrecisa();
  }
  setTipoAndar(tipo, formaGeom)
  //formaGeom eh de quem vai andar
  {
    this._tipoAndar = null;

    //se tipo eh para seguir inimigo mais proximo, tem que procurar inimigo mais proximo
    if (tipo == TipoAndar.SeguirInimMaisProx)
    {
      // se for pra um tiro seguir um inimigo sempre, seguir um dos mais importantes soh
      let praOndeAndar = null;
      if (ConjuntoObjetosTela.controladoresInimigos.length > 0) // se tem algum controlador
        praOndeAndar = ConjuntoObjetosTela.controladoresInimigos[0].qntAndarInimigoMaisProximo(formaGeom);
      if (praOndeAndar == null || praOndeAndar.inim == null)
        this._tipoAndar = TipoAndar.Normal;
      else
      {
        this._inimSeguir = praOndeAndar.inim;
        this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
      }
    }else
    if (tipo == TipoAndar.SeguirPers)
      this._ultimoQtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};
    else
    {
      if (this._ultimoQtdAndar != null)
        this._ultimoQtdAndar = null;
      if (this._hipotenusaPadrao != null)
        this._hipotenusaPadrao = null;

      if (tipo == TipoAndar.DirecaoPers)
        this._setarQtdAndarTipoDIRECAO(formaGeom, ConjuntoObjetosTela.pers);
      else
      if (tipo == TipoAndar.DirecaoInimMaisProx)
      {
        //descobrir qual inimigo estah mais perto para seguir
        let praOndeAndar = null;
        let menorHipotenusa = null;
        for (let i=0; i<ConjuntoObjetosTela.controladoresInimigos.length; i++)
        {
          let praOndeAndarAtual = ConjuntoObjetosTela.controladoresInimigos[i].qntAndarInimigoMaisProximo(formaGeom);

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

        if (praOndeAndar != null && praOndeAndar.inim != null)
          this._setarQtdAndarTipoDIRECAO(formaGeom, praOndeAndar.inim);
      }
    }

    if (this._tipoAndar == null) this._tipoAndar = tipo;
    this._colocarHipotenusaSePrecisa();
  }
  _setarQtdAndarTipoDIRECAO(formaGeomVaiAndar, objSeguir)
  //objSeguir eh ObjetoTela
  {
    //tem que colocar hipotenusa padrao porque this._qtdAndarSeguir vai usar
    this._colocarHipotenusaPadrao();

    //ve o qtdAndar
    let qtdAndar = this._qtdAndarSeguir(formaGeomVaiAndar, objSeguir);
    this._qtdAndarX = qtdAndar.x;
    this._qtdAndarY = qtdAndar.y;

    //vai andar sempre isso
    this.setTipoAndar(TipoAndar.Normal, formaGeomVaiAndar); //tira hipotenusaPadrao
  }

  procAndar(formaGeom)
  {
    if ((this._tipoAndar == TipoAndar.SeguirInimMaisProx && (this._inimSeguir == null || !this._inimSeguir.vivo)) ||
      (this._tipoAndar == TipoAndar.SeguirPers && !ConjuntoObjetosTela.pers.vivo))
    {
      this.mudarQtdAndarParaUltimoAndar();
      this.setTipoAndar(TipoAndar.Normal);
    }

    //objSeguir para this._qtdAndarFromTipo(...)
    let objSeguir;
    if (this._tipoAndar == TipoAndar.SeguirPers)
      objSeguir = ConjuntoObjetosTela.pers;
    else
    if (this._tipoAndar == TipoAndar.SeguirInimMaisProx)
      objSeguir = this._inimSeguir;

    let qtdAndar = this._qtdAndarFromTipo(formaGeom, objSeguir);
    //jah faz procedimentos de inverter qtdAndar(se precisar) e adicionar qtdAndar no ultimoQtdAndar

    return qtdAndar;
  }
  mudarQtdAndarParaUltimoAndar()
  {
    this.qtdAndarX = this._ultimoQtdAndar.x;
    this.qtdAndarY = this._ultimoQtdAndar.y;
  }

  _colocarHipotenusaSePrecisa()
  {
    if (this._tipoTemHipotenusaPadrao())
      this._colocarHipotenusaPadrao();
  }
  _tipoTemHipotenusaPadrao()
  { return this._tipoAndar == TipoAndar.SeguirPers || this._tipoAndar == TipoAndar.SeguirInimMaisProx; }
  _colocarHipotenusaPadrao()
  { this._hipotenusaPadrao = Operacoes.hipotenusa(this._qtdAndarX, this._qtdAndarY); }

  //metodos auxiliares
  _qtdAndarFromTipo(formaGeomVaiAndar, objPerseguido, fazerProcsInvUlt)
  //jah faz procedimentos de inverter qtdAndar e adicionar qtdAndar no ultimoQtdAndar
  //objPerseguido eh ObjetoTela
  //retorna {x, y}
  {
    let qtdAndar = {x: this._qtdAndarX, y: this._qtdAndarY};

    let inverter; // comum ao 2o e 3o case
    switch(this._tipoAndar)
    {
      case TipoAndar.Normal:
        break;
      case TipoAndar.NaoPassarXYNemSairTelaInvTudo: //tambem nao pode sair da tela
      case TipoAndar.NaoPassarXYNemSairTelaInvDir: //tambem nao pode sair da tela
      case TipoAndar.NaoSairTelaInvTudo:
      case TipoAndar.NaoSairTelaInvDir:
        let inverteApenasDirecao = (this._tipoAndar == TipoAndar.NaoSairTelaInvDir ||
          this._tipoAndar == TipoAndar.NaoPassarXYNemSairTelaInvDir);

        let vaiSairX = Tela.objVaiSairEmX(formaGeomVaiAndar, this._qtdAndarX);
        let vaiSairY = Tela.objVaiSairEmY(formaGeomVaiAndar, this._qtdAndarY);

        inverter = {x: false, y: false};

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

        if (this._tipoAndar == TipoAndar.NaoSairTelaInvTudo ||
          this._tipoAndar == TipoAndar.NaoSairTelaInvDir)
          break; //se for INVERTER_..._NAO_SAIR_TELA, jah fez tudo

      case TipoAndar.NaoPassarXYPodeSairTelaInvTudo:
      case TipoAndar.NaoPassarXYPodeSairTelaInvDir:
      // os outros tipos andar de "nao passar XY" jah entraram no bloco anterior e se nao inverteram os dois lados continuam nesse bloco
        if (inverter == null)
          inverter = {x: false, y: false};
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
    if (inverter != null)
      this.inverterDirecoesQtdAndar(inverter.x, inverter.y);

    return qtdAndar;
  }
  _mudarDadosTipoNaoPassarXY(qtdAndar, inverter, formaGeometrica)
  //funciona por passagem por referencia
  {
    let inverteApenasDirecao = (this._tipoAndar == TipoAndar.NaoPassarXYNemSairTelaInvDir ||
      this._tipoAndar == TipoAndar.NaoPassarXYPodeSairTelaInvDir);

    //se vai passar de X (de qual lado para o outro que seja)
    if (!inverter.x && (this._qtdAndarX != 0 || !inverteApenasDirecao) && this.atehQualXYPodeAndar.x != null)
    //se ainda nao inverteu em X e quer andar alguma coisa
    {
      let inicio;
      if (this._qtdAndarX >= 0)
        inicio = formaGeometrica.x;
      else
        inicio = formaGeometrica.x + this._qtdAndarX;
      let distancia = Math.abs(this._qtdAndarX) + formaGeometrica.width;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(this.atehQualXYPodeAndar.x, inicio, distancia))
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
    if (!inverter.y && (this._qtdAndarY != 0 || !inverteApenasDirecao) && this.atehQualXYPodeAndar.y != null)
    //se ainda nao inverteu em Y e quer andar alguma coisa
    {
      let inicio;
      if (this._qtdAndarY >= 0)
        inicio = formaGeometrica.y;
      else
        inicio = formaGeometrica.y + this._qtdAndarY;
      let distancia = Math.abs(this._qtdAndarY) + formaGeometrica.height;

      if (Interseccao.xOuYDePontoEstahDentroDirecao(this.atehQualXYPodeAndar.y, inicio, distancia))
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
  _qtdAndarSeguir(formaGeomVaiAndar, objPerseguido)
  {
    //calcular quanto teria que andar em cada direcao para chegar ao objeto
    let qntQrAndar = ClasseAndar.qntAndarParaBater(formaGeomVaiAndar, objPerseguido.formaGeometrica);

    //calcular quanto andar em cada direcao para andar sempre o mesmo que o padrao
    let k = this._hipotenusaPadrao/Operacoes.hipotenusa(qntQrAndar.x, qntQrAndar.y);

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
    let direcao = Direcao.emQualDirecaoObjEsta(formaGeomPerseguido, formaGeomVaiAndar);

    let x,y;
    if (direcao == Direcao.Cima || direcao == Direcao.Baixo)
    {
      x = formaGeomPerseguido.x + (formaGeomPerseguido.width - formaGeomVaiAndar.width)/2;
      let k = porcentQrEntrar*formaGeomPerseguido.height;

      if (direcao == Direcao.Cima)
        y = formaGeomPerseguido.y - formaGeomVaiAndar.height + k;
      else
        y = formaGeomPerseguido.y + formaGeomPerseguido.height - k;
    }else
    //if (direcao == Direcao.Esquerda || direcao == Direcao.Direita)
    {
      y = formaGeomPerseguido.y + (formaGeomPerseguido.height - formaGeomVaiAndar.height)/2;
      let k = porcentQrEntrar*formaGeomPerseguido.width;

      if (direcao == Direcao.Esquerda)
        x = formaGeomPerseguido.x - formaGeomVaiAndar.width + k;
      else
        x = formaGeomPerseguido.x + formaGeomPerseguido.width - k;
    }

    //return formaGeomPerseguido.centroMassa.menos(formaGeomVaiAndar.centroMassa); //assim fica muito efetivo
    return {x: x - formaGeomVaiAndar.x, y: y - formaGeomVaiAndar.y};
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
  constructor(qtdAndarX, qtdAndarY, tipoAndar, atehQualXYPodeAndar)
  //eh public mesmo porque tem get e set em todos sem verificacao
  {
    this.qtdAndarX = qtdAndarX;
    this.qtdAndarY = qtdAndarY;
    this.tipoAndar = tipoAndar;
    this.atehQualXYPodeAndar = atehQualXYPodeAndar;
  }

  clone()
  { return new InfoAndar(this.qtdAndarX, this.qtdAndarY, this.tipoAndar, this.atehQualXYPodeAndar); }
}
