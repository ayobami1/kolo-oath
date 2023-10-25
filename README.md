# Kol-auth-server
A 3rd party app for facial verifcation


# Face Recognition Authentication System

This is a simple face recognition authentication system built using Flask and OpenCV.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Python 3.6 or higher installed on your system.
- Required Python packages listed in the `requirements.txt` file.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/FatOladele/Kol-auth-server.git
   ```
2. Navigate to the Directory
    ```bash
    cd Kol-auth-server
    ```

    or [Download the Zip here](https://github.com/FatOladele/Kol-auth-server/archive/refs/heads/main.zip)

    ```bash
    cd Kol-auth-server
    ```
4. Create a virtual Environment strong recommended
   ```bash
   python -m venv venv
   ```
5. Activate your Virtual Environment for Mac/Linux
   ```bash
   source venv/bin/activate 

   ```

    Activate your Virtual Environment for Window 
   ```bash
   venv\Scripts\activate

   ```
6. Install the required dependencies
   ```bash
   pip install -r requirements.txt

   ```
7. time for coffee becuase it will take time to build `opencv-python, dlib `


8. Afterward run your application
   ```bash
   python main.py
   ```


# Usage 
Access the web application by opening your browser and navigating to ```http://localhost:5000```

Register a new user by providing your first name, last name, and email address.

Upload a facial image for authentication during the signup process.

To log in, click the "Login" button and provide a facial image for authentication.
