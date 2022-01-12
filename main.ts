function set_level (level_num: number) {
    scene.setBackgroundColor(13)
    tiles.loadMap(all_levels[0])
}
function make_player () {
    sprite_player = sprites.create(assets.image`player`, SpriteKind.Player)
    tiles.placeOnRandomTile(sprite_player, assets.tile`start_tile`)
}
let sprite_player: Sprite = null
let all_levels: tiles.WorldMap[] = []
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
set_level(0)
make_player()
