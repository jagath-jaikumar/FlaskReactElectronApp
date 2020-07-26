const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const config = require('./config.js');
const psTree = require('ps-tree');

let mainWindow;
let pythonProcess = null;

function getPythonFilePath(pythonFileName) {
  let pythonFilePath = '';

  pythonFilePath = path.join(
    __dirname,
    '../',
    config.PYTHON_DIR,
    pythonFileName + '.py'
  );
  if (config.DEBUG) {
    console.log('Python file path: ' + pythonFilePath);
  }
  return pythonFilePath;
}

function createPythonProcess(pythonFileName, pythonArgs) {
  let pythonFilePath = getPythonFilePath(pythonFileName);
  pythonArgs.unshift(pythonFilePath);
  pythonProcess = require('child_process').spawn('python', pythonArgs);

  pythonProcess.stdout.on('data', async (data) => {
    let dataString = data.toString();
    console.log(dataString)
  });

  return pythonProcess;
}


function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({ width: 1000, height: 800 });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  if (config.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
  createPythonProcess(
    config.P_FLASK_APP,
    []
  );
}

app.on('ready', createWindow);


const deleteChildren = (rootPid) => {
  let cleanup_completed = false;

  psTree(rootPid, (err, children) => {
    children.map((p) => {
      process.kill(p.PID);
    });

    cleanup_completed = true;
  });
  return new Promise((resolve, reject) => {
    (function waitForSubProcessCleanup() {
      if (cleanup_completed) return resolve();
      setTimeout(waitForSubProcessCleanup, 30);
    })();
  });
};

app.on('window-all-closed', function () {
  if (pythonProcess != null) {
      deleteChildren(pythonProcess.pid).then(() => {
        //deleteChildren seems to also kill pythonProcess on Windows
        //but not on Mac
        if (pythonProcess != null) {
          pythonProcess.kill();
        }
        app.quit();
      });
    }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
