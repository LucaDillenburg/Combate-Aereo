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