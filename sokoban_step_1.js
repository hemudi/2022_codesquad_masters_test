/* 1단계 구현 완성 */
const allStageInfo = "Stage 1\n#####\n#OoP#\n#####\n=====\nStage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########"

const icons = {
    '#' : 0,
    O : 1,
    o : 2,
    P : 3,
    '=' : 4,
    0 : '#',
    1 : 'O',
    2 : 'o',
    3 : 'P',
    4 : '=',
    ' ' : ' '
}

function printMap(mapData){
    const convertedData = convertMapData(mapData);
    const stageArray = splitStage(convertedData);
    let stageObj;
    let count = 1;

    for(const stage of stageArray){
        stageObj = createStage(stage, count++);
        console.log(stageObj.toStringStage());
    }
}

function convertMapData(mapData){
    let splitArray = mapData.split('\n');
    let resultArray = [];

    for(line of splitArray){
        if(line.includes('Stage')){ continue; }
        resultArray.push(getConvertedLine(line));
    }

    return resultArray;
}

function getConvertedLine(line){
    let result = [];
    for(const icon of line){
        if(icon in icons){
            result.push(icons[icon]);
        } else {
            result.push(icon);
        }
    }
    return result;
}

function splitStage(convertedData){
    let result = [];
    let tempArray = [];
    for(const line of convertedData){
        if(line[0] === 4){
            result.push(tempArray);
            tempArray = [];
            continue;
        }
        tempArray.push(line);
    }

    if(tempArray.length > 0){
        result.push(tempArray);
    }

    return result;
}

function createStage(stageArray, num){
    const stage = new Stage('Stage ' + num);
    let width = 0;
    let xIndex = 1;
    let yIndex = 1;
    let originMap = '';

    for(const line of stageArray){
        if(width < line.length){
            width = line.length;
        }

        for(const icon of line){
            runIconProcess(icon, stage, yIndex, xIndex);
            originMap += icons[icon];
            xIndex++;
        }

        originMap += '\n';
        xIndex = 1;
        yIndex++;
    }

    stage.setSize(width, stageArray.length);
    stage.setMap(originMap);
    return stage;
}

function runIconProcess(icon, stage, yIndex, xIndex){
    const func = {
        1 : () => {stage.plusHallCount()},
        2 : () => {stage.plusBallCount()},
        3 : () => {stage.setPlayerPoint(yIndex, xIndex)}
    }

    if(icon in func){
        func[icon]();
    }
}

class Stage {
    constructor(name){
        this.name = name;
        this.map = '';
        this.width;
        this.height;
        this.ballCount = 0;
        this.hallCount = 0;
        this.playerPoint = {
            x : 0,
            y : 0
        }
    }

    plusBallCount(){
        this.ballCount++;
    }

    plusHallCount(){
        this.hallCount++;
    }

    setCount(ball, hall){
        this.ballCount = ball;
        this.hallCount = hall;
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
    }

    setPlayerPoint(y, x){
        this.playerPoint['x'] = x;
        this.playerPoint['y'] = y;
    }

    setMap(map){
        this.map = map;
    }

    toStringStage(){
        return this.name + '\n\n'
             + this.map + '\n'
             + '가로크기 : ' + this.width
             + '\n세로크기 : ' + this.height
             + '\n구멍의 수 : ' + this.hallCount
             + '\n공의 수 : ' + this.ballCount 
             + '\n플레이어 위치 (' + this.playerPoint['y'] + ', ' + this.playerPoint['x'] + ')\n\n';
    }
}

printMap(allStageInfo);