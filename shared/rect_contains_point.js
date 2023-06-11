export function rectContainsPoint(x, y, width, height, point) {
    return (
        point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height
    );
}
