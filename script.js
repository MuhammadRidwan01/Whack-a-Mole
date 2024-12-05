const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const infoButton = document.getElementById('start-game');
const winningScore = 20;
let score = 0;
let currentTime = 30;
let moleInterval;
let timerInterval;
let gameActive = false;
let won = false;

function randomHole() {
    if (!gameActive) return;
    
    holes.forEach(hole => {
        const existingMole = hole.querySelector('.mole');
        if (existingMole) {
            existingMole.remove();
        }
    });

    const randomIndex = Math.floor(Math.random() * holes.length);
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.addEventListener('click', hitMole);
    holes[randomIndex].appendChild(mole);
}

function hitMole(event) {
    if (!gameActive) return;
    
    score++;
    scoreDisplay.textContent = score;
    event.target.removeEventListener('click', hitMole);
    event.target.remove();

    // hit animation
    const hole = event.target.parentElement;
    hole.style.backgroundColor = '#ff6b6b';
    setTimeout(() => {
        hole.style.backgroundColor = '#8b4513';
    }, 100);

}

function initGame() {
    if (gameActive) return;
    
    gameActive = true;
    score = 0;
    currentTime = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = currentTime;
    infoButton.disabled = true;
    
    // interval mole random antara 0.8 - 1.2 detik
    const moleSpeed = Math.random() * 400 + 800;
    moleInterval = setInterval(randomHole, moleSpeed);
    timerInterval = setInterval(countdown, 1000);
}

function showGameInfo() {
    Swal.fire({
        title: 'Whack-a-Mole Game',
        html: `
            <p style="text-align: left; margin: 20px 0;">
            <b>Cara Bermain:</b><br>
            1. Pukul tikus yang muncul dengan mengklik mereka<br>
            2. Setiap tikus yang dipukul bernilai 1 poin<br>
            3. Waktu permainan adalah 30 detik<br>
            4. Skor 20 poin untuk menang!<br><br>
            <b>Aturan:</b><br>
            - Tikus akan muncul secara acak<br>
            - Klik secepat mungkin untuk mendapat skor tinggi<br>
            - Permainan berakhir saat waktu habis<br>
            - Pemain dinyatakan menang ketika skor lebih dari 20!
            </p>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Mulai Bermain!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            initGame();
        }
    });
}

function countdown() {
    currentTime--;
    timeDisplay.textContent = currentTime;

    if (currentTime <= 0) {
        endGame();
    }

    if (currentTime <= 5) {
        timeDisplay.style.color = 'red';
    }
}

function endGame() {
    
    if (score >= winningScore) {
        won = true;
    }
    gameActive = false;
    clearInterval(moleInterval);
    clearInterval(timerInterval);
    timeDisplay.style.color = 'initial';
    
    holes.forEach(hole => {
        const existingMole = hole.querySelector('.mole');
        if (existingMole) {
            existingMole.remove();
        }
        hole.style.backgroundColor = '#8b4513';
    });
    
    infoButton.disabled = false;

    if (won) {
        Swal.fire({
            title: "Selamat!",
            text: `Kamu menang dengan skor: ${score}!`,
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Permainan Selesai!",
            text: `Skor kamu: ${score}`,
            icon: "info"
        });
    }
}

infoButton.addEventListener('click', showGameInfo);