/**
 * @brief Creates a predefined set of possible tiles
 * @description Each tile has a set of possible states (doors, chests, stairs, etc.)
 * @returns tileset - Predefined set of possible tiles
 */
function createTileset() {
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
 * @brief Choose random features
 * @description Randomly selects a feature set from possible features
 * @param possibleFeatures
 * @returns Randomly selected feature set as an array
 */
function chooseRandomFeatures(possibleFeatures) {
    // Randomly select a feature set from possible features
    const randomIndex = Math.floor(Math.random() * possibleFeatures.length);
    return [possibleFeatures[randomIndex]];
}

module.exports = { createTileset, chooseRandomFeatures };
