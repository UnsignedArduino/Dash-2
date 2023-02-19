namespace SpriteKind {
    export const End = SpriteKind.create()
    export const Image = SpriteKind.create()
    export const Button = SpriteKind.create()
}
namespace StatusBarKind {
    export const Progress = StatusBarKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites_button_list.length > 0) {
        if (button_list_selected > 0) {
            button_list_selected += -1
        } else {
            button_list_selected = sprites_button_list.length - 1
        }
    }
})
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
        animation_flap = animation_original_flap
        animation_flap_hard = animation_original_flap_hard
    } else {
        sprite_player.setImage(assets.image`player_flipped`)
        animation_flap = animation_upside_down_flap
        animation_flap_hard = animation_upside_down_flap_hard
    }
    sprite_player_wings.setFlag(SpriteFlag.Invisible, mode != 1)
    animation.runImageAnimation(
    sprite_player_wings,
    animation_flap,
    200,
    true
    )
}
function make_player_visuals () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Image)
    sprite_player.setFlag(SpriteFlag.Ghost, true)
    sprite_player.setFlag(SpriteFlag.Invisible, DEBUG)
    multilights.addLightSource(sprite_player, 16)
    animation_player_rotations = scaling.createRotations(assets.image`player`, 10)
    animation_player_rotations.push(assets.image`player`)
    animation_player_rotations_flipped = scaling.createRotations(assets.image`player_flipped`, 10)
    animation_player_rotations_flipped.push(assets.image`player_flipped`)
    animation_player_rotate_first_half = []
    for (let index = 0; index <= Math.ceil(animation_player_rotations.length / 2); index++) {
        animation_player_rotate_first_half.push(animation_player_rotations[index])
    }
    animation_player_rotate_second_half = []
    for (let index = 0; index <= Math.ceil(animation_player_rotations.length / 2); index++) {
        animation_player_rotate_second_half.push(animation_player_rotations[Math.ceil(animation_player_rotations.length / 2) + index])
    }
    sprite_player_wings = sprites.create(assets.image`player_wings`, SpriteKind.Image)
    animation_original_flap = assets.animation`flap`
    animation_original_flap_hard = assets.animation`flap_hard`
    animation_upside_down_flap = assets.animation`flap_upside_down`
    animation_upside_down_flap_hard = assets.animation`flap_hard_upside_down`
    animation_flap = animation_original_flap
    animation_flap_hard = animation_original_flap_hard
    animation.runImageAnimation(
    sprite_player_wings,
    animation_flap,
    200,
    true
    )
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
    if (level_num == -1) {
        tiles.loadMap(tiles.copyMap(splash_level))
    } else {
        tiles.loadMap(tiles.copyMap(all_levels[level_num]))
    }
    for (let tile of [assets.tile`block`, assets.tile`upper_slab`, assets.tile`lower_slab`]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        player_jump()
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`teleport_2_from`, function (sprite, location) {
    teleport_player(assets.tile`teleport_2_to`)
})
function prepare_tilemap () {
    if (!(in_splash)) {
        tiles.setTileAt(tiles.getTilesByType(assets.tile`start_tile`)[0], assets.tile`transparency8`)
    } else {
        tiles.coverAllTiles(assets.tile`start_tile`, assets.tile`myTile0`)
        tiles.coverAllTiles(assets.tile`jump`, assets.tile`myTile0`)
    }
    tiles.destroySpritesOfKind(SpriteKind.End)
    sprite_flag = sprites.create(assets.image`flag`, SpriteKind.End)
    sprite_flag.setFlag(SpriteFlag.Invisible, in_splash)
    tiles.placeOnRandomTile(sprite_flag, assets.tile`end_tile`)
    tiles.setTileAt(tiles.getTilesByType(assets.tile`end_tile`)[0], assets.tile`transparency8`)
    if (tiles.getTilesByType(assets.tile`attempt_counts_text`).length > 0) {
        location = tiles.getTilesByType(assets.tile`attempt_counts_text`)[0]
        tiles.setTileAt(location, assets.tile`transparency8`)
        if (spriteutils.isDestroyed(sprite_attempt_label)) {
            sprite_attempt_label = textsprite.create("", 0, 12)
        }
        sprite_attempt_label.setText("Attempt " + level_attempts)
        sprite_attempt_label.top = location.top
        sprite_attempt_label.left = location.left
        sprite_attempt_label.setFlag(SpriteFlag.AutoDestroy, true)
        sprite_attempt_label.setFlag(SpriteFlag.Ghost, true)
        multilights.addLightSource(sprite_attempt_label, 20)
    }
    if (!(in_splash)) {
        multilights.addLightSource(sprite_flag, 8)
    }
    multilights.toggleLighting(NIGHT_MODE)
}
function set_mode (m: number) {
    mode = m
    effects.clearParticles(sprite_player)
    sprite_player.startEffect(effects.trail)
    update_player_visuals()
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites_button_list.length > 0) {
        if (button_list_selected > 0) {
            button_list_selected += -1
        } else {
            button_list_selected = sprites_button_list.length - 1
        }
    }
})
function set_menu_css () {
    menu = miniMenu.createMenuFromArray([])
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(12))
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(11))
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, images.colorBlock(11))
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, images.colorBlock(12))
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.colorBlock(12))
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, images.colorBlock(11))
    menu.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(11))
    menu.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(15))
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.UseAsTemplate, 1)
    sprites.destroy(menu)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.End, function (sprite, otherSprite) {
    if (in_game) {
        sprite.ay = 0
        sprite.setFlag(SpriteFlag.Ghost, true)
        sprite.setFlag(SpriteFlag.AutoDestroy, true)
        otherSprite.startEffect(effects.confetti)
        won = true
        multilights.toggleLighting(false)
        if (upside_down) {
            fade_for_gravity(true, false)
        }
    } else if (in_splash) {
        teleport_player(assets.tile`start_tile`)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites_button_list.length > 0) {
        if (button_list_selected < sprites_button_list.length - 1) {
            button_list_selected += 1
        } else {
            button_list_selected = 0
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_down0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_down0`)
})
function destroy_if_on_tile (sprite: Sprite, tile: Image) {
    if (spriteutils.isDestroyed(sprite) || in_splash) {
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
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites_button_list.length > 0) {
        if (button_list_selected < sprites_button_list.length - 1) {
            button_list_selected += 1
        } else {
            button_list_selected = 0
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`infinite_jump`, function (sprite, location) {
    set_mode(1)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes_right0`, function (sprite, location) {
    destroy_if_on_tile(sprite, assets.tile`spikes_right0`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`gravity_stick`, function (sprite, location) {
    set_mode(2)
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
    if (!(in_splash)) {
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
                timer.background(function () {
                    sprite_map_progress.value = sprite_player_hitbox.right
                    sprite_map_progress.bottom = 0
                    sprite_map_progress.vy = 50
                    sprite_map_progress.setFlag(SpriteFlag.Invisible, false)
                    images_button_list = [assets.image`try_again_icon`, assets.image`exit_icon`]
                    images_button_list_selected = [assets.image`try_again_icon_selected`, assets.image`exit_icon_selected`]
                    sprites_button_list = []
                    button_list_selected = 0
                    for (let index = 0; index <= images_button_list.length - 1; index++) {
                        sprite_button = sprites.create(images_button_list[index], SpriteKind.Button)
                        sprite_button.setFlag(SpriteFlag.Ghost, true)
                        sprite_button.setFlag(SpriteFlag.RelativeToCamera, true)
                        sprite_button.x = (index + 1) * (scene.screenWidth() / (images_button_list.length + 1))
                        sprite_button.top = scene.screenHeight()
                        sprite_button.z = 100
                        sprite_button.vy = -2000
                        sprites_button_list.push(sprite_button)
                    }
                    timer.background(function () {
                        while (sprites_button_list[0].y > scene.screenHeight() * 0.55) {
                            pause(0)
                        }
                        for (let index = 0; index <= sprites_button_list.length - 1; index++) {
                            sprites_button_list[index].y = scene.screenHeight() / 2
                            sprites_button_list[index].vy = 0
                        }
                    })
                    timer.background(function () {
                        while (sprite_map_progress.top < 2) {
                            pause(0)
                        }
                        sprite_map_progress.top = 2
                        sprite_map_progress.vy = 0
                    })
                    while (true) {
                        for (let index = 0; index <= sprites_button_list.length - 1; index++) {
                            sprite_button = sprites_button_list[index]
                            if (index == button_list_selected) {
                                sprite_button.setImage(images_button_list_selected[index])
                            } else {
                                sprite_button.setImage(images_button_list[index])
                            }
                        }
                        if (controller.A.isPressed()) {
                            break;
                        }
                        pause(0)
                    }
                    for (let index = 0; index <= sprites_button_list.length - 1; index++) {
                        sprites_button_list[index].setFlag(SpriteFlag.AutoDestroy, true)
                        sprites_button_list[index].vy = 2000
                    }
                    sprite_map_progress.vy = -50
                    timer.background(function () {
                        while (sprite_map_progress.bottom > 0) {
                            pause(0)
                        }
                        sprite_map_progress.bottom = 0
                        sprite_map_progress.vy = 0
                        sprite_map_progress.setFlag(SpriteFlag.Invisible, true)
                    })
                    if (button_list_selected == 0) {
                        fade(true, true)
                        level_attempts += 1
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
            })
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`teleport_3_from`, function (sprite, location) {
    teleport_player(assets.tile`teleport_3_to`)
})
function player_jump () {
    if (mode == 0) {
        if (jump_count < MAX_JUMPS) {
            if (upside_down) {
                jump_sprite(sprite_player_hitbox, -26)
            } else {
                jump_sprite(sprite_player_hitbox, 26)
            }
            jump_count += 1
            sprite_player.startEffect(effects.fire, 100)
            timer.background(function () {
                animation.stopAnimation(animation.AnimationTypes.All, sprite_player)
                if (upside_down) {
                    animation.runImageAnimation(
                    sprite_player,
                    animation_player_rotations_flipped,
                    20,
                    false
                    )
                } else {
                    animation.runImageAnimation(
                    sprite_player,
                    animation_player_rotations,
                    20,
                    false
                    )
                }
            })
        }
    } else if (mode == 1) {
        if (upside_down) {
            jump_sprite(sprite_player_hitbox, -8)
        } else {
            jump_sprite(sprite_player_hitbox, 8)
        }
        jump_count = 0
        animation.stopAnimation(animation.AnimationTypes.All, sprite_player_wings)
        animation.runImageAnimation(
        sprite_player_wings,
        animation_flap_hard,
        50,
        false
        )
        timer.debounce("animate_flap_hard", 300, function () {
            animation.runImageAnimation(
            sprite_player_wings,
            animation_flap,
            200,
            true
            )
        })
    } else {
        if (last_colliding_dirs.includes("U")) {
            mode_2_target_vy = Math.abs(mode_2_target_vy)
        } else if (last_colliding_dirs.includes("D")) {
            mode_2_target_vy = Math.abs(mode_2_target_vy) * -1
        } else {
            mode_2_target_vy = mode_2_target_vy * -1
        }
        timer.background(function () {
            animation.stopAnimation(animation.AnimationTypes.All, sprite_player)
            if (mode_2_target_vy > 0) {
                animation.runImageAnimation(
                sprite_player,
                animation_player_rotate_second_half,
                20,
                false
                )
            } else {
                animation.runImageAnimation(
                sprite_player,
                animation_player_rotate_first_half,
                20,
                false
                )
            }
        })
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`jump`, function (sprite, location) {
    player_jump()
})
let colliding_dirs = ""
let images_button_list_selected: Image[] = []
let images_button_list: Image[] = []
let sprite_map_progress: StatusBarSprite = null
let sprite_attempt_label: TextSprite = null
let location: tiles.Location = null
let sprite_flag: Sprite = null
let curr_level: number = []
let animation_player_rotate_second_half: Image[] = []
let animation_player_rotate_first_half: Image[] = []
let animation_player_rotations_flipped: Image[] = []
let animation_player_rotations: Image[] = []
let sprite_player_wings: Sprite = null
let animation_upside_down_flap_hard: Image[] = []
let animation_upside_down_flap: Image[] = []
let animation_original_flap_hard: Image[] = []
let animation_flap_hard: Image[] = []
let animation_original_flap: Image[] = []
let animation_flap: Image[] = []
let sprite_player: Sprite = null
let sprite_player_hitbox: Sprite = null
let button_list_selected: number = []
let sprites_button_list: Sprite[] = []
let level_attempts: number = []
let menu: miniMenu.MenuSprite = null
let menu_option_levels: miniMenu.MenuItem[] = []
let menu_selected_level: number = []
let menu_selected: number = []
let sprite_button: Sprite = null
let mode: number = []
let upside_down = false
let won = false
let in_splash = false
let in_game = false
let all_levels: tiles.WorldMap[] = []
let splash_level: tiles.WorldMap = null
let last_colliding_dirs = ""
let mode_2_target_vy: number = []
let jump_count: number = []
let NIGHT_MODE = false
let MAX_JUMPS: number = []
let GRAVITY: number = []
let DEBUG = false
DEBUG = false
stats.turnStats(true)
color.setPalette(
color.Black
)
GRAVITY = 500
MAX_JUMPS = 2
NIGHT_MODE = false
jump_count = 0
mode_2_target_vy = 200
last_colliding_dirs = ""
splash_level = tiles.createSmallMap(tilemap`splash_level`)
all_levels = [
tiles.createSmallMap(tilemap`level_1`),
tiles.createSmallMap(tilemap`level_2`),
tiles.createSmallMap(tilemap`level_3`),
tiles.createSmallMap(tilemap`level_4`),
tiles.createSmallMap(tilemap`level_5`),
tiles.createSmallMap(tilemap`level_6`),
tiles.createSmallMap(tilemap`level_7`)
]
in_game = false
in_splash = true
won = false
upside_down = false
mode = 0
set_menu_css()
set_level(-1)
make_player()
make_player_visuals()
make_map_progress_bar()
prepare_tilemap()
let sprites_splash_texts: TextSprite[] = []
let sprite_text = textsprite.create("Dash! 2", 0, 15)
sprite_text.setMaxFontHeight(16)
sprite_text.setOutline(1, 11)
sprite_text.top = 2
sprite_text.left = 2
sprite_text.z = 100
sprite_text.setFlag(SpriteFlag.Ghost, true)
sprite_text.setFlag(SpriteFlag.RelativeToCamera, true)
sprites_splash_texts.push(sprite_text)
sprite_text = textsprite.create("A game by UnsignedArduino", 0, 15)
sprite_text.setOutline(1, 11)
sprite_text.top = 20
sprite_text.left = 4
sprite_text.z = 100
sprite_text.setFlag(SpriteFlag.Ghost, true)
sprite_text.setFlag(SpriteFlag.RelativeToCamera, true)
sprites_splash_texts.push(sprite_text)
in_splash = true
timer.background(function () {
    fade(false, true)
    while (true) {
        sprite_button = sprites.create(assets.image`play_button_selected`, SpriteKind.Button)
        sprite_button.x = scene.screenWidth() / 2
        sprite_button.top = scene.screenHeight()
        sprite_button.z = 100
        sprite_button.setFlag(SpriteFlag.Ghost, true)
        sprite_button.setFlag(SpriteFlag.RelativeToCamera, true)
        sprite_button.ay = -1000
        sprite_button.vy = -250
        timer.background(function () {
            while (sprite_button.y > scene.screenHeight() / 2) {
                pause(0)
            }
            sprite_button.y = scene.screenHeight() / 2
            sprite_button.ay = 0
            sprite_button.vy = 0
        })
        while (controller.A.isPressed()) {
            pause(0)
        }
        while (!(controller.A.isPressed())) {
            pause(0)
        }
        sprite_button.setFlag(SpriteFlag.AutoDestroy, true)
        sprite_button.ay = 2000
        sprite_button.vy = 500
        menu_selected = -1
        menu_selected_level = -1
        while (true) {
            menu_option_levels = [miniMenu.createMenuItem("Back")]
            for (let index = 0; index <= all_levels.length - 1; index++) {
                menu_option_levels.push(miniMenu.createMenuItem("Level " + (index + 1)))
            }
            menu = miniMenu.createMenuFromArray(menu_option_levels)
            menu.top = 32
            menu.left = 4
            menu.z = 100
            menu.setDimensions(scene.screenWidth() - (menu.left + 4), scene.screenHeight() - (menu.top + 4))
            menu.top = scene.screenHeight()
            menu.setTitle("Select a level:")
            menu.setFlag(SpriteFlag.Ghost, true)
            menu.setFlag(SpriteFlag.RelativeToCamera, true)
            menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.ScrollIndicatorColor, 1)
            menu.onButtonPressed(controller.A, function (selection, selectedIndex) {
                menu_selected_level = selectedIndex
            })
            menu_selected_level = -1
            menu.ay = -2000
            menu.vy = -500
            timer.background(function () {
                while (menu.top > 32) {
                    pause(0)
                }
                menu.top = 32
                menu.ay = 0
                menu.vy = 0
            })
            while (menu_selected_level == -1) {
                pause(0)
            }
            menu.setFlag(SpriteFlag.AutoDestroy, true)
            menu.ay = 2000
            menu.vy = 500
            if (menu_selected_level > 0) {
                menu = miniMenu.createMenuFromArray([miniMenu.createMenuItem("Back"), miniMenu.createMenuItem("Normal"), miniMenu.createMenuItem("Hard - reduced visibility!")])
                menu.top = 32
                menu.left = 4
                menu.z = 100
                menu.setDimensions(scene.screenWidth() - (menu.left + 4), scene.screenHeight() - (menu.top + 4))
                menu.top = scene.screenHeight()
                menu.setTitle("Select difficulty:")
                menu.setFlag(SpriteFlag.Ghost, true)
                menu.setFlag(SpriteFlag.RelativeToCamera, true)
                menu.onButtonPressed(controller.A, function (selection, selectedIndex) {
                    menu_selected = selectedIndex
                })
                menu.ay = -2000
                menu.vy = -500
                timer.background(function () {
                    while (menu.top > 32) {
                        pause(0)
                    }
                    menu.top = 32
                    menu.ay = 0
                    menu.vy = 0
                })
                menu_selected = -1
                while (menu_selected == -1) {
                    pause(0)
                }
                menu.setFlag(SpriteFlag.AutoDestroy, true)
                menu.ay = 2000
                menu.vy = 500
                if (menu_selected > 0 && menu_selected_level > 0) {
                    NIGHT_MODE = menu_selected == 2
                    break;
                }
            } else {
                break;
            }
        }
        if (menu_selected > 0 && menu_selected_level > 0) {
            break;
        }
    }
    for (let sprite_text of sprites_splash_texts) {
        sprite_text.setFlag(SpriteFlag.AutoDestroy, true)
        sprite_text.ay = -2000
        sprite_text.vy = -200
    }
    fade(true, true)
    pause(1000)
    if (upside_down) {
        fade_for_gravity(true, false)
    }
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Image)
    in_splash = false
    level_attempts = 1
    set_level(menu_selected_level - 1)
    make_player()
    make_player_visuals()
    prepare_tilemap()
    in_game = true
    fade(false, true)
})
game.onUpdate(function () {
    if (in_game || in_splash) {
        sprite_player_hitbox.vx = 100
        if (mode == 2) {
            sprite_player_hitbox.ay = 0
            sprite_player_hitbox.vy = mode_2_target_vy
        } else {
            if (upside_down) {
                sprite_player_hitbox.ay = GRAVITY * -1
            } else {
                sprite_player_hitbox.ay = GRAVITY
            }
        }
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
            if (sprite_player_hitbox.isHittingTile(CollisionDirection.Left)) {
                last_colliding_dirs = "L"
                colliding_dirs = "" + colliding_dirs + "L"
            }
            if (sprite_player_hitbox.isHittingTile(CollisionDirection.Top)) {
                last_colliding_dirs = "T"
                colliding_dirs = "" + colliding_dirs + "U"
            }
            if (sprite_player_hitbox.isHittingTile(CollisionDirection.Right)) {
                last_colliding_dirs = "R"
                colliding_dirs = "" + colliding_dirs + "R"
            }
            if (sprite_player_hitbox.isHittingTile(CollisionDirection.Bottom)) {
                last_colliding_dirs = "B"
                colliding_dirs = "" + colliding_dirs + "D"
            }
            if (DEBUG) {
                sprite_player_hitbox.sayText(colliding_dirs)
            }
        } else {
            sprite_player_wings.setFlag(SpriteFlag.Invisible, true)
        }
    }
})
