# 2022 코드스쿼드 마스터즈코스 1차 테스트 저장소
---
# __🐹 소코반 구현하기__
# __1단계 : 지도 데이터 출력하기__

## __🛠 구현 기능__
- [x] 1. 입력된 문자열 형식의 지도 데이터를 읽어 2차원 배열로 변환하여 저장
- [X] 2. 지도의 크기, 구멍과 공의 수, 플레이어의 위치 등의 정보를 분석
- [X] 3. 분석한 정보와 함께 지도 출력


## __💬 코딩 요구 사항__
- [X] 컴파일 또는 실행이 가능해야함
- [X] 자기만의 기준으로 최대한 간결하게 코드 작성

## __📝 풀이 과정__
### __✅ 1. 입력된 문자열을 변환하여 2차원 배열로 저장__
- icons 객체를 만들어 기호와 변환 할 저장값을 1대 1 관계로 관리

```js
const icons = {
    // 변환용
    '#' : 0,
    O : 1,
    o : 2,
    P : 3,
    '=' : 4,
    // 역변환용
    0 : '#',
    1 : 'O',
    2 : 'o',
    3 : 'P',
    4 : '=',
    ' ' : ' '
}
```
- __변환 알고리즘__
  1. 입력된 문자열을 \n 으로 한 줄 씩 나눠서 배열에 저장
  2. 배열을 순회하며 스테이지 이름을 제외하고 한 줄 씩 변환
      - icons 에 존재하는 기호면 icons[기호] 로 불러온 값을 저장
      - icons 에 존재 안하면 그대로 저장
  3. 결과를 반환

```js
function convertMapData(mapData){
    let splitArray = mapData.split('\n');   // \n 으로 나눠서 저장
    let resultArray = [];

    // 한 줄 씩 순회
    for(line of splitArray){
        if(line.includes('Stage')){ continue; }     // 스테이지 이름의 경우 지나침
        resultArray.push(getConvertedLine(line));   // 한 줄 씩 변환해서 결과 배열에 저장
    }

    return resultArray;
}
```
```js
function getConvertedLine(line){
    let result = [];

    // 입력 된 한 줄의 문자열 순회
    for(const icon of line){
        if(icon in icons){
            result.push(icons[icon]);   // icons 에 존재하면 변환값 저장
        } else {
            result.push(icon);          // 존재 안하면 그대로 저장
        }
    }
    return result;
}
```

- __입력 값__

```js
Stage 1\n#####\n#OoP#\n#####\n=====\nStage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########
```

- __반환 값__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/543c30949b8143d31540c85cdce5877aa142f874/1%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%25AC%25B8%25EC%259E%2590%25EC%2597%25B4%2520%25EB%25B3%2580%25ED%2599%2598%2520%25EA%25B2%25B0%25EA%25B3%25BC%2520%25EC%25B6%259C%25EB%25A0%25A5.png)

### __✅ 2. 지도의 정보 분석__

  1. 위에서 구한 convertedData 2차원 배열에서 구분자(4)를 이용해 스테이지를 분리하여 스테이지 배열에 저장
  2. 스테이지의 정보를 분석 후 담은 Stage 객체를 생성
```js
const stageArray = splitStage(convertedData);  // 1. 분리
...
for(const stage of stageArray){
    stageObj = createStage(stage, count++);    // 2. stage 객체 생성
    ...
}
```

### __스테이지 분리__
```js
function splitStage(convertedData){
    let result = [];        // 최종 결과
    let tempArray = [];     // 임시 배열

    // 한 줄 씩 순회
    for(const line of convertedData){

        // 이번 라인의 첫번째 값이 4라면 => 구분 라인
        if(line[0] === 4){
            result.push(tempArray);     // 임시 배열 => 최종 배열에 push
            tempArray = [];
            continue;
        }

        // 구분 라인이 아니면 임시 배열에 push
        tempArray.push(line);
    }

    // 임시 배열이 비워져 있으면 최종 결과 배열에 push
    if(tempArray.length > 0){
        result.push(tempArray);
    }

    return result;
}
```
### __Stage Class__
```js
class Stage {
    constructor(name){
        this.name = name;       // 스테이지 이름
        this.map = '';          // map 문자열 데이터
        this.width;             // 가로 크기
        this.height;            // 세로 크기
        this.ballCount = 0;     // 공 개수
        this.hallCount = 0;     // 구멍 개수
        this.playerPoint = {    // 플레이어 위치
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
```
### __스테이지 배열을 분석하여 Stage 객체 생성__
1. Stage Class 로 스테이지의 정보를 담을 빈 Stage 객체 생성
2. 2중 for 문으로 한 라인과 그 라인의 아이콘 하나씩 탐색
3. 하나의 라인을 탐색할때마다 width(가장 긴 라인) 갱신
4. 하나의 아이콘을 탐색할때마다 각 아이콘에 따른 함수 실행

```js
function createStage(stageArray, num){
    const stage = new Stage('Stage ' + num);
    let width = 0;
    let xIndex = 1;
    let yIndex = 1;
    let originMap = '';

    // 배열 한 라인 씩 순회
    for(const line of stageArray){
        if(width < line.length){        // 가로 길이 : 가장 긴 라인의 길이로 설정
            width = line.length;
        }

        // 라인의 아이콘 하나씩 순회
        for(const icon of line){
            runIconProcess(icon, stage, yIndex, xIndex);  // 각 아이콘에 따른 처리 실행
            originMap += icons[icon];                     // 원본 문자열 복원
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
```
```js
/* 아이콘별 처리 함수 실행 */
function runIconProcess(icon, stage, yIndex, xIndex){
    const func = {
        1 : () => {stage.plusHallCount()},                  // 구멍 개수 + 1
        2 : () => {stage.plusBallCount()},                  // 공 개수 + 1
        3 : () => {stage.setPlayerPoint(yIndex, xIndex)}    // 플레이어 위치 설정
    }

    if(icon in func){
        func[icon]();
    }
}
```

### __객체 생성 결과__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/faf2d224dfb9cf2d008b5f80ae56a3bf17942b49/1%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25A0%2595%25EB%25B3%25B4%2520%25EB%25B6%2584%25EC%2584%259D%2520%25EA%25B0%259D%25EC%25B2%25B4_1.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/faf2d224dfb9cf2d008b5f80ae56a3bf17942b49/1%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25A0%2595%25EB%25B3%25B4%2520%25EB%25B6%2584%25EC%2584%259D%2520%25EA%25B0%259D%25EC%25B2%25B4_2.png)



### __✅  3. 분석한 정보 출력__

- Stage Class 내에 선언한 Stage 객체 정보 출력용 함수 toStringStage() 를 이용해 출력

```js
function printMap(mapData){
    const convertedData = convertMapData(mapData);  // 1. 변환
    const stageArray = splitStage(convertedData);   // 2. 분리
    let stageObj;
    let count = 1;

    for(const stage of stageArray){
        stageObj = createStage(stage, count++); // 3. 분석
        console.log(stageObj.toStringStage());  // 4. 출력
    }
}
```
```js
toStringStage(){
        return this.name + '\n\n'
             + this.map + '\n'
             + '가로크기 : ' + this.width
             + '\n세로크기 : ' + this.height
             + '\n구멍의 수 : ' + this.hallCount
             + '\n공의 수 : ' + this.ballCount 
             + '\n플레이어 위치 (' + this.playerPoint['y'] + ', ' + this.playerPoint['x'] + ')\n\n';
    }
```


## __🎬 최종 실행 결과__
```js
const allStageInfo = "Stage 1\n#####\n#OoP#\n#####\n=====\nStage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########"

printMap(allStageInfo); // 실행
```

![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/057626988d6e890cbf9b1351f1bf54b5e4440bc6/1%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25B5%259C%25EC%25A2%2585%25EA%25B2%25B0%25EA%25B3%25BC.png)

---

# __2단계__
## __🛠 구현 기능__
- [X] 스테이지의 지도 출력
- [X] 간단한 프롬프트 표시 
- [X] 사용자로부터 한 줄의 명령어를 입력 받기
- [X] 입력 받은 명령어를 순서대로 처리
- [X] 지정된 명령어 외의 입력은 예외처리
- [X] W A S D 가 입력되면 각각 위, 왼쪽, 아래, 오른쪽 방향으로 한 칸씩 플레이어 이동
- [X] 벽이나 공 등의 다른 물체에 부딪히면 해당 명령을 수행할 수 없습니다 메시지 출력
---
## __💬 코딩 요구 사항__
- [X] 너무 크지 않은 함수 단위로 구현하고 중복된 코드 지양
- [X] 전역변수의 사용을 자제
- [X] 객체 또는 배열을 적절히 활용

## __📝 풀이 과정__
### __✅   1. SoKoBanGame Class__
- 맵 정보 문자열을 하나 입력받아 게임을 실행하는 클래스
- 생성 후 gameStart() 로 실행

### __대략적인 실행 순서도__
<img src="https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/b821a41ec17bd4be1ed1de2da59f2f370cdd14d4/sokomo%2520class%2520%25EC%258B%25A4%25ED%2596%2589%25EC%2588%259C%25EC%2584%259C.png"  width="1000">

1. 초기 설정
   1. 스테이지 문자열 데이터 2차원 배열로 저장
   2. 스테이지 출력
   3. 플레이어 초기 위치 찾아 설정
   4. 입력 모듈 생성
2. 입력 프로세스 실행
   1. 입력 받음
   2. 입력받은 문자열 순차 실행
      1. wasd의 경우 플레이어 이동 함수 실행
      2. q의 경우 프로그램 종료 함수 실행
  
### __✅   1. 스테이지 지도 출력__
- 문자열로 입력받은 스테이지 데이터를 2차원 배열로 변환
- 변환 한 2차원 배열을 2중 for 문을 이용해 호출

```js
/* 입력된 문자열을 2차원 배열로 변환 */
setStageMap() {
    let tempArr = this.stageStr.split('\n'); // \n 으로 분리 1차
    this.stageName = tempArr.shift();        // 첫번째 라인은 이름이므로 별도로 저장

    for (const line of tempArr) {
        this.stageMap.push(line.split(''));  // 한 글자씩 2차 분리
    }
}
```
```js
/* 2차원 배열의 스테이지를 출력 */
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
```

### __✅   2. 사용자로부터 입력받은 명령어 순서대로 처리__

### __입력 프로세스 실행__
- readline 을 사용해 프롬프트 설정, 사용자로부터 한 줄의 문자열을 입력 받음
- 입력 받은 문자열을 gameProgress 로 전달하여 한 글자씩 실행
```js
/* 입력 프로세스 */
runInputProcess() {
    this.readline.setPrompt('🐹 SOKOBAN > ');             // 프롬프트 설정
    this.readline.prompt();
    this.readline.on('line', function (line) {            // line 입력 받음 
        this.gameProgress(line.replace(/(\s*)/g, ""));    // 공백 문자 제거 후 gameProgress 실행
        this.readline.prompt();
    }.bind(this));
    this.readline.on('close', function () {
        process.exit();
    }); 
}
```
```js
/* 명령어 문자열을 순회하며 명령어를 하나씩 처리 */
gameProgress(inputCommand) {
    for (const command of inputCommand) {
        this.runCommand(command);
    }
}
```
### 명령어 실행
- 명령어에 따른 처리 함수를 가지고 있는 run 객체를 생성
- 입력된 명령어가 run 객체의 key 로 있는지로 유효성 체크하여 예외처리
- 유효한 명령어면 명령어별 처리 함수 실행
  
```js
/* 각 명령어에 따른 함수 실행 */
runCommand(command) {
    const run = {
        w: () => { this.moveTo(1, 0); },    // 위로 이동
        a: () => { this.moveTo(0, 1); },    // 왼쪽으로 이동
        s: () => { this.moveTo(-1, 0); },   // 아래로 이동
        d: () => { this.moveTo(0, -1); },   // 오른쪽으로 이동
        q: () => { this.theEndGame(); }     // 게임 종료
    }

    // 유효한 명령어인지 체크
    if ((command in run) === false) {
        this.printStage();
        this.showErrorMsg('input');
        return;
    }

    run[command]();
}
```
### __✅  3. 플레이어 이동 & 충돌 처리__
1. 맵의 범위를 벗어났는지 아닌지 체크
   1. 벗어남 => outOfRange 에러 메세지 출력 => 종료
2. 이동할 수 있는 곳인지 체크
   1. 이동하고자 하는 위치의 값 구함
   2. 해당 값이 '#Oo' 에 포함되는지 체크
      1. 포함됨 => 에러메세지 출력 => 종료
3. 이동 가능
   1. 플레이어 현재 위치 변경
   2. 이동한 위치 값 P로 변경
   3. 본래 있던 위치 빈칸으로 설정
   4. 이동 완료 메세지 출력
```js
/* 입력된 x, y 값 만큼 해당 방향으로 이동 */
moveTo(x, y) {
    const xOld = this.playerPosition['x'];  // 현재 x 좌표
    const yOld = this.playerPosition['y'];  // 현재 y 좌표
    const xNew = xOld - x;  // 이동할 곳의 x 좌표
    const yNew = yOld - y;  // 이동할 곳의 y 좌표

    // 범위 유효성 체크
    if (this.checkStageRange(xNew, yNew) === false) {
        this.showErrorMsg('outOfRange');
        return;
    }

    // 이동할 수 있는 곳인지 체크
    if (this.isCanMove(xNew, yNew) === false) {
        this.showErrorMsg('obstacle');  // 이동 불가능 메세지 출력
        return;
    }

    this.setPlayerPosition(xNew, yNew); // 현재 플레이어 위치를 새로운 좌표로 설정
    this.stageMap[xNew][yNew] = 'P';    // 이동한 곳을 P로 변경
    this.stageMap[xOld][yOld] = ' ';    // 본래 있던 곳을 빈칸으로 설정
    this.printStage();                  // 맵 출력
    this.showMoveMsg(x, y);             // 이동 완료 메세지 출력
}
```
```js
// 범위 체크
checkStageRange(x, y) {
    if (x < 0 || y < 0) return false;
    if (x >= this.stageMap.length) return false;
    if (y >= this.stageMap[x].length) return false;
    return true;
}
```
```js
// 이동 가능한 위치인지 판별
isCanMove(x, y) {
    const value = this.stageMap[x][y];          // 이동하려는 곳의 타일 값
    const obstacle = '#Oo';                     // 장애물 타일
    if (obstacle.includes(value)) return false; // 장애물에 포함되면 불가능
    return true;
}
```

### __✅  4. 게임 종료__
- q 가 입력되면 readline.close() 함수를 호출하는 theEndGame() 을 실행
```js
runCommand(command) {
    const run = {
        ...
        q: () => { this.theEndGame(); } // 종료 명령어 입력 시 실행
    }
    ...
    run[command]();
}

theEndGame() {
    console.log('Bye~');
    this.readline.close();  // readline 의 close 를 호출하여 입력 종료 => 프로그램 종료
}
```

## __🎬 실행 결과__

### __실행 부분__
```js
const allStageInfo = "Stage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########"
const stage2 = new SoKoBanGame(allStageInfo);
stage2.gameStart();
```

### __Case 1 : 최초 실행__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25B4%2588%25EA%25B8%25B0%2520%25EC%258B%25A4%25ED%2596%2589.png)
### __Case 2 : 상하좌우 이동__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%2598%25A4%25EB%25A5%25B8%25EC%25AA%25BD%2520%25EC%259D%25B4%25EB%258F%2599.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%2595%2584%25EB%259E%2598%25EB%25A1%259C%2520%25EC%259D%25B4%25EB%258F%2599.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%259C%2584%25EB%25A1%259C%2520%25EC%259D%25B4%25EB%258F%2599.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%2599%25BC%25EC%25AA%25BD%2520%25EC%259D%25B4%25EB%258F%2599.png)

### __Case 3 : 장애물 충돌__
### __공__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EA%25B3%25B5%2520%25EC%259E%25A5%25EC%2595%25A0%25EB%25AC%25BC%2520%25EC%259D%25B4%25EB%258F%2599%2520%25EC%258B%259C%25EB%258F%2584.png)
### __구멍__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EA%25B5%25AC%25EB%25A9%258D%2520%25EC%259E%25A5%25EC%2595%25A0%25EB%25AC%25BC%2520%25EC%259D%25B4%25EB%258F%2599%2520%25EC%258B%259C%25EB%258F%2584.png)
### __벽__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%25B2%25BD%2520%25EC%259D%25B4%25EB%258F%2599%2520%25EC%258B%259C%25EB%258F%2584.png)

### __Case 4 : 게임 종료__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/0d69c3a577e6c71be0ced471027c20d947a74c9d/2%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25A2%2585%25EB%25A3%258C.png)

---

# __3단계__
## __🛠 구현 기능__
- [X] 지도 파일 map.txt 를 문자열로 읽어서 처리
- [X] 처음 시작시 Stage 1의 지도와 프롬프트가 표시
- [X] r 명령 입력시 스테이지를 초기화
- [X] 모든 o 를 O 자리에 이동시키면 클리어 화면을 표시하고 다음 스테이지로 표시
- [X] 플레이어 이동조건에 맞춰 입력된 명령어에 따라 플레이어를 이동
- [X] 주어진 모든 스테이지를 클리어하면 축하메시지를 출력하고 게임 종료
---
## __💬 코딩 요구 사항__
- [X] 가능한 커밋을 자주 하고 구현의 의미가 명확하게 전달되도록 커밋 메시지를 작성
- [X] 함수나 메소드는 한 번에 한 가지 일을 하고 가능하면 20줄을 넘지 않도록 구현
- [X] 함수나 메소드의 들여쓰기를 3단계까지만 할 수 있도록 노력
  
## __📝 풀이 과정__
### __✅  1. 지도 파일 처리__
### __MapParser Class__
- 지정된 경로의 파일을 읽어와 처리하는 클래스

### __파일 읽기__
- fs 모듈을 사용해 지정 경로의 파일을 하나의 문자열로 읽어옴
- 읽어온 문자열을 getParsedMapData() 함수를 이용해 원하는 형태로 파싱
```js
parsing(){
    this.mapData = require('fs').readFileSync(this.path, 'utf-8'); // 파일 읽어옴
    this.stages = this.getParsedMapData(this.mapData); // 읽어온 문자열을 파싱
}
```

### __문자열 파싱__
1. 우선 \n 으로 한 줄씩 자르기
2. 한 줄의 문자열을 처리
   1. 스테이지 이름이 있는 라인의 경우 그냥 반환
   2. 만약 스테이지 구문 라인의 경우 []
      1. 스테이지 임시 배열을 최종 데이터에 push
   3. 그게 아니면 split('') 으로 한 글자씩 쪼개서 1차원 배열로 만들어 반환
      1. 스테이지 임시 배열에 push

```js
getParsedMapData(mapData){
    const splitArray = mapData.split('\n'); // \n 으로 1차 분리
    let parsedData = [];    // 파싱된 최종 데이터 배열
    let oneStage = [];      // 하나의 스테이지를 담을 임시 배열
    let temp = [];          // 임시 배열

    // 한 줄 씩 순회하며 파싱
    for(const line of splitArray){
        temp = this.getParsedLine(line);  // 한 줄의 문자열을 배열로 만들어 반환
        if(temp.length > 0){
            oneStage.push(temp);          // 스테이지 임시 배열에 push
        } else {
            parsedData.push(oneStage);    // 구분 라인, 최종 배열에 스테이지 임시 배열 push
            oneStage = temp;
        }
    }

    parsedData.push(oneStage);
    return parsedData;
}

getParsedLine(line){
    if(line.includes('=')){     // 구분자
        return [];
    }

    if(line.includes('S')){     // 스테이지 이름
        return line
    }

    return line.split('');
}
```
### __파싱 결과__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/11e521949303788eca3a146255d8c15f87959a90/3%25EB%258B%25A8%25EA%25B3%2584%2520%25ED%258C%258C%25EC%258B%25B1%2520%25EA%25B2%25B0%25EA%25B3%25BC.png)

### __✅  2. SoKoBanPlayer Class__
- 파싱된 스테이지 맵 데이터를 입력받아 사용자의 입력에 따라 게임을 제어하는 클래스
- 생성 후 run() 으로 실행
### __대략적인 실행 순서도__
<img src="https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/11e521949303788eca3a146255d8c15f87959a90/3%25EB%258B%25A8%25EA%25B3%2584%2520%25ED%2581%25B4%25EB%259E%2598%25EC%258A%25A4%2520%25EC%2588%259C%25EC%2584%259C%25EB%258F%2584.png"  width="1000">

### __2단계의 SoKoBanGame 클래스와 다른 점__
- __아래의 변수들을 추가해 게임을 제어__
  
__1. stages : 파싱한 전체 스테이지의 맵 정보를 담은 배열__

![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/f8b38492faed7d7b4c9f67fa8147bf3b689eb32c/3%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25A0%2584%25EC%25B2%25B4%2520%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25EC%25A7%2580%2520%25EC%25A0%2595%25EB%25B3%25B4.png)

- stageNum 이라는 변수로 현재 플레이 중인 스테이지의 index 값을 저장해서 해당 변수를 이용해 참조

__2. player : 플레이어의 현재 정보를 담고 있는 객체__

![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/f8b38492faed7d7b4c9f67fa8147bf3b689eb32c/3%25EB%258B%25A8%25EA%25B3%2584%2520%25ED%2594%258C%25EB%25A0%2588%25EC%259D%25B4%25EC%2596%25B4%2520%25EC%259D%25B4%25EB%25A6%2584.png)

- currentTile : 현재 밟고 있는 타일의 값
- move : 이동 횟수
- x, y : 현재 위치의 x, y 좌표

__3. stage : 현재 플레이 중인 스테이지의 정보를 담고 있는 객체__

![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/f8b38492faed7d7b4c9f67fa8147bf3b689eb32c/3%25EB%258B%25A8%25EA%25B3%2584%2520%25ED%2598%2584%25EC%259E%25AC%2520%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25EC%25A7%2580%2520%25EC%25A0%2595%25EB%25B3%25B4.png)

- holePos : 구멍의 좌표
- isCleared : 클리어 여부
- map : 현재 스테이지의 지도
- name : 스테이지 이름
  
### __✅  2. 플레이어 이동 & 돌 굴리기__
```js
/* 입력된 x, y 값 만큼 해당 방향으로 이동 */
moveTo(xMove, yMove){
    const xNew = this.player['x'] + xMove;  // 이동할 x좌표
    const yNew = this.player['y'] + yMove;  // 이동할 y좌표

    // 이동 할 수 없는 타일 => 범위 벗어난 경우, 벽인 경우
    if(this.dontMove(xNew, yNew)){
        return this.IS_NOT_CLEARED;
    }

    // 이동 성공 여부
    if(this.runMoveProcess(xNew, yNew, xMove, yMove)){
        return this.isCleared();    // 클리어 여부 반환
    }

    // 이동 실패 에러 메세지 출력
    this.showErrorMsg('obstacle');
    return this.IS_NOT_CLEARED;
}
```
1. 이동할 좌표 구함
2. 이동 할 수 없는 좌표인지 체크
   1. 범위 벗어난 경우  => 에러 메세지 출력
   2. 벽인 경우         => 에러 메세지 출력
3. 플레이어 이동
   1. 이동 성공 => 스테이지 클리어 여부 체크하여 반환
   2. 이동 실패 => 에러 메세지 출력

### __이동 가능 여부 체크__
```js
dontMove(x, y){
    if(!this.checkStageRange(x, y)){        // 범위 체크
        this.showErrorMsg('outOfRange');    // 범위 아웃 에러 메세지 출력
        return true;
    }

    if(this.isWall(x, y)){                  // 벽인지 체크
        this.showErrorMsg('obstacle');      // 장애물 충돌 메세지 출력
        return true;
    }

    return false;
}
```
### __플레이어 이동 프로세스__
1. 이동하려는 곳의 타일이 뭔지 구함 => nextTile
2. nextTile이 그냥 이동해도 되는 곳인지 아닌지 체크
   1. 그냥 이동 할 수 있음 => ' ', O 의 경우
      1. 플레이어 이동
   2. 그냥 이동 못하고 밀어야함 => o 의 경우
      1. 돌을 그 옆 타일로 이동
         1. 성공 => 플레이어 이동
         2. 실패 => 이동 실패 반환
```js
runMoveProcess(x, y, xMove, yMove){
    const playerX = this.player['x'];
    const playerY = this.player['y'];
    const nextTile = this.stage['map'][x][y];   // 이동하려고 하는 타일

    // 그냥 이동해도 되는 타일인지 체크
    if(this.canMoveTile(x, y)){
        this.justMove(playerX, playerY, x, y);  // 플레이어 이동
        return true;
    }

    // 밀기 성공 여부 체크
    if(this.isPushed(x + xMove, y + yMove)){
        this.stage['map'][x][y] = nextTile === 'o' ? ' ' : 'O'; // 밀려서 바뀐 타일 변경
        this.justMove(playerX, playerY, x, y);                  // 플레이어 이동
        return true;
    }

    return false;
}
    
/* 그냥 이동 가능한지 */
canMoveTile(x, y){
    let tile = this.stage['map'][x][y];
    return tile === 'O' || tile === ' ';    // O, ' ' 의 경우 그냥 이동 가능 
}

/* 이동 */
justMove(xOld, yOld, xNew, yNew){
    const oldTile = this.player['currentTile'];     // 원래 있던 tile
    const newTile = this.stage['map'][xNew][yNew];  // 이동하려는 tile
    this.stage['map'][xOld][yOld] = oldTile;        // 밟고 있던 좌표에 원래 tile 값 넣음 ( P => oldTile )
    this.stage['map'][xNew][yNew] = newTile === 'O' ? 'Ⓟ' : 'P';  // 이동할 타일이 구멍인 경우 체크
    this.player['x'] = xNew;                // 플레이어 x좌표 변경
    this.player['y'] = yNew;                // 플레이어 y좌표 변경
    this.player['move']++;                  // 플레이어 이동 횟수 + 1
    this.player['currentTile'] = newTile;   // 플레이어가 밟고 있는 타일 값 변경
    this.printStage();
    this.showMoveMsg(xOld-xNew, yOld-yNew);
}
```

### __돌 굴리기__
1. 돌 굴릴 타일 구함
2. 돌 굴러갈 수 있는 타일인지 판별
   1. #, o, 0 의 경우 => 굴릴 수 없음
      1. 에러 메세지 출력하고 false 반환
3. 돌 굴리기
   1. 돌 굴릴 타일이 O 타일인 경우 0 으로 변경
   2. 빈 칸으로 굴리는 경우 o 으로 변경
```js
isPushed(x, y){
    const nextTile = this.stage['map'][x][y];

    if(this.canNotPush(nextTile)){      // 굴려도 되는 타일인지 체크
        this.showErrorMsg('obstacle');
        return false;
    }

    this.pushBall(x, y, nextTile);      // 돌굴리기
    return true;
}

canNotPush(tile){
    return tile === '#' || tile === 'o' || tile === '0';
}

/* 돌 굴릴 타일의 값을 변경 */
pushBall(x, y, tile){
    if(tile === 'O'){
        this.stage['map'][x][y] = '0';
        return;
    }

    this.stage['map'][x][y] = 'o';
}
```

### __✅  3. 스테이지 초기화__
- gameInit() 함수를 호출해 현재 게임의 상태가 저장된 stage 와 player 객체를 초기화하는 방식으로 스테이지를 재시작 할 수 있게 구현

```js
 restart(){
    console.log('\nRestart > ' + this.stage['name']);
    this.gameInit();    // stage, player 객체 초기화 함수
    this.printStage();  // 맵 출력
    return this.IS_NOT_CLEARED;
}
```

```js
/* 게임 초기화 함수 */
gameInit(){
    this.setStage();    // stage 초기화
    this.setPlayer();   // player 초기화
}

/* 스테이지 초기화 */
setStage(){
    this.stage = {};                              // 현재 스테이지 데이터 삭제
    let stageArray = this.stages[this.stageNum];  // 현재 플레이 중인 스테이지 맵 데이터 가져옴
    let mapData = this.getCopyMap(stageArray);    // 맵 데이터를 복사
    let stage = {};
    stage['name'] = mapData.shift().join('');     // 맵 데이터의 첫번째 배열 => 스테이지 이름
    stage['map'] = mapData;                       // 맵 데이터 저장
    stage['holePos'] = this.getHolePos(mapData);  // 구멍 위치 구해 저장
    stage['isCleared'] = false;                   // 클리어 여부 초기값 설정
    this.stage = stage;
}

/* 맵 데이터 복사 */
getCopyMap(array){
    let copy = [];
    for(const line of array){
        copy.push([...line]);
    }
    return copy;
}

/* 구멍 위치 구하는 함수 */
// 1. 라인별로 순회하며 0, O 이 포함된 배열 탐색
// 2. 포함되어 있으면 해당 배열에서 0 과 O 의 위치를 구해 반환
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

/* 하나의 라인에 있는 구멍의 위치값 반환 */
getCoordinates(xPos, line){
    let result = [];
    for(let index = 0; index < line.length; index++){
        if(line[index] === 'O' || line[index] === '0'){
            result.push({ x : xPos, y : index});
        }
    }
    return result;
}

/* 플레이어 객체 초기화 */
setPlayer(){
    this.player = {};
    let map = this.stages[this.stageNum].slice(1);
    let player = {};
    let xPos = 0;
    let yPos = 0;

    // 플레이어 위치 구하기
    for(const line of map){
        if(line.includes('P')){               // P 가 포함된 배열 찾기
            yPos = this.getPlayerYPos(line);  // 해당 배열의 P의 index 값 찾기
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

/* line 에서 P의 index 값 찾기 */
getPlayerYPos(line){
    let yPos = 0;
    for(const tile of line){
        if(tile === 'P') return yPos;
        yPos++;
    }
    return -1;
}
```

### __✅  4. 스테이지 클리어 체크__

1. 플레이어의 이동이 성공할때마다 스테이지 클리어 여부를 체크
2. stage 객체의 holePos 데이터로 구멍의 좌표값을 가져옴
3. 해당 좌표의 값이 전부 0 인지 체크

```js
moveTo(xMove, yMove){
    ...
    if(this.runMoveProcess(xNew, yNew, xMove, yMove)){
        return this.isCleared();  // 이동 성공시 체크하여 결과 반환
    }
    ...
}
```

```js
isCleared(){
    const holePos = this.stage['holePos'];  // 구멍의 좌표 객체를 담은 배열
    let holeX = 0;
    let holeY = 0;

    for(const hole of holePos){
        holeX = hole['x'];
        holeY = hole['y'];
        if(this.stage['map'][holeX][holeY] !== '0') return this.IS_NOT_CLEARED; // 0이 아님
    }

    console.log('빠밤! ^-^)b ' + this.stage['name'] + ' 클리어!');
    console.log('턴수 : ' + this.player['move'] + '\n');

    return this.IS_CLEARED;
}
```


### __✅  5. 다음 스테이지로 이동__

1. 명령어 처리 결과로 클리어 여부를 받음
2. 클리어 된 경우 stage 객체의 isCleared 값을 is_cleared 로 변경
3. 명령어 처리 반복문을 종료하고 isCleared 값 확인 후 nextStage() 실행

```js
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
```

### __nextStage()__
1. 현재 실행중인 스테이지의 index 값인 stageNum 을 하나 증가
2. 증가된 stageNum 과 전체 스테이지 개수와 비교
   1. 같음 => 전체 게임 클리어 => theEndGame() 을 실행해 종료
   2. 안같음 => gameInit() 으로 새로운 스테이지 데이터로 게임 초기화

```js
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
```

## __🎬 실행 결과__

### __실행 코드__
```js
const mapParser = new MapParser('./map.txt');
const stagesInfo = mapParser.getStages();
const gamePlayer = new SoKoBanPlayer(stagesInfo);

gamePlayer.run();
```

### 초기 화면
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25201%2520%25EC%25B4%2588%25EA%25B8%25B0%25ED%2599%2594%25EB%25A9%25B4.png)

### 상하좌우 이동
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25202%2520%25EC%2583%2581%25ED%2595%2598%25EC%25A2%258C%25EC%259A%25B0.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%2520%25203%2520%25EC%2583%2581%25ED%2595%2598%25EC%25A2%258C%25EC%259A%25B0.png)

### 유효하지 않은 명령어
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25204%2520%25EC%259C%25A0%25ED%259A%25A8%25ED%2595%2598%25EC%25A7%2580%2520%25EC%2595%258A%25EC%259D%2580%2520%25EB%25AA%2585%25EB%25A0%25B9%25EC%2596%25B4.png)

### 다음 스테이지
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25205%2520%25EB%258B%25A4%25EC%259D%258C%2520%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25EC%25A7%2580.png)

### 초기화
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25205%2520%25EC%25B4%2588%25EA%25B8%25B0%25ED%2599%2594.png)

### 이동 불가
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%25206%2520%25EC%259D%25B4%25EB%258F%2599%25ED%2595%25A0%2520%25EC%2588%2598%2520%25EC%2597%2586%25EB%258A%2594.png)

### 최종 클리어
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/3%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25B5%259C%25EC%25A2%2585%2520%25ED%2581%25B4%25EB%25A6%25AC%25EC%2596%25B4.png)

# __4단계__
## __🛠 구현 기능__
- [X] 되돌리기, 되돌리기 취소 기능 구현

## __📝 풀이 과정__
### __✅  되돌리기, 되돌리기 취소 기능__
- 입력된 명령어와 push 여부를 저장하는 preCommand 와 되돌리기한 명령어들과 push 여부를 저장하는 undoCommand 스택을 이용해 구현

### __예시__
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25201.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25202.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25203.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25204.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25205.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25206.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/893b76cef6c75f348ce0e25196d973945239ec0b/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520-%25207.png)

1. 이동 명령어가 전부 처리 되면 preCommand 에 push
2. 되돌리기 명령 실행 시 preCommand 에서 pop 하여 undoCommand 에 push
3. 되돌리기 취소 명령 실행 시 undoCommand 에서 pop 하여 preCommand 에 push
4. 만약 새로운 이동 명령이 입력되면 undoCommand 는 초기화

### __되돌리기__
1. preCommand 에서 최근에 실행한 명령어와 굴리기 여부 가져옴
2. undoCommand 에 push
3. 해당 명령어의 반대 방향으로 한칸 돌아가는 backTo() 함수 실행
4. 플레이어 먼저 한칸 옮긴 뒤 돌 굴리기 여부에 따라 옆 타일을 처리

```js
turnBack(){
    const commandInfo = this.preCommand.pop();
    const command = commandInfo ? commandInfo['cmd'] : null;
    const isPushed = commandInfo ? commandInfo['isPushed'] : null;

    // 되돌릴 명령어가 있는지 체크
    if((command)){
        this.undoCommand.push({cmd:command, isPushed:isPushed}); 
        this.runBackToFunc(command, isPushed);
    } else {
        this.showErrorMsg('noBack');    // 되돌릴 명령어가 없으면 에러 메세지 출력
    }

    return this.IS_NOT_CLEARED;
}

// 명령어에 따라 반대 방향으로 한칸 가는 backTo 함수 실행
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
    this.justMove(this.player['x'], this.player['y'], xOld, yOld);  // 플레이어 먼저 이동

    // 돌 굴리기 여부 체크
    if(isPushed){
        this.backPushedTile(xOld - xMove, yOld - yMove, xOld - xMove * 2, yOld - yMove * 2);
    }
        
    this.printStage();
    this.showMsg('turnBack');
}

// 돌 굴렸으면 굴린 돌도 다시 반대 방향으로 돌리기
backPushedTile(x, y, xPushed, yPushed){
    const pushed = this.stage['map'][xPushed][yPushed];
    const current = this.stage['map'][x][y];
    this.stage['map'][xPushed][yPushed] = pushed === 'o' ? ' ' : 'O';
    this.stage['map'][x][y] = current === 'O' ? '0' : 'o';
}

```

### __되돌리기 취소 소스코드__
1. undoCommand 가 비어있지 않으면 실행
2. 최근 되돌리기한 명령어를 가져와서 명령어에 따라 처리하는 함수인 runCommand()를 실행

```js
cancelTurnBack(){
    // 되돌리기 할 명령어가 있는지 체크
    if(this.undoCommand.length <= 0){
        this.showErrorMsg('undo');
        return this.IS_NOT_CLEARED;
    }

    const undoInfo = this.undoCommand.pop();
    const command = undoInfo['cmd'];

    // 처리 전 mode 를 undo 로 설정
    this.mode = 'undo'
    this.runCommand(command);
    this.showMsg('cancelTurnBack');

    // 처리가 끝난 후 input mode 로 변경
    this.mode = 'input'
    return this.IS_NOT_CLEARED;
}

runCommand(command) {
    const runFunc = this.getRunFunc(command);

    if (!runFunc) {
        this.showErrorMsg('input');
        return this.IS_NOT_CLEARED;
    }

    // 현재 되돌리기 상태가 아닌데 다른 방향으로 이동한 경우 undoCommand 초기화
    if(this.mode === 'input' && this.isNotUndoCommand(command)){
        this.undoCommand = [];
    }

    return runFunc();
}
```
>__mode 사용 이유__

되돌리기 취소시 취소된 명령어를 입력 받은 명령어를 처리할때 쓰던 함수 runCommand() 로 재실행을 하는데 이때 runCommand() 함수 내부에서 다른 이동 명령어를 입력 받으면 undoCommand 스택을 초기화 하기 위한 로직이 있음. 이때 현재 상태가 되돌리기 상태라는걸 체크하여 해당 로직을 피하기 위해 mode 변수로 체크

## __🎬 실행 결과__
### 초기화면
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25B4%2588%25EA%25B8%25B0%25ED%2599%2594%25EB%25A9%25B4.png)

### 되돌리기
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0.png)

### 되돌리기 취소
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520%25EC%25B7%25A8%25EC%2586%258C.png)

### 되돌리기 & 취소 에러
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520%25EC%2597%2590%25EB%259F%25AC.png)
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EB%2590%2598%25EB%258F%258C%25EB%25A6%25AC%25EA%25B8%25B0%2520%25EC%25B7%25A8%25EC%2586%258C%2520%25EC%2597%2590%25EB%259F%25AC.png)

### 최종 클리어
![](https://gist.github.com/hemudi/59779bd76f513e88a5c22f74200df63d/raw/65ac70ee0ae05bda6816a2eec1d8643fd03a30db/4%25EB%258B%25A8%25EA%25B3%2584%2520%25EC%25B5%259C%25EC%25A2%2585%2520%25ED%2581%25B4%25EB%25A6%25AC%25EC%2596%25B4.png)

> map.txt 정답

### 1 : DDDDDDDWDSSSDSAAAAAAAAA
### 2 : DSDWDSASDWDSASDD
### 3 : DSASSDDDWWAAWASDDDSSAAWSDDWWAWAASDSSAW
### 4 : DDSWAASDDWDSAAASSDDWDSAAAWWWDDS
### 5 : ADSSAASAAWASDDDWASAAWWWDWDDSSWWAASASSSDDWDDAASAAWDWWSSSDDWA

