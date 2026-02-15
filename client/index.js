import { PlayerCommand, Game, PlayerFacing } from "./game.js";
import { CAMERA_WIDTH, CAMERA_CENTER_X, CAMERA_CENTER_Y, MapGrid, CAMERA_HEIGHT, MAP_WIDTH, MAP_HEIGHT } from "./map.js";
import { Assets, SpriteIds, Sprites, TILE_SIZE } from "./sprites.js";

const PORT = 8080;
const SCALE = 3;
const CANVAS_WIDTH = CAMERA_WIDTH * TILE_SIZE * SCALE;
const CANVAS_HEIGHT = CAMERA_HEIGHT * TILE_SIZE * SCALE;
const SOCKET_URI = `ws://localhost:${PORT}`
const CHAR_CENTER_OFFSET = TILE_SIZE / 4;
const canvasElem = document.getElementById("canvas");

let websocket;

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

    websocket = new WebSocket(SOCKET_URI);

    websocket.addEventListener("open", (e) => {
        console.log("Connected!");
    });

    websocket.addEventListener('error', function (event) {
        console.error('WebSocket error observed:', event);
    });

    websocket.addEventListener("message", (e) => {
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
                {
                    let player;
                    if (Game.isMe(message.playerId)) {
                        player = Game.me;
                    } else {
                        player = Game.getPlayerById(message.playerId);
                    }
                    const from = message.from;
                    const to = message.to;
                    player.moveTo(from, to, message.facing);
                    MapGrid.pushPlayerInStack(to.x, to.y, player);
                    MapGrid.removePlayerFromStack(from.x, from.y, player);
                }
                break;

            case PlayerCommand.MOVE_LEFT:
                {
                    let player;
                    if (Game.isMe(message.playerId)) {
                        player = Game.me;
                    } else {
                        player = Game.getPlayerById(message.playerId);
                    }
                    const from = message.from;
                    const to = message.to;
                    player.moveTo(from, to, message.facing);
                    MapGrid.pushPlayerInStack(to.x, to.y, player);
                    MapGrid.removePlayerFromStack(from.x, from.y, player);
                }
                break;

            case PlayerCommand.MOVE_UP:
                {
                    let player;
                    if (Game.isMe(message.playerId)) {
                        player = Game.me;
                    } else {
                        player = Game.getPlayerById(message.playerId);
                    }
                    const from = message.from;
                    const to = message.to;
                    player.moveTo(from, to, message.facing);
                    MapGrid.pushPlayerInStack(to.x, to.y, player);
                    MapGrid.removePlayerFromStack(from.x, from.y, player);
                }
                break;

            case PlayerCommand.MOVE_DOWN:
                {
                    let player;
                    if (Game.isMe(message.playerId)) {
                        player = Game.me;
                    } else {
                        player = Game.getPlayerById(message.playerId);
                    }
                    const from = message.from;
                    const to = message.to;
                    player.moveTo(from, to, message.facing);
                    MapGrid.pushPlayerInStack(to.x, to.y, player);
                    MapGrid.removePlayerFromStack(from.x, from.y, player);
                }
                break;

            case PlayerCommand.AUTO_ATTACK:
                {
                    const target = Game.getPlayerById(message.targetId);
                    if (!target) {
                        return;
                    }
                    console.log(`Your attack caused ${message.damage} of damage in the player ${target.id}`);
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

    canvasElem.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const rect = canvasElem.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const globalOffsetX = (Game.me.pos.x - CAMERA_CENTER_X);
        const globalOffsetY = (Game.me.pos.y - CAMERA_CENTER_Y);
        const globalX = Math.floor((mouseX / SCALE) / TILE_SIZE) + globalOffsetX;
        const globalY = Math.floor((mouseY / SCALE) / TILE_SIZE) + globalOffsetY;
        if (!MapGrid.hasPlayer(globalX, globalY)) {
            return
        }
        const target = MapGrid.peekPlayer(globalX, globalY);
        if (!target) {
            return;
        }
        if (Game.isMe(target.id)) {
            return;
        }
        if (!target.onTarget) {
            target.onTarget = true;
            Game.autoAttackInterval = setInterval(autoAttack, 1500, target);
        } else {
            target.onTarget = false;
            clearInterval(Game.autoAttackInterval);
        }
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
    });

    window.addEventListener('beforeunload', function (event) {
        const data = {
            id: PlayerCommand.LEFT_GAME,
            playerId: Game.me.id
        };
        websocket.send(JSON.stringify(data));
        Game.leave();
    });

    requestAnimationFrame(gameLoop);
}

let lastTime = 0; // in seconds

function gameLoop(time) {

    const dt = (time - lastTime) / 1000;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!Game.me) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const me = Game.me;

    handlePlayerMoveProgress(dt, me);

    const interp = calcPlayerPosInterpolation(me);

    const meCameraOffsetX = interp.x - CAMERA_CENTER_X;
    const meCameraOffsetY = interp.y - CAMERA_CENTER_Y;

    // Draw Scenario
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {

            const tile = MapGrid.tiles[x][y];
            if (!tile) continue;

            const sprite = Sprites[tile.spriteId];

            ctx.drawImage(
                tilesetImg,
                sprite.x, sprite.y,
                sprite.size, sprite.size,
                (x - meCameraOffsetX) * TILE_SIZE,
                (y - meCameraOffsetY) * TILE_SIZE,
                sprite.size, sprite.size
            );
        }
    }

    // Draw myself
    let sprite = getCharacterFacingSprite(Game.me);

    ctx.drawImage(characterImg, sprite.x, sprite.y,
        sprite.size, sprite.size,
        CAMERA_CENTER_X * TILE_SIZE, CAMERA_CENTER_Y * TILE_SIZE - CHAR_CENTER_OFFSET,
        sprite.size, sprite.size);

    // Draw players
    const players = Game.playersList();

    for (let player of players) {

        let sprite = getCharacterFacingSprite(player);

        handlePlayerMoveProgress(dt, player);

        const interp = calcPlayerPosInterpolation(player);

        // Draw Target
        if (player.onTarget) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.lineWidth = 1; // Optional
            ctx.beginPath();
            ctx.rect(
                (interp.x - meCameraOffsetX) * TILE_SIZE,
                (interp.y - meCameraOffsetY) * TILE_SIZE,
                TILE_SIZE, TILE_SIZE);
            ctx.stroke();
        }

        ctx.drawImage(
            characterImg,
            sprite.x, sprite.y,
            sprite.size, sprite.size,
            (interp.x - meCameraOffsetX) * TILE_SIZE,
            (interp.y - meCameraOffsetY) * TILE_SIZE - CHAR_CENTER_OFFSET,
            sprite.size, sprite.size
        );
    }

    requestAnimationFrame(gameLoop);
}

function handlePlayerMoveProgress(dt, player) {
    if (!player.moving) return;

    if (player.lastPos.x !== player.pos.x) {
        player.progressX += player.speed * dt;
    }

    if (player.lastPos.y !== player.pos.y) {
        player.progressY += player.speed * dt;
    }

    // Clamp progress
    if (player.progressX > 1) player.progressX = 1;
    if (player.progressY > 1) player.progressY = 1;

    // End movement
    if (player.progressX === 1 || player.progressY === 1) {
        player.moving = false;
    }
}

function getCharacterFacingSprite(player) {
    let sprite = Sprites[SpriteIds.CHARACTER_DOWN];
    switch (player.facing) {
        case PlayerFacing.DOWN:
            {
                return Sprites[SpriteIds.CHARACTER_DOWN];
            }
            break;
        case PlayerFacing.LEFT:
            {
                return Sprites[SpriteIds.CHARACTER_LEFT];
            }
            break;
        case PlayerFacing.UP:
            {
                return Sprites[SpriteIds.CHARACTER_UP];
            }
            break;
    }
    return sprite;
}

function calcPlayerPosInterpolation(player) {
    let interpX = player.pos.x;
    let interpY = player.pos.y;
    if (player.moving) {
        interpX = player.lastPos.x + (player.pos.x - player.lastPos.x) * player.progressX;
        interpY = player.lastPos.y + (player.pos.y - player.lastPos.y) * player.progressY;
    }
    return {
        x: interpX, y: interpY
    }
}

function autoAttack(target) {
    const data = {
        id: PlayerCommand.AUTO_ATTACK,
        playerId: Game.me.id,
        target: target.id
    };
    websocket.send(JSON.stringify(data));
    console.log(`Attack player ${target.id} at X: ${target.pos.x}, Y: ${target.pos.y}`);
}

init();