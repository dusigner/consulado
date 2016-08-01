//load all controllers
/*var fs = require('fs');

fs.readdirSync(__dirname + '/../controllers').forEach(function (controller) {
	require(__dirname + '/../controllers/' + controller);
});*/

var controllers = require.context('controllers', true, /\.js$/);
controllers.keys().forEach(controllers);
