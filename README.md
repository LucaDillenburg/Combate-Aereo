# Combate Aéreo
Jogo 2D top-down de combate entre aviões com armas.

## Jogo

O jogo consiste em vários levels em que o usuário tem controlar seu avião de combate buscando destruir a tiros os aviões inimigos. Esses aviões também atiram no usuário, que tem que desviar dos mesmos para não sofrer dano. O level termina quando os aviões inimigos mais importantes são destruídos. Ao final de cada level há um local para conserto da aeronave no qual a mesma retoma vida enquanto permanece dentro da área indicada.

Com o passar dos levels, os mesmos terão mais desafios e o usuário terá mais recursos: surgirão obstáculos aéreos e suportes aéreos (objetos estáticos com armas); haverá tempos de tempestades onde pouco se enxergará devido a escuridão e raios; e os aviões inimigos e do usuário se tornarão mais rápidos e fortes e terão mais armas, algumas das quais serão giratórias ou lançadoras de mísseis, os quais seguirão seus respectivos oponentes e terão uma taxa máxima de curva. As armas giratórias do avião do usuário são controladas pelo mouse e já as dos inimigos automaticamente miram no mesmo.

Além disso, aparecerem poderes na tela. Ao passar por cima deles, o poder pode ser colocado em prática imediatamente ou guardado para ser acionado ao comando do usuário. Em levels mais difíceis, há poderes melhores e em mais quantidade.
<br/>

## Engine
A Engine foi desenvolvido por mim sem base ou pesquisa sobre engines de jogos 2D.

### - Detecção de Colisão
O Sistema de Detecção de Colisão da minha Engine verifica se quaisquer N formas geométricas poliédricas formadas apenas por retas (sem linhas curvas) se colidirão após se deslocarem para qualquer direção. O algoritmo feito tem complexidade linear - <i>O(n)<\i> sendo <i>n</i> a soma do número lados de cada forma geométrica menos dois.

O resultado é obtido através de um modelo matemático, usando simplesmente operações matemáticas. O algoritmo é baseado na afirmação de que o caminho percorrido (até a nova posição) por qualquer movimento de um triângulo forma 1 ou 2 paralelogramos. Dessa forma, como todo poliedro sem linhas curvas pode ser transformado em triângulos, é possível verificar se os paralelogramos formados pelo caminho dos triângulos se colidem.

<b>IMAGEM PARALELOGRAMOS FROM MOVIMENTO TRIÂNGULO</b>

### - Objetos
* Objeto comandado:
* Objeto automático:
* Tiros:
* Obstáculos:
* Suportes aéreos:
##### Partes de Objetos:
* Hélices

### - Movimentação
TODO

### - Outras features
 - Poderes (como: deixar o tempo mais lento,...)
 - Aviões inimigos (tem tiros), obstáculos e suportes aéreos (tem tiros), avião do usuário (tem tiros)
 - Momentos de escuridão e raios

#### Outras distinções e implementações complexas
 - Objetos seguindo outros (com as devidas rotacioções e com limitações de curva)
 - Armas giratorias (atiraram tiros corretamente rotacionados)
 - Criação de um Timer que só leva em consideração o tempo enquanto se está jogando (não pausado)
 - Outras operações com formas geométricas: rotação de formas geométricas,...
 - Classes muito bem pensadas e divididas



TODO


FEATURES DIFERENCIAIS:
 - Tipos de andar: ANDAR_NORMAL, SEGUIR_PERS, SEGUIR_INIM_MAIS_PROX, DIRECAO_PERS, DIRECAO_INIM_MAIS_PROX, NAO_SAIR_DA_TELA e ATEH_XY_ESPECIFICADO (mudando as duas ou soh uma direcao)
    -> haverao tiros de todos esses tipos tanto para os inimigos dependendo do nivel, quanto para o personagem principal se ele pegar pocoes
    -> obstaculos e inimigos (preferencialmente menores) podem andar em direcao/seguir o personagem
 - pode-se criar um obstaculo ou inimigo ou tiro indo para outra direcao muito facilmente (parametros em adicionarObstaculo)
 - pode-se criar um objetoTela no meio, encostado na parede esquerda, direita, na de baixo ou de cima muito facilmente (soh colocar Posicao... em pontoInicial no new desse obj)
 - ha um Timer que soh conta quando estah em EstadoJogando.Jogando (nao pausado, nem nada mais) e um Objeto que faz uma funcao quando contar X de tempo
 - obstaculos empurram os personagens e quando nao conseguem empurrar explodem dando certo dano ao personagem
 - obstaculos com vida (barreiras que tambem sofrem dano)
 - tiros da tela
 - POCOES: que se guardam e que usam na hora
 - Ao inves de cor, os objetos podem ser imagens (quando um objeto da tela morre/explode/... antes de sair da tela ele eh mostrado mais uma vez com a cor/imagem de morto)

 - pode atirar pra qualquer lado, da onde quiser, cada ObjComTiro pode ter mais de um tiro de tipos, frequencias,... diferenciados
 - arma giratoria
 - helices

eu tentei usar o menos possivel de coisas prontas: soh usei p5
