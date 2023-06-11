class FrozenLakeEnvironment {
    constructor(context, levelNumber) {
        this.context = context;

        this.rows = undefined;
        this.columns = undefined;
        this.numStates = undefined;
        this.numActions = undefined;
        this.epochs = undefined;
        this.newEpoch = undefined;

        this.agentPosition = {
            x: undefined,
            y: undefined,
        };
        this.finishPosition = {
            x: undefined,
            y: undefined,
        };
        this.holePositions = [];

        this.initialize(levelNumber);
    }

    initialize(levelNumber) {
        this.numStates = this.rows * this.columns;
        this.numActions = 4;
        this.epochs = 0;
        this.newEpoch = true;

        this.loadLevel(levelNumber);
    }

    loadLevel(levelNumber) {
        fetch("../levels.json")
            .then((response) => response.json())
            .then((data) => {
                let levelObject = data["levels"][levelNumber];
                this.rows = levelObject["width"];
                this.columns = levelObject["height"];
                this.agentPosition.x = levelObject["startPosition"][0]
                this.agentPosition.y = levelObject["startPosition"][1];
                this.finishPosition.x = levelObject["finishPosition"][0];
                this.finishPosition.y = levelObject["finishPosition"][1];
                for (var i = 0; i < levelObject["holesPositions"].length; i++) {
                    let position = levelObject["holesPositions"][i];
                    let hole = {
                        x: position[0],
                        y: position[1],
                    };
                    this.holePositions.push(hole);
                }
            }).catch((_) => {
                this.rows = 0;
                this.columns = 0;
                console.error("Failed to load level due to misformatted data.");
            });
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
}

export default FrozenLakeEnvironment;