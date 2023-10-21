import vonage
import os
import uuid
import time
import json
import requests
#we create a json in the current path with cross platform syntax

file_name  = "request_id.json"

full_path = os.path.join(os.getcwd(), file_name)

class OTP:
    
    def __init__(self):
        pass



    # Initialize an empty dictionary to store OTPs and their timestamps
    otp_data = {}

    def json_data(self, mode=None, data=None):

        if mode == 'w':
            # Save the OTP data to a JSON file (you can also use a database)
            with open("otp_data.json", "w") as file:
                json.dump(data, file)
                return True
        elif mode == 'r':
            # Load OTP data from the JSON file
            with open("otp_data.json", "r") as file:
                self.otp_data = json.load(file)
                return self.otp_data

        else:
            pass

    def generate_otp(self):

        otp = str(uuid.uuid4().int % 1000000)  # Generate a 6-digit OTP
        timestamp = int(time.time())  # Store the creation timestamp

        # save to a dic then to json
        self.otp_data[otp] = timestamp

        self.json_data(mode='w', data=self.otp_data)
        print("Otp Generated successfully:", otp)

        return otp

    def verify_otp(self, otp:int, minutes_to_expire:int = 5):
        

            
        if not isinstance(minutes_to_expire, int):
            raise Exception("Otp Must be Int")
        
        
        otp = str(otp)
        otp_data = self.json_data(mode='r')
        current_time = int(time.time())

        if otp in otp_data:
            

            # get the the TimeStamp from OTP
            timestamp = otp_data[otp]

            # calculate the time require to Expires from the current time by substracting the current time from the Otp generated time
            time_elapsed = current_time - timestamp
            print("Time Generate is :", timestamp, "current_time:", current_time, "elapsed_time:",
                  str(time_elapsed / 60) + ' m')
            # check if is Expired or not convert the minitus to seconds
            return time_elapsed <= (minutes_to_expire * 60)

        else:
            print("Invalid Otp")


class SMSVerification:
    
    def __init__(self, API_KEY="c6bd0070", SECRET_KEY='uL9imWEAAr7050Ho'):
        
        #initialise the libraries
        self.client = vonage.Client(key=API_KEY, secret=SECRET_KEY)
        self.verify = vonage.Verify(self.client)
    
    
    def read_and_write_json(self, mode=None, data=None):
        
        with open(full_path, mode) as f:
            if mode=='r':
                result = json.load(f)
                
                return result
            elif mode == 'w':
                # data = {"request_id": data}
                json.dump(data, f)
        
        
    
    #Make Verification Request
    def start_verification(self, number):
        if '+' in number:
            number = number.replace('+','')
    
        response = self.verify.start_verification(number=number, brand="AcmeInc")
    
        if response["status"] == "0":
            print("Started verification request_id is %s" % (response["request_id"]))
            read_and_write_json(mode='w', data=response["request_id"])
        else:
            print("Error: %s" % response["error_text"])
            
        
    
    
    def check_verification(self, code):
        
        #get the request_id
        
        request_id =  self.read_and_write_json(mode='r')
        if not request_id:
            return 404
            raise Exceptions("No Request Id")
        
        REQUEST_ID = request_id
        CODE = code
    
        response = self.verify.check(REQUEST_ID, code=CODE)
    
        if response["status"] == "0":
            print("Verification successful, event_id is %s" % (response["event_id"]))
            return 200
        else:
            print("Error: %s" % response["error_text"])
            return  False
    
    
    def cancle_verification(self):
    
        REQUEST_ID = self.read_and_write_json(mode='r')
        response =  self.verify.cancel(REQUEST_ID)
    
        if response["status"] == "0":
            print("Cancellation successful")
        else:
            print("Error: %s" % response["error_text"])
#     
# # SMSVerification().start_verification('2347036469096')
# 
# SMSVerification().check_verification("2333")


class EmailVerification(OTP):
    
    """
    Email Verificaiton for OTP
    
    METHODS:
       Start_verification: This is used to Generate Opt and Send Otp to user email
            Args:
                User email
            Return:
                True or false
       Check_verification: This is use for Verifying the Otp send to the user Email
            Args:
                OTP
            Return:
                False or True
       Send Mail:
           This is used to Verify Opt against OTP server
           
           Return:
               return the body of the email and opt value it is successful
    
    """ 

    
    def start_verification(self, user_email):
        
        
        try:
            #send  OTP to User Email
            self.send_email(otp=self.generate_otp(), email=user_email)
            return True
        except Exception as e:
            print(e)
            return False

    #Start my personal email Server !
    #Please note this is a Secure sever i hosted personally
    #to build yours follow https://myaccount.google.com/security
    def send_email(self, otp, email):
        # Define the request data  or "akinloluojo11@gmail.com"  or "3422"
        data = {"email": email, "otp": otp}
        url = "https://eojdl2gdk037dd8.m.pipedream.net"

        # Set the headers to specify JSON content
        headers = {"Content-Type": "application/json"}

        # Make the POST request
        response = requests.post(url, json=data, headers=headers)
        
        # Check the response
        if response.status_code == 200:
            print("POST request was successful.")
            print("Response:", response.text)
        else:
            print("POST request failed with status code:", response.status_code)
        
        
        
        
        
        pass
    
    
    def check_verification(self, otp):
        #Opt shoild be string
        
        otp = str(otp)
        return self.verify_otp(otp)
        
      
    
    def cancel_verification(self):
        
        pass
    

    
email = EmailVerification()
# print(email.start_verification("akinloluojo1@gmail.com"))
# print(email.check_verification("463588"))