/**
* @fileOverview
* Helpers para acesso ao Google Drive.
*/

var SheetHelpers_ = (function(sheetHelpers) {
  
  'use strict';
  
  sheetHelpers.obterPlanilhaPorId = function(id) {
    if (Utils.isString(id)) {
      var planilha = SpreadsheetApp.openById(id);
      if (planilha === null || planilha === undefined) {
        throw new Error('Planilha não localizada.');
      }
      return planilha;
    }
    throw new Error('O id da planilha está irregular.');
  };
  
  sheetHelpers.obterNomePublicacao = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var TIPO = sheetHelpers.obterTipo(planilha);
    return Config_.PLANILHA.NOME[TIPO];
  }; 
  
  sheetHelpers.obterTipo = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloTipo = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.TIPO);
    if (intervaloTipo !== null && intervaloTipo) {
      return intervaloTipo.getValue().toUpperCase();
    } else {
      throw new Error('Planilha irrregular. Impossível identificar o tipo de planilha.');
    }
  };

  sheetHelpers.obterVersaoAtual = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloVersao = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_ATUAL);
    if (intervaloVersao !== null && intervaloVersao) {
      return intervaloVersao.getValue();
    } else {
      throw new Error('Planilha irregular. Impossível identificar o tipo de planilha.');
    }
  };

  sheetHelpers.obterDataVersaoAtual = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloData = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_DATA);
    if (intervaloData !== null && intervaloData) {
      var data = Utils.tentarConverterEmData(intervaloData.getValue());
      return Utils.isDate(data) ? Utilities.formatDate(data, 'UTC', 'dd/MM/yyyy') : '';
    } else {
      throw new Error('Planilha irregular. Impossível identificar a data de publicação da versão atual.');
    }
  };

  sheetHelpers.obterTextoVersaoAtual = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloTexto = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_ATUAL_TEXTO);
    if (intervaloTexto !== null && intervaloTexto) {
      return intervaloTexto.getValue();
    } else {
      throw new Error('Planilha irregular. Impossível identificar o texto explicativo da versão atual.');
    }
  };

  sheetHelpers.obterHistoricoVersoesAnteriores = function(planilha) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloVersoesAnteriores = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSOES_ANTERIORES);
    if (intervaloVersoesAnteriores !== null && intervaloVersoesAnteriores) {
      var posicao = intervaloVersoesAnteriores.getRowIndex();
      var pagina = intervaloVersoesAnteriores.getSheet();
      var ultimaLinha = pagina.getLastRow();
      return intervaloVersoesAnteriores.offset(1, 0, ultimaLinha - posicao).getValues().map(function(linha) {
        var texto = linha[0];
        var numero = /^(v\.\s\d{1,4}\.\d{1,4}\.\d{1,4})/.exec(texto);
        var data = /^v\.\s\d{1,4}\.\d{1,4}\.\d{1,4}\s\((\d{1,2}\/\d{1,2}\/\d{2,4})\)/.exec(texto);
        var descricao = /^v\.\s\d{1,4}\.\d{1,4}\.\d{1,4}\s\(\d{1,2}\/\d{1,2}\/\d{2,4}\)\s\-\s([\w\W]*)/.exec(texto);
        return {
          numero: (Array.isArray(numero) ? numero[1] : ''),
          data: (Array.isArray(data) ? data[1] : ''),
          descricao: (Array.isArray(descricao) ? descricao[1] : '')
        };
      });      
    } else {
      throw new Error('Planilha irregular. Impossível identificar o histórico de versões anteriores.');
    }
  };  
  
  sheetHelpers.obterHistoricoDeVersoes = function(planilha) {

    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    
    var VERSAO = sheetHelpers.obterVersaoAtual(planilha);
    var DATA = sheetHelpers.obterDataVersaoAtual(planilha);
    var TEXTO = sheetHelpers.obterTextoVersaoAtual(planilha);
    var HISTORICO = sheetHelpers.obterHistoricoVersoesAnteriores(planilha);
    
    HISTORICO.unshift({
      numero: VERSAO,
      data: DATA,
      descricao: TEXTO
    });
    
    return HISTORICO;
  };
  
  sheetHelpers.inserirDadosNoHistorico = function (planilha, versao, data, textoExplicativo) {
    
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloVersoesAnteriores = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSOES_ANTERIORES);
    
    var posicao = intervaloVersoesAnteriores.getRowIndex();
    var pagina = intervaloVersoesAnteriores.getSheet();
    pagina.insertRowAfter(posicao);
    
    intervaloVersoesAnteriores.offset(1, 0).setValue(versao + data + ' - ' + textoExplicativo);
  };

  sheetHelpers.inserirDadosNovaVersao = function(planilha, versao, data, textoExplicativo) {
    planilha = planilha || SpreadsheetApp.getActiveSpreadsheet();
    var intervaloVersao = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_ATUAL);
    var intervaloData = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_DATA);
    var intervaloTexto = planilha.getRangeByName(Config_.PLANILHA.INTERVALO.VERSAO_ATUAL_TEXTO);
    intervaloVersao.setValue(versao);
    intervaloData.setValue(data);
    intervaloTexto.setValue(textoExplicativo);
  };
  
  return sheetHelpers;
  
})(SheetHelpers_ || Object.create(null));