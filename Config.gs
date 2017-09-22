/**
* @fileOverview
* Módulo com os parâmetros de configuração.
*/

'use strict';

var Config_ = (function(config) {
  
  config.STATUS = {
    OK: 'ok',
    ERRO: {
      USUARIO: 'erro usuario',
      SISTEMA: 'erro sistema'
    }
  };

  config.listaPaginasParaOcultar = function() {
    
    var lista = Array.prototype.concat(
      config.ATUALIZACOES.CONSULTAS.INDICES.TC,
      config.ATUALIZACOES.CONSULTAS.INDICES.RMI,
      config.ATUALIZACOES.CONSULTAS.INDICES.ATRASADOS,
      config.ATUALIZACOES.CONSULTAS.TABELAS.TC,
      config.ATUALIZACOES.CONSULTAS.TABELAS.RMI,
      config.ATUALIZACOES.CONSULTAS.TABELAS.ATRASADOS,
      config.PLANILHA.TEMPLATE.LOG,
      config.PLANILHA.TEMPLATE.DADOS,
      config.PLANILHA.DOCUMENTACAO.PAGINA_VERSOES,
      config.PLANILHA.DOCUMENTACAO.PAGINA_FUNCOES,
      config.PLANILHA.PAGINAS_OCULTAS.TC,
      config.PLANILHA.PAGINAS_OCULTAS.RMI,
      config.PLANILHA.PAGINAS_OCULTAS.ATRASADOS);
    
    return lista.filter(function(v, i, a) {
      return a.indexOf(v) === i;
    });
  };

  config.listaPaginasParaExcluir = function() {
    return [
      'SISJEF', 
      'HISCRE', 
      'CNIS_COMPLETO', 
      'CNIS_VINCULOS', 
      'PLENUS', 
      'TEMPO_DE_CONTRIBUICAO', 
      new Date().getFullYear()+''
    ];
  };

  config.ATUALIZACOES = {
    TIPO: {
      INDICES: 'INDICES',
      TABELAS: 'TABELAS',
    },
    CONSULTAS: {
      INDICES: {
        TC: [],
        RMI: ['IndicesConsolidados'],
        ATRASADOS: ['IndicesConsolidados'],
      },
      TABELAS: {
        TC: ['ListaJuizos', 'ListaBeneficios', 'TabelaPontuacao', 'TabelaConversao', 'TabelaCarencia', 'ListaMotivos'],
        RMI: ['ListaJuizos', 'ListaBeneficios', 'OpcoesPC', 'OpcoesAtividadesConcomitantes', 'TabelaPontuacao', 'TabuasMortalidade'],
        ATRASADOS: ['ListaJuizos', 'ListaBeneficios', 'OpcoesAcao', 'OpcoesReajuste', 'OpcoesCorrecao', 'OpcoesJuros', 'OpcoesAlcada'],
      }
    }
  };
  
  config.PLANILHA = {
    NOME: {
      TC: 'CalculoTC',
      RMI: 'CalculoRMI',
      ATRASADOS: 'CalculoAtrasados'
    },
    TEMPLATE: {
      DADOS: 'DadosTemplate',
      LOG: 'LogTemplate',
    },
    PAGINAS_OCULTAS: {
      TC: ['Processamento', 'Parametros', 'Resultado', 'ParametrosDemonstrativos'],
      RMI: ['CalculoSalarios', 'ParametrosRMI', 'CalculoRMI', 'CalculosParalelos', 'ParametrosDemonstrativos'],
      ATRASADOS: ['ParametrosEvolucao', 'Evolucao', 'ParametrosDemonstrativos', 'ColunasDemonstrativos']
    },
    DOCUMENTACAO: {
      TC: {
        ENTRADA: ['Processo', 'ConfigurarContagem', 'TCDiscriminado', 'TCAdicionado', 'Modificadores'],
        DEMONSTRATIVOS: ['Demonstrativo'],
        PROCESSAMENTO: ['Processamento', 'Parametros', 'Resultado', 'ParametrosDemonstrativos']
      },
      RMI: {
        ENTRADA: ['Processo', 'Modificadores1', 'Modificadores2', 'Salarios'],
        DEMONSTRATIVOS: ['Demonstrativo'],
        PROCESSAMENTO: ['CalculoSalarios', 'ParametrosRMI', 'CalculoRMI', 'CalculosParalelos', 'ParametrosDemonstrativos']
      },
      ATRASADOS: {
        ENTRADA: ['Processo', 'Atualizacao', 'BeneficioDevido', 'BeneficioPago', 'Modificadores', 'Descontos'],
        DEMONSTRATIVOS: ['Demonstrativo', 'Alcada', 'Requisicoes'],
        PROCESSAMENTO: ['Evolucao', 'ParametrosEvolucao', 'ParametrosDemonstrativos', 'ColunasDemonstrativos']
      },
      PAGINA_VERSOES: 'Versoes',
      PAGINA_FUNCOES: 'Funcoes',
    },
    INTERVALO: {
      TIPO:'_v_Tipo',
      VERSAO_ATUAL: '_v_VersaoAtual',
      VERSAO_ATUAL_TEXTO: '_v_VersaoAtualTexto',
      VERSAO_DATA: '_v_Data',
      VERSOES_ANTERIORES: '_v_VersoesAnteriores',
      SALARIOS: 'SalariosContribuicao',
      PERIODOS: 'TCProcessado',
      ROTULOS_NB: ['DescontosNB1', 'DescontosNB2', 'DescontosNB3', 'DescontosNB4', 'DescontosNB5']
    }
  };
  
  config.STORAGE = {
    ID: {
      TC: 'TC_ID',
      RMI: 'RMI_ID',
      ATRASADOS: 'ATRASADOS_ID',
      INDICES: 'INDICES_ID',
      TABELAS: 'TABELAS_ID',
      ERROS: 'ERROS_ID',
      PASTA_DESENVOLVIMENTO: 'PASTA_DESENVOLVIMENTO_ID', 
      PASTA_DISTRIBUICAO: 'PASTA_DISTRIBUICAO_ID',
      PASTA_DOCUMENTACAO: 'PASTA_DOCUMENTACAO_ID',
      PASTA_BACKUP: 'PASTA_BACKUP_ID',
      TEMPLATE_DOCUMENTACAO: 'TEMPLATE_DOCUMENTACAO'
    },
    URL: {
      INDICES: 'INDICES_URL',
      TABELAS: 'TABELAS_URL',
      ERROS: 'ERROS_URL',
      TC: 'TC_URL',
      RMI: 'RMI_URL',
      ATRASADOS: 'ATRASADOS_URL'
    },
    GITHUB: {
      KEY: 'GITHUB_KEY',
    },
  };
  
  config.PREFIXO = {
    PADRAO: '_p_',
    PADRAO_FORMULA: '_p_f_',
    COMUM: '_c_',
    COMUM_FORMULA: '_c_f_',
    LIMPAR: '_limpar_'
  };
  
  return config;
  
})(Config_ || Object.create(null));