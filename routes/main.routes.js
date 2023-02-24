const controller = require('../controllers/main.controller');

module.exports = (app) => {
    app.post('/api/calendar/event/create', (req, res) => {
        var body = req.body;
        controller.createEvent(body, (cb) => {
            res.send(cb);
        });
    });

    app.post('/api/calendar/event/get', (req, res) => {
        var body = req.body;
        controller.getEvents(body, (cb) => {
            res.send(cb);
        });
    });

    app.post('/api/health', (req, res) => {
        res.send({status: "okay"})
    });
}