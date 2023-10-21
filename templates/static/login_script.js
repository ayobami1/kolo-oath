//
//var socket = io.connect(
//  window.location.protocol + "//" + document.domain + ":" + location.port
//);
//
//socket.on("connect", function () {
//  console.log("Connected...!", socket.connected);
//});
//
//const queryString = window.location.search;
//console.log(queryString);
//const urlParams = new URLSearchParams(queryString);
//const token = urlParams.get('token');
//console.log(token);
//
//const loginForm = document.getElementById('login-form');
//const container = document.getElementById('container');
//const video = document.querySelector("#videoElement");
//const canvas = document.createElement('canvas'); // Create a canvas element for capturing images
//document.body.appendChild(canvas);
//
//
//
//let isLoginSent = false;
//let videoStream; // Declare a variable to store the video stream
//
//loginForm.addEventListener('submit', function (event) {
//  event.preventDefault();
//
//  // If the login data has not been sent yet, send it and then navigate to the camera
//  if (!isLoginSent) {
//    // Get the username and password from the login form
//    const username = document.getElementById('username').value;
//    const password = document.getElementById('password').value;
//
//    // Emit an event to the server for processing (e.g., checking username and password)
//    socket.emit('login_response', { username, password });
//
//    // Set the login state to true
//    isLoginSent = true;
//
//    // Display the camera container
//    container.style.display = 'block';
//    loginForm.style.display = 'none';
//
//    // Start capturing images
//    navigator.mediaDevices
//      .getUserMedia({ video: true })
//      .then(function (stream) {
//        video.srcObject = stream;
//        videoStream = stream; // Store the stream in the variable
//
//        // Define an interval for capturing images
//        const captureInterval = setInterval(() => {
//          canvas.width = video.videoWidth;
//          canvas.height = video.videoHeight;
//          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//          var data = canvas.toDataURL("image/jpeg", 0.5);
//
//          // Emit the login image to the server
//          socket.emit("login_image", { image: data, token: token });
//        }, 1000); // Capture an image every second
//
//        // Listen for the login success event
//        socket.on("login_success", function () {
//          // Clear the interval and stop capturing images
//          clearInterval(captureInterval);
//        });
//      })
//      .catch(function (error) {
//        console.error('Error accessing camera:', error);
//      });
//  }
//});
//
//
//
//
//// Listen for the login success event
//socket.on("login_success", function (image) {
//  console.log(image);
//  // Make sure the video stream is stopped
//  if (videoStream) {
//    videoStream.getTracks().forEach((track) => track.stop());
//  }
//
//  container.innerHTML = '<p>Login Complete...</p>';
//  container.innerHTML += image; // Append the 'image' content to the container
//
//
//  // Wait for a few seconds (e.g., 2 seconds) before closing the window
//  setTimeout(function () {
//    // Handle successful login
//    // Optionally, you can display the recognized image here
//    console.log("login_success");
//
//    // Close the window
//    window.close();
//  }, 2000); // Adjust the delay as needed
//});
//
//
//
////  // Close the camera stream after a brief delay
////  setTimeout(function () {
////    video.srcObject.getTracks().forEach((track) => track.stop());
////    // Handle successful login
////    // Display the recognized image, notify the user, and close the window as needed
////    console.log("login_success");
////    alert("Login successful!");
////    window.close();
////  }, 2000); // Adjust the delay as needed
//
//
//// Listen for the login error event
//socket.on("login_error", function (data) {
//  // Handle login error
//  // Display error message to the user, clear any sensitive data, etc.
//  console.log("login_error");
//  alert("Login failed: " + data);
//});


var socket = io.connect(
  window.location.protocol + "//" + document.domain + ":" + location.port
);

socket.on("connect", function () {
  console.log("Connected...!", socket.connected);
});

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token');
console.log(token);

const loginForm = document.getElementById('login-form');
const verifyButton  = document.getElementById('verification-container')
const container = document.getElementById('container');
const video = document.querySelector("#videoElement");
const canvas = document.createElement('canvas'); // Create a canvas element for capturing images
document.body.appendChild(canvas);

//let isLoginSent = false;
//let videoStream; // Declare a variable to store the video stream
//
//loginForm.addEventListener('submit', function (event) {
//  event.preventDefault();
//
//  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
//    // If the login data has not been sent yet, send it and then navigate to the camera
//    if (!isLoginSent) {
//      // Get the username and password from the login form
//      const username = document.getElementById('username').value;
//      const password = document.getElementById('password').value;
//
//      // Emit an event to the server for processing (e.g., checking username and password)
//      socket.emit('login_response', { username, password });
//
//      // Set the login state to true
//      isLoginSent = true;
//
//      // Display the camera container
//      container.style.display = 'block';
//      loginForm.style.display = 'none';
//
//      // Start capturing images
//      navigator.mediaDevices
//        .getUserMedia({ video: true })
//        .then(function (stream) {
//          video.srcObject = stream;
//          video.width = 400;
//          video.height = 300;
//          videoStream = stream; // Store the stream in the variable
//
//          // Define an interval for capturing images
//          const captureInterval = setInterval(() => {
//            canvas.width = video.videoWidth;
//            canvas.height = video.videoHeight;
//            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//            var data = canvas.toDataURL("image/jpeg", 0.5);
//
//            // Emit the login image to the server
//            socket.emit("login_image", { image: data, token: token });
//          }, 3000); // Capture an image every 5 seconds
//
//          // Listen for the login success event
//          socket.on("complete_login", function (image) {
//            // Clear the interval and stop capturing images
//            clearInterval(captureInterval);
//          });
//        })
//        .catch(function (error) {
//          console.error('Error accessing camera:', error);
//        });
//    }
//  } else {
//    // Handle cases where the browser does not support getUserMedia
//    console.error('getUserMedia is not supported in this browser.');
//    // You can provide a user-friendly message here
//  }
//});
//
//
//
//
//// Listen for the complete login  success event
//// Only when the user has finalise the the login process
//socket.on("complete_login", function (image) {
//  console.log(image);
//  // Make sure the video stream is stopped
//  if (videoStream) {
//    videoStream.getTracks().forEach((track) => track.stop());
//  }
//    // Clear the previous contents of the container
//    container.innerHTML = '';
//    // Create a card-like structure
//    container.innerHTML = `
//      <div class="card">
//        <p class="card-title">Login Complete</p>
//        <div class="card-content">
//          <p>${image}</p>
//        </div>
//      </div>
//    `;
//
//  // Wait for a few seconds (e.g., 2 seconds) before closing the window
//  setTimeout(function () {
//    // Handle successful login
//    // Optionally, you can display the recognized image here
//    console.log("login_success");
//
//    // Close the window
//    window.close();
//  }, 2000); // Adjust the delay as needed
//});

// Listen for the login error event
socket.on("login_error", function (data) {
  // Handle login error
  // Display error message to the user, clear any sensitive data, etc.
  console.log("login_error");
  alert("Login failed: " + data);
});


// Listen for the login error event
socket.on("login_error", function (data) {
  // Handle login error
  // Display error message to the user, clear any sensitive data, etc.
  console.log("login_error");
  alert("Login failed: " + data);
});


document.getElementById("login-button").addEventListener("click", function () {
  // Handle the Login action
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
//  const phoneNumber = document.getElementById('phoneNumber').value;
  // Emit an event for Login processing
  socket.emit('login_response', { username, password });
});

document.getElementById("signUp-button").addEventListener("click", function () {
  // Handle the SignUp action
  // Add your code for SignUp here
  console.log("hi")
  window.location.href = "http://127.0.0.1:5000/register";
});

//// Send the Login form after OTP verification
//loginForm.addEventListener('submit', function (event) {
//  event.preventDefault();
//
//  // Get the username and password from the login form
//  const username = document.getElementById('username').value;
//  const password = document.getElementById('password').value;
//  const phoneNumber = document.getElementById('phoneNumber').value;
//
//
//  // Emit an event to the server for processing (e.g., checking username and password)
//  socket.emit('login_response', { username, password, phoneNumber });
//});





// Add this code to show the verification form when login is successful
socket.on("start_verification", function () {
  // Hide the login form
  loginForm.style.display = 'none';
  // Show the verification form
  const verificationContainer = document.getElementById('verification-container');
  verificationContainer.style.display = 'block';
});

// Get the Submit button of the Verification otp
// and listen to the event
const verifyForm = document.getElementById('verification-form');
verifyForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const enteredOTP = document.getElementById('otp').value;

  // Emit the OTP to the server for verification
  socket.emit('verify_number', { otp: enteredOTP, form:"login" });
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
const emailVerifyForm = document.getElementById('email-verification-form-login');
emailVerifyForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const enteredOTP = document.getElementById('email-otp').value;

  // Emit the OTP to the server side  for verification
  socket.emit('verify_email', { otp: enteredOTP, form:"login" });
});








// This is Executed Immediately if the OTP is process
// It return False and True , True if the OTP is successful and Fasle if Not
socket.on('verification_response', function (result) {
  if (result) {
    // Verification successful, proceed with image capture
    console.log('Verification successful');

    let videoStream; // Declare a variable to store the video stream

      // Check if the browser supports getUserMedia
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {


      //display the  email Otp form
      const emailVerificationContainer = document.getElementById('email-verification-container');
      emailVerificationContainer.style.display = 'none';


      // Display the camera container
      container.style.display = 'block';


      // Start capturing images
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          video.width = 400;
          video.height = 300;
          videoStream = stream; // Store the stream in the variable

          // Define an interval for capturing images
          const captureInterval = setInterval(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            var data = canvas.toDataURL("image/jpeg", 0.5);

            // Emit the login image to the server
            socket.emit("login_image", { image: data, token: token });
          }, 3000); // Capture an image every 3 seconds

          // Listen for the login success event
          socket.on("complete_login", function (image) {
            // Clear the interval and stop capturing images
            clearInterval(captureInterval);
          });
        })
        .catch(function (error) {
          console.error('Error accessing camera:', error);
        });
    } else {
      // Handle cases where the browser does not support getUserMedia
      console.error('getUserMedia is not supported in this browser.');
      // You can provide a user-friendly message here
    }


    // Listen for the complete login  success event
    // Only when the user has finalise the the login process
    socket.on("complete_login", function (image) {
      console.log(image);
      // Make sure the video stream is stopped
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
        // Clear the previous contents of the container
        container.innerHTML = '';
        // Create a card-like structure
        container.innerHTML = `
          <div class="card">
            <p class="card-title">Login Complete</p>
            <div class="card-content">
              <p>${image}</p>
            </div>
          </div>
        `;

      // Wait for a few seconds (e.g., 2 seconds) before closing the window
      setTimeout(function () {
        // Handle successful login
        // Optionally, you can display the recognized image here
        console.log("login_success");

        // Close the window
        window.close();
      }, 2000); // Adjust the delay as needed
    });







    // Add code to start image capture and login process
  } else {
    // Verification failed, display an error message
    console.error('Verification failed');
    // You can handle the error and prompt the user to enter OTP again
  }
});

