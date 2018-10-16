class ObjetoTela
{
  constructor(formaGeometrica)
  {
    this._formaGeometrica = formaGeometrica;
  }

  get formaGeometrica()
  { return this._formaGeometrica; }

  colocarNoMeioX()
  { this._formaGeometrica.colocarNoMeioX(); }

  draw()
  { this._formaGeometrica.draw(); }
}

class Tiro extends ObjetoTela
{
  constructor(formaGeometrica, corMorto, qtdAndarX, qtdAndarY, ehDoPers, mortalidade)
  {
    super(formaGeometrica);

    //cor
    this._corMorto = corMorto;

    //eh andar
    this._qtdAndarX = qtdAndarX;
    this._qtdAndarY = qtdAndarY;

    //mortalidade
    this._mortalidade = mortalidade;

    //eh do pers
    this._ehDoPers = ehDoPers;

    //morto
    this._morto = false;
  }

  //getters e setters (nao cor)
  get mortalidade()
  { return this._mortalidade; }
  set mortalidade(qtd)
  { this._mortalidade = qtd; }
  mudarMortalidade(qtdMudar)
  { this._mortalidade += qtdMudar; }

  get ehDoPers()
  { return this._ehDoPers; }
  get qtdAndarX()
  { return this._qtdAndarX; }
  get qtdAndarY()
  { return this._qtdAndarY; }

  get morto()
  { return this._morto; }
  morreu()
  { this._morto = true; }

  //andar
  andar(pers, obstaculos, inimigos)
  //retorna o estado do tiro depois dele andar: SAIU_TELA, ESTAH_VIVO ou COLIDIU
  {
    if (this._ehDoPers)
    //ver se colidiu com obstaculos e inimigos
      return this._estadoTiroPosAndarEhPers(obstaculos, inimigos);
    else
    //ver se colidiu com personagem
      return this._estadoTiroPosAndarNaoEhPers(pers);
  }

  _estadoTiroPosAndarEhPers(obstaculos, inimigos)
  {
    let colidiu = false;

    let menorHeight = height;
    let menorWidth = width;

    let listaBateu = new ListaDuplamenteLigada();

    let qtdPodeAndarX = this._qtdAndarX;
    let qtdPodeAndarY = this._qtdAndarY;
    let menorHipotenusa = Operacoes.hipotenusa(qtdPodeAndarX, qtdPodeAndarY);

    let qtdObstaculos = (obstaculos==null?0:obstaculos.length);
    let qtdInimigos = (inimigos==null?0:inimigos.length);

    //passa por todos inimigos e obstaculos
    for(let i = 0; i<qtdObstaculos+qtdInimigos; i++)
    {
      let objTelaRealAtual; //objeto tela que colide (obstaculo ou inimigo)
      if (i < qtdObstaculos)
      //primeiro obstaculos
        objTelaRealAtual = obstaculos[i];
      else
      //depois inimigos
        objTelaRealAtual = inimigos[i-qtdObstaculos];

      let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objTelaRealAtual.formaGeometrica, this._formaGeometrica, qtdPodeAndarX, qtdPodeAndarY);
      let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

      //se tiro vai bater em um obstaculo mais perto que o outro
      if (hipotenusa < menorHipotenusa || (!listaBateu.vazia() && hipotenusa == menorHipotenusa))
      {
        menorHipotenusa = hipotenusa;
        qtdPodeAndarX = qtdPodeAndar.x;
        qtdPodeAndarY = qtdPodeAndar.y;
        colidiu = true;

        if (!listaBateu.vazia()
          && listaBateu.primeiroElemento.y != objTelaRealAtual.y)
        {
          listaBateu.esvaziar();

          menorHeight = objTelaRealAtual.formaGeometrica.height;
          menorWidth = objTelaRealAtual.formaGeometrica.width;
        }else
        {
          if (objTelaRealAtual.formaGeometrica.height < menorHeight)
            menorHeight = objTelaRealAtual.formaGeometrica.height;
          if (objTelaRealAtual.formaGeometrica.width < menorWidth)
            menorWidth = objTelaRealAtual.formaGeometrica.width;
        }
        listaBateu.inserirNoComeco(objTelaRealAtual);
      }
    }

    let qntEntra = this._qntEntra(menorWidth, menorHeight);
    this._formaGeometrica.x += qtdPodeAndarX + qntEntra.x;
    this._formaGeometrica.y += qtdPodeAndarY + qntEntra.y;

    //tirar vida de todos os inimigos que bateu (soh ha mais de um objeto se eles estao no mesmo Y)
    if (inimigos != null)
    {
      listaBateu.colocarAtualComeco();
      while (!listaBateu.atualEhNulo)
      {
        if (listaBateu.atual instanceof Inimigo || listaBateu.atual instanceof ObstaculoComVida)
        //se tem vida, tira
          this.tirarVidaObjCmVida(listaBateu.atual);
        listaBateu.andarAtual();
      }
    }

    //soh verifica se tiro saiu agora pois o tiro pode acertar o inimigo fora da tela
    if (Tela.objSaiuTotalmente(this._formaGeometrica))
      return Tiro.SAIU_TELA;
    return (colidiu?Tiro.COLIDIU:Tiro.ESTAH_VIVO);
  }

  _estadoTiroPosAndarNaoEhPers(pers)
  {
    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(pers.formaGeometrica, this._formaGeometrica, this._qtdAndarX, this._qtdAndarY);
    if (qtdPodeAndar.x < this._qtdAndarX || qtdPodeAndar.y < this._qtdAndarY)
    {
      let qntEntra = this._qntEntra(pers.formaGeometrica.width, pers.formaGeometrica.height);
      this._formaGeometrica.x += qtdPodeAndar.x;
      this._formaGeometrica.y += qtdPodeAndar.y;
      if (Tela.objSaiuTotalmente(this._formaGeometrica))
        return Tiro.SAIU_TELA;

      this.tirarVidaObjCmVida(pers);

      return Tiro.COLIDIU;
    }else
    {
      this._formaGeometrica.x += this._qtdAndarX;
      this._formaGeometrica.y += this._qtdAndarY;

      if (Tela.objSaiuTotalmente(this._formaGeometrica))
        return Tiro.SAIU_TELA;
      return Tiro.ESTAH_VIVO;
    }
  }

  _qntEntra(menorWidth, menorHeight)
  {
    //ver quanto o tiro deve entrar no obstaculo ou inimigo
    let mult = 0.2; //multiplicador do this._qtdAndarX e this._qtdAndarY
    let mudarQntEntra = 0;
    if (mult*this._qtdAndarX > menorWidth/2)
      mudarQntEntra++;
    if (mult*this._qtdAndarY > menorHeight/2)
      mudarQntEntra += 2;

    let qntEntraX;
    let qntEntraY;
    if (mudarQntEntra)
    {
      switch (mudarQntEntra)
      {
        case 1:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = (menorWidth/2)/qntEntraY
          qntEntraX = menorWidth/2;
          qntEntraY = (qntEntraX*this._qtdAndarY)/this._qtdAndarX;
          break;
        case 2:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = qntEntraX/(menorHeight/2)
          qntEntraY = menorHeight/2;
          qntEntraX = (qntEntraY*this._qtdAndarX)/this._qtdAndarY;
          break;
        case 3:
          //regra de tres: this._qtdAndarX/this._qtdAndarY = (menorWidth/2)/qntEntraY
          let qntEntraX1 = menorWidth/2;
          let qntEntraY1 = (qntEntraX*this._qtdAndarY)/this._qtdAndarX;

          let qntEntraY2 = menorHeight/2;

          if (qntEntraY1 <= qntEntraY2)
          {
            qntEntraX = qntEntraX1;
            qntEntraY = qntEntraY1;
          }else
          {
            //regra de tres: this._qtdAndarX/this._qtdAndarY = qntEntraX/(menorHeight/2)
            qntEntraY = qntEntraY2;
            qntEntraX = (qntEntraY*this._qtdAndarX)/this._qtdAndarY;
          }
          break;
      }
    }else
    {
      qntEntraX = mult*this._qtdAndarX;
      qntEntraY = mult*this._qtdAndarY;
    }

    return {x: qntEntraX, y: qntEntraY};
  }

  static get ESTAH_VIVO()
  { return 0; }
  static get COLIDIU()
  { return -1; }
  static get SAIU_TELA()
  { return -2; }

  tirarVidaObjCmVida(obj)
  { obj.mudarVida(-this._mortalidade); }

  //desenho
  get corMorto()
  { return this._corMorto; }
  set fillMorto(fill)
  { this._corMorto.fill = fill; }
  set strokeMorto(stroke)
  { this._corMorto.stroke = stroke; }
  draw()
  {
    if (this._morto)
    {
      this._formaGeometrica.fillColor = this._corMorto.fill;
      this._formaGeometrica.strokeColor = this._corMorto.stroke;
    }
    super.draw();
  }

  clone()
  {
    return new Tiro(this._formaGeometrica, this._corMorto, this._qtdAndarX, this._qtdAndarY, this._ehDoPers, this._mortalidade);
  }
}


class Obstaculo extends ObjetoTela
{
  constructor(formaGeometrica, corEspecial, qtdAndarXPadrao, qtdAndarYPadrao)
  {
    super(formaGeometrica);

    //cor
    this._corEspecial = corEspecial;
    this._especial = false;

    //andar
    this._qtdAndarXPadrao = qtdAndarXPadrao;
    this._qtdAndarYPadrao = qtdAndarYPadrao;
  }

  andar(pers, qtdAndarX, qtdAndarY)
  {
    if (qtdAndarX == null)
      qtdAndarX = this._qtdAndarXPadrao;
    if (qtdAndarY == null)
      qtdAndarY = this._qtdAndarYPadrao;

    //ver se vai bater ou nao: empurrar pers e bater em tiros (soh do personagem)
    if (Interseccao.vaiTerInterseccao(pers.formaGeometrica, this._formaGeometrica, qtdAndarX, qtdAndarY))
    {
      //pers.mudarX(pers.formaGeometrica.x - (this._formaGeometrica. + qtdAndarX))
    }

    this._formaGeometrica.x += qtdAndarX;
    this._formaGeometrica.y += qtdAndarY;
  }

  //desenhar
  get especial()
  { return this._especial; }
  set especial(esp)
  { this._especial = esp; }
  draw()
  {
    if (this._especial)
    {
      this._formaGeometrica.fillColor = this._corEspecial.fill;
      this._formaGeometrica.strokeColor = this._corEspecial.stroke;
    }
    super.draw();
  }
}

class ObstaculoComVida extends Obstaculo
{
  //extends Obstaculo pq funcao igual a do obstaculo (mesmo andar()) e nao vai desenhar vida e varios casos

  constructor(formaGeometrica, corEspecial, qtdAndarXPadrao, vida, qtdAndarYPadrao)
  {
    super(formaGeometrica, corEspecial, qtdAndarXPadrao, qtdAndarYPadrao);
    this._vida = vida;
  }

  //getters e setters vida
  get vida()
  { return this._vida; }
  mudarVida(qtdMuda)
  {
    this._vida += qtdMuda;
    if (this._vida < 0)
        this._vida = 0;
    return this._vida != 0;
  }

  //draw (como vai desenhar a vida, vai desenhar a vida?)
}
