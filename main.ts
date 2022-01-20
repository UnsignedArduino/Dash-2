scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        jump_count = 0
    }
})
function make_player_image () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Player)
    sprite_player.setFlag(SpriteFlag.Ghost, true)
    sprite_player.setFlag(SpriteFlag.Invisible, false)
    player_rotations = scaling.createRotations(sprite_player.image, 10)
    player_rotations.push(assets.image`player`)
}
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
            spriteutils.jumpImpulse(sprite_player_hitbox, 26)
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
    sprite_player_hitbox = sprites.create(assets.image`player_hitbox`, SpriteKind.Player)
    sprite_player_hitbox.ay = 500
    sprite_player_hitbox.setFlag(SpriteFlag.Invisible, true)
    tiles.placeOnRandomTile(sprite_player_hitbox, assets.tile`start_tile`)
    scene.cameraFollowSprite(sprite_player_hitbox)
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
let sprite_player_hitbox: Sprite = null
let curr_level = 0
let player_rotations: Image[] = []
let sprite_player: Sprite = null
let in_game = false
let all_levels: tiles.WorldMap[] = []
let jump_count = 0
let MAX_JUMPS = 0
stats.turnStats(true)
MAX_JUMPS = 2
jump_count = 0
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
in_game = false
set_level(0)
make_player()
make_player_image()
prepare_tilemap()
in_game = true
game.onUpdate(function () {
    if (in_game) {
        sprite_player_hitbox.vx = 100
        if (!(spriteutils.isDestroyed(sprite_player_hitbox))) {
            spriteutils.placeAngleFrom(
            sprite_player,
            0,
            0,
            sprite_player_hitbox
            )
            sprite_player.setFlag(SpriteFlag.Invisible, false)
        } else {
            sprite_player.setFlag(SpriteFlag.Invisible, true)
        }
    }
})
