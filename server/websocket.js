import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { Game, PlayerCommand } from './game.js';
import { handleCommand } from './command_handler.js';
import { dispatchResult } from './result_dispatcher.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

function startWebSocketServer() {

    wss.on('listening', function () {
        console.log(`Websocket Server is listening on port ${PORT}`);
    });

    wss.on('connection', function connection(ws, req) {

        ws.id = randomUUID();

        console.log(`Client ${ws.id} connected`);

        Game.joinPlayer(ws.id);

        const result = {
            command: PlayerCommand.JOIN_GAME,
            playerId: ws.id,
            players: Game.allPlayersExcept(ws.id)
        };

        dispatchResult(result);

        ws.on('message', function message(data) {
            //console.log('received: %s', data);
            const ws = this;
            const command = JSON.parse(data);
            const result = handleCommand(command);
            if (result) {
                dispatchResult(result, ws);
            }
        });

        ws.on('close', function () {
            Game.removePlayer(this.id);
            console.log(`Client ${this.id} disconnected`);
        });
    });
}

export { startWebSocketServer };