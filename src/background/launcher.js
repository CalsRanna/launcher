import { ipcMain } from "electron";

ipcMain.on("START_MYSQL", (event) => {
  const { spawn } = require("child_process");

  //   const mysql = spawn("cmd.exe", [
  //     "start",
  //     "D:\\FoxWOW\\Server\\Database\\bin\\mysqld.exe",
  //     "--console",
  //   ]);
  const mysql = spawn("cmd.exe dir");

  mysql.stdout.on("data", (data) => {
    console.log(data.toString());
  });
});
