function set_level (level_num: number) {
    scene.setBackgroundColor(13)
    tiles.loadMap(all_levels[0])
}
let all_levels: tiles.WorldMap[] = []
all_levels = [tiles.createSmallMap(tilemap`level_1`)]
set_level(0)
