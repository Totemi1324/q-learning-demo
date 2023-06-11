import { ActionType } from "../shared/actions.js";

import { createMatrix } from "../shared/create_matrix.js";
import { positionOfMaximum } from "../shared/position_of_maximum.js";

class QLearning {
    constructor(environment) {
        this.environment = environment;
        this.gamma = 0.9;
        this.epsilon = 0.1;
        this.alpha = 1;
        this.numActions = this.environment.numActions;
        this.qTable = createMatrix(umwelt.numStates, this.numActions, 0);
        this.numSteps = 0;
    }

    chooseAction(stateNumber) {
        const qTableRow = this.qTable[stateNumber];
        var actionNumber;

        if (everyElementIsEqual(qTableRow) || Math.random() < this.epsilon) {
            actionNumber = randomInt(this.numActions);
        } else {
            actionNumber = positionOfMaximum(qTableRow);
        }

        return actionNumber;
    }

    actionNumberToType(actionNumber) {
        switch (actionNumber) {
            case 0:
                return ActionType.Up;
            case 1:
                return ActionType.Down;
            case 2:
                return ActionType.Left;
            case 3:
                return ActionType.Right;
        }
    }

    updateQ(stateNumber, actionNumber, followingStateNumber, reward) {
        const qTableRowOfFollowingState = this.qTable[followingStateNumber];
        const maxQ = Math.max(qTableRowOfFollowingState);
        const qNew = reward + this.gamma * maxQ;
        this.qTable[stateNumber][actionNumber] = qNew;
    }

    // Lifecycle events
    update() {
        const stateNumber = this.environment.currentStateNumber();
        const actionNumber = this.chooseAction(stateNumber);
        this.environment.makeAction(this.actionNumberToType(actionNumber));
        const followingStateNumber = this.environment.currentStateNumber();
        const reward = this.environment.getReward();

        if (!this.environment.newEpoch) {
            this.updateQ(
                stateNumber,
                actionNumber,
                followingStateNumber,
                reward
            );
            this.numSteps += 1;
        }
    }
}

function everyElementIsEqual(array) {
    return array.every((v) => v === array[0]);
}

function randomInt(maximum) {
    const r = Math.floor(Math.random() * maximum);
    if (r == maximum) {
        return maximum - 1;
    } else {
        return r;
    }
}