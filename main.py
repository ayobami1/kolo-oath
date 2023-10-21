import base64
import os
import pickle
import cv2
import uuid
import numpy as np
from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, emit
import face_recognition
from PIL import Image, ImageDraw
from pathlib import Path
from collections import Counter
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from datetime import datetime, timedelta
import json
from components.verification  import (

SMSVerification,
EmailVerification,
)

import re
import phonenumbers


app = Flask(__name__, static_folder="./templates/static")
app.config["SECRET_KEY"] = "secret!"
app.config["JWT_SECRET_KEY"] = "super-secret"
socketio = SocketIO(app)
jwt = JWTManager(app)
socketio.init_app(app, cors_allowed_origins="*")
DEFAULT_ENCODINGS_PATH = Path("output/encodings.pkl")

global user_dict

# with open('output/user.json') as f:
#     user_dict = json.load(f)
user_dict = {}

global session_dict
session_dict = {}

global active_dict
active_dict = {}

global login_request
login_request = {}

global login_logs
login_logs = []


# Function to update and save user data to a JSON file
def save_user_data(user_data):
    with open('output/user.json', 'w') as f:
        json.dump(user_data, f, indent=2)


def get_user_details()-> dict:
    with open('output/user.json', 'r') as user:

        user_details = json.load(user)

        return user_details
def is_valid_email(email):
  """
  Validates an email address.

  Args:
    email: A string containing the email address to validate.

  Returns:
    True if the email address is valid, False otherwise.
  """

  email_pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
 
  return re.match(email_pattern, email) is not None

def is_valid_phone(phone_number):
  """
  Validates a phone number.

  Args:
    phone_number: A string containing the phone number to validate.

  Returns:
    True if the phone number is valid, False otherwise.
  """

  try:
    parsed_phone = phonenumbers.parse(phone_number, None)
    print(phonenumbers.is_valid_number(parsed_phone))
    return phonenumbers.is_valid_number(parsed_phone)
  except phonenumbers.phonenumberutil.NumberParseException:
    return False


def get_phone_number_from_email(email):
    user_details = get_user_details()
    for user in user_details.values():
        if email.strip() == user['email']:
            return user['phoneNumber']
    return False

def is_user_signUp_exit(user_data):
    user_details = get_user_details()
    for user in user_details.values():
        if user['email']==user_data['email'] or user["phoneNumber"]==user_data["phoneNumber"] or user['firstName']==user_data['firstName']:
            return True
        else:
            return False


def is_user_login_exit(password, email):
    
    """
    Validate if a user password and email Exit
    
    Args:
          password :  A string of user password
          Email: A String of User Email
    Return:
         True if user Exit and False if Not
    """
    
    
    #get all the user data in the data base !

    user_details = get_user_details()
    for user  in user_details.values():
        #we use this Args to check user mail
        # if mode:
        #     if  user['email'] == email.strip():
        #         return True
     
        if user['email'] == email.strip() and user.get('password', 'pass') == password.strip():
            return True
 
    return False
    


def base64_to_image(base64_string):
    # Extract the base64 encoded binary data from the input string
    base64_data = base64_string.split(",")[1]
    # Decode the base64 data to bytes
    image_bytes = base64.b64decode(base64_data)
    # Convert the bytes to numpy array
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    # Decode the numpy array as an image using OpenCV
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image

def base64_to_np_array(base64_string):
    # Extract the base64 encoded binary data from the input string
    base64_data = base64_string.split(",")[1]
    # Decode the base64 data to bytes
    image_bytes = base64.b64decode(base64_data)
    # Convert the bytes to numpy array
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    return image_array

def detect_bounding_box(vid):
    face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
    gray_image = cv2.cvtColor(vid, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))
    for (x, y, w, h) in faces:
        cv2.rectangle(vid, (x, y), (x + w, y + h), (0, 255, 0), 4)
    return faces


def _recognize_face(unknown_encoding, loaded_encodings):
    """
    Given an unknown encoding and all known encodings, find the known
    encoding with the most matches.
    """
    boolean_matches = face_recognition.compare_faces(
        loaded_encodings["encodings"], unknown_encoding
    )
    votes = Counter(
        name
        for match, name in zip(boolean_matches, loaded_encodings["names"])
        if match
    )

    if votes:
        print(votes)
        return votes.most_common(1)[0][0]


@socketio.on("connect")
def test_connect():
    print("Connected")
    emit("my response", {"data": "Connected"})

@socketio.on("register")
def register_user(data):
    print("Registering user", data)
    print("sid", request.sid)
    # print(user_dict)
    first_name = data["firstName"].strip()
    last_name = data["lastName"].strip()
    email = data["email"].strip()
    phoneNumber = data['phoneNumber'].strip()
    password = data['password'].strip()
    user = {"firstName": first_name, "lastName": last_name, "email": email, "phoneNumber":phoneNumber, 'password': password,  "id": str(uuid.uuid4()), "hasImage": False}
    user_dict[user["id"]] = user
    session_dict[request.sid] = user["id"]
    # print(session_dict)
    # print(user_dict)
  

    #check if the email and number is correct if not alert user
    if not  is_valid_email(email) or not  is_valid_phone(phoneNumber):
        emit("signUp_error", "Invalid Phone number or email please try again !")
    else:
        if is_user_signUp_exit(user_data=data):
            emit("signUp_error", "Hey You are already in our database Try again user other Detail 😎")
        else:

            emit('start_verification')
            SMSVerification().start_verification(phoneNumber)
            
            #initiate the email Verification as well
            EmailVerification().start_verification(email)

            # emit("signup_success")

@socketio.on("signup_image")
def trainImage(image):
 
    # check if user already has image
    if request.sid not in session_dict.keys():
        return True
    user_id = session_dict[request.sid]
    if user_id and user_dict[user_id]["hasImage"] or not user_dict[user_id]:
        return True

    #  get face in image
    image = base64_to_image(image)
    face_locations = face_recognition.face_locations(image, model="hog")

    if len(face_locations) != 1:
        return True
    face_encodings = face_recognition.face_encodings(image, face_locations)
    # check if user exists
    try:
        with DEFAULT_ENCODINGS_PATH.open(mode="rb") as f:
            loaded_encodings = pickle.load(f)
        name = ''
        for bounding_box, unknown_encoding in zip(
                face_locations, face_encodings
            ):
                name = _recognize_face(unknown_encoding, loaded_encodings)
        if name:
            print(name)
            emit("signup_error", { "error": "face has been registered" })
            return True
    except Exception as e:
        print("an error occurred", e)


    # save image
    names = []
    encodings = []
    for encoding in face_encodings:
        names.append(user_id)
        encodings.append(encoding)

    name_encodings = {"names": names, "encodings": encodings}
    with DEFAULT_ENCODINGS_PATH.open(mode="wb") as f:
        pickle.dump(name_encodings, f)
    (x, y, w, h) = face_locations[0]
    cv2.rectangle(image, (h, x), (y, w), (0, 255, 255), 2)
    face = image[y:y + h, x:x + w]
    frame_resized = cv2.resize(image, (640, 360))
    # frame_resized = cv2.resize(gray, (640, 360))

    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

    result, frame_encoded = cv2.imencode(".jpg", frame_resized, encode_param)

    processed_img_data = base64.b64encode(frame_encoded).decode()

    b64_src = "data:image/jpg;base64,"
    processed_img_data = b64_src + processed_img_data
    user_dict[user_id]["hasImage"] = True

   #save the User Data since image is now True
    existing_user_data = get_user_details()
    
    existing_user_data.update(user_dict)

    save_user_data(existing_user_data)
    emit("signup_complete", processed_img_data)
    
    

def read_user_data(user_id):
    with open('output/user.json', 'r') as f:
        data = json.load(f)
        for value in data.values():
            if value['id'] == user_id:

                return  value



@socketio.on('verify_number')
def verify_phoneNumber(data):
    otp = data['otp']
    form = data['form']

    result =True # SMSVerification().check_verification(code=data['otp'])
   
    
    if not result:
        if form =="login":
            emit('login_error', "OTP Invalid")
        else:
            emit("signUp_error", "Otp is Invalid")
        print("Error !")
        
    else:
        if form =="signUp":
            #Switch to email verifiaction Email immediaely
            emit('process_email_otp')
            # emit("signup_success")
            
        elif form == "login":
            #switch to email verification immediatey
             emit('process_email_otp')
            # emit("verification_response", result)
        
        print("code verified !\nPlease Proceed to verify your email")


@socketio.on('verify_email')
def verify_email_address(data):
    otp = data['otp']
    form = data['form']
    print(form)

    result = EmailVerification().check_verification(data['otp'])

    if not result:
        if form == "login":
            emit('login_error', "OTP Invalid")
        else:
            emit("signUp_error", "Otp is Invalid")
        print("Error !")

    else:
        #veerification is done now Proceed to capture your face !
        if form == "signUp":
            emit("signup_success")
        elif form == "login":
            emit("verification_response", result)

        print("code verified !")
        
        
        
@socketio.on("login_image")
def receive_image(data):
    print("Received login image")

    # Decode the base64-encoded image data
    image_data = data["image"]
    image = base64_to_image(image_data)
    face_locations = face_recognition.face_locations(image, model="hog")
    print(len(face_locations))
    if len(face_locations) != 1:
        emit("login_error", "No face found or multiple faces detected\nPlease Position your Face Correctly")
        return

    face_encodings = face_recognition.face_encodings(image, face_locations)

    # Check if user exists based on the face encoding
    try:
        with DEFAULT_ENCODINGS_PATH.open(mode="rb") as f:
            loaded_encodings = pickle.load(f)

        name = _recognize_face(face_encodings[0], loaded_encodings)

        if not name:
            emit("login_error", "User not recognized")
        else:
            #The User image is Found and the Login is complete 
            #Get the user data from the user.json
            data =  read_user_data(name)
            user_data =f'You are welcome {data["firstName"]}'
            emit("complete_login",user_data )  # Send the recognized user's name


    except Exception as e:
        emit("login_error", f"An error occurred: {e}")



@socketio.on("login_request")
def login_request_func(data):
    # get id from data and session
    id = data["id"]
    session =  request.sid
    login_id = str(uuid.uuid4())
    login_request[login_id] = { "session": session, "id": id}
    print(login_request)
    access_token = create_access_token(identity=login_id, expires_delta= timedelta(minutes=5))
    emit("signup_token", {"access_token": access_token, "id": id})
    return data

@socketio.on("login_response")
def login_response(data):

    email = data['username'].strip()
    password = data['password'].strip()
    phoneNumber = get_phone_number_from_email(email)
  

    if not phoneNumber:
        emit("login_error", "We can't find your Phone Number in our database Please register again !")

  
    # check if the email and number is correct if not alert user
    if not is_valid_email(email):
        emit("login_error", "Invalid Phone number or email please try again !")
     
    else:
        if is_user_login_exit( password=password, email=email):
            emit('start_verification')
            SMSVerification().start_verification(phoneNumber)
            #start the email as well
            EmailVerification().start_verification(email)
            #display the Verification form now


        else:

            emit("login_error", "Wrong Password or Email Try again !")

        return data

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/register")
def login():
    token = request.args.get("token")
    print(token)
    return render_template("index.html", token=token)



if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')