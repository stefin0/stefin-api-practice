// Button to start game
const start = document.getElementById("start");
const countdown = document.getElementById("countdown");

// Account info for API
const accessKey = "fk7PIgH-2drDSYgUmSu4TZ5jNZwOYKwJK9aDINURFj4";
const apiURL = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

// Function that starts a countdown from 5 seconds
const startCountdown = () => {
  // Disables the Start button once it's clicked
  start.disabled = true;
  let count = 5;

  // Get countdown, then set it to count
  countdown.textContent = count;

  // Update the countdown every second
  const intervalId = setInterval(() => {
    count -= 1;
    countdown.textContent = count;

    if (count === 0) {
      clearInterval(intervalId);
      countdown.textContent = "0/3 matches";

      // Hides the images once the timer reaches 0
      for (let i = 0; i < 6; i++) {
        const imageElement = document.getElementById(`image-${i + 1}`);
        imageElement.style.visibility = "hidden";
      }
    }
  }, 1000);
};

// Function that fetches random images to display on screen
const fetchRandomImage = async () => {
  try {
    const response = await fetch(`${apiURL}&count=3`);

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};

// Function that puts the images into the divs
const setImages = async () => {
  const randomImages = await fetchRandomImage();
  console.log(randomImages);

  if (randomImages) {
    const duplicatedImages = [...randomImages, ...randomImages];
    console.log(duplicatedImages);

    // Shuffle the array
    const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
    console.log(shuffledImages);

    // Displays the images
    shuffledImages.forEach((image, index) => {
      const imageElement = document.getElementById(`image-${index + 1}`);
      imageElement.src = image.urls.regular;
    });
  }
};

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;

// Function that flips a card
const flipCard = (card, index) => {
  if (lockBoard) {
    return;
  }

  if (card === firstCard) {
    return;
  }

  // Reveals the image that was clicked
  const imageToReveal = document.getElementById(`image-${index + 1}`);
  imageToReveal.style.visibility = "visible";

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;
    console.log(firstCard);
  } else {
    hasFlippedCard = false;
    secondCard = card;

    checkForMatch();
  }
};

// Function that unflips the flipped cards
const unflipCards = () => {
  lockBoard = true;

  // No match, so the cards will be flipped back
  setTimeout(() => {
    firstCard.firstChild.style.visibility = "hidden";
    secondCard.firstChild.style.visibility = "hidden";

    resetBoard();
  }, 1000);
};

// Function that checks if two cards are a match
const checkForMatch = () => {
  let isMatch =
    firstCard.firstChild.getAttribute("src") ===
    secondCard.firstChild.getAttribute("src");

  if (isMatch) {
    disableCards();

    matches++;
    countdown.textContent = `${matches}/3 matches`;

    if (matches === 3) {
      countdown.textContent =
        "Congratulations, You Won! Refresh To Play Again.";
      resetBoard();
    }
  } else {
    unflipCards();
  }
};

// Function that disables cards that were a match
const disableCards = () => {
  // Match, so now the matched cards can't be clicked
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
};

const resetBoard = () => {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

// Function that controls the game logic
const gameLogic = () => {
  // Select all the cards
  const cards = document.querySelectorAll(".card");
  console.log(cards);

  // Assign a click event to each card
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      flipCard(card, index);
    });
  });
};

// Calls functions when button is clicked
start.addEventListener("click", () => {
  startCountdown();
  setImages();
  gameLogic();
});
