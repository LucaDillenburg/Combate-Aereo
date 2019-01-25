//OBJETOS
function minDirecao(valorDir1, valorDir2)
{
  if (valorDir1.valor <= valorDir2.valor)
    return valorDir1;
  else
    return valorDir2;
}

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
  //aparecer
  static infoObjAparecendoCorreto(infoObjAparecendo, infoObjAparecendoPadrao)
  {
    if (infoObjAparecendo === undefined)
      infoObjAparecendo = infoObjAparecendoPadrao;
    else
    {
      //Atributos: mudarOpacidade, mudarTamanho, qtdAndar
      if (infoObjAparecendo.mudarOpacidade === undefined)
        infoObjAparecendo.mudarOpacidade = infoObjAparecendoPadrao.mudarOpacidade;
      if (infoObjAparecendo.mudarTamanho === undefined)
        infoObjAparecendo.mudarTamanho = infoObjAparecendoPadrao.mudarTamanho;
      if (infoObjAparecendo.qtdAndar === undefined)
        infoObjAparecendo.qtdAndar = infoObjAparecendoPadrao.qtdAndar;
    }
    return infoObjAparecendo;
  }
}
