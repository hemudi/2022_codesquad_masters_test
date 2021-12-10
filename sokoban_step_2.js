/* 2단계 구현 완성 */
class SoKoBanGame {
    constructor(stageStr) {
        this.stageStr = stageStr;
        this.stageName = '';
        this.stageMap = [];
        this.playerPosition = {
            x: 0,
            y: 0
        }
        this.readline;
    }

    gameStart() {
        this.init();
        this.runInputProcess();
    }

    init() {
        this.setStageMap();
        this.printStage();
        this.findPlayerPosition();
        this.setReadLine();
    }

    setReadLine(){
        this.readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    setStageMap() {
        let tempArr = this.stageStr.split('\n');
        this.stageName = tempArr.shift();

        for (const line of tempArr) {
            this.stageMap.push(line.split(''));
        }
    }

    printStage() {
        let temp = '\n' + this.stageName + '\n\n';
        for (const line of this.stageMap) {
            for (const icon of line) {
                temp += icon;
            }
            temp += '\n';
        }
        console.log(temp);
    }

    findPlayerPosition() {
        let xPos = 0;
        for (const line of this.stageMap) {
            for (let yPos = 0; yPos < line.length; yPos++) {
                if (line[yPos] != 'P') continue;
                this.setPlayerPosition(xPos, yPos);
                return;
            }
            xPos++;
        }
    }

    setPlayerPosition(x, y) {
        this.playerPosition['x'] = x;
        this.playerPosition['y'] = y;
    }

    runInputProcess() {
        this.readline.setPrompt('🐹 SOKOBAN > ');
        this.readline.prompt();
        this.readline.on('line', function (line) {
            this.gameProgress(line.replace(/(\s*)/g, ""));
            this.readline.prompt();
        }.bind(this));
        this.readline.on('close', function () {
            process.exit();
        }); 
    }

    gameProgress(inputCommand) {
        for (const command of inputCommand) {
            this.runCommand(command);
        }
    }

    runCommand(command) {
        const run = {
            w: () => { this.moveTo(1, 0); },
            a: () => { this.moveTo(0, 1); },
            s: () => { this.moveTo(-1, 0); },
            d: () => { this.moveTo(0, -1); },
            q: () => { this.theEndGame(); }
        }

        if ((command in run) === false) {
            this.printStage();
            this.showErrorMsg('input');
            return;
        }

        run[command]();
    }

    moveTo(x, y) {
        const xOld = this.playerPosition['x'];
        const yOld = this.playerPosition['y'];
        const xNew = xOld - x;
        const yNew = yOld - y;

        if (this.checkStageRange(xNew, yNew) === false) {
            this.showErrorMsg('outOfRange');
            return;
        }

        if (this.isCanMove(xNew, yNew) === false) {
            this.showErrorMsg('obstacle');
            return;
        }

        this.setPlayerPosition(xNew, yNew);
        this.stageMap[xNew][yNew] = 'P';
        this.stageMap[xOld][yOld] = ' ';
        this.printStage();
        this.showMoveMsg(x, y);
    }

    checkStageRange(x, y) {
        if (x < 0 || y < 0) return false;
        if (x >= this.stageMap.length) return false;
        if (y >= this.stageMap[x].length) return false;
        return true;
    }

    isCanMove(x, y) {
        const value = this.stageMap[x][y];
        const obstacle = '#Oo';
        if (obstacle.includes(value)) return false;
        return true;
    }

    showMoveMsg(x, y) {
        let direction = '';
        if (x < 0) direction = '아래쪽';
        else if (x > 0) direction = '위쪽';
        else if (y < 0) direction = '오른쪽';
        else direction = '왼쪽'
        console.log(direction + '으로 이동합니다.\n');
    }

    theEndGame() {
        console.log('Bye~');
        this.readline.close();
    }

    showErrorMsg(type) {
        let msg = '(경고!) '
        switch (type) {
            case 'input':
                msg += '유효하지 않은 명령입니다!';
                break;
            case 'outOfRange':
            case 'obstacle':
                msg += '해당 명령을 수행할 수 없습니다!';
                break;
        }

        this.printStage();
        console.log(msg + '\n');
    }
}

const allStageInfo = "Stage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########"
const stage2 = new SoKoBanGame(allStageInfo);
stage2.gameStart();