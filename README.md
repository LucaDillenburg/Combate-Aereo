# Combate Aéreo
Jogo canvas 2D de aviões de guerra.

## Objetivo
Fazer um jogo com colisões de objetos de várias formas geométricas diferentes e usando o mínimo de bibliotecas externas.

## Diferencial: Sistema de Colisão (autoria própria)
Breve explicação: O sistema verifica se durante a movimentação de formas geométricas quaisquer formadas apenas por retas (sem linhas curvas) haverá colisão, e, se houver colisão, ele também é calculado quanto a forma geométrica que andar primeiro poderá andar.
OBS: O resultado é obtido através de um modelo matemático, usando simplesmente operações matemáticas. Nenhum loop é usado (exceto para percorrer cada forma geométrica de uma forma geométrica composta por várias formas).

#### Outras features
 - Poderes (como: deixar o tempo mais lento,...)
 - Aviões inimigos (tem tiros), obstáculos e suportes aéreos (tem tiros), avião do usuário (tem tiros)
 - Momentos de escuridão e raios

#### Outras distinções e implementações complexas
 - Objetos seguindo outros (com as devidas rotacioções e com limitações de curva)
 - Armas giratorias (atiraram tiros corretamente rotacionados)
 - Criação de um Timer que só leva em consideração o tempo enquanto se está jogando (não pausado)
 - Outras operações com formas geométricas: rotação de formas geométricas,...
 - Classes muito bem pensadas e divididas

#### Autor
Luca Assumpção Dillenburg







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
