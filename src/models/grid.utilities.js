/**
 * @brief Get adjacent coordinates
 * @description Get adjacent coordinates given a direction
 * @param x Coordinate x of the tile
 * @param y Coordinate y of the tile
 * @param direction Direction of the tile
 * @returns Adjacent coordinates
 */
function getAdjacentCoordinates(x, y, direction) {
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

function isValidCoordinate(x, y) {
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
function isFeatureCompatible(feature, features, direction) {
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

module.exports = {
    getAdjacentCoordinates,
    isValidCoordinate,
    isFeatureCompatible,
};
