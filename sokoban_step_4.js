/* 4단계 되돌리기 & 되돌리기 취소 구현 완성 */
class MapParser {
    constructor(path){
        this.path = path;
        this.mapData = '';
        this.stages = [];
    }

    parsing(){
        this.mapData = require('fs').readFileSync(this.path, 'utf-8');
        this.stages = this.getParsedMapData(this.mapData);
    }

    getStages(){
        this.parsing();
        return this.stages;
    }

    getParsedMapData(mapData){
        const splitArray = mapData.split('\n');
        let parsedData = [];
        let oneStage = [];
        let temp = [];

        for(const line of splitArray){
            temp = this.getParsedLine(line);
            if(temp.length > 0){
                oneStage.push(temp);
            } else {
                parsedData.push(oneStage);
                oneStage = temp;
            }
        }

        parsedData.push(oneStage);
        return parsedData;
    }

    getParsedLine(line){
        if(line.includes('=')){
            return [];
        }

        if(line.includes('S')){
            return line
        }

        return line.split('');
    }
}

class SoKoBanPlayer {
    constructor(stages){
        this.stages = stages;
        this.readline;
        this.stageNum = 0;
        this.mode = 'input';
        this.stage = {};
        this.player = {};
        this.command = '';
        this.preCommand = [];
        this.undoCommand = [];
        this.IS_NOT_CLEARED = false;
        this.IS_CLEARED = true;
    }

    run(){
        this.setReadLine();
        this.showMsg('welcome');
        this.startGame();
    }

    setReadLine(){
        this.readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readline.setPrompt('🐹 SOKOBAN > ');
    }

    startGame(){
        this.gameInit();
        this.printStage();
        this.runInputProcess();
    }

    gameInit(){
        this.resetCommand();
        this.setStage();
        this.setPlayer();
    }

    resetCommand(){
        this.command = '';
        this.preCommand = [];
        this.undoCommand = [];
    }

    setStage(){
        this.stage = {};
        let stageArray = this.stages[this.stageNum];
        let mapData = this.getCopyMap(stageArray);
        let stage = {};
        stage['name'] = mapData.shift().join('');
        stage['map'] = mapData;
        stage['holePos'] = this.getHolePos(mapData);
        stage['isCleared'] = false;
        this.stage = stage;
    }

    getCopyMap(array){
        let copy = [];
        for(const line of array){
            copy.push([...line]);
        }
        return copy;
    }

    getHolePos(stageData){
        let result = [];
        let xPos = 0;
        for(const line of stageData){
            if(line.includes('O') || line.includes('0')){
                result.push(...this.getCoordinates(xPos, line));
            }
            xPos++;
        }
        return result;
    }

    getCoordinates(xPos, line){
        let result = [];
        for(let index = 0; index < line.length; index++){
            if(line[index] === 'O' || line[index] === '0'){
                result.push({ x : xPos, y : index});
            }
        }
        return result;
    }

    setPlayer(){
        this.player = {};
        let map = this.stages[this.stageNum].slice(1);
        let player = {};
        let xPos = 0;
        let yPos = 0;

        for(const line of map){
            if(line.includes('P')){
                yPos = this.getPlayerYPos(line);
                player['x'] = xPos;
                player['y'] = yPos;
                break;
            }
            xPos++;
        }

        player['currentTile'] = this.stages[xPos][yPos] === 'Ⓟ' ? 'O' : ' ';
        player['isPushed'] = false;
        this.player = player;
    }

    getPlayerYPos(line){
        let yPos = 0;
        for(const tile of line){
            if(tile === 'P') return yPos;
            yPos++;
        }
        return -1;
    }

    printStage(){
        let temp = '\n' + this.stage['name'] + '\n\n';
        for (const line of this.stage['map']) {
            for (const tile of line) {
                temp += tile;
            }
            temp += '\n';
        }
        console.log(temp);
    }

    runInputProcess(){
        this.readline.prompt();
        this.readline.on('line', function (line) {
            this.processCommend(line.replace(/(\s*)/g, ""));
            this.readline.prompt();
        }.bind(this));
        this.readline.on('close', function () {
            process.exit();
        }); 
    }

    processCommend(inputCommand){
        for(const command of inputCommand){
            if(this.runCommand(command) === this.IS_CLEARED) { 
                this.stage['isCleared'] = this.IS_CLEARED;
                break;
            }
        }

        if(this.stage['isCleared']){
            this.nextStage();
        }
    }

    runCommand(command) {
        const runFunc = this.getRunFunc(command);

        if (!runFunc) {
            this.showErrorMsg('input');
            return this.IS_NOT_CLEARED;
        }

        if(this.mode === 'input' && this.isNotUndoCommand(command)){
            this.undoCommand = [];
        }

        return runFunc();
    }

    getRunFunc(command){
        const run = {
            W: () => { return this.moveTo(-1, 0);},
            A: () => { return this.moveTo(0, -1); },
            S: () => { return this.moveTo(1, 0); },
            D: () => { return this.moveTo(0, 1); },
            R: () => { return this.restart(); },
            Q: () => { return this.theEndGame(); },
            u: () => { return this.turnBack(); },           
            U: () => { return this.cancelTurnBack(); }      
        }
        this.command = command === 'u' ? 'u' : command.toUpperCase();
        return run[this.command];
    }

    isNotUndoCommand(command){
        return command !== 'u' && command !== 'U';
    }

    moveTo(xMove, yMove){
        const xNew = this.player['x'] + xMove;
        const yNew = this.player['y'] + yMove;

        if(this.dontMove(xNew, yNew)){
            return this.IS_NOT_CLEARED;
        }

        if(this.runMoveProcess(xNew, yNew, xMove, yMove)){
            return this.isCleared();
        }

        this.showErrorMsg('obstacle');
        return this.IS_NOT_CLEARED;
    }

    dontMove(x, y){
        if(!this.checkStageRange(x, y)){
            this.showErrorMsg('outOfRange');
            return true;
        }

        if(this.isWall(x, y)){
            this.showErrorMsg('obstacle');
            return true;
        }

        return false;
    }

    checkStageRange(x, y) {
        if (x < 0 || y < 0) return false;
        if (x >= this.stage['map'].length) return false;
        if (y >= this.stage['map'][x].length) return false;
        return true;
    }

    isWall(x, y){
        return this.stage['map'][x][y] === '#';
    }

    runMoveProcess(x, y, xMove, yMove){
        const playerX = this.player['x'];
        const playerY = this.player['y'];
        const nextTile = this.stage['map'][x][y];

        if(this.canMoveTile(x, y)){
            this.preCommand.push({cmd : this.command, isPushed : false});
            this.justMove(playerX, playerY, x, y);
            return true;
        }

        if(this.isPushed(x + xMove, y + yMove)){
            this.preCommand.push({cmd : this.command, isPushed : true});
            this.stage['map'][x][y] = nextTile === 'o' ? ' ' : 'O'; 
            this.justMove(playerX, playerY, x, y);
            return true;
        }

        return false;
    }

    canMoveTile(x, y){
        let tile = this.stage['map'][x][y];
        return tile === 'O' || tile === ' ';
    }

    justMove(xOld, yOld, xNew, yNew){
        const oldTile = this.player['currentTile'];
        const newTile = this.stage['map'][xNew][yNew];
        this.stage['map'][xOld][yOld] = oldTile;
        this.stage['map'][xNew][yNew] = newTile === 'O' ? 'Ⓟ' : 'P';
        this.player['x'] = xNew;
        this.player['y'] = yNew;
        this.player['currentTile'] = newTile;

        if(this.command === 'u') return;

        this.printStage();
        this.showMoveMsg(xOld-xNew, yOld-yNew);
    }

    isPushed(x, y){
        const nextTile = this.stage['map'][x][y];

        if(this.canNotPush(nextTile)){
            return false;
        }

        this.pushBall(x, y, nextTile);
        return true;
    }

    canNotPush(tile){
        return tile === '#' || tile === 'o' || tile === '0';
    }

    pushBall(x, y, tile){
        if(tile === 'O'){
            this.stage['map'][x][y] = '0';
            return;
        }

        this.stage['map'][x][y] = 'o';
    }

    turnBack(){
        const commandInfo = this.preCommand.pop();
        const command = commandInfo ? commandInfo['cmd'] : null;
        const isPushed = commandInfo ? commandInfo['isPushed'] : null;

        if((command)){
            this.undoCommand.push({cmd:command, isPushed:isPushed});
            this.runBackToFunc(command, isPushed);
        } else {
            this.showErrorMsg('noBack');
        }

        return this.IS_NOT_CLEARED;
    }

    runBackToFunc(command, isPushed){
        const run = {
            W: () => { this.backTo(1, 0, isPushed);},
            A: () => { this.backTo(0, 1, isPushed); },
            S: () => { this.backTo(-1, 0, isPushed); },
            D: () => { this.backTo(0, -1, isPushed); },
        }
        return run[command]();
    }

    backTo(xMove, yMove, isPushed){
        const xOld = this.player['x'] + xMove;
        const yOld = this.player['y'] + yMove;
        this.justMove(this.player['x'], this.player['y'], xOld, yOld);

        if(isPushed){
            this.backPushedTile(xOld - xMove, yOld - yMove, xOld - xMove * 2, yOld - yMove * 2);
        }
        
        this.printStage();
        this.showMsg('turnBack');
    }

    backPushedTile(x, y, xPushed, yPushed){
        const pushed = this.stage['map'][xPushed][yPushed];
        const current = this.stage['map'][x][y];
        this.stage['map'][xPushed][yPushed] = pushed === 'o' ? ' ' : 'O';
        this.stage['map'][x][y] = current === 'O' ? '0' : 'o';
    }

    cancelTurnBack(){
        if(this.undoCommand.length <= 0){
            this.showErrorMsg('undo');
            return this.IS_NOT_CLEARED;
        }

        const undoInfo = this.undoCommand.pop();
        const command = undoInfo['cmd'];
        this.mode = 'undo'
        this.runCommand(command);
        this.showMsg('cancelTurnBack');
        this.mode = 'input'
        return this.IS_NOT_CLEARED;
    }

    restart(){
        this.showMsg('restart');
        this.gameInit();
        this.printStage();
        return this.IS_NOT_CLEARED;
    }

    theEndGame(){
        this.showMsg('end');
        this.readline.close();
        return this.IS_NOT_CLEARED;
    }

    isCleared(){
        const holePos = this.stage['holePos'];
        let holeX = 0;
        let holeY = 0;

        for(const hole of holePos){
            holeX = hole['x'];
            holeY = hole['y'];
            if(this.stage['map'][holeX][holeY] !== '0') {
                return this.IS_NOT_CLEARED;
            }
        }

        this.showMsg('clear');
        this.showMsg('turnCount');
        this.showMsg('inputCommands');
        return this.IS_CLEARED;
    }

    nextStage(){
        this.stageNum++;
        if(this.stageNum === this.stages.length){
            this.showMsg('allClear');
            this.theEndGame();
            return;
        }
        this.showMsg('nextStage')
        this.gameInit();
        this.printStage();
    }

    showMoveMsg(x, y) {
        let direction = '';
        if (x < 0) direction = '아래쪽';
        else if (x > 0) direction = '위쪽';
        else if (y < 0) direction = '오른쪽';
        else direction = '왼쪽'
        let result = `🛼 SOKOBAN : [${this.command}] ${direction}으로 이동합니다.`;
        console.log(result);
    }

    showErrorMsg(type) {
        const errorMsg = {
            input : '유효하지 않은 명령입니다!',
            outOfRange : '범위를 벗어났습니다.',
            obstacle : '해당 명령을 수행할 수 없습니다!',
            noBack : '돌아갈 턴이 없습니다.',
            undo : '취소할 되돌리기 이력이 없습니다.'
        }

        let msg = `🚫 SOKOBAN (경고! > ${this.command}) : ${errorMsg[type]}`;
        console.log(msg);
    }

    showMsg(type){
        let result = '🕹 SOKOBAN : ';
        const msg = {
            end : 'The End!',
            turnBack : '한 턴을 되돌렸습니다.',
            nextStage : '다음 스테이지로 이동합니다!',
            restart : 'Restart ' + this.stage['name'],
            cancelTurnBack : '되돌리기가 취소되었습니다.',
            turnCount : '소요된 턴 횟수는 ' + this.preCommand.length + '회!',
            inputCommands : '총 입력한 명령어는 [' + this.getInputCommands() + ']',
            clear : '빠밤! ^-^)b ' + this.stage['name'] + ' 클리어!',
            allClear : '전체 게임을 클리어하셨습니다! 축하드립니다!',
            welcome : '소코반의 세계에 오신 것을 환영합니다! \\(^ㅁ^)/'
        }
        result += msg[type];
        console.log(result);
    }

    getInputCommands(){
        let result = [];
        for(const cmdInfo of this.preCommand){
            result.push(cmdInfo['cmd']);
        }
        return result;
    }
}

const mapParser = new MapParser('./map.txt');
const stagesInfo = mapParser.getStages();
const gamePlayer = new SoKoBanPlayer(stagesInfo);

gamePlayer.run();