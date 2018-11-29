//PODER
class Poder
{
  constructor(codPoder)
  {
    this._codPoder = codPoder;
    this._informacoesPoder = Poder.informacoesPoderFromCod(codPoder);
    this._personagemJahPegou = false;
  }

  //getters
  get nome()
  { return this._informacoesPoder.nome; }
  get ativadoInstant()
  { return this._informacoesPoder.ativadoInstant; }

  static informacoesPoderFromCod(codPoder, strQuer)
  {
    // TODO: fazer isso certo (soh fiz pra nao ter que fazer em tudo (depois mudar))
    if (strQuer == "img")
      return {fill: color("white"), stroke: color("white")};
    if (strQuer == "imgMorreu")
      return {fill: color("orange"), stroke: color("orange")};

    switch(codPoder)
    {
      case TipoPoder.DiminuirTamanhoPers:
        /* if (strQuer == "img") return ;
        if (strQuer == "imgMorreu") return ; */
        return {nome: "Poção anão", ativadoInstant: false};

      case TipoPoder.MatarObjetos1Tiro:
        return {nome: "Poção Fácil de Matar", ativadoInstant: true};

      case TipoPoder.RUIMPersPerdeVel:
        return {nome: "Poção Space-Mud", ativadoInstant: true};

      case TipoPoder.TiroPersMaisRapidoMortal:
        return {nome: "Poção Tiro Master", ativadoInstant: false};

      case TipoPoder.MatarInimigosNaoEssenc:
        return {nome: "Poção Destruição em Massa", ativadoInstant: true};

      case TipoPoder.ReverterTirosJogoInimDirInim:
        return {nome: "Poção Tiros se Rebelam", ativadoInstant: false};

      case TipoPoder.GanharPoucaVida:
        return {nome: "Poção Ajuda dos Deuses", ativadoInstant: true};

      case TipoPoder.RUIMPersPerdeVida:
        return {nome: "Poção Burn Alive", ativadoInstant: true};

      case TipoPoder.ReverterTirosJogoInimSeguirInim:
        return {nome: "Poção Fúria contra Inimigos", ativadoInstant: true};

      case TipoPoder.DeixarTempoMaisLento:
        return {nome: "Poção Flash", ativadoInstant: true};

      case Tipo.RUIMTirosPersDirEle:
        return {nome: "Poção Feitiço Contra Feiticeiro", ativadoInstant: true};

      case TipoPoder.GanharMuitaVida:
        return {nome: "Poção os Deuses te Amam", ativadoInstant: false};

      default:
        throw "Esse codigo poder nao existe!";
    }
  }

  getFormaGeometrica(sohWidthHeight = false)
  //tomar em consideracao se this._personagemJahPegou
  {
    let formaGeometrica = null;

    let width, height;
    if (this._personagemJahPegou)
    {
      //tamanho padrao (pequeno)
      width = 7.5;
      height = 15;
    }
    else
    {
      //tamanho padrao (maior)
      width = 15;
      height = 30;
    }
    if (sohWidthHeight)
      return {width: width, height: height};
    formaGeometrica = new Retangulo(0,0,width,height);

    formaGeometrica.corImg = Poder.informacoesPoderFromCod(this._codPoder, "img");
    return formaGeometrica;
  }


 //NA TELA PARA PERSONAGEM PERGAR
  getImgMorreu()
  { return Poder.informacoesPoderFromCod(this._codPoder, "imgMorreu"); }

  procMorreu()
  // retorna se jah foi usado
  {
    this._personagemJahPegou = true;

    if (this._informacoesPoder.ativadoInstant)
      this.executarPoder();
    else
      ConjuntoObjetosTela.pers.controladorPoderesPers.adicionarPoder(this);

    return this._informacoesPoder.ativadoInstant;
  }


  //QUANDO USUARIO JAH PEGOU (imediatamente ou nao)
  // TODO: colocar poderes
  executarPoder()
  //usar apenas ConjuntoObjetosTela
  {
    let tempoPoderResta; //quanto tempo o poder fica ativo ateh desaparecer de novo

    switch(this._codPoder)
    {
      case TipoPoder.DiminuirTamanhoPers:
        break;

      case TipoPoder.MatarObjetos1Tiro:
        break;

      case TipoPoder.RUIMPersPerdeVel:
        break;

      case TipoPoder.TiroPersMaisRapidoMortal:
        break;

      case TipoPoder.MatarInimigosNaoEssenc:
        break;

      case TipoPoder.ReverterTirosJogoInimDirInim:
        break;

      case TipoPoder.GanharPoucaVida:
        break;

      case TipoPoder.RUIMPersPerdeVida:
        break;

      case TipoPoder.ReverterTirosJogoInimSeguirInim:
        break;

      case TipoPoder.DeixarTempoMaisLento:
        break;

      case Tipo.RUIMTirosPersDirEle:
        break;

      case TipoPoder.GanharMuitaVida:
        break;

      default:
        throw "Esse codigo poder nao existe!";
    }

    //programa quando quando vai parar com esse poder
    let _this = this;
    new Timer(function() { _this.desexecutarPoder(); }, tempoPoderResta, false, false,
      	{obj: this, atr: "_tempoTotal", estahEmMiliseg: false}); //atualiza quanto tempo falta

    this._tempoTotal = tempoPoderResta;
    //this._tempoRestante = tempoPoderResta; nao precisa setar tempoRestante porque Timer jah faz isso
  }
  desexecutarPoder()
  {
    switch(this._codPoder)
    {
      case TipoPoder.DiminuirTamanhoPers:
        break;

      case TipoPoder.MatarObjetos1Tiro:
        break;

      case TipoPoder.RUIMPersPerdeVel:
        break;

      case TipoPoder.TiroPersMaisRapidoMortal:
        break;

      case TipoPoder.MatarInimigosNaoEssenc:
        break;

      case TipoPoder.ReverterTirosJogoInimDirInim:
        break;

      case TipoPoder.GanharPoucaVida:
        break;

      case TipoPoder.RUIMPersPerdeVida:
        break;

      case TipoPoder.ReverterTirosJogoInimSeguirInim:
        break;

      case TipoPoder.DeixarTempoMaisLento:
        break;

      case Tipo.RUIMTirosPersDirEle:
        break;

      case TipoPoder.GanharMuitaVida:
        break;

      default:
        throw "Esse codigo poder nao existe!";
    }

    ConjuntoObjetosTela.pers.controladorPoderesPers.acabouUsarPoder();
  }

  get tempoTotal() { return this._tempoTotal; }
  get tempoRestante() { return this._tempoRestante.toFixed(1); }
}

const TipoPoder = {
  "DiminuirTamanhoPers": 1, //nao imediatamente
  "MatarObjetos1Tiro": 2,

  "RUIMPersPerdeVel": 3,
  "TiroPersMaisRapidoMortal": 4, //nao imediatamente
  "MatarInimigosNaoEssenc": 5,

  "ReverterTirosJogoInimDirInim": 6, //nao imediatamente
  "GanharPoucaVida": 7,

  "RUIMPersPerdeVida": 8,
  "ReverterTirosJogoInimSeguirInim": 9,

  "DeixarTempoMaisLento": 10,

  "RUIMTirosPersDirEle": 11,
  "GanharMuitaVida": 12 //nao imediatamente
};
/* IDEIAS DE PODERES:
  Level 3
- Pocao para diminuir tamanho do personagem (nao imediatamente)
- Pocao para matar com um tiro todos os inimigos nao essenciais e obstaculos da tela (imediatamente)

  Level 4
- RUIM: Pocao para personagem perder velocidade
- Poção para tiro do pers andar mais rápido e ser mais mortal (nao imediatamente)
- Pocao para matar todos os inimigos nao essenciais (imediatamente)

  Level 5
- Pocao para reverter todos os tiros de todos os inimigos e do jogo em de personagem e direcao o inimigo mais proximo (nao imediatamente)
- Poção para ganhar um pouco de vida (imediatamente)

  Level 6
- RUIM: Pocao personagem perde vida
- Pocao para reverter todos os tiros de todos os inimigos e do jogo em de personagem e seguindo o inimigo mais proximo (imediatamente)

  Level 7
- Pocao para deixar o tempo mais lento (tudo anda X%) (imediatamente)

  Level 8
- RUIM: Pocao para os tiros do personagem se voltarem na direcao dele (feitico contra o feiticeiro)
- Poção para ganhar muita vida (nao imediatamente)
*/

POCOES RUINS (imediatas):
 - perder vida (Nome: "Burn")
 - tiros do personagem contra ele mesmo (feitico contra o feiticeiro)
 - perder velocidade "Space-Mud" (X%)
adicionar nos lugares

//quando personagem ainda nao pegou
class ObjetoTelaPoder
{
  constructor(x, y, poder)
  // nao faz clone no poder
  {
    //backend propriamente dito
    this._poder = poder;

    //tela
    this._formaGeometrica = this._poder.getFormaGeometrica();
    this._formaGeometrica.x = x;
    this._formaGeometrica.y = y;

    //vivo
    this._vivo = true;
  }

  get vivo() { return this._vivo; }

  intersectaPers(qtdAndarX, qtdAndarY)
  { return Interseccao.vaiTerInterseccao(this._formaGeometrica, ConjuntoObjetosTela.pers, qtdAndarX, qtdAndarY); }

  morreu()
  //jah faz o procedimento depois de morrer (jah faz o procedimento ou deixa o poder guardado para o usuario quiser usar)
  {
    this._vivo = false;
    this._formaGeometrica.corImg = this._poder.getImgMorreu(); //mudar para imgMorto
    this._poder.procMorre(); //faz o procedimento depois de morrer
  }

  draw()
  { this._formaGeometrica.draw(); }
}

const distanciaMinPersPoder = 350; //calculado a distancia entre os centro-de-massas
const tempoVaiFicarTela = 7000;
class ControladorPoderTela
{
  constructor()
  {
    this._objPoder = null;
    this._jahProgramouDeixarPoderTela = false; //se jah criou o Timer para colocar Poder tela
    this._auxColTirPoderTempo = 0;
  }

  get jahProgramouDeixarPoderTela() { return this._jahProgramouDeixarPoderTela; }
  static levelTemPoder(level) { return level >= 3; }

  //antes do poder ter sido adicionado a tela
  colocarPoderEmTempoSeChance(level)
  //esse metodo vai adicionar um poder randomico possivel depois de certo tempo (depois de fazer a verificacao de se o
  //level atual tem poderes e de ver a chance/%) e jah vai programar para tira-lo caso ele nao seja pego dentro do tempo
  {
    if (this._jahProgramouDeixarPoderTela || !ControladorPoderTela.levelTemPoder(this._level) || //se jah fez um timer para colocar poder na tela ou se o level atual nao tem poderes possiveis
      !Probabilidade.chance(3,5)) // 3/5 = 60% de chance de ter um poder no level (se ainda nao tem um e se o level atual tem poderes disponiveis)
      return;

    let _this = this;

    //random de tempo para colocar na tela e jah setar timer para colocar poder na tela
    let qntTempoFaltaPraColocar = Math.myrandom(2000, (ControladorJogo.tempoEstimadoLevelAtual(level)-1)*1000 - tempoVaiFicarTela); //no minimo 2 segundos e no maximo para acabar um segundo antes do tempo previsto para o level
    new Timer(function() {
      _this._colocarPoderTela(level);
    }, qntTempoFaltaPraColocar, false, false);
    this._jahProgramouDeixarPoderTela = true;

    //programar tira-lo depois de certo tempo
    new Timer(function() { _this.tirarPoderTela(); }, tempoVaiFicarTela + qntTempoFaltaPraColocar, false, false);
  }
  _colocarPoderTela(level)
  {
    this._auxColTirPoderTempo++;

    //escolhe poder randomly de todos os que podem naquele level
    let poderesPossiveis = ControladorPoderTela.poderesPossiveisFromLevel(level);
    if (poderesPossiveis.length == 0) return; //se nao ha nenhum poder possivel nesse level
    let codPoder = poderesPossiveis[Math.myrandom(0, poderesPossiveis.length)];

    let poder = new Poder(codPoder); //cria poder a partir do codigo

    //ponto onde poder nao estah em cima do pers nem muuito perto dele
    let medidasFormaGeom = poder.getFormaGeometrica(true);
    let pontoPode = this._pontoPodeColocar(medidasFormaGeom);

    this._objPoder = new ObjetoPoder(pontoPode.x, pontoPode.y, poder);
  }
  _pontoPodeColocar(medidasFormaGeom)
  {
    let pontoPode = new Ponto(0, 0);
    do
    {
      pontoPode.x = Math.myrandom(espacoLadosTela, width - medidasFormaGeom.width - espacoLadosTela);
      pontoPode.y = Math.myrandom(espacoLadosTela, height - heightVidaUsuario - medidasFormaGeom.height - espacoLadosTela);
    }while(!this._estahLongeSuficientePers(pontoPode, medidasFormaGeom));
    return pontoPode;
  }
  _estahLongeSuficientePers(pontoPode, medidasFormaGeom)
  {
    //ve se estah intersectando
    if (Interseccao.interseccaoRetDesmontado(ConjuntoObjetosTela.pers.formaGeometrica.x, ConjuntoObjetosTela.pers.formaGeometrica.y,
      ConjuntoObjetosTela.pers.formaGeometrica.width, ConjuntoObjetosTela.pers.formaGeometrica.height,
      pontoPode.x, pontoPode.y, medidasFormaGeom.width, medidasFormaGeom.height))
      return false;

    //calcula distancia do centro de massa do personagem ateh o centro de massa do poder
    return ConjuntoObjetosTela.pers.formaGeometrica.centroMassa.distancia
      (pontoPode.mais({x: medidasFormaGeom.width/2, y: medidasFormaGeom.height/2)) //centroMassa do poder
        >= distanciaMinPersPoder;
  }
  // TODO: colocar poderes possiveis
  static poderesPossiveisFromLevel(level)
  //retorna um vetor com todos os indexes de poderes possiveis
  {
    let poderesPossiveis = [];
    let qtd = 0;

    switch(level)
    {
      // TODO: Se houver mais levels colocar mais cases aqui...
      case 10:
      case 9:
      case 8:
        poderesPossiveis[qtd++] = TipoPoder.GanharMuitaVida;
        poderesPossiveis[qtd++] = TipoPoder.RUIMTirosPersDirEle;
      case 7:
        poderesPossiveis[qtd++] = TipoPoder.DeixarTempoMaisLento;
      case 6:
        poderesPossiveis[qtd++] = TipoPoder.ReverterTirosJogoInimSeguirInim;
        poderesPossiveis[qtd++] = TipoPoder.RUIMPersPerdeVida;
      case 5:
        poderesPossiveis[qtd++] = TipoPoder.ReverterTirosJogoInimDirInim;
        poderesPossiveis[qtd++] = TipoPoder.GanharPoucaVida;
      case 4:
        poderesPossiveis[qtd++] = TipoPoder.TiroPersMaisRapidoMortal;
        poderesPossiveis[qtd++] = TipoPoder.MatarInimigosNaoEssenc;
        poderesPossiveis[qtd++] = TipoPoder.RUIMPersPerdeVel;
      case 3:
        poderesPossiveis[qtd++] = TipoPoder.DiminuirTamanhoPers;
        poderesPossiveis[qtd++] = TipoPoder.MatarObjetos1Tiro;
        break;

      default:
        throw "Esse codigo poder nao existe!";
    }

    return poderesPossiveis;
  }

  tirarPoderTela(tirouPorFaltaTempo = true)
  {
    if (tirouPorFaltaTempo)
    {
      this._auxColTirPoderTempo--;
      if (this._auxColTirPoderTempo != 0 || this._objPoder == null)
        break;
    }
    this._objPoder = null;
    this._jahProgramouDeixarPoderTela = false;
  }

  //depois que poder jah foi adicionado a tela
  verificarPersPegouPoder(qtdAndarX, qtdAndarY)
  {
    if (this._objPoder != null && this._objPoder.intersectaPers(qtdAndarX, qtdAndarY))
      this._objPoder.morreu(); //ainda nao tira da tela (soh quando desenhar a ultima vez)
  }

  draw()
  {
    if (this._objPoder != null)
    {
      this._objPoder.draw();

      //se morreu, mostra o objeto pela ultima vez e depois tira ele
      if (!this._objPoder.vivo)
        this.tirarPoderTela(false);
    }
  }
}


//quando personagem jah pegou
//frontend
const heightCadaPoder = 45;
const espacoEntrePoderes = 5;
const qtdSubirAdicionarPoder = 3;
const xPoderes = espacoLadosTela + 5;
const yPrimeiroPoder = height - heightVidaUsuario - 75;
const tempoNomePoderApareceTela = 2500;
class ObjPoderPers
{
  constructor(poder, qtdPoderes)
  //qtdPoderes eh com esse jah
  {
    //backend
    this._poder = poder;

    //tela
    this._formaGeometrica = this._poder.getFormaGeometrica();
    this._formaGeometrica.x = xPoderes;
    this._formaGeometrica.y = yPrimeiroPoder - qtdPoderes*heightCadaPoder - (qtdPoderes-1)*espacoEntrePoderes;

    this._estahSendoUsado = false;
  }

  comecouAUsar()
  {
    this._estahSendoUsado = true;

    //escrever o nome do poder na tela por um certo periodo de tempo
    this._escreverNomePoder = true;
    let _this = this;
    new Timer(function() { _this._escreverNomePoder = false; }, tempoNomePoderApareceTela, false, false);
  }
  get estahSendoUsado() { return this._estahSendoUsado; }

  get poder()
  { return this._poder; }

  mudarY(instrucao)
  //instrucao: 0 = removeu, 1 = comecou a usar, 2 = adicionou
  {
    if (instrucao != 1)
      this._formaGeometrica.y += heightCadaPoder*(adicionou?-1:1);
    else
      this._formaGeometrica.y -= qtdSubirAdicionarPoder / (this._estahSendoUsado?2:1);
      //ps: se estah sendo usado soh sobe metade (soh pela metade de baixo do circlo)
  }

  draw()
  {
    //desenha semi-circulo antes
    if (this._estahSendoUsado)
    {
      let porcDisponivel = this._poderSendoUsado.tempoRestante / this._poderSendoUsado.tempoTotal;

      fill(100);
      let raio = 55;
      let x = this._formaGeometrica.x - 3;
      let y = this._formaGeometrica.y - 4;

      let cor = color("blue");
      if (porcDisponivel == 1)
      {
        strokeWeight();
        stroke(cor);
        ellipse(x, y, raio);
      }else
      {
        strokeWeight(5); //8.5 para 10 (desse strokeWeight para o de baixo)
        stroke(30);
        ellipse(x, y, raio);

        strokeWeight(6);
        stroke(cor);
        arc(x, y, raio, raio, -PI/2, proporc*2*PI - PI/2);
                            //"raio width"
                                  //"raio height"
                                      //angulo em radiano onde comeca (lembrar do circulo trigonometrico)
                                          //angulo em radiano onde termina o circulo (lembrar do circulo trigonometrico)
        // o circulo trigonometrico usado deve ser no sentido contrario (aumenta em sentido horario)
      }

      noStroke(); fill(255);
      // TODO: colocar font tops
      text(this._poder.tempoRestante + "s", x + 2*raio - 4, y + 2*raio + 2); //quanto tempo falta

      if (this._escreverNomePoder)
      {
        // TODO: aumentar tamanho font
        text(this._poder.nome, x + 2*raio + 5, y + 2*raio + 2); //escrever nome do poder
      }
    }

    //desenha poder em si
    this._formaGeometrica.draw();
  }
}

//backend
const maxPoderesAcumulados = 4;
class ControladorPoderesPers
{
  constructor()
  {
    this._poderesPers = new ListaDuplamenteLigada();
    //os que nao estao sendo usados e o que estah (se houver)
  }

  usarPoder()
  {
    if (this._poderesPers.qtdElem > 0 && !this._poderesPers.primeiroElemento.estahSendoUsado)
    // se tem algum poder para usar && se nao tem nenhum poder sendo usado (soh pode usar um poder por vez)
    {
      this._poderesPers.primeiroElemento.poder.executarPoder(); //executar poder
      this._poderesPers.primeiroElemento.comecouAUsar(); //dizer que comecou a usar o poder

      //arrumar lugar dos poderes agora que comecou a usar (circulo em volta)
      this._arrumarLugarPoderes(InstrucaoArrumarLugar.comecouAUsar);
    }
  }
  adicionarPoder(poder)
  {
    this._poderesPers.inserirNoComeco(new ObjPoderPers(poder, this._poderesPers.qtdElem+1));

    if (this._poderesPers.qtdElem >= maxPoderesAcumulados + 1)
    //se tem mais poderes do que pode
      this._poderesPers.removerDoFinal();

    //arrumar lugar dos poderes agora que adicionou um embaixo
    this._arrumarLugarPoderes(InstrucaoArrumarLugar.adicionou);
  }

  acabouUsarPoder()
  {
    //remover poder que acabou de se usado
    this._poderesPers.removerDoComeco();
    //(agora o primeiro poder do personagem nao estah sendo usado mais)

    //arrumar lugar dos poderes agora que removeu o de baixo
    this._arrumarLugarPoderes(InstrucaoArrumarLugar.removeu);
  }

  _arrumarLugarPoderes(instrucao)
  //instrucao: removeu, comecou a usar ou adicionou
  {
    for (this._poderesPers.colocarAtualComeco(); !this._poderesPers.atualEhNulo; this._poderesPers.andarAtual())
      this._poderesPers.atual.mudarY(instrucao);
  }

  //desenhar todos os poderes
  draw()
  {
    for (this._poderesPers.colocarAtualComeco(); !this._poderesPers.atualEhNulo; this._poderesPers.andarAtual())
      this._poderesPers.atual.draw();
  }
}

const InstrucaoArrumarLugar = {"removeu": 0, "comecouAUsar": 1, "adicionou": 2};
