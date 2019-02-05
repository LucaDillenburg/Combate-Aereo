  //probabilidade de desenhar raio
//se estah totalmente escuro
const minEscuroAtualRaio = 200; //de 255
const denominadorChanceRaio = 12;
//se estah totalmente escuro
const numeradorChanceRaioTotalEscuro = 1;
const denominadorChanceRaioTotalEscuro = 1;

  //para deixar um tempo entre cada vez que for desenhar o raio
const qtdDrawsIntervaloDesenharRaio = 9;

// EXPLICACAO DE NOMENCLATURA
  // Bloco: todas os qtdRepeticoes de escurecer-clarear
  // EscClar: uma repeticao de escurecer-clarear
class InfoEscuridao
{
  constructor(tempoEscurecendo, desvioTempoEscurec=0, tempoEscuroTotal, desvioEscuroTotal=0, intervaloEntreEscClarMsmBloco=0, intervalo, desvioIntervalo=0, qtdRepeticoes, desvioQtdRep=0, imgsRaios)
  // imgsRaios pode ser undefined
  {
    this.tempoEscurecendo = tempoEscurecendo;
    this.desvioTempoEscurec = desvioTempoEscurec;
    this.tempoEscuroTotal = tempoEscuroTotal;
    this.desvioEscuroTotal = desvioEscuroTotal;
    this.intervaloEntreEscClarMsmBloco = intervaloEntreEscClarMsmBloco;
    this.intervalo = intervalo;
    this.desvioIntervalo = desvioIntervalo;
    this.qtdRepeticoes = qtdRepeticoes;
    this.desvioQtdRep = desvioQtdRep;
    this.imgsRaios = imgsRaios;
  }
}
class Escuridao
{
  constructor(infoEscuridao)
  {
    //tempo que demora pra escurecer de 0% a 100%
    this._tempoEscurecendo = infoEscuridao.tempoEscurecendo;
    this._desvioTempoEscurec = infoEscuridao.desvioTempoEscurec;

    //tempo que fica escuro total ateh voltar a clarear
    this._tempoEscuroTotal = infoEscuridao.tempoEscuroTotal;
    this._desvioEscuroTotal = infoEscuridao.desvioEscuroTotal;

    //tempo entre cada escurecer-clarear dentro de cada bloco
    this._intervaloEntreEscClarMsmBloco = infoEscuridao.intervaloEntreEscClarMsmBloco;

    //intervalo de tempo de acabar de clarear a ultima vez ateh comecar a escurecer de novo
    this._intervalo = infoEscuridao.intervalo;
    this._desvioIntervalo = infoEscuridao.desvioIntervalo;

    //numero de repeticoes de escurecer-clarear
    this._qtdRepeticoes = infoEscuridao.qtdRepeticoes;
    this._desvioQtdRep = infoEscuridao.desvioQtdRep;

    //imagens dos raios
    if (infoEscuridao.imgsRaios===undefined)
    {
      const qtdRaios = 6;
      this._imgsRaios = [];
      for (let i = 1; i<=qtdRaios; i++)
        this._imgsRaios.push(ArmazenadorInfoObjetos.getImagem("Raios/raio"+i));
    }else
      this._imgsRaios = infoEscuridao.imgsRaios;

    this._programarComecoProxBloco();
  }

  //COMECAR ESCURECER
  _programarComecoProxBloco()
  {
    //calcular tempo do próximo escurecer
    const tempoProx = Math.randomComDesvio(this._intervalo, this._desvioIntervalo);

    //setar próximo começar a escurecer
    new Timer(() => { this._comecarBloco(); }, tempoProx);
  }
  _comecarBloco()
  {
    // setar quantas repeticoes vai ter e quantas jah foram
    this._qtdRepeticoesAtual = Math.round(Math.randomComDesvio(this._qtdRepeticoes, this._desvioQtdRep)); //ps: tem que colocar floor porque pode ter qtdRepeticoes de 2.5 e desvio de 0.5 por exemplo
    this._vezesEscurecerCompletas = 0;

    //comecar primeiro escurecer-clarear
    this._comecarEscClarAtual();
  }
  _comecarEscClarAtual()
  {
    /* tempoTotal/frameRate —— 255 (total)
                         1  —— qtdEscurecer  */
    this._qtdEscurecer = 255/(Math.randomComDesvio(this._tempoEscurecendo, this._desvioTempoEscurec)/frameRatePadrao);
    this._qtdEscuroAtual = 0;

    this._escurecendo = true; //se for false eh porque esta ficando mais claro

    this._qtdDrawsSemEscurecer = qtdDrawsIntervaloDesenharRaio;
  }

  _proximoEscClarMsmBloco()
  {
    this._vezesEscurecerCompletas++;
    if (this._vezesEscurecerCompletas === this._qtdRepeticoesAtual) // se jah acabou todas as repeticoes
      this._acabarBloco();
    else
    {
      //acabar escurecer-clarear atual
      this._acabarEscClar();

      //setar o comeco do proximo escurecer-clarear
      new Timer(() => { this._comecarEscClarAtual(); }, this._intervaloEntreEscClarMsmBloco);
    }
  }

  //ACABAR
  _acabarEscClar()
  {
    //dar delete em tudo o que foi estado em this._comecarEscClarAtual()
    delete this._qtdEscurecer;
    delete this._qtdEscuroAtual;
    delete this._escurecendo;
    delete this._qtdDrawsSemEscurecer;
  }
  _acabarBloco()
  {
    //dar delete em tudo o que foi estado em this._comecarEscClarAtual()
    this._acabarEscClar();

    //dar delete em tudo o que foi estado em this._comecarBloco()
    delete this._vezesEscurecerCompletas;
    delete this._qtdRepeticoesAtual;

    //programar o proximo bloco
    this._programarComecoProxBloco();
  }

  draw()
  {
    if (this._qtdEscuroAtual !== undefined)
    // se nao estah dentro de nenhum bloco
    {
      //MUDAR this._qtdEscuroAtual
      if (this._escurecendo !== 0)
      // se for pra continuar preto, this._escurecendo vai ser zero e entao nao precisa aumentar this._qtdEscuroAtual (jah tá no máximo)
      {
        //mudar qtdEscuroAtual
        if (this._escurecendo)
          this._qtdEscuroAtual = Math.min(this._qtdEscuroAtual + this._qtdEscurecer, 255); //maximo eh 255
        else
          this._qtdEscuroAtual = Math.max(this._qtdEscuroAtual - this._qtdEscurecer, 0); //minimo eh 0
      }

      //DESENHAR
      //background preto
      background(color(0,0,0, this._qtdEscuroAtual)); //this._qtdEscuroAtual eh a opacidade (de 0 a 255)
      //raio
      if (this._imgsRaios.length > 0 && //se tem alguma imagem de raio
        this._qtdDrawsSemEscurecer >= qtdDrawsIntervaloDesenharRaio && //para dar um intervalo entre cada raio
        //chance:
        ((this._qtdEscuroAtual >= minEscuroAtualRaio && Probabilidade.chance(1, denominadorChanceRaio))
        || (this._qtdEscuroAtual >= 255/*maximo*/ && Probabilidade.chance(numeradorChanceRaioTotalEscuro, denominadorChanceRaioTotalEscuro))))
      {
        const img = this._imgsRaios[Math.myrandom(0, this._imgsRaios.length)];

        //medidas
        const porcHeightMin = 0.7;
        const heightCeu = height - heightVidaUsuario;
        const heightImg = Math.myrandom(heightCeu*porcHeightMin, heightCeu);
        const widthImg = img.width * heightImg / img.height;
        //(x,y)
        const x = Math.myrandom(0, width-widthImg);
        const y = Math.myrandom(0, heightCeu-heightImg);
        image(img, x, y, widthImg, heightImg);

        //recomeca a contagem (para dar intervalo entre os raios)
        this._qtdDrawsSemEscurecer = 0;
      }else
        this._qtdDrawsSemEscurecer++;

      // VERIFICAR SE VAI COMECAR A CLAREAR DE NOVO OU VAI ESPERAR UM TEMPO PRETO
      if (this._qtdEscuroAtual === 255 && this._escurecendo !== 0)
      // precisa ficar certo tempo começar a clarear
      {
          //setar this._escurecendo para nao mudar this._qtdEscuroAtual
          this._escurecendo = 0; //quando escurecendo for zero significa que nao eh pra mudar this._qtdEscuroAtual

          //programar para comecar a clarear
          const tempoComecarClar = Math.randomComDesvio(this._tempoEscuroTotal, this._desvioEscuroTotal);
          new Timer(() => { this._escurecendo = false; }, tempoComecarClar);
      }
      else
      if (this._qtdEscuroAtual === 0)
      // jah acabou de clarear, entao vai comecar a escurecer de novo ou acaba o bloco
        this._proximoEscClarMsmBloco();
    }
  }
}
