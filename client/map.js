import { SpriteIds } from "./sprites.js";

const MAP_WIDTH = 40;
const MAP_HEIGHT = 36;
export const VISIBLE_WIDTH = 13;
export const VISIBLE_HEIGTH = 12;
export const CENTER_POS_X = Math.floor(VISIBLE_WIDTH / 2);
export const CENTER_POS_Y = Math.floor(VISIBLE_HEIGTH / 2);

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

map.setTile(4, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(5, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(6, 6, SpriteIds.GREY_FLOOR_1);
map.setTile(4, 7, SpriteIds.GREY_FLOOR_1);
map.setTile(5, 7, SpriteIds.GREY_FLOOR_1);
map.setTile(6, 7, SpriteIds.GREY_FLOOR_1);
map.setTile(3, 8, SpriteIds.STONE_WALL_1);
map.setTile(4, 8, SpriteIds.STONE_WALL_2);
map.setTile(5, 8, SpriteIds.STONE_WALL_3);
map.setTile(6, 8, SpriteIds.STONE_WALL_4);
map.setTile(7, 8, SpriteIds.STONE_WALL_5);



export { map as MapGrid };