/**
* @fileOverview
* Rotinas para acesso e alteração dos dados gerais de desenvolvimento (ScriptProperties).
*/

'use strict';

/**
* Atualiza a chave de acesso pessoal do Github armazenada no registro do usuário.
*
* @public
* @param {string} valor O valor a ser armazenado.
* @return {Json} Json com os dados atualizados do registro.
*/
function atualizarChaveGithub(valor) {
  return Notificacao_.criar(Registro_.atualizarChaveGithub, valor);
}

/**
* Obtém os dados da chave de acesso pessoal do Github armazenada no registro do usuário.
*
* @public
* @return {Json} Json com as informações. 
*/
function obterDadosDaChaveGithub() {
  return Notificacao_.criar(Registro_.obterDadosDaChaveGithub);
}

/**
* Atualiza o registro especificado pela chave.
*
* @public
* @param {string} chave A chave a ser atualizada.
* @param {string} valor O valor a ser armazenado.
* @return {Json} Json com os dados atualizados do registro.
*/
function atualizarRegistro(chave, valor) {
  return Notificacao_.criar(Registro_.atualizar, chave, valor);
}

/**
* Obtém os dados de configuração armazenados no registro.
*
* @public
* @return {Json} Json com as informações. 
*/
function obterDadosDeConfiguracao() {
  return Notificacao_.criar(Registro_.obterDadosDeConfiguracao);
}

var Registro_ = (function(registro) {
  
  registro.atualizarChaveGithub = function(valor) {
    PropertiesService.getUserProperties().setProperty(Config_.STORAGE.GITHUB.KEY, valor);
    return registro.obterDadosDaChaveGithub();
  };
  
  registro.obterDadosDaChaveGithub = function() {
    return {
      usuario: Session.getEffectiveUser().getEmail(),
      valor: PropertiesService.getUserProperties().getProperty(Config_.STORAGE.GITHUB.KEY),
      novo: ''
    };
  };
  
  registro.atualizar = function(chave, valor) {
    PropertiesService.getScriptProperties().setProperty(chave, valor);
    return registro.obterDadosDeConfiguracao();
  };

  registro.obterIdPastaDesenvolvimento = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.ID.PASTA_DESENVOLVIMENTO);
  };
  
  registro.obterIdPastaDistribuicao = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.ID.PASTA_DISTRIBUICAO);
  };

  registro.obterIdPastaDocumentacao = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.ID.PASTA_DOCUMENTACAO);
  };

  registro.obterIdPastaBackup = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.ID.PASTA_BACKUP);
  };

  registro.obterIdTemplateDocumentacao = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.ID.TEMPLATE_DOCUMENTACAO);
  };
  
  registro.obterUrlTC = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.URL.TC);
  };

  registro.obterUrlRMI = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.URL.RMI);
  };

  registro.obterUrlAtrasados = function(props) {
    props = props || PropertiesService.getScriptProperties();
    return props.getProperty(Config_.STORAGE.URL.ATRASADOS);
  };

  registro.obterUrlPlanilha = function(tipoPlanilha) {
    return PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.URL[tipoPlanilha]);
  };
  
  registro.obterDadosDeConfiguracao = function() {
    
    var props = PropertiesService.getScriptProperties();
    
    return [
      {
        rotulo: 'Id Pasta Desenvolvimento',
        valor: registro.obterIdPastaDesenvolvimento(props),
        novo: '',
        chave: Config_.STORAGE.ID.PASTA_DESENVOLVIMENTO
      },
      {
        rotulo: 'Id Pasta Distribuição',
        valor: registro.obterIdPastaDistribuicao(props),
        novo: '',
        chave: Config_.STORAGE.ID.PASTA_DISTRIBUICAO
      },
      {
        rotulo: 'Id Pasta Documentacao',
        valor: registro.obterIdPastaDocumentacao(props),
        novo: '',
        chave: Config_.STORAGE.ID.PASTA_DOCUMENTACAO
      },
      {
        rotulo: 'Id Pasta Backup',
        valor: registro.obterIdPastaBackup(props),
        novo: '',
        chave: Config_.STORAGE.ID.PASTA_BACKUP
      },
      {
        rotulo: 'Id Template Documentação',
        valor: registro.obterIdTemplateDocumentacao(props),
        novo: '',
        chave: Config_.STORAGE.ID.TEMPLATE_DOCUMENTACAO
      },
      {
        rotulo: 'Url Planilha TC',
        valor: registro.obterUrlTC(props),
        novo: '',
        chave: Config_.STORAGE.URL.TC
      },
      {
        rotulo: 'Url Planilha RMI',
        valor: registro.obterUrlRMI(props),
        novo: '',
        chave: Config_.STORAGE.URL.RMI
      },
      {
        rotulo: 'Url Planilha Atrasados',
        valor: registro.obterUrlAtrasados(props),
        novo: '',
        chave: Config_.STORAGE.URL.ATRASADOS
      }
    ];
  };

  return registro;
  
})(Registro_ || Object.create(null));
