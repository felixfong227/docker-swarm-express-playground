const redis = require('redis');
const client = redis.createClient({ host: 'redis' });
const express = require('express');
const os = require('os');
const app = express();

client.on('error', err => console.error(`[REDDIS ERR]: ${err}`));

let isServicesReady = false;

app.all('*', (req, res) => {
    if(isServicesReady) {
        client.get(req.ip, (err, reply) => {
            if (err) {
                console.error(err);
                return res.json({
                    error: true,
                    message: 'Fail to access data from Redis cache server',
                });
            }
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
    } else {
        res.json({
            error: true,
            message: 'Please wait...services is being booting up',
        });
    }
});

client.on('ready', () => {
    console.log('Redis server is up and running');
    isServicesReady = true;
});

app.listen(8080, () => {
    console.log('HTTP server is ready');
});