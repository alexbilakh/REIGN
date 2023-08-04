<template>
  <div class="game-container">
    <div class="game-area">
      <div class="image-container" @click="rotateImage">
        <div class="image" :style="{ transform: `rotate(${rotationAngle}deg)`, transition: `0.5s` }" />
        <div class="message" :style="{ top: `${messageTop}px` }" v-if="showMessage">{{ message }}</div>
      </div>
      <button class="confirm-button" @click="confirmProgress">Confirm</button>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-text">{{ progress }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rotationAngle: 0,
      progress: 0,
      showMessage: false,
      message: '',
      rotationDirection: 1, // 1 for left, -1 for right
      messageTop: -100, // Adjust the top position of the message
      messageTimeout: null, // To store the timeout reference
    };
  },
  methods: {
    rotateImage() {
      this.rotationDirection *= -1; // Toggle rotation direction

      if (this.rotationDirection === 1) {
        this.message = 'Rotated right to left!';
        this.rotationAngle = -10;
      } else {
        this.message = 'Rotated left to right!';
        this.rotationAngle = 10;
      }

      this.showMessage = true;
     
    },
    confirmProgress() {
      if (this.progress < 100) {
        this.progress += 10;
      }
      this.rotationAngle = 0; // Reset rotation
      this.showMessage = false; // Hide message
      clearTimeout(this.messageTimeout); // Clear the message timeout
      this.messageTimeout = null; // Reset the timeout reference
    },
  },
};
</script>
<style>
/* ... (rest of the styles) */

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e; /* Dark background color */
}

.game-area {
  background-color: #2c2c2c; /* Dark background color for the game area */
  border: 1px solid #444;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.image-container {
  position: relative;
  text-align: center;
  transition: transform 0.5s ease; /* Add transition effect */
}

.image {
  background: url('./assets/king.jpg');
  background-size: cover;
  width: 250px;
  height: 250px;
  border-radius: 25px;
  border-width: 2px;
  border-color: #ccc;
}

.message {
  position: absolute;
  left: 50%;
  top: -100px;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8); /* Light background color for the message */
  color: #333; /* Dark text color */
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 1;
  white-space: nowrap; /* Prevent text from breaking */
  transition: opacity 0.5s ease; /* Add opacity transition effect */
}

.progress-container {
  width: 100%;
  height: 20px;
  background-color: #555; /* Darker color for the progress container */
  margin-top: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  width: 0;
}

.confirm-button {
  margin-top: 40px;
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.progress-text {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* ... (rest of the styles) */
</style>
