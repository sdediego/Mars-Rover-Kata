// ======================
// Rover Object Goes Here

function Rover(id, position, direction) {
    this.id = id;
    this.position = position;
    this.direction = direction;
    this.travelLog = new Array();
}

Rover.prototype.initialRoverPosition = function() {
    var initialPosition, positionWithObstacle;
    do {
        initialPosition = randomGridPosition();
        positionWithObstacle = anyTypeOfObstacle(initialPosition);
    } while(positionWithObstacle);

    this.position = initialPosition;
    this.travelLog.push(initialPosition);
    console.log('Rover ' + this.id + ' initial position: ' + this.position );
}

// Total Rovers Deployed
var RoversDeployed = new Array();


// ======================
// Rover Dynamics Goes Here.

// Rover posible directions.
// The order is important for the Rover direction turns.
var RoverDirection = new Array('N', 'E', 'S', 'W');

// Rover direction turn.
function turnRover(rover, direction) {
    var turnDirection;
    switch (direction) {
        case 'left':
            turnDirection = -1;
            break;
        case 'right':
            turnDirection = 1;
            break;
        default:
            console.log('Rover turn direction must be either "left" or "right".');
            return;
    }
    // Get new direction and check the limits.
    var currentDirection = RoverDirection.indexOf(rover.direction);
    var newDirection = currentDirection + turnDirection;
    newDirection = newDirection < 0 ? RoverDirection.length - 1 : (newDirection > RoverDirection.length ? 0 : newDirection);
    rover.direction = RoverDirection[newDirection];
    console.log('Rover ' + rover.id + ' new direction: ' + rover.direction);
}

function turnLeft(rover) {
  console.log("turnLeft was called!");
  turnRover(rover, 'left');
}

function turnRight(rover) {
  console.log("turnRight was called!");
  turnRover(rover, 'right');
}

// Rover displacement.
function moveRover(rover, direction) {
    var step;
    switch (direction) {
        case 'forward':
            step = 1;
            break;
        case 'backward':
            step = -1;
            break;
        default:
            console.log('Rover must move either "forward" or "backward".');
            return;
    }

    var finalPosition = rover.position.slice(0);
    switch (rover.direction) {
        case 'N':
            finalPosition[0] += step;
            break;
        case 'E':
            finalPosition[1] += step;
            break;
        case 'S':
            finalPosition[0] -= step;
            break;
        case 'W':
            finalPosition[1] -= step;
            break;
    }
    // Check if finalPosition is within the grid limits.
    for (var i = 0; i <= 1; i++) {
        finalPosition[i] = finalPosition[i] < 0 ? 9 : (finalPosition[i] > 9 ? 0 : finalPosition[i]);
    }
    // Check if finalPosition cannot be reached.
    if (anyTypeOfObstacle(finalPosition)) {
        console.log('Rover cannot reach the position due to an obstacle.');
    } else {
        rover.position = finalPosition;
        rover.travelLog.push(finalPosition);
        console.log('Rover ' + rover.id + ' has reached the position: ' + rover.position);
    }
}

function moveForward(rover) {
  console.log("moveForward was called!");
  moveRover(rover, 'forward');
}

function moveBackward(rover) {
  console.log("moveBackward was called!");
  moveRover(rover, 'backward');
}

// ======================
// Grid And Obstacles Go Here.

// Two dimensional 10x10 grid.
// 0 form empty and 1 for occupied coordinates.
var twoDimensionalGrid  = new Array(10);
for (var i = 0; i < twoDimensionalGrid.length; i++) {
    twoDimensionalGrid[i] = new Array(10).fill(0);
}

// Generate random grid coordinates and position.
function randomGridVariablePosition() {
    return Math.floor(Math.random() * 10);
}

function randomGridPosition() {
    var x = randomGridVariablePosition();
    var y = randomGridVariablePosition();
    var position = new Array(x, y);
    // x and y coordinates default to (0,0).
    return position ? position : new Array(0, 0);
}

// Obstacles and other rovers in the grid.
function createObstacles(numberOfObstacles) {
    while (numberOfObstacles) {
        position = randomGridPosition();
        if (anyTypeOfObstacle(position)) {
            continue;
        } else {
            twoDimensionalGrid[position[0]][position[1]] = 1;
            numberOfObstacles--;
            console.log('Obstacle created at position ' + position);
        }
    }
}

// Check obstacles in the grid.
function thereIsObstacle(position) {
    if (twoDimensionalGrid[position[0]][position[1]] === 1) {
        return true;
    }
    return false;
}

// Check other Rovers in the grid.
function thereIsRover(position) {
    for (rover in RoversDeployed) {
        if (rover.position == position) {
            return true;
        }
    }
    return false;
}

// Total obstacles in the grid.
function anyTypeOfObstacle(position) {
    return thereIsObstacle(position) || thereIsRover(position);
}

// ======================
// Rover Control Goes Here.
function commandsListRover(rover, commandsList) {
    for (var i = 0; i < commandsList.length; i++) {
        var command = commandsList[i];
        switch (command) {
            case 'f':
                moveForward(rover);
                break;
            case 'b':
                moveBackward(rover);
                break;
            case 'l':
                turnLeft(rover);
                break;
            case 'r':
                turnRight(rover);
                break;
            default:
                console.log('Valid commands are: "f", "b", "l" or "r".');
                break;
        }
    }
}


// ======================
// Initialization and Rover Control Go Here.

// Set grid obstacles.
createObstacles(7);

// Create new rovers.
var numberOfRovers = 3;
for (var id = 1; id <= numberOfRovers; id++) {
    var initialPosition = new Array(0, 0);
    var initialDirection = 'N';
    var newRover = new Rover(id, initialPosition, initialDirection);
    RoversDeployed.push(newRover);
}

// Land rovers and send commands list.
var commandsList = new Array('rffrfflfrff', 'lflrffrfrbb', 'rblrffrfrbf');
for (var i = 0; i <= RoversDeployed.length - 1; i++) {
    RoversDeployed[i].initialRoverPosition();
    commandsListRover(RoversDeployed[i], commandsList[i]);
}

// Check rovers travel log.
for (var i = 0; i <= RoversDeployed.length - 1; i++) {
    console.log('Rover ' + RoversDeployed[i].id + ' travel log:\n');
    for (var j = 0; j < RoversDeployed[i].travelLog.length; j++) {
        console.log(RoversDeployed[i].travelLog[j] + '\n');
    }
}
