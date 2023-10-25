# Client-Side Documentation

This document complements the server-side documentation and provides details about the client-side code used in my project. The client-side code interacts with the server-side to provide a cohesive software system.

**Before you begin, make sure the server is up and running. You can start the entire software by executing `python main.py`.**

## Introduction

This document outlines the functionality of the client-side components and their interaction with the server-side for our software project.

## Table of Contents

- [Login Page](#login-page)
- [Sign-Up Page](#sign-up-page)
- [JavaScript Logic](#javascript-logic)
- [Getting Started](#getting-started)
- [Usage](#usage)

## Login Page

### HTML (login.html)

The `login.html` page contains the user login form. It includes fields for username, password, and phone number. This page interacts with the server-side for authentication.

### JavaScript (login.js)

The `login.js` script handles the login process, image capture, and communication with the server using Socket.IO for authentication. It works in conjunction with the server-side logic for user authentication.

## Sign-Up Page

### HTML (index.html)

The `index.html` page contains the user sign-up form, including fields for first name, last name, email, password, and phone number. It interacts with the server-side for user registration.

### JavaScript (script.js)

The `script.js` script manages the sign-up process, image capture, and communication with the server via Socket.IO for user registration. It collaborates with the server-side components to create new user accounts.

## JavaScript Logic

Both the login and sign-up pages rely on JavaScript logic to perform form validation, manage user interactions, and communicate with the server. The JavaScript logic initiates the camera, captures images, and verifies OTP codes in sync with the server-side.

## Getting Started

To get started with the client-side code, follow these steps:

1. Ensure the server-side components are running by executing `python main.py`.

2. Open the `login.html` or `index.html` page in a web browser to access the login or sign-up form.

## Usage

1. Fill in the required details (username, password, first name, last name, email, etc.) as prompted in the login or sign-up form.

2. Follow the on-screen instructions, which may include capturing images with your device's camera.

3. Depending on your use case, you may need to enter OTP codes for verification.

4. After successful login or sign-up, you will be redirected to the appropriate page.

Ensure that you've thoroughly reviewed the server-side documentation (`server-side.md`) for a complete understanding of the server-client interaction and system operation.

will be addding other things to enhance this documentation with more specific instructions or configurations related to the  project.
