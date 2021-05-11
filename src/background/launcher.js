import { ipcMain } from "electron";

ipcMain.on("START_MYSQL", (event) => {
  const { spawn } = require("child_process");

  // const mysql = spawn("ls", ["-lh", "/usr"]);
  const mysql = spawn("ping", ["www.baidu.com", "-c", "20"]);

  mysql.stdout.on("data", (data) => {
    event.reply("START_MYSQL", data.toString());
  });
});

ipcMain.on("START_AUTH_SERVER", (event) => {
  const { spawn } = require("child_process");

  // const mysql = spawn("ls", ["-lh", "/usr"]);
  const mysql = spawn("ping", ["github.com", "-c", "8"]);

  mysql.stdout.on("data", (data) => {
    event.reply("START_AUTH_SERVER", data.toString());
  });
});

ipcMain.on("START_WORLD_SERVER", (event) => {
  const { spawn } = require("child_process");

  // const mysql = spawn("ls", ["-lh", "/usr"]);
  const mysql = spawn("ping", ["google.com", "-c", "8"]);

  mysql.stdout.on("data", (data) => {
    event.reply("START_WORLD_SERVER", data.toString());
  });
});

console.log(process.env);
