const Tile = require("./Tile");

/**
 * @brief Dungeon grid class
 * @description A dungeon grid is a 2D array of tiles
 */
class DungeonGrid {
    /**
     * @brief Constructor for the dungeon grid
     * @description Creates a 2D array of tiles with all possible states
     * @param size - Size of the grid
     * @param tileset - Set of possible tiles
     */
    constructor(size) {
        this.size = size;
        this.tileset = this.createTileset(); // Predefined set of possible tiles
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
     * @brief Creates a predefined set of possible tiles
     * @description Each tile has a set of possible states (doors, chests, stairs, etc.)
     * @returns tileset - Predefined set of possible tiles
     */
    createTileset() {
        return [
            { door: "north" },
            { door: "south" },
            { door: "east" },
            { door: "west" },
            { wall: true },
            { chest: true },
            { stairs: "up" },
            { stairs: "down" },
        ];
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
            tile.features = this.chooseRandomFeatures(tile.features);
            tile.collapsed = true;
            this.propagateConstraints(x, y);
        }
    }

    /**
     * @brief Choose random features
     * @description Randomly selects a feature set from possible features
     * @param possibleFeatures
     * @returns Randomly selected feature set as an array
     */
    chooseRandomFeatures(possibleFeatures) {
        // Randomly select a feature set from possible features
        const randomIndex = Math.floor(Math.random() * possibleFeatures.length);
        return [possibleFeatures[randomIndex]];
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
            let [adjX, adjY] = this.getAdjacentCoordinates(x, y, direction);
            if (this.isValidCoordinate(adjX, adjY)) {
                this.grid[adjX][adjY].features = this.grid[adjX][
                    adjY
                ].features.filter((feature) => {
                    // Logic to keep only compatible features
                    // For example, if there's a door in the 'north' wall of the current tile,
                    // the 'south' wall of the adjacent tile should not be a solid wall.

                    return this.isFeatureCompatible(
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
            let [adjX, adjY] = this.getAdjacentCoordinates(x, y, direction);

            if (this.isValidCoordinate(adjX, adjY)) {
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
     * @brief Get adjacent coordinates
     * @description Get adjacent coordinates given a direction
     * @param x Coordinate x of the tile
     * @param y Coordinate y of the tile
     * @param direction Direction of the tile
     * @returns Adjacent coordinates
     */
    getAdjacentCoordinates(x, y, direction) {
        switch (direction) {
            case "north":
                return [x, y - 1];
            case "south":
                return [x, y + 1];
            case "east":
                return [x + 1, y];
            case "west":
                return [x - 1, y];
            default:
                return [x, y];
        }
    }

    isValidCoordinate(x, y) {
        return x >= 0 && y >= 0 && x < this.size && y < this.size;
    }

    /**
     * @brief Checks if feature is compatible
     * @description Checks if a feature is compatible with other features in the same tile
     * @param feature feature to check
     * @param features features to check against
     * @param direction direction of the feature
     * @returns True if the feature is compatible, false otherwise
     */
    isFeatureCompatible(feature, features, direction) {
        // If the feature is a door, then there should be no wall in the same direction
        if (feature.wall) {
            // If the feature is a wall, ensure there's no door in the opposite direction
            return !features.some((f) => f.door === direction);
        }

        if (feature.door) {
            // If the feature is a door, ensure there's no wall in the same direction
            return !features.some((f) => f.wall);
        }

        // If the feature is a door, then there should be no door in the same direction
        if (feature.door && features.door) {
            return features.door !== direction;
        }

        return true;
    }

    /**
     * @brief Generate dungeon grid
     * @description Generates a dungeon grid by collapsing tiles
     * @returns Dungeon grid
     */
    generateDungeon() {
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
        let x, y, attempts = 0;
        do {
            x = Math.floor(Math.random() * this.size);
            y = Math.floor(Math.random() * this.size);
            attempts++;
            if (attempts > this.size * this.size) {
                throw new Error("Unable to find uncollapsed tile, dungeon may be fully collapsed.");
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

    /**
     * Visualizes the dungeon grid as a string.
     * @returns {string} A string representation of the dungeon.
     */
    visualizeDungeon() {
        let dungeonString = "";
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                dungeonString += this.visualizeTile(this.grid[i][j]);
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
    visualizeTile(tile) {
        if (tile.type === "spawn") {
            return "[**X**]"; // Represent spawn with 'X'
        }
        if (tile.type === "boss") {
            return "[**B**]"; // Represent boss with 'Y'
        }
        if (tile.features.some((f) => f.wall)) {
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
}

module.exports = DungeonGrid;
