# secretsWebsite

A website that uses HTML5, CSS, Bootstrap 5, Node.js, Express.js, Passport, Mongoose and uses OAuth authentication to create a website where people can share secrets anonymously and view other submissions

<img width="1800" alt="Screenshot 2023-04-27 at 3 07 20 PM" src="https://user-images.githubusercontent.com/116110498/235279614-40566fb2-8bc6-4007-8872-3c178a118106.png">

<img width="1800" alt="Screenshot 2023-04-27 at 3 09 59 PM" src="https://user-images.githubusercontent.com/116110498/235279625-9e3ef9a4-8345-4a69-8c3f-d1b2f30ad102.png">

<img width="1800" alt="Screenshot 2023-04-27 at 3 07 38 PM" src="https://user-images.githubusercontent.com/116110498/235279615-bed1eb88-a8d0-4a53-a044-ac5c298ce9f4.png">


# Before code can successfully be run:

## Step 1

cd to your project folder and make sure to npm install all the packages being used in the code

## Step 2

To easily setup everything through Google Developer Console, simply watch this short video: 
https://www.youtube.com/watch?v=pBVAyU4pZOU

!!! MAKE SURE TO NOT SHARE YOUR CREDENTIALS !!!

## Step 3

Create a .env file to hold your sensitive information i.e. credentials from Google and the secret you will use for setting up a Passport session.
In my case, the session secret is under the name SECRET, and for Google credentials, the Client ID is under GOOGLE_CLIENT_ID and the Client Secret is under GOOGLE_CLIENT_SECRET. These go into your .env file

## Step 4

Call the variables in your app.js from your .env file using the format process.env.YOUR_VARIABLE_NAME.

## Step 5

Make sure your Mongo shell is up and running. Code should work on your local environment now (given that the port number for MongoDB and localhost is aligned with yours, mine are the default numbers

## Note:

Before deploying to Github, make sure to add a .gitignore file and ignore the .env file in it so as to not have your credentials revoked
