scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_left`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_left`)
})
function set_level (level_num: number) {
    curr_level = level_num
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
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_down0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_down0`)
})
function destroy_if_on_tile (sprite: Sprite, tile: Image) {
    if (spriteutils.isDestroyed(sprite)) {
        return
    }
    if (sprite.tileKindAt(TileDirection.Center, tile)) {
        sprite.destroy(effects.spray, 100)
    }
}
function make_player () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Player)
    sprite_player.ay = 500
    tiles.placeOnRandomTile(sprite_player, assets.tile`start_tile`)
    scene.cameraFollowSprite(sprite_player)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_right0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_right0`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_up0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_up0`)
})
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    timer.after(500, function () {
        set_level(curr_level)
        make_player()
        prepare_tilemap()
    })
})
let sprite_player: Sprite = null
let curr_level = 0
let all_levels: tiles.WorldMap[] = []
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
set_level(0)
make_player()
prepare_tilemap()
game.onUpdate(function () {
    sprite_player.vx = 100
})
