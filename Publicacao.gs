/**
* @fileOverview
* Rotinas de publicação de novas versões.
*/

/**
* Extrai os dados da planilha.
*
* @public
* @return {Json} Retorna uma string Json com os dados. 
*/
function obterDadosDaPlanilha() {
  return Notificacao_.criar(Publicacao_.obterDadosDaPlanilha);
}

/**
* Move a planilha na pasta de distribuição para a pasta de backup.
*
* @public
* @return {Json} Retorna uma string Json com o nome da planilha. 
*/
function moverParaBackup() {
  return Notificacao_.criar(Publicacao_.moverParaBackup);
}

/**
* Atualiza os dados da versão na planilha ativa.
*
* @public
* @param {string} versao Texto com o número da versão nova.
* @param {string} textoExplicativo Texto que explica sucintamente as alterações promovidas. 
* @return {Json} Retorna uma string Json com o número da versão. 
*/
function atualizarVersao(versao, textoExplicativo) {
  return Notificacao_.criar(Publicacao_.atualizarVersao, versao, textoExplicativo);
}

/**
* Copia planilha ativa para a pasta de distribuição.
*
* @public
* @return {Json} Retorna uma string Json com o id da nova planilha. 
*/
function copiarParaDistribuicao() {
  return Notificacao_.criar(Publicacao_.copiarParaDistribuicao);
}

/**
* Apaga todos os dados nos intervalos com o prefixo determinado por Config_.PREFIXO.LIMPAR.
*
* @public
* @param {Spreadsheet=} planilha Planilha onde será efetuada a operação.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function limparDadosNaPlanilha(id) {
  return Notificacao_.criar(Publicacao_.apagarDados, id);
}

/**
* Apaga todas as notas da planilha.
*
* @public
* @param {string} id Id da planilha.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function limparNotasNaPlanilha(id) {
  return Notificacao_.criar(Publicacao_.apagarNotas, id);
}

/**
* Oculta todas as paginas relacionadas em Config_.listaPaginasParaOcultar().
*
* @public
* @param {string} id Id da planilha.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function ocultarPaginasNaPlanilha(id) {
  return Notificacao_.criar(Publicacao_.ocultarPaginas, id);
}

/**
* Exclui todas as paginas relacionadas em Config_.listaPaginasParaExcluir().
*
* @public
* @param {string} id Id da planilha.
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function excluirPaginasNaPlanilha(id) {
  return Notificacao_.criar(Publicacao_.excluirPaginas, id);
}

var Publicacao_ = (function(publicacao) {
  
  'use strict';

  publicacao.obterDadosDaPlanilha = function() {
    
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    
    try {
      var TIPO = SheetHelpers_.obterTipo(planilha);
      var VERSAO = SheetHelpers_.obterVersaoAtual(planilha);
    } catch (e) {
      throw new Utils.CustomError('Planilha irregular.')
    }
    
    return {
      nome: planilha.getName(),
      id: planilha.getId(),
      tipo: TIPO,
      versao: VERSAO,
      pastaDesenvolvimento: DriveHelpers_.naPasta(planilha.getId(), Registro_.obterIdPastaDesenvolvimento()),
    };
  };
  
  publicacao.moverParaBackup = function() {
    var nome = SheetHelpers_.obterNomePublicacao();
    var arquivo = DriveHelpers_.obterArquivoPorNome(nome, Registro_.obterIdPastaDistribuicao());
    if (arquivo !== null && arquivo !== undefined) {
      DriveHelpers_.moverParaBackup(arquivo, nome + '-backup');
      return nome;
    }
    throw new Utils.CustomError('Arquivo ' + nome + ' não localizado na pasta de desitribuição.');
  }

  publicacao.atualizarVersao = function(versao, textoExplicativo) {
    
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    
    var VERSAO = SheetHelpers_.obterVersaoAtual();
    var DATA = SheetHelpers_.obterDataVersaoAtual();
    var TEXTO = SheetHelpers_.obterTextoVersaoAtual();

    SheetHelpers_.inserirDadosNoHistorico(planilha, VERSAO, DATA, TEXTO);
    SheetHelpers_.inserirDadosNovaVersao(planilha, 'v. ' + versao, new Date(), textoExplicativo);
    SpreadsheetApp.flush();

    return versao;
  };
  
  publicacao.copiarParaDistribuicao = function() {
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var nome = SheetHelpers_.obterNomePublicacao(planilha);
    var arquivoId = planilha.getId();
    var publicado = DriveHelpers_.copiarParaDistribuicao(arquivoId, nome);
    return publicado.getId();
  };  
  
  publicacao.apagarDados = function(id) {
    var planilha = SheetHelpers_.obterPlanilhaPorId(id);
    return Limpeza_.apagarDados(planilha);
  };

  publicacao.apagarNotas = function(id) {
    var planilha = SheetHelpers_.obterPlanilhaPorId(id);
    return Limpeza_.apagarNotas(planilha);
  };

  publicacao.ocultarPaginas = function(id) {
    var planilha = SheetHelpers_.obterPlanilhaPorId(id);
    return Limpeza_.ocultarPaginas(planilha);
  };

  publicacao.excluirPaginas = function(id) {
    var planilha = SheetHelpers_.obterPlanilhaPorId(id);
    return Limpeza_.excluirPaginas(planilha);
  };
 
  return publicacao;
  
})(Publicacao_ || Object.create(null));