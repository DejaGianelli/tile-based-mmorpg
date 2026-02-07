import { createServer } from 'node:http';
import Router from 'router';
import finalhandler from 'finalhandler';

const PORT = 9000;

function startHttpServer() {
    const server = createServer();

    const router = Router();
    router.get('/', function (req, res) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('Hello World!')
    });

    server.on('listening', () => {
        console.log(`HTTP Server is listening on port ${PORT}`);
    });

    server.on('request', (req, res) => {
        router(req, res, finalhandler(req, res));
    });

    server.listen(PORT);
}

export { startHttpServer };