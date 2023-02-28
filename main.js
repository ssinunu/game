// 캔버스
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let gameOver = false; // true면 게임 끝

let score=0;

// 로켓 x,y좌표
let rocketX = canvas.width/2-32 ;
let rocketY = canvas.height-64;

// 총알 저장하는 리스트
let bulletList =  [];

// 랜덤으로 생성된 적을 넣을 함수
let enemyList = [];

// 로켓 관련 함수
function Bullet(){
    this.x = 0;
    this.y = 0;

    // 처음 총알 발사 될 때 우주선의 x,y좌표랑 같음.
    this.init = function(){
        this.x = rocketX+10;
        this.y = rocketY;
        this.alive = true; // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };

    // 총알 발사(y좌표가 줄어듦.)
    this.update = function(){
        this.y-=7;
    };

    // 총알이 적에 닿으면 발생하는 함수
    this.checkHit = function(){
        for(let i=0;i<enemyList.length;i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40){

            // 총알이 적에 맞으면 총알은 죽고 적이 없어짐. 점수 획득
            score++;
            this.alive = false; // 죽은 총알
            enemyList.splice(i,1); // 적이 폭파하면 없어져야함.(i번째에 있는 하나를)
            }
        }
    }
}

// 적 x좌표 랜덤으로 나오게하는 함수
function generateRandomValue(min,max){

    //최댓값 최솟값 사이에서 랜덤값 반환
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum
}


// 적 관련 함수
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0; // 적은 최상단에서 시작
        this.x = generateRandomValue(0,canvas.width-64);
        enemyList.push(this);
    };

    this.update = function(){
        this.y += 2; // 적군 내려오는 속도

        // 적이 바닥에 닿으면 게임오버
        if(this.y >= canvas.height-64){
            gameOver = true;
            console.log("게임오버");
        }
    };
}


// 이미지
let backgroundImage,bulletImage,characterImage,failureImage,rocketImage;
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "image/background.jpg";

    bulletImage = new Image();
    bulletImage.src = "image/bullet.png";

    characterImage = new Image();
    characterImage.src = "image/character.png";

    failureImage = new Image();
    failureImage.src = "image/failure.png";

    rocketImage = new Image();
    rocketImage.src = "image/rocket.png";
}

// 어떤 버튼이 클릭됐는지 저장
let keysDown = {};

// 이벤트 함수
function setKeyboardListener(){
    // 키가 눌러졌을 때
    document.addEventListener("keydown",function(event){
        keysDown[event.key] = true;
    });
    // 키를 뗄 때 
    document.addEventListener("keyup",function(event){
        delete keysDown[event.key];

        if(event.key == " "){
            createBullet(); // 총알 생성
        }
    });
}

// 총알 생성 함수
function createBullet(){
    let b = new Bullet(); // 총알 하나 생성
    b.init();
}

// 적 생성 함수
function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy(); // 적군 생성
        e.init();
    },1000) // 원하는 시간마다 함수 호출(ms)
}

// 로켓 좌표를 옮기는 함수(이동)
function update(){
    if( 'ArrowRight' in keysDown) {
        rocketX += 5; // 우주선 속도
    }
    
    if( 'ArrowLeft' in keysDown){
        rocketX -= 5;
    }

    // 로켓이 왼쪽 캔버스를 벗어나지 않도록
    if(rocketX <= 0){
        rocketX = 0;
    }

    // 로켓이 캔버스 너비를 넘어가지 않도록 
    if(rocketX >= canvas.width - 64){
        rocketX = canvas.width - 64;
    }

    // 총알의 y좌표 업데이트하는 함수
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        } // 적군 쳤는지 안쳤는지 매번 확인
    }

    // 적의 y좌표 업데이트하는 함수
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }
}


// 이미지를 렌더해주는 함수
function render(){
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(rocketImage,rocketX,rocketY);
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    // 총알 그리기
    for(let i=0; i<bulletList.length;i++){

        // 살아있는 총알이면 보여주기
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    // 적 그리기
    for(let i=0; i<enemyList.length;i++){
        ctx.drawImage(characterImage,enemyList[i].x,enemyList[i].y);
    }
}

// 캔버스에 배경사진을 계속 찍어내는 함수
function main(){

    // 게임이 오버가 되지 않으면
    if(!gameOver){
        update();  //  로켓 좌표값 업데이트
        render(); // 업데이트 한걸 그려주고 
        requestAnimationFrame(main);
    } else{ // 게임 오버되면
        ctx.drawImage(failureImage,10,100,380,380);
    }
}

loadImage();
setKeyboardListener();
createEnemy();
main();
