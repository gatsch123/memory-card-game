// Oyun değişkenleri
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let gameInterval;
let currentTheme = 'emoji';
let currentGridSize = 4;
let isGameStarted = false;

// Tema sembolleri
const themeSymbols = {
    emoji: ['🌟', '🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎵', '🎹', '🎻', '🎬', '🎤', '🎧', '🎼', '🎟️', '🎫', '🎪', '🎨', '🎭', '🎮', '🌟', '🎲', '🎯', '🎸', '🎺', '🎵', '🎹', '🎻', '🎬', '🎤'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐒', '🦉', '🦅', '🐢', '🦋', '🐝', '🐌', '🐞', '🐜', '🦗', '🕷️', '🦂', '🦕', '🦖', '🐳', '🐬', '🦈', '🐙'],
    planets: ['☀️', '🌍', '🌕', '🌙', '⭐', '🌠', '🌌', '🌑', '🌓', '🌔', '🌖', '🌗', '🌘', '🌚', '🌛', '🌜', '🌞', '🌎', '🌏', '🌒', '🌝', '🌡️', '☄️', '🌪️', '🌈', '⚡', '🌊', '🌫️', '❄️', '🔥', '💫', '✨'],
    fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍍', '🥝', '🍐', '🍋', '🍈', '🍒', '🥭', '🍉', '🍏', '🍅', '🥑', '🥥', '🍆', '🥕', '🌽', '🥦', '🥬', '🥒', '🌶️', '🍄', '🥜', '🌰', '🍞', '🥐', '🥨', '🥯']
};

// DOM elementleri
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.querySelector('.game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startGameButton = document.getElementById('start-game');
const backToMenuButton = document.getElementById('back-to-menu');
const themeButtons = document.querySelectorAll('.theme-btn');
const gridButtons = document.querySelectorAll('.grid-btn');
const container = document.querySelector('.container');

// Ekran geçişleri
function showScreen(screenId) {
    startScreen.style.display = screenId === 'start-screen' ? 'flex' : 'none';
    gameScreen.style.display = screenId === 'game-screen' ? 'flex' : 'none';
}

// Oyunu başlat butonu
startGameButton.addEventListener('click', () => {
    showScreen('game-screen');
    initGame();
});

// Menüye dön butonu
backToMenuButton.addEventListener('click', () => {
    if (isGameStarted) {
        const confirm = window.confirm('Oyunu bitirmek istediğinize emin misiniz?');
        if (!confirm) return;
    }
    showScreen('start-screen');
    resetGame();
});

// Izgara boyutu değiştirme fonksiyonu
function changeGridSize(size) {
    gridButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.grid) === size) {
            btn.classList.add('active');
        }
    });
    
    currentGridSize = size;
}

// Grid butonlarına tıklama olayı ekle
gridButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        changeGridSize(parseInt(btn.dataset.grid));
    });
});

// Tema değiştirme fonksiyonu
function changeTheme(theme) {
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    container.classList.remove(`theme-${currentTheme}`);
    container.classList.add(`theme-${theme}`);
    
    currentTheme = theme;
}

// Tema butonlarına tıklama olayı ekle
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        changeTheme(btn.dataset.theme);
    });
});

// Oyunu sıfırla
function resetGame() {
    clearInterval(gameInterval);
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    timer = 0;
    isGameStarted = false;
    scoreElement.textContent = score;
    timerElement.textContent = timer;
}

// Oyunu başlat
function initGame() {
    resetGame();
    isGameStarted = true;
    
    // Grid sınıflarını güncelle
    gameBoard.classList.remove('grid-4', 'grid-6', 'grid-8');
    gameBoard.classList.add(`grid-${currentGridSize}`);
    
    // Kartları oluştur ve karıştır
    createCards();
    
    // Zamanlayıcıyı başlat
    startTimer();
}

// Kartları oluştur
function createCards() {
    // Oyun tahtasını temizle
    gameBoard.innerHTML = '';
    
    // Seçili temanın sembollerini al
    const symbols = themeSymbols[currentTheme].slice(0, Math.pow(currentGridSize, 2) / 2);
    
    // Kart çiftlerini oluştur
    const cardPairs = [...symbols, ...symbols];
    
    // Kartları karıştır
    shuffleArray(cardPairs);
    
    // Kartları DOM'a ekle
    cardPairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardIndex = index;
        card.dataset.symbol = symbol;
        
        // Ön yüz
        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = symbol;
        
        // Arka yüz
        const back = document.createElement('div');
        back.classList.add('back');
        
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Diziyi karıştır (Fisher-Yates algoritması)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Kartı çevir
function flipCard() {
    if (!isGameStarted) return;
    
    const card = this;
    
    // Zaten çevrilmiş veya eşleşmiş kartı kontrol et
    if (flippedCards.length === 2 || card.classList.contains('flipped')) return;
    
    // Kartı çevir
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // İki kart çevrildiyse kontrol et
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Eşleşmeyi kontrol et
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.symbol === card2.dataset.symbol;
    
    if (match) {
        matchedPairs++;
        score += 10;
        scoreElement.textContent = score;
        flippedCards = [];
        
        // Oyun bitti mi kontrol et
        if (matchedPairs === Math.pow(currentGridSize, 2) / 2) {
            endGame();
        }
    } else {
        // Eşleşme yoksa kartları geri çevir
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Zamanlayıcıyı başlat
function startTimer() {
    gameInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

// Oyunu bitir
function endGame() {
    isGameStarted = false;
    clearInterval(gameInterval);
    setTimeout(() => {
        alert(`Tebrikler! ${currentGridSize}x${currentGridSize} boyutunda oyunu ${timer} saniyede ${score} puan alarak bitirdiniz!`);
        showScreen('start-screen');
        resetGame();
    }, 500);
}

// Sayfa yüklendiğinde başlangıç ekranını göster
document.addEventListener('DOMContentLoaded', () => {
    showScreen('start-screen');
    container.classList.add(`theme-${currentTheme}`);
}); 