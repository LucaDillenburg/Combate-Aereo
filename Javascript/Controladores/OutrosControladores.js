//import "ObjetosSimples.js";

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

    this._auxColTirarTirosEsp = 0;
  }

  //infoTiroPadrao
  get infoTiroPadrao()
  { return this._infoTiroPadrao; }
  set infoTiroPadrao(novoInfoTiro)
  { this._infoTiroPadrao = novoInfoTiro; }

  colocarInfoTiroEspecial(novoInfoTiro)
  {
    this._infoTiroEspecial = novoInfoTiro;
    this._auxColTirarTirosEsp++;
  }
  voltarInfoTiroPadrao()
  {
    this._auxColTirarTirosEsp--;

    if (this._auxColTirarTirosEsp === 0)
      delete this._infoTiroEspecial;
  }

  get infoTiroPadraoAtual()
  {
    if (this._infoTiroEspecial === undefined)
      return this._infoTiroPadrao;
    else
      return this._infoTiroEspecial;
  }

  //novo tiro
  adicionarTiroDif(pontoInicial, infoTiro, direcaoX, direcaoY, todoQtdDirecao=false)
  //os atributos que forem nulos serao substituidos pelos padronizados e os que forem da classe Nulo serao substituidos por null (soh vai ser verificado se eh dessa classe se puder ser nulo)
  {
    const infoTiroPadraoAtual = this.infoTiroPadraoAtual;

    if (infoTiro === undefined)
    {
      infoTiro = infoTiroPadraoAtual.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoTiro.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //infoTiro: formaGeometrica, corImgMorto, infoAndar, ehDoPers, mortalidade

      //infoAndar
      AuxControladores.qtdAndarDif(infoTiro, infoTiroPadraoAtual, direcaoX, direcaoY, todoQtdDirecao);

      //corMorto, mortalidade
      if (infoTiro.corImgMorto === undefined)
        infoTiro.corImgMorto = infoTiroPadraoAtual.corImgMorto;
      if (infoTiro.mortalidade === undefined)
        infoTiro.mortalidade = infoTiroPadraoAtual.mortalidade;

      //formaGeometrica
      if (infoTiro.formaGeometrica === undefined)
        infoTiro.formaGeometrica = infoTiroPadraoAtual.formaGeometrica;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiroPadraoAtual.formaGeometrica);

    infoTiro.ehDoPers = this._ehPersPrinc;

    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
  }
  adicionarTiro(pontoInicial, infoTiro)
  {
		if (infoTiro === undefined)
      infoTiro = this.infoTiroPadraoAtual;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoTiro.formaGeometrica);

    infoTiro.ehDoPers = this._ehPersPrinc;
    this._adicionarTiro(new Tiro(pontoInicial, infoTiro));
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
        const continuaLista = this._tiros.atual.andar();
        if (!continuaLista)
  				this._tiros.removerAtual();
      }
  }

  //quando personagem ou obstaculo se mover
  procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY, indexAndou, podeTirarVidaObjTela = true)
  //soh precisa de indexAndou se quem andou for inimigo ou obstaculo
  {
    const tipoObjAndou = TipoObjetos.fromObj(objTelaColide);
    const objTemVida = objTelaColide.vida !== undefined;
    //percorrer todos os elementos da lista andando os tiros (se retornar false, remover da lista)
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
      {
        if (Interseccao.vaiTerInterseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica, qtdMudarX, qtdMudarY))
        {
          //se objeto tela tem vida e eh pra tirar vida
          if (podeTirarVidaObjTela && objTemVida)
            this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
          this._tiros.atual.morreu(tipoObjAndou, indexAndou);
        }
      }else
        //O TIRO MORTO VAI SAIR DA LISTA [...] QUANDO EM QUEM ELE BATEU ANDAR
        if (this._tiros.atual.ehQuemBateu(tipoObjAndou, indexAndou))
          this._tiros.removerAtual();
  }
  procedimentoObjTelaColideCriar(objTelaColide, indexCriou, podeTirarVidaObjTela=true)
  {
    const tipoObjCriado = TipoObjetos.fromObj(objTelaColide);
    const objTemVida = objTelaColide.vida !== undefined;
		for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo && Interseccao.interseccao(this._tiros.atual.formaGeometrica, objTelaColide.formaGeometrica))
      {
        //se objeto tela tem vida e eh para tirar vida
        if (podeTirarVidaObjTela && temVida)
          this._tiros.atual.tirarVidaObjCmVida(objTelaColide);
        this._tiros.atual.morreu(tipoObjCriado, indexCriou);
      }
  }

  //uso: quando os inimigos morrerem passar os tiros deles para controladoresTirosJogo[0]
  concatenarTiros(controladorTiros)
  {
    //os tiros do outro controlador serao passados para esse (sem fazer clone)
    this._tiros.concatenar(controladorTiros._tiros);
  }

  //POCAO
  seVirarContraCriador(seguir)
  //seguir: true = seguir, false = direcao
  {
    //transformar todos os tiros em dePers e mudar tipoAndar
    for (this._tiros.colocarAtualComeco(); !this._tiros.atualEhNulo; this._tiros.andarAtual())
      if (this._tiros.atual.vivo)
      {
        this._tiros.atual.inverterDono(); //se era do pers fica sendo da tela, e se nao era do pers fica sendo dele

        if (this.ehPersPrinc)
          this._tiros.atual.setTipoAndar(seguir?TipoAndar.SeguirPers:TipoAndar.DirecaoPers);
        else
          this._tiros.atual.setTipoAndar(seguir?TipoAndar.SeguirInimMaisProx:TipoAndar.DirecaoInimMaisProx);
      }

    //concatenar com controladorTirosJogo se tiros eram originalmente do personagem, e com controladorTiros do personagem se nao eram do personagem
    if (this._ehPersPrinc)
      ConjuntoObjetosTela.controladoresTirosJogo[0].concatenarTiros(this);
    else
      ConjuntoObjetosTela.pers.controladorTiros.concatenarTiros(this);
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

  constructor(infoObstaculoPadrao, indexContr)
  {
    //padrao
    this._infoObstaculoPadrao = infoObstaculoPadrao;

    //index controlador
    this._indexContr = indexContr;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._obstaculos = new ListaDuplamenteLigada();
    //pode ter obstaculos sem vida e outroscom
  }

  get infoObstaculoPadrao()
  { return this._infoObstaculoPadrao; }

  //novo obstaculo
  adicionarObstaculoDif(pontoInicial, infoObst, direcaoX, direcaoY, todoQtdDirecao=false)
  {
    if (infoObst === undefined)
    {
      infoObst = this._infoObstaculoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoObst.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //InfoObstaculo: formaGeometrica, corImgMorto, corImgEspecial, infoAndar, qtdTiraVidaNaoConsegueEmpurrarPers, [vida]

      //infoAndar
      AuxControladores.qtdAndarDif(infoObst, this._infoObstaculoPadrao, direcaoX, direcaoY, todoQtdDirecao);

      //qtdTiraVidaNaoConsegueEmpurrarPers, corImgMorto
      if (infoObst.qtdTiraVidaNaoConsegueEmpurrarPers === undefined)
        infoObst.qtdTiraVidaNaoConsegueEmpurrarPers = this._infoObstaculoPadrao.qtdTiraVidaNaoConsegueEmpurrarPers;
      if (infoObst.corImgMorto === undefined)
        infoObst.corImgMorto = this._infoObstaculoPadrao.corImgMorto;

      //corImgEspecial (pode ser nulo)
      if (infoObst.corImgEspecial === undefined)
        infoObst.corImgEspecial = this._infoObstaculoPadrao.corImgEspecial;

      //formaGeometrica
      if (infoObst.formaGeometrica === undefined)
        infoObst.formaGeometrica = this._infoObstaculoPadrao.formaGeometrica;

      //[vida]
      if (infoObst instanceof ObstaculoComVida && infoObst.vida === undefined)
        infoObst.vida = this._infoObstaculoPadrao.vida;
    }

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoObstaculoPadrao.formaGeometrica);

    let novoObstaculo;
    if (infoObst instanceof InfoObstaculoComVida) // se eh obstaculo com vida
      novoObstaculo = new ObstaculoComVida(pontoInicial, infoObst);
    else
      novoObstaculo = new Obstaculo(pontoInicial, infoObst);

    this._adicionarObstaculo(novoObstaculo);
  }
  adicionarObstaculo(pontoInicial, infoObstaculo)
  {
		if (infoObstaculo === undefined)
      infoObstaculo = this._infoObstaculoPadrao;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoObstaculo.formaGeometrica);

    const novoObstaculo = new Obstaculo(pontoInicial, infoObstaculo);
    this._adicionarObstaculo(novoObstaculo);
  }
  _adicionarObstaculo(novoObstaculo)
  {
    const podeCriar = novoObstaculo.procCriou(this._indexContr);
    if (podeCriar)
      //adicionar novo obstaculo ao comeco da lista
  		this._obstaculos.inserirNoComeco(novoObstaculo);
  }


 //andar
  //andar objetos
  andarObstaculos()
  //os tres ultimos parametros para caso o obstaculo tenha que empurrar o personagem (pers.mudarXY)
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        this._obstaculos.guardarAtual();

        //retorna se obstaculo continua na lista (o morreu() eh feito la dentro)
        const continuaNaLista = this._obstaculos.atual.andar(this._indexContr);

        this._obstaculos.colocarGuardadoNoAtual();
        //em andar do obstaculo ele percorre toda a lista this._obstaculos em qtdAndarSemColidirOutrosObst(...),
        // entao preciso voltar para onde a lista estava

        if (!continuaNaLista)
        //nao aparece mais na tela
          this._obstaculos.removerAtual();
      }
  }

  //para andar obstaculos
  qtdAndarSemColidirOutrosObst(info, obst)
  //retorna se pode andar sem colidir
  //info: menorHipotenusa, listaBateu, qtdPodeAndarX, qtdPodeAndarY, qtdAndarXPadrao, qtdAndarYPadrao
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual !== obst && this._obstaculos.atual.vivo)
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
  qtdPersPodeAndar(infoQtdMudar, formaGeomPers, persAndou = true)
  {
    //ve quanto que personagem pode mudar
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      {
        const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(this._obstaculos.atual.formaGeometrica, formaGeomPers,
          infoQtdMudar.qtdPodeMudarX, infoQtdMudar.qtdPodeMudarY, false);

        //se tiro vai bater em um obstaculo mais perto que o outro
        if (Math.abs(qtdPodeAndar.x) < Math.abs(infoQtdMudar.qtdPodeMudarX))
          infoQtdMudar.qtdPodeMudarX = qtdPodeAndar.x;
        if (Math.abs(qtdPodeAndar.y) < Math.abs(infoQtdMudar.qtdPodeMudarY))
          infoQtdMudar.qtdPodeMudarY = qtdPodeAndar.y;
      }
  }

  //colisao com personagem quando cresce (POCAO)
  procPersonagemCresceuTodosObst()
  {
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
        this._obstaculos.atual.verificarColisaoPersEstatico();
  }

  //colisao com tiro
  verifColidirTiroPersTodosObst(info, tiro)
  //esses metodos funcionam por passagem por referencia
  {
    //soh os tiros do personagem podem matar obstaculos, entao se um obstaculo estah morto mas o tiro nao veio do personagem,
    //nao precisa tirar o obstaculo da tela

    let inseriu = false;
    for (this._obstaculos.colocarAtualComeco(); !this._obstaculos.atualEhNulo; this._obstaculos.andarAtual())
      if (this._obstaculos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._obstaculos.atual, tiro, true) || inseriu;
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

  constructor(infoInimigoPadrao, indexContr, ehDeInimigosEssenciais = false)
  {
    //padrao
    this._infoInimigoPadrao = infoInimigoPadrao;

    //index controlador
    this._indexContr = indexContr;

    //LISTA DUPLAMENTE LIGADA (COM PONTEIRO NO ULTIMO)
    // ir adicionando os obstaculos no comeco e quando ele sair da tela ouir tirando os que jah sairam da tela do final
    this._inimigos = new ListaDuplamenteLigada();

    this._ehDeInimigosEssenciais = ehDeInimigosEssenciais;
  }

  get infoInimigoPadrao()
  { return this._infoInimigoPadrao; }

  get ehDeInimigosEssenciais()
  { return this._ehDeInimigosEssenciais; }

  //novo inimigo
  adicionarInimigoDif(pontoInicial, infoInimigo, direcaoX, direcaoY, todoQtdDirecao=false)
  {
    if (infoInimigo === undefined)
    {
      infoInimigo = this._infoInimigoPadrao.clone(); //tem que fazer clone porque pode inverter qtdAndar
      AuxControladores.qtdAndarDifMudarDir(infoInimigo.infoAndar, direcaoX, direcaoY, todoQtdDirecao); //direcaoX e Y podem nao ser nulos
    }else
    {
      //InfoInimigo: formaGeometrica, corImgMorto, vida, corVida, mostrarVidaSempre, porcentagemTempoVida, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec, infoAndar

      //infoAndar
      AuxControladores.qtdAndarDif(infoInimigo, this._infoInimigoPadrao, direcaoX, direcaoY, todoQtdDirecao);

      //corImgMorto, vida, corVida, mostrarVidaSempre, infoTiroPadrao, freqTiro, podeAtirarQualquerLado, qtdTiraVidaPersQndIntersec
      if (infoInimigo.corImgMorto === undefined)
        infoInimigo.corImgMorto = this._infoInimigoPadrao.corImgMorto;
      if (infoInimigo.vida === undefined)
        infoInimigo.vida = this._infoInimigoPadrao.vida;
      if (infoInimigo.corVida === undefined)
        infoInimigo.corVida = this._infoInimigoPadrao.corVida;
      if (infoInimigo.mostrarVidaSempre === undefined)
        infoInimigo.mostrarVidaSempre = this._infoInimigoPadrao.mostrarVidaSempre;
      if (infoInimigo.infoTiroPadrao === undefined)
        infoInimigo.infoTiroPadrao = this._infoInimigoPadrao.infoTiroPadrao;
      if (infoInimigo.freqTiro === undefined)
        infoInimigo.freqTiro = this._infoInimigoPadrao.freqTiro;
      if (infoInimigo.podeAtirarQualquerLado === undefined)
        infoInimigo.podeAtirarQualquerLado = this._infoInimigoPadrao.podeAtirarQualquerLado;
      if (infoInimigo.qtdTiraVidaPersQndIntersec === undefined)
        infoInimigo.qtdTiraVidaPersQndIntersec = this._infoInimigoPadrao.qtdTiraVidaPersQndIntersec;

      //porcentagemTempoVida (pode ser nulo)
      if (infoInimigo.porcentagemTempoVida === undefined)
        infoInimigo.porcentagemTempoVida = this._infoInimigoPadrao.porcentagemTempoVida;

      //formaGeometrica
      if (infoInimigo.formaGeometrica === undefined)
        infoInimigo.formaGeometrica = this._infoInimigoPadrao.formaGeometrica;
    }

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, this._infoInimigoPadrao.formaGeometrica);

    this._adicionarInimigo(new Inimigo(pontoInicial, infoInimigo));
  }
  adicionarInimigo(pontoInicial, infoInimigo)
  {
		if (infoInimigo === undefined)
      infoInimigo = this._infoInimigoPadrao;

    //se inimigo eh essencial (todos os inimigos dentro do controlador serao ou nao essenciais)
    infoInimigo.ehInimEssencial = this._ehDeInimigosEssenciais;

    //(x ou posicaoX, y ou posicaoY)
    pontoInicial = AuxControladores.pontoInicialCorreto(pontoInicial, infoInimigo.formaGeometrica);

    const novoInim = new Inimigo(pontoInicial, infoInimigo);
    this._adicionarInimigo(novoInim);
  }
  _adicionarInimigo(novoInim)
  {
    novoInim.procCriou(this._indexContr);

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
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.atirar(Direcao.Baixo);
  }

  //andar
  andarInimigos()
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
      {
        //retorna se tiro continua na lista (o morreu() eh feito la dentro)
        const continuaNaLista = this._inimigos.atual.andar(this._indexContr, indexInim);
        if (!continuaNaLista)
        //inimigo nao aparece na tela
          this._removerInimAtualCompleto();
      }
  }

 //outros...

  //para ver se level acabou
  algumInimNaTela()
  { return !this._inimigos.vazia; }

  //colisao com tiro
  verifColidirTiroPersTodosInim(info, tiro)
  //esses metodos funcionam por passagem por referencia de info
  {
    let inseriu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      //passa por todos os obstaculos
        inseriu = AuxControladores.auxAndarTiro(info, this._inimigos.atual, tiro, true) || inseriu;
    return inseriu;
  }

  //para quando um tiro for criado (ver se colide com inimigos)
  procColidirTiroCriadoTodosInim(tiro)
  {
    let colidiu = false;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        colidiu = this._inimigos.atual.procColidirTiroCriado(tiro, this._indexContr) || colidiu;
    return colidiu;
  }

  //andar personagem e obstaculo colidindo com tiros dos inimigos
  procObjTelaAndarColidirTirosTodosInim(objTelaColide, qtdMudarX, qtdMudarY, indexContrAndou, podeTirarVidaObjTela)
  //indexContrAndou soh eh necessario se objTela estiver em um controlador (ex: inimigo, obstaculo, tiro)
  //pers andou colidir com tiros de inimigos
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.procedimentoObjTelaColideAndar(objTelaColide, qtdMudarX, qtdMudarY,
        indexContrAndou, podeTirarVidaObjTela);
  }

  //verificar colidir com personagem e fazer devidos procedimentos se colidir
  procPersAndarTodosInim(qtdAndarX, qtdAndarY) //personagem andou
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.procPersAndar(this._indexContr, indexInim, qtdAndarX, qtdAndarY);
  }
  procPersCresceuTodosInim() //personagem cresceu de tamanho
  //pers andou colidir com inimigos
  {
    let indexInim = 0;
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual(), indexInim++)
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.procVerifColisaoPersInimEstatico(this._indexContr, indexInim);
  }

  //para andar ateh inimigo
	qntAndarInimigoMaisProximo(formaGeometrica)
  // formaGeometrica do objeto que vai andar ateh inimigo mais proximo
	{
    let menorHipotenusa = null;
    let praOndeAndar = {}; //x, y, inim
		for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        const qntAndar = ClasseAndar.qntAndarParaBater(formaGeometrica, this._inimigos.atual.formaGeometrica);
        const hipotenusa = Operacoes.hipotenusa(qntAndar.x, qntAndar.y);
        if (menorHipotenusa === null || hipotenusa < menorHipotenusa)
        {
          praOndeAndar.x = qntAndar.x;
          praOndeAndar.y = qntAndar.y;
          praOndeAndar.inim = this._inimigos.atual;
          menorHipotenusa = hipotenusa;
        }
      }

    return praOndeAndar;
	}

  //para obstaculo criado e personagem que aumentar de tamanho colidir com tiros dos inimigos
  procObjCriadoColidirTirosInim(objCriado, indexContr)
  {
    const tirarVida = !(objCriado instanceof Obstaculo);
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      this._inimigos.atual.controladorTiros.procedimentoObjTelaColideCriar(objCriado, indexContr, tirarVida);
  }

  //POCAO
  persMatouTodosInimNaoEssenc()
  {
    if (this._ehDeInimigosEssenciais) return;
    //soh mata os inimigos nao essenciais

    //mata todos os inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.seMatar();
  }
  tirarVidaTodosInim(qtdTira)
  {
    //tirar um pouco de vida de todos inimigos
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
        this._inimigos.atual.mudarVida(-qtdTira);
  }
  mudarCongelarTodosInim(congelar)
  //congelar: true = congelar, false = descongelar
  {
    for (this._inimigos.colocarAtualComeco(); !this._inimigos.atualEhNulo; this._inimigos.andarAtual())
      if (this._inimigos.atual.vivo)
      {
        if (congelar)
          this._inimigos.atual.congelar();
        else
          this._inimigos.atual.descongelar();
      }
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
    const qtdPodeAndar = Interseccao.qntPodeAndarAntesIntersec(objParado.formaGeometrica, objVaiAndar.formaGeometrica,
      info.qtdAndarXPadrao, info.qtdAndarYPadrao);
    const hipotenusa = Operacoes.hipotenusa(qtdPodeAndar.x, qtdPodeAndar.y);

    //se objVaiAndar vai bater em um obstaculo mais perto ou igual a um que jah bateu
    if (hipotenusa < info.menorHipotenusa || (!info.listaBateu.vazia && hipotenusa === info.menorHipotenusa))
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
      //if (!info.listaBateu.vazia && hipotenusa === info.menorHipotenusa)
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

  static qtdAndarDif(infoNovo, infoObjTelaPadrao, direcaoX, direcaoY, todoQtdDirecao)
  {
    if (infoNovo.infoAndar === undefined)
      infoNovo.infoAndar = infoObjTelaPadrao.infoAndar;
    else
    {
      if (infoNovo.infoAndar.qtdAndarX === undefined)
        infoNovo.infoAndar.qtdAndarX = infoObjTelaPadrao.infoAndar.qtdAndarX;
      if (infoNovo.infoAndar.qtdAndarY === undefined)
        infoNovo.infoAndar.qtdAndarY = infoObjTelaPadrao.infoAndar.qtdAndarY;
      if (infoNovo.infoAndar.tipoAndar === undefined)
        infoNovo.infoAndar.tipoAndar = infoObjTelaPadrao.infoAndar.tipoAndar;

      if (infoNovo.infoAndar.atehQualXYPodeAndar === undefined)
        infoNovo.infoAndar.atehQualXYPodeAndar = infoObjTelaPadrao.infoAndar.atehQualXYPodeAndar;
    }

    AuxControladores.qtdAndarDifMudarDir(infoTiro.infoAndar, direcaoX, direcaoY, todoQtdDirecao);
  }
  static qtdAndarDifMudarDir(infoAndar, direcaoX, direcaoY, todoQtdDirecao)
  // todoQtdDirecao: somar o qtdAndar das duas direcoes e colocar em um qtdAndar apenas (uma das duas direcoes tem que ser nulas ou direcaoX nao ser Direcao.Direita nem Direcao.Esquerda)
  {
    //nao eh pra dar problema se colocar Direcao.Baixo como DirecaoX por exemplo (mas tambem nao considerar)

    if (!todoQtdDirecao)
    {
      if (direcaoX === Direcao.Direita)
        infoAndar.qtdAndarX = Math.abs(infoAndar.qtdAndarX);
      else if (direcaoX === Direcao.Esquerda)
        infoAndar.qtdAndarX = -Math.abs(infoAndar.qtdAndarX);

      if (direcaoY === Direcao.Baixo)
        infoAndar.qtdAndarY = Math.abs(infoAndar.qtdAndarY);
      else if (direcaoY === Direcao.Cima)
        infoAndar.qtdAndarY = -Math.abs(infoAndar.qtdAndarY);
    }else
    {
      if (direcaoX === Direcao.Direita || direcaoX === Direcao.Esquerda)
      {
        infoAndar.qtdAndarX = (Math.abs(infoAndar.qtdAndarX) + Math.abs(infoAndar.qtdAndarY)) * ((direcaoX===Direcao.Esquerda)?-1:1);
        infoAndar.qtdAndarY = 0;
      }
      else
      if (direcaoY === Direcao.Cima || direcaoX === Direcao.Baixo)
      {
        infoAndar.qtdAndarX = 0;
        infoAndar.qtdAndarY = (Math.abs(infoAndar.qtdAndarX) + Math.abs(infoAndar.qtdAndarY)) * ((direcaoY===Direcao.Cima)?-1:1);
      }
    }
  }

  static pontoInicialCorreto(pontoInicial = {} /*objeto vazio*/, formaGeometricaPadrao)
  {
    //(x ou posicaoX, y ou posicaoY)
    if (pontoInicial.x === undefined && pontoInicial.posicaoX === undefined) pontoInicial.x = formaGeometricaPadrao.x;
    if (pontoInicial.y === undefined && pontoInicial.posicaoY === undefined) pontoInicial.y = formaGeometricaPadrao.y;
    return pontoInicial;
  }
}


//controlador timers (diferente dos demais)
class ControladorTimersLevel
{
  constructor()
  { this._timers = []; }

  adicionarTimer(timer) //ao terem criado os timers, ele jah foi adicionado ao ConjuntoTimers (nao precisa adicionar)
  { this._timers.push(timer); }

  excluirTimers()
  {
    this._timers.forEach(function(value, key)
    //vai passar por todos os timers
    {
      value.parar();
      //vai tirar o Timer do ConjuntoTimers (nao vai mais fazer o seu procedimento)
    });

    this._timers = [];
    //nao tem mais nenhum timer efetivo (nao parado)
  }
}
