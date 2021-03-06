namespace SpriteKind {
    export const End = SpriteKind.create()
    export const Image = SpriteKind.create()
}
namespace StatusBarKind {
    export const Progress = StatusBarKind.create()
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (upside_down) {
        if (sprite.isHittingTile(CollisionDirection.Top)) {
            jump_count = 0
        }
    } else {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            jump_count = 0
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`down_gravity`, function (sprite, location) {
    set_gravity(true)
})
function set_gravity (up: boolean) {
    if (upside_down != up) {
        return
    }
    upside_down = !(up)
    if (up) {
        sprite_player_hitbox.ay = GRAVITY
    } else {
        sprite_player_hitbox.ay = GRAVITY * -1
    }
    update_player_visuals()
    fade_for_gravity(up, false)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_left`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_left`)
})
function teleport_player (tile: Image) {
    tiles.placeOnRandomTile(sprite_player_hitbox, tile)
}
function update_player_visuals () {
    if (!(upside_down)) {
        sprite_player.setImage(assets.image`player`)
    } else {
        sprite_player.setImage(assets.image`player_flipped`)
    }
    sprite_player_wings.setFlag(SpriteFlag.Invisible, mode == 0)
}
function make_player_visuals () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Image)
    sprite_player.setFlag(SpriteFlag.Ghost, true)
    sprite_player.setFlag(SpriteFlag.Invisible, DEBUG)
    multilights.addLightSource(sprite_player, 16)
    player_rotations = scaling.createRotations(assets.image`player`, 10)
    player_rotations.push(assets.image`player`)
    player_rotations_flipped = scaling.createRotations(assets.image`player_flipped`, 10)
    player_rotations_flipped.push(assets.image`player_flipped`)
    sprite_player_wings = sprites.create(assets.image`player_wings`, SpriteKind.Image)
    sprite_player_wings.setFlag(SpriteFlag.Ghost, true)
    sprite_player_wings.setFlag(SpriteFlag.Invisible, true)
    set_mode(0)
}
function set_level (level_num: number) {
    curr_level = level_num
    won = false
    upside_down = false
    mode = 0
    scene.setBackgroundColor(13)
    tiles.loadMap(tiles.copyMap(all_levels[level_num]))
    for (let tile of [assets.tile`block`, assets.tile`upper_slab`, assets.tile`lower_slab`]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        if (jump_count < MAX_JUMPS) {
            if (mode == 0) {
                if (upside_down) {
                    jump_sprite(sprite_player_hitbox, -26)
                } else {
                    jump_sprite(sprite_player_hitbox, 26)
                }
                jump_count += 1
                sprite_player.startEffect(effects.fire, 100)
                timer.background(function () {
                    if (upside_down) {
                        for (let image2 of player_rotations_flipped) {
                            sprite_player.setImage(image2)
                            pause(20)
                        }
                    } else {
                        for (let image2 of player_rotations) {
                            sprite_player.setImage(image2)
                            pause(20)
                        }
                    }
                })
            } else {
                if (upside_down) {
                    jump_sprite(sprite_player_hitbox, -8)
                } else {
                    jump_sprite(sprite_player_hitbox, 8)
                }
                jump_count = 0
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`teleport_2_from`, function (sprite, location) {
    teleport_player(assets.tile`teleport_2_to`)
})
function prepare_tilemap () {
    tiles.setTileAt(tiles.getTilesByType(assets.tile`start_tile`)[0], assets.tile`transparency8`)
    tiles.destroySpritesOfKind(SpriteKind.End)
    sprite_flag = sprites.create(assets.image`flag`, SpriteKind.End)
    tiles.placeOnRandomTile(sprite_flag, assets.tile`end_tile`)
    tiles.setTileAt(tiles.getTilesByType(assets.tile`end_tile`)[0], assets.tile`transparency8`)
    multilights.addLightSource(sprite_flag, 8)
    multilights.toggleLighting(NIGHT_MODE)
}
function set_mode (m: number) {
    mode = m
    effects.clearParticles(sprite_player)
    sprite_player.startEffect(effects.trail)
    update_player_visuals()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.End, function (sprite, otherSprite) {
    sprite.ay = 0
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
    otherSprite.startEffect(effects.confetti)
    won = true
    multilights.toggleLighting(false)
    if (upside_down) {
        fade_for_gravity(true, false)
    }
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
function jump_sprite (sprite: Sprite, pixels: number) {
    if (pixels > 0) {
        sprite.vy = Math.sqrt(2 * (sprite.ay * pixels)) * -1
    } else {
        sprite.vy = Math.sqrt(2 * (sprite.ay * pixels))
    }
}
function make_player () {
    sprite_player_hitbox = sprites.create(assets.image`player_hitbox`, SpriteKind.Player)
    sprite_player_hitbox.setFlag(SpriteFlag.Invisible, !(DEBUG))
    sprite_player_hitbox.setFlag(SpriteFlag.ShowPhysics, DEBUG)
    sprite_player_hitbox.ay = GRAVITY
    tiles.placeOnRandomTile(sprite_player_hitbox, assets.tile`start_tile`)
    scene.cameraFollowSprite(sprite_player_hitbox)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`teleport_1_from0`, function (sprite, location) {
    teleport_player(assets.tile`teleport_1_to0`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`infinite_jump`, function (sprite, location) {
    set_mode(1)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_right0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_right0`)
})
function fade (_in: boolean, block: boolean) {
    if (_in) {
        color.startFade(color.originalPalette, color.Black, 500)
    } else {
        color.startFade(color.Black, color.originalPalette, 500)
    }
    if (block) {
        color.pauseUntilFadeDone()
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`upside_down_gravity0`, function (sprite, location) {
    set_gravity(false)
})
function wait_for_select () {
    menu_selected = false
    while (!(menu_selected)) {
        pause(1)
    }
}
function fade_for_gravity (up: boolean, block: boolean) {
    if (up) {
        color.startFade(color.DIY, color.originalPalette, 500)
    } else {
        color.startFade(color.originalPalette, color.DIY, 500)
    }
    if (block) {
        color.pauseUntilFadeDone()
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
    sprite_map_progress.setBarBorder(1, 15)
    sprite_map_progress.top = 2
    sprite_map_progress.left = 2
    sprite_map_progress.setFlag(SpriteFlag.Ghost, true)
    sprite_map_progress.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`regular_jump`, function (sprite, location) {
    set_mode(0)
})
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    sprite_player.destroy()
    sprite_player_hitbox.destroy()
    if (won) {
        timer.after(1000, function () {
            game.over(true)
        })
    } else {
        multilights.toggleLighting(false)
        if (upside_down) {
            fade_for_gravity(true, false)
        }
        timer.after(1000, function () {
            in_game = false
            sprite_map_progress.value = sprite_player_hitbox.right
            sprite_map_progress.setFlag(SpriteFlag.Invisible, false)
            blockMenu.showMenu(["Try again", "Exit"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            blockMenu.closeMenu()
            if (blockMenu.selectedMenuIndex() == 0) {
                fade(true, true)
                sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
                set_level(curr_level)
                make_player()
                make_player_visuals()
                prepare_tilemap()
                in_game = true
                fade(false, true)
            } else {
                fade(true, true)
                sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
                game.reset()
            }
        })
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`teleport_3_from`, function (sprite, location) {
    teleport_player(assets.tile`teleport_3_to`)
})
blockMenu.onMenuOptionSelected(function (option, index) {
    menu_selected = true
})
let colliding_dirs = ""
let sprite_map_progress: StatusBarSprite = null
let menu_selected = false
let sprite_flag: Sprite = null
let curr_level = 0
let player_rotations_flipped: Image[] = []
let player_rotations: Image[] = []
let sprite_player_wings: Sprite = null
let sprite_player: Sprite = null
let sprite_player_hitbox: Sprite = null
let mode = 0
let upside_down = false
let won = false
let in_game = false
let all_levels: tiles.WorldMap[] = []
let jump_count = 0
let NIGHT_MODE = false
let MAX_JUMPS = 0
let GRAVITY = 0
let DEBUG = false
DEBUG = true
stats.turnStats(true)
color.setPalette(
color.Black
)
GRAVITY = 500
MAX_JUMPS = 2
NIGHT_MODE = false
jump_count = 0
all_levels = [
tiles.createSmallMap(tilemap`level_1`),
tiles.createSmallMap(tilemap`level_2`),
tiles.createSmallMap(tilemap`level_3`),
tiles.createSmallMap(tilemap`level_4`),
tiles.createSmallMap(tilemap`level_5`)
]
in_game = false
won = false
upside_down = false
mode = 0
blockMenu.setColors(12, 11)
set_level(4)
make_player()
make_player_visuals()
make_map_progress_bar()
prepare_tilemap()
in_game = true
fade(false, false)
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
            spriteutils.placeAngleFrom(
            sprite_player_wings,
            0,
            0,
            sprite_player_hitbox
            )
            if (DEBUG) {
                colliding_dirs = ""
                if (sprite_player_hitbox.isHittingTile(CollisionDirection.Left)) {
                    colliding_dirs = "" + colliding_dirs + "L"
                }
                if (sprite_player_hitbox.isHittingTile(CollisionDirection.Top)) {
                    colliding_dirs = "" + colliding_dirs + "U"
                }
                if (sprite_player_hitbox.isHittingTile(CollisionDirection.Right)) {
                    colliding_dirs = "" + colliding_dirs + "R"
                }
                if (sprite_player_hitbox.isHittingTile(CollisionDirection.Bottom)) {
                    colliding_dirs = "" + colliding_dirs + "D"
                }
                sprite_player_hitbox.sayText(colliding_dirs)
            }
        } else {
            sprite_player_wings.setFlag(SpriteFlag.Invisible, true)
        }
    }
})
