/* INFORMACOES DE PERSONAGEM, INIMIGOS E OBSTACULOS */
class ArmazenadorInfoObjetos
{
 //PERSONAGEM PRINCIPAL
  static get infoAviaoOriginalPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 80;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.145*tamanho, 1*tamanho, 0.25*tamanho),
        new Retangulo(0.4125*tamanho,0*tamanho, 0.185*tamanho, 0.795*tamanho),
        new Quadrilatero(new Ponto(0.255, 0.76).multiplicado(tamanho), new Ponto(0.435, 0.555).multiplicado(tamanho), new Ponto(0.5625, 0.545).multiplicado(tamanho), new Ponto(0.735, 0.755).multiplicado(tamanho)),
      ],
      ArmazenadorInfoObjetos.getImagem("AviaoOriginalPers"));
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoPersonagemPrincipal.vida = vida(1);
    infoPersonagemPrincipal.qtdAndar = velocidade(1);

    // atirar do pers
    let infoArma = new InfoArma();
    infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", true);
    infoArma.freqAtirar = 4;
    infoArma.direcaoSairTiro = Direcao.Cima;
    infoArma.porcPraDentroObj = 0;
    infoArma.ehTiroDuplo = false;

    infoPersonagemPrincipal.infoArmas = [infoArma];

    return infoPersonagemPrincipal;
  }
  static get infoAviaoBrutoPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 120;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.2838235294117647*tamanho, 1*tamanho, 0.13970588235294118*tamanho),
        new Retangulo(0.4323529411764706*tamanho,0*tamanho, 0.1338235294117647*tamanho, 0.7655502392344498*tamanho),
        new Retangulo(0.2838235294117647*tamanho,0.625*tamanho, 0.4323529411764706*tamanho, 0.11323529411764706*tamanho),
        new Retangulo(0.27941176470588236*tamanho,0.15294117647058825*tamanho, 0.4441176470588235*tamanho, 0.32941176470588235*tamanho),
      ],
      ArmazenadorInfoObjetos.getImagem("AviaoBrutoPers"));
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoPersonagemPrincipal.vida = vida(1.5);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.25);

    // atirar do pers
    let infoArma = new InfoArma();
    infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", true);
    infoArma.freqAtirar = 4;
    infoArma.direcaoSairTiro = Direcao.Cima;
    infoArma.porcPraDentroObj = 0.214;
    infoArma.ehTiroDuplo = true;
    infoArma.porcTiroCentro = 0.1655;

    infoPersonagemPrincipal.infoArmas = [infoArma];

    return infoPersonagemPrincipal;
  }
  static get infoAviaoMasterPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 55;
    const porcentagemImagem = 1;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.7623762376237624*tamanho, 1*tamanho, 0.557920792079208*tamanho),
        new Retangulo(0.36039603960396044*tamanho,0*tamanho, 0.27722772277227725*tamanho, 1.5282178217821782*tamanho),
        new Retangulo(0.2599009900990099*tamanho,1.5282178217821782*tamanho, 0.46782178217821785*tamanho, 0.20445544554455447*tamanho),
      ],
      ArmazenadorInfoObjetos.getImagem("AviaoMasterPers"), porcentagemImagem);
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoPersonagemPrincipal.vida = vida(3);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.65);

    // atirar do pers:

    //tiros dos lados (nao automatico)
    //infoTiroPadrao, freqAtirar, indexArmaGiratoria=-1, direcaoSairTiro, porcPraDentroObj=0, ehTiroDuplo=false, porcTiroCentro, atirarDireto=true
    let infoArmasLateral = new InfoArma();
    infoArmasLateral.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMissil", true, TipoAndar.SeguirInimMaisProx);
    infoArmasLateral.direcaoSairTiro = Direcao.Cima;
    infoArmasLateral.porcPraDentroObj = 0.214;
    infoArmasLateral.ehTiroDuplo = true;
    infoArmasLateral.porcTiroCentro = 0.1655;
    // soh vai atirar se quando o usuario apertar o gatilho e a frequencia estiver correta e se ha algum inimigo vivo na tela
    infoArmasLateral.freqAtirar = 60;
    infoArmasLateral.atirarDireto = false;
    infoArmasLateral.funcaoCondicaoAtirar = () =>
        ControladorJogo.controladoresInimigos.some(controladorInims => controladorInims.algumInimVivo());

    //arma giratoria
    const indexArmaGiratoria = 0;
    //adicionar armaGiratoria
    infoPersonagemPrincipal.formaGeometrica.adicionarImagemSecundaria("armaGiratoria"+indexArmaGiratoria,
      ArmazenadorInfoObjetos.getImagem("ArmaGiratoria"), 0.85, new Ponto(0.5, 0.7));
    //infoConfigArmaGiratoria
    let infoArmaGiratoria = new InfoArma();
    infoArmaGiratoria.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", true);
    infoArmaGiratoria.freqAtirar = 5;
    infoArmaGiratoria.indexArmaGiratoria = indexArmaGiratoria;

    infoPersonagemPrincipal.infoArmas = [infoArmasLateral, infoArmaGiratoria];

    return infoPersonagemPrincipal;
  }

 //INIMIGOS
  /*
  TipoInimigos:
    - AviaoNormalFraco
    - AviaoNormalMedio
    - HelicopteroBom
  */
  static infoInim(nomeInim, alteracoesAndarRotacionar, tipoAndar=TipoAndar.NaoSairTelaInvTudo, infoMostrarVida,
    rotacionarInimAnguloAnda=false, limitarCurvaInim, corVida={stroke: color(200, 0, 0), fill: "red"})
  // infoMostrarVida: mostrarVidaSempre, porcentagemTempoVida
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo OU ficarParado} e {direcaoAnguloAponta, ehAngulo}
  // limitarCurvaInim: {maiorAnguloMudanca, porcVelCurva}
  {
    let formaGeometrica, nivelVida, nivelMortalIntersec, nivelVelocidade, infoArmas=[];
    let qtdHelices=0, qtdsRotateDifHelices; //para helicopteros
    switch(nomeInim)
    {
      case "AviaoNormalFraco":
      {
        //formaGeometrica
        const tamanho = 90;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0*tamanho,0.23288888888888887*tamanho, 1*tamanho, 0.2256111111111111*tamanho),
            new Retangulo(0.43302777777777773*tamanho,0*tamanho, 0.13463888888888886*tamanho, 0.7714444444444444*tamanho),
            new Retangulo(0.31840277777777776*tamanho,0.7714444444444444*tamanho, 0.35843055555555553*tamanho, 0.13827777777777778*tamanho),
          ]);

        //caracteristicas
        nivelVida = 0.4;
        nivelMortalIntersec = 0.5;
        nivelVelocidade = 0.6;

        //infoArmas
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", false);
        infoArma.freqAtirar = 14;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0;
        infoArma.ehTiroDuplo = false;
        infoArmas.push(infoArma);
      }
      break;

      case "AviaoNormalMedio":
      {
        //formaGeometrica
        const tamanho = 90;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
         [
           new Retangulo(0*tamanho,0.19083969465648856*tamanho, 1*tamanho, 0.17557251908396945*tamanho),
           new Quadrilatero(new Ponto(0.37659033078880405, 0).multiplicado(tamanho), new Ponto(0.6055979643765903, 0.010178117048346057).multiplicado(tamanho), new Ponto(0.5241730279898219, 0.7786259541984732).multiplicado(tamanho), new Ponto(0.4681933842239186, 0.7735368956743003).multiplicado(tamanho)),
           new Retangulo(0.2875318066157761*tamanho,0.6437659033078881*tamanho, 0.4198473282442748*tamanho, 0.10687022900763359*tamanho),
         ]);

       //caracteristicas
       nivelVida = 0.6;
       nivelMortalIntersec = 0.7;
       nivelVelocidade = 0.75;

       //infoArmas
       let infoArma = new InfoArma();
       infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", false);
       infoArma.freqAtirar = 12;
       infoArma.direcaoSairTiro = Direcao.Baixo;
       infoArma.porcPraDentroObj = 0;
       infoArma.ehTiroDuplo = false;
       infoArmas.push(infoArma);
      }
      break;

      case "HelicopteroBom":
      {
        //formaGeometrica
        const tamanho = 50;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
          new Retangulo(0.34216326530612245*tamanho,0*tamanho, 0.3133061224489796*tamanho, 2.061224489795918*tamanho),
          new Retangulo(0*tamanho,0.5895102040816326*tamanho, 1*tamanho, 0.3957551020408163*tamanho),
          new Retangulo(0.2473469387755102*tamanho,1.4511020408163264*tamanho, 0.4988163265306122*tamanho, 0.1813877551020408*tamanho),
          ]);
        //adicionar helice
        qtdHelices = 1;
        formaGeometrica.adicionarImagemSecundaria("helice0",
          "Imagens/HeliceRobusta.png", 1, new Ponto(0.5, 0.7));

        //caracteristicas
        nivelVida = 1.7;
        nivelMortalIntersec = 1.3;
        nivelVelocidade = 0.7;

        //INFO ARMA
        //tiros frente
        let infoArmaFrente = new InfoArma();
        infoArmaFrente.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", false);
        infoArmaFrente.freqAtirar = 12;
        infoArmaFrente.direcaoSairTiro = Direcao.Baixo;
        infoArmaFrente.porcPraDentroObj = 0;
        infoArmaFrente.ehTiroDuplo = false;
        infoArmas.push(infoArmaFrente);
        //tiros lado perto centro
        let infoArmaLadosPerto = new InfoArma();
        infoArmaLadosPerto.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
        infoArmaLadosPerto.freqAtirar = 8;
        infoArmaLadosPerto.direcaoSairTiro = Direcao.Baixo;
        infoArmaLadosPerto.porcPraDentroObj = 0.25;
        infoArmaLadosPerto.ehTiroDuplo = true;
        infoArmaLadosPerto.porcTiroCentro = 0.40;
        infoArmas.push(infoArmaLadosPerto);
        //tiros lado longe centro
        let infoArmaLadosLonge = new InfoArma();
        infoArmaLadosLonge.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
        infoArmaLadosLonge.freqAtirar = 8;
        infoArmaLadosLonge.direcaoSairTiro = Direcao.Baixo;
        infoArmaLadosLonge.porcPraDentroObj = 0.25;
        infoArmaLadosLonge.ehTiroDuplo = true;
        infoArmaLadosLonge.porcTiroCentro = 0.43;
        infoArmas.push(infoArmaLadosLonge);
      }
      break;
    }

    let infoInim = new InfoInimigo();
    formaGeometrica.corImg = ArmazenadorInfoObjetos.getImagem(nomeInim+"Inim"); //adicionar imagem a formaGeometrica
    infoInim.formaGeometrica = formaGeometrica;
    infoInim.rotacionarInimAnguloAnda = rotacionarInimAnguloAnda; // se true, os inimigos vao rotacionar automaticamente, apontando pra onde estao andando (exemplo de USO: inimigos seguindo personagem)
    infoInim.qtdHelices = qtdHelices;
    infoInim.qtdsRotateDifHelices = qtdsRotateDifHelices;
    infoInim.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoInim.vida = vida(nivelVida);
    infoInim.qtdTiraVidaPersQndIntersec = mortalidadeIntersecInim(nivelMortalIntersec);
    infoInim.infoArmas = infoArmas;
    infoInim.corVida = corVida;
    if (infoMostrarVida !== undefined) //nao necessario
    {
      infoInim.mostrarVidaSempre = infoMostrarVida.mostrarVidaSempre;
      infoInim.porcentagemTempoVida = infoMostrarVida.porcentagemTempoVida;
    }

    //infoAndar
    if (alteracoesAndarRotacionar!==undefined && alteracoesAndarRotacionar.ficarParado === true)
      infoInim.infoAndar = new InfoAndar(0, 0, TipoAndar.Normal);
    else
    {
      infoInim.infoAndar = new InfoAndar(velocidade(nivelVelocidade), 0, tipoAndar); //colocar todo o qtdAndar no eixo X
      infoInim.infoAndar.guardarAnguloQtdAndar = rotacionarInimAnguloAnda; //se for rotacionar o inimigo, precisa guardar o anguloQtdRotacionar
      infoInim.infoAndar.limitarCurva = limitarCurvaInim;

      //modificacoes gracas a alteracoesAndar
      ClasseAndar.qtdAndarDifMudarDir(infoInim.infoAndar, alteracoesAndarRotacionar);
    }

    //rotacionar inimigo
    infoInim.formaGeometrica.rotacionar(PI); // todas as imagens de Avioes e Tiros sao apontando pra cima, mas a posicao inicial de Aviao de inimigo eh virado pra baixo (entao rotaciona-lo para deixar assim)
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoInim, alteracoesAndarRotacionar);

    return infoInim;
  }

 //TIROS:
  /*
  TiposTiros:
    - TiroFraco
    - TiroMedio
    - TiroMissil
  */
  static infoTiro(nomeTiro, ehDoPers, tipoAndar = TipoAndar.Normal, alteracoesAndarRotacionar)
  // alteracoesAndarRotacionar: {direcaoAnguloAponta, ehAngulo} (com isso jah vai andar na direcao desejada tambem)
  //obs: em tiros que sao misseis, o tipoAndar vai ser automaticamente TipoAndar.Seguir...
  {
    let formaGeometrica, nivelMortalidade, nivelVelocidade;
    let limitarCurva; //apenas para misseis {maiorAnguloMudanca, porcVelCurva}
    switch (nomeTiro)
    {
      case "TiroFraco":
      {
        const tamanho = 6.7;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho);
        nivelMortalidade = {pers: 1.5, inim: 1};
        nivelVelocidade = 1.8;
      }
      break;

      case "TiroMedio":
      {
        const tamanho = 7.2;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 1.8571428571428572*tamanho);
        nivelMortalidade = {pers: 2.5, inim: 1.7};
        nivelVelocidade = 2.1;
      }
      break;

      case "TiroMissil":
      {
        const tamanho = 9;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho);
        nivelMortalidade = {pers: 10, inim: 7};
        nivelVelocidade = 1.6;
        limitarCurva = {maiorAnguloMudanca: PI/23, porcVelCurva: 0.5};
        tipoAndar = (ehDoPers) ? TipoAndar.SeguirInimMaisProx : TipoAndar.SeguirPers;
      }
      break;
    }

    // para dar a ideia de tiro mesmo (sai mais rapido e depois mantem uma velocidade praticamente constante)
    let aceleracao;
    if (tipoAndar !== TipoAndar.SeguirPers && tipoAndar !== TipoAndar.SeguirInimMaisProx)
      aceleracao = {valor: 0.6, ehPorcentagem: true, qntsVezes: 1};
    else
      aceleracao = {valor: 0.4, ehPorcentagem: true, qntsVezes: 2};
    nivelVelocidade /= Math.pow(aceleracao.valor, aceleracao.qntsVezes);

    let infoTiro = new InfoTiro();
    infoTiro.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoTiro.mortalidade = mortalidadeTiro((ehDoPers)?nivelMortalidade.pers:nivelMortalidade.inim);

    //formaGeometrica
    formaGeometrica.corImg = ArmazenadorInfoObjetos.getImagem(nomeTiro);
    infoTiro.formaGeometrica = formaGeometrica;

    //rotacionar imagem formaGeometrica
    if (alteracoesAndarRotacionar==undefined || alteracoesAndarRotacionar.ehAngulo === undefined)
    // se nao colocaram opcao para rotacionar, rotaciona o padrao
      alteracoesAndarRotacionar = {direcaoAnguloAponta: (ehDoPers)?Direcao.Cima:Direcao.Baixo, ehAngulo: false};
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoTiro, alteracoesAndarRotacionar);

    //infoAndar
    infoTiro.infoAndar = new InfoAndar(0, velocidade(nivelVelocidade), tipoAndar);
    infoTiro.infoAndar.aceleracao = aceleracao;
    infoTiro.infoAndar.guardarAnguloQtdAndar = true; // os tiros vao rotacionar automaticamente se nao andarem totalmente retos
    infoTiro.infoAndar.limitarCurva = limitarCurva; //para misseis
    if (alteracoesAndarRotacionar.direcao===undefined && alteracoesAndarRotacionar.angulo===undefined)
    {
      // colocar as direcoes e sentidos do rotacionar dos tiros
      if (alteracoesAndarRotacionar.ehAngulo)
        alteracoesAndarRotacionar.angulo = alteracoesAndarRotacionar.direcaoAnguloAponta;
      else
        alteracoesAndarRotacionar.direcao = alteracoesAndarRotacionar.direcaoAnguloAponta;
    }
    ClasseAndar.qtdAndarDifMudarDir(infoTiro.infoAndar, alteracoesAndarRotacionar);

    return infoTiro;
  }


  //IMAGENS
  //Por que fazer assim? Como as formasGeometricas nao alteram nada das imagens eu posso usar a mesma imagem para todas as formas geometricas (Otimizacao de tempo e de memoria)
  static carregarImagens()
  {
    let vetParteCaminhos = [];

    //personagem
    vetParteCaminhos.push("AviaoOriginalPers");
    vetParteCaminhos.push("AviaoBrutoPers");
    vetParteCaminhos.push("AviaoMasterPers");

    //inimigos
    vetParteCaminhos.push("AviaoNormalFracoInim");
    vetParteCaminhos.push("AviaoNormalMedioInim");
    vetParteCaminhos.push("HelicopteroBomInim");

    //tiros
    vetParteCaminhos.push("TiroFraco");
    vetParteCaminhos.push("TiroMedio");
    vetParteCaminhos.push("TiroMissil");

    //outros/"acessorios"
    vetParteCaminhos.push("ArmaGiratoria");
    vetParteCaminhos.push("HeliceRobusta");

    //colocar no vetor static (chave = parte do caminho diferente, valor = o caminho completo)
    ArmazenadorInfoObjetos.vetorImgs = [];
    vetParteCaminhos.forEach(parteCaminhoImg =>
      ArmazenadorInfoObjetos.vetorImgs[parteCaminhoImg] = loadImage("Imagens/"+parteCaminhoImg+".png")
    );
  }
  static getImagem(parteCaminhoImg)
  { return ArmazenadorInfoObjetos.vetorImgs[parteCaminhoImg]; }
}

  //ATRIBUTOS...

//velocidade
const velPadrao = 10;
function velocidade(nivel)
{ return nivel*velPadrao; }

//vida
const vidaPadrao = 100;
function vida(nivel)
{ return nivel*vidaPadrao; }

//mortalidadeTiro
const mortalidadeTiroPadrao = vidaPadrao/100;
function mortalidadeTiro(nivel)
{ return nivel*mortalidadeTiroPadrao; }

//mortalidadeIntersecInim
const mortalidadeIntersecInimPadrao = vidaPadrao/120;
function mortalidadeIntersecInim(nivel)
{ return nivel*mortalidadeIntersecInimPadrao; }
