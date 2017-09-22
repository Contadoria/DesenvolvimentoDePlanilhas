/**
* @fileOverview
* Helpers para acesso ao Google Drive.
*/

var DriveHelpers_ = (function(driveHelpers) {
  
  'use strict';

  driveHelpers.obterArquivoPorNome = function(nome, idPasta) {
    var pasta = DriveApp.getFolderById(idPasta);
    pasta = pasta || DriveApp.getRootFolder();
    var arquivos = pasta.getFiles();
    while (arquivos.hasNext()) {
      var arquivo = arquivos.next();
      if (arquivo.getName() === nome) {
        return arquivo;
      }
    }
    return null;
  };
  
  driveHelpers.naPasta = function(arquivoId, pastaId) {
    var pastas = DriveApp.getFileById(arquivoId).getParents();
    while (pastas.hasNext()) {
      var pasta = pastas.next();
      if (pasta.getId() === pastaId) {
        return true;
      }
    }
    return false;
  };

  driveHelpers.moverParaBackup = function(arquivo, nome) {
    
    var pastaBackup = DriveApp.getFolderById(Registro_.obterIdPastaBackup());
    
    var copia = arquivo.makeCopy(nome, pastaBackup);
    
    try {
      arquivo.setTrashed(true);
    } catch (e) {
      
    }
    
    return copia;
  };

  driveHelpers.copiarParaDistribuicao = function(arquivoId, nome) {
    
    var pastaDistribuicao = DriveApp.getFolderById(Registro_.obterIdPastaDistribuicao());
    var arquivo = DriveApp.getFileById(arquivoId);
    
    return arquivo.makeCopy(nome, pastaDistribuicao);
  };
  
  return driveHelpers;
  
})(DriveHelpers_ || Object.create(null));