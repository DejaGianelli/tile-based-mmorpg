const PlayerCommand = Object.freeze({
    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    JOIN_GAME: 'JOIN_GAME',
    LEFT_GAME: 'LEFT_GAME'
});

function Pos(args) {
    this.x = 0;
    this.y = 0;

    Object.assign(this, args);
}

function Player(args) {
    this.id;
    /**
     * Global position, not visible
     */
    this.pos = new Pos({ x: 5, y: 7 });

    Object.assign(this, args);
}

Player.prototype.moveTo = function (x, y) {
    this.pos = new Pos({ x, y });
}

Player.prototype.moveTo = function (x, y) {
    this.pos = new Pos({ x, y });
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

export { instance as Game, PlayerCommand, Player };