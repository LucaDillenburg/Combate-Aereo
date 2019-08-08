/* INFORMACOES DE PERSONAGEM, INIMIGOS E OBSTACULOS */
//Para mudar o tamanho de todos de um tipo de uma soh vez
let porcTamTudo, porcTamTiro, porcTamInim, porcTamPers;
//constantes
const qtdImgsObstA = 4;
const qtdImgsObstB = 4;
class ArmazenadorInfoObjetos
{
  static inicializar()
  {
    //setar valores das variaveis que funcionarao como constantes (nao pode usar const em si porque a variavel "width" ainda nao estah criada quando vai se prosessar as constantes)
      //tiros, inimigos e personagem
    porcTamTudo = width/830; //nao pode usar width porque o canvas ainda noa foi criado (entao usa-se o valor que serah amputado em width)
      //tiros
    porcTamTiro = 1.5 * porcTamTudo;
      //inimigos
    porcTamInim = 1 * porcTamTudo;
      //personagem
    porcTamPers = 1.2 * porcTamTudo;

    //deixar essas variaveis imutaveis
    Object.freeze(porcTamTudo);
    Object.freeze(porcTamTiro);
    Object.freeze(porcTamInim);
    Object.freeze(porcTamPers);
  }

 //PERSONAGEM PRINCIPAL
  static get infoAviaoOriginalPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 60 * porcTamPers;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.145*tamanho, 1*tamanho, 0.25*tamanho),
        new Retangulo(0.4125*tamanho,0*tamanho, 0.185*tamanho, 0.795*tamanho),
        new Quadrilatero(new Ponto(0.255, 0.76).multiplicado(tamanho), new Ponto(0.435, 0.555).multiplicado(tamanho), new Ponto(0.5625, 0.545).multiplicado(tamanho), new Ponto(0.735, 0.755).multiplicado(tamanho)),
      ]);
    infoPersonagemPrincipal.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Personagem/AviaoOriginal")]);
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}], 4);
    infoPersonagemPrincipal.vida = vida(1);
    infoPersonagemPrincipal.qtdAndar = velocidade(1);
    infoPersonagemPrincipal.numeroAviao = 1;

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
    const tamanho = 95 * porcTamPers;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.2838235294117647*tamanho, 1*tamanho, 0.13970588235294118*tamanho),
        new Retangulo(0.4323529411764706*tamanho,0*tamanho, 0.1338235294117647*tamanho, 0.7655502392344498*tamanho),
        new Retangulo(0.2838235294117647*tamanho,0.625*tamanho, 0.4323529411764706*tamanho, 0.11323529411764706*tamanho),
        new Retangulo(0.27941176470588236*tamanho,0.15294117647058825*tamanho, 0.4441176470588235*tamanho, 0.32941176470588235*tamanho),
      ]);
    infoPersonagemPrincipal.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Personagem/AviaoBruto")]);
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}], 4);
    infoPersonagemPrincipal.vida = vida(1.5);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.25);
    infoPersonagemPrincipal.numeroAviao = 2;

    // atirar do pers
    let infoArma = new InfoArma();
    infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", true);
    infoArma.freqAtirar = 4;
    infoArma.direcaoSairTiro = Direcao.Cima;
    infoArma.porcPraDentroObj = 0.255;
    infoArma.ehTiroDuplo = true;
    infoArma.porcTiroCentro = 0.174;

    infoPersonagemPrincipal.infoArmas = [infoArma];

    return infoPersonagemPrincipal;
  }
  static get infoAviaoMasterPers()
  {
    let infoPersonagemPrincipal = new InfoPersonagemPrincipal();

    //formaGeometricas
    const tamanho = 45 * porcTamPers;
    infoPersonagemPrincipal.formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
      [
        new Retangulo(0*tamanho,0.7623762376237624*tamanho, 1*tamanho, 0.557920792079208*tamanho),
        new Retangulo(0.36039603960396044*tamanho,0*tamanho, 0.27722772277227725*tamanho, 1.5282178217821782*tamanho),
        new Retangulo(0.2599009900990099*tamanho,1.5282178217821782*tamanho, 0.46782178217821785*tamanho, 0.20445544554455447*tamanho),
      ]);
    infoPersonagemPrincipal.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Personagem/AviaoMaster")]);
    infoPersonagemPrincipal.infoImgMorto = new InfoImgMorto([{fill: "black"}], 4);
    infoPersonagemPrincipal.vida = vida(3);
    infoPersonagemPrincipal.qtdAndar = velocidade(1.65);
    infoPersonagemPrincipal.numeroAviao = numeroAviaoMasterPers;

    //INFO ARMAS:

      //tiros dos lados (nao automatico): soh vai atirar se quando o usuario apertar o gatilho e a frequencia estiver correta e se ha algum inimigo vivo na tela
    let infoArmasLateral = new InfoArma();
    infoArmasLateral.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMissil", true, TipoAndar.SeguirInimMaisProx);
    infoArmasLateral.direcaoSairTiro = Direcao.Cima;
    infoArmasLateral.porcPraDentroObj = 0.52;
    infoArmasLateral.ehTiroDuplo = true;
    infoArmasLateral.porcTiroCentro = 0.44;
    infoArmasLateral.freqAtirar = 45;
    infoArmasLateral.atirarDireto = false;
    infoArmasLateral.funcaoCondicaoAtirar = () =>
      ControladorJogo.controladoresInimigos.some(controladorInims => controladorInims.algumInimVivo());

      //arma giratoria
    const indexArmaGiratoria = 0;
    //adicionar armaGiratoria
    infoPersonagemPrincipal.formaGeometrica.adicionarImagemSecundaria("armaGiratoria"+indexArmaGiratoria,
      ArmazenadorInfoObjetos.getImagem("Acessorios/ArmaGiratoria"), 0.85, new Ponto(0.5, 0.71));
    //infoConfigArmaGiratoria
    let infoArmaGiratoria = new InfoArma();
    infoArmaGiratoria.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroForte", true);
    infoArmaGiratoria.freqAtirar = 5;
    infoArmaGiratoria.indexArmaGiratoria = indexArmaGiratoria;

    infoPersonagemPrincipal.infoArmas = [infoArmasLateral, infoArmaGiratoria];

    return infoPersonagemPrincipal;
  }

 //INIMIGOS
  /*
  TipoInimigos:
    - AviaoMaster
    - AviaoBrutao
    - AviaoBrutoSemHel
    - HelicopteroBom
    - AviaoSupersonicoForte
    - AviaoSupersonicoRapido
    - AviaoNormalBomEscuro
    - AviaoNormalBomClaro
  */
  static infoInim(nomeInim, alteracoesAndarRotacionar, outrasInformacoesAndar, tipoAndar=TipoAndar.PermanecerEmRetangulo, infoMostrarVida,
    rotacionarInimAnguloAnda, corVida={stroke: color(200, 0, 0), fill: "red"})
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo OU ficarParado} e {direcaoAnguloAponta, ehAngulo}
  // outrasInformacoesAndar: ver InfoAndar
  // rotacionarInimAnguloAnda: se for TipoAndar.SeguirPers ou TipoAndar.DirecaoPers, o padrao eh true; caso contrario, o padrao eh false
  // infoMostrarVida: mostrarVidaSempre, porcentagemTempoVida
  {
    let formaGeometrica, nivelVida, nivelTiraVidaBatePers, nivelTiraVidaNaoConsegueEmpurrarPers, nivelVelocidade, infoArmas=[];
    let qtdHelices=0, qtdsRotateDifHelices; //para helicopteros
    let qtdVezesPrintaImgMorto = 1;
    switch(nomeInim)
    {
      case "AviaoMaster":
      {
        const tamanho = 230 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0.3764705882352941*tamanho,0*tamanho, 0.24705882352941178*tamanho, 0.673611111111111*tamanho),
            new Retangulo(0*tamanho,0.4102941176470588*tamanho, 1*tamanho, 0.17941176470588235*tamanho),
            new Quadrilatero(new Ponto(0.3588235294117647, 0.23823529411764705).multiplicado(tamanho), new Ponto(0.6352941176470588, 0.22647058823529412).multiplicado(tamanho), new Ponto(1, 0.4102941176470588).multiplicado(tamanho), new Ponto(0, 0.4117647058823529).multiplicado(tamanho)),
            new Retangulo(0.27941176470588236*tamanho,0.013235294117647059*tamanho, 0.43970588235294117*tamanho, 0.09264705882352942*tamanho),
          ]);

        //caracteristicas
        nivelVida = 8;
        nivelTiraVidaBatePers = 2.5;
        nivelTiraVidaNaoConsegueEmpurrarPers = 15;
        nivelVelocidade = 0.3;

        qtdVezesPrintaImgMorto = 5;

        //INFO ARMAS
        {
          const freqTirosNormais = 60;

          //FILEIRA 1 (mais pra dentro do inimigo)
          const porcDentrArmasFileira1 = 0.176; //fileira1: armas mais reservadas/mais pra dentro do inimigo
          const porcComecaAtirarFil1 = 0.5;
          const infoTiroMedio = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
          {
            //armas laterais 1 (mais perto do centro)
            let infoArmaLateral1 = new InfoArma();
            infoArmaLateral1.infoTiroPadrao = infoTiroMedio;
            infoArmaLateral1.freqAtirar = freqTirosNormais;
            infoArmaLateral1.porcComecaAtirar = porcComecaAtirarFil1;
            infoArmaLateral1.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral1.porcPraDentroObj = porcDentrArmasFileira1;
            infoArmaLateral1.ehTiroDuplo = true;
            infoArmaLateral1.porcTiroCentro = 0.127;
            infoArmas.push(infoArmaLateral1);
            //4
            let infoArmaLateral4 = new InfoArma();
            infoArmaLateral4.infoTiroPadrao = infoTiroMedio;
            infoArmaLateral4.freqAtirar = freqTirosNormais;
            infoArmaLateral4.porcComecaAtirar = porcComecaAtirarFil1;
            infoArmaLateral4.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral4.porcPraDentroObj = porcDentrArmasFileira1;
            infoArmaLateral4.ehTiroDuplo = freqTirosNormais;
            infoArmaLateral4.porcTiroCentro = 0.2217;
            infoArmas.push(infoArmaLateral4);
            //5
            let infoArmaLateral5 = new InfoArma();
            infoArmaLateral5.infoTiroPadrao = infoTiroMedio;
            infoArmaLateral5.freqAtirar = freqTirosNormais;
            infoArmaLateral5.porcComecaAtirar = porcComecaAtirarFil1;
            infoArmaLateral5.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral5.porcPraDentroObj = porcDentrArmasFileira1;
            infoArmaLateral5.ehTiroDuplo = true;
            infoArmaLateral5.porcTiroCentro = 0.356;
            infoArmas.push(infoArmaLateral5);
            //8 (mais longe do centro)
            let infoArmaLateral8 = new InfoArma();
            infoArmaLateral8.infoTiroPadrao = infoTiroMedio;
            infoArmaLateral8.freqAtirar = freqTirosNormais;
            infoArmaLateral8.porcComecaAtirar = porcComecaAtirarFil1;
            infoArmaLateral8.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral8.porcPraDentroObj = porcDentrArmasFileira1;
            infoArmaLateral8.ehTiroDuplo = true;
            infoArmaLateral8.porcTiroCentro = 0.4721;
            infoArmas.push(infoArmaLateral8);
          }

          //FILEIRA 2 (mais pra fora do inimigo)
          const porcDentrArmasFileira2 = 0.14; //fileira2: armas menos reservadas/mais pra fora do inimigo
          const infoTiroForte = ArmazenadorInfoObjetos.infoTiro("TiroForte", false);
          {
            //2
            let infoArmaLateral2 = new InfoArma();
            infoArmaLateral2.infoTiroPadrao = infoTiroForte;
            infoArmaLateral2.freqAtirar = freqTirosNormais;
            infoArmaLateral2.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral2.porcPraDentroObj = porcDentrArmasFileira2;
            infoArmaLateral2.ehTiroDuplo = true;
            infoArmaLateral2.porcTiroCentro = 0.159;
            infoArmas.push(infoArmaLateral2);
            //3
            let infoArmaLateral3 = new InfoArma();
            infoArmaLateral3.infoTiroPadrao = infoTiroForte;
            infoArmaLateral3.freqAtirar = freqTirosNormais;
            infoArmaLateral3.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral3.porcPraDentroObj = porcDentrArmasFileira2;
            infoArmaLateral3.ehTiroDuplo = true;
            infoArmaLateral3.porcTiroCentro = 0.1913;
            infoArmas.push(infoArmaLateral3);
          }

          //MISSEIS
          const freqAtirarMisseis = 150;
          const porcDentrArmasFileiraMissil = 0.19;
          const porcComecaAtirarMisseis = 0.7;
          const infoTiroMissil = ArmazenadorInfoObjetos.infoTiro("TiroMissilPior", false);
          {
            //6
            let infoArmaLateral6 = new InfoArma();
            infoArmaLateral6.infoTiroPadrao = infoTiroMissil;
            infoArmaLateral6.freqAtirar = freqAtirarMisseis;
            infoArmaLateral6.porcComecaAtirar = porcComecaAtirarMisseis;
            infoArmaLateral6.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral6.porcPraDentroObj = porcDentrArmasFileiraMissil;
            infoArmaLateral6.ehTiroDuplo = true;
            infoArmaLateral6.porcTiroCentro = 0.39;
            infoArmas.push(infoArmaLateral6);
            //7
            let infoArmaLateral7 = new InfoArma();
            infoArmaLateral7.infoTiroPadrao = infoTiroMissil;
            infoArmaLateral7.freqAtirar = freqAtirarMisseis;
            infoArmaLateral7.porcComecaAtirar = porcComecaAtirarMisseis;
            infoArmaLateral7.direcaoSairTiro = Direcao.Baixo;
            infoArmaLateral7.porcPraDentroObj = porcDentrArmasFileiraMissil;
            infoArmaLateral7.ehTiroDuplo = true;
            infoArmaLateral7.porcTiroCentro = 0.43;
            infoArmas.push(infoArmaLateral7);
          }

          //ARMA GIRATORIA (TiroBomba)
          const indexArmaGiratoria = 0;
          {
            //adicionar armaGiratoria
            const chaveArmaGiratoria = "armaGiratoria"+indexArmaGiratoria;
            formaGeometrica.adicionarImagemSecundaria(chaveArmaGiratoria,
              ArmazenadorInfoObjetos.getImagem("Acessorios/ArmaGiratoria"), 0.35, new Ponto(0.5, 0.3));
            formaGeometrica.rotacionarImagemSecundaria(chaveArmaGiratoria, PI); //para armaGiratoria comecar apontada para baixo
            //infoConfigArmaGiratoria
            let infoArmaGiratoria = new InfoArma();
            infoArmaGiratoria.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroBomba", false);
            infoArmaGiratoria.freqAtirar = 22;
            infoArmaGiratoria.indexArmaGiratoria = indexArmaGiratoria;
            infoArmas.push(infoArmaGiratoria);
          }
        }
      }
      break;

      case "AviaoBrutao":
      {
        //formaGeometrica
        const tamanho = 170 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0.46176470588235297*tamanho,0*tamanho, 0.075*tamanho, 0.6339622641509434*tamanho),
            new Retangulo(0*tamanho,0.31029411764705883*tamanho, 1*tamanho, 0.1411764705882353*tamanho),
            new Retangulo(0.21911764705882353*tamanho,0.451470588234*tamanho, 0.5617647058823529*tamanho, 0.09558823529541177*tamanho),
            new Retangulo(0.32941176470588235*tamanho,0.016176470588235296*tamanho, 0.3382352941176471*tamanho, 0.12058823529411765*tamanho),
          ]);

        //caracteristicas
        nivelVida = 4.5;
        nivelTiraVidaBatePers = 2;
        nivelTiraVidaNaoConsegueEmpurrarPers = 10;
        nivelVelocidade = 1.2;

        qtdVezesPrintaImgMorto = 2;

        //INFO ARMAS
        //tiros laterais
        const infoTirosLaterais = ArmazenadorInfoObjetos.infoTiro("TiroForte", false);
        const freqTiroLaterais = 10;
        //armas laterais 1 (mais perto do centro)
        let infoArmaLateral1 = new InfoArma();
        infoArmaLateral1.infoTiroPadrao = infoTirosLaterais;
        infoArmaLateral1.freqAtirar = freqTiroLaterais;
        infoArmaLateral1.direcaoSairTiro = Direcao.Baixo;
        infoArmaLateral1.porcPraDentroObj = 0.19;
        infoArmaLateral1.ehTiroDuplo = true;
        infoArmaLateral1.porcTiroCentro = 0.125;
        infoArmas.push(infoArmaLateral1);
        //armas laterais 2 (mais longe do centro)
        let infoArmaLateral2 = new InfoArma();
        infoArmaLateral2.infoTiroPadrao = infoTirosLaterais;
        infoArmaLateral2.freqAtirar = freqTiroLaterais;
        infoArmaLateral2.direcaoSairTiro = Direcao.Baixo;
        infoArmaLateral2.porcPraDentroObj = 0.22;
        infoArmaLateral2.ehTiroDuplo = true;
        infoArmaLateral2.porcTiroCentro = 0.255;
        infoArmas.push(infoArmaLateral2);
      }
      break;

      case "AviaoBrutoSemHel":
      {
        const tamanho = 108 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0.44558490566037734*tamanho,0*tamanho, 0.10830188679245283*tamanho, 0.7735849056603773*tamanho),
            new Retangulo(0*tamanho,0.3078867924528302*tamanho, 1*tamanho, 0.14079245283018868*tamanho),
            new Retangulo(0.3140754716981132*tamanho,0.012377358490566037*tamanho, 0.36977358490566037*tamanho, 0.12222641509433961*tamanho),
            new Retangulo(0.38369811320754715*tamanho,0.17637735849056602*tamanho, 0.22743396226415094*tamanho, 0.12532075471698112*tamanho),
          ]);

        //caracteristicas
        nivelVida = 1.7;
        nivelTiraVidaBatePers = 2;
        nivelTiraVidaNaoConsegueEmpurrarPers = 10;
        nivelVelocidade = 1.2;

        //infoArmas (missil)
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMissilPior", false);
        infoArma.freqAtirar = 45;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0.38;
        infoArma.ehTiroDuplo = true;
        infoArma.porcTiroCentro = 0.142
        infoArmas.push(infoArma);
      }
      break;

      case "HelicopteroBom":
      {
        const tamanho = 40 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0.34216326530612245*tamanho,0*tamanho, 0.3174285714285714*tamanho, 2.061224489795918*tamanho),
            new Retangulo(0*tamanho,1.0718367346938775*tamanho, 1*tamanho, 0.39163265306122447*tamanho),
            new Retangulo(0.2555918367346939*tamanho,0.4204897959183673*tamanho, 0.4823265306122449*tamanho, 0.16489795918367345*tamanho),
          ]);

        //helice
        qtdHelices = 1;
        formaGeometrica.adicionarImagemSecundaria("helice0", ArmazenadorInfoObjetos.getImagem("Acessorios/HeliceRobusta"), 1.4, new Ponto(0.5, 0.62));

        //caracteristicas
        nivelVida = 1.2;
        nivelTiraVidaBatePers = 1.6;
        nivelTiraVidaNaoConsegueEmpurrarPers = 8;
        nivelVelocidade = 0.6;

        //INFO ARMAS
        /*//arma central
        let infoArmaCentro = new InfoArma();
        infoArmaCentro.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroForte", false);
        infoArmaCentro.freqAtirar = 30;
        infoArmaCentro.direcaoSairTiro = Direcao.Baixo;
        infoArmaCentro.porcPraDentroObj = 0;
        infoArmaCentro.ehTiroDuplo = false;
        infoArmas.push(infoArmaCentro); */
        //tiros laterais
        const infoTirosLaterais = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
        const freqTiroLaterais = 15;
        const porcPraDentroTirosLaterais = 0.346;
        //armas laterais 1 (mais perto do centro)
        let infoArmaLateral1 = new InfoArma();
        infoArmaLateral1.infoTiroPadrao = infoTirosLaterais;
        infoArmaLateral1.freqAtirar = freqTiroLaterais;
        infoArmaLateral1.direcaoSairTiro = Direcao.Baixo;
        infoArmaLateral1.porcPraDentroObj = porcPraDentroTirosLaterais;
        infoArmaLateral1.ehTiroDuplo = true;
        infoArmaLateral1.porcTiroCentro = 0.34;
        infoArmas.push(infoArmaLateral1);
        //armas laterais 2 (mais longe do centro)
        let infoArmaLateral2 = new InfoArma();
        infoArmaLateral2.infoTiroPadrao = infoTirosLaterais;
        infoArmaLateral2.freqAtirar = freqTiroLaterais;
        infoArmaLateral2.direcaoSairTiro = Direcao.Baixo;
        infoArmaLateral2.porcPraDentroObj = porcPraDentroTirosLaterais;
        infoArmaLateral2.ehTiroDuplo = true;
        infoArmaLateral2.porcTiroCentro = 0.42;
        infoArmas.push(infoArmaLateral2);
      }
      break;

      case "AviaoSupersonicoForte":
      {
        const tamanho = 53 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Triangulo(new Ponto(0, 0.27931372549019606).multiplicado(tamanho), new Ponto(1, 0.2901960784313726).multiplicado(tamanho), new Ponto(0.49333333333333335, 1.4364705882352942).multiplicado(tamanho)),
            new Retangulo(0.4280392156862745*tamanho,0*tamanho, 0.1450980392156863*tamanho, 1.8137254901960784*tamanho),
            new Retangulo(0.1342156862745098*tamanho,0.018137254901960786*tamanho, 0.7327450980392157*tamanho, 0.28294117647058825*tamanho),
          ]);

        //caracteristicas
        nivelVida = 1.3;
        nivelTiraVidaBatePers = 1.5;
        nivelTiraVidaNaoConsegueEmpurrarPers = 3;
        nivelVelocidade = 1.52;

        //infoArmas
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroLaser", false);
        infoArma.freqAtirar = 11;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0;
        infoArma.ehTiroDuplo = false;
        infoArmas.push(infoArma);
      }
      break;

      case "AviaoSupersonicoRapido":
      {
        const tamanho = 54 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Quadrilatero(new Ponto(0, 0.5515876288659795).multiplicado(tamanho), new Ponto(1, 0.5515876288659795).multiplicado(tamanho), new Ponto(0.6644123711340206, 0.9496082474226805).multiplicado(tamanho), new Ponto(0.3322061855670103, 0.9527422680412372).multiplicado(tamanho)),
            new Retangulo(0.37921649484536085*tamanho,0*tamanho, 0.241319587628866*tamanho, 1.5670103092783505*tamanho),
            new Retangulo(0.18804123711340207*tamanho,0.2162474226804124*tamanho, 0.6236701030927835*tamanho, 0.2287835051546392*tamanho),
          ]);

        //caracteristicas
        nivelVida = 0.75;
        nivelTiraVidaBatePers = 1;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1.5;
        nivelVelocidade = 1.72;

        //infoArmas
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroLaser", false);
        infoArma.freqAtirar = 11;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0;
        infoArma.ehTiroDuplo = false;
        infoArmas.push(infoArma);
      }
      break;

      case "AviaoNormalBomEscuro":
      {
        const tamanho = 80 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0.42922155688622754*tamanho,0*tamanho, 0.1391616766467066*tamanho, 0.8383233532934131*tamanho),
            new Retangulo(0*tamanho,0.41413173652694607*tamanho, 1*tamanho, 0.1861077844311377*tamanho),
            new Retangulo(0.3118562874251497*tamanho,0.020119760479041914*tamanho, 0.37892215568862275*tamanho, 0.10562874251497005*tamanho),
          ]);

        //caracteristicas
        nivelVida = 0.65;
        nivelTiraVidaBatePers = 0.7;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1;
        nivelVelocidade = 0.6;

        //infoArmas
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
        infoArma.freqAtirar = 11;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0;
        infoArma.ehTiroDuplo = false;
        infoArmas.push(infoArma);
      }
      break;

      case "AviaoNormalBomClaro":
      {
        const tamanho = 82 * porcTamInim;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0*tamanho,0.33088235294117646*tamanho, 1*tamanho, 0.19558823529411765*tamanho),
            new Retangulo(0.43823529411764706*tamanho,0*tamanho, 0.12352941176470589*tamanho, 0.7267080745341615*tamanho),
            new Retangulo(0.2926470588235294*tamanho,0.03676470588235294*tamanho, 0.41323529411764703*tamanho, 0.10294117647058823*tamanho),
          ]);

        //caracteristicas
        nivelVida = 0.6;
        nivelTiraVidaBatePers = 0.7;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1;
        nivelVelocidade = 0.65;

        //infoArmas
        let infoArma = new InfoArma();
        infoArma.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
        infoArma.freqAtirar = 12;
        infoArma.direcaoSairTiro = Direcao.Baixo;
        infoArma.porcPraDentroObj = 0;
        infoArma.ehTiroDuplo = false;
        infoArmas.push(infoArma);
      }
      break;

      default:
        throw "Esse inimigo nao existe!";
    }

    if (rotacionarInimAnguloAnda === undefined)
      rotacionarInimAnguloAnda = (tipoAndar === TipoAndar.SeguirPers || tipoAndar === TipoAndar.DirecaoPers);

    let infoInim = new InfoInimigo();
    infoInim.formaGeometrica = formaGeometrica;
    infoInim.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Inimigos/" + nomeInim)]); //imagem vivo
    infoInim.infoImgMorto = new InfoImgMorto([{fill: "black"}], qtdVezesPrintaImgMorto);
    infoInim.rotacionarInimAnguloAnda = rotacionarInimAnguloAnda; // se true, os inimigos vao rotacionar automaticamente, apontando pra onde estao andando (exemplo de USO: inimigos seguindo personagem)
    infoInim.qtdHelices = qtdHelices;
    infoInim.qtdsRotateDifHelices = qtdsRotateDifHelices;
    infoInim.vida = vida(nivelVida);
    infoInim.qtdTiraVidaBatePers = mortalidadeObjBatePers(nivelTiraVidaBatePers);
    infoInim.qtdTiraVidaNaoConsegueEmpurrarPers = mortalidadeObjNaoConsegueEmpurrarPers(nivelTiraVidaNaoConsegueEmpurrarPers);
    infoInim.infoArmas = infoArmas;
    infoInim.corVida = corVida;
    if (infoMostrarVida !== undefined) //nao necessario
    {
      infoInim.mostrarVidaSempre = infoMostrarVida.mostrarVidaSempre;
      infoInim.porcentagemTempoVida = infoMostrarVida.porcentagemTempoVida;
    }

    //infoAndar
    infoInim.infoAndar = ArmazenadorInfoObjetos._infoAndarInimObst(nivelVelocidade, tipoAndar, alteracoesAndarRotacionar, outrasInformacoesAndar);
    infoInim.infoAndar.guardarAnguloQtdAndar = rotacionarInimAnguloAnda; //se for rotacionar o inimigo, precisa guardar o anguloQtdRotacionar

    //rotacionar inimigo
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoInim, alteracoesAndarRotacionar);

    return infoInim;
  }

 //SUPORTE AEREO
  static get infoSuporteAereo()
  {
    let infoSuporteAereo = new SuporteAereo();
    infoSuporteAereo.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("SuportesAereos/Normal")]);
    infoSuporteAereo.infoImgMorto = new InfoImgMorto([{fill: "black"}]);
    infoSuporteAereo.qtdTiraVidaNaoConsegueEmpurrarPers = mortalidadeObjNaoConsegueEmpurrarPers(1);
    infoSuporteAereo.qtdHelices = 0;

    //formaGeometrica
    const tamanho = 100;
    infoSuporteAereo.formaGeometrica = new Retangulo(undefined, undefined, 1*tamanho, 0.3871733966745843*tamanho);;

    //infoArmas
    infoSuporteAereo.infoArmas = [];
    //armas laterais
    let infoArmasLaterais = new InfoArma();
    infoArmasLaterais.infoTiroPadrao = ArmazenadorInfoObjetos.infoTiro("TiroMedio", false);
    infoArmasLaterais.freqAtirar = 7;
    infoArmasLaterais.direcaoSairTiro = Direcao.Baixo;
    infoArmasLaterais.porcPraDentroObj = 0.2;
    infoArmasLaterais.ehTiroDuplo = true;
    infoArmasLaterais.porcTiroCentro = 0.27;
    infoSuporteAereo.infoArmas.push(infoArmasLaterais);
    //arma central
    const infoTiroCentral = ArmazenadorInfoObjetos.infoTiro("TiroMissil", false);
    const freqAtirarArmasCentro = 25;
      //armas laterais centrais
    let infoArmaCentralLateral = new InfoArma();
    infoArmaCentralLateral.infoTiroPadrao = infoTiroCentral;
    infoArmaCentralLateral.freqAtirar = freqAtirarArmasCentro;
    infoArmaCentralLateral.direcaoSairTiro = Direcao.Baixo;
    infoArmaCentralLateral.porcPraDentroObj = 0.2;
    infoArmaCentralLateral.porcTiroCentro = 0.08;
    infoArmaCentralLateral.ehTiroDuplo = true;
    infoSuporteAereo.infoArmas.push(infoArmaCentralLateral);
      //armas centrais centrais
    let infoArmaCentralMeio = new InfoArma();
    infoArmaCentralMeio.infoTiroPadrao = infoTiroCentral;
    infoArmaCentralMeio.freqAtirar = freqAtirarArmasCentro;
    infoArmaCentralMeio.direcaoSairTiro = Direcao.Baixo;
    infoArmaCentralMeio.porcPraDentroObj = 0.25;
    infoSuporteAereo.infoArmas.push(infoArmaCentralMeio);

    return infoSuporteAereo;
  }

 //TIROS:
  /*
  TiposTiros:
    - TiroFraco
    - TiroMedio
    - TiroForte

    - TiroLaser

    - TiroMissil
    - TiroMissilPior
    - TiroMissilDirecao
  */
  static infoTiro(nomeTiro, ehDoPers, tipoAndar = TipoAndar.Normal, alteracoesAndarRotacionar)
  // alteracoesAndarRotacionar: {direcaoAnguloAponta, ehAngulo} (com isso jah vai andar na direcao desejada tambem)
  //obs: em tiros que sao misseis, o tipoAndar vai ser automaticamente TipoAndar.Seguir...
  {
    let formaGeometrica, nivelMortalidade, nivelVelocidade;
    let limitarCurva; //apenas para misseis {maiorAnguloMudanca, porcVelCurva}
    const porcTiroPersMaisForte = 1.65;
    switch (nomeTiro)
    {
      //TIROS NORMAIS
      case "TiroFraco":
      {
        const tamanho = 3 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 3.5*tamanho);
        nivelMortalidade = 0.55; //do inimigo no pers
        nivelVelocidade = 1.5;
      }
      break;
      case "TiroMedio":
      {
        const tamanho = 4 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho);
        nivelMortalidade = 0.9; //do inimigo no pers
        nivelVelocidade = 1.8;
      }
      break;
      case "TiroForte":
      {
        const tamanho = 5 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 1.8571428571428572*tamanho);
        nivelMortalidade = 1.4; //do inimigo no pers
        nivelVelocidade = 2.1;
      }
      break;

      //OUTROS TIROS ESPECIAIS
      case "TiroLaser":
      {
        const tamanho = 3 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 4.571428571428571*tamanho);
        nivelMortalidade = 1.4; //do inimigo no pers
        nivelVelocidade = 2.4;
      }
      break;
      case "TiroBomba":
      {
        const tamanho = 10 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.142857142857143*tamanho);
        nivelMortalidade = 20; //do inimigo no pers
        nivelVelocidade = 1.8;
      }
      break;

      //TIROS SEGUEM
      case "TiroMissil":
      {
        const tamanho = 7 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.857142857142857*tamanho);
        nivelMortalidade = 6; //do inimigo no pers
        nivelVelocidade = 1.6;
        limitarCurva = {maiorAnguloMudanca: PI/23, porcVelCurva: 0.5};
        tipoAndar = (ehDoPers) ? TipoAndar.SeguirInimMaisProx : TipoAndar.SeguirPers;
      }
      break;
      case "TiroMissilPior":
      {
        const tamanho = 7 * porcTamTiro;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 2.4375*tamanho);
        nivelMortalidade = 5; //do inimigo no pers
        nivelVelocidade = 1.4;
        limitarCurva = {maiorAnguloMudanca: PI/72, porcVelCurva: 0.95, primMaiorAngMud: PI*0.45};
        tipoAndar = (ehDoPers) ? TipoAndar.SeguirInimMaisProx : TipoAndar.SeguirPers;
      }
      break;
    }

    // para dar a ideia de tiro mesmo (sai mais rapido e depois mantem uma velocidade praticamente constante)
    let aceleracao;
    if (tipoAndar !== TipoAndar.SeguirPers && tipoAndar !== TipoAndar.SeguirInimMaisProx)
      aceleracao = {valor: 0.7, ehPorcentagem: true, qntsVezes: 2};
    else
      aceleracao = {valor: 0.9, ehPorcentagem: true, qntsVezes: 1};
    nivelVelocidade /= Math.pow(aceleracao.valor, aceleracao.qntsVezes);

    let infoTiro = new InfoTiro();
    infoTiro.mortalidade = mortalidadeTiro(nivelMortalidade * (ehDoPers) ? porcTiroPersMaisForte : 1);

    //formaGeometricae e imagens vivo
    infoTiro.formaGeometrica = formaGeometrica;
    infoTiro.infoImgVivo = new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Tiros/" + nomeTiro)]); //imagem vivo

    //infoMorto
    const qtdExplosoes = 3;
    let vetorImgsExplosoes = [];
    for (let i = 1; i<=qtdExplosoes; i++)
      vetorImgsExplosoes.push(ArmazenadorInfoObjetos.getImagem("Colisao/Explosao"+i));
    infoTiro.infoImgMorto = new InfoImgMorto(vetorImgsExplosoes, 1, {porcWidth: 2, porcLadosCentroImg: new Ponto(0.5, 0.3)});

    //rotacionar imagem formaGeometrica
    if (alteracoesAndarRotacionar==undefined || alteracoesAndarRotacionar.ehAngulo === undefined)
    // se nao colocaram opcao para rotacionar, rotaciona o padrao
      alteracoesAndarRotacionar = {direcaoAnguloAponta: (ehDoPers)?Direcao.Cima:Direcao.Baixo, ehAngulo: false};
    AuxControladores.alteracoesRotacionarFormaGeometrica(infoTiro, alteracoesAndarRotacionar);

    //infoAndar
    infoTiro.infoAndar = new InfoAndar(0, velocidade(nivelVelocidade), tipoAndar);
    infoTiro.infoAndar.aceleracao = aceleracao;
    infoTiro.infoAndar.guardarAnguloQtdAndar = true; // os tiros vao rotacionar automaticamente se nao andarem totalmente retos
    infoTiro.infoAndar.outrasInformacoes = {limitarCurva: limitarCurva}; //para misseis
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

 //OBSTACULOS
  /*
  Tipos Obstaculos:
    - ComLaserA
    - ComLaserB

    - Espinhudo1
    - Espinhudo2

    - Rotatorio
  */
  static infoObst(nomeObst, alteracoesAndarRotacionar, tipoAndar = TipoAndar.Normal, outrasInformacoesAndar)
  // alteracoesAndarRotacionar: {direcao({x,y} OU Direcao.) OU angulo OU ficarParado} e {direcaoAnguloAponta, ehAngulo}
  // outrasInformacoesAndar: ver InfoAndar
  {
    let formaGeometrica, nivelVelocidade, nivelTiraVidaBatePers, nivelTiraVidaNaoConsegueEmpurrarPers;
    let qtdImgsObst = 1;
    let anguloRotacionarObst; //para obstaculos rotatorios
    switch (nomeObst)
    {
      case "ComLaserA":
      {
        const tamanho = 75;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Retangulo(0*tamanho,0*tamanho, 0.24944812362030905*tamanho, 0.23502129462394364*tamanho),
            new Retangulo(1.2472406181015452*tamanho,0*tamanho, 0.25386313465783666*tamanho, 0.23502129462394364*tamanho),
            new Retangulo(0.24944812362030905*tamanho,0.0640176600441501*tamanho, 1*tamanho, 0.10596026490066225*tamanho),
          ]);

        //caracteristicas
        qtdImgsObst = qtdImgsObstA;
        nivelVelocidade = 0.7;
        nivelTiraVidaBatePers = 1.5;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1;
      }
      break;

      case "ComLaserB":
      {
        const tamanho = 75;
        formaGeometrica = new FormaGeometricaComposta(undefined,undefined,
          [
            new Triangulo(new Ponto(0.24669603524229075, 0).multiplicado(tamanho), new Ponto(0.24669603524229075, 0.25511933000919784).multiplicado(tamanho), new Ponto(0, 0.12334801762114538).multiplicado(tamanho)),
            new Triangulo(new Ponto(1.2466960352422907, 0).multiplicado(tamanho), new Ponto(1.497797356828194, 0.12555066079295155).multiplicado(tamanho), new Ponto(1.2466960352422907, 0.25511933000919784).multiplicado(tamanho)),
            new Retangulo(0.24669603524229075*tamanho,0.08149779735682819*tamanho, 1*tamanho, 0.0947136563876652*tamanho),
          ]);

        //caracteristicas
        qtdImgsObst = qtdImgsObstB;
        nivelVelocidade = 0.7;
        nivelTiraVidaBatePers = 1.5;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1;
      }
      break;

      case "Espinhudo1":
      {
        const tamanho = 50;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 0.5396825396825397*tamanho);

        //caracteristicas
        nivelVelocidade = 0.5;
        nivelTiraVidaBatePers = 1;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1.5;
      }
      break;

      case "Espinhudo2":
      {
        const tamanho = 30;
        formaGeometrica = new Retangulo(undefined,undefined, 1*tamanho, 0.9*tamanho);

        //caracteristicas
        nivelVelocidade = 0.5;
        nivelTiraVidaBatePers = 1;
        nivelTiraVidaNaoConsegueEmpurrarPers = 1.5;
      }
      break;

      case "Rotatorio":
      {
        const tamanho = 32;
        formaGeometrica = new Quadrilatero(new Ponto(0.636, 0).multiplicado(tamanho), new Ponto(1, 0.638).multiplicado(tamanho), new Ponto(0.364, 1).multiplicado(tamanho), new Ponto(0, 0.36).multiplicado(tamanho));

        //caracteristicas
        nivelVelocidade = 1.4;
        nivelTiraVidaBatePers = 0.6;
        nivelTiraVidaNaoConsegueEmpurrarPers = 0.6;
        //AQUIanguloRotacionarObst = PI/16;
      }
      break;
    }

    let infoObst = new InfoObstaculo();
    infoObst.formaGeometrica = formaGeometrica;
    infoObst.qtdTiraVidaBatePers = mortalidadeObjBatePers(nivelTiraVidaBatePers);
    infoObst.qtdTiraVidaNaoConsegueEmpurrarPers = mortalidadeObjNaoConsegueEmpurrarPers(nivelTiraVidaNaoConsegueEmpurrarPers);
    infoObst.anguloRotacionarObst = anguloRotacionarObst;
    infoObst.infoImgMorto = new InfoImgMorto([{fill: "black"}]);

    //infoImgVivo
    let vetorImgsVivo;
    if (qtdImgsObst === 1)
      vetorImgsVivo = [ArmazenadorInfoObjetos.getImagem("Obstaculos/" + nomeObst)];
    else
    {
      vetorImgsVivo = [];
      for (let i = 1; i<=qtdImgsObst; i++)
        vetorImgsVivo.push(ArmazenadorInfoObjetos.getImagem("Obstaculos/" + nomeObst + i));
    }
    infoObst.infoImgVivo = new InfoImgVivo(vetorImgsVivo, 3);

    //infoAndar
    infoObst.infoAndar = ArmazenadorInfoObjetos._infoAndarInimObst(nivelVelocidade, tipoAndar, alteracoesAndarRotacionar, outrasInformacoesAndar);

    return infoObst;
  }

  //AUXILIARES
  static _infoAndarInimObst(nivelVelocidade, tipoAndar, alteracoesAndarRotacionar, outrasInformacoesAndar)
  {
    if (alteracoesAndarRotacionar!==undefined && alteracoesAndarRotacionar.ficarParado === true)
      return new InfoAndar(0, 0, TipoAndar.Normal);
    else
    {
      let infoAndar = new InfoAndar(velocidade(nivelVelocidade), 0, tipoAndar); //colocar todo o qtdAndar no eixo X

      //outrasInformacoes
      if (outrasInformacoesAndar !== undefined)
        infoAndar.outrasInformacoes = outrasInformacoesAndar;

      //modificacoes gracas a alteracoesAndar
      ClasseAndar.qtdAndarDifMudarDir(infoAndar, alteracoesAndarRotacionar);

      return infoAndar;
    }
  }

  //IMAGENS
  //Por que fazer assim? Como as formasGeometricas nao alteram nada das imagens eu posso usar a mesma imagem para todas as formas geometricas (Otimizacao de tempo e de memoria)
  static carregarImagens()
  {
    let vetParteCaminhos = [];

    //backgrounds
    vetParteCaminhos.push("Outros/background_inicio");

    //personagem
    vetParteCaminhos.push("Personagem/AviaoOriginal");
    vetParteCaminhos.push("Personagem/AviaoBruto");
    vetParteCaminhos.push("Personagem/AviaoMaster");

    //inimigos
    vetParteCaminhos.push("Inimigos/AviaoMaster");
    vetParteCaminhos.push("Inimigos/AviaoBrutao");
    vetParteCaminhos.push("Inimigos/AviaoBrutoSemHel");
    vetParteCaminhos.push("Inimigos/HelicopteroBom");
    vetParteCaminhos.push("Inimigos/AviaoSupersonicoForte");
    vetParteCaminhos.push("Inimigos/AviaoSupersonicoRapido");
    vetParteCaminhos.push("Inimigos/AviaoNormalBomEscuro");
    vetParteCaminhos.push("Inimigos/AviaoNormalBomClaro");

    //tiros
    vetParteCaminhos.push("Tiros/TiroFraco");
    vetParteCaminhos.push("Tiros/TiroMedio");
    vetParteCaminhos.push("Tiros/TiroForte");
    vetParteCaminhos.push("Tiros/TiroLaser");
    vetParteCaminhos.push("Tiros/TiroBomba");
    vetParteCaminhos.push("Tiros/TiroMissil");
    vetParteCaminhos.push("Tiros/TiroMissilPior");

    //obstaculos
    vetParteCaminhos.push("Obstaculos/Espinhudo1");
    vetParteCaminhos.push("Obstaculos/Espinhudo2");
    vetParteCaminhos.push("Obstaculos/Rotatorio");
    for (let i = 1; i<=qtdImgsObstA; i++)
      vetParteCaminhos.push("Obstaculos/ComLaserA" + i);
    for (let i = 1; i<=qtdImgsObstB; i++)
      vetParteCaminhos.push("Obstaculos/ComLaserB" + i);

    //acessorios
    vetParteCaminhos.push("Acessorios/ArmaGiratoria");
    vetParteCaminhos.push("Acessorios/HeliceRobusta");

    //colisoes
    vetParteCaminhos.push("Colisao/Explosao1");
    vetParteCaminhos.push("Colisao/Explosao2");
    vetParteCaminhos.push("Colisao/Explosao3");

    //pocoes
    vetParteCaminhos.push("Pocoes/DeixarTempoMaisLento");
    vetParteCaminhos.push("Pocoes/CongelarInimigos");
    vetParteCaminhos.push("Pocoes/ReverterTirosJogoInimSeguirInim");
    vetParteCaminhos.push("Pocoes/PersComMissil");
    vetParteCaminhos.push("Pocoes/MatarObjetos1Tiro");
    vetParteCaminhos.push("Pocoes/GanharMuitaVida");

    //raios
    vetParteCaminhos.push("Raios/raio1");
    vetParteCaminhos.push("Raios/raio2");
    vetParteCaminhos.push("Raios/raio3");
    vetParteCaminhos.push("Raios/raio4");
    vetParteCaminhos.push("Raios/raio5");
    vetParteCaminhos.push("Raios/raio6");

    //colocar no vetor static (chave = parte do caminho diferente, valor = o caminho completo)
    ArmazenadorInfoObjetos.vetorImgs = [];
    vetParteCaminhos.forEach(parteCaminhoImg =>
      ArmazenadorInfoObjetos.adicionarImgNoVetor(parteCaminhoImg)
    );
  }
  static getImagem(parteCaminhoImg)
  {
    const img = ArmazenadorInfoObjetos.vetorImgs[parteCaminhoImg];
    if (img !== undefined)
      return img;
    else
    {
      console.error("Adicionar \"" + parteCaminhoImg + "\" a ArmazenadorInfoObjetos.carregarImagens()");
      ArmazenadorInfoObjetos.adicionarImgNoVetor(parteCaminhoImg);
      return ArmazenadorInfoObjetos.vetorImgs[parteCaminhoImg];
    }
  }
  static adicionarImgNoVetor(parteCaminhoImg)
  {
    ArmazenadorInfoObjetos.vetorImgs[parteCaminhoImg] = loadImage("Imagens/"+parteCaminhoImg+".png");
  }
}

  //ATRIBUTOS...

//velocidade
const velPadrao = 400/frameRatePadrao;
function velocidade(nivel)
{ return nivel*velPadrao; }

//vida
const vidaPadrao = 100;
function vida(nivel)
{ return nivel*vidaPadrao; }

//mortalidadeTiro
const mortalidadeTiroPadrao = 2.5;
function mortalidadeTiro(nivel)
{ return nivel*mortalidadeTiroPadrao; }

//para colisoes objetos com pers que tiram vida:
const mortalidadeObjBatePersPadrao = 4;
function mortalidadeObjBatePers(nivel)
{ return mortalidadeObjBatePersPadrao*nivel; }
const mortalidadeObjNaoConsegueEmpurrarPersPadrao = vidaPadrao/3;
function mortalidadeObjNaoConsegueEmpurrarPers(nivel)
{ return mortalidadeObjNaoConsegueEmpurrarPersPadrao*nivel; }
