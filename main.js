import "./style.css";
import * as PIXI from "pixi.js";

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: "#1099bb",
});

let player;
let coin;
let scoreText;
let score = 0;

document.body.appendChild(app.view);

const keyCodeList = {
    Z: 90,
    Q: 81,
    S: 83,
    D: 68,
}

const currentKeysPressed = {};

PIXI.Assets.addBundle('sprites', {
    'player': 'https://pixijs.com/assets/bunny.png',
    'coin': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png',
});

const init = async () => {
    const assets = await PIXI.Assets.loadBundle('sprites');
    scoreText = new PIXI.Text(`Score : ${score}`, {
        fontFamily: 'Arial',
        fill: ['#ffffff'],
        fontSize: 30,
    });
    scoreText.position.set(10, 10);

    player = PIXI.Sprite.from(assets.player);
    player.anchor.set(0.5);
    player.position.set(
        app.screen.width / 2,
        app.screen.height / 2,
    );

    coin = PIXI.Sprite.from(assets.coin);
    coin.anchor.set(0.5);
    const randomPosition = generateRandomPosition(coin);
    coin.position.set(
        randomPosition.x,
        randomPosition.y,
    );
    coin.scale.set(0.035);

    app.stage.addChild(player);
    app.stage.addChildAt(coin, 0);
    app.stage.addChild(scoreText);
};

const keyDown = (e) => {
    currentKeysPressed[e.keyCode] = true;
}

const keyUp = (e) => {
    delete currentKeysPressed[e.keyCode];
};

const gameLoop = (delta) => {
    scoreText.text = `Score : ${score}`;

    if(keyCodeList.Z in currentKeysPressed && player.position.y - 2 > player.height / 2){
        player.position.y -= 2 * delta;
    }

    if(keyCodeList.Q in currentKeysPressed && player.position.x - 2 > player.width / 2){
        player.position.x -= 2 * delta;
    }

    if(keyCodeList.S in currentKeysPressed && player.position.y + 2 < app.screen.height - player.height / 2){
        player.position.y += 2 * delta;
    }

    if(keyCodeList.D in currentKeysPressed && player.position.x + 2 < app.screen.width - player.width / 2){
        player.position.x += 2 * delta;
    }

    if (checkCollision()){
        score++;
        const randomPosition = generateRandomPosition(coin);
        coin.position.set(
            randomPosition.x,
            randomPosition.y,
        );
    }
};

const generateRandomPosition = (sprite) => {
    return {
        x: sprite.width + Math.floor(Math.random() * (app.screen.width - sprite.width * 2)),
        y: sprite.height + Math.floor(Math.random() * (app.screen.height - sprite.height * 2)),
    };
}

const checkCollision = () => {
    const playerBounds = player.getBounds();
    const coinBounds = coin.getBounds();

    return playerBounds.x < coinBounds.x + coinBounds.width &&
        playerBounds.x + playerBounds.width > coinBounds.x &&
        playerBounds.y < coinBounds.y + coinBounds.height &&
        playerBounds.y + playerBounds.height > coinBounds.y;
};

init().then(() => {
    app.ticker.add(gameLoop);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
});