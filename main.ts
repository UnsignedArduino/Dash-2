function set_level (level_num: number) {
    scene.setBackgroundColor(13)
    tiles.loadMap(tiles.copyMap(all_levels[0]))
    for (let tile of [assets.tile`block`, assets.tile`upper_slab`, assets.tile`lower_slab`]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
}
function prepare_tilemap () {
    tiles.setTileAt(tiles.getTilesByType(assets.tile`start_tile`)[0], assets.tile`transparency8`)
}
function make_camera () {
    sprite_camera = sprites.create(assets.image`blank_px`, SpriteKind.Player)
    sprite_camera.setFlag(SpriteFlag.Ghost, true)
    sprite_camera.setFlag(SpriteFlag.Invisible, true)
    sprite_camera.vx = 100
    scene.cameraFollowSprite(sprite_camera)
    tiles.placeOnRandomTile(sprite_camera, assets.tile`start_tile`)
}
function make_player () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Player)
    sprite_player.ay = 500
    sprite_player.vx = 100
    tiles.placeOnRandomTile(sprite_player, assets.tile`start_tile`)
}
let sprite_player: Sprite = null
let sprite_camera: Sprite = null
let all_levels: tiles.WorldMap[] = []
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
set_level(0)
make_player()
make_camera()
prepare_tilemap()
game.onUpdate(function () {
    sprite_player.vx = 100
})
