//OBJETOS
function minDirecao(valorDir1, valorDir2)
{
  if (valorDir1.valor <= valorDir2.valor)
    return valorDir1;
  else
    return valorDir2;
}

class AuxInfo
{
  static cloneImgCor(imgCor)
  {
    if (imgCor.stroke === undefined)
      return imgCor; //nao precisa de clone
    else
      return {stroke: imgCor.stroke, fill: imgCor.fill}; //clone
  }

  static cloneConfiguracoesAtirar(configuracoesAtirar)
  {
    let cloneConfigs = new Array(configuracoesAtirar.length);
    for (let i = 0; i<cloneConfigs.length; i++)
      cloneConfigs[i] = configuracoesAtirar[i].clone();
    return cloneConfigs;
  }

  static cloneQtdsRotateDifHelice(qtdsRotateDifHelice)
  {
    if (qtdsRotateDifHelice === undefined) return undefined;

    let ret = [];
    qtdsRotateDifHelice.forEach(function(valor, index) { ret[index] = valor; }); //copiar
    return ret;
  }
}

//CONTROLADORES OBJETOS
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
