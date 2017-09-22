/**
* @fileOverview
* Módulo da interface do usuário.
*/

/**
* Abre a interface principal das ferramentas.
*
* @public
* @return {void} 
*/
function abrirSidebar() {
  var grupoAdmin = GroupsApp.getGroupByEmail('contadoria-admin@googlegroups.com').getUsers().map(function(user){
    return user.getEmail();
  });
  var user = Session.getEffectiveUser().getEmail();
  var ui = SpreadsheetApp.getUi();
  if (grupoAdmin.indexOf(user) >= 0) {
    var html = HtmlService.createTemplateFromFile('_index')
    .evaluate()
    .setTitle('Ferramentas de Desenvolvimento');
    ui.showSidebar(html);
  } else {
    ui.alert('Acesso negado', 'Para usar este complemento você deve credenciar-se como desenvolvedor.', ui.ButtonSet.OK);
  }
}

/**
* Rotina para incluir conteúdo de arquivos no template html.
*
* @public
* @param {String} nomeArquivo Nome do arquivo cujo conteúdo deva ser inserido no template.
* @return {string} Retorna uma string html com o conteúdo a ser inserido. 
*/
function incluir(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

/**
* Rotina para envio dos dados iniciais ao cliente.
*
* @public
* @return {Json} Retorna Json string com os dados. 
*/
function obterDados() {
  
  return Notificacao_.criar(function() {
    return {
      planilha: Publicacao_.obterDadosDaPlanilha(),
      chaveGithub: Registro_.obterDadosDaChaveGithub(),
      registro: Registro_.obterDadosDeConfiguracao()
    };
  });
}

/**
* Rotina para envio dos dados iniciais ao cliente.
*
* @public
* @param {string} errString String com os dados do erro. 
* @return {void} 
*/
function registrarErro(errString) {
  try {
    Erros_.informar(errString).logCentral().logLocal();
  } catch (e) {
  }
}