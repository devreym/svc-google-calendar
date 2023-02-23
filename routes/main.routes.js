const controller = require('../controllers/main.controller');
async function routes (fastify, options) {
    fastify.post('/api/calendar/createEvent', (req, res) => {
        var body = req.body;
        controller.createEvent(body, (cb) => {
            res.send(cb);
        });
    });
}

module.exports = routes