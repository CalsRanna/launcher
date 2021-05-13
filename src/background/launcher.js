import { ipcMain } from "electron";
const { spawn } = require("child_process");

ipcMain.on("ENTER_GAME", (event) => {
  let check = spawn("ps", {
    shell: "powershell.exe",
    windowsHide: true,
  });
  global.runningProcess = [];

  check.stdout.on("data", (data) => {
    global.words = data.toString().split(/\s+/);
    if (words.includes("mysqld")) {
      runningProcess.push("mysqld");
    }
    if (words.includes("authserver")) {
      runningProcess.push("authserver");
    }
    if (words.includes("worldserver")) {
      runningProcess.push("worldserver");
    }
    if (words.includes("Wow")) {
      runningProcess.push("Wow");
    }
  });

  check.on("close", (code) => {
    if (!runningProcess.includes("mysqld")) {
      let mysql = spawn("mysqld.exe", ["--console"], {
        cwd: "D:\\FoxWOW\\Server\\Database\\bin\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      mysql.stdout.on("data", (data) => {
        event.reply("START_MYSQL", data.toString());
      });

      mysql.stderr.on("data", (error) => {
        event.reply("START_MYSQL", error.toString());
      });

      mysql.on("close", (code) => {
        event.reply(
          "START_MYSQL",
          `mysql[${mysql.pid}]: exited with code ${code}`
        );
      });
    }
    if (!runningProcess.includes("authserver")) {
      let auth = spawn("authserver.exe", {
        cwd: "D:\\FoxWOW\\Server\\Core\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      auth.stdout.on("data", (data) => {
        event.reply("START_AUTH_SERVER", data.toString());
      });

      auth.stderr.on("data", (error) => {
        event.reply("START_AUTH_SERVER", error.toString());
      });

      auth.on("close", (code) => {
        event.reply(
          "START_AUTH_SERVER",
          `authserver[${auth.pid}]: exited with code ${code}`
        );
      });
    }
    if (!runningProcess.includes("worldserver")) {
      let world = spawn("worldserver.exe", {
        cwd: "D:\\FoxWOW\\Server\\Core\\",
        shell: "cmd.exe",
        windowsHide: true,
      });

      world.stdout.on("data", (data) => {
        event.reply("START_WORLD_SERVER", data.toString());
        if (data.toString().includes("(worldserver-daemon) ready")) {
          if (!runningProcess.includes("Wow")) {
            spawn("Wow.exe", {
              cwd: "D:\\FoxWOW\\World of Warcraft\\",
              shell: "cmd.exe",
            });
          }
        }
      });

      world.stderr.on("data", (error) => {
        event.reply("START_WORLD_SERVER", error.toString());
      });

      world.on("close", (code) => {
        event.reply(
          "START_WORLD_SERVER",
          `worldserver[${world.pid}]:exited with code ${code}`
        );
      });
    } else {
      if (!runningProcess.includes("Wow")) {
        spawn("Wow.exe", {
          cwd: "D:\\FoxWOW\\World of Warcraft\\",
          shell: "cmd.exe",
        });
      }
    }
  });
});

ipcMain.on("START_MYSQL", (event) => {
  global.mysql = spawn("mysqld.exe", ["--console"], {
    cwd: "D:\\FoxWOW\\Server\\Database\\bin\\",
    shell: "cmd.exe",
    windowsHide: true,
  });

  mysql.stdout.on("data", (data) => {
    event.reply("START_MYSQL", data.toString());
  });

  mysql.stderr.on("data", (error) => {
    event.reply("START_MYSQL", error.toString());
  });

  mysql.on("close", (code) => {
    event.reply("START_MYSQL", `mysql[${mysql.pid}]: exited with code ${code}`);
  });
});

ipcMain.on("START_AUTH_SERVER", (event) => {
  global.auth = spawn("D:\\FoxWOW\\Server\\Core\\authserver.exe", {
    cwd: "D:\\FoxWOW\\Server\\Core\\",
    shell: "cmd.exe",
    windowsHide: true,
  });

  auth.stdout.on("data", (data) => {
    event.reply("START_AUTH_SERVER", data.toString());
  });

  auth.stderr.on("data", (error) => {
    event.reply("START_AUTH_SERVER", error.toString());
  });

  auth.on("close", (code) => {
    event.reply(
      "START_AUTH_SERVER",
      `authserver[${auth.pid}]: exited with code ${code}`
    );
  });
});

ipcMain.on("START_WORLD_SERVER", (event) => {
  global.world = spawn("worldserver.exe", {
    cwd: "D:\\FoxWOW\\Server\\Core\\",
    shell: "cmd.exe",
    windowsHide: true,
  });

  world.stdout.on("data", (data) => {
    event.reply("START_WORLD_SERVER", data.toString());
    if (data.toString().includes("(worldserver-daemon) ready")) {
      spawn("Wow.exe", {
        cwd: "D:\\FoxWOW\\World of Warcraft\\",
        shell: "cmd.exe",
      });
    }
  });

  world.stderr.on("data", (error) => {
    event.reply("START_WORLD_SERVER", error.toString());
  });

  world.on("close", (code) => {
    event.reply(
      "START_WORLD_SERVER",
      `worldserver[${world.pid}]:exited with code ${code}`
    );
  });
});

ipcMain.on("START_CLIENT", (event) => {
  spawn("Wow.exe", {
    cwd: "D:\\FoxWOW\\World of Warcraft\\",
    shell: "cmd.exe",
  });
});

ipcMain.on("STOP_SERVICES", (event) => {
  global.ps = spawn("ps", {
    shell: "powershell.exe",
    windowsHide: true,
  });
  global.childProcessPids = [];

  ps.stdout.on("data", (data) => {
    global.words = data.toString().split(/\s+/);
    if (words.includes("mysqld")) {
      childProcessPids.push(parseInt(words[words.length - 4]));
    }
    if (words.includes("authserver")) {
      childProcessPids.push(parseInt(words[words.length - 4]));
    }
    if (words.includes("worldserver")) {
      childProcessPids.push(parseInt(words[words.length - 4]));
    }
  });

  ps.on("close", (code) => {
    childProcessPids.forEach((pid) => {
      process.kill(pid);
    });
  });
});
