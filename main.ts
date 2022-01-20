scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        jump_count = 0
    }
})
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
    if (in_game) {
        if (jump_count < MAX_JUMPS) {
            spriteutils.jumpImpulse(sprite_player, 26)
            jump_count += 1
            timer.background(function () {
                for (let image2 of player_rotations) {
                    sprite_player.setImage(image2)
                    pause(20)
                }
            })
        }
    }
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
    player_rotations = scaling.createRotations(sprite_player.image, 10)
    player_rotations.push(assets.image`player`)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_right0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_right0`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_up0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_up0`)
})
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    timer.after(1000, function () {
        set_level(curr_level)
        make_player()
        prepare_tilemap()
    })
})
let player_rotations: Image[] = []
let sprite_player: Sprite = null
let curr_level = 0
let in_game = false
let all_levels: tiles.WorldMap[] = []
let jump_count = 0
let MAX_JUMPS = 0
MAX_JUMPS = 2
jump_count = 0
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
in_game = false
set_level(0)
make_player()
prepare_tilemap()
in_game = true
game.onUpdate(function () {
    if (in_game) {
        sprite_player.vx = 100
    }
})
