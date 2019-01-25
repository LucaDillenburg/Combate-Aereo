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
      "Imagens/AviaoOriginalPers.png");
    infoPersonagemPrincipal.corImgMorto = {fill: "black"};
    infoPersonagemPrincipal.vida = vida(1);
    infoPersonagemPrincipal.qtdAndar = velocidade(1);

    // atirar do pers
    let configuracaoAtirar = new InfoArma();
    configuracaoAtirar.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", true);
    configuracaoAtirar.freqAtirar = 4;
    configuracaoAtirar.direcaoSairTiro = Direcao.Cima;
    configuracaoAtirar.porcPraDentroObj = 0;
    configuracaoAtirar.ehTiroDuplo = false;

    infoPersonagemPrincipal.infoArmas = [configuracaoAtirar];

    return infoPersonagemPrincipal;
  }
  static get infoAviaoBrutoPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 120;
    const porcentagemImagem = 1;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.2838235294117647*tamanho, 1*tamanho, 0.13970588235294118*tamanho),
        new Retangulo(0.4323529411764706*tamanho,0*tamanho, 0.1338235294117647*tamanho, 0.7655502392344498*tamanho),
        new Retangulo(0.2838235294117647*tamanho,0.625*tamanho, 0.4323529411764706*tamanho, 0.11323529411764706*tamanho),
        new Retangulo(0.27941176470588236*tamanho,0.15294117647058825*tamanho, 0.4441176470588235*tamanho, 0.32941176470588235*tamanho),
      ],
      "Imagens/AviaoBrutoPers.png", porcentagemImagem);
    infoPersonagemPrincipal.corImgMorto = {fill: "black"};
    infoPersonagemPrincipal.vida = vida(1.5);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.25);

    // atirar do pers
    let configuracaoAtirar = new InfoArma();
    configuracaoAtirar.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", true);
    configuracaoAtirar.freqAtirar = 4;
    configuracaoAtirar.direcaoSairTiro = Direcao.Cima;
    configuracaoAtirar.porcPraDentroObj = 0.214;
    configuracaoAtirar.ehTiroDuplo = true;
    configuracaoAtirar.porcTiroCentro = 0.1655;

    infoPersonagemPrincipal.infoArmas = [configuracaoAtirar];

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
      "Imagens/AviaoMasterPers.png", porcentagemImagem);
    infoPersonagemPrincipal.corImgMorto = {fill: "black"};
    infoPersonagemPrincipal.vida = vida(3);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.65);

    // atirar do pers:

    //tiros dos lados (nao automatico)
    //infoTiroPadrao, freqAtirar, indexArmaGiratoria=-1, direcaoSairTiro, porcPraDentroObj=0, ehTiroDuplo=false, porcTiroCentro, atirarDireto=true
    let configAtirarLados = new InfoArma();
    configAtirarLados.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMissil", true, TipoAndar.SeguirInimMaisProx);
    configAtirarLados.direcaoSairTiro = Direcao.Cima;
    configAtirarLados.porcPraDentroObj = 0.214;
    configAtirarLados.ehTiroDuplo = true;
    configAtirarLados.porcTiroCentro = 0.1655;
    // soh vai atirar se quando o usuario apertar o gatilho e a frequencia estiver correta e se ha algum inimigo vivo na tela
    configAtirarLados.freqAtirar = 60;
    configAtirarLados.atirarDireto = false;
    configAtirarLados.funcaoCondicaoAtirar = () =>
        ControladorJogo.controladoresInimigos.some(controladorInims => controladorInims.algumInimVivo());

    //arma giratoria
    const indexArmaGiratoria = 0;
    //adicionar armaGiratoria
    const tamArmaGir = 0.5 * infoPersonagemPrincipal.formaGeometrica.height;
    const pontoCentral = new Ponto(infoPersonagemPrincipal.formaGeometrica.width/2,
      0.7 * infoPersonagemPrincipal.formaGeometrica.height);
    infoPersonagemPrincipal.formaGeometrica.adicionarImagemSecundaria("armaGiratoria"+indexArmaGiratoria,
      "Imagens/ArmaGiratoria.png", tamArmaGir, tamArmaGir, pontoCentral);
    //infoConfigArmaGiratoria
    let configArmaGiratoria = new InfoArma();
    configArmaGiratoria.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", true);
    configArmaGiratoria.freqAtirar = 5;
    configArmaGiratoria.indexArmaGiratoria = indexArmaGiratoria;

    infoPersonagemPrincipal.infoArmas = [configAtirarLados, configArmaGiratoria];

    return infoPersonagemPrincipal;
  }

 //INIMIGOS
  /*
  TipoInimigos:
    - AviaoNormalFracoInim
    - AviaoNormalMedioInim
  */
  static infoInim(nomeInim, alteracoesAndar, tipoAndar=TipoAndar.Normal, infoMostrarVida,
    rotacionarInimAnguloAnda=false, limitarCurvaInim, corVida={stroke: color(200, 0, 0), fill: "red"})
  // infoMostrarVida: mostrarVidaSempre, porcentagemTempoVida
  // alteracoesAndar: {direcao} ou {angulo}
  //limitarCurvaInim: {maiorAnguloMudanca, porcVelCurva}
  {
    let formaGeometrica, nivelVida, nivelMortalIntersec, nivelVelocidade, infoArmas;
    let tamanho;
    switch(nomeInim)
    {
      case "AviaoNormalFraco":
        tamanho = 90;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0*tamanho,0.23288888888888887*tamanho, 1*tamanho, 0.2256111111111111*tamanho),
            new Retangulo(0.43302777777777773*tamanho,0*tamanho, 0.13463888888888886*tamanho, 0.7714444444444444*tamanho),
            new Retangulo(0.31840277777777776*tamanho,0.7714444444444444*tamanho, 0.35843055555555553*tamanho, 0.13827777777777778*tamanho),
          ],
          "Imagens/AviaoNormalFracoInim.png");
        nivelVida = 0.4;
        nivelMortalIntersec = 0.5;
        nivelVelocidade = 0.6;

        //infoArmas
        let configuracaoAtirar = new InfoArma();
        configuracaoAtirar.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroFraco", false);
        configuracaoAtirar.freqAtirar = 8;
        configuracaoAtirar.direcaoSairTiro = Direcao.Baixo;
        configuracaoAtirar.porcPraDentroObj = 0;
        configuracaoAtirar.ehTiroDuplo = false;

        infoArmas = [configuracaoAtirar];
        break;

      case "AviaoNormalMedio":
        tamanho = 90;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
         [
           new Retangulo(0*tamanho,0.19083969465648856*tamanho, 1*tamanho, 0.17557251908396945*tamanho),
           new Quadrilatero(new Ponto(0.37659033078880405, 0).multiplicado(tamanho), new Ponto(0.6055979643765903, 0.010178117048346057).multiplicado(tamanho), new Ponto(0.5241730279898219, 0.7786259541984732).multiplicado(tamanho), new Ponto(0.4681933842239186, 0.7735368956743003).multiplicado(tamanho)),
           new Retangulo(0.2875318066157761*tamanho,0.6437659033078881*tamanho, 0.4198473282442748*tamanho, 0.10687022900763359*tamanho),
         ],
         "Imagens/AviaoNormalMedioInim.png");
        break;
    }

    let infoInim = new InfoInimigo();
    infoInim.formaGeometrica = formaGeometrica;
    infoInim.rotacionarInimAnguloAnda = rotacionarInimAnguloAnda; // se true, os inimigos vao rotacionar automaticamente, apontando pra onde estao andando (exemplo de USO: inimigos seguindo personagem)
    infoInim.corImgMorto = {fill: "black"};
    infoInim.vida = vida(nivelVida);
    infoInim.qtdTiraVidaPersQndIntersec = mortalidadeIntersecInim(nivelMortalIntersec);
    infoInim.corVida = (corVida===undefined) ? {stroke: color(200, 0, 0), fill: "red"} : corVida;
    if (infoMostrarVida !== undefined) //nao necessario
    {
      infoInim.mostrarVidaSempre = infoMostrarVida.mostrarVidaSempre;
      infoInim.porcentagemTempoVida = infoMostrarVida.porcentagemTempoVida;
    }

    //infoAndar
    if (alteracoesAndar === null)
      infoInim.infoAndar = new InfoAndar(0, 0, TipoAndar.Normal);
    else
    {
      infoInim.infoAndar = new InfoAndar(velocidade(nivelVelocidade), 0, tipoAndar); //colocar todo o qtdAndar no eixo X
      infoInim.infoAndar.guardarAnguloQtdAndar = rotacionarInimAnguloAnda; //se for rotacionar o inimigo, precisa guardar o anguloQtdRotacionar
      infoInim.infoAndar.limitarCurva = limitarCurvaInim;

      //modificacoes gracas a alteracoesAndar
      ClasseAndar.qtdAndarDifMudarDir(infoInim.infoAndar, alteracoesAndar);
    }

    infoInim.infoArmas = infoArmas;

    return infoInim;
  }

 //TIROS:
  /*
  TiposTiros:
    - TiroFraco
    - TiroMedio
    - TiroMissil
  */
  static infoTiro(nomeTiro, ehDoPers, tipoAndar = TipoAndar.Normal, alteracoesAndar, direcaoImgTiroAponta)
  // alteracoesAndar: {direcao} ou {angulo}
  //obs: em tiros que sao misseis, o tipoAndar vai ser automaticamente TipoAndar.Seguir...
  {
    let formaGeometrica, nivelMortalidade, nivelVelocidade, aceleracao, limitarCurva/*apenas para misseis {maiorAnguloMudanca, porcVelCurva}*/;
    let tamanho; //soh vai usar dentro do switch (porem vai usar em todos os cases)
    switch (nomeTiro)
    {
      case "TiroFraco":
        tamanho = 6.7;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho, "Imagens/TiroFraco.png");
        nivelMortalidade = {pers: 1.5, inim: 1};
        nivelVelocidade = 1.8;
        //aceleracao = {valor: 0.6, ehPorcentagem: true, qntsVezes: 2}; // para dar a ideia de tiro mesmo (sai mais rapido e depois mantem uma velocidade praticamente constante)
        break;

      case "TiroMedio":
        tamanho = 7.2;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 1.8571428571428572*tamanho, "Imagens/TiroMedio.png");
        nivelMortalidade = {pers: 2.5, inim: 1.7};
        nivelVelocidade = 2.1;
        break;

      case "TiroMissil":
        tamanho = 9;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho, "Imagens/TiroMissil.png");
        nivelMortalidade = {pers: 10, inim: 7};
        nivelVelocidade = 1.6;
        limitarCurva = {maiorAnguloMudanca: PI/23, porcVelCurva: 0.5};
        tipoAndar = (ehDoPers) ? TipoAndar.SeguirInimMaisProx : TipoAndar.SeguirPers;
        break;
    }

    let infoTiro = new InfoTiro();
    infoTiro.corImgMorto = {fill: "black"};
    infoTiro.mortalidade = mortalidadeTiro((ehDoPers)?nivelMortalidade.pers:nivelMortalidade.inim);

    //formaGeometrica
    infoTiro.formaGeometrica = formaGeometrica;

    //rotacionar imagem formaGeometrica
    if (direcaoImgTiroAponta===undefined)
      direcaoImgTiroAponta = (ehDoPers)?Direcao.Cima:Direcao.Baixo;
    let qntRotacionar;
    switch (direcaoImgTiroAponta)
    {
      case Direcao.Baixo:
        //rotacionar 180graus
        qntRotacionar = PI;
        break;
      case Direcao.Direita:
        //rotacionar 90graus
        qntRotacionar = PI/2;
        break;
      case Direcao.Esquerda:
        //rotacionar -90graus
        qntRotacionar = -PI/2;
        break;
      default:
        qntRotacionar = 0;
    }
    infoTiro.formaGeometrica.setRotacao(qntRotacionar);

    //infoAndar
    infoTiro.infoAndar = new InfoAndar(0, velocidade(nivelVelocidade), tipoAndar);
    infoTiro.infoAndar.aceleracao = aceleracao;
    infoTiro.infoAndar.guardarAnguloQtdAndar = true; // os tiros vao rotacionar automaticamente se nao andarem totalmente retos
    infoTiro.infoAndar.limitarCurva = limitarCurva; //para misseis
    if (alteracoesAndar===undefined)
    {
      // colocar as direcoes e sentidos padroes dos tiros
      if (ehDoPers) // personagem atira pra cima
        alteracoesAndar = {direcao: Direcao.Cima};
      else // inimigo atira pra baixo
        alteracoesAndar = {direcao: Direcao.Baixo};
    }
    ClasseAndar.qtdAndarDifMudarDir(infoTiro.infoAndar, alteracoesAndar);

    return infoTiro;
  }

  //do pers
  static get infoTiroPersPadrao()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroPersPadrao = new InfoTiro();
    infoTiroPersPadrao.formaGeometrica = new Retangulo(undefined,undefined, 5, 8, {fill: color(0, 0, 102)});
    infoTiroPersPadrao.corImgMorto = {fill: "black"};
    infoTiroPersPadrao.infoAndar = new InfoAndar(0, -22, TipoAndar.Normal);
    infoTiroPersPadrao.ehDoPers = true;
    infoTiroPersPadrao.mortalidade = 5;

    return infoTiroPersPadrao;
  }
  static get infoTiroMissilPers()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoMissil = new InfoTiro();
    infoMissil.formaGeometrica = new Retangulo(undefined,undefined, 6, 10, {fill: "white"});
    infoMissil.corImgMorto = {fill: "black"};
    infoMissil.infoAndar = new InfoAndar(0, -10, TipoAndar.SeguirInimMaisProx);
    infoMissil.ehDoPers = true;
    infoMissil.mortalidade = 20;

    return infoMissil;
  }
  //nao do pers
  static get infoTiroInim()
  {
    //InfoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroInim = new InfoTiro();
    infoTiroInim.formaGeometrica = new Retangulo(undefined,undefined, 2.7, 5, {fill: "red"});
    infoTiroInim.corImgMorto = {fill: "black"};
    infoTiroInim.infoAndar = new InfoAndar(0, 13, TipoAndar.Normal);
    infoTiroInim.ehDoPers = false;
    infoTiroInim.mortalidade = 3;

    return infoTiroInim;
  }
  static get infoTiroTela()
  {
    //InfoTiroPadrao: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade
    let infoTiroTela = new InfoTiro();
    infoTiroTela.formaGeometrica = new Retangulo(undefined,undefined, 25, 25, {fill: "black"});
    infoTiroTela.corImgMorto = {fill: "white"};
    infoTiroTela.infoAndar = new InfoAndar(6, 0, TipoAndar.Normal);
    infoTiroTela.ehDoPers = false;
    infoTiroTela.mortalidade = 3;

    return infoTiroTela;
  }
}

  //ATRIBUTOS

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
