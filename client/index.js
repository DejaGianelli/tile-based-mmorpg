import { PlayerCommand, Game } from "./game.js";
import { CENTER_POS_X, CENTER_POS_Y, MapGrid, VISIBLE_HEIGTH, VISIBLE_WIDTH } from "./map.js";
import { Assets, SpriteIds, Sprites, TILE_SIZE } from "./sprites.js";

const PORT = 8080;
const SCALE = 3;
const CANVAS_WIDTH = VISIBLE_WIDTH * TILE_SIZE * SCALE;
const CANVAS_HEIGHT = VISIBLE_HEIGTH * TILE_SIZE * SCALE;
const SOCKET_URI = `ws://localhost:${PORT}`

const canvasElem = document.getElementById("canvas");

const ctx = canvasElem.getContext("2d");

canvasElem.width = CANVAS_WIDTH;
canvasElem.height = CANVAS_HEIGHT;

ctx.scale(SCALE, SCALE);

const tilesetImg = new Image();
const tilesetImgPromise = new Promise((resolve, _) => {
    tilesetImg.src = Assets.TILESET;
    tilesetImg.addEventListener("load", () => {
        resolve();
    });
});

const characterImg = new Image();
const characterImgPromise = new Promise((resolve, _) => {
    characterImg.src = Assets.CHARACTER;
    characterImg.addEventListener("load", () => {
        resolve();
    });
});

async function loadAssets() {
    return Promise.allSettled([tilesetImgPromise, characterImgPromise]);
}

async function init() {

    await loadAssets();

    const websocket = new WebSocket(SOCKET_URI);

    websocket.addEventListener("open", (e) => {
        console.log("Connected!");
    });

    websocket.addEventListener('error', function (event) {
        console.error('WebSocket error observed:', event);
    });

    websocket.addEventListener("message", (e) => {
        //console.log(e.data);
        const message = JSON.parse(e.data);
        switch (message.command) {
            case PlayerCommand.LEFT_GAME:
                delete Game.players[message.playerId];
                console.log(`Player ${message.playerId} left the game`);
                break;
            case PlayerCommand.JOIN_GAME:
                if (!Game.me) {
                    Game.joinMyself(message.playerId);
                    Game.setPlayers(message.players);
                } else {
                    Game.joinPlayer(message.playerId);
                }
                console.log(`Player ${message.playerId} connected`);
                break;

            case PlayerCommand.MOVE_RIGHT:
                if (Game.isMe(message.playerId)) {
                    Game.me.moveTo(message.pos.x, message.pos.y);
                } else {
                    const player = Game.getPlayerById(message.playerId);
                    player.moveTo(message.pos.x, message.pos.y);
                }
                break;

            case PlayerCommand.MOVE_LEFT:
                if (Game.isMe(message.playerId)) {
                    Game.me.moveTo(message.pos.x, message.pos.y);
                } else {
                    const player = Game.getPlayerById(message.playerId);
                    player.moveTo(message.pos.x, message.pos.y);
                }
                break;

            case PlayerCommand.MOVE_UP:
                if (Game.isMe(message.playerId)) {
                    Game.me.moveTo(message.pos.x, message.pos.y);
                } else {
                    const player = Game.getPlayerById(message.playerId);
                    player.moveTo(message.pos.x, message.pos.y);
                }
                break;

            case PlayerCommand.MOVE_DOWN:
                if (Game.isMe(message.playerId)) {
                    Game.me.moveTo(message.pos.x, message.pos.y);
                } else {
                    const player = Game.getPlayerById(message.playerId);
                    player.moveTo(message.pos.x, message.pos.y);
                }
                break;

            default:
                break;
        }
    });

    websocket.addEventListener('close', (e) => {
        Game.leave();
        console.log('WebSocket connection closed:', e.code, e.reason);
    });

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case "ArrowRight":
                {
                    const data = {
                        id: PlayerCommand.MOVE_RIGHT,
                        playerId: Game.me.id
                    };
                    websocket.send(JSON.stringify(data));
                    break;
                }

            case "ArrowLeft":
                {
                    const data = {
                        id: PlayerCommand.MOVE_LEFT,
                        playerId: Game.me.id
                    };
                    websocket.send(JSON.stringify(data));
                    break;
                }

            case "ArrowUp":
                {
                    const data = {
                        id: PlayerCommand.MOVE_UP,
                        playerId: Game.me.id
                    };
                    websocket.send(JSON.stringify(data));
                    break;
                }

            case "ArrowDown":
                {
                    const data = {
                        id: PlayerCommand.MOVE_DOWN,
                        playerId: Game.me.id
                    };
                    websocket.send(JSON.stringify(data));
                    break;
                }
            default:
                break;
        }
        //console.log(`Player position [${Game.me.pos.x}, ${Game.me.pos.y}]`);
    });

    window.addEventListener('beforeunload', function (event) {
        const data = {
            id: PlayerCommand.LEFT_GAME,
            playerId: Game.me.id
        };
        websocket.send(JSON.stringify(data));
        Game.leave();
    });

    requestAnimationFrame(draw);
}

function draw() {

    ctx.fillStyle = "grey";

    if (!Game.me) {
        requestAnimationFrame(draw);
        return;
    }

    // Draw scenario
    for (let x = 0; x < VISIBLE_WIDTH; x++) {
        for (let y = 0; y < VISIBLE_HEIGTH; y++) {

            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            ctx.strokeStyle = "black";
            ctx.lineWidth = 0.1;
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            const tx = x + (Game.me.pos.x - CENTER_POS_X);
            const ty = y + (Game.me.pos.y - CENTER_POS_Y);

            if (tx < 0 || ty < 0) {
                continue;
            }

            const tile = MapGrid.tiles[tx][ty];

            if (tile) {
                const spriteId = tile.spriteId;
                const sprite = Sprites[spriteId];
                ctx.drawImage(tilesetImg, sprite.x, sprite.y,
                    sprite.size, sprite.size,
                    x * TILE_SIZE, y * TILE_SIZE,
                    sprite.size, sprite.size);
            }
        }
    }

    const sprite = Sprites[SpriteIds.CHARACTER_1];
    const charOffsetY = (TILE_SIZE / 4);

    // Draw myself
    ctx.drawImage(characterImg, sprite.x, sprite.y,
        sprite.size, sprite.size,
        CENTER_POS_X * TILE_SIZE, CENTER_POS_Y * TILE_SIZE - charOffsetY,
        sprite.size, sprite.size);

    // Draw players
    const players = Game.playersList();
    for (let player of players) {

        // Position relative to myself
        const x = CENTER_POS_X - (Game.me.pos.x - player.pos.x);
        const y = CENTER_POS_Y - (Game.me.pos.y - player.pos.y);

        ctx.drawImage(characterImg, sprite.x, sprite.y,
            sprite.size, sprite.size,
            x * TILE_SIZE, y * TILE_SIZE - charOffsetY,
            sprite.size, sprite.size);
    }

    requestAnimationFrame(draw);
}

init();