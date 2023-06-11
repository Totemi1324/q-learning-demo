import { LEVELS } from "../levels.js";
import { ASSETS } from "../assets.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../main.js";

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
            this.initializeAgent(levelNumber);
            let levelObject = LEVELS.levels[levelNumber];
            this.rows = levelObject.width;
            this.columns = levelObject.height;
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

    initializeAgent(levelNumber) {
        let positionIndex = randomInt(
            LEVELS.levels[levelNumber].startPositions.length
        );
        let startPosition =
            LEVELS.levels[levelNumber].startPositions[positionIndex];
        this.agentPosition.x = startPosition[0];
        this.agentPosition.y = startPosition[1];
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

    // Events
    draw() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                let x = this.position.x + j * CellSize;
                let y = this.position.y + i * CellSize;
                let tileState = this.getTileState(j, i);

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

function randomInt(max) {
    return Math.floor(Math.random() * max);
}