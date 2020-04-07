const TipoPocao = {
	"DiminuirTamanhoPers": 1,
	"TiroPersMaisRapidoMortal": 2,

	"RUIMPersPerdeVel": 3,
	"PersMaisRapido": 4,

	"PersComMissil": 5,
	"GanharPoucaVida": 6,

	"RUIMPersPerdeVida": 7,
	"MatarObjetos1Tiro": 8,

	"MatarInimigosNaoEssenc": 9,

	"TirarVidaTodosInim": 10,
	"GanharMuitaVida": 11,

	"ReverterTirosJogoInimDirInim": 12,
	"RUIMTirosPersDirEle": 13,

	"DeixarTempoMaisLento": 14,

	"ReverterTirosJogoInimSeguirInim": 15,

	"CongelarInimigos": 16
};
/* IDEIAS DE POCOES:
- Poção para diminuir tamanho do personagem (imediatamente)
- Poção para tiro do pers andar mais rápido e ser mais mortal (nao imediatamente)
- RUIM: Pocao para personagem perder velocidade
- Poção para deixar personagem mais rápido (nao imediatamente)
- Poção para personagem ter tiro de missil (imediatamente)
- Poção para ganhar um pouco de vida (imediatamente)
- RUIM: Pocao personagem perde vida
- Poção para matar com um tiro todos os inimigos nao essenciais e obstaculos da tela (nao imediatamente)
- Poção para matar todos os inimigos nao essenciais (imediatamente)
- Poção para tirar um pouco de vida de todos os inimigos (imediatamente)
- Poção para ganhar muita vida (nao imediatamente)
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e direcao o inimigo mais proximo (nao imediatamente)
- RUIM: Pocao para os tiros do personagem se voltarem na direcao dele (feitico contra o feiticeiro)
- Poção para deixar o tempo mais lento (tudo anda X%) (imediatamente)
- Poção para reverter todos os tiros de todos os inimigos e do jogo em de personagem e seguindo o inimigo mais proximo (imediatamente)
- Poção para congelar inimigos (imediatamente)
*/

//constantes executarPocao
const porcentagemSetTam = 0.5;
const porcentagemSetVelRuim = 0.5;
const porcentagemDeixarTempoLento = 0.25;

const porcentagemSetVel = 1.4;
const porcentagemVelTiroSeVoltarPers = 0.4;
const porcentagemMortalidadeTiroSeVoltarPers = 0.15;

const qtdGanhaPoucaVida = 7;
const qtdPerdeVida = 10;
const qtdGanhaMuitaVida = 12;

const qtdTiraVidaTodosInim = 70;

const indexArmaMissilPers = 0; //de acordo com "TER EM MENTE.txt"
const freqMissilPers = 14;
const freqAtirarMaisRapidoMortal = 5;

//POCAO
class Pocao {
	constructor(codPocao) {
		this._codPocao = codPocao;
		this._informacoesPocao = Pocao.informacoesPocaoFromCod(codPocao);
		this._personagemJahPegou = false;
	}

	//getters
	get codPocao() { return this._codPocao; }
	get nome() { return this._informacoesPocao.nome; }
	get ativadoInstant() { return this._informacoesPocao.ativadoInstant; }
	get temDesexecutar() { return this._informacoesPocao.temDesexecutar; }
	get mudaAviaoPersTemp() //se a pocao muda o aviao do personagem temporariamente (se mexeria em algumas coisas do personagem em pocao.desexecutar())
	{ return this._informacoesPocao.temDesexecutar && this._informacoesPocao.mudaAviaoPersTemp; }

	get tempoTotal() { return this._tempoTotal; }
	get tempoRestante() { return this._tempoRestante; }

	static informacoesPocaoFromCod(codPocao) {
		switch (codPocao)
		//mudaAviaoPersTemp soh eh obrigatorio se temDesexecutar for true
		{
			case TipoPocao.DiminuirTamanhoPers:
				return { nome: "Poção anão", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: true };
			case TipoPocao.MatarObjetos1Tiro:
				return { nome: "Poção Fácil de Matar", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: false };
			case TipoPocao.RUIMPersPerdeVel:
				return { nome: "Poção Space-Mud", ativadoInstant: true, temDesexecutar: true, mudaAviaoPersTemp: true };
			case TipoPocao.TiroPersMaisRapidoMortal:
				return { nome: "Poção Tiro Master", ativadoInstant: true, temDesexecutar: true, mudaAviaoPersTemp: true };
			case TipoPocao.MatarInimigosNaoEssenc:
				return { nome: "Poção Destruição em Massa", ativadoInstant: true, temDesexecutar: false };
			case TipoPocao.ReverterTirosJogoInimDirInim:
				return { nome: "Poção Tiros se Rebelam", ativadoInstant: false, temDesexecutar: false };
			case TipoPocao.GanharPoucaVida:
				return { nome: "Poção Ajuda dos Deuses", ativadoInstant: true, temDesexecutar: false };
			case TipoPocao.RUIMPersPerdeVida:
				return { nome: "Poção Burn Alive", ativadoInstant: true, temDesexecutar: false };
			case TipoPocao.ReverterTirosJogoInimSeguirInim:
				return { nome: "Poção Fúria contra Inimigos", ativadoInstant: true, temDesexecutar: false };
			case TipoPocao.DeixarTempoMaisLento:
				return { nome: "Poção Flash", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: false };
			case TipoPocao.RUIMTirosPersDirEle:
				return { nome: "Poção Feitiço Contra Feiticeiro", ativadoInstant: true, temDesexecutar: false };
			case TipoPocao.GanharMuitaVida:
				return { nome: "Poção os Deuses te Amam", ativadoInstant: false, temDesexecutar: false };
			case TipoPocao.PersMaisRapido:
				return { nome: "Poção Bolt", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: true };
			case TipoPocao.PersComMissil:
				return { nome: "Poção Míssil", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: true };
			case TipoPocao.TirarVidaTodosInim:
				return { nome: "Poção Ácido Corrosivo", ativadoInstant: false, temDesexecutar: false };
			case TipoPocao.CongelarInimigos:
				return { nome: "Poção Freeze", ativadoInstant: false, temDesexecutar: true, mudaAviaoPersTemp: false };

			default:
				throw "Esse codigo pocao nao existe!";
		}
	}

	getMedidasFormaGeometrica(ehPrimeiraPocao = false)
	//toma em consideracao se this._personagemJahPegou e se ehPrimeiraPocao (quando jah pegou)
	//ehPrimeiraPocao: se eh a pocao mais a baixo ou nao (soh precisa se personagem jah pegou pocao)
	{
		let width = this._proporcaoWidhHeightFormaGeom(); //width/height = width se height=1
		let tamanho;
		if (this._personagemJahPegou) {
			if (ehPrimeiraPocao)
				//se eh a proxima a ser chamada
				tamanho = heightPrimeiraPocao;
			else
				//se nao estah usando
				tamanho = heightOutrasPocoes;
		}
		else
			tamanho = 55;
		return { width: width * tamanho, height: tamanho };
	}
	_proporcaoWidhHeightFormaGeom() {
		switch (this._codPocao) {
			case TipoPocao.MatarObjetos1Tiro:
				return 0.835;
			case TipoPocao.ReverterTirosJogoInimSeguirInim:
				return 1;
			case TipoPocao.DeixarTempoMaisLento:
				return 0.865;
			case TipoPocao.GanharMuitaVida:
				return 1.023;
			case TipoPocao.PersComMissil:
				return 1;
			case TipoPocao.CongelarInimigos:
				return 0.89;

			default:
				return 1;
		}
	}
	get _nomePocao() {
		for (var nomePocaoAtual in TipoPocao)
			if (TipoPocao[nomePocaoAtual] === this._codPocao)
				return nomePocaoAtual;
	}
	getFormaGeomInfoImgVivo(ehPrimeiraPocao)
	//soh precisa ehPrimeiraPocao se personagem jah pegou pocao
	{
		const medidas = this.getMedidasFormaGeometrica(ehPrimeiraPocao);
		return {
			formaGeometrica: new Retangulo(undefined, undefined, medidas.width, medidas.height),
			infoImgVivo: new InfoImgVivo([ArmazenadorInfoObjetos.getImagem("Pocoes/" + this._nomePocao)])
		};
	}

	//QUANDO USUARIO PEGOU POCAO
	procMorreu()
	// retorna se jah foi usado
	{
		this._personagemJahPegou = true;

		if (this._informacoesPocao.ativadoInstant)
			ControladorJogo.pers.controladorPocoesPegou.adicionarPocaoUsando(this);
		else
			ControladorJogo.pers.controladorPocoesPegou.adicionarPocao(this);

		return this._informacoesPocao.ativadoInstant;
	}

	//EXECUTAR E DESECUTAR POCAO
	executarPocao() {
		let tempoPocaoResta = null; //quanto tempo a pocao fica ativo ateh desaparecer de novo (em milisegundos)
		let pocaoMudaPers; //soh obrigatorio para pocoes que tenham desexecutar

		switch (this._codPocao) {
			case TipoPocao.DiminuirTamanhoPers:
				tempoPocaoResta = 7500;
				pocaoMudaPers = true;
				ControladorJogo.pers.mudarTamanho(porcentagemSetTam); //50% do tamanho
				break;

			case TipoPocao.MatarObjetos1Tiro:
				//mudanca na propria classe Obstaculo e Inimigo
				tempoPocaoResta = 3000;
				pocaoMudaPers = false;
				break;

			case TipoPocao.RUIMPersPerdeVel:
				tempoPocaoResta = 5000;
				pocaoMudaPers = true;
				ControladorJogo.pers.mudarVelocidade(porcentagemSetVelRuim);
				break;

			case TipoPocao.TiroPersMaisRapidoMortal:
				tempoPocaoResta = 8500;
				pocaoMudaPers = true;

				//porque depende do aviao do personagem, qual o index que vai ter o tiro bom
				const indexTiroMelhor = ControladorJogo.pers.indexTiroMelhor;
				//mudar frequencia
				const freqFuncAtual = ControladorJogo.pers.getFreqFuncAtirar(indexTiroMelhor);
				this._frequenciaAtirarAntigo = freqFuncAtual.freq;
				freqFuncAtual.freq = freqAtirarMaisRapidoMortal;
				//mudar infoTiro
				ControladorJogo.pers.getControladorTiros(indexTiroMelhor).colocarInfoTiroEspecial(ArmazenadorInfoObjetos.infoTiro("TiroForte", true));
				break;

			case TipoPocao.MatarInimigosNaoEssenc:
				ControladorJogo.controladoresInimigos.forEach(controladorInims => {
					if (!controladorInims.ehDeInimigosEssenciais)
						//soh mata os inimigos nao essenciais
						controladorInims.matarTodosInim();
				});
				break;

			case TipoPocao.ReverterTirosJogoInimDirInim:
				this._reverterTirosContraInimigos(false);
				break;

			case TipoPocao.GanharPoucaVida:
				ControladorJogo.pers.mudarVida(qtdGanhaPoucaVida);
				break;

			case TipoPocao.RUIMPersPerdeVida:
				ControladorJogo.pers.mudarVida(-qtdPerdeVida);
				break;

			case TipoPocao.ReverterTirosJogoInimSeguirInim:
				this._reverterTirosContraInimigos(true);
				break;

			case TipoPocao.DeixarTempoMaisLento:
				tempoPocaoResta = 5000;
				pocaoMudaPers = false;
				/* para deixar tempo mais lento:
				  -> tiros tela. OK
				  -> inimigos (incluindo tiros deles, atirar e inimigosSurgindo). OK
				  -> obstaculos. OK
				  -> Timers (aqui soh os que jah existem). OK
				  ps1: verificar se nao existem Timers no PersonagemPrincipal
				  ps2: verificar se nao podem ser criados freqFuncs sem ser do pers durante esse tempo
		
				resto:
				  -> quando Timers forem criados. OK
				  -> quando tiros(sem ser do personagem), obstaculos ou inimigos(freqFuncAtirar tambem) forem criados. OK
				*/
				//tiros sem dono
				ControladorJogo.controladorOutrosTirosNaoPers.mudarTempo(porcentagemDeixarTempoLento);
				//suportes aereos
				ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.mudarTempo(porcentagemDeixarTempoLento));
				//inimigos (incluindo tiros deles e freqFuncAtirar)
				ControladorJogo.controladoresInimigos.forEach(controladorInims =>
					controladorInims.mudarTempo(porcentagemDeixarTempoLento));
				//obstaculos
				ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
					controladorObsts.mudarTempo(porcentagemDeixarTempoLento));
				//escuridao
				if (ControladorJogo.escuridao !== undefined)
					ControladorJogo.escuridao.mudarTempo(porcentagemDeixarTempoLento);
				//Timers
				ConjuntoTimers.mudarTempo(porcentagemDeixarTempoLento);
				break;

			case TipoPocao.RUIMTirosPersDirEle:
				//virar tiros contra criador
				ControladorJogo.pers.virarTirosContraCriador(false);
				//diminuir a velocidade e o dano
				ControladorJogo.pers.armas.forEach(arma => {
					arma.controlador.mudarQtdAndarTiros(porcentagemVelTiroSeVoltarPers);
					arma.controlador.mudarMortalidadeTiros(porcentagemMortalidadeTiroSeVoltarPers, true);
				});
				break;

			case TipoPocao.GanharMuitaVida:
				ControladorJogo.pers.mudarVida(qtdGanhaMuitaVida);
				break;

			case TipoPocao.PersMaisRapido:
				tempoPocaoResta = 7500;
				pocaoMudaPers = true;
				ControladorJogo.pers.mudarVelocidade(porcentagemSetVel);
				break;

			case TipoPocao.PersComMissil:
				tempoPocaoResta = 4500;
				pocaoMudaPers = true;

				//setar novo tiro
				ControladorJogo.pers.getControladorTiros(indexArmaMissilPers).colocarInfoTiroEspecial(ArmazenadorInfoObjetos.infoTiro("TiroMissil", true));

				//guardar frequencia e atirarDireto antigo antes de muda-los
				this._informacoesNaoMissil = {
					freq: ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq,
					atirarDireto: ControladorJogo.pers.getConfigArma(indexArmaMissilPers).atirarDireto
				};

				//mudar freqAtirar e atirarDireto
				ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq = freqMissilPers;
				ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).setContadorUltimaEtapa(); //ele jah vai atirar missil em seguida
				ControladorJogo.pers.getConfigArma(indexArmaMissilPers).atirarDireto = true;
				break;

			case TipoPocao.TirarVidaTodosInim:
				//passa por todos os controladores de inimigos
				ControladorJogo.controladoresInimigos.forEach(controladorInims =>
					controladorInims.tirarVidaTodosInim(qtdTiraVidaTodosInim));
				break;

			case TipoPocao.CongelarInimigos:
				tempoPocaoResta = 5000;
				pocaoMudaPers = false;
				//congelar todos os inimigos
				ControladorJogo.controladoresInimigos.forEach(controladorInims =>
					controladorInims.mudarCongelarTodosInim(true));
				break;

			default:
				throw "Esse codigo pocao nao existe!";
		}

		if (this.mudaAviaoPersTemp)
			//para mudancas feitas em uma certa nave do personagem nao desexecutar em outra
			this._numeroAviaoPers = ControladorJogo.pers.numeroAviao;

		if (tempoPocaoResta !== null) //se tem que desexecutar depois de um tempo, programa esse Timer (pode ser soh uma acao pontual)
		{
			//programa quando quando vai parar com esse pocao
			this._timerDesexecutar = new Timer(() => { this.desexecutarPocao(); }, tempoPocaoResta, false, false /*pocao transcende o level (mesmo se o level acabar ainda vai ter que desexecutar)*/,
				pocaoMudaPers, { obj: this, atr: "_tempoRestante" }); //atualiza quanto tempo falta

			this._tempoTotal = tempoPocaoResta;
			//this._tempoRestante = tempoPocaoResta; nao precisa setar tempoRestante porque Timer jah faz isso
		} else
			delete this._timerDesexecutar;
	}
	pararTimerDesexecutar() { this._timerDesexecutar.parar(); }
	desexecutarPocao()
	// se sohSaberSeTem, eh soh pra saber se tem ou nao desexecutar (nao desexecuta)
	{
		//para nao desfazer mudancas de outra nave nessa
		if (this.mudaAviaoPersTemp && this._numeroAviaoPers !== ControladorJogo.pers.numeroAviao)
			//nao precisa nem tirar a pocao do ControladorPocoesPers porque jah foi tirado pelo personagem quando pers trocou de aviao
			return;

		// SE FOR MUDAR SE UMA POCAO TEM OU NAO DESEXECUTAR COLAR DE NOVO EM "get temDesexecutar()"
		switch (this._codPocao) {
			//case TipoPocao.MatarInimigosNaoEssenc: (acao pontual)
			//case TipoPocao.ReverterTirosJogoInimDirInim: (acao pontual)
			//case TipoPocao.GanharPoucaVida: (acao pontual)
			//case TipoPocao.RUIMPersPerdeVida: (acao pontual)
			//case TipoPocao.ReverterTirosJogoInimSeguirInim: (acao pontual)
			//case TipoPocao.RUIMTirosPersDirEle: (acao pontual)
			//case TipoPocao.GanharMuitaVida: (acao pontual)
			//case TipoPocao.TirarVidaTodosInim: (acao pontual)

			case TipoPocao.MatarObjetos1Tiro: //(nao eh acao pontual: porem nao tem que fazer nada de diferente, apenas falar que a pocao acabou - pois como a programacao para isso depende do personagem estar usando esse poder, quando o poder acaba o tempo ele jah para automaticamente)
				break;

			case TipoPocao.DiminuirTamanhoPers:
				ControladorJogo.pers.mudarTamanho(Probabilidade.porcentagemVoltarNormal(porcentagemSetTam)); //200% do tamanho (50%) => vai voltar a 100% (proporcionalmente)
				break;

			case TipoPocao.RUIMPersPerdeVel:
				ControladorJogo.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVelRuim)); //aumenta a velocidade (proporcionalmente)
				break;

			case TipoPocao.TiroPersMaisRapidoMortal:
				//porque depende do aviao do personagem qual a arma que vai ter tiro bom
				const indexTiroMelhor = ControladorJogo.pers.indexTiroMelhor;
				//mudar frequencia
				ControladorJogo.pers.getFreqFuncAtirar(indexTiroMelhor).freq = this._frequenciaAtirarAntigo;
				delete this._frequenciaAtirarAntigo;
				//mudar info
				ControladorJogo.pers.getControladorTiros(indexTiroMelhor).voltarInfoTiroPadrao();
				break;

			case TipoPocao.PersComMissil:
				//volta tiro padrao (volta uma camada)
				ControladorJogo.pers.getControladorTiros(indexArmaMissilPers).voltarInfoTiroPadrao();

				//voltar frequencia e atirarDireto antiga
				ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).freq = this._informacoesNaoMissil.freq;
				ControladorJogo.pers.getConfigArma(indexArmaMissilPers).atirarDireto = this._informacoesNaoMissil.atirarDireto;

				// zerar contagem do freqFunc
				ControladorJogo.pers.getFreqFuncAtirar(indexArmaMissilPers).zerarContador();

				//se nao for atirarDireto, falar que nao pode atirar
				if (!ControladorJogo.pers.getConfigArma(indexArmaMissilPers).atirarDireto)
					ControladorJogo.pers.getConfigArma(indexArmaMissilPers).podeAtirar = false;

				//deletar variavel que guardava frequencia antiga
				delete this._informacoesNaoMissil;
				break;

			case TipoPocao.PersMaisRapido:
				ControladorJogo.pers.mudarVelocidade(Probabilidade.porcentagemVoltarNormal(porcentagemSetVel)); //diminui a velocidade de novo (proporcionalmente)
				break;

			case TipoPocao.CongelarInimigos:
				//descongelar todos os inimigos (voltar etapa)
				ControladorJogo.controladoresInimigos.forEach(controladorInims =>
					controladorInims.mudarCongelarTodosInim(false));
				break;

			case TipoPocao.DeixarTempoMaisLento:
				//voltar tempo ao normal
				const porcVoltarTempoNormal = Probabilidade.porcentagemVoltarNormal(porcentagemDeixarTempoLento);
				//tiros sem dono
				ControladorJogo.controladorOutrosTirosNaoPers.mudarTempo(porcVoltarTempoNormal);
				//suportes aereos
				ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.mudarTempo(porcVoltarTempoNormal));
				//inimigos (incluindo tiros deles e freqFuncAtirar)
				ControladorJogo.controladoresInimigos.forEach(controladorInims =>
					controladorInims.mudarTempo(porcVoltarTempoNormal));
				//obstaculos
				ControladorJogo.controladoresObstaculos.forEach(controladorObsts =>
					controladorObsts.mudarTempo(porcVoltarTempoNormal));
				//escuridao
				if (ControladorJogo.escuridao !== undefined)
					ControladorJogo.escuridao.mudarTempo(porcVoltarTempoNormal);
				//Timers
				ConjuntoTimers.mudarTempo(porcVoltarTempoNormal);
				break;

			default:
				console.trace();
		}

		//para mudancas feitas em uma certa nave do personagem nao desexecutar em outra
		delete this._numeroAviaoPers;

		ControladorJogo.pers.controladorPocoesPegou.acabouUsarPocao(true);
	}

	//auxiliares
	_reverterTirosContraInimigos(seguir) {
		//tiros sem dono
		ControladorJogo.controladorOutrosTirosNaoPers.virarTirosContraCriador(seguir);
		//suportes aereos
		ControladorJogo.controladorSuportesAereos.suportesAereos.forEach(suporteAereo => suporteAereo.virarTirosContraCriador(seguir));
		//tiros dos inimigos
		ControladorJogo.controladoresInimigos.forEach(controladorInims => controladorInims.virarTirosInimsContraCriador(seguir));
	}
}
//ps: tudo que eh execucao da pocao feito fora dessa classe estah escrito: "PARTE DA EXECUCAO DA POCAO"...


//quando personagem ainda nao pegou
class InfoObjetoTelaPocao extends InfoObjetoTelaSimples {
	constructor(formaGeometrica, infoImgVivo, pocao) {
		super(formaGeometrica, infoImgVivo);
		this.pocao = pocao;
	}
}
class ObjetoTelaPocao extends ObjetoTelaSimples {
	constructor(pontoInicial, infoObjetoTelaPocao)
	// nao faz clone no pocao
	{
		//formaGeometrica e imagens vivo
		super(pontoInicial, infoObjetoTelaPocao);

		//pocao
		this._pocao = infoObjetoTelaPocao.pocao;
	}

	intersectaPers(qtdAndarX, qtdAndarY) {
		if (qtdAndarX === undefined && qtdAndarY === undefined)
			return ControladorJogo.pers.interseccao(this._formaGeometrica);
		else
			return Interseccao.vaiTerInterseccao(this._formaGeometrica, ControladorJogo.pers.formaGeometrica, qtdAndarX, qtdAndarY);
		//aqui eh o personagem que andou entao nao precisa chamar o metodo proprio dele jah que se ele andou ele estah vivo
	}

	procMorreu() {
		this._pocao.procMorreu();
		//coloca mais uma pocao no controladorPocoesPers, e, jah executa a pocao ou deixa a pocao guardado para o usuario quiser usar
	}
}

const distanciaMinPersPocao = 350; //calculado a distancia entre os centro-de-massas
const tempoVaiFicarTela = 7000;
const qtdPocoesUltimosLvs = 5; //se certa probabilidade vai escolher uma pocao dentro os 5 ultimos
const levelJahTem2Pocoes = 9;
class ControladorPocaoTela {
	constructor() {
		//futuro atributo: this._objPocao (nao precisa gastar memoria agora)
		this._jahProgramouDeixarPocaoTela = false; //se jah criou o Timer para colocar Pocao tela
		this._funcCamadasColTirPocaoTempo = new FuncEmCamadas();

		//quantas pocoes faltam programar
		this._qtdPocoesFaltaProgramar = 0;
	}

	get temObjPocao() { return this._objPocao !== undefined; }
	get objPocao() { return this._objPocao; }

	//antes da pocao ter sido adicionado a tela
	programarPocoesLevel()
	//ps: soh o ControladorJogo chama esse metodo
	//programa para adicionar e remover todas as pocoes (tenta fazer com que o numero de maximo de pocoes do level seja adicionado antes do level acabar)
	{
		const maxPocoesLevelAtual = ControladorPocaoTela._maxPocoesFromLevel(ControladorJogo.level);
		if (maxPocoesLevelAtual > this._qtdPocoesFaltaProgramar)
		//se usuario passou o level anterior mais rapido que o esperado e nao deu tempo de colocar algumas pocoes na tela, e, faltar mais pocoes doq o numero maximo de pocoes desse level, nao substitui
		{
			this._qtdPocoesFaltaProgramar = maxPocoesLevelAtual;
			if (this._jahProgramouDeixarPocaoTela)
				//se jah deixou programado para colocar uma pocao na tela e ainda nao tirou essa pocao, teria uma pocao a mais nesse level
				this._qtdPocoesFaltaProgramar--;
		}

		//dividir o tempo em qtdPocoesFaltaAdd vezes e deixar uma pocao para cada parcela desse tempo
		this._intervaloCadaPocao = ControladorJogo.tempoEstimadoLevel(ControladorJogo.level) / this._qtdPocoesFaltaProgramar * 1000/*para jah ficar em milisegundos*/;

		this._precisaSetarProgramarPocoes = this._jahProgramouDeixarPocaoTela;
		//se jah deixou programado de colocar uma pocao na tela e ainda nao tirou da tela, tem que esperar ela sair para programar de colocar a proxima pocao
		//nao tem como jah setar um Timer porque nao se saber quanto tempo falta para a pocao sair da tela

		if (!this._jahProgramouDeixarPocaoTela)
			this._criarTmrsProgramarPocoes();
	}
	_criarTmrsProgramarPocoes() {
		//programar proximas pocoes
		for (let i = 1; i < this._qtdPocoesFaltaProgramar; i++)
			new Timer(() => this._programarPocao(), i * this._intervaloCadaPocao); //esse timer nao transcende o level (o outro soh transcende porque jah fez o random pra ver se terah pocao)

		//programar primeira pocao
		this._programarPocao(); //esse metodo nao vai adicionar uma pocao agora (vai setar o Timer para pocao surgir depois de um determinado tempo)
	}

	_programarPocao()
	//programa para adicionar e remover cada uma das pocoes (soh programa para adicionar se Probabilidade.chance())
	{
		if (this._jahProgramouDeixarPocaoTela || //se jah fez um timer para colocar pocao na tela
			!ControladorPocaoTela._probabilidadeExistirPocaoFromLevel(ControladorJogo.level)) // cada level tem uma chance de ter pocao diferente (os primeiros levels tem menos, e vai aumentando)
			return;

		// estah programando para colocar poder na tela (soh pode programar para colocar outro quando esse jah tiver sumido)
		this._jahProgramouDeixarPocaoTela = true;
		this._qtdPocoesFaltaProgramar--;

		//random de tempo para colocar na tela e jah setar timer para colocar pocao na tela
		const qntTempoFaltaPraColocar = Math.myrandom(100, this._intervaloCadaPocao - tempoVaiFicarTela - tempoPocaoAparecerDuranteLv);
		//no minimo 0.1 segundos e no maximo para acabar um segundo antes do tempo previsto para o level
		new Timer(() => this._colocarPocaoTela(), qntTempoFaltaPraColocar, false, false/*pocao transcende o level*/);

		//programar tira-lo depois de certo tempo
		new Timer(() => this.tirarPocaoTela(),
			tempoVaiFicarTela + qntTempoFaltaPraColocar + tempoPocaoAparecerDuranteLv, false, false /*pocao transcende o level*/);
	}
	_colocarPocaoTela() {
		this._funcCamadasColTirPocaoTempo.subirCamada();

		//pega todos as pocoes disponiveis naquele level
		const pocoesPossiveis = ControladorPocaoTela._pocoesPossiveisFromLevel(ControladorJogo.level);

		//deixar mais provavel pegar pocoes dos ultimos levels (3/5 de chance)
		let qtdPocoesPossiveis;
		if (pocoesPossiveis.length > qtdPocoesUltimosLvs && Probabilidade.chance(3, 5))
			//se ha mais pocoes disponiveis do que [qtdPocoesUltimosLvs] E se a chance de 3/5 (entao ele pega soh um dos 5 primeiros)
			//os melhores pocoes estao no comeco do vetor (os ultimos levels colocam a pocao antes)
			qtdPocoesPossiveis = qtdPocoesUltimosLvs;
		else
			qtdPocoesPossiveis = pocoesPossiveis.length;

		//escolher pocao randomly
		const pocao = new Pocao(pocoesPossiveis[Math.myrandom(0, qtdPocoesPossiveis)]); //cria pocao a partir do codigo

		//ponto onde pocao nao estah em cima do pers nem muuito perto dele
		const pontoPode = this._pontoPodeColocar(pocao.getMedidasFormaGeometrica());

		//fazer pocao ir aparecendo na tela aos poucos (opacidade e tamanho): ele nao interage com o meio ainda
		const formaGeomInfoImgVivo = pocao.getFormaGeomInfoImgVivo();
		const infoObjAparecendo = new InfoObjetoTelaAparecendo(false, true, undefined,
			formaGeomInfoImgVivo.formaGeometrica, formaGeomInfoImgVivo.infoImgVivo);
		this._objPocao = new ObjetoTelaAparecendo(pontoPode, infoObjAparecendo, TipoObjetos.Pocao, (formaGeomApareceu, indexInicialImgVivo) => {
			//para que o index da imagem vivo seja o mesmo (ideia de continuidade e nao quebra):
			formaGeomInfoImgVivo.infoImgVivo.indexInicial = indexInicialImgVivo;
			//adicionar objPocao propriamente dito (e jah tirando o ObjetoTelaAparecendo)
			this._objPocao = new ObjetoTelaPocao(pontoPode, new InfoObjetoTelaPocao(formaGeomApareceu,
				formaGeomInfoImgVivo.infoImgVivo, pocao));
		});
	}

	//onde colocar
	_pontoPodeColocar(medidasFormaGeom) {
		let pontoPode = new Ponto(0, 0);
		for (; ;) {
			pontoPode.x = Math.myrandom(0, width - medidasFormaGeom.width);
			pontoPode.y = Math.myrandom(0, height - heightVidaUsuario - medidasFormaGeom.height);
			if (this._pocaoPodeLugar(pontoPode, medidasFormaGeom))
				break;
		}
		return pontoPode;
	}
	_pocaoPodeLugar(pontoPode, medidasFormaGeom) {
		if (ControladorJogo.pers.formaGeometrica === undefined) //se personagem jah morreu e jah acabou de printar imgs morto
			return true;

		const formaGeomPocao = new Retangulo(pontoPode.x, pontoPode.y, medidasFormaGeom.width, medidasFormaGeom.height);

		//ver se estah intersectando inimigos parados
		const intersectaAlgumInim = ControladorJogo.controladoresInimigos.some(controladorInims =>
			controladorInims.pocaoIntersectaInimParado(formaGeomPocao));
		if (intersectaAlgumInim)
			return false;

		//ve se estah intersectando personagem
		if (Interseccao.interseccaoComoRetangulos(ControladorJogo.pers.formaGeometrica, formaGeomPocao))
			return false;

		//calcula distancia do centro de massa do personagem ateh o centro de massa da pocao
		return ControladorJogo.pers.formaGeometrica.centroMassa.distancia
			(pontoPode.mais({ x: medidasFormaGeom.width / 2, y: medidasFormaGeom.height / 2 })) //centroMassa da pocao
			>= distanciaMinPersPocao;
	}

	//qual pocao
	static _pocoesPossiveisFromLevel(level)
	//retorna um vetor com todos os indexes de pocoes possiveis
	{
		let pocoesPossiveis = [];

		if (ControladorJogo.previaJogo)
		//os mais legais
		{
			pocoesPossiveis.push(TipoPocao.DeixarTempoMaisLento);
			pocoesPossiveis.push(TipoPocao.CongelarInimigos);
			pocoesPossiveis.push(TipoPocao.ReverterTirosJogoInimSeguirInim);
			pocoesPossiveis.push(TipoPocao.PersComMissil);
			pocoesPossiveis.push(TipoPocao.MatarObjetos1Tiro);
			pocoesPossiveis.push(TipoPocao.GanharMuitaVida);
		} else
		//por level
		{
			if (level > 12) level = 12;
			switch (level) {
				case 12:
					pocoesPossiveis.push(TipoPocao.CongelarInimigos);
				case 11:
					pocoesPossiveis.push(TipoPocao.ReverterTirosJogoInimSeguirInim);
				case 10:
					pocoesPossiveis.push(TipoPocao.DeixarTempoMaisLento);
				case 9:
					pocoesPossiveis.push(TipoPocao.RUIMTirosPersDirEle);
				case 8:
					pocoesPossiveis.push(TipoPocao.TirarVidaTodosInim);
					pocoesPossiveis.push(TipoPocao.GanharMuitaVida);
				case 7:
					pocoesPossiveis.push(TipoPocao.MatarInimigosNaoEssenc);
				case 6:
					pocoesPossiveis.push(TipoPocao.RUIMPersPerdeVida);
					pocoesPossiveis.push(TipoPocao.MatarObjetos1Tiro);
				case 5:
					pocoesPossiveis.push(TipoPocao.PersComMissil);
					pocoesPossiveis.push(TipoPocao.GanharPoucaVida);
				case 4:
				case 3:
					pocoesPossiveis.push(TipoPocao.RUIMPersPerdeVel);
					pocoesPossiveis.push(TipoPocao.PersMaisRapido);
				case 2:
				case 1:
					pocoesPossiveis.push(TipoPocao.DiminuirTamanhoPers);
					pocoesPossiveis.push(TipoPocao.TiroPersMaisRapidoMortal);
					break;
			}
		}

		return pocoesPossiveis;
	}

	//probabilidade
	static _probabilidadeExistirPocaoFromLevel(level) {
		if (ControladorJogo.previaJogo)
			return true;

		switch (level) {
			case 1:
				return false; //0%
			case 2:
			case 3:
				return Probabilidade.chance(1, 2); //50%
			case 4:
			case 5:
				return Probabilidade.chance(7, 10); //70%
			case 6:
				return Probabilidade.chance(4, 5); //80%

			default: //proximo level e os proximos
				return true; //100%
		}
	}
	static _maxPocoesFromLevel(level) {
		if (ControladorJogo.previaJogo || ControladorJogo.level >= levelJahTem2Pocoes)
			return 2;
		return 1;
	}

	tirarPocaoTela(tirouPorFaltaTempo = true) {
		if (tirouPorFaltaTempo && (!this._funcCamadasColTirPocaoTempo.descerCamada() || this._objPocao === undefined))
			// se ainda nao eh a hora de tirar (por causa das camadas) ou se pocao jah foi tirada ou se ele jah estah morto
			return;
		delete this._objPocao;
		this._jahProgramouDeixarPocaoTela = false;

		//para quando comecar o level e ainda tiver uma pocao programada ou na tela do level anterior, o level atual nao ficar com pocoes a menos e nem que haja a possibilidade de surgir duas pocoes ao mesmo tempo
		if (this._precisaSetarProgramarPocoes === true)
			this._criarTmrsProgramarPocoes();
		delete this._precisaSetarProgramarPocoes;
	}

	//depois que pocao jah foi adicionado a tela
	verificarPersPegouPocao(qtdAndarX, qtdAndarY) {
		if (this._objPocao !== undefined && this._objPocao instanceof ObjetoTelaPocao && //se for ObjetoTelaAparecendo nao interage com o meio
			!ControladorJogo.pers.controladorPocoesPegou.estahUsandoPocao && //soh pode pegar a pocao se pers nao tiver usando nenhuma no momento
			this._objPocao.intersectaPers(qtdAndarX, qtdAndarY)) {
			this._objPocao.procMorreu(); //coloca mais uma pocao no controladorPocoesPers e executa ou nao a pocao dependendo de qual pocao eh
			this.tirarPocaoTela(false); //tiro pocao da tela (false porque nao foi porque o tempo acabou)
		}
	}

	draw() {
		if (this._objPocao !== undefined)
			this._objPocao.draw();
	}
}


//quando personagem jah pegou
const xPrimeiraPocao = 26;
const xOutrasPocoesGuardadas = 5;
const qtdYPrimAcimaVidaPers = 10;
const heightPrimeiraPocao = 45;
const heightOutrasPocoes = 23;
const espacoEntrePocoesPers = 10;

const diametroSemiCirculoPocao = heightPrimeiraPocao * 1.6;
const qtdSubirComecouUsarPocao = diametroSemiCirculoPocao * 0.4;

const tempoNomePocaoApareceTela = 2500;

class ObjPocaoPers extends ObjetoTelaSimples {
	constructor(pocao) {
		super();

		//propriedades
		this._pocao = pocao;
		this._estahSendoUsado = false;

		//formaGeometrica no lugar certo e infoImgVivo
		//ehPrimeiraPocao: true (todo ObjPocaoPers criado vai pro comeco/mais embaixo)
		//formaGeometrica e infoImgVivo
		const formaGeomInfoImgVivo = this._pocao.getFormaGeomInfoImgVivo(true);
		//lugar certo
		const pontoInicial = { x: xPrimeiraPocao, y: height - (heightVidaUsuario + qtdYPrimAcimaVidaPers + formaGeomInfoImgVivo.formaGeometrica.height) };
		//contructor
		this._constructor(pontoInicial, formaGeomInfoImgVivo/*tem todos os atributos de InfoObjetoTelaSimples*/);
	}

	get pocao() { return this._pocao; }

	comecouAUsar() { this._estahSendoUsado = true; }
	get estahSendoUsado() { return this._estahSendoUsado; }

	set ehPrimeiraPocao(ehPrimeiraPocao) {
		const yFormaGeomAnterior = this._formaGeometrica.y;

		//mudarTamanho
		const novoWidth = this._pocao.getMedidasFormaGeometrica(ehPrimeiraPocao).width;
		this._formaGeometrica.mudarTamanho(novoWidth / this._formaGeometrica.width);

		//mudar (x,y)
		this._formaGeometrica.x = (ehPrimeiraPocao) ? xPrimeiraPocao : xOutrasPocoesGuardadas;
		this._formaGeometrica.y = yFormaGeomAnterior;
	}

	arrumarLugar(instrucao, pocaoRemovidaTinhaDesexecutar = false)
	//pocaoRemovidaTinhaDesexecutar: soh quando instrucao for Remover
	{
		if (instrucao !== InstrucaoArrumarLugar.comecouAUsar) //adicionou ou removeu
		{
			let qtdMudarY = (heightOutrasPocoes + espacoEntrePocoesPers) * (instrucao === InstrucaoArrumarLugar.adicionou ? -1 : 1);
			if (instrucao === InstrucaoArrumarLugar.removeu && pocaoRemovidaTinhaDesexecutar)
				//se instrucao=removeu e ela estava sendo executada (por um periodo de tempo, isto eh, tinha o semiCirculo em volta), eh porque a primeira pocao foi usada e acabou
				qtdMudarY += qtdSubirComecouUsarPocao;
			this._formaGeometrica.y += qtdMudarY;
		}
		else //comecou a usar
			this._formaGeometrica.y -= qtdSubirComecouUsarPocao / (this._estahSendoUsado ? 2 : 1);
		//ps: se estah sendo usado soh sobe metade (soh pela metade de baixo do circlo)
	}

	draw(opacidade) {
		//desenha semi-circulo antes (fica embaixo)
		if (this._estahSendoUsado)
			this._desenharSemiCirculo(opacidade);

		//desenha pocao em si
		this._formaGeometrica.draw(opacidade);
	}
	_desenharSemiCirculo(opacidade) {
		const opacidadeBaseCerta = (opacidade === undefined) ? undefined : opacidade * 255;

		//visual/tela
		fill(color(100, 100, 100, opacidadeBaseCerta));
		const x = this._formaGeometrica.centroMassa.x;
		const y = this._formaGeometrica.centroMassa.y;
		const cor = color(255, 0, 0, opacidadeBaseCerta);
		const tamStrokeGrosso = 6;
		const tamStrokeFino = 3;

		//proporcao
		const porcentagemDisponivel = this._pocao.tempoRestante / this._pocao.tempoTotal;

		noFill();
		if (porcentagemDisponivel === 1) {
			strokeWeight(tamStrokeGrosso);
			stroke(cor);
			ellipse(x, y, diametroSemiCirculoPocao);
		} else {
			strokeWeight(tamStrokeFino);
			stroke(color(30, 30, 30, opacidadeBaseCerta));
			ellipse(x, y, diametroSemiCirculoPocao);

			strokeWeight(tamStrokeGrosso);
			stroke(cor);
			strokeCap(SQUARE); //para ficar "quadradinho" e nao circular no final
			arc(x, y, diametroSemiCirculoPocao, diametroSemiCirculoPocao, -PI / 2, porcentagemDisponivel * 2 * PI - PI / 2);
			// (x, y, "diametro width", "diametro height", angulo em radiano onde comeca, angulo em radiano onde termina o circulo)
			// o circulo trigonometrico usado deve ser no sentido contrario (aumenta em sentido horario)
		}
		strokeWeight(tamStroke);

		noStroke();
		fill(color(255, 255, 255, opacidadeBaseCerta));
		textSize(17);
		// quanto tempo falta (tempoRestante estah em milisegundos)
		text((this._pocao.tempoRestante / 1000).toFixed(1) + "s", x + diametroSemiCirculoPocao / 2 - 1, y + diametroSemiCirculoPocao / 2 + 5); //quanto tempo falta
	}
}

//backend
const maxPocoesAcumulados = 4;
class ControladorPocoesPers {
	constructor() {
		this._pocoesPers = []; // 4 pocoes acumuladas (ativado nao instanteamente) + pegar pocao ativada instantaneamente
		//os que nao estao sendo usados e o que estah (se houver)

		// se vai escrever o nome da primeira pocao, que estah sendo usada
		this._funcEscreverNomePocao = new FuncEmCamadas();
		//futuro atributo: this._nomePocaoEscrever;
	}

	get codPocaoSendoUsado() {
		if (this._pocoesPers.length === 0 || !this._pocoesPers[0].estahSendoUsado)
			//se personagem nao tem nenhum pocao ou se a primeira pocao nao estah sendo usado
			return null;
		return this._pocoesPers[0].pocao.codPocao;
	}
	get estahUsandoPocao() { return this.codPocaoSendoUsado !== null; }

	adicionarPocaoUsando(pocao)
	//jah tem que ter verificado se nao tem um usando no momento
	//soh chama essa funcao se nao estah usando nenhuma pocao
	{
		this.adicionarPocao(pocao, false); //nao remove a pocao se jah tiver no maximo
		this.usarPocaoAtual();
	}
	adicionarPocao(pocao, removerSePrec = true) {
		if (removerSePrec && this._pocoesPers.length >= maxPocoesAcumulados + 1)
			//se tem mais pocoes do que pode (remove a ultima)
			this._pocoesPers.pop();

		//arrumar lugar das pocoes agora que adicionou um embaixo
		this._arrumarLugarPocoes(InstrucaoArrumarLugar.adicionou);

		//adiciona no comeco
		this._pocoesPers.unshift(new ObjPocaoPers(pocao, this._pocoesPers.length + 1));
	}

	usarPocaoAtual() {
		if (this._pocoesPers.length > 0 && !this._pocoesPers[0].estahSendoUsado)
		// se tem alguma pocao para usar && se nao tem nenhuma pocao sendo usado (soh pode usar uma pocao por vez)
		{
			this._pocoesPers[0].pocao.executarPocao(); //executar pocao

			this._programarParaEscreverNomePocao(); //vai mostrar o nome da pocao tendo ela um desexecutar ou nao
			if (this._pocoesPers[0].pocao.temDesexecutar) {
				this._pocoesPers[0].comecouAUsar(); //dizer que comecou a usar a pocao
				//arrumar lugar das pocoes agora que comecou a usar (circulo em volta)
				this._arrumarLugarPocoes(InstrucaoArrumarLugar.comecouAUsar);
			} else
				this.acabouUsarPocao(false);
		}
	}
	_programarParaEscreverNomePocao() {
		//escrever o nome da pocao na tela por um certo periodo de tempo
		this._funcEscreverNomePocao.subirCamada();
		this._nomePocaoEscrever = this._pocoesPers[0].pocao.nome;

		// programar para tirar nome da tela
		//ps: tem que ser no esquema de camadas pois se o personagem ativa uma pocao instantanea e logo depois outra, nao daria certo. Dessa maneira da
		new Timer(() => {
			if (this._funcEscreverNomePocao.descerCamada())
				delete this._nomePocaoEscrever;
		}, tempoNomePocaoApareceTela, false, false /*transcende o level*/);
	}

	acabouUsarPocao(pocaoRemovidaTinhaDesexecutar) {
		//remover pocao que acabou de se usado (comeco)
		this._pocoesPers.shift();
		//(agora a primeira pocao do personagem nao estah sendo usado mais)

		//arrumar lugar das pocoes agora que removeu o de baixo
		this._arrumarLugarPocoes(InstrucaoArrumarLugar.removeu, pocaoRemovidaTinhaDesexecutar);

		//personagem podia estar em cima da pocao mas nao poder pegar porque jah estava usando um, quando esse acaba verifica se pode pegar instantaneamente (sem esperar ele andar)
		ControladorJogo.controladorPocaoTela.verificarPersPegouPocao();
	}

	_arrumarLugarPocoes(instrucao, pocaoRemovidaTinhaDesexecutar)
	//instrucao: removeu, comecou a usar ou adicionou
	//pocaoRemovidaTinhaDesexecutar: soh para intrucao=removeu
	{
		if (this._pocoesPers.length > 0) {
			//mudar formaGeometrica das pocoes (a primeira pocao eh maior que as demais)
			if (instrucao === InstrucaoArrumarLugar.adicionou)
				//(ainda nao adicionou) se vai adicionar, tem setar ehPrimeiraPocao=false na atual primeira pocao
				this._pocoesPers[0].ehPrimeiraPocao = false;
			else
				if (instrucao === InstrucaoArrumarLugar.removeu)
					//(jah removeu) se jah removeu, tem setar ehPrimeiraPocao=true na primeira pocao
					this._pocoesPers[0].ehPrimeiraPocao = true;
		}

		// mudarY das pocoes
		this._pocoesPers.forEach(pocaoPers => pocaoPers.arrumarLugar(instrucao, pocaoRemovidaTinhaDesexecutar));
	}

	acabarUsarPocaoExecutando()
	//para quando trocar de aviao, nao continuar com uma pocao que mudaAviaoPersTemp=true sendo executada as pocoes
	{
		if (this.estahUsandoPocao && this._pocoesPers[0].pocao.mudaAviaoPersTemp)
		//se a primeira pocao estiver sendo usada e for desfazer alteracoes no novo aviao do personagem, remove-la
		{
			this._pocoesPers[0].pocao.pararTimerDesexecutar(); //parar timer de desexecutar
			this.acabouUsarPocao(true);
		}
	}

	//desenhar todos as pocoes
	draw() {
		//se tem algum objeto importante no espaco onde iria printar as pocoes do personagem
		let opacidade;
		if (this._pocoesPers.length > 0) {
			//primeira pocao
			if (ControladorJogo.algumObjetoImportanteNesseEspaco(this._pocoesPers[0].formaGeometrica))
				opacidade = opacidadePainelPersObjsEmBaixo;
			else
				//outras pocoes (se houver)
				if (this._pocoesPers.length > 1) {
					const formaUltimaPocao = this._pocoesPers[this._pocoesPers.length - 1].formaGeometrica;
					const retanguloEspaco = new Retangulo(formaUltimaPocao.x, formaUltimaPocao.y, formaUltimaPocao.width,
						this._pocoesPers[1].formaGeometrica.y + this._pocoesPers[1].formaGeometrica.height - formaUltimaPocao.y);
					if (ControladorJogo.algumObjetoImportanteNesseEspaco(retanguloEspaco))
						opacidade = opacidadePainelPersObjsEmBaixo;
				}
		}
		else { } //deixa undefined mesmo

		this._pocoesPers.forEach(pocaoPers => pocaoPers.draw(opacidade));
		/*ps: nao importa a ordem sempre vai colocar os mesmos nos lugares certos */

		if (this._nomePocaoEscrever !== undefined)
		//nao necessariamente a primeira pocao estara sendo usada (pois se ela fosse instantanea ou muito rapida, nao daria certo)
		{
			push();
			// TODO: design
			noStroke();
			textSize(30);
			textAlign(CENTER, CENTER);
			text(this._nomePocaoEscrever, width / 2, (height - heightVidaUsuario) / 2); //escrever nome da pocao
			pop();
		}
	}
}

const InstrucaoArrumarLugar = { "removeu": 0, "comecouAUsar": 1, "adicionou": 2 };
