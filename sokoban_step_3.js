/* 3단계 구현 완성 */
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
        this.stage = {};
        this.player = {};
        this.command = '';
        this.IS_NOT_CLEARED = false;
        this.IS_CLEARED = true;
    }

    run(){
        console.log('소코반의 세계에 오신 것을 환영합니다!\n^ㅁ^)/');
        this.setReadLine();
        this.startGame();
    }

    setReadLine(){
        this.readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    startGame(){
        this.gameInit();
        this.printStage();
        this.runInputProcess();
    }

    gameInit(){
        this.setStage();
        this.setPlayer();
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

        player['move'] = 0;
        player['currentTile'] = ' ';
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
        this.readline.setPrompt('🐹 SOKOBAN > ');
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
        const run = {
            W: () => { return this.moveTo(-1, 0);},
            A: () => { return this.moveTo(0, -1); },
            S: () => { return this.moveTo(1, 0); },
            D: () => { return this.moveTo(0, 1); },
            R: () => { return this.restart(); },
            Q: () => { return this.theEndGame(); }
        }

        this.command = command = command.toUpperCase();

        if ((command in run) === false) {
            this.printStage();
            this.showErrorMsg('input');
            return this.IS_NOT_CLEARED;
        }

        return run[command]();
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
            this.justMove(playerX, playerY, x, y);
            return true;
        }

        if(this.isPushed(x + xMove, y + yMove)){
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
        this.player['move']++;
        this.player['currentTile'] = newTile;
        this.printStage();
        this.showMoveMsg(xOld-xNew, yOld-yNew);
    }

    isPushed(x, y){
        const nextTile = this.stage['map'][x][y];

        if(this.canNotPush(nextTile)){
            this.showErrorMsg('obstacle');
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

    restart(){
        console.log('\nRestart > ' + this.stage['name']);
        this.gameInit();
        this.printStage();
        return this.IS_NOT_CLEARED;
    }

    theEndGame(){
        console.log('The End!');
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
            if(this.stage['map'][holeX][holeY] !== '0') return this.IS_NOT_CLEARED;
        }

        console.log('빠밤! ^-^)b ' + this.stage['name'] + ' 클리어!');
        console.log('턴수 : ' + this.player['move'] + '\n');

        return this.IS_CLEARED;
    }

    nextStage(){
        this.stageNum++;
        if(this.stageNum === this.stages.length){
            console.log('전체 게임을 클리어하셨습니다!\n축하드립니다!');
            this.theEndGame();
            return;
        }
        console.log('다음 스테이지로 이동합니다!');
        this.gameInit();
        this.printStage();
    }

    showMoveMsg(x, y) {
        let direction = '';
        if (x < 0) direction = '아래쪽';
        else if (x > 0) direction = '위쪽';
        else if (y < 0) direction = '오른쪽';
        else direction = '왼쪽'
        console.log('['+ this.player['move']  +'] ' + this.command + ' : ' + direction + '으로 이동합니다.\n');
    }

    showErrorMsg(type) {
        const errorMsg = {
            input : '유효하지 않은 명령입니다!',
            outOfRange : '범위를 벗어났습니다.',
            obstacle : '해당 명령을 수행할 수 없습니다!'
        }

        let msg = this.command + ' : (경고!) ' + errorMsg[type];

        this.printStage();
        console.log(msg + '\n');
    }
}

const mapParser = new MapParser('./map.txt');
const stagesInfo = mapParser.getStages();
const gamePlayer = new SoKoBanPlayer(stagesInfo);

gamePlayer.run();