let port = 3000
const fastify = require('fastify')({ logger: true, bodyLimit: 52428800 });

fastify.register(require('./routes/main.routes'));

fastify.listen({ port }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})