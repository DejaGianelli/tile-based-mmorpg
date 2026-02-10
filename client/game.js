const PlayerCommand = Object.freeze({
    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    JOIN_GAME: 'JOIN_GAME',
    LEFT_GAME: 'LEFT_GAME'
});

const PlayerFacing = Object.freeze({
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

/**
  * Global position in the map
  */
function Pos(args) {
    this.x = 0;
    this.y = 0;

    Object.assign(this, args);
}

function Player(args) {
    this.id;
    this.pos;
    this.lastPos;
    this.facing = PlayerFacing.DOWN;
    this.moving = false;
    this.progressY = 0;
    this.progressX = 0;
    this.speed = 5;

    this.pos = this.lastPos = new Pos({ x: 6, y: 6 });

    Object.assign(this, args);
}

Player.prototype.moveTo = function (x, y) {
    this.pos = new Pos({ x, y });
}

Player.prototype.moveTo = function (from, to, facing) {
    this.moving = true;
    this.facing = facing;
    this.progressY = 0;
    this.progressX = 0;
    this.pos = to;
    this.lastPos = from;
}

function Game() {
    this.me = undefined;
    this.players = {}
};

Game.prototype.playersList = function () {
    return Object.entries(this.players)
        .map(([_, value]) => { return value; });
}

Game.prototype.isMe = function (playerId) {
    return playerId == this.me.id;
}

Game.prototype.joinMyself = function (playerId) {
    const player = new Player({ id: playerId });
    this.me = player;
}

Game.prototype.setPlayers = function (players) {
    this.players = {};
    Object.entries(players).forEach(([key, value]) => {
        this.players[key] = new Player(value);
    });
}

Game.prototype.joinPlayer = function (playerId) {
    if (this.id == playerId) {
        throw Error("Use joinMyself function");
    }
    const player = new Player({ id: playerId });
    this.players[playerId] = player;
}

Game.prototype.leave = function () {
    this.me = undefined;
}

Game.prototype.getPlayerById = function (playerId) {
    return this.players[playerId];
}

const instance = new Game();

export { instance as Game, PlayerCommand, PlayerFacing, Player };