/**
* @fileOverview
* Rotinas de inicialização do addon.
* cf. https://developers.google.com/apps-script/add-ons/lifecycle
*/

'use strict';

function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  SpreadsheetApp.getUi()
  .createAddonMenu()
  .addItem('Abrir', 'abrirSidebar')
  .addToUi();  
}