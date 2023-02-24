const controller = require('../controllers/main.controller');
async function routes (fastify, options) {
    fastify.post('/api/calendar/event/create', (req, res) => {
        var body = req.body;
        controller.createEvent(body, (cb) => {
            res.send(cb);
        });
    });

    fastify.post('/api/calendar/event/get', (req, res) => {
        var body = req.body;
        controller.getEvents(body, (cb) => {
            res.send(cb);
        });
    });
    fastify.post('/api/health', (req, res) => {
        res.send({status: "okay"})
    });
}

module.exports = routes