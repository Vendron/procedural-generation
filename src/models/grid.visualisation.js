/**
 * Visualizes the dungeon grid as a string.
 * @returns {string} A string representation of the dungeon.
 */
function visualizeGrid() {
    let dungeonString = "";
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            dungeonString += visualizeTile(this.grid[i][j]);
            dungeonString += " "; // Add space to separate tiles
        }
        dungeonString += "\n"; // New line for each row
    }
    return dungeonString;
}

/**
 * Visualizes a single tile.
 * @param {Tile} tile The tile to visualize.
 * @returns {string} A string representation of the tile.
 */
function visualizeTile(tile) {
    if (tile.type === "spawn") {
        return "[**X**]"; // Represent spawn with 'X'
    }
    if (tile.type === "boss") {
        return "[**B**]"; // Represent boss with 'Y'
    }
    if (tile.features.some((f) => f.wall)) {
        console.log(tile);
        return "[W]"; // Represent walls with 'W'
    }
    if (tile.features.some((f) => f.door)) {
        return "[D]"; // Represent doors with 'D'
    }
    if (tile.features.some((f) => f.chest)) {
        return "[C]"; // Represent chests with 'C'
    }
    if (tile.features.some((f) => f.stairs)) {
        return "[S]"; // Represent stairs with 'S'
    }
    return "[ ]"; // Represent empty space with '.'
}

module.exports = { visualizeGrid, visualizeTile };
