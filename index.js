const redis = require('redis');
const client = redis.createClient({ host: 'redis' });
const express = require('express');
const os = require('os');
const app = express();

client.on('error', err => console.error(`[REDDIS ERR]: ${err}`));

client.on('ready', () => {
    console.log('Redis server is up and running');
    app.get('/', (req, res) => {
        client.get(req.ip, (err, reply) => {
            if (err) console.error(err);
            if(reply === null) {
                client.set(req.ip, 1);
            } else {
                client.set(req.ip, (reply * 1 + 1) * 1);
            }
            res.json(
                {
                    hostname: os.hostname(),
                    count: reply === null ? "0" : reply,
                }
            )
        });
    });
});

app.listen(8080, () => {
    console.log('HTTP server is ready');
});