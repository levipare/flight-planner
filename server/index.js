import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';
import * as fs from 'fs';

const app = express();
const rawManifest = fs.readFileSync('../../airports/manifest.json');
const manifest = JSON.parse(rawManifest.toString()); app.disable('x-powered-by');

app.use(compression());
app.use(express.static('../client/dist'));

app.get('/api/airport', (req, res) => {
    const query = req.query;
    const icao = query.icao?.toString().toUpperCase();
    if (!icao || !manifest.hasOwnProperty(icao)) res.sendStatus(404);

    res.status(200).send(manifest[icao]);
});

app.use(
    '/api/chart',
    rateLimit({
        windowMs: 1000 * 60 * 60 * 6, // 6 Hours
        max: 200,
        standardHeaders: false,
        legacyHeaders: false,
    }),
    express.static('../../airports')
);

console.log("Running server on port 3000");
app.listen(3000);
