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
  adicionarTiroDif(conjuntoObjetosTela, x, y, mortalidade, tipoAndar, qtdAndarX, qtdAndarY, corImgMorto, formaGeometrica)
  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      x = this._tiroPadrao.formaGeometrica.x;
    if (y == null)
      y = this._tiroPadrao.formaGeometrica.y;

    let infoAndar;
    if (qtdAndarX != null || qtdAndarY != null || tipoAndar != null)
    {
      infoAndar = this._tiroPadrao.infoAndar.clone();
      if (tipoAndar == null)
        infoAndar.tipoAndar = tipoAndar;
      if (qtdAndarX == null)
        infoAndar.qtdAndarX = qtdAndarX;
      if (qtdAndarY == null)
        infoAndar.qtdAndarY = qtdAndarY;
    }else
      infoAndar = this._tiroPadrao.infoAndar;

    if (corImgMorto == null)
      corImgMorto = this._tiroPadrao.corImgMorto;
    if (mortalidade == null)
      mortalidade = this._tiroPadrao.mortalidade;
    if (formaGeometrica == null)
      formaGeometrica = this._tiroPadrao.formaGeometrica.clone();

    formaGeometrica.x = x;
    formaGeometrica.y = y;

    this._adicionarTiro(new Tiro(formaGeometrica, corImgMorto, infoAndar, conjuntoObjetosTela, this._ehPersPrinc, mortalidade),
      conjuntoObjetosTela);
  }
  adicionarTiro(conjuntoObjetosTela, x, y, tiro)
  {
		if (tiro == null)
      tiro = this._tiroPadrao;

    let novoTiro = tiro.clone(x, y, conjuntoObjetosTela);
    novoTiro._ehDoPers = this._ehPersPrinc;
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
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
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
  }

  //quando personagem com vida  ou obstaculo se mover
  static get PERSONAGEM_ANDOU()
  { return Tiro.COLIDIU_COM_PERSONAGEM; }
  static get INIMIGOS_ANDOU()
  { return Tiro.COLIDIU_COM_INIMIGO; }
  static get OBSTACULOS_ANDOU()
  { return Tiro.COLIDIU_COM_OBSTACULO; }
  procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY, quemAndou, indexAndou, podeTirarVidaObjTela)
  //soh precisa de indexAndou se quem andou for inimigo ou obstaculo
  {
    if (quemAndou == null && !this._ehPersPrinc)
        quemAndou = ControladorTiros.PERSONAGEM_ANDOU;
    if (podeTirarVidaObjTela == null)
      podeTirarVidaObjTela = true;

    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
      {
        if (Interseccao.vaiTerInterseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudarY))
        {
          //se objeto tela tem vida
          if (podeTirarVidaObjTela && (objTelaColide instanceof PersComTiros || objTelaColide instanceof ObstaculoComVida))
            this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
          this._tiros.atual.morreu(quemAndou, indexAndou);
        }
      }else
        //O TIRO MORTO VAI SAIR DA LISTA [...] QUANDO EM QUEM ELE BATEU ANDAR
        if (this._tiros.atual.ehQuemBateu(quemAndou, indexAndou))
          this._tiros.removerAtual();
  }
  static get INIMIGOS_CRIADO()
  { return Tiro.COLIDIU_COM_INIMIGO; }
  static get OBSTACULOS_CRIADO()
  { return Tiro.COLIDIU_COM_OBSTACULO; }
  procedimentoObjTelaColideCriar(objTelaColide, quemFoiCriado, indexCriou, podeTirarVidaObjTela)
  {
    if (podeTirarVidaObjTela == null) podeTirarVidaObjTela = true;

		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo && Interseccao.interseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica))
      {
        //se objeto tela tem vida
        if (podeTirarVidaObjTela && (objTelaColide instanceof PersComTiros || objTelaColide instanceof ObstaculoComVida))
          this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
        this._tiros.atual.morreu(quemFoiCriado, indexCriou);
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
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
    {
      this._tiros.atual.draw();
      //se tiro jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._tiros.atual.vivo)
        this._tiros.removerAtual();
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
  adicionarObstaculoDif(indexContrObst, conjuntoObjetosTela, x, y, invQtdAndarDir, qtdAndarX, qtdAndarY, tipoAndar, atehQualXYPodeAndar, vida,
    qtdTiraVidaNaoConsegueEmpurrarPers, corImgEspecial, corImgMorto, formaGeometrica)
  //ps: o parametro vida deve ser false se ele nao tem vida ou o numero da vida inicial do obstaculo se ele tem.
  // se ele for null, sera pego a vida do obstaculo padrao se ele tiver e se ele nao tiver serah considerado false

  //invQtdAndarDir eh a direcao (horizontal ou vertical) que se deseja inverter no qtdAndar a partir de obstaculoPadrao

  //essa eh a ordem onde os primeiros parametros da funcao sao os que primeiro estariam fora do padrao
	//pode-se chamar uma funcao sem todos os parametros necessarios e os demais ficam como nulos,
		//porem se for colocar parametros tem que estar na ordem certa
  {
    if (x == null)
      x = this._obstaculoPadrao.formaGeometrica.x;
    if (y == null)
      y = this._obstaculoPadrao.formaGeometrica.y;

    let qtdAndar = AuxControladores.qtdAndarDif(this._obstaculoPadrao, invQtdAndarDir, qtdAndarX, qtdAndarY);
    if (tipoAndar == null)
      tipoAndar = this._obstaculoPadrao.infoAndar.tipoAndar;
    if (atehQualXYPodeAndar == null)
      atehQualXYPodeAndar = this._obstaculoPadrao.infoAndar.atehQualXYPodeAndar;

    if (qtdTiraVidaNaoConsegueEmpurrarPers == null)
      qtdTiraVidaNaoConsegueEmpurrarPers = this._obstaculoPadrao.qtdTiraVidaNaoConsegueEmpurrarPers;
    if (corImgEspecial == null)
      corImgEspecial = this._obstaculoPadrao.corImgEspecial;
    if (corImgMorto == null)
      corImgMorto = this._obstaculoPadrao.corImgMorto;
    if (formaGeometrica == null)
      formaGeometrica = this._obstaculoPadrao.formaGeometrica.clone();

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

    let infoAndar = new InfoAndar(qtdAndar.x, qtdAndar.y, tipoAndar, atehQualXYPodeAndar);
    let coresImgsDiferentes = {corImgEspecial: corImgEspecial, corImgMorto: corImgMorto};
    let novoObstaculo;
    if (vida == false) // se nao tem vida
      novoObstaculo = new Obstaculo(formaGeometrica, coresImgsDiferentes, infoAndar, conjuntoObjetosTela.pers, qtdTiraVidaNaoConsegueEmpurrarPers);
    else
      novoObstaculo = new ObstaculoComVida(formaGeometrica, coresImgsDiferentes, infoAndar, conjuntoObjetosTela.pers, qtdTiraVidaNaoConsegueEmpurrarPers,
        vida);

    this._adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst);
  }
  adicionarObstaculo(indexContrObst, conjuntoObjetosTela, x, y, obstaculo)
  {
		if (obstaculo == null)
      obstaculo = this._obstaculoPadrao;

    let novoObstaculo = obstaculo.clone(conjuntoObjetosTela.pers);
    if (x != null)
      novoObstaculo.formaGeometrica.x = x;
    if (y != null)
      novoObstaculo.formaGeometrica.y = y;
    this._adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst);
  }
  _adicionarObstaculo(novoObstaculo, conjuntoObjetosTela, indexContrObst)
  {
    let podeCriar = novoObstaculo.procCriou(conjuntoObjetosTela, indexContrObst);

    if (podeCriar)
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
        this._obstaculos.guardarAtual();

        //retorna se obstaculo continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._obstaculos.atual.andar(conjuntoObjetosTela, indexContrObst);

        this._obstaculos.colocarGuardadoNoAtual();
        //em andar do obstaculo ele percorre toda a lista this._obstaculos em qtdAndarSemColidirOutrosObst(...),
        // entao preciso voltar para onde a lista estava

        if (!continuaNaLista)
          this._obstaculos.removerAtual();
      }else
        this._obstaculos.removerAtual();
  }

  //para andar obstaculos
  qtdAndarSemColidirOutrosObst(info, obst)
  //retorna se pode andar sem colidir
  //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual != obst && this._obstaculos.atual.vivo)
      //se nao eh o mesmo obst e estah vivo
        AuxControladores.auxAndarTiro(info, this._obstaculos.atual, obst, false);
  }

  //para procCriou do obstaculo
  obstVaiColidir(obstVaiCriar)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo && Interseccao.interseccao(obstVaiCriar.formaGeometrica, this._obstaculos.atual.formaGeometrica))
      //obstVaiCriar nao estah em nenhuma lista ainda, entao nao precisa verificar se eh o obstaculo atual eh o proprio obstVaiCriar
        return this._obstaculos.atual;
    return null;
  }

  //andar personagem
  qtdPersPodeAndar(infoQtdMudar, formaGeomPers, persAndou)
  {
    //o valor default eh TRUE (pois normalmente esse metodo vai ser chamado quando ele andar)
    if (persAndou == null) persAndou = true;

    //ve quanto que personagem pode mudar
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(this._obstaculos.atual.formaGeometrica, formaGeomPers,
          infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, false);

        //se tiro vai bater em um obstaculo mais perto que o outro
        if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX))
          infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
        if (Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
          infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
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

    //soh os tiros do personagem podem matar obstaculos, entao se um obstaculo estah morto mas o tiro nao veio do personagem,
    //nao precisa tirar o obstaculo da tela

    let inseriu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._obstaculos.atual, tiro, true) || inseriu;
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
      if (this._obstaculos.atual.vivo)
        colidiu = this._obstaculos.atual.procColidirTiroCriado(tiro) || colidiu;
    return colidiu;
  }

	//draw
    //desenha todos os obstaculos
	draw()
	{
		for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
    {
      this._obstaculos.atual.draw();
      //se obstaculo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._obstaculos.atual.vivo)
        this._obstaculos.removerAtual();
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
  adicionarInimigoDif(indexContrInim, pers, x, y, vida, invQtdAndarDir, qtdAndarX, qtdAndarY, tipoAndar, atehQualXYPodeAndar,
    qtdTiraVidaPersQndIntersec, tiroPadrao, corVida, mostrarVidaSempre, corImgMorto, formaGeometrica)
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

    let qtdAndar = AuxControladores.qtdAndarDif(this._obstaculoPadrao, invQtdAndarDir, qtdAndarX, qtdAndarY);
    if (tipoAndar == null)
      tipoAndar = this._obstaculoPadrao.infoAndar.tipoAndar;
    if (atehQualXYPodeAndar == null)
      atehQualXYPodeAndar = this._obstaculoPadrao.infoAndar.atehQualXYPodeAndar;

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
      formaGeometrica = this._inimigoPadrao.formaGeometrica.clone();

    formaGeometrica.x = x;
    formaGeometrica.y = y;

    this._adicionarInimigo(new Inimigo(formaGeometrica, corImgMorto, {vida: vida, corVida: corVida, mostrarVidaSempre: mostrarVidaSempre},
      tiroPadrao, qtdTiraVidaPersQndIntersec, {qtdAndarX: qtdAndar.x, qtdAndarY: qtdAndar.y, tipoAndar: tipoAndar}, pers),
      pers, indexContrInim);
  }
  adicionarInimigo(indexContrInim, pers, x, y, inimigo)
  {
		if (inimigo == null)
      inimigo = this._inimigoPadrao;

    let novoInim = inimigo.clone(pers);
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
  atirarTodosInim(conjuntoObjetosTela)
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.atirar(conjuntoObjetosTela, Direcao.Baixo);
  }

  //andar
  andarInimigos(indexContrInim, pers, controladoresTirosJogo)
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._inimigos.atual.andar(pers, indexContrInim, indexInim);
        if (!continuaNaLista)
          this._removerInimAtualCompleto(controladoresTirosJogo);
      }else
        this._removerInimAtualCompleto(controladoresTirosJogo);
  }

 //outros...

  //para ver se level acabou
  algumInimNaTela()
  { return !this._inimigos.vazia; }

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
        inseriu = AuxControladores.auxAndarTiro(info, this._inimigos.atual, tiro, true) || inseriu;
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
      if (this._inimigos.atual.vivo)
        colidiu = this._inimigos.atual.procColidirTiroCriado(tiro) || colidiu;
    return colidiu;
  }

  //andar personagem
  procObjTelaAndarColidirTirosTodosInim(objTelaColide, qtdMudarX, qtdMudarY, quemAndou, indexAndou, podeTirarVidaObjTela)
  //indexContr soh eh necessario se objTela estiver em um controlador (ex: inimigo, obstaculo, tiro)
  //pers andou colidir com tiros de inimigos
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY, quemAndou,
        indexAndou, podeTirarVidaObjTela);
  }

  procPersAndar(indexContr, pers, qtdAndarX, qtdAndarY)
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
    {
      if (this._inimigos.atual.vivo && Interseccao.vaiTerInterseccao(this._inimigos.atual.formaGeometrica, pers.formaGeometrica,
        qtdAndarX, qtdAndarY))
        pers.colidiuInim(indexContr, indexInim, this._inimigos.atual.qtdTiraVidaPersQndIntersec);
      console.log(indexInim);
    }
  }
  //para andar ateh inimigo
	qntAndarInimigoMaisProximo(formaGeometrica)
  // formaGeometrica do objeto que vai andar ateh inimigo mais proximo
	{
    let menorHipotenusa = null;
    let praOndeAndar = {x: null, y: null, inim: null};
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        let qntAndar = Andar.qntAndarParaBater(formaGeometrica, this._inimigos.atual.formaGeometrica);
        let hipotenusa = Operacoes.hipotenusa(qntAndar.x, qntAndar.y);
        if (menorHipotenusa == null || hipotenusa < menorHipotenusa)
        {
          praOndeAndar.x = qntAndar.x;
          praOndeAndar.y = qntAndar.y;
          praOndeAndar.inim = this._inimigos.atual;
          menorHipotenusa = hipotenusa;
        }
      }

    return praOndeAndar;
	}

  //para obstaculo criado colidir com tiros dos inimigos
  procObstCriadoColidirTirosInim(obstCriado, indexContrObst)
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.procedimentoObjTelaColideCriar(obstCriado, ControladorTiros.OBSTACULOS_CRIADO, indexContrObst, false);
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
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
    {
      this._inimigos.atual.draw();
      //se inimigo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._inimigos.atual.vivo)
        this._removerInimAtualCompleto(controladoresTirosJogo);
    }
	}
}

class AuxControladores
{
  static auxAndarTiro(info, objParado, objVaiAndar, comMenorWidthHeight)
  //retorna se inseriu
  //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao,
  // [menorWidth](nem smp), [menorHeight](nem smp)
  //em listaBateu ficarao os objParado que colidirem antes com objVaiAndar
  {
    let qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objParado.formaGeometrica, objVaiAndar.formaGeometrica,
      info.qtdAndarXPadrao, info.qtdAndarYPadrao);
    let hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    //se objVaiAndar vai bater em um obstaculo mais perto ou igual a um que jah bateu
    if (hipotenusa < info.menorHipotenusa || (!info.listaBateu.vazia && hipotenusa == info.menorHipotenusa))
    {
      //se a hipotenusa diminuiu (agora tudo serah apenas relacionado a ele)
      if (hipotenusa < info.menorHipotenusa)
      {
        info.listaBateu.esvaziar();

        info.menorHipotenusa = hipotenusa;
        info.qtdPodeAndarX = qtdPodeAndar.x;
        info.qtdPodeAndarY = qtdPodeAndar.y;

        if (comMenorWidthHeight)
        {
          info.menorHeight = objParado.formaGeometrica.height;
          info.menorWidth = objParado.formaGeometrica.width;
        }
      }else
      //if (!info.listaBateu.vazia && hipotenusa == info.menorHipotenusa)
        if (comMenorWidthHeight)
        {
          if (objParado.formaGeometrica.height < info.menorHeight)
            info.menorHeight = objParado.formaGeometrica.height;
          if (objParado.formaGeometrica.width < info.menorWidth)
            info.menorWidth = objParado.formaGeometrica.width;
        }

      info.listaBateu.inserirNoComeco(objParado);
      return true;
    }else
      return false;
  }

  static qtdAndarDif(objTelaPadrao, invQtdAndarDir, qtdAndarX, qtdAndarY)
  {
    let qtdAndar;
    switch (invQtdAndarDir)
    {
      case null:
      case false:
        qtdAndar = {x: objTelaPadrao.infoAndar.qtdAndarX,
          y: objTelaPadrao.infoAndar.qtdAndarY};
        break;
      case Direcao.HORIZONTAL:
        qtdAndar = {x: -objTelaPadrao.infoAndar.qtdAndarX,
          y: objTelaPadrao.infoAndar.qtdAndarY};
        break;
      case Direcao.VERTICAL:
        qtdAndar = {x: objTelaPadrao.infoAndar.qtdAndarX,
          y: -objTelaPadrao.infoAndar.qtdAndarY};
        break;
      case Direcao.HORIZONTAL_E_VERTICAL:
        qtdAndar = {x: -objTelaPadrao.infoAndar.qtdAndarX,
          y: -objTelaPadrao.infoAndar.qtdAndarY};
        break;
    }
    if (qtdAndarX != null)
      qtdAndar.x = qtdAndarX;
    if (qtdAndarY != null)
      qtdAndar.y = qtdAndarY;

    return qtdAndar;
  }
}
