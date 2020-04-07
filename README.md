# Combate Aéreo
Jogo 2D top-down de combate entre aviões com armas.

## Jogo

O jogo consiste em vários levels em que o usuário tem controlar seu avião de combate buscando destruir a tiros os aviões inimigos, enquanto busca desviar dos tiros dos mesmos. O level termina quando os aviões inimigos mais importantes são destruídos. Ao final de cada level há um local para conserto da aeronave no qual a mesma retoma vida enquanto permanece dentro da área indicada.

Com o passar dos levels, os mesmos terão mais desafios e o usuário terá mais recursos: surgirão obstáculos aéreos e suportes aéreos (objetos estáticos com armas); haverá tempos de tempestades onde pouco se enxergará devido a escuridão e raios; e os aviões inimigos e do usuário se tornarão mais rápidos e fortes e terão mais armas, algumas das quais serão giratórias ou lançadoras de mísseis, os quais seguirão seus respectivos oponentes e terão uma taxa máxima de curva. As armas giratórias do avião do usuário são controladas pelo mouse e já as dos inimigos automaticamente miram no mesmo.

Além disso, aparecerem poderes na tela. Ao passar por cima deles, o poder pode ser colocado em prática imediatamente ou guardado para ser acionado ao comando do usuário. Em levels mais difíceis, há poderes melhores e em mais quantidade.

<i>Outras bibliotecas</i>: tentei usar o mínimo possível de bibliotecas externas e a única que eu usei foi p5.

<br/>

## Engine
A Engine foi desenvolvido por mim sem base ou pesquisa sobre engines de jogos 2D.

### - Detecção de Colisão
O Sistema de Detecção de Colisão da minha Engine verifica se quaisquer N polígonos convexos formadas apenas por retas (sem linhas curvas) se colidirão após se deslocarem para qualquer direção. Não é feita nenhuma aproximação e o resultado é 100% preciso. O algoritmo feito tem complexidade linear - <i>O(n)</i> sendo <i>n</i> o total de triângulos não sobrepostos que podem ser formados em cada um das formas geometricas, isto é, a soma do número de lados de cada forma geométrica menos dois de cada forma.

O resultado é obtido através de um modelo matemático, usando simplesmente operações matemáticas. O algoritmo é baseado na afirmação de que, durante uma movimentação de um triângulo em qualquer intensidade e ângulo, o caminho percorrido tem a forma de um ou dois paralelogramos. Dessa forma, como todo poliedro sem linhas curvas pode ser transformado em triângulos, é possível verificar se os paralelogramos formados pelo caminho dos triângulos se colidem.

### - Objetos
* Objeto com armas: objeto com limitação de vida que tem um número indefinido de armas (fixas ou giratórias).
  * Automáticos: Tem seu movimento e frequência de atirar por cada arma definido.
  * Não-Automáticos: o movimento e tiro não tem um padrão e são chamados manualmente.
* Tiros: tem movimentação definida.
* Obstáculos: objetos com vida ou indestrutíveis que bloqueiam e tem movimentação definida.
* Suportes aéreos: objetos estáticos com armas.
<b>Partes de Objetos</b>: Hélices (define-se a velocidade do giro).
<b>Obs:</b> todos os objetos tem uma sequência de imagens (como sprite) e se adaptam automaticamente ao tamanho do objeto.

### - Tipos de Movimentação
* Seguir: segue um determinado objeto (tem um ângulo máximo de curva a cada movimentação, isto é, limitação de curva).
* Direção: sai na direção de algum objeto e então segue em linha reta.
* Básica: anda sempre na mesma velocidade (sem considerar a aceleração) e podem inverter a direção quando para não saírem de uma área escolhida.
<b>Aceleração</b> pode-se adicionar aceleração a qualquer tipo de movimento (o qual pode estar presente por um número de execuções ou até chegar a uma outra velocidade).

### - Outras features
* Poderes: deixar o tempo mais lento, alterar a velocidade de objetos, congelar objetos, alterar a vida de objetos, entre outros.
* Escuridão: momentos de escuridão e raios

### Outras distinções e implementações complexas
* Timer que só leva em consideração o tempo enquanto se está jogando (não pausado)
* Arma giratória
* Outras operações com formas geométricas: rotação de formas geométricas,...

# Instalação
- Para usar a Engine: apenas clone o repositorio e importe os arquivos necessários.
- Para jogar o jogo de exemplo: inicie um web-server e abra Jogo/index.html no browser.
