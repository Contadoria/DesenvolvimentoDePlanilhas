/**
* @fileOverview
* Rotinas para gerar documentação da planilha, em formato Google Docs ou Markdown.
*/

/**
* Gera documentação para a planilha ativa em Google Docs.
*
* @public
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function gerarDocumentacaoGoogleDocs() {
  return Notificacao_.criar(Documentacao_.gerar, false);
}

/**
* Gera documentação para a planilha ativa em Markdown.
*
* @public
* @return {Json} Retorna um objeto serializado com informações sobre o resultado da rotina.
*/
function gerarDocumentacaoMarkdown() {
  return Notificacao_.criar(Documentacao_.gerar, true);
}

var Documentacao_ = (function(documentacao) {
  
  'use strict';
  
  function obterListaFuncoes(tipoPlanilha) {
    return Http_.consultarServicoInterno(Registro_.obterUrlPlanilha(tipoPlanilha) + '?udfs=true');
  }
  
  function converterTabelaEmTexto(tabela, bullet) {
    bullet = bullet || '';
    return tabela.reduce(function(lista, linha, idx, arr) {
      linha.forEach(function(cel) {
        if (cel.length > 0) {
          lista.push(bullet + cel);
        }
      });
      return lista;
    }, []).filter(function(v, i, a) {
      return a.indexOf(v) === i; // somente valores não repetidos
    }).join('\n');
  }
  
  function criarListaDeDados(paginas, listaPaginas) {
    return paginas.reduce(function(lista, pagina) {
      if (listaPaginas.indexOf(pagina.getName()) >= 0) {
        var obj = Object.create(null);
        obj.nome = pagina.getName();
        obj.intervalos = pagina.getNamedRanges().reduce(function(listaIntervalos, intervaloNomeado) {
          var nome = intervaloNomeado.getName();
          var prefixoPadrao = Config_.PREFIXO.PADRAO;
          var prefixoComum = Config_.PREFIXO.COMUM;
          var prefixoLimpar = Config_.PREFIXO.LIMPAR;
          if (nome.indexOf(prefixoPadrao) !== 0 && nome.indexOf(prefixoComum) !== 0 && nome.indexOf(prefixoLimpar) !== 0) {
            
            var intervalo = intervaloNomeado.getRange();
            
            var dataValidations = intervalo.getDataValidations().map(function(linha) {
              return linha.map(function(regra) {
                if (regra !== null && regra !== undefined) {
                  var criterios = regra.getCriteriaValues().map(function(item) {
                    if (item && item.getA1Notation && item.getSheet) {
                      return item.getSheet().getName() + '!' + item.getA1Notation();
                    }
                    if (item === true || item === false) {
                      return null;
                    }
                    return item;
                  }).filter(function(item) {
                    return item !== null && item !== undefined;
                  }).join(',');
                  return regra.getCriteriaType() + ' ' + criterios;
                } else {
                  return '';
                }
              })
            });

            listaIntervalos.push({
              nome: intervaloNomeado.getName(),
              endereco: intervalo.getA1Notation(),
              formulas: converterTabelaEmTexto(intervalo.getFormulas()),
              notas: converterTabelaEmTexto(intervalo.getNotes(), '- '),
              formatos: converterTabelaEmTexto(intervalo.getNumberFormats()),
              regras: converterTabelaEmTexto(dataValidations)
            });
          }
          
          return listaIntervalos;
          
        }, []).sort(function(a, b) {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }
          return 0;
        });
        lista.push(obj)
      }
      return lista;
    }, []);
  }
  
  function obterEstilos() {
    
    var estilos = Object.create(null);
    
    estilos.corpo = Object.create(null);
    estilos.corpo[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.corpo[DocumentApp.Attribute.FONT_SIZE] = 10;
    
    estilos.tituloPrincipal = Object.create(null);
    estilos.tituloPrincipal[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.tituloPrincipal[DocumentApp.Attribute.FONT_SIZE] = 14;
    estilos.tituloPrincipal[DocumentApp.Attribute.UNDERLINE] = true;
    estilos.tituloPrincipal[DocumentApp.Attribute.BOLD] = true;
    estilos.tituloPrincipal[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
    
    estilos.subtitulo = Object.create(null);
    estilos.subtitulo[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.subtitulo[DocumentApp.Attribute.FONT_SIZE] = 12;
    estilos.subtitulo[DocumentApp.Attribute.UNDERLINE] = true;
    estilos.subtitulo[DocumentApp.Attribute.BOLD] = true;
    estilos.subtitulo[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
    
    estilos.tituloSecao = Object.create(null);
    estilos.tituloSecao[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.tituloSecao[DocumentApp.Attribute.FONT_SIZE] = 14;
    estilos.tituloSecao[DocumentApp.Attribute.BOLD] = true;
    estilos.tituloSecao[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.tituloSecao[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
    
    estilos.tituloPagina = Object.create(null);
    estilos.tituloPagina[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.tituloPagina[DocumentApp.Attribute.FONT_SIZE] = 13;
    estilos.tituloPagina[DocumentApp.Attribute.BOLD] = true;
    estilos.tituloPagina[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.tituloPagina[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;

    estilos.textoVersao = Object.create(null);
    estilos.textoVersao[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.textoVersao[DocumentApp.Attribute.FONT_SIZE] = 10;
    estilos.textoVersao[DocumentApp.Attribute.BOLD] = true;
    estilos.textoVersao[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.textoVersao[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
    estilos.textoVersao[DocumentApp.Attribute.SPACING_AFTER] = 2;
    
    estilos.textoDescricao = Object.create(null);
    estilos.textoDescricao[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.textoDescricao[DocumentApp.Attribute.FONT_SIZE] = 10;
    estilos.textoDescricao[DocumentApp.Attribute.BOLD] = false;
    estilos.textoDescricao[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.textoDescricao[DocumentApp.Attribute.ITALIC] = false;
    estilos.textoDescricao[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.JUSTIFY;
    estilos.textoDescricao[DocumentApp.Attribute.LINE_SPACING] = 1;
    estilos.textoDescricao[DocumentApp.Attribute.INDENT_START] = 25;
    estilos.textoDescricao[DocumentApp.Attribute.INDENT_FIRST_LINE] = 25;
    estilos.textoDescricao[DocumentApp.Attribute.INDENT_END] = 0;
    estilos.textoDescricao[DocumentApp.Attribute.SPACING_BEFORE] = 0;
    estilos.textoDescricao[DocumentApp.Attribute.SPACING_AFTER] = 5;

    estilos.textoDestacado = Object.create(null);
    estilos.textoDestacado[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.textoDestacado[DocumentApp.Attribute.FONT_SIZE] = 11;
    estilos.textoDestacado[DocumentApp.Attribute.BOLD] = true;
    estilos.textoDestacado[DocumentApp.Attribute.UNDERLINE] = true;
    estilos.textoDestacado[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
    estilos.textoDestacado[DocumentApp.Attribute.SPACING_AFTER] = 5;
    
    estilos.textoComum = Object.create(null);
    estilos.textoComum[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    estilos.textoComum[DocumentApp.Attribute.FONT_SIZE] = 10;
    estilos.textoComum[DocumentApp.Attribute.BOLD] = false;
    estilos.textoComum[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.textoComum[DocumentApp.Attribute.ITALIC] = false;
    estilos.textoComum[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.JUSTIFY;
    estilos.textoComum[DocumentApp.Attribute.LINE_SPACING] = 1;
    estilos.textoComum[DocumentApp.Attribute.INDENT_START] = 0;
    estilos.textoComum[DocumentApp.Attribute.INDENT_END] = 0;
    estilos.textoComum[DocumentApp.Attribute.SPACING_BEFORE] = 2;
    estilos.textoComum[DocumentApp.Attribute.SPACING_AFTER] = 2;
    
    estilos.textoFormulas = Object.create(null);
    estilos.textoFormulas[DocumentApp.Attribute.FONT_FAMILY] = 'Courier New';
    estilos.textoFormulas[DocumentApp.Attribute.FONT_SIZE] = 12;
    estilos.textoFormulas[DocumentApp.Attribute.BOLD] = false;
    estilos.textoFormulas[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.textoFormulas[DocumentApp.Attribute.ITALIC] = false;
    estilos.textoFormulas[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
    estilos.textoFormulas[DocumentApp.Attribute.LINE_SPACING] = 1;
    estilos.textoFormulas[DocumentApp.Attribute.INDENT_START] = 25;
    estilos.textoFormulas[DocumentApp.Attribute.INDENT_FIRST_LINE] = 25;
    estilos.textoFormulas[DocumentApp.Attribute.INDENT_END] = 25;
    estilos.textoFormulas[DocumentApp.Attribute.SPACING_BEFORE] = 10;
    estilos.textoFormulas[DocumentApp.Attribute.SPACING_AFTER] = 10;

    estilos.textoFuncoes = Object.create(null);
    estilos.textoFuncoes[DocumentApp.Attribute.FONT_FAMILY] = 'Courier New';
    estilos.textoFuncoes[DocumentApp.Attribute.FONT_SIZE] = 10;
    estilos.textoFuncoes[DocumentApp.Attribute.BOLD] = false;
    estilos.textoFuncoes[DocumentApp.Attribute.UNDERLINE] = false;
    estilos.textoFuncoes[DocumentApp.Attribute.ITALIC] = false;
    estilos.textoFuncoes[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
    estilos.textoFuncoes[DocumentApp.Attribute.LINE_SPACING] = 1;
    estilos.textoFuncoes[DocumentApp.Attribute.INDENT_START] = 0;
    estilos.textoFuncoes[DocumentApp.Attribute.INDENT_FIRST_LINE] = 0;
    estilos.textoFuncoes[DocumentApp.Attribute.INDENT_END] = 0;
    estilos.textoFuncoes[DocumentApp.Attribute.SPACING_BEFORE] = 10;
    estilos.textoFuncoes[DocumentApp.Attribute.SPACING_AFTER] = 10;
    
    return estilos;
  }
  
  function criarSecaoHistorico(body, listaVersoes, tituloSecao, estilos) {
    
    var tituloSecao = body.appendParagraph(tituloSecao);
    tituloSecao.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    tituloSecao.setAttributes(estilos.tituloSecao);
    
    listaVersoes.forEach(function(versao) {
      
      body.appendParagraph('');
      var numero = body.appendParagraph(versao.numero + ' (' + versao.data + ')');
      numero.setHeading(DocumentApp.ParagraphHeading.NORMAL);
      numero.setAttributes(estilos.textoVersao);
      
      var descricao = body.appendParagraph(versao.descricao);
      descricao.setHeading(DocumentApp.ParagraphHeading.NORMAL);
      descricao.setAttributes(estilos.textoDescricao);
    });
  }

  function criarSecao(body, listaPaginas, tituloSecao, estilos) {

    var tituloSecao = body.appendParagraph(tituloSecao);
    tituloSecao.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    tituloSecao.setAttributes(estilos.tituloSecao);
    
    listaPaginas.forEach(function(pagina, idx) {
      
      var nr = idx + 1;
      body.appendParagraph('');
      var tituloPagina = body.appendParagraph(nr + '. Página "' + pagina.nome + '"');
      tituloPagina.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      tituloPagina.setAttributes(estilos.tituloPagina);
      
      pagina.intervalos.forEach(function(intervalo) {
        
        var textoDestacado = body.appendParagraph(intervalo.nome + ' (' + intervalo.endereco + ')');
        textoDestacado.setHeading(DocumentApp.ParagraphHeading.HEADING3);
        textoDestacado.setAttributes(estilos.textoDestacado);
        
        if (intervalo.formulas.length > 0) {
          var item1 = body.appendParagraph('a) Fórmulas:');
          item1.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item1.setAttributes(estilos.textoComum);
          var textoFormulas = body.appendParagraph(intervalo.formulas);
          textoFormulas.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          textoFormulas.setAttributes(estilos.textoFormulas);
        } else {
          var item1 = body.appendParagraph('a) Fórmulas: não há');
          item1.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item1.setAttributes(estilos.textoComum);
        }

        if (intervalo.formatos.length > 0) {
          var item2 = body.appendParagraph('b) Formato:');
          item2.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item2.setAttributes(estilos.textoComum);
          var textoFormatos = body.appendParagraph(intervalo.formatos);
          textoFormatos.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          textoFormatos.setAttributes(estilos.textoFormulas);
        } else {
          var item2 = body.appendParagraph('b) Formato: padrão');
          item2.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item2.setAttributes(estilos.textoComum);
        }

        if (intervalo.regras.length > 0) {
          var item3 = body.appendParagraph('c) Regras de validação:');
          item3.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item3.setAttributes(estilos.textoComum);
          var textoRegras = body.appendParagraph(intervalo.regras);
          textoRegras.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          textoRegras.setAttributes(estilos.textoFormulas);
        } else {
          var item3 = body.appendParagraph('c) Regras de validação: não há');
          item3.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item3.setAttributes(estilos.textoComum);
        }
        
        if (intervalo.notas.length > 0) {
          var item4 = body.appendParagraph('d) Notas:');
          item4.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item4.setAttributes(estilos.textoComum);
          var textoNotas = body.appendParagraph(intervalo.notas);
          textoNotas.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          textoNotas.setAttributes(estilos.textoComum);
        } else {
          var item4 = body.appendParagraph('d) Notas: não há');
          item4.setHeading(DocumentApp.ParagraphHeading.NORMAL);
          item4.setAttributes(estilos.textoComum);
        }
      });
    });
  }

  function criarSecaoFuncoes(body, listaArquivos, tituloSecao, estilos) {

    var tituloSecao = body.appendParagraph(tituloSecao);
    tituloSecao.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    tituloSecao.setAttributes(estilos.tituloSecao);
    
    listaArquivos.forEach(function(arquivo, idx) {
      
      var nr = idx + 1;
      body.appendParagraph('');
      var nomeArquivo = body.appendParagraph(nr + '. Arquivo "' + arquivo.name + '"');
      nomeArquivo.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      nomeArquivo.setAttributes(estilos.tituloPagina);
      
      var texto = body.appendParagraph(arquivo.content);
      texto.setHeading(DocumentApp.ParagraphHeading.NORMAL);
      texto.setAttributes(estilos.textoFuncoes);
      
    });
  }
  
  function criarChangelogMD(listaVersoes, tituloSecao) {
    return '# ' + tituloSecao + '\n\n' + listaVersoes.map(function(versao) {
      return '**' + versao.numero + '** (' + versao.data + ')\n' + versao.descricao;
    }).join('\n\n');
  }

  function criarArquivoMD(listaPaginas, tituloSecao) {
    return '# ' + tituloSecao + '\n\n' + listaPaginas.map(function(pagina, idx) {
      return '## ' + (idx + 1) + '. Página "' + pagina.nome + '"\n\n' + 
        pagina.intervalos.map(function(intervalo, subidx) {
          return '### ' + (idx + 1) + '.' + (subidx + 1) + '. **' + intervalo.nome + '** (' + intervalo.endereco + ')\n'
          + (intervalo.formulas.length > 0
             ? '\na) Fórmulas:\n```\n' + intervalo.formulas + '\n```\n'
             : '\na) Fórmulas: não há  ')
          + (intervalo.formatos.length > 0
             ? '\nb) Formato:\n```\n' + intervalo.formatos + '\n```\n'
             : '\nb) Formato: padrão  ')
          + (intervalo.regras.length > 0
             ? '\nc) Regras de validação:\n```' + intervalo.regras + '\n```\n'
             : '\nc) Regras de validação: não há  ')
          + (intervalo.notas.length > 0
             ? '\nd) Notas:\n' + intervalo.notas + '\n'
             : '\nd) Notas: não há  ');
        }).join('\n\n');
    }).join('\n\n');
  }

  function criarArquivoMDFuncoes(listaArquivos, tituloSecao) {
    return '# ' + tituloSecao + '\n\n' + listaArquivos.map(function(arquivo, idx) {
      return '## ' + (idx + 1) + '. Arquivo "' + arquivo.name + '"\n\n```\n' + arquivo.content + '\n```'
    }).join('\n\n');
  }

  documentacao.gerar = function(markdown) {
    
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var paginas = planilha.getSheets();
    
    var TIPO_PLANILHA = SheetHelpers_.obterTipo(planilha);
    var VERSAO = SheetHelpers_.obterVersaoAtual(planilha);
    var HISTORICO = SheetHelpers_.obterHistoricoDeVersoes(planilha);
    
    if (!(TIPO_PLANILHA in Config_.PLANILHA.DOCUMENTACAO) || !(TIPO_PLANILHA in Config_.PLANILHA.NOME)) {
      throw new Error('Planilha irregular. Impossível identificar o tipo de planilha.');
    }

    var LISTA_FUNCOES = obterListaFuncoes(TIPO_PLANILHA);
    
    var idPastaDocumentacao = Registro_.obterIdPastaDocumentacao();
    if (!idPastaDocumentacao) {
      throw new Error('Pasta de documentação não registrada.');
    }
    
    var params = Config_.PLANILHA.DOCUMENTACAO[TIPO_PLANILHA];
    
    var dados = {
      entrada: criarListaDeDados(paginas, params.ENTRADA),
      processamento: criarListaDeDados(paginas, params.PROCESSAMENTO),
      demonstrativos: criarListaDeDados(paginas, params.DEMONSTRATIVOS)
    }

    var nome = 'Documentação ' + Config_.PLANILHA.NOME[TIPO_PLANILHA];
      
    var pasta = DriveApp.getFolderById(idPastaDocumentacao);
    
    if (markdown === true) {
      
      var toc = '# **Documentação Planilha ' + TIPO_PLANILHA + ' (' + VERSAO + ')**\n\n'
      + '1. [Histórico de Versões (Changelog)](CHANGELOG.md)\n'
      + '1. [Entrada de Dados](Entrada_de_dados.md)\n'
      + '1. [Processamento](Processamento.md)\n'
      + '1. [Demonstrativos](Demonstrativos.md)\n';
      
      var changelog = criarChangelogMD(HISTORICO, 'I. Histórico de Versões');
      var entrada = criarArquivoMD(dados.entrada, 'II. Entrada de Dados');
      var processamento = criarArquivoMD(dados.processamento, 'III. Processamento');
      var demonstrativos = criarArquivoMD(dados.demonstrativos, 'IV. Demonstrativos');
      if (Array.isArray(HISTORICO) && HISTORICO.length > 0) {
        var funcoes = criarArquivoMDFuncoes(LISTA_FUNCOES, 'V. Funções customizadas');
        toc += '1. [Funções Customizadas](Funcoes.md)\n';
      }
      
      pasta.createFile('TOC.md', toc, MimeType.PLAIN_TEXT);
      pasta.createFile('CHANGELOG.md', changelog, MimeType.PLAIN_TEXT);
      pasta.createFile('Entrada_de_dados.md', entrada, MimeType.PLAIN_TEXT);
      pasta.createFile('Processamento.md', processamento, MimeType.PLAIN_TEXT);
      pasta.createFile('Demonstrativos.md', demonstrativos, MimeType.PLAIN_TEXT);
      if (funcoes !== undefined) {
        pasta.createFile('Funcoes.md', funcoes, MimeType.PLAIN_TEXT);
      };
    
    } else {

      var idTemplateDocumentacao = Registro_.obterIdTemplateDocumentacao();
      if (!idTemplateDocumentacao) {
        throw new Error('Template de documentação não registrado.');
      }
      var template = DriveApp.getFileById(idTemplateDocumentacao);
    
      var id = template.makeCopy(nome, pasta).getId();
      var doc = DocumentApp.openById(id);
      
      var estilos = obterEstilos();
      var body = doc.getBody();
      
      body.replaceText('\<\%T[ií]tulo\%\>', 'Documentação Planilha ' + TIPO_PLANILHA + ' (' + VERSAO + ')');
      
      body.appendPageBreak();
      criarSecaoHistorico(body, HISTORICO, 'I. Histórico de Versões', estilos);
      body.appendPageBreak();
      criarSecao(body, dados.entrada, 'II. Entrada de Dados', estilos);
      body.appendPageBreak();
      criarSecao(body, dados.processamento, 'III. Processamento', estilos);
      body.appendPageBreak();
      criarSecao(body, dados.demonstrativos, 'IV. Demonstrativos', estilos);
      if (Array.isArray(HISTORICO) && HISTORICO.length > 0) {
        body.appendPageBreak();
        criarSecaoFuncoes(body, LISTA_FUNCOES, 'V. Funções customizadas', estilos);
      }
      
      doc.saveAndClose();
    }
    return "Documentação criada com sucesso"
  };

  return documentacao;
  
})(Documentacao_ || Object.create(null));