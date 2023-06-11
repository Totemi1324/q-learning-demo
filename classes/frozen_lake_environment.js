import { LEVELS } from "../levels.js";
import { ASSETS } from "../assets.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../main.js";
import { ActionType } from "../shared/actions.js";

import { rectContainsPoint } from "../shared/rect_contains_point.js";

const TileType = Object.freeze({
    Default: Symbol(0),
    Hole: Symbol(1),
    Reward: Symbol(2),
    Agent: Symbol(3),
    Finish: Symbol(4),
});

const CellSize = 64;

class FrozenLakeEnvironment {
    constructor(context, { levelNumber }) {
        this.context = context;

        this.position = {
            x: undefined,
            y: undefined,
        };
        this.rows = undefined;
        this.columns = undefined;
        this.numStates = undefined;
        this.numActions = undefined;
        this.epochs = undefined;
        this.newEpoch = undefined;

        this.sprites = {
            default: undefined,
            hole: undefined,
            reward: undefined,
            agent: undefined,
            finish: undefined,
            arrowUp: undefined,
            arrowDown: undefined,
            arrowLeft: undefined,
            arrowRight: undefined,
        };

        this.agentPosition = {
            x: undefined,
            y: undefined,
        };
        this.startPosition = {
            x: undefined,
            y: undefined,
        };
        this.finishPosition = {
            x: undefined,
            y: undefined,
        };
        this.tiles = undefined;

        this.initialize(levelNumber);
    }

    // Initialization
    initialize(levelNumber) {
        this.numActions = 4;
        this.epochs = 0;
        this.newEpoch = true;
        this.tiles = new Map();

        this.sprites.agent = new Image();
        this.sprites.agent.src = ASSETS.agent;
        this.sprites.finish = new Image();
        this.sprites.finish.src = ASSETS.finish;
        this.sprites.default = new Image();
        this.sprites.default.src = ASSETS.default;
        this.sprites.hole = new Image();
        this.sprites.hole.src = ASSETS.hole;
        this.sprites.reward = new Image();
        this.sprites.reward.src = ASSETS.reward;

        this.loadLevel(levelNumber);

        this.numStates = this.rows * this.columns;
        this.position.x = CANVAS_WIDTH / 2 - (this.columns / 2) * CellSize;
        this.position.y = CANVAS_HEIGHT / 2 - (this.rows / 2) * CellSize;
    }

    loadLevel(levelNumber) {
        try {
            let levelObject = LEVELS.levels[levelNumber];
            this.rows = levelObject.width;
            this.columns = levelObject.height;
            this.startPosition.x = levelObject.startPosition[0];
            this.startPosition.y = levelObject.startPosition[1];
            this.resetAgent(levelNumber);
            this.finishPosition.x = levelObject.finishPosition[0];
            this.finishPosition.y = levelObject.finishPosition[1];
            let holePositions = levelObject.holePositions;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.setTileType(j, i, TileType.Default);
                }
            }
            for (var i = 0; i < holePositions.length; i++) {
                let position = holePositions[i];
                if (position[0] < this.columns && position[1] < this.rows) {
                    this.setTileType(position[0], position[1], TileType.Hole);
                }
            }
        } catch (error) {
            this.rows = 0;
            this.columns = 0;
            console.error("Failed to load level due to misformatted data.");
        }
    }

    resetAgent() {
        this.agentPosition.x = this.startPosition.x;
        this.agentPosition.y = this.startPosition.y;
    }

    // Actions
    makeAction(actionType) {
        if (
            this.agentPosition.x === this.finishPosition.x &&
            this.agentPosition.y === this.finishPosition.y
            //TODO: Reset agent in holes
        ) {
            this.resetAgent();
            this.newEpoch = true;
            this.epochs += 1;
        }

        switch (actionType) {
            case ActionType.Up:
                this.goUp();
                break;
            case ActionType.Down:
                this.goDown();
                break;
            case ActionType.Left:
                this.goLeft();
                break;
            case ActionType.Right:
                this.goRight();
                break;
        }
        this.newEpoch = false;
    }

    goUp() {
        if (this.agentPosition.y != 0) {
            this.agentPosition.y -= 1;
        }
    }

    goDown() {
        if (this.agentPosition.y < this.rows - 1) {
            this.agentPosition.y += 1;
        }
    }

    goLeft() {
        if (this.agentPosition.x != 0) {
            this.agentPosition.x -= 1;
        }
    }

    goRight() {
        if (this.agentPosition.x < this.columns - 1) {
            this.agentPosition.x += 1;
        }
    }

    // Utilities
    currentStateNumber() {
        return this.coordinateToStateNumber(
            this.agentPosition.x,
            this.agentPosition.y
        );
    }

    coordinateToStateNumber(x, y) {
        return y * this.columns + x;
    }

    stateNumberToCoordinate(stateNum) {
        return {
            x: stateNum % this.columns,
            y: Math.floor(stateNum / this.columns),
        };
    }

    getTileType(x, y) {
        return this.tiles.get(this.coordinateToStateNumber(x, y));
    }

    setTileType(x, y, tileType) {
        this.tiles.set(this.coordinateToStateNumber(x, y), tileType);
    }

    getReward() {
        if (
            this.agentPosition.x == this.finishPosition.x &&
            this.agentPosition.y == this.finishPosition.y
        ) {
            return 100;
        }

        switch (this.getTileType(this.agentPosition.x, this.agentPosition.y)) {
            case TileType.Hole:
                return -1000;
            case TileType.Reward:
                return 10;
            default:
                return 0;
        }
    }

    getTileState(x, y) {
        if (x === this.agentPosition.x && y === this.agentPosition.y) {
            return TileType.Agent;
        }
        if (x === this.finishPosition.x && y === this.finishPosition.y) {
            return TileType.Finish;
        }

        return this.getTileType(x, y);
    }

    getCellForPosition(position) {
        if (
            !rectContainsPoint(
                this.position.x,
                this.position.y,
                this.columns * CellSize,
                this.rows * CellSize,
                position
            )
        ) {
            return;
        }

        return {
            x: Math.floor((position.x - this.position.x) / CellSize),
            y: Math.floor((position.y - this.position.y) / CellSize),
        };
    }

    // Event handlers
    onMouseClick(mousePosition) {
        const cellPosition = this.getCellForPosition(mousePosition);

        if (!cellPosition) return;

        switch (this.getTileState(cellPosition.x, cellPosition.y)) {
            case TileType.Hole:
                return;
            case TileType.Reward:
                this.setTileType(
                    cellPosition.x,
                    cellPosition.y,
                    TileType.Default
                );
                break;
            case TileType.Default:
                if (
                    cellPosition.x === this.startPosition.x &&
                    cellPosition.y === this.startPosition.y
                ) {
                    return;
                }
                if (
                    cellPosition.x === this.finishPosition.x &&
                    cellPosition.y === this.finishPosition.y
                ) {
                    return;
                }
                this.setTileType(
                    cellPosition.x,
                    cellPosition.y,
                    TileType.Reward
                );
                break;
        }
    }

    // Lifecycle events
    draw() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                const x = this.position.x + j * CellSize;
                const y = this.position.y + i * CellSize;
                const tileState = this.getTileState(j, i);

                var sprite;
                switch (tileState) {
                    case TileType.Agent:
                        sprite = this.sprites.agent;
                        break;
                    case TileType.Finish:
                        sprite = this.sprites.finish;
                        break;
                    case TileType.Default:
                        sprite = this.sprites.default;
                        break;
                    case TileType.Hole:
                        sprite = this.sprites.hole;
                        break;
                    case TileType.Reward:
                        sprite = this.sprites.reward;
                        break;
                }

                this.context.drawImage(sprite, x, y, CellSize, CellSize);
            }
        }
    }

    update() {
        this.draw();
    }
}

export default FrozenLakeEnvironment;
