const Tile = require("./tile");
const { createTileset, chooseRandomFeatures } = require("./tile.features");
const { getAdjacentCoordinates, isValidCoordinate, isFeatureCompatible } = require("./grid.utilities");
const { visualizeGrid, visualizeTile } = require("./grid.visualisation");

/**
 * @brief Dungeon grid class
 * @description A dungeon grid is a 2D array of tiles
 */
class Grid {
    /**
     * @brief Constructor for the dungeon grid
     * @description Creates a 2D array of tiles with all possible states
     * @param size - Size of the grid
     * @param tileset - Set of possible tiles
     */
    constructor(size) {
        this.size = size;
        this.tileset = createTileset(); // Predefined set of possible tiles
        console.log(this.tileset);
        this.grid = this.createInitialGrid(size);
    }

    /**
     * @brief Creates a 2D array of tiles with all possible states
     * @description Each cell starts with all possible states (doors, chests, stairs, etc.)
     * @param size - Size of the grid
     * @returns grid 2D array of tiles
     */
    createInitialGrid(size) {
        let grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            for (let j = 0; j < size; j++) {
                // Pass a copy of the entire tileset to each Tile
                grid[i][j] = new Tile(
                    this.tileset.map((feature) => ({ ...feature }))
                );
            }
        }
        return grid;
    }

    /**
     * @brief Propagates constraints to adjacent tiles
     * @description If a tile has a door, then adjacent tiles cannot have a wall in the same direction
     * @param x Coordinate x of the tile
     * @param y Coordinate y of the tile
     */
    collapseTile(x, y) {
        let tile = this.grid[x][y];
        console.log(tile);

        // Only collapse tiles that are not special rooms
        if (tile.type === "normal") {
            console.log("collapsing tile");
            tile.features = chooseRandomFeatures(tile.features);
            tile.collapsed = true;
            this.propagateConstraints(x, y);
        }
    }
    /**
     * @brief Propagates constraints to adjacent tiles
     * @description If a tile has a door, then adjacent tiles cannot have a wall in the same direction
     * @param x Coordinate x of the tile
     * @param y Coordinate y of the tile
     */
    propagateConstraints(x, y) {
        let directions = ["north", "south", "east", "west"];
        let opposites = {
            north: "south",
            south: "north",
            east: "west",
            west: "east",
        };

        directions.forEach((direction) => {
            let [adjX, adjY] = getAdjacentCoordinates(x, y, direction);
            if (isValidCoordinate(adjX, adjY)) {
                this.grid[adjX][adjY].features = this.grid[adjX][
                    adjY
                ].features.filter((feature) => {
                    // Logic to keep only compatible features
                    // For example, if there's a door in the 'north' wall of the current tile,
                    // the 'south' wall of the adjacent tile should not be a solid wall.

                    return isFeatureCompatible(
                        feature,
                        this.grid[x][y].features,
                        opposites[direction]
                    );
                });
            }
        });
    }

    /**
     * @brief Propagates constraints to adjacent tiles
     * @description If a tile has a door, then adjacent tiles cannot have a wall in the same direction
     * @param x Coordinate x of the tile
     * @param y Coordinate y of the tile
     * @return Dungeon grid
     */
    propagateConstraintsToAdjacentTiles(x, y) {
        let directions = ["north", "south", "east", "west"];
        let opposites = {
            north: "south",
            south: "north",
            east: "west",
            west: "east",
        };

        directions.forEach((direction) => {
            let [adjX, adjY] = getAdjacentCoordinates(x, y, direction);

            if (isValidCoordinate(adjX, adjY)) {
                let adjacentTile = this.grid[adjX][adjY];
                let currentTile = this.grid[x][y];

                // If the current tile has a door in the current direction
                if (currentTile.features.door === direction) {
                    // Remove incompatible features from the adjacent tile
                    adjacentTile.features = adjacentTile.features.filter(
                        (feature) => {
                            // A door in the current tile should require a door in the opposite wall of the adjacent tile
                            if (feature.door) {
                                return feature.door === opposites[direction];
                            }
                            // Other features should remain unchanged
                            return true;
                        }
                    );
                }

                // If the current tile has a wall in the current direction
                if (currentTile.features.wall) {
                    // Remove incompatible features from the adjacent tile
                    adjacentTile.features = adjacentTile.features.filter(
                        (feature) => {
                            // A wall in the current tile should require a wall in the opposite wall of the adjacent tile
                            if (feature.wall) {
                                return feature.wall === opposites[direction];
                            }
                            // Other features should remain unchanged
                            return true;
                        }
                    );
                }

                // If the current tile has a chest in the current direction
                if (currentTile.features.chest) {
                    // Remove incompatible features from the adjacent tile
                    adjacentTile.features = adjacentTile.features.filter(
                        (feature) => {
                            // A chest in the current tile should require a wall in the opposite wall of the adjacent tile
                            if (feature.wall) {
                                return feature.wall === opposites[direction];
                            }
                            // Other features should remain unchanged
                            return true;
                        }
                    );
                }
            }
        });
    }

    /**
     * @brief Generate grid
     * @description Generates a grid by collapsing tiles
     * @returns Grid with collapsed tiles
     */
    generateGrid() {
        this.placeSpecialRooms(); // Place the spawn room and the boss room

        // Collapse tiles until there are no uncollapsed tiles
        while (this.hasUncollapsedTiles()) {
            try {
                let { x, y } = this.chooseRandomUncollapsedTile();
                this.collapseTile(x, y);
            } catch (error) {
                console.error(error.message);
                break; // Break out of the loop if an error occurs
            }
        }
    }

    /**
     * @brief Checks if a tile is uncollapsed
     * @description Checks if a tile is uncollapsed in the grid
     * @returns True if there are uncollapsed tiles, false otherwise
     */
    hasUncollapsedTiles() {
        return this.grid.some((row) => row.some((tile) => !tile.collapsed)); //this checks if there are uncollapsed tiles
    }

    /**
     * @brief Choose random uncollapsed tile
     * @returns Random uncollapsed tile
     */
    chooseRandomUncollapsedTile() {
        let x,
            y,
            attempts = 0;
        do {
            x = Math.floor(Math.random() * this.size);
            y = Math.floor(Math.random() * this.size);
            attempts++;
            if (attempts > this.size * this.size) {
                throw new Error(
                    "Unable to find uncollapsed tile, dungeon may be fully collapsed."
                );
            }
        } while (this.grid[x][y].collapsed);
        return { x, y };
    }

    /**
     * @brief Place special rooms
     * @description Places the spawn room at the beginning of the dungeon and the boss room at the end of the dungeon
     * @returns Dungeon grid
     */
    placeSpecialRooms() {
        this.placeSpawnRoom();
        this.placeBossRoom();
    }

    /**
     * @brief Place spawn room
     * @description Places the spawn room at the beginning of the dungeon
     * @returns Dungeon grid
     */
    placeSpawnRoom() {
        // Place the spawn room at the beginning of the dungeon
        this.grid[0][0] = new Tile([...this.tileset], "spawn");
        this.grid[0][0].collapsed = true;
    }

    /**
     * @brief Place boss room
     * @description Places the boss room at the end of the dungeon
     * @returns Dungeon grid
     */
    placeBossRoom() {
        // Place the boss room at the end of the dungeon
        this.grid[this.size - 1][this.size - 1] = new Tile(
            [...this.tileset],
            "boss"
        );
        this.grid[this.size - 1][this.size - 1].collapsed = true;
    }
}

module.exports = Grid;
