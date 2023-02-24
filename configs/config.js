const path = require('path');
const fs = require('fs');
var config = {}
config.port =  process.env.PORT || 7000

config.addRoutes = (app) => {
    var rootFolder = path.dirname(require.main.filename);
    var apiRoutes = [];
    var routePath = path.join(rootFolder, 'routes');
    if(fs.existsSync(routePath)) {
        apiRoutes = fs.readdirSync(routePath);
    }
    apiRoutes.forEach((file) => {
        require('../routes/' + file)(app);
    });
}

module.exports = config;