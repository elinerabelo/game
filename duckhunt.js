let ducks = []; // Inicializado como array vazio para evitar erros no início
let duckCount = 1;
let duckImageNames = ["duck-left.gif", "duck-right.gif"];
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 5;
let duckVelocityY = 5;

let gameWidth = window.screen.width;
let gameHeight = window.screen.height * 3 / 4;

let score = 0;
let currentRoundMaxDucks = 0; // Nova variável para lembrar quantos patos começaram a rodada

window.onload = function() {
    setTimeout(addDucks, 2000); // Espera 2 segundos para começar
    setInterval(moveDucks, 1000 / 60); // 60 frames por segundo
}

function addDucks() {
    ducks = []; // Limpa o array de forma segura
    duckCount = Math.floor(Math.random() * 2) + 1;
    currentRoundMaxDucks = duckCount; // Guarda a quantidade desta rodada para o cachorro

    for (let i = 0; i < duckCount; i++) {
        let duckImageName = duckImageNames[Math.floor(Math.random() * 2)];
        let duckImage = document.createElement("img");
        
        // Garante que o caminho da imagem pegue apenas o nome do arquivo para o teste do .includes()
        duckImage.src = duckImageName;
        duckImage.width = duckWidth;
        duckImage.height = duckHeight;
        duckImage.draggable = false;
        duckImage.style.position = "absolute"; 

        duckImage.onclick = function() {
            let duckShotSound = new Audio("duck-shot.mp3");
            duckShotSound.play();
            score += 1;
            document.getElementById("score").innerHTML = score;
            
            // Remove do HTML de forma segura verificando se o elemento ainda é filho do body
            if (this.parentNode === document.body) {
                document.body.removeChild(this);
            }
            
            // Remove este pato do array filtrando os restantes
            ducks = ducks.filter(d => d.image !== this);

            // Se não houver mais patos, o cachorro aparece
            if (ducks.length === 0) {
                addDog(currentRoundMaxDucks);
            }
        }

        document.body.appendChild(duckImage);

        let duck = {
            image: duckImage,
            x: randomPosition(gameWidth - duckWidth),
            y: randomPosition(gameHeight - duckHeight),
            velocityX: duckVelocityX, 
            velocityY: duckVelocityY
        };

        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top = String(duck.y) + "px";

        // Ajusta a velocidade inicial baseada na imagem sorteada
        // Usamos a propriedade textotual nativa para evitar caminhos absolutos do navegador
        if (duckImageName === duckImageNames[0]) {
            duck.velocityX = -duckVelocityX; // Indo para a esquerda
        }
        ducks.push(duck);
    }
}

function moveDucks() {
    // Se o array estiver vazio (intervalo entre rodadas), não faz nada
    if (!ducks || ducks.length === 0) return;

    for (let i = 0; i < ducks.length; i++) {
        let duck = ducks[i];
        
        // Movimentação X
        duck.x += duck.velocityX;
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.x -= duck.velocityX;
            duck.velocityX *= -1;
            // Inverte o sprite baseado na direção
            duck.image.src = duck.velocityX < 0 ? duckImageNames[0] : duckImageNames[1];
        }
        
        // Movimentação Y
        duck.y += duck.velocityY;
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.y -= duck.velocityY;
            duck.velocityY *= -1;
        }
        
        // Atualiza a posição na tela
        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top = String(duck.y) + "px";
    }
}

function addDog(roundDucks) {
    let dogImage = document.createElement("img");
    if (roundDucks === 1) {
        dogImage.src = "dog-duck1.png";
        dogImage.width = 172;
    } else { 
        dogImage.src = "dog-duck2.png";
        dogImage.width = 224;
    }
    dogImage.height = 152;
    dogImage.draggable = false;

    dogImage.style.position = "fixed"; 
    dogImage.style.bottom = "0px";     
    dogImage.style.left = "50%";       
    dogImage.style.transform = "translateX(-50%)"; // Centraliza o cachorro perfeitamente no meio da tela
    document.body.appendChild(dogImage);

    let dogScoreSound = new Audio("dog-score.mp3");
    dogScoreSound.play();

    setTimeout(function() {
        if (dogImage.parentNode === document.body) {
            document.body.removeChild(dogImage);
        }
        addDucks();
    }, 5000); 
}

function randomPosition(limit) {
    return Math.floor((Math.random() * limit));
}