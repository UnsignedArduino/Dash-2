namespace SpriteKind {
    export const End = SpriteKind.create()
}
namespace StatusBarKind {
    export const Progress = StatusBarKind.create()
}
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
    won = false
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
    sprite_flag = sprites.create(assets.image`flag`, SpriteKind.End)
    tiles.placeOnRandomTile(sprite_flag, assets.tile`end_tile`)
    tiles.setTileAt(tiles.getTilesByType(assets.tile`end_tile`)[0], assets.tile`transparency8`)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.End, function (sprite, otherSprite) {
    sprite.ay = 0
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
    won = true
})
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
    sprite_player_hitbox.setFlag(SpriteFlag.Invisible, true)
    if (true) {
        sprite_player_hitbox.ay = 500
    } else {
        sprite_player_hitbox.setFlag(SpriteFlag.Ghost, true)
    }
    tiles.placeOnRandomTile(sprite_player_hitbox, assets.tile`start_tile`)
    scene.cameraFollowSprite(sprite_player_hitbox)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_right0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_right0`)
})
function wait_for_select () {
    menu_selected = false
    while (!(menu_selected)) {
        pause(1)
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_up0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_up0`)
})
function make_map_progress_bar () {
    sprite_map_progress = statusbars.create(scene.screenWidth() - 4, 4, StatusBarKind.Progress)
    sprite_map_progress.value = 0
    sprite_map_progress.max = tiles.tilemapColumns() * tiles.tileWidth()
    sprite_map_progress.setColor(12, 11)
    sprite_map_progress.setBarBorder(1, 12)
    sprite_map_progress.top = 2
    sprite_map_progress.left = 2
    sprite_map_progress.setFlag(SpriteFlag.Ghost, true)
    sprite_map_progress.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
}
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    if (won) {
        timer.after(1000, function () {
            game.over(true)
        })
    } else {
        timer.after(1000, function () {
            in_game = false
            sprite_map_progress.value = sprite_player_hitbox.right
            sprite_map_progress.setFlag(SpriteFlag.Invisible, false)
            blockMenu.showMenu(["Try again", "Exit"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            blockMenu.closeMenu()
            if (blockMenu.selectedMenuIndex() == 0) {
                set_level(curr_level)
                make_player()
                prepare_tilemap()
                in_game = true
            }
            sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
        })
    }
})
blockMenu.onMenuOptionSelected(function (option, index) {
    menu_selected = true
})
let sprite_map_progress: StatusBarSprite = null
let menu_selected = false
let sprite_flag: Sprite = null
let sprite_player_hitbox: Sprite = null
let curr_level = 0
let player_rotations: Image[] = []
let sprite_player: Sprite = null
let won = false
let in_game = false
let all_levels: tiles.WorldMap[] = []
let jump_count = 0
let MAX_JUMPS = 0
stats.turnStats(true)
MAX_JUMPS = 2
jump_count = 0
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
in_game = false
won = false
blockMenu.setColors(12, 11)
set_level(0)
make_player()
make_player_image()
make_map_progress_bar()
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
