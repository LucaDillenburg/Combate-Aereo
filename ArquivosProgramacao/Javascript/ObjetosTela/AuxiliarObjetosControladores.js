//OBJETOS
class AuxInfo
{
  static cloneImgCor(imgCor)
  {
    if (imgCor.stroke === undefined)
      return imgCor; //nao precisa de clone
    else
      return {stroke: imgCor.stroke, fill: imgCor.fill}; //clone
  }
}

class AuxObjetos
{
  static continuaNoVetor(objeto)
  //objeto: ObjetoTela
  {
    //se for tiro ou objeto com TipoAndar=Seguir, verifica se estah ateh uma margem fora da tela, continua no vetor (pois (1.)pode interagir com algum objeto que ainda esteja dentro da tela e (2.)se for TipoAndar.Seguir... pode voltar pra tela - se jah estah muito longe de voltar pra tela tira do vetor)
    const tipoAndarEhSeguir = objeto.classeAndar.tipoAndar == TipoAndar.SeguirPers ||
      objeto.classeAndar.tipoAndar == TipoAndar.SeguirInimMaisProx;

    if (tipoAndarEhSeguir || objeto instanceof Tiro)
    {
      let margem;
      if (objeto instanceof Tiro)
      {
        if (tipoAndarEhSeguir)
          margem = 0.12*height;
        else
          margem = 100;
      }else
        margem = 0.2*height + 0.5*objeto.formaGeometrica.height;

      // ver se estah dentro da tela considerando margem
      return objeto.formaGeometrica.maiorX >= -margem && objeto.formaGeometrica.menorX <= width + margem && //horizontalmente
        objeto.formaGeometrica.maiorY >= -margem && objeto.formaGeometrica.menorY <= height - heightVidaUsuario + margem; //verticalmente
    }else
    //sem margem
      return !Tela.objSaiuTotalmente(objeto.formaGeometrica);
  }

  //para objetos com colisao com personagem tipo Obstaculo
  static procColisaoEstaticaObstComPers(objetoBarra)
  //nao deixar pers em cima de objetoBarra
  //retorna se conseguiu empurrar ou se nem precisou
  {
    if (ControladorJogo.pers.interseccao(objetoBarra.formaGeometrica))
    {
      //verifica qual direcao eh mais facil para o personagem sair de cima do objetoBarra
      const qtdAndar = Interseccao.menorQtdObjColidePararColidir(objetoBarra.formaGeometrica, ControladorJogo.pers.formaGeometrica);

      if (qtdAndar.x===0 && qtdAndar.y===0)
      //se nao andou nada
        return true;

      if (objetoBarra instanceof Obstaculo || objetoBarra instanceof Inimigo)
        ControladorJogo.pers.colidiuObj(objetoBarra);

      //tenta empurrar personagem para parar de colidir
      return ControladorJogo.pers.mudarXY(qtdAndar.x, qtdAndar.y);
    }else
      return true;
  }
  static qtdPersPodeAndar(objetoBarra, infoQtdMudar)
  {
    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objetoBarra.formaGeometrica, ControladorJogo.pers.formaGeometrica,
      infoQtdMudar.qtdMudarXPadrao, infoQtdMudar.qtdMudarYPadrao, false);

    //se personagem vai bater em um objetoBarra mais perto (pelo menos em alguma direcao) que o outro
    if ((qtdPodeAndar.x !== infoQtdMudar.qtdMudarXPadrao || qtdPodeAndar.y !== infoQtdMudar.qtdMudarYPadrao) && //se andou menos que alguma direcao em qtdAndarXYPadrao
      (Math.abs(qtdPodeAndar.x) <= Math.abs(infoQtdMudar.qtdPodeMudarX) || Math.abs(qtdPodeAndar.y) <= Math.abs(infoQtdMudar.qtdPodeMudarY)))
    {
      // se esse objetoBarra estah mais perto que os outros nas duas direcoes
      if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX) && Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
        infoQtdMudar.objetosBarraram = [];
      infoQtdMudar.objetosBarraram.push(objetoBarra);

      if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX))
        infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
      if (Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
        infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
    }
  }
}

//TIPOS DE OBJETOS TELA (quando precisar guardar qual o tipo do ObjetoTela - ex: morreu dos tiros)
class TipoObjetos
{
  //retorna o numero que representa o tipo do objeto
  static fromObj(obj)
  {
    if (obj instanceof Tiro)
      return TipoObjetos.Tiro;
    if (obj instanceof Obstaculo)
      return TipoObjetos.Obstaculo;
    if (obj instanceof Inimigo)
      return TipoObjetos.Inimigo;
    if (obj instanceof PersonagemPrincipal)
      return TipoObjetos.Personagem;
    if (obj instanceof SuporteAereo)
      return TipoObjetos.SuporteAereo;
    if (obj instanceof Pocao)
      return TipoObjetos.Pocao;
  }

  //getters ("constantes")
  static get Tiro()
  { return 1; }
  static get Obstaculo()
  { return 2; }
  static get Inimigo()
  { return 3; }
  static get Personagem()
  { return 4; }
  static get SuporteAereo()
  { return 5; }
  static get Pocao()
  { return 6; }
}

//CONTROLADORES OBJETOS
/* BASE DE UM CONTROLADOR:
class ControladorObjetos
{
  constructor(objetoPadrao)

  get objetoPadrao()

  adicionarObjeto(x, y, ...)
  adicionarObjetoDif(x, y, objeto)

  andarObjetos(...)

  draw()
}
*/
class AuxControladores
{
 //para Adicionar Objetos:
  //rotacionar
  static alteracoesRotacionarFormaGeometrica(infoObj, alteracoesRotacionar)
  // alteracoesRotacionar: {direcaoAnguloAponta, ehAngulo, setRotacao=true}
  //a nao ser que setRotacao=false, vai fazer forma.setRotacao(). caso contrario, forma.rotacionar
  {
    // se nao estah pedindo pra mudar nada
    if (alteracoesRotacionar===undefined || alteracoesRotacionar.ehAngulo===undefined)
      return;

    let anguloRotacaoFinal;
    if (alteracoesRotacionar.ehAngulo===true)
      anguloRotacaoFinal = alteracoesRotacionar.direcaoAnguloAponta;
    else
      switch(alteracoesRotacionar.direcaoAnguloAponta)
      // cima, baixo, direita, esquerda
      {
        case Direcao.Cima:  anguloRotacaoFinal = 0; break; //0
        case Direcao.Baixo:  anguloRotacaoFinal = PI; break; //180
        case Direcao.Direita:  anguloRotacaoFinal = PI/2; break; //90
        case Direcao.Esquerda:  anguloRotacaoFinal = -PI/2; break; //-90
      }

    if (alteracoesRotacionar.setRotacao===false)
      infoObj.formaGeometrica = infoObj.formaGeometrica.rotacionar(anguloRotacaoFinal);
    else
      infoObj.formaGeometrica = infoObj.formaGeometrica.setRotacao(anguloRotacaoFinal);
  }

  //aparecer
  static infoObjAparecendoCorreto(infoObjAparecendo, infoObjAparecendoPadrao)
  {
    if (infoObjAparecendo === undefined)
      infoObjAparecendo = infoObjAparecendoPadrao;
    else
      mergeInfoNovoComPadrao(infoObjAparecendo, infoObjAparecendoPadrao);
    return infoObjAparecendo;
  }
}
