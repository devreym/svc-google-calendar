const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const config = require('./configs/config');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/plain' }));
config.addRoutes(app);

app.listen(config.port, (err) => {
    if(!err){
        console.log(`Example app listening on port ${config.port}`)
    } else {
        console.log("Error occurred, server can't start", error);
    }
})