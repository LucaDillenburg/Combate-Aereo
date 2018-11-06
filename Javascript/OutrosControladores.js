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
  adicionarTiro(conjuntoObjetosTela, x, y, mortalidade, tipoAndar, qtdAndar, corImgMorto, formaGeometrica)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      x = this._tiroPadrao.formaGeometrica.x;
    if (y == null)
      y = this._tiroPadrao.formaGeometrica.y;
    if (qtdAndar == null)
    {
      qtdAndar.x = this._tiroPadrao.qtdAndarX;
      qtdAndar.y = this._tiroPadrao.qtdAndarY;
    }
    if (tipoAndar == null)
      tipoAndar = this._tiroPadrao.tipoAndar;
    if (corImgMorto == null)
      corImgMorto = this._tiroPadrao.corImgMorto;
    if (mortalidade == null)
      mortalidade = this._tiroPadrao.mortalidade;
    if (formaGeometrica == null)
      formaGeometrica = this._tiroPadrao.formaGeometrica;

    formaGeometrica.x = x;
    formaGeometrica.y = y;

    this._adicionarTiro(new Tiro(formaGeometrica, corImgMorto, {qtdAndarX: qtdAndar.x, qtdAndarY: qtdAndar.y, tipoAndar: tipoAndar},
      conjuntoObjetosTela.controladoresInimigos, this._ehPersPrinc, mortalidade), conjuntoObjetosTela);
  }
  adicionarTiroDif(conjuntoObjetosTela, x, y, tiro)
  {
		if (tiro == null)
      tiro = this._tiroPadrao;

    let novoTiro = tiro.clone();
    novoTiro.ehDoPers = this._ehPersPrinc;
    if (x != null)
      novoTiro.formaGeometrica.x = x;
    if (y != null)
      novoTiro.formaGeometrica.y = y;
    this._adicionarTiro(novoTiro, conjuntoObjetosTela);
  }
  _adicionarTiro(novoTiro, conjuntoObjetosTela)
  {
    novoTiro.procCriou(conjuntoObjetosTela);

    //adicionar novo tiro ao comeco da lista
		this._tiros.inserirNoComeco(novoTiro);
  }

  //mover tiros
  andarTiros(conjuntoObjetosTela)
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
        let continuaLista = this._tiros.atual.andar(conjuntoObjetosTela);
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
  static get INIMIGOS_CRIADO()
  { return Tiro.COLIDIU_COM_INIMIGO; }
  static get OBSTACULOS_CRIADO()
  { return Tiro.COLIDIU_COM_OBSTACULO; }
  procedimentoObjTelaColideCriar(objTelaColide, quemFoiCriado, indexAndou)
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo && Interseccao.interseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica))
      {
        //se objeto tela tem vida
        if (objTelaColide instanceof PersComTiros || objTelaColide instanceof ObstaculoComVida)
          this_tiros.atual.tirarVidaObjComVida(objTelaColide);
        this._tiros.atual.morreu(quemAndou, indexAndou);
      }
      //coisas que acabaram de ser criadas ainda nao vao ter colidido com ninguem
  }

  //uso: quando os inimigos morrerem passar os tiros deles para controladoresTirosJogo[0]
  concatenarTiros(controladorTiros)
  {
    //os tiros do outro controlador serao passados para esse (sem fazer clone)
    this._tiros.concatenar(controladorTiros._tiros);
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
  adicionarObstaculo(indexContrObst, conjuntoObjetosTela, x, y, vida, qtdAndar, tipoAndar,
    qtdTiraVidaNaoConsegueEmpurrarPers, corImgEspecial, corImgMorto, formaGeometrica)
  //ps: o parametro vida deve ser false se ele nao tem vida ou o numero da vida inicial do obstaculo se ele tem.
  // se ele for null, sera pego a vida do obstaculo padrao se ele tiver e se ele nao tiver serah considerado false

  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      x = this._obstaculoPadrao.formaGeometrica.x;
    if (y == null)
      y = this._obstaculoPadrao.formaGeometrica.y;
    if (qtdAndar == null)
    {
      qtdAndar.x = this._obstaculoPadrao.qtdAndarX;
      qtdAndar.y = this._obstaculoPadrao.qtdAndarY;
    }
    if (tipoAndar == null)
      tipoAndar = this._obstaculoPadrao.tipoAndar;
    if (qtdTiraVidaNaoConsegueEmpurrarPers == null)
      qtdTiraVidaNaoConsegueEmpurrarPers = this._obstaculoPadrao.qtdTiraVidaNaoConsegueEmpurrarPers;
    if (corImgEspecial == null)
      corImgEspecial = this._obstaculoPadrao.corImgEspecial;
    if (corImgMorto == null)
      corImgMorto = this._obstaculoPadrao.corImgMorto;
    if (formaGeometrica == null)
      formaGeometrica = this._obstaculoPadrao.formaGeometrica;

    formaGeometrica.x = x;
    formaGeometrica.y = y;

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

    let infoAndar = {qtdAndarX: qtdAndar.x, qtdAndarY: qtdAndar.y, tipoAndar: tipoAndar};
    let coresImgsDiferentes = {corImgEspecial: corImgEspecial, corImgMorto: corImgMorto};
    let novoObstaculo;
    if (vida == false) // se nao tem vida
      novoObstaculo = new Obstaculo(formaGeometrica, coresImgsDiferentes, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers);
    else
      novoObstaculo = new ObstaculoComVida(formaGeometrica, coresImgsDiferentes, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers,
        vida);

    this._adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst);
  }
  adicionarObstaculoDif(indexContrObst, conjuntoObjetosTela, x, y, obstaculo)
  {
		if (obstaculo == null)
      obstaculo = this._obstaculoPadrao;

    let novoObstaculo = obstaculo.clone();
    if (x != null)
      novoObstaculo.formaGeometrica.x = x;
    if (y != null)
      novoObstaculo.formaGeometrica.y = y;
    this._adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst);
  }
  _adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst)
  {
    novoObstaculo.procCriou(conjuntoObjetosTela, indexContrObst);

    //adicionar novo obstaculo ao comeco da lista
		this._obstaculos.inserirNoComeco(novoObstaculo);
  }


 //andar
  //andar objetos
  andarObstaculos(conjuntoObjetosTela, indexContrObst)
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._obstaculos.atual.andar(conjuntoObjetosTela, indexContrObst);
        if (!continuaNaLista)
          this._obstaculos.removerAtual();
      }else
        this._obstaculos.removerAtual();
  }

  //andar personagem
  qtdPersPodeAndar(infoQtdMudar, formaGeomPers, persAndou)
  {
    //o valor default eh TRUE (pois normalmente esse metodo vai ser chamado quando ele andar)
    if (persAndou == null)
      persAndou = true;

    //ve quanto que personagem pode mudar
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(this._obstaculos.atual.formaGeometrica, formaGeomPers,
          infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY);
        let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

        //se tiro vai bater em um obstaculo mais perto que o outro
        if (hipotenusa < infoQtdMudar.menorHipotenusa)
        {
          infoQtdMudar.menorHipotenusa = hipotenusa;
          infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
          infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
        }
      }else
        if (persAndou)
          this._obstaculos.removerAtual();
  }


  //colisao com tiro
  verificarColidirComTiro(info, tiro, tiroPersAndou)
  //esses metodos funcionam por passagem por referencia
  {
    if (tiroPersAndou == null)
      tiroPersAndou = true;

    let inseriu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._obstaculos.atual, tiro) || inseriu;
      else
        if (tiroPersAndou && !this._obstaculos.atual.explodiu)
        //se tiros do personagem andaram e esse obstaculo morreu por tiro do pers (nao explodiu com o personagem em si)
          this._obstaculos.removerAtual();
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com obstaculos)
  procColidirTiroCriadoTodosObst(tiro)
  {
    let colidiu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      colidiu = this._obstaculos.atual.procColidirTiroCriado(tiro) || colidiu;
    return colidiu;
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
  //O INIMIGO MORTO SOH VAI SAIR DA LISTA DEPOIS QUE FOR PRINTADO NA TELA, QUANDO TODOS OS INIMIGOS ANDAREM OU
  //QUANDO OS TIROS DO PERSONAGEM ANDAREM (OU QUANDO ELE SAIR DA TELA)

  constructor(inimigoPadrao)
  {
    //padrao
    this._inimigoPadrao = inimigoPadrao;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._inimigos = new ListaDuplamenteLigada();
  }

  get inimigoPadrao()
  { return this._inimigoPadrao; }

  //novo inimigo
  adicionarInimigo(indexContrInim, pers, x, y, vida, qtdAndar, tipoAndar, qtdTiraVidaPersQndIntersec,
    tiroPadrao, corVida, mostrarVidaSempre, corImgMorto, formaGeometrica)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      x = this._inimigoPadrao.formaGeometrica.x;
    if (y == null)
      y = this._inimigoPadrao.formaGeometrica.y;
    if (vida == null)
      vida = this._inimigoPadrao.vidaMAX;
    if (qtdAndar == null)
    {
      qtdAndar.x = this._inimigoPadrao.qtdAndarX;
      qtdAndar.y = this._inimigoPadrao.qtdAndarY;
    }
    if (tipoAndar == null)
      tipoAndar = this._inimigoPadrao.tipoAndar;
    if (qtdTiraVidaPersQndIntersec == null)
      qtdTiraVidaPersQndIntersec = this._inimigoPadrao.qtdTiraVidaPersQndIntersec;
    if (tiroPadrao == null)
      tiroPadrao = this._inimigoPadrao.controladorTiros.tiroPadrao;
    if (corVida == null)
      corVida = this._inimigoPadrao.corVida;
    if (mostrarVidaSempre == null)
      mostrarVidaSempre = this._inimigoPadrao.mostrarVidaSempre;
    if (corImgMorto == null)
      corImgMorto = this._inimigoPadrao.corImgMorto;
    if (formaGeometrica == null)
      formaGeometrica = this._inimigoPadrao.formaGeometrica;

    formaGeometrica.x = x;
    formaGeometrica.y = y;

    this._adicionarInimigo(new Inimigo(formaGeometrica, corImgMorto, {vida: vida, corVida: corVida, mostrarVidaSempre: mostrarVidaSempre},
      tiroPadrao, qtdTiraVidaPersQndIntersec, {qtdAndarX: qtdAndar.x, qtdAndarY: qtdAndar.y, tipoAndar: tipoAndar}),
      pers, indexContrInim);
  }
  adicionarInimigoDif(indexContrInim, pers, x, y, inimigo)
  {
		if (inimigo == null)
      inimigo = this._inimigoPadrao;

    let novoInim = inimigo.clone();
    if (x != null)
      novoInim.formaGeometrica.x = x;
    if (y != null)
      novoInim.formaGeometrica.y = y;
    this._adicionarInimigo(novoInim, pers, indexContrInim);
  }
  _adicionarInimigo(novoInim, pers, indexContrInim)
  {
    novoInim.procCriou(pers, indexContrInim);

    //adicionar novo inimigo ao comeco da lista
		this._inimigos.inserirNoComeco(novoInim);
  }

  //tiros inimigos
  andarTirosTodosInim(conjuntoObjetosTela)
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.andarTiros(conjuntoObjetosTela);
  }

  //andar
  andarInimigos(pers, controladoresTirosJogo)
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._inimigos.atual.andar(pers);
        if (!continuaNaLista)
          this._removerInimAtualCompleto(controladoresTirosJogo);
      }else
        this._removerInimAtualCompleto(controladoresTirosJogo);
  }

 //outros...

  //para ver se level acabou
  algumVivo()
  {
		this._inimigos.colocarAtualComeco();
		while (!this._inimigos.atualEhNulo)
    {
      //se inimigo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (this._inimigos.atual.vivo)
        return true;
      this._inimigos.andarAtual();
    }

    return false;
	}

  //colisao com tiro
  verificarColidirComTiro(info, tiro, controladoresTirosJogo, tiroPersAndou)
  //esses metodos funcionam por passagem por referencia
  {
    if (tiroPersAndou == null)
      tiroPersAndou = true;

    let inseriu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._inimigos.atual, tiro) || inseriu;
      else
        if (tiroPersAndou)
        //os inimigos soh morrem por tiro do pers
          this._removerInimAtualCompleto(controladoresTirosJogo);
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com inimigos)
  procColidirTiroCriadoTodosInim(tiro)
  {
    let colidiu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      colidiu = this._inimigos.atual.procColidirTiroCriado(tiro) || colidiu;
    return colidiu;
  }

  //andar personagem
  procPersColidirTirosTodosInim(pers, qtdAndarX, qtdAndarY)
  //pers andou colidir com tiros de inimigos
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.procedimentoObjTelaColideAndar(pers, qtdAndarX, qtdAndarY, ControladorTiros.PERSONAGEM_ANDOU);
  }
  procPersAndar(pers, qtdAndarX, qtdAndarY)
  //pers andou colidir com inimigos
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo && Interseccao.vaiTerInterseccao(this._inimigos.atual.formaGeometrica, pers.formaGeometrica,
        qtdAndarX, qtdAndarY))
        this._inimigos.atual.tirarVidaPersIntersec(pers);
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

  //aux
  _removerInimAtualCompleto(controladoresTirosJogo)
  {
    controladoresTirosJogo[0].concatenarTiros(this._inimigos.atual.controladorTiros);
    this._inimigos.removerAtual();
  }

  //draw
  draw(controladoresTirosJogo)
	{
		this._inimigos.colocarAtualComeco();
		while (!this._inimigos.atualEhNulo)
    {
      this._inimigos.atual.draw();
      //se inimigo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._inimigos.atual.vivo)
        this._removerInimAtualCompleto(controladoresTirosJogo);
      this._inimigos.andarAtual();
    }
	}
}

class AuxControladores
{
  auxAndarTiro(info, objTelaRealAtual, tiro)
  //retorna se inseriu
  //info: menorHipotenusa, listaBateu, menorWidth, menorHeight, qtdPodeAndarX, qtdPodeAndarY, colidiu
  {
    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objTelaRealAtual.formaGeometrica, tiro.formaGeometrica, info.qtdPodeAndarX, info.qtdPodeAndarY);
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
