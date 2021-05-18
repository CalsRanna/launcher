import { ipcMain } from "electron";

const { spawn } = require("child_process");

global.runningProcess = {
  mysqld: undefined,
  authserver: undefined,
  worldserver: undefined,
};

function check() {
  return new Promise((resolve, reject) => {
    let check = spawn("ps", {
      shell: "powershell.exe",
      windowsHide: true,
    });

    check.stdout.on("data", (data) => {
      let words = data.toString().split(/\s+/);
      if (words.includes("mysqld")) {
        runningProcess.mysqld = parseInt(words[words.length - 4]);
      }
      if (words.includes("authserver")) {
        runningProcess.authserver = parseInt(words[words.length - 4]);
      }
      if (words.includes("worldserver")) {
        runningProcess.worldserver = parseInt(words[words.length - 4]);
      }
    });

    check.stderr.on("data", (error) => {
      reject(error);
    });

    check.on("close", () => {
      resolve();
    });
  });
}

function startMysqld() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.mysqld === undefined) {
          let mysqld = spawn("mysqld.exe", ["--console"], {
            cwd: "D:\\FoxWOW\\Server\\Database\\bin\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          mysqld.stdout.on("data", (data) => {
            win.webContents.send("MYSQLD_CONSOLE", data.toString());
            if (data.toString().includes("ready for connections")) {
              resolve();
            }
          });

          // 不知道为什么stdout的内容会跑到stderr内，怀疑是因为mysqld本身开了子进程的缘故
          mysqld.stderr.on("data", (error) => {
            win.webContents.send("MYSQLD_CONSOLE", error.toString());
            if (error.toString().includes("ready for connections")) {
              resolve();
            }
          });

          mysqld.on("close", (code) => {
            win.webContents.send(
              "MYSQLD_CONSOLE",
              `mysqld: exited with code ${code}`
            );
          });
        } else {
          resolve();
        }
      })
      .catch(() => {
        reject(error);
      });
  });
}

function startAuthserver() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.authserver === undefined) {
          let authserver = spawn("authserver.exe", {
            cwd: "D:\\FoxWOW\\Server\\Core\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          authserver.stdout.on("data", (data) => {
            win.webContents.send("AUTH_SERVER_CONSOLE", data.toString());
            if (data.toString().includes("Authserver listening to")) {
              resolve();
            }
          });

          authserver.stderr.on("data", (error) => {
            win.webContents.send("AUTH_SERVER_CONSOLE", error.toString());
          });

          authserver.on("close", (code) => {
            win.webContents.send(
              "AUTH_SERVER_CONSOLE",
              `authserver: exited with code ${code}`
            );
          });
        } else {
          resolve();
        }
      })
      .catch(() => {
        reject(error);
      });
  });
}

function startWorldserver() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.worldserver === undefined) {
          let worldserver = spawn("worldserver.exe", {
            cwd: "D:\\FoxWOW\\Server\\Core\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          worldserver.stdout.on("data", (data) => {
            win.webContents.send("WORLD_SERVER_CONSOLE", data.toString());
            if (data.toString().includes("(worldserver-daemon) ready")) {
              resolve();
            }
          });

          worldserver.stderr.on("data", (error) => {
            win.webContents.send("WORLD_SERVER_CONSOLE", error.toString());
          });

          worldserver.on("close", (code) => {
            win.webContents.send(
              "WORLD_SERVER_CONSOLE",
              `worldserver: exited with code ${code}`
            );
          });
        } else {
          resolve();
        }
      })
      .catch(() => {
        reject(error);
      });
  });
}

function startWow() {
  spawn("Wow.exe", {
    cwd: "D:\\FoxWOW\\World of Warcraft\\",
    shell: "cmd.exe",
  });
}

function stopMysqld() {
  check()
    .then(() => {
      if (runningProcess.mysqld !== undefined) {
        process.kill(runningProcess.mysqld);
        runningProcess.mysqld = undefined;
      }
    })
    .catch();
}

function stopAuthserver() {
  check()
    .then(() => {
      if (runningProcess.authserver !== undefined) {
        process.kill(runningProcess.authserver);
        runningProcess.authserver = undefined;
      }
    })
    .catch();
}

function stopWorldserver() {
  check()
    .then(() => {
      if (runningProcess.worldserver !== undefined) {
        process.kill(runningProcess.worldserver);
        runningProcess.worldserver = undefined;
      }
    })
    .catch();
}

ipcMain.on("ENTER_GAME", (event) => {
  Promise.all([startMysqld(), startAuthserver(), startWorldserver()])
    .then(() => {
      startWow();
    })
    .catch();
});

ipcMain.on("START_MYSQLD", (event) => {
  startMysqld();
});

ipcMain.on("START_AUTH_SERVER", (event) => {
  startAuthserver();
});

ipcMain.on("START_WORLD_SERVER", (event) => {
  startWorldserver();
});

ipcMain.on("START_ALL", (event) => {
  startMysqld();
  startAuthserver();
  startWorldserver();
});

ipcMain.on("STOP_MYSQLD", (event) => {
  stopMysqld();
});

ipcMain.on("STOP_AUTH_SERVER", (event) => {
  stopAuthserver();
});

ipcMain.on("STOP_WORLD_SERVER", (event) => {
  stopWorldserver();
});

ipcMain.on("STOP_ALL", (event) => {
  stopMysqld();
  stopAuthserver();
  stopWorldserver();
});
