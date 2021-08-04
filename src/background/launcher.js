import { ipcMain } from "electron";

const { spawn } = require("child_process");

global.runningProcess = {
  mysql: [],
  authServer: [],
  worldServer: [],
};

String.prototype.toFirstUpperWord = function() {
  return this.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

function log(channel, message, formatted = true) {
  if (!formatted) {
    message = `${new Date().toLocaleString()} [Launcher] ${message}\n`;
  }
  win.webContents.send("CHILD_PROCESS_STDOUT", { channel, message });
}

function reply(channel, process) {
  win.webContents.send("CHILD_PROCESS_PIDS", { channel, process });
}

function throwError(error) {
  win.webContents.send("GLOBAL_MESSAGE", error.toString());
}

function check() {
  return new Promise((resolve, reject) => {
    runningProcess = {
      mysql: [],
      authServer: [],
      worldServer: [],
    };

    let ps = spawn("ps", {
      shell: "powershell.exe",
      windowsHide: true,
    });

    ps.stdout.on("data", (data) => {
      let words = data.toString().split(/\s+/);
      let process = parseInt(words[words.length - 4]);

      if (
        words.includes("mysqld") &&
        runningProcess.mysql.includes(process) === false
      ) {
        runningProcess.mysql.push(process);
      }
      if (
        words.includes("worldserver") &&
        runningProcess.worldServer.includes(process) === false
      ) {
        runningProcess.worldServer.push(process);
      }
      if (
        words.includes("authserver") &&
        runningProcess.authServer.includes(process) === false
      ) {
        runningProcess.authServer.push(process);
      }
    });

    ps.stderr.on("data", (error) => {
      reject(error);
    });

    ps.on("close", () => {
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

ipcMain.on("MANAGE_SERVICE", (event, payload) => {
  switch (payload.service) {
    case "mysql":
      payload.status ? startMysql() : stopMysql();
      break;
    case "worldServer":
      payload.status ? startWorldServer() : stopWorldServer();
      break;
    case "authServer":
      payload.status ? startAuthServer() : stopAuthServer();
      break;
    default:
      break;
  }
});

ipcMain.on("ENTER_GAME", () => {
  check().then(async () => {
    await startMysql();
    startWorldServer();
    startAuthServer();
    startWow();
  });
});

ipcMain.on("START_ALL", () => {
  check().then(async () => {
    await startMysql();
    startWorldServer();
    startAuthServer();
  });
});

ipcMain.on("STOP_ALL", () => {
  check().then(() => {
    stopAuthServer();
    stopWorldServer();
    stopMysql();
  });
});

ipcMain.on("START_CLIENT", () => {
  startWow();
});

ipcMain.on("OPEN_SOFTWARE", (event, payload) => {
  switch (payload.software) {
    case "foxy":
      startFoxy();
      break;
    case "mpq-editor":
      startMpqEditor();
      break;
    case "navicat":
      startNavicat();
      break;
    default:
      break;
  }
});

function startMysql() {
  return new Promise(async (resolve, reject) => {
    await check();

    if (runningProcess.mysql.length === 0) {
      log("mysql", "正在启动Mysql", false);
      let mysql = spawn("mysqld.exe", ["--console"], {
        cwd: "D:\\FoxWOW\\Server\\Database\\bin\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      mysql.stdout.on("data", async (data) => {
        log("mysql", data.toString());
        if (data.toString().includes("ready for connections")) {
          await check();
          reply("mysql", runningProcess.mysql);
          resolve();
        }
      });

      // 不知道为什么stdout的内容会跑到stderr内，怀疑是因为mysql本身开了子进程的缘故
      mysql.stderr.on("data", async (error) => {
        log("mysql", error.toString());
        if (error.toString().includes("ready for connections")) {
          await check();
          reply("mysql", runningProcess.mysql);
          resolve();
        }
      });
    } else {
      reply("mysql", runningProcess.mysql);
      resolve();
    }
  });
}

function startWorldServer() {
  return new Promise(async (resolve, reject) => {
    await check();

    if (runningProcess.worldServer.length === 0) {
      log("worldServer", "正在启动World Server", false);
      let worldServer = spawn("worldserver.exe", {
        cwd: "D:\\FoxWOW\\Server\\Core\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      worldServer.stdout.on("data", async (data) => {
        log("worldServer", data.toString());
        if (data.toString().includes("World initialized in")) {
          await check();
          reply("worldServer", runningProcess.worldServer);
          resolve();
        }
      });

      worldServer.stderr.on("data", async (error) => {
        log("worldServer", error.toString());
        if (error.toString().includes("World initialized in")) {
          await check();
          reply("worldServer", runningProcess.worldServer);
          resolve();
        }
      });
    } else {
      reply("worldServer", runningProcess.worldServer);
      resolve();
    }
  });
}

function startAuthServer() {
  return new Promise(async (resolve, reject) => {
    await check();

    if (runningProcess.authServer.length === 0) {
      log("authServer", "正在启动Auth Server", false);
      let authServer = spawn("authserver.exe", {
        cwd: "D:\\FoxWOW\\Server\\Core\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      authServer.stdout.on("data", async (data) => {
        log("authServer", data.toString());
        if (data.toString().includes("Authserver listening to")) {
          await check();
          reply("authServer", runningProcess.authServer);
          resolve();
        }
      });

      authServer.stderr.on("data", async (error) => {
        log("authServer", error.toString());
        if (error.toString().includes("Authserver listening to")) {
          await check();
          reply("authServer", runningProcess.authServer);
          resolve();
        }
      });
    } else {
      reply("authServer", runningProcess.authServer);
      resolve();
    }
  });
}

async function stopMysql() {
  await check();

  try {
    await kill(runningProcess.mysql);
    runningProcess.mysql = [];
    log("mysql", "Mysql已停止", false);
  } catch (error) {
    log("mysql", `Mysql${error}`, false);
  }
  reply("mysql", runningProcess.mysql);
}

async function stopWorldServer() {
  await check();

  try {
    await kill(runningProcess.worldServer);
    runningProcess.worldServer = [];
    log("worldServer", "World Server已停止", false);
  } catch (error) {
    log("worldServer", `World Server${error}`, false);
  }
  reply("worldServer", runningProcess.worldServer);
}

async function stopAuthServer() {
  await check();

  try {
    await kill(runningProcess.authServer);
    runningProcess.authServer = [];
    log("authServer", "Auth Server已停止", false);
  } catch (error) {
    log("authServer", `Auth Server${error}`, false);
  }
  reply("authServer", runningProcess.authServer);
}

function startWow() {
  spawn("Wow.exe", {
    cwd: "D:\\FoxWOW\\Client\\",
    shell: "cmd.exe",
  });
}

function startFoxy() {
  spawn("Foxy.exe", {
    cwd: "D:\\FoxWOW\\Tools\\",
    shell: "cmd.exe",
  });
}

function startMpqEditor() {
  spawn("MPQEditor.exe", {
    cwd: "D:\\FoxWOW\\Tools\\MPQEditor\\",
    shell: "cmd.exe",
  });
}

function startNavicat() {
  spawn("navicat.exe", {
    cwd: "D:\\FoxWOW\\Tools\\Navicat Premium\\",
    shell: "cmd.exe",
  });
}
