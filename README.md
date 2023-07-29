# Links

Paper: [Click Here](https://drive.google.com/file/d/1KRv_YBNtan94x9XF6fUw3y1G5wY68zJP/view?usp=sharing)<br/>
UI Design (Figma): [Click Here](https://www.figma.com/file/k5eDd6Edq2NL3xGf4do5Ki/Guardian?type=design&node-id=0%3A1&t=Js4hdwCZioEZo3dU-1)<br/>
Frontend Repo: [Click Here](https://github.com/ishtails/guardian-client)<br/>

# Installation Guide

This is a simple guide to help you locally setup the backend for development.

## Prerequisites

Before proceeding with the installation, make sure you have the following prerequisites installed on your machine:

- Docker - [Setup](https://docs.docker.com/engine/install/)
- NodeJS - [Setup](https://nodejs.org/en/download)

## Installation

Follow these steps to install and run the Node Express app locally:

1. Fork the Repo & Clone to the repository to your local machine:

   ```bash
   git clone <forked url>
   ```

2. Navigate to the project directory:

   ```bash
   cd guardian-server
   ```

3. Duplicate the `.env.template` file in the project and rename it to `.env` file and configure the environment variables as needed. 

   ```
   PORT=8000
   MONGO_URL=mongodb://localhost:27017/Guardian
   REDIS_HOST="localhost"
   SESS_SECRET=1234567890
   GMAIL_ID= (Google email)
   GMAIL_APP_PASS= (Google App Password from 2FA option)
   CLOUDINARY_NAME= (Cloudinary Credentials)
   CLOUDINARY_APIKEY= (Cloudinary Credentials)
   CLOUDINARY_APISECRET= (Cloudinary Credentials)
   ```

   NOTE: You do not necessarily need to setup GMAIL / CLOUDINARY environments to run the server, they are only needed for specific functions like sending Email & updating images. <br/><br/>
   NOTE: Google App Password is not the same as your regular password! ([Guide](https://support.google.com/accounts/answer/185833?hl=en))

5. Start docker & then run the following command to start redis & mongoDB containers (Verify all containers are running in docker):

   ```bash
   docker-compose up -d --build
   ```
6. Run the script to install dependencies:

   ```bash
   npm i
   ```
7. Run the start command:

   ```bash
   npm run dev
   ```

7. You'll need a client like Postman / Thunder Client (or [Guardian Frontend](https://github.com/ishtails/guardian-client) set up locally) to test the API endpoints. From the imports folder, Import the "api-endpoints-postman.json" file in postman to import all the routes in postman or "api-endpoints-thunder.json" in thunder if you prefer Thunder Client.

8. You can access Redis-commander GUI tool on [http://localhost:8081](http://localhost:8081) & mongo-express GUI tool on [http://localhost:8082](http://localhost:8082) for managing database. The server should be live at [http://localhost:8000](http://localhost:8000).

NOTE: You can import sample mongoDB data for testing from imports/Guardian.users & imports/Guardian.outings using mongo-express GUI tool.

## Contributing

If you would like to contribute to this project, please follow these guidelines:

1. Set up the repository on locally.
2. Create a new branch with your name in it from the `main` branch for your changes.
3. Make your modifications, add features, or fix bugs.
4. Ensure that your code adheres to the project's coding conventions and style.
5. Commit your changes and push them to your fork.
6. Submit a pull request describing your changes
