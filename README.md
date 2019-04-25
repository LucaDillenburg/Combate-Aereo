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
