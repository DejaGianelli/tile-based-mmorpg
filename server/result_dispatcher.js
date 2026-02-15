import { WebSocket } from "ws";
import { PlayerCommand } from "./game.js";
import { wss } from "./websocket.js";

function dispatch(result, ws) {
    switch (result.command) {
        case PlayerCommand.MOVE_DOWN:
            dispatchMoveDownResult(result);
            break;

        case PlayerCommand.MOVE_UP:
            dispatchMoveUpResult(result);
            break;

        case PlayerCommand.MOVE_LEFT:
            dispatchMoveLeftResult(result);
            break;

        case PlayerCommand.MOVE_RIGHT:
            dispatchMoveRightResult(result);
            break;

        case PlayerCommand.JOIN_GAME:
            dispatchPlayerJoinedGameResult(result);
            break;

        case PlayerCommand.LEFT_GAME:
            dispatchPlayerLeftGameResult(result);
            break;

        case PlayerCommand.AUTO_ATTACK:
            dispatchPlayerAutoAttackResult(result);
            break;

        default:
            break;
    }
}

function broadcast(result) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            const data = Buffer.from(JSON.stringify(result));
            client.send(data, { binary: false });
        }
    });
}

function dispatchPlayerAutoAttackResult(result) {
    broadcast(result);
}

function dispatchPlayerLeftGameResult(result) {
    broadcast(result);
}

function dispatchPlayerJoinedGameResult(result) {
    broadcast(result);
}

function dispatchMoveDownResult(result) {
    broadcast(result);
}

function dispatchMoveUpResult(result) {
    broadcast(result);
}

function dispatchMoveLeftResult(result) {
    broadcast(result);
}

function dispatchMoveRightResult(result) {
    broadcast(result);
}

export { dispatch as dispatchResult }