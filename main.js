const electron = require('electron');
const url = require('url');
const path  = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;


// Listen for the app to be ready

app.on('ready', function(){
	// Create window
	mainWindow = new BrowserWindow({
		title: "Strawberry"
	});

	mainWindow.maximize();

	// Load html file
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file',
		slashed: true
	}))

	mainWindow.on('close', function(){
		mainWindow = null;
	})


	//Configure menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
	{
		label: 'Regenerate',
		click(){
			mainWindow.reload();
		}
	},
	{
		label: 'Exit',
		click(){
			app.quit();
		}
	}
];


if (true /**process.env.NODE_ENV !== 'production'**/) {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	})
}