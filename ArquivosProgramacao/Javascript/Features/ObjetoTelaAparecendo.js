// visual: fazer inimigos e obstaculos irem aparecendo aos poucos e ficando menos transparentes
const tempoObjetoAparecerAntesIniciarLv = 3500;
//inimigo
const tempoInimAparecerDuranteLv = 750;
//obstaculo
const tempoObstAparecerDuranteLv = 120;
//pocao
const tempoPocaoAparecerDuranteLv = 120;
class InfoObjetoTelaAparecendo extends InfoObjetoTelaSimples
{
  constructor(mudarOpacidade, mudarTamanho, qtdAndar, formaGeometrica)
  //formaGeometrica: soh os controladores colocam a formaGeometrica
  {
    super(formaGeometrica);
    this.mudarOpacidade = mudarOpacidade;
    this.mudarTamanho = mudarTamanho;
    this.qtdAndar = qtdAndar; //se for nulo nao vai andar
  }
}
class ObjetoTelaAparecendo extends ObjetoTelaSimples
{
  constructor(pontoInicial, infoObjAparecendo, callback)
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
      if (infoObjAparecendo instanceof InfoObstaculo)
        tempoObjetosAparec = tempoObstAparecerDuranteLv;
      else
      if (infoObjAparecendo instanceof InfoInimigo)
        tempoObjetosAparec = tempoInimAparecerDuranteLv;
      else
        tempoObjetosAparec = tempoPocaoAparecerDuranteLv; //pocao tem que ser o ultimo pois nao tem um InfoPocao
    }

    //setar variaveis vitais...
    const numVezes = tempoObjetosAparec*frameRatePadrao/1000;

    //porcentagem
    this._cadaPorcentagem = 1/numVezes;
    this._porcentagemAtual = 0;

    //andar
    //se nao tem um valor, vai ficar parado
    if (infoObjAparecendo.qtdAndar !== undefined)
    {
      //armazenar quanto tem que andar antes de cada draw
      this._cadaQtdAndar = infoObjAparecendo.qtdAndar.dividido(-(numVezes-1));
      //ps: uma vez a menos para andar mais em cada qtdAndar porque vai printar uma vez estando no ponto original (sem somar) diferente da opacidade que nao vai comecar em zero
      //ps2: negativo pois o qtdAndar eh o caminho contrario (do final para o comeco)

      //colocar na posicao inicial (antes de andar aquilo)
      this._formaGeometrica.x += infoObjAparecendo.qtdAndar.x;
      this._formaGeometrica.y += infoObjAparecendo.qtdAndar.y;
    }

    //opacidade e tamanho objeto
    this._mudarOpacidade = infoObjAparecendo.mudarOpacidade;
    this._mudarTamanho = infoObjAparecendo.mudarTamanho;

    if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
    // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do novo objeto aparecendo)
      this.mudarTempo(porcentagemDeixarTempoLento);

    //callback
    new Timer(callback, tempoObjetosAparec); //isso resolve os problemas com o escopo dessa funcao
  }

  draw()
  {
    if (this._porcentagemAtual < 1)
    {
      const primeiraVez = this._porcentagemAtual===0;

      // se eh primeira vez printa na posicao que estava
      // se this._cadaQtdAndar eh undefined, simplesmente deixa onde estah
      if (!primeiraVez && this._cadaQtdAndar!==undefined)
      {
        //andar
        this._formaGeometrica.x += this._cadaQtdAndar.x;
        this._formaGeometrica.y += this._cadaQtdAndar.y;
      }

      //deixa forma geometrica maior e aumenta a porcentagemAtual
      this._porcentagemAtual += this._cadaPorcentagem;
      if (this._mudarTamanho)
        this._mudarTamanhoFormaGeom(primeiraVez); //tamanho

      //obs: nao se pode chamar a funcao aqui por problemas com o escopo
    }else
    {
      console.log(ConjuntoTimers._timers);
      console.log("%cfez uma vez a mais", "color: red");
      console.trace();
      ControladorJogo._pausarJogo();
    }

    //desenha
    if (this._mudarOpacidade)
      this._formaGeometrica.draw(this._porcentagemAtual); //opacidade
    else
      this._formaGeometrica.draw();
  }
  _mudarTamanhoFormaGeom(primeiraVez)
  {
    if (primeiraVez)
      this._formaGeometrica.mudarTamanho(this._porcentagemAtual)
    else
    {
      // se nao for primeira vez:
      // 100% --- porcentagemAtual - cadaPorcentagem
      //   x  --- porcentagemAtual
      // .: x = 100*porcentagemAtual/(porcentagemAtual - cadaPorcentagem) %
      const porcentagemAumentar = this._porcentagemAtual/(this._porcentagemAtual - this._cadaPorcentagem);
      this._formaGeometrica.mudarTamanho(porcentagemAumentar);
    }
  }

  //POCAO
  mudarTempo(porcentagem)
  {
    //opacidade e tamanho
    this._cadaPorcentagem *= porcentagem;

    //velocidade/movimentacao
    if (this._cadaQtdAndar!==undefined)
      this._cadaQtdAndar = this._cadaQtdAndar.multiplicado(porcentagem);
  }
}
