import { startHttpServer } from "./http.js";
import { startWebSocketServer } from "./websocket.js";

function init() {
    startWebSocketServer();
    startHttpServer();
}

init();