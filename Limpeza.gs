/**
* @fileOverview
* Utilidades para "limpeza" das planilhas.
*/

/**
* Apaga todos os dados nos intervalos com o prefixo determinado por Config_.PREFIXO.LIMPAR.
*
* @public
* @param {Spreadsheet=} planilha Planilha onde será efetuada a operação.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function apagarDados(planilha) {
  return Notificacao_.criar(Limpeza_.apagarDados);
}

/**
* Apaga todas as notas da planilha.
*
* @public
* @param {Spreadsheet=} planilha Planilha onde será efetuada a operação.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function apagarNotas(planilha) {
  return Notificacao_.criar(Limpeza_.apagarNotas);
}

/**
* Oculta todas as paginas relacionadas em Config_.listaPaginasParaOcultar().
*
* @public
* @param {Spreadsheet=} planilha Planilha onde será efetuada a operação.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function ocultarPaginas(planilha) {
  return Notificacao_.criar(Limpeza_.ocultarPaginas);
}

/**
* Exclui todas as paginas relacionadas em Config_.listaPaginasParaExcluir().
*
* @public
* @param {Spreadsheet=} planilha Planilha onde será efetuada a operação.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function excluirPaginas(planilha) {
  return Notificacao_.criar(Limpeza_.excluirPaginas);
}

var Limpeza_ = (function(limpeza) {
  
  'use strict';
  
  function removerColunasSalarios(planilha) {
    var intervalo = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.SALARIOS);
    if (intervalo !== null && intervalo !== undefined) {
      var colunaSalarios = intervalo.getColumn();
      var pagina = intervalo.getSheet();
      var totalColunas = pagina.getLastColumn();
      if (totalColunas > colunaSalarios) {
        pagina.deleteColumns(colunaSalarios + 1, totalColunas - colunaSalarios);
      }
    }
  }
  
  function refazerRotulosNB(planilha) {
    var intervalosNomeados = planilha.getNamedRanges();
    intervalosNomeados.forEach(function(intervaloNomeado) {
      Config_.PLANILHA.INTERVALO.ROTULOS_NB.forEach(function(intervaloNB, idx) {
        if (intervaloNomeado.getName() === intervaloNB) {
          intervaloNomeado.getRange().setValue('NB'+(idx+1));
        }
      });
    });
  }
  
  limpeza.apagarDados = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervalos = Planilhas.limparIntervalos(planilha, Config_.PREFIXO.LIMPAR);
    if (Array.isArray(intervalos) && intervalos.length > 0) {
      removerColunasSalarios(planilha);
      refazerRotulosNB(planilha);
      SpreadsheetApp.flush();
      return '<p>Dados apagados com sucesso</p>';
    } else {
      return '<p>Não foram encontrados dados a apagar</p>';
    }
  };
  
  limpeza.apagarNotas = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    Planilhas.limparNotas(planilha);
    SpreadsheetApp.flush();
    return '<p>Notas apagadas com sucesso</p>';
  };

  limpeza.ocultarPaginas = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var lista = Config_.listaPaginasParaOcultar();
    Planilhas.ocultarPaginas(planilha, lista)
    SpreadsheetApp.flush();
    return '<p>Páginas ocultadas com sucesso</p>';
  };

  limpeza.excluirPaginas = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var lista = Config_.listaPaginasParaExcluir();
    Planilhas.excluirPaginas(planilha, lista)
    SpreadsheetApp.flush();
    return '<p>Páginas excluídas com sucesso</p>';
  };
  
  return limpeza;
  
})(Limpeza_ || Object.create(null));