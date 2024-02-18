import { Menu, app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { autoUpdater } from "electron-updater";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1337,
    height: 700,
    resizable: false,
    maximizable: false,
  });

  // const secondWindow = createWindow("main", {
  //   width: 1337,
  //   height: 700,
  //   resizable: false,
  //   maximizable: false,
  // });

  if (isProd) {
    mainWindow.once("ready-to-show", () => {
      autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on("update-downloaded", () => {
      mainWindow.webContents.send("update_downloaded");
    });

    ipcMain.on("restart_app", () => {
      autoUpdater.quitAndInstall();
    });
  }

  const menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: "Quit " + app.getName(),
          click: () => {
            app.quit();
          },
          accelerator: "CmdOrCtrl+Q",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    mainWindow.webContents.openDevTools();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // await secondWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    // secondWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
