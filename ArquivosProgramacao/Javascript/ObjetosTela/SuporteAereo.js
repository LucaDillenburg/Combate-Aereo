//SUPORTE AEREO (do inimigo)
class InfoSuporteAereo extends InfoObjetoComArmas
{
  constructor(formaGeometrica, infoImgVivo, infoImgMorto, infoArmas, qtdTiraVidaNaoConsegueEmpurrarPers, qtdHelices, qtdsRotateDifHelices)
  {
    super(formaGeometrica, infoImgVivo, infoImgMorto, infoArmas, qtdHelices, qtdsRotateDifHelices);
    this.qtdTiraVidaNaoConsegueEmpurrarPers = qtdTiraVidaNaoConsegueEmpurrarPers;
  }

  clone()
  { return new InfoSuporteAereo(this.formaGeometrica, this.infoImgVivo.clone(), this.infoImgMorto.clone(), cloneVetorComClone(this.infoArmas), this.qtdTiraVidaNaoConsegueEmpurrarPers, this.qtdHelices, cloneVetor(this.qtdsRotateDifHelices)); }
}
class SuporteAereo extends ObjetoComArmas
{
  constructor(pontoInicial, infoSuporteAereo)
  {
    super(pontoInicial, infoSuporteAereo);
    this._qtdTiraVidaNaoConsegueEmpurrarPers = infoSuporteAereo.qtdTiraVidaNaoConsegueEmpurrarPers;
  }

  procCriou()
  {
    //colisao com personagem
    const conseguiuEmpurrarSePrec = AuxObjetos.procColisaoEstaticaObstComPers(this);
    if (!conseguiuEmpurrarSePrec)
    {
      this.morreu();
      ControladorJogo.pers.mudarVida(-this._qtdTiraVidaNaoConsegueEmpurrarPers);
    }

    //colisao com tiros do pers
    ControladorJogo.pers.procObjCriadoColideTiros(this);
    //colisao com tiros dos inimigos (nao tira vida)
    ControladorJogo.controladoresInimigos.forEach(controladorInims =>
      controladorInims.procObjCriadoColidirTirosInims(this));
    //colisao com tiros sem dono (nao tira vida)
    ControladorJogo.controladorOutrosTirosNaoPers.procObjCriadoColideTiros(this, false);
  }

  qtdPersPodeAndar(infoQtdMudar)
  { AuxObjetos.qtdPersPodeAndar(this, infoQtdMudar); }
}


//CONTROLADOR SUPORTE AEREO
class ControladorSuportesAereos
{
  constructor(infoObjAparecendoPadrao, infoSuporteAereoPadrao)
  {
    //SuportesAereos que jah interagem com o meio
    this._suportesAereos = [];
    //SuportesAereos que estao surgindo
    this._suportesAereosSurgindo = [];

    //infos padroes (para adicionar)
    this._infoObjAparecendoPadrao = infoObjAparecendoPadrao;
    this._infoSuporteAereoPadrao = infoSuporteAereoPadrao;
  }

  get suportesAereos()
  { return this._suportesAereos; }
  zerarSuportesAereos()
  {
    this._suportesAereos = [];
    this._suportesAereosSurgindo = [];
  }

  //adicionar
  adicionarSuporteAereo(pontoInicial, alteracoesRotacionar)
  {
    let infoSuporteAereo = this._infoSuporteAereoPadrao.clone();
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoSuporteAereo, alteracoesRotacionar); //para rotacionar

    //mesclar InfoObjAparecendo com InfoObjAparecendoPadrao
    let infoObjAparecendo = this._infoObjAparecendoPadrao.clone();
    //atributos que o controlador coloca (formaGeometrica, qtdHelices e qtdsRotateDifHelices):
    infoObjAparecendo.formaGeometrica = infoSuporteAereo.formaGeometrica;
    infoObjAparecendo.infoImgVivo = infoSuporteAereo.infoImgVivo;
    infoObjAparecendo.qtdHelices = infoSuporteAereo.qtdHelices;
    infoObjAparecendo.qtdsRotateDifHelices = infoSuporteAereo.qtdsRotateDifHelices;


    //fazer ele ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
    this._suportesAereosSurgindo.unshift(new ObjetoTelaAparecendo(pontoInicial, infoObjAparecendo, TipoObjetos.SuporteAereo, (formaGeomApareceu, indexInicialImgVivo) => //(funcao callback)
      {
        //remover esse suporteAereo surgindo (o primeiro a ser adicionado sempre vai ser o primeiro a ser retirado pois o tempo que ele vai ficar eh sempre igual ao dos outros que estao la)
        this._suportesAereosSurgindo.pop();

        //adicionar SuporteAereo que interage com o meio
        infoSuporteAereo.formaGeometrica = formaGeomApareceu; //usa a mesma forma porque a formaGeometrica em infoSuporteAereo pode nao estar com a mesma rotacao das helices por exemplo
        infoSuporteAereo.infoImgVivo.indexInicial = indexInicialImgVivo; //para que o index da imagem vivo seja o mesmo (ideia de continuidade e nao quebra)
        const novoSuporteAereo = new SuporteAereo(pontoInicial, infoSuporteAereo);
        novoSuporteAereo.procCriou();

        if (ControladorJogo.pers.controladorPocoesPegou.codPocaoSendoUsado === TipoPocao.DeixarTempoMaisLento)
        // PARTE DA EXECUCAO DA POCAO (deixar tempo mais lento do inimigo que for adicionar)
          novoSuporteAereo.mudarTempoSemTiros(porcentagemDeixarTempoLento); //ainda nao tem nenhum tiro

        //adicionar novo inimigo no final
    		this._suportesAereos.push(novoSuporteAereo);
      }));
  }

  //draw
  draw()
  { this._suportesAereos.forEach(suporteAereo => suporteAereo.draw()); }
  drawSurgindo()
  { this._suportesAereosSurgindo.forEach(suporteAereoSurgindo => suporteAereoSurgindo.draw()); }

  mudarTempo(porcentagem)
  {
    //suportes aereos surgindo
    this._suportesAereosSurgindo.forEach(suporteAereoSurgindo => suporteAereoSurgindo.mudarTempo(porcentagem));

    //suportes aereos que jah interagem com o meio
    this._suportesAereos.forEach(suporteAereo => suporteAereo.mudarTempo(porcentagem));
    //ps: todos os suportesAereos (inclusive os mortos) devem fazer o procedimento pois os inimigos mortos tambem tem tiros que tambem precisam mudarTempo
  }
}
