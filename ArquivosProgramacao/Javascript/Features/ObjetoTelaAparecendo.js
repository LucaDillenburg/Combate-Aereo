// visual: fazer inimigos e obstaculos irem aparecendo aos poucos e ficando menos transparentes
const tempoObjetoAparecerAntesIniciarLv = 3500;
//inimigo
const tempoInimAparecerDuranteLv = 750;
//obstaculo
const tempoObstAparecerDuranteLv = 120;
//suporte aereo
const tempoSuporteAereoAparecerDuranteLv = 600;
//pocao
const tempoPocaoAparecerDuranteLv = 120;
class InfoObjetoTelaAparecendo extends InfoObjetoTelaSimples
{
  constructor(mudarOpacidade, mudarTamanho, qtdAndar, formaGeometrica, qtdHelices=0, qtdsRotateDifHelices)
  // qtdAndar: se for undefined nao vai andar
  // formaGeometrica, qtdHelices, qtdsRotateDifHelices: soh os controladores colocam a formaGeometrica
  {
    //atributos que o controlador coloca
    super(formaGeometrica);
    this.qtdHelices = qtdHelices;
    this.qtdsRotateDifHelices = qtdsRotateDifHelices;

    //outros atributos
    this.mudarOpacidade = mudarOpacidade;
    this.mudarTamanho = mudarTamanho;
    this.qtdAndar = qtdAndar;
  }

  clone()
  { return new InfoObjetoTelaAparecendo(this.mudarOpacidade, this.mudarTamanho, cloneDicionario(this.qtdAndar), (this.formaGeometrica===undefined)?undefined:this.formaGeometrica.clone(), this.qtdHelices, cloneVetor(this.qtdsRotateDifHelices)); }
}
class ObjetoTelaAparecendo extends ObjetoTelaSimples
{
  constructor(pontoInicial, infoObjAparecendo, tipoObjeto, callback)
  {
    super(pontoInicial, infoObjAparecendo);

    //pegar tempo objeto vai ficar aparecendo
    let tempoObjetosAparec;
    if (ControladorJogo.criandoLevel)
    // se estah criando o level (nao estah no meio do level)
      tempoObjetosAparec = tempoObjetoAparecerAntesIniciarLv;
    else
    {
      //pode ser inimigo, obstaculo, tiro ou pocao
      if (tipoObjeto === TipoObjetos.Obstaculo)
        tempoObjetosAparec = tempoObstAparecerDuranteLv;
      else
      if (tipoObjeto === TipoObjetos.Inimigo)
        tempoObjetosAparec = tempoInimAparecerDuranteLv;
      else
      if (tipoObjeto === TipoObjetos.SuporteAereo)
        tempoObjetosAparec = tempoSuporteAereoAparecerDuranteLv;
      else
      //pocao
        tempoObjetosAparec = tempoPocaoAparecerDuranteLv;
    }

    //callback
    const tmr = new Timer(() => callback(this._formaGeometrica), tempoObjetosAparec);
    //isso resolve os problemas com o escopo da funcao callback

    //setar variaveis vitais...
    this._qtdVezesTotal = tmr.freq-1;
    this._qtdVezesCompletas = 0;
    this._qtdSomarCadaVez = 1; //vai ser um a nao ser que mudar o tempo

    //andar
    //se nao tem um valor, vai ficar parado
    if (infoObjAparecendo.qtdAndar !== undefined)
    {
      //colocar na posicao inicial (antes de andar aquilo)
      this._formaGeometrica.x += infoObjAparecendo.qtdAndar.x;
      this._formaGeometrica.y += infoObjAparecendo.qtdAndar.y;

      //armazenar quanto tem que andar antes de cada draw
      this._cadaQtdAndar = infoObjAparecendo.qtdAndar.dividido(-(this._qtdVezesTotal-1));
      //ps: uma vez a menos para andar mais em cada qtdAndar porque vai printar uma vez estando no ponto original (sem somar) diferente da opacidade que nao vai comecar em zero
      //ps2: negativo pois o qtdAndar eh o caminho contrario (do final para o comeco)
    }

    //opacidade e tamanho objeto
    this._mudarOpacidade = infoObjAparecendo.mudarOpacidade;
    this._mudarTamanho = infoObjAparecendo.mudarTamanho;

    if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do novo objeto aparecendo)
      this.mudarTempo(porcentagemDeixarTempoLento);

    //para helicoptero
    if (infoObjAparecendo.qtdHelices > 0)
      this._helices = new Helices(infoObjAparecendo.qtdHelices, infoObjAparecendo.qtdsRotateDifHelices);
  }

  draw()
  {
    //mudar tamanho, opacidade e andar
    if (this._qtdVezesCompletas < this._qtdVezesTotal)
    {
      const primeiraVez = this._qtdVezesCompletas===0;

      // se eh primeira vez printa na posicao que estava
      // se this._cadaQtdAndar eh undefined, simplesmente deixa onde estah
      if (!primeiraVez && this._cadaQtdAndar!==undefined)
      {
        //andar
        this._formaGeometrica.x += this._cadaQtdAndar.x;
        this._formaGeometrica.y += this._cadaQtdAndar.y;
      }

      //deixa forma geometrica maior
      if (this._mudarTamanho)
        this._mudarTamanhoFormaGeom(primeiraVez); //tamanho

      this._qtdVezesCompletas += this._qtdSomarCadaVez; //para funcionar quando mudarTempo
      //obs: nao se pode chamar a funcao aqui por problemas com o escopo
    }else
    {
      this._qtdVezesCompletas = this._qtdVezesTotal; //100% opacidade
      console.warn("%cObjetoTelaAparecendo desenhou uma vez a mais", "color: red");
      //console.trace();
    }

    //para helicoptero
    if (this._helices !== undefined)
      this._helices.girar(this._formaGeometrica);

    //desenha
    if (this._mudarOpacidade)
      this._formaGeometrica.draw(this._qtdVezesCompletas/this._qtdVezesTotal); //opacidade
    else
      this._formaGeometrica.draw();
  }
  _mudarTamanhoFormaGeom(primeiraVez)
  {
    if (primeiraVez) //muda tamanho e seta this._qtdAumentarWidth
    {
      const porcentagemDiminuir = 1/this._qtdVezesTotal;
      const widthGrande = this._formaGeometrica.width;

      //mudar tamanho propriamente dito
      this._formaGeometrica.mudarTamanho(porcentagemDiminuir);

      const widthPequeno = this._formaGeometrica.width;
      this._qtdAumentarWidth = (widthGrande-widthPequeno)/(this._qtdVezesTotal-1/*menos 1, porque uma vez jah foi agora*/);
      //para mudarTempo funcionar mesmo se for chamado antes do primeiro draw:
      if (this._porcMudarTempo!==undefined)
      {
        this._qtdAumentarWidth *= this._porcMudarTempo;
        delete this._porcMudarTempo;
      }
    }
    else
    {
      // se nao for primeira vez:
      // 100% --- width
      //   x  --- qtdAumentarWidth
      // .: x = qtdAumentarWidth/width
      this._formaGeometrica.mudarTamanho(1 + this._qtdAumentarWidth/this._formaGeometrica.width);
    }
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    //opacidade e contagem de quantas vezes fazer todos os procedimentos solicitados
    this._qtdSomarCadaVez *= porcentagem;

    //tamanho
    if (this._mudarTamanho)
    {
      if (this._qtdAumentarWidth===undefined)
      //se ainda nao executou o primeiro draw (que define qtdAumentarWidth)
      {
        if (this._porcMudarTempo===undefined)
          this._porcMudarTempo = 1;
        this._porcMudarTempo *= porcentagem;
      }
      else
        this._qtdAumentarWidth *= porcentagem;
    }

    //velocidade/movimentacao
    if (this._cadaQtdAndar!==undefined)
      this._cadaQtdAndar = this._cadaQtdAndar.multiplicado(porcentagem);

    //para helicoptero
    if (this._helices!==undefined)
      this._helices.mudarTempo(porcentagem);
  }
}
