function set_level (level_num: number) {
    scene.setBackgroundColor(13)
    tiles.loadMap(tiles.copyMap(all_levels[0]))
    for (let tile of [assets.tile`block`, assets.tile`upper_slab`, assets.tile`lower_slab`]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    spriteutils.jumpImpulse(sprite_player, 26)
})
function prepare_tilemap () {
    tiles.setTileAt(tiles.getTilesByType(assets.tile`start_tile`)[0], assets.tile`transparency8`)
}
function make_player () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Player)
    sprite_player.ay = 500
    tiles.placeOnRandomTile(sprite_player, assets.tile`start_tile`)
    scene.cameraFollowSprite(sprite_player)
}
let sprite_player: Sprite = null
let all_levels: tiles.WorldMap[] = []
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
set_level(0)
make_player()
prepare_tilemap()
game.onUpdate(function () {
    sprite_player.vx = 100
})
