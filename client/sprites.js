export const Assets = Object.freeze({
    TILESET: 'assets/Tileset.png',
    CHARACTER: 'assets/Character.png'
});

export const TILE_SIZE = 16;

export const SpriteIds = Object.freeze({
    STONE_WALL_1: 1,
    STONE_WALL_2: 2,
    STONE_WALL_3: 3,
    STONE_WALL_4: 4,
    GREY_FLOOR_1: 5,
    CHARACTER_1: 6,
    STONE_WALL_5: 7,
});

function Sprite(args) {
    this.id;
    this.asset;
    this.x;
    this.y;
    this.size;

    Object.assign(this, args);
}

function stoneWall1() {
    return new Sprite({
        id: SpriteIds.STONE_WALL_1,
        asset: Assets.TILESET,
        x: 16,
        y: 80,
        size: TILE_SIZE
    });
}

function stoneWall2() {
    return new Sprite({
        id: SpriteIds.STONE_WALL_2,
        asset: Assets.TILESET,
        x: 32,
        y: 80,
        size: TILE_SIZE
    });
}

function stoneWall3() {
    return new Sprite({
        id: SpriteIds.STONE_WALL_3,
        asset: Assets.TILESET,
        x: 48,
        y: 80,
        size: TILE_SIZE
    });
}

function stoneWall4() {
    return new Sprite({
        id: SpriteIds.STONE_WALL_4,
        asset: Assets.TILESET,
        x: 64,
        y: 80,
        size: TILE_SIZE
    });
}

function stoneWall5() {
    return new Sprite({
        id: SpriteIds.STONE_WALL_5,
        asset: Assets.TILESET,
        x: 80,
        y: 80,
        size: TILE_SIZE
    });
}

function greyFloor1() {
    return new Sprite({
        id: SpriteIds.GREY_FLOOR_1,
        asset: Assets.TILESET,
        x: 144,
        y: 48,
        size: TILE_SIZE
    });
}

function character1() {
    return new Sprite({
        id: SpriteIds.CHARACTER_1,
        asset: Assets.TILESET,
        x: 8,
        y: 5,
        size: TILE_SIZE
    });
}

export const Sprites = {
    1: stoneWall1(),
    2: stoneWall2(),
    3: stoneWall3(),
    4: stoneWall4(),
    5: greyFloor1(),
    6: character1(),
    7: stoneWall5(),
}