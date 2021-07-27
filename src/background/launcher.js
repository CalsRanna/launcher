import { ipcMain } from "electron";

const { spawn } = require("child_process");

global.runningProcess = {
  mysqld: [],
  authserver: [],
  worldserver: [],
};

String.prototype.toFirstUpperWord = function() {
  return this.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

function log(channel, message, formatted = true) {
  channel = `${channel}_CONSOLE`;
  if (formatted) {
    win.webContents.send(channel, message);
  } else {
    message = `${new Date().toLocaleString()} [Launcher] ${message}\n`;
    win.webContents.send(channel, message);
  }
}

function throwError(error) {
  win.webContents.send("GLOBAL_MESSAGE", error.toString());
}

function check() {
  return new Promise((resolve, reject) => {
    runningProcess = {
      mysqld: [],
      authserver: [],
      worldserver: [],
    };

    let check = spawn("ps", {
      shell: "powershell.exe",
      windowsHide: true,
    });

    check.stdout.on("data", (data) => {
      let words = data.toString().split(/\s+/);
      let process = parseInt(words[words.length - 4]);

      if (
        words.includes("mysqld") &&
        runningProcess.mysqld.includes(process) === false
      ) {
        runningProcess.mysqld.push(process);
      }
      if (
        words.includes("authserver") &&
        runningProcess.authserver.includes(process) === false
      ) {
        runningProcess.authserver.push(process);
      }
      if (
        words.includes("worldserver") &&
        runningProcess.worldserver.includes(process) === false
      ) {
        runningProcess.worldserver.push(process);
      }
    });

    check.stderr.on("data", (error) => {
      reject(error);
    });

    check.on("close", () => {
      win.webContents.send("CHECK_PROCESSES", runningProcess);
      resolve();
    });
  });
}

function kill(pids) {
  return new Promise((resolve, reject) => {
    if (pids.length !== 0) {
      try {
        pids.forEach((pid) => {
          process.kill(pid);
        });
        resolve();
      } catch (error) {
        throwError(error);
        reject("停止时发生错误");
      }
    } else {
      reject("尚未启动");
    }
  });
}

function startMysqld() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.mysqld.length === 0) {
          log("MYSQLD", "正在启动Mysql", false);
          let mysqld = spawn("mysqld.exe", ["--console"], {
            cwd: "D:\\FoxWOW\\Server\\Database\\bin\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          mysqld.stdout.on("data", (data) => {
            log("MYSQLD", data.toString());
            if (data.toString().includes("ready for connections")) {
              check().then(() => {
                resolve(runningProcess.mysqld);
              });
            }
          });

          // 不知道为什么stdout的内容会跑到stderr内，怀疑是因为mysqld本身开了子进程的缘故
          mysqld.stderr.on("data", (error) => {
            log("MYSQLD", error.toString());
            if (error.toString().includes("ready for connections")) {
              check().then(() => {
                resolve(runningProcess.mysqld);
              });
            }
          });
        } else {
          log("MYSQLD", `Mysql正在运行中`, false);
          resolve(runningProcess.mysqld);
        }
      })
      .catch((error) => {
        log("MYSQLD", error.toString());
        check();
        reject(error);
      });
  });
}

function startAuthserver() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.authserver.length === 0) {
          log("AUTH_SERVER", "正在启动Auth Server", false);
          let authserver = spawn("authserver.exe", {
            cwd: "D:\\FoxWOW\\Server\\Core\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          authserver.stdout.on("data", (data) => {
            log("AUTH_SERVER", data.toString());
            if (data.toString().includes("Authserver listening to")) {
              check().then(() => {
                resolve(runningProcess.authserver);
              });
            }
          });

          authserver.stderr.on("data", (error) => {
            log("AUTH_SERVER", error.toString());
            if (error.toString().includes("Authserver listening to")) {
              check().then(() => {
                resolve(runningProcess.authserver);
              });
            }
          });
        } else {
          log("AUTH_SERVER", `Auth Server正在运行中`, false);
          resolve(runningProcess.authserver);
        }
      })
      .catch((error) => {
        log("AUTH_SERVER", error.toString());
        reject(error);
      });
  });
}

function startWorldserver() {
  return new Promise((resolve, reject) => {
    check()
      .then(() => {
        if (runningProcess.worldserver.length === 0) {
          log("WORLD_SERVER", "正在启动World Server", false);
          let worldserver = spawn("worldserver.exe", {
            cwd: "D:\\FoxWOW\\Server\\Core\\",
            shell: "cmd.exe",
            windowsHide: true,
          });

          worldserver.stdout.on("data", (data) => {
            log("WORLD_SERVER", data.toString());
            if (data.toString().includes("(worldserver-daemon) ready")) {
              check().then(() => {
                resolve(runningProcess.worldserver);
              });
            }
          });

          worldserver.stderr.on("data", (error) => {
            log("WORLD_SERVER", error.toString());
            if (error.toString().includes("(worldserver-daemon) ready")) {
              check().then(() => {
                resolve(runningProcess.worldserver);
              });
            }
          });
        } else {
          log("WORLD_SERVER", `World Server正在运行中`, false);
          resolve(runningProcess.worldserver);
        }
      })
      .catch((error) => {
        log("WORLD_SERVER", error.toString());
        reject(error);
      });
  });
}

function startWow() {
  spawn("Wow.exe", {
    cwd: "D:\\FoxWOW\\Client\\",
    shell: "cmd.exe",
  });
}

function stopMysqld() {
  check().then(() => {
    kill(runningProcess.mysqld)
      .then(() => {
        runningProcess.mysqld = [];
        log("MYSQLD", "Mysql已停止", false);
      })
      .catch((error) => {
        log("MYSQLD", `Mysql${error}`, false);
      });
  });
}

function stopAuthserver() {
  check().then(() => {
    kill(runningProcess.authserver)
      .then(() => {
        runningProcess.authserver = [];
        log("AUTH_SERVER", "Auth Server已停止", false);
      })
      .catch((error) => {
        log("AUTH_SERVER", `Auth Server${error}`, false);
      });
  });
}

function stopWorldserver() {
  check().then(() => {
    kill(runningProcess.worldserver)
      .then(() => {
        runningProcess.worldserver = [];
        log("WORLD_SERVER", "World Server已停止", false);
      })
      .catch((error) => {
        log("WORLD_SERVER", `World Server${error}`, false);
      });
  });
}

ipcMain.on("ENTER_GAME", async (event) => {
  await startMysqld();
  await startAuthserver();
  await startWorldserver();
  startWow();
});

ipcMain.on("START_MYSQLD", (event) => {
  startMysqld().then((process) => {
    event.reply("START_MYSQLD", process);
  });
});

ipcMain.on("START_AUTH_SERVER", (event) => {
  startAuthserver().then((process) => {
    event.reply("START_AUTH_SERVER", process);
  });
});

ipcMain.on("START_WORLD_SERVER", (event) => {
  startWorldserver().then((process) => {
    event.reply("START_WORLD_SERVER", process);
  });
});

ipcMain.on("START_ALL", (event) => {
  startMysqld().then((process) => {
    event.reply("START_MYSQLD", process);
  });
  startAuthserver().then((process) => {
    event.reply("START_AUTH_SERVER", process);
  });
  startWorldserver().then((process) => {
    event.reply("START_WORLD_SERVER", process);
  });
});

ipcMain.on("START_CLIENT", (event) => {
  startWow();
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
