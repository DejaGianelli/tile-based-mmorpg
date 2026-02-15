const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;

const PlayerCommand = Object.freeze({
    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    JOIN_GAME: 'JOIN_GAME',
    LEFT_GAME: 'LEFT_GAME',
    AUTO_ATTACK: 'AUTO_ATTACK'
});

const PlayerFacing = Object.freeze({
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
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

    this.setCollission(5, 5, COLLISION_TYPES.WALKABLE);
    this.setCollission(6, 5, COLLISION_TYPES.WALKABLE);
    this.setCollission(7, 5, COLLISION_TYPES.WALKABLE);
    this.setCollission(5, 6, COLLISION_TYPES.WALKABLE);
    this.setCollission(6, 6, COLLISION_TYPES.WALKABLE);
    this.setCollission(7, 6, COLLISION_TYPES.WALKABLE);
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
    this.pos = new Pos({ x: 6, y: 6 }); // Global Position
    this.facing = PlayerFacing.UP;
    this.life = 100;

    Object.assign(this, args);
};

Player.prototype.moveUp = function () {
    this.pos.y--;
    this.facing = PlayerFacing.UP;
}

Player.prototype.moveUpIntent = function () {
    return new Pos({ x: this.pos.x, y: this.pos.y - 1 });
}

Player.prototype.moveDown = function () {
    this.pos.y++;
    this.facing = PlayerFacing.DOWN;
}

Player.prototype.moveDownIntent = function () {
    return new Pos({ x: this.pos.x, y: this.pos.y + 1 });
}

Player.prototype.moveLeft = function () {
    this.pos.x--;
    this.facing = PlayerFacing.LEFT;
}

Player.prototype.moveLeftIntent = function () {
    return new Pos({ x: this.pos.x - 1, y: this.pos.y });
}

Player.prototype.moveRight = function () {
    this.pos.x++;
    this.facing = PlayerFacing.RIGHT;
}

Player.prototype.moveRightIntent = function () {
    return new Pos({ x: this.pos.x + 1, y: this.pos.y });
}

Player.prototype.attack = function (target) {
    const targetLife = target.life;
    const damage = 10; //Hardcoded for now
    target.life -= damage;
    return {
        damage: damage
    }
}

function Tile(args) {
    this.players = []; // Stack of players in currently in this tile. playerId => Player

    Object.assign(this, args);
}

function Game() {
    this.players = {}
    this.collissionGrid = new CollissionGrid();
    this.tiles = []; // Map of tiles

    // initialize tiles Grid
    for (let x = 0; x < MAP_WIDTH; x++) {
        this.tiles[x] = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            this.tiles[x][y] = new Tile();
        }
    }
};

Game.prototype.pushPlayerInStack = function (x, y, player) {
    this.tiles[x][y].players.push(player);
}

Game.prototype.removePlayerFromStack = function (x, y, player) {
    this.tiles[x][y].players = this.tiles[x][y].players
        .filter(p => p.id != player.id);
}

Game.prototype.hasPlayer = function (x, y) {
    const players = this.tiles[x][y].players;
    if (players.length == 0)
        return false;
    return true;
}

Game.prototype.peekPlayer = function (x, y) {
    if (!this.hasPlayer(x, y)) {
        return null;
    }
    const players = this.tiles[x][y].players;
    return players[players.length - 1];
}

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

export { instance as Game, PlayerCommand, Pos };