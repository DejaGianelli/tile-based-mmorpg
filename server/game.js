const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;

const PlayerCommand = Object.freeze({
    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    JOIN_GAME: 'JOIN_GAME',
    LEFT_GAME: 'LEFT_GAME'
});

const COLLISION_TYPES = {
    WALKABLE: 0b0,   // 0 - Can Walk Through
    BLOCKED: 0b1,   // 1 - Solid, can't pass
};

function CollissionGrid() {
    this.width = MAP_WIDTH;
    this.height = MAP_HEIGHT;
    /**
     * 1 bit = 2 States, walkable or not
     */
    this.bitsPerTile = 1;

    const tiles = this.width * this.height;

    /**
     * Data represents the game map collision grid in a form of an linear array 
     * of bits. For bitsPerTile equals 1, each byte can store collission for 
     * 8 tiles.
     */
    this.data = new Uint8Array(Math.ceil((tiles * this.bitsPerTile) / 8));

    for (let i = 0; i < this.data.length; i++) {
        this.data[i] = 0b11111111; // All blocked by default
    }

    this.setCollission(4, 6, COLLISION_TYPES.WALKABLE);
    this.setCollission(5, 6, COLLISION_TYPES.WALKABLE);
    this.setCollission(6, 6, COLLISION_TYPES.WALKABLE);
    this.setCollission(4, 7, COLLISION_TYPES.WALKABLE);
    this.setCollission(5, 7, COLLISION_TYPES.WALKABLE);
    this.setCollission(6, 7, COLLISION_TYPES.WALKABLE);
}

/**
 * 
 * @param {int} x x position (zero-based)
 * @param {int} y y position (zero-based)
 * @param {COLLISION_TYPES} type 
 */
CollissionGrid.prototype.setCollission = function (x, y, type) {
    const index = y * this.width + x;
    const bitIndex = index % 8;
    const byteIndex = Math.floor(index / 8);
    switch (type) {
        case COLLISION_TYPES.WALKABLE:
            this.data[byteIndex] = this.data[byteIndex] & ~(1 << bitIndex);
            break;
        case COLLISION_TYPES.BLOCKED:
            this.data[byteIndex] = this.data[byteIndex] | (1 << bitIndex);
            break;
        default:
            break;
    }
}

CollissionGrid.prototype.hasCollision = function (x, y) {
    const index = y * this.width + x;
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;

    return (this.data[byteIndex] & (1 << bitIndex)) !== 0;
}

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
};

Player.prototype.moveUp = function () {
    this.pos.y--;
}

Player.prototype.moveUpIntent = function () {
    return new Pos({ x: this.pos.x, y: this.pos.y - 1 });
}

Player.prototype.moveDown = function () {
    this.pos.y++;
}

Player.prototype.moveDownIntent = function () {
    return new Pos({ x: this.pos.x, y: this.pos.y + 1 });
}

Player.prototype.moveLeft = function () {
    this.pos.x--;
}

Player.prototype.moveLeftIntent = function () {
    return new Pos({ x: this.pos.x - 1, y: this.pos.y });
}

Player.prototype.moveRight = function () {
    this.pos.x++;
}

Player.prototype.moveRightIntent = function () {
    return new Pos({ x: this.pos.x + 1, y: this.pos.y });
}

function Game() {
    this.players = {}
    this.collissionGrid = new CollissionGrid();
};

/**
 * Join a player into the game
 * @param {string} playerId UUID
 * @returns void
 */
Game.prototype.joinPlayer = function (playerId) {
    this.players[playerId] = new Player({ id: playerId });
}

/**
 * Remove player from the game
 * @param {string} playerId UUID
 * @returns void
 */
Game.prototype.removePlayer = function (playerId) {
    delete this.players[playerId];
}

/**
 * Returns a logged player by its id
 * @param {string} playerId UUID
 * @returns Player
 */
Game.prototype.getPlayerById = function (playerId) {
    return this.players[playerId];
}

Game.prototype.allPlayersExcept = function (playerId) {
    const clone = Object.assign({}, this.players);
    delete clone[playerId];
    return clone;
}

const instance = new Game();

export { instance as Game, PlayerCommand };