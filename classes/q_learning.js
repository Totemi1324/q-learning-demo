import { ActionType } from "../shared/actions.js";
import { paused, stepsField } from "../main.js";

import { createMatrix } from "../shared/create_matrix.js";
import { positionOfMaximum } from "../shared/position_of_maximum.js";
import { randomInt } from "../shared/random_int.js";

class QLearning {
    constructor(environment, {gamma, epsilon}) {
        this.environment = environment;
        this.gamma = undefined;
        this.epsilon = undefined;
        this.numActions = undefined;
        this.qTable = undefined;
        this.numSteps = undefined;

        this.initialize(gamma, epsilon);
    }

    initialize(gamma, epsilon) {
        this.setConstants(gamma, epsilon);
        this.resetMemory();
    }

    setConstants(gamma, epsilon) {
        this.gamma = gamma;
        this.epsilon = epsilon;
    }

    resetMemory() {
        this.numActions = this.environment.numActions;
        this.qTable = createMatrix(this.environment.numStates, this.numActions, 0);
        this.numSteps = 0;
    }

    getQForState(stateNumber) {
        return this.qTable[stateNumber];
    }

    chooseAction(stateNumber) {
        const qTableRow = this.getQForState(stateNumber);
        var actionNumber;

        if (everyElementIsEqual(qTableRow) || Math.random() < this.epsilon) { //TODO: Decrease epsilon
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
        const maxQ = Math.max(...qTableRowOfFollowingState);
        const qNew = reward + this.gamma * maxQ;
        this.qTable[stateNumber][actionNumber] = qNew;
    }

    // Lifecycle events
    update(pauseAllowed = true) {
        if (paused && pauseAllowed) {
            return;
        }

        stepsField.value = this.numSteps.toString();
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

export default QLearning;

function everyElementIsEqual(array) {
    return array.every((v) => v === array[0]);
}
