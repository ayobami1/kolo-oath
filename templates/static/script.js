
var socket = io.connect(
  window.location.protocol + "//" + document.domain + ":" + location.port
);
socket.on("connect", function () {
  console.log("Connected...!", socket.connected);
});



document.getElementById("register-button-login").addEventListener("click", function () {
   console.log("Yess")

    window.location.href = "http://127.0.0.1:5000";
  // Handle the Login action
//  const username = document.getElementById('username').value;
//  const password = document.getElementById('password').value;
//  const phoneNumber = document.getElementById('phoneNumber').value;
  // Emit an event for Login processing
//  socket.emit('login_response', { username, password });
});


let registerBtn = document.getElementById("register");

registerBtn.addEventListener('click', function (event) {
  event.preventDefault();
  let fname = document.getElementById("fname").value;
  let lname = document.getElementById("lname").value;
  let email = document.getElementById("email").value;
  let phoneNumber = document.getElementById('phoneNumber').value
  let password = document.getElementById('password').value

  // Perform client-side validation
  if (!fname || !lname || !email) {
    alert("Please fill in all fields.");
    return;
  }

  socket.emit("register", { firstName: fname, lastName: lname, email: email, phoneNumber:phoneNumber, password:password });
});


// Add this code to show the verification form when login is successful
socket.on("start_verification", function () {

  let signUpForm = document.getElementById('signup-form')
  // Hide the sign up form
  signUpForm.style.display = 'none';
  // Show the verification form
  const verificationContainer = document.getElementById('verification-container');
  verificationContainer.style.display = 'block';
});


// Get the Submit button of the Verification otp For sms
// and listen to the event
const verifyForm = document.getElementById('verification-form');
verifyForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const enteredOTP = document.getElementById('otp').value;

  // Emit the OTP to the server for verification
  socket.emit('verify_number', { otp: enteredOTP, form:"signUp" });
});


// Listen for the login error event
socket.on("signUp_error", function (data) {
  // Handle login error
  // Display error message to the user, clear any sensitive data, etc.
  console.log("login_error");
  alert("Sigup Failed: " + data);
});

/////////////////////////////////////////////////////////////////////////



// This is called to proess the email OTp by Hiding everything on the screen
socket.on('process_email_otp', function (){

// Hide the Sms Form
  const verificationContainer = document.getElementById('verification-container');
  verificationContainer.style.display = 'none';



 //display the  email Otp form
  const emailVerificationContainer = document.getElementById('email-verification-container');
  emailVerificationContainer.style.display = 'block';


});


// listen to the email Verifiaction Form

// Get the Submit button of the Verification otp For sms
// and listen to the event
const emailVerifyForm = document.getElementById('email-verification-form-sign');
emailVerifyForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const enteredOTP = document.getElementById('email-otp').value;

  // Emit the OTP to the server side  for verification
  socket.emit('verify_email', { otp: enteredOTP, form:"signUp" });
});



// This socket is called when all the OTP is verified and the video cam is Open to Process face
socket.on("signup_success", function (image) {
  var main = document.getElementById("main");
  main.innerHTML = `
  <div id="container">
      <p style="text-align: center; color: #fff; background: rgba(0, 0, 0, 0.7); position: absolute; top: 0; left: 0; width: 100%; padding: 10px;">Please position and rotate your face correctly</p>
      <video autoplay playsinline id="videoElement" style="max-width: 100%; height: auto;"></video>
      <canvas id="canvas" width="400" height="300"></canvas>
    </div>
  `;

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  const video = document.querySelector("#videoElement");
  video.width = 400;
  video.height = 300;
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        streamObj = stream;
      })
      .catch(function (error) {});
  }



  const FPS = 10;
  setInterval(() => {
    width = video.width;
    height = video.height;
    context.drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL("image/jpeg", 0.5);
    context.clearRect(0, 0, width, height);
    socket.emit("signup_image", data);

  }, 1000 / FPS);
});
socket.on("signup_complete", function (image) {
  // Clear the text and Card
  document.querySelector("p").style.display = "none";

  console.log("signup_complete");
  container = document.getElementById("container");
  container.innerHTML = `
    <img id="photo" width="400" height="300">
  `;
  photo = document.getElementById("photo");
  photo.setAttribute("src", image);

  // Make sure the video element is present
  const video = document.querySelector("#videoElement");
  if (video) {
    const stream = video.srcObject;

    // Check if there is a stream to stop
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });

      // Clear the source object
      video.srcObject = null;
    }
  }

  setTimeout(() => {
    // Create a card-like structure
    container.innerHTML = `
      <div class="card">
        <p class="card-title">Sign Up Complete</p>
        <div class="card-content">
          <p>You Good! 😁</p>
        </div>
      </div>
    `;

    // Redirect to the login page (change 'login.html' to your desired URL)
    window.location.href = "http://127.0.0.1:5000/login";
  }, 5000);

  // Close the stream
  streamObj.getTracks().forEach((track) => track.stop());
});
