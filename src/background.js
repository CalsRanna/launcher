"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");

import "./background/launcher";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  global.win = new BrowserWindow({
    width: 1200,
    height: 916,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: !process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("MINIMIZE", () => {
  win.minimize();
});

ipcMain.on("EXIT_APP", () => {
  app.quit();
});

ipcMain.on("CHOOSE_FILE", (event) => {
  dialog.showOpenDialog({}).then((result) => {
    event.sender.send("CHOOSE_FILE", result);
  });
});

ipcMain.on("CHOOSE_DIRECTORY", (event) => {
  dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
    event.sender.send("CHOOSE_DIRECTORY", result);
  });
});
