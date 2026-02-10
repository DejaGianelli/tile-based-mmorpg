import { SpriteIds } from "./sprites.js";

export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 36;
export const CAMERA_WIDTH = 13;
export const CAMERA_HEIGHT = 13;
export const CAMERA_CENTER_X = Math.floor(CAMERA_WIDTH / 2); // zero-based
export const CAMERA_CENTER_Y = Math.floor(CAMERA_HEIGHT / 2); // zero-based

function Tile(args) {
    this.spriteId;

    Object.assign(this, args);
}

function MapGrid(args) {
    this.tiles = [];

    // initialize full map in Grid
    for (let x = 0; x < MAP_WIDTH; x++) {
        this.tiles[x] = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            this.tiles[x][y] = null;
        }
    }

    Object.assign(this, args);
}

MapGrid.prototype.setTile = function (x, y, spriteId) {
    this.tiles[x][y] = new Tile({ spriteId })
}

const map = new MapGrid();

map.setTile(5, 5, SpriteIds.GREY_FLOOR_1);
map.setTile(6, 5, SpriteIds.GREY_FLOOR_1);
map.setTile(7, 5, SpriteIds.GREY_FLOOR_1);
map.setTile(5, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(6, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(7, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(4, 7, SpriteIds.STONE_WALL_1);
map.setTile(5, 7, SpriteIds.STONE_WALL_2);
map.setTile(6, 7, SpriteIds.STONE_WALL_3);
map.setTile(7, 7, SpriteIds.STONE_WALL_4);
map.setTile(8, 7, SpriteIds.STONE_WALL_5);



export { map as MapGrid };