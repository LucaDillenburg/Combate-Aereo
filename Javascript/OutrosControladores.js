//import "ObjetosSimples.js";

/*interface ControladorObjetos
{
  constructor(objetoPadrao)

  get objetoPadrao()

  adicionarObstaculo(x, y, qtdAndarX, qtdAndarY, ..., formaGeometrica, ...)
  adicionarObstaculoDif(x, y, objeto)

  andarObjetos(...)

  draw()
}*/

class ControladorTiros
{
  constructor(tiroPadrao, ehPersPrinc)
  {
    //padrao
    this._tiroPadrao = tiroPadrao;
    this._ehPersPrinc = ehPersPrinc;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os tiros no comeco e quando eles sairem da tela ou baterem tirar da lista
    this._tiros = new ListaDuplamenteLigada();
  }

  get tiroPadrao()
  { return this._tiroPadrao; }

  //novo tiro
  adicionarTiro(x, y, controladoresInimigos, qtdAndarX, qtdAndarY, tipoAndar, corMorto, mortalidade, formaGeomTiro)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (qtdAndarX == null)
      qtdAndarX = this._tiroPadrao.qtdAndarX;
    if (qtdAndarY == null)
      qtdAndarY = this._tiroPadrao.qtdAndarY;
    if (tipoAndar == null)
      tipoAndar = this._tiroPadrao.tipoAndar;
    if (corMorto == null)
      corMorto = this._tiroPadrao.corMorto;
    if (mortalidade == null)
      mortalidade = this._tiroPadrao.mortalidade;
    if (formaGeomTiro == null)
      formaGeomTiro = this._tiroPadrao.formaGeomTiro;

    formaGeomTiro.x = x;
    formaGeomTiro.y = y;

    this._adicionarTiro(new Tiro(formaGeomTiro, corMorto, qtdAndarX, qtdAndarY, tipoAndar, controladoresInimigos, this._ehPersPrinc, mortalidade));
  }
  adicionarTiroDif(x, y, tiro)
  {
		if (tiro == null)
      tiro = this._tiroPadrao;

    let novoTiro = tiro.clone();
    novoTiro.ehDoPers = this._ehPersPrinc;
    novoTiro.formaGeometrica.x = x;
    novoTiro.formaGeometrica.y = y;
    this._adicionarTiro(novoTiro);
  }
  _adicionarTiro(novoTiro)
  {
    //adicionar novo tiro ao comeco da lista
		this._tiros.inserirNoComeco(novoTiro);
  }

  //mover tiros
  andarTiros(pers, controladoresObstaculos, controladoresInimigos)
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
      if (!this._tiros.atual.vivo)
      // se ele estava morto e soh nao foi tirado da lista porque colidiu e queria-se mostrar a colisao, agora remove
        this._tiros.removerAtual();
      else
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaLista = this._tiros.atual.andar(pers, controladoresObstaculos, controladoresInimigos);
        if (!continuaLista)
  				this._tiros.removerAtual();
      }

      this._tiros.andarAtual();
		}
  }

  //quando personagem com vida  ou obstaculo se mover
  static get PERSONAGEM_ANDOU()
  { return Tiro.COLIDIU_COM_PERSONAGEM; }
  static get INIMIGOS_ANDOU()
  { return Tiro.COLIDIU_COM_INIMIGO; }
  static get OBSTACULOS_ANDOU()
  { return Tiro.COLIDIU_COM_OBSTACULO; }
  procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY, quemAndou, indexAndou) //soh precisa de indexAndou se quem andou for inimigo ou obstaculo
  {
    if (quemAndou == null && !this._ehPersPrinc)
        quemAndou = ControladorTiros.PERSONAGEM_ANDOU;

    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		this._tiros.colocarAtualComeco();

		while (!this._tiros.atualEhNulo)
		{
      if (this._tiros.atual.vivo)
      {
        if (Interseccao.vaiTerInterseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudaY))
        {
          //se objeto tela tem vida
          if (objTelaColide instanceof PersComTiros || objTelaColide instanceof ObstaculoComVida)
            this_tiros.atual.tirarVidaObjComVida(objTelaColide);
          this._tiros.atual.morreu(quemAndou, indexAndou);
        }
      }else
        //O TIRO MORTO VAI SAIR DA LISTA [...] QUANDO EM QUEM ELE BATEU ANDAR
        if (this._tiros.atual.ehQuemBateu(quemAndou, indexAndou))
          this._tiros.removerAtual();

      this._tiros.andarAtual();
		}
  }

	//draw
    //desenha todos os tiros
	draw()
	{
		this._tiros.colocarAtualComeco();
		while (!this._tiros.atualEhNulo)
    {
      this._tiros.atual.draw();
      //se tiro jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._tiros.atual.vivo)
        this._tiros.removerAtual();
      this._tiros.andarAtual();
    }
	}
}

class ControladorObstaculos
{
  //O OBSTACULO MORTO SOH VAI SAIR DA LISTA [...] QUANDO OS TIROS DO PERSONAGEM ANDAREM (e o obstaculo tiver colidido com os tiros do pers)
  //ou QUANDO O PERSONAGEM ANDAR (e o obstaculo tiver colidido com o personagem- TEORICAMENTE ESSE ESTAH CERTO em verificarColidirComTiro(...))

  constructor(obstaculoPadrao)
  {
    //padrao
    this._obstaculoPadrao = obstaculoPadrao;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._obstaculos = new ListaDuplamenteLigada();
    //pode ter obstaculos sem vida e outroscom
  }

  get obstaculoPadrao()
  { return this._obstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculo(x, y, vida, qtdAndarX, qtdAndarY, tipoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, corEspecial, formaGeometrica)
  //ps: o parametro vida deve ser false se ele nao tem vida ou o numero da vida inicial do obstaculo se ele tem.
  // se ele for null, sera pego a vida do obstaculo padrao se ele tiver e se ele nao tiver serah considerado false

  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      this._obstaculoPadrao.formaGeometrica.x;
    if (y == null)
      this._obstaculoPadrao.formaGeometrica.y;
    if (qtdAndarX == null)
      qtdAndarX = this._obstaculoPadrao.qtdAndarX;
    if (qtdAndarY == null)
      qtdAndarY = this._obstaculoPadrao.qtdAndarY;
    if (corEspecial == null)
      corEspecial = this._obstaculoPadrao.corEspecial;
    if (formaGeometrica == null)
      formaGeometrica = this._obstaculoPadrao.formaGeometrica;

    formaGeomTiro.x = x;
    formaGeomTiro.y = y;

    //vida (Obstaculo com Vida ou sem)
    if (vida == null)
    {
      if (this._obstaculoPadrao.vida != null)
      //se obstaculo padrao tem vida
        vida = this._obstaculoPadrao.vida;
      else
      //se ele nao tem vida
        vida = false;
    }

    let novoObstaculo;
    if (vida && vida > 0) //se vida eh um numero (essa vida tem que ser maior que zero)
       novoObstaculo = new ObstaculoComVida(formaGeometrica, corEspecial, qtdAndarX, qtdAndarY, tipoAndar,
         qtdTiraVidaNaoConsegueEmpurrarPers, vida);
    else
      novoObstaculo = new Obstaculo(formaGeometrica, corEspecial, qtdAndarX, qtdAndarY, tipoAndar, qtdTiraVidaNaoConsegueEmpurrarPers);
    this._adicionarObstaculo(novoObstaculo);
  }
  adicionarObstaculoDif(x, y, obstaculo)
  {
		if (obstaculo == null)
      obstaculo = this._tiroPadrao;

    let novoObstaculo = obstaculo.clone();
    novoObstaculo.formaGeometrica.x = x;
    novoObstaculo.formaGeometrica.y = y;
    this._adicionarObstaculo(novoObstaculo);
  }
  _adicionarObstaculo(novoObstaculo)
  {
    //adicionar novo obstaculo ao comeco da lista
		this._obstaculos.inserirNoComeco(novoObstaculo);
  }


 //andar
  //andar objetos
  andarObstaculos(indexContrObst, pers, contrObst, contrInim, contrTiros)
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._obstaculos.atual.andar(indexContrObst, pers, contrObst, contrInim, contrTiros);
        if (!continuaNaLista)
          this._obstaculos.removerAtual();
      }else
        this._obstaculos.removerAtual();
  }

  //andar personagem
  qtdPersPodeAndar(persAndou)
  {
    //o valor default eh TRUE (pois normalmente esse metodo vai ser chamado quando ele andar)
    if (persAndou == null)
      persAndou = true;

    //TODO TODO
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {

      }else
        if (persAndou)
          this._obstaculos.removerAtual();
  }


  //colisao com tiro
  verificarColidirComTiro(info, tiroPersAndou)
  //esses metodos funcionam por passagem por referencia
  {
    if (tiroPersAndou == null)
      tiroPersAndou = true;

    let inseriu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = inseriu || AuxControladores.auxAndarTiro(info, this._obstaculos.atual);
      else
        if (tiroPersAndou && !this._obstaculos.atual.explodiu)
        //se tiros do personagem andaram e esse obstaculo morreu por tiro do pers (nao explodiu com o personagem em si)
          this._obstaculos.removerAtual();
    return inseriu;
  }

	//draw
    //desenha todos os obstaculos
	draw()
	{
		this._obstaculos.colocarAtualComeco();
		while (!this._obstaculos.atualEhNulo)
    {
      this._obstaculos.atual.draw();
      //se obstaculo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._obstaculos.atual.vivo)
        this._obstaculos.removerAtual();
      this._obstaculos.andarAtual();
    }
	}
}

class ControladorInimigos
{
  O INIMIGO MORTO SOH VAI SAIR DA LISTA DEPOIS QUE FOR PRINTADO NA TELA, QUANDO TODOS OS INIMIGOS ANDAREM OU QUANDO OS TIROS DO PERSONAGEM ANDAREM
  (OU QUANDO ELE SAIR DA TELA)

  //colisao com tiro
  verificarColidirComTiro(info, tiroPersAndou)
  //esses metodos funcionam por passagem por referencia
  {
    if (tiroPersAndou == null)
      tiroPersAndou = true;

    let inseriu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = inseriu || AuxControladores.auxAndarTiro(info, this._inimigos.atual);
      else
        if (tiroPersAndou)
        //os inimigos soh morrem por tiro do pers
          this._inimigos.removerAtual();
    return inseriu;
  }

  //para andar ateh inimigo
	qntAndarInimigoMaisProximo(formaGeometrica)
	{
    let menorHipotenusa = null;
    let qtdAndar = {x: null, y: null, inim: null};
		this._inimigos.colocarAtualComeco();
		while (!this._inimigos.atualEhNulo)
    {
      if (this._inimigos.vivo)
      {
        let qntAndar = qntAndarParaBater(formaGeometrica, this._inimigos.atual);
        let hipotenusa = Operacoes.hipotenusa(qntAndar.x, qntAndar.y);
        if (menorHipotenusa == null || hipotenusa < menorHipotenusa)
        {
          qtdAndar.x = qntAndar.x;
          qtdAndar.y = qntAndar.y;
          qtdAndar.inim = this._inimigos.atual;
          menorHipotenusa = hipotenusa;
        }
      }

      this._inimigos.andarAtual();
    }

    return qtdAndar;
	}
}

class AuxControladores
{
  auxAndarTiro(info, objTelaRealAtual)
  //retorna se inseriu
  //info: menorHipotenusa, listaBateu, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, colidiu
  {
    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objTelaRealAtual.formaGeometrica, this._formaGeometrica, info.qtdPodeAndarX, info.qtdPodeAndarY);
    let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    let inseriu = false;

    //se tiro vai bater em um obstaculo mais perto que o outro
    if (hipotenusa < info.menorHipotenusa || (!info.listaBateu.vazia() && hipotenusa == info.menorHipotenusa))
    {
      info.menorHipotenusa = hipotenusa;
      info.qtdPodeAndarX = qtdPodeAndar.x;
      info.qtdPodeAndarY = qtdPodeAndar.y;
      info.colidiu = true;

      if (!info.listaBateu.vazia() && info.listaBateu.primeiroElemento.y != objTelaRealAtual.y)
      {
        info.listaBateu.esvaziar();

        info.menorHeight = objTelaRealAtual.formaGeometrica.height;
        info.menorWidth = objTelaRealAtual.formaGeometrica.width;
      }else
      {
        if (objTelaRealAtual.formaGeometrica.height < info.menorHeight)
          info.menorHeight = objTelaRealAtual.formaGeometrica.height;
        if (objTelaRealAtual.formaGeometrica.width < info.menorWidth)
          info.menorWidth = objTelaRealAtual.formaGeometrica.width;
      }
      info.listaBateu.inserirNoComeco(objTelaRealAtual);
      inseriu = true;
    }

    return inseriu;
  }
}
