import { PlayerCommand, Game } from "./game.js";

function handle(command) {
    switch (command.id) {
        case PlayerCommand.MOVE_DOWN:
            return handleMoveDown(command);

        case PlayerCommand.MOVE_UP:
            return handleMoveUp(command);

        case PlayerCommand.MOVE_LEFT:
            return handleMoveLeft(command);

        case PlayerCommand.MOVE_RIGHT:
            return handleMoveRight(command);

        case PlayerCommand.LEFT_GAME:
            return handlePlayerLeftGame(command);

        default:
            break;
    }
}

function handlePlayerLeftGame(command) {
    const player = Game.getPlayerById(command.playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    delete Game.players[command.playerId];

    return {
        playerId: player.id,
        command: PlayerCommand.LEFT_GAME
    }
}

function handleMoveDown(command) {
    const player = Game.getPlayerById(command.playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const pos = player.moveDownIntent();

    if (Game.collissionGrid.hasCollision(pos.x, pos.y))
        return;

    player.moveDown();

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_DOWN,
        pos: pos
    }
}

function handleMoveUp(command) {
    const player = Game.getPlayerById(command.playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const pos = player.moveUpIntent();

    if (Game.collissionGrid.hasCollision(pos.x, pos.y))
        return;

    player.moveUp();

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_UP,
        pos: pos
    }
}

function handleMoveLeft(command) {
    const player = Game.getPlayerById(command.playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const pos = player.moveLeftIntent();

    if (Game.collissionGrid.hasCollision(pos.x, pos.y))
        return;

    player.moveLeft();

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_LEFT,
        pos: pos
    }
}

function handleMoveRight(command) {
    const player = Game.getPlayerById(command.playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const pos = player.moveRightIntent();

    if (Game.collissionGrid.hasCollision(pos.x, pos.y))
        return;

    player.moveRight();

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_RIGHT,
        pos: pos
    }
}

export { handle as handleCommand }