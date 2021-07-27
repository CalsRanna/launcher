const { ipcRenderer } = require("electron");
const { shell } = require("electron");
const dotConf = require("@calsranna/dot-conf");

window.ipcRenderer = ipcRenderer;
window.shell = shell;
window.dotConf = dotConf;
