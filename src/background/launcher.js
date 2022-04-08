import { ipcMain } from "electron";

const { spawn } = require("child_process");

global.runningProcess = {
  mysql: [],
  authServer: [],
  worldServer: [],
};

global.path = {
  mysql: "",
  worldServer: "",
  authServer: "",
  client: "",
  foxy: "",
  mpqEditor: "",
  navicat: "",
};

String.prototype.toFirstUpperWord = function() {
  return this.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

function clear(channel) {
  win.webContents.send("CHILD_PROCESS_CLEAR", { channel });
}

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
        reject("has some error when try to stop service");
      }
    } else {
      reject(" has not been started");
    }
  });
}

ipcMain.on("INIT_PATHS", (event, payload) => {
  global.paths = payload;
});

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
    await startWorldServer();
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
      clear("mysql");
      log("mysql", "Starting mysql", false);
      let patterns = global.paths.mysql.split("\\");
      let cwd = patterns.slice(0, -1).join("/");
      let program = patterns[patterns.length - 1];
      let mysql = spawn(program, ["--console"], {
        cwd: cwd,
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
      clear("worldServer");
      log("worldServer", "Starting world server", false);
      let patterns = global.paths.worldServer.split("\\");
      let cwd = patterns.slice(0, -1).join("/");
      let program = patterns[patterns.length - 1];
      let worldServer = spawn(program, {
        cwd: cwd,
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
      clear("authServer");
      log("authServer", "Starting auth server", false);
      let patterns = global.paths.authServer.split("\\");
      let cwd = patterns.slice(0, -1).join("/");
      let program = patterns[patterns.length - 1];
      let authServer = spawn(program, {
        cwd: cwd,
        shell: "cmd.exe",
        windowsHide: true,
      });

      authServer.stdout.on("data", async (data) => {
        console.log(data);
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
    log("mysql", "Mysql has been stopped", false);
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
    log("worldServer", "World server has been stopped", false);
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
    log("authServer", "Auth server has been stopped", false);
  } catch (error) {
    log("authServer", `Auth Server${error}`, false);
  }
  reply("authServer", runningProcess.authServer);
}

function startWow() {
  let patterns = global.paths.client.split("\\");
  let cwd = patterns.slice(0, -1).join("/");
  let program = patterns[patterns.length - 1];
  spawn("rd /s /q Cache", {
    cwd: cwd,
    shell: "cmd.exe",
  });
  spawn("echo SET realmlist '127.0.0.1' > realmlist.wtf", {
    cwd: cwd,
    shell: "cmd.exe",
  });
  spawn(program, {
    cwd: cwd,
    shell: "cmd.exe",
  });
}

function startFoxy() {
  let patterns = global.paths.foxy.split("\\");
  let cwd = patterns.slice(0, -1).join("/");
  let program = patterns[patterns.length - 1];
  spawn(program, {
    cwd: cwd,
    shell: "cmd.exe",
  });
}

function startMpqEditor() {
  let patterns = global.paths.mpqEditor.split("\\");
  let cwd = patterns.slice(0, -1).join("/");
  let program = patterns[patterns.length - 1];
  spawn(program, {
    cwd: cwd,
    shell: "cmd.exe",
  });
}

function startNavicat() {
  let patterns = global.paths.navicat.split("\\");
  let cwd = patterns.slice(0, -1).join("/");
  let program = patterns[patterns.length - 1];
  spawn(program, {
    cwd: cwd,
    shell: "cmd.exe",
  });
}
