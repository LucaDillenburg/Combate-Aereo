//import "ObjetosSimples.js";

/* BASE DE UM CONTROLADOR:
class ControladorObjetos
{
  constructor(objetoPadrao)

  get objetoPadrao()

  adicionarObstaculo(x, y, ...)
  adicionarObstaculoDif(x, y, objeto)

  andarObjetos(...)

  draw()
}
*/

class ControladorTiros
{
  constructor(infoTiroPadrao, ehPersPrinc)
  {
    //padrao
    this._infoTiroPadrao = infoTiroPadrao;
    this._ehPersPrinc = ehPersPrinc;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os tiros no comeco e quando eles sairem da tela ou baterem tirar da lista
    this._tiros = new ListaDuplamenteLigada();
  }

  //infoTiroPadrao
  get infoTiroPadrao()
  { return this._infoTiroPadrao; }
  set infoTiroPadrao(novoInfoTiro)
  { this._infoTiroPadrao = novoInfoTiro; }

  colocarInfoTiroEspecial(novoInfoTiro)
  { this._infoTiroEspecial = novoInfoTiro; }
  voltarInfoTiroPadrao()
  { this._infoTiroEspecial = null; }

  get infoTiroPadraoAtual()
  {
    if (this._infoTiroEspecial == null)
      return this._infoTiroPadrao;
    else
      return this._infoTiroEspecial;
  }

  //novo tiro
  adicionarTiroDif(pontoInicial, infoTiro, inverterX, inverterY)
  //os atributos que forem nulos serao substituidos pelos padronizados e os que forem da classe Nulo serao substituidos por null (soh vai ser verificado se eh dessa classe se puder ser nulo)
  {
    let infoTiroPadraoAtual = this.infoTiroPadraoAtual;

    if (infoTiro == null)
    {
      infoTiro = infoTiroPadraoAtual.clone(); //pode inverter qtdAndar
      AuxControladores.qtdAndarDifInv(infoTiro.infoAndar, inverterX, inverterY); //inverterX e Y podem nao ser nulos
    }else
    {
      //infoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade

      //infoAndar
      AuxControladores.qtdAndarDif(infoTiro, infoTiroPadraoAtual, inverterX, inverterY);

      //corMorto, mortalidade
      if (infoTiro.corImgMorto == null)
        infoTiro.corImgMorto = infoTiroPadraoAtual.corImgMorto;
      if (infoTiro.mortalidade == null)
        infoTiro.mortalidade = infoTiroPadraoAtual.mortalidade;

      //formaGeometrica
      if (infoTiro.formaGeometrica == null)
        infoTiro.formaGeometrica = infoTiroPadraoAtual.formaGeometrica;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiroPadraoAtual.formaGeometrica);

    infoTiro.ehDoPers = infoTiroPadraoAtual._ehPersPrinc;

    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  adicionarTiro(pontoInicial, infoTiro)
  {
		if (infoTiro == null)
      infoTiro = this.infoTiroPadraoAtual;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiro.formaGeometrica);

    let novoTiro = new Tiro(pontoInicial, infoTiro);
    novoTiro._ehDoPers = this._ehPersPrinc;
    this._adicionarTiro(novoTiro);
  }
  _adicionarTiro(novoTiro)
  {
    novoTiro.procCriou();

    //adicionar novo tiro ao comeco da lista
		this._tiros.inserirNoComeco(novoTiro);
  }

  //mover tiros
  andarTiros()
  {
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (!this._tiros.atual.vivo)
      // se ele estava morto e soh nao foi tirado da lista porque colidiu e queria-se mostrar a colisao, agora remove
        this._tiros.removerAtual();
      else
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaLista = this._tiros.atual.andar();
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
          if (podeTirarVidaObjTela && (objTelaColide instanceof ObjComTiros || objTelaColide instanceof ObstaculoComVida))
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
        if (podeTirarVidaObjTela && (objTelaColide instanceof ObjComTiros || objTelaColide instanceof ObstaculoComVida))
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

  constructor(infoObstaculoPadrao)
  {
    //padrao
    this._infoObstaculoPadrao = infoObstaculoPadrao;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._obstaculos = new ListaDuplamenteLigada();
    //pode ter obstaculos sem vida e outroscom
  }

  get infoObstaculoPadrao()
  { return this._infoObstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculoDif(indexContrObst, pontoInicial, infoObst, inverterX, inverterY)
  {
    if (infoObst == null)
    {
      infoObst = this._infoObstaculoPadrao.clone(); //pode inverter qtdAndar
      AuxControladores.qtdAndarDifInv(infoObst.infoAndar, inverterX, inverterY); //inverterX e Y podem nao ser nulos
    }else
    {
      //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, [vida]

      //infoAndar
      AuxControladores.qtdAndarDif(infoObst, this._infoObstaculoPadrao, inverterX, inverterY)

      //qtdTiraVidaNaoConsegueEmpurrarPers, corImgMorto
      if (infoObst.qtdTiraVidaNaoConsegueEmpurrarPers == null)
        infoObst.qtdTiraVidaNaoConsegueEmpurrarPers = this._infoObstaculoPadrao.qtdTiraVidaNaoConsegueEmpurrarPers;
      if (infoObst.corImgMorto == null)
        infoObst.corImgMorto = this._infoObstaculoPadrao.corImgMorto;

      //corImgEspecial (pode ser nulo)
      if (infoObst.corImgEspecial == null)
        infoObst.corImgEspecial = this._infoObstaculoPadrao.corImgEspecial;
      else
      if (infoObst.corImgEspecial instanceof Nulo)
        infoObst.corImgEspecial = null;

      //formaGeometrica
      if (infoObst.formaGeometrica == null)
        infoObst.formaGeometrica = this._infoObstaculoPadrao.formaGeometrica;

      //[vida]
      if (infoObst instanceof ObstaculoComVida && infoObst.vida == null)
        infoObst.vida = this._infoObstaculoPadrao.vida;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoObstaculoPadrao.formaGeometrica);

    let novoObstaculo;
    if (infoObst instanceof InfoObstaculoComVida) // se eh obstaculo com vida
      novoObstaculo = new ObstaculoComVida(pontoInicial, infoObst);
    else
      novoObstaculo = new Obstaculo(pontoInicial, infoObst);

    this._adicionarObstaculo(novoObstaculo, indexContrObst);
  }
  adicionarObstaculo(indexContrObst, pontoInicial, infoObstaculo)
  {
		if (infoObstaculo == null)
      infoObstaculo = this._infoObstaculoPadrao;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoObstaculo.formaGeometrica);

    let novoObstaculo = new Obstaculo(pontoInicial, infoObstaculo);
    this._adicionarObstaculo(novoObstaculo, indexContrObst);
  }
  _adicionarObstaculo(novoObstaculo, indexContrObst)
  {
    let podeCriar = novoObstaculo.procCriou(indexContrObst);

    if (podeCriar)
      //adicionar novo obstaculo ao comeco da lista
  		this._obstaculos.inserirNoComeco(novoObstaculo);
  }


 //andar
  //andar objetos
  andarObstaculos(indexContrObst)
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        this._obstaculos.guardarAtual();

        //retorna se obstaculo continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._obstaculos.atual.andar(indexContrObst);

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

  constructor(infoInimigoPadrao)
  {
    //padrao
    this._infoInimigoPadrao = infoInimigoPadrao;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._inimigos = new ListaDuplamenteLigada();
  }

  get infoInimigoPadrao()
  { return this._infoInimigoPadrao; }

  //novo inimigo
  adicionarInimigoDif(indexContrInim, pontoInicial, infoInimigo, inverterX, inverterY)
  {
    if (infoInimigo == null)
    {
      infoInimigo = this._infoInimigoPadrao.clone(); //pode inverter qtdAndar
      AuxControladores.qtdAndarDifInv(infoInimigo.infoAndar, inverterX, inverterY); //inverterX e Y podem nao ser nulos
    }else
    {
      //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, proporcTempoVida, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar

      //infoAndar
      AuxControladores.qtdAndarDif(infoInimigo, this._infoInimigoPadrao, inverterX, inverterY)

      //corImgMorto, vida, corVida, mostrarVidaSempre, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec
      if (infoInimigo.corImgMorto == null)
        infoInimigo.corImgMorto = this._infoInimigoPadrao.corImgMorto;
      if (infoInimigo.vida == null)
        infoInimigo.vida = this._infoInimigoPadrao.vida;
      if (infoInimigo.corVida == null)
        infoInimigo.corVida = this._infoInimigoPadrao.corVida;
      if (infoInimigo.mostrarVidaSempre == null)
        infoInimigo.mostrarVidaSempre = this._infoInimigoPadrao.mostrarVidaSempre;
      if (infoInimigo.infoTiroPadrao == null)
        infoInimigo.infoTiroPadrao = this._infoInimigoPadrao.infoTiroPadrao;
      if (infoInimigo.freqTiro == null)
        infoInimigo.freqTiro = this._infoInimigoPadrao.freqTiro;
      if (infoInimigo.podeAtirarQualquerLado == null)
        infoInimigo.podeAtirarQualquerLado = this._infoInimigoPadrao.podeAtirarQualquerLado;
      if (infoInimigo.qtdTiraVidaPersQndIntersec == null)
        infoInimigo.qtdTiraVidaPersQndIntersec = this._infoInimigoPadrao.qtdTiraVidaPersQndIntersec;

      //proporcTempoVida (pode ser nulo)
      if (infoInimigo.proporcTempoVida == null)
        infoInimigo.proporcTempoVida = this._infoInimigoPadrao.proporcTempoVida;
      else
      if (infoInimigo.proporcTempoVida instanceof Nulo)
        infoInimigo.proporcTempoVida = null;

      //formaGeometrica
      if (infoInimigo.formaGeometrica == null)
        infoInimigo.formaGeometrica = this._infoInimigoPadrao.formaGeometrica;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoInimigoPadrao.formaGeometrica);

    this._adicionarInimigo(new Inimigo(pontoInicial, infoInimigo), indexContrInim);
  }
  adicionarInimigo(indexContrInim, pontoInicial, infoInimigo)
  {
		if (infoInimigo == null)
      infoInimigo = this._infoInimigoPadrao;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoInimigo.formaGeometrica);

    let novoInim = new Inimigo(pontoInicial, infoInimigo);
    this._adicionarInimigo(novoInim, indexContrInim);
  }
  _adicionarInimigo(novoInim, indexContrInim)
  {
    novoInim.procCriou(indexContrInim);

    //adicionar novo inimigo ao comeco da lista
		this._inimigos.inserirNoComeco(novoInim);
  }

  //tiros inimigos
  andarTirosTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.andarTiros();
  }
  atirarTodosInim()
  {
    //andar todos os tiros de todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.atirar(Direcao.Baixo);
  }

  //andar
  andarInimigos(indexContrInim)
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        let continuaNaLista = this._inimigos.atual.andar(indexContrInim, indexInim);
        if (!continuaNaLista)
          this._removerInimAtualCompleto();
      }else
        this._removerInimAtualCompleto();
  }

 //outros...

  //para ver se level acabou
  algumInimNaTela()
  { return !this._inimigos.vazia; }

  //colisao com tiro
  verificarColidirComTiro(info, tiro, tiroPersAndou)
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
          this._removerInimAtualCompleto();
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

  procPersAndar(indexContr, qtdAndarX, qtdAndarY)
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo && Interseccao.vaiTerInterseccao(this._inimigos.atual.formaGeometrica,
        ConjuntoObjetosTela.pers.formaGeometrica, qtdAndarX, qtdAndarY))
        ConjuntoObjetosTela.pers.colidiuInim(indexContr, indexInim, this._inimigos.atual.qtdTiraVidaPersQndIntersec);
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
        let qntAndar = ClasseAndar.qntAndarParaBater(formaGeometrica, this._inimigos.atual.formaGeometrica);
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
  _removerInimAtualCompleto()
  {
    ConjuntoObjetosTela.controladoresTirosJogo[0].concatenarTiros(this._inimigos.atual.controladorTiros);
    this._inimigos.removerAtual();
  }

  //draw
  draw()
	{
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
    {
      this._inimigos.atual.draw();
      //se inimigo jah morreu (desenhar ele a ultima vez e depois tirar ele da lista)
      if (!this._inimigos.atual.vivo)
        this._removerInimAtualCompleto();
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

  static qtdAndarDif(infoNovo, infoObjTelaPadrao, inverterX, inverterY)
  {
    if (infoNovo.infoAndar == null)
      infoNovo.infoAndar = infoObjTelaPadrao.infoAndar;
    else
    {
      if (infoNovo.infoAndar.qtdAndarX == null)
        infoNovo.infoAndar.qtdAndarX = infoObjTelaPadrao.infoAndar.qtdAndarX;
      if (infoNovo.infoAndar.qtdAndarY == null)
        infoNovo.infoAndar.qtdAndarY = infoObjTelaPadrao.infoAndar.qtdAndarY;
      if (infoNovo.infoAndar.tipoAndar == null)
        infoNovo.infoAndar.tipoAndar = infoObjTelaPadrao.infoAndar.tipoAndar;

      if (infoNovo.infoAndar.atehQualXYPodeAndar == null)
        infoNovo.infoAndar.atehQualXYPodeAndar = infoObjTelaPadrao.infoAndar.atehQualXYPodeAndar;
      else
      if (infoNovo.infoAndar.atehQualXYPodeAndar instanceof Nulo)
        infoTiro.infoAndar.atehQualXYPodeAndar = null;
    }

    AuxControladores.qtdAndarDifInv(infoTiro.infoAndar, inverterX, inverterY);
  }

  static qtdAndarDifInv(infoAndar, inverterX, inverterY)
  {
    if (inverterX)
      infoAndar.qtdAndarX *= -1;
    if (inverterY)
      infoAndar.qtdAndarY *= -1;
  }

  static pontoInicialCorreto(pontoInicial, formaGeometricaPadrao)
  {
    //(x ou posicaoX, y ou posicaoY)
    if (pontoInicial == null) pontoInicial = {}; //"objeto" vazio
    if (pontoInicial.x == null && pontoInicial.posicaoX == null) pontoInicial.x = formaGeometricaPadrao.x;
    if (pontoInicial.y == null && pontoInicial.posicaoY == null) pontoInicial.y = formaGeometricaPadrao.y;
    return pontoInicial;
  }
}
