import { PlayerCommand, Game, Pos } from "./game.js";

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

        case PlayerCommand.AUTO_ATTACK:
            return handlePlayerAutoAttack(command);

        default:
            break;
    }
}

function handlePlayerAutoAttack(command) {
    const player = Game.getPlayerById(command.playerId);
    const target = Game.getPlayerById(command.target);

    if (!player) {
        throw new Error("Player not found");
    }

    if (!target) {
        return;
    }

    const rangeX = Math.abs(target.pos.x - player.pos.x);
    const rangeY = Math.abs(target.pos.y - player.pos.y);

    if (rangeX > 6 || rangeY > 6) {
        console.log(`Player ${target.id} is out of range`);
        return;
    }

    const result = player.attack(target);

    if (result.targetLife <= 0) {
        target.dead = true;
    }

    console.log(`Player ${target.id} life is ${target.life}`);

    return {
        playerId: player.id,
        command: PlayerCommand.AUTO_ATTACK,
        targetId: target.id,
        damage: result.damage,
        isDead: target.dead
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

    const currPos = new Pos(player.pos);
    player.moveDown();
    Game.removePlayerFromStack(currPos.x, currPos.y, player);
    Game.pushPlayerInStack(player.pos.x, player.pos.y, player);

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_DOWN,
        facing: player.facing,
        from: currPos,
        to: player.pos
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

    const currPos = new Pos(player.pos);
    player.moveUp();
    Game.removePlayerFromStack(currPos.x, currPos.y, player);
    Game.pushPlayerInStack(player.pos.x, player.pos.y, player);

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_UP,
        facing: player.facing,
        from: currPos,
        to: player.pos
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

    const currPos = new Pos(player.pos);
    player.moveLeft();
    Game.removePlayerFromStack(currPos.x, currPos.y, player);
    Game.pushPlayerInStack(player.pos.x, player.pos.y, player);

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        facing: player.facing,
        command: PlayerCommand.MOVE_LEFT,
        from: currPos,
        to: player.pos
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

    const currPos = new Pos(player.pos);
    player.moveRight();
    Game.removePlayerFromStack(currPos.x, currPos.y, player);
    Game.pushPlayerInStack(player.pos.x, player.pos.y, player);

    console.info(`Player ${command.playerId} is in position [${player.pos.x}, ${player.pos.y}]`);

    return {
        playerId: player.id,
        command: PlayerCommand.MOVE_RIGHT,
        facing: player.facing,
        from: currPos,
        to: player.pos
    }
}

export { handle as handleCommand }