const imageContainer = document.getElementById("image-container");

const image1 = document.getElementById("image-1");
const image2 = document.getElementById("image-2");
const image3 = document.getElementById("image-3");
const image4 = document.getElementById("image-4");
const image5 = document.getElementById("image-5");
const image6 = document.getElementById("image-6");

// Button to start game
const start = document.getElementById("start");

const accessKey = "fk7PIgH-2drDSYgUmSu4TZ5jNZwOYKwJK9aDINURFj4";
const apiURL = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

// Function that fetches random images to display on screen
const fetchRandomImage = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    const image = await response.json();
    image1.src = image.urls.regular;
    image4.src = image.urls.regular;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};

// Function that starts a countdown from 5 seconds
const startCountdown = () => {
  // Disables the Start button once it's clicked
  start.disabled = true;
  let count = 5;

  // Get countdown, then set it to count
  const countdown = document.getElementById("countdown");
  countdown.textContent = count;

  // Update the countdown every second
  const intervalId = setInterval(() => {
    count -= 1;
    countdown.textContent = count;

    if (count === 0) {
      clearInterval(intervalId);
      countdown.textContent = "Match the images";
      // Enables the Start button once countdown reaches 0
      start.disabled = false;
    }
  }, 1000);
};

// Calls functions once button is clicked
start.addEventListener("click", () => {
  fetchRandomImage();
  startCountdown();
});
