/**
 * @brief Class representing a tile in the dungeon
 * @description A tile is a square in the dungeon, it can be a wall, a floor, a door, etc.
 */
class Tile {
    /**
     * @param {Array} features - Features like 'door', 'chest', 'stairs', etc.
     */
    constructor(features, type = "normal") {
        this.features = features; // Features like 'door', 'chest', 'stairs', etc.
        this.collapsed = false; // State of the tile, true if its state is determined
        this.type = type; // Allows for boss rooms, spawn or normal rooms.
    }
}

module.exports = Tile;