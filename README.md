# Links
Documentation: [Click Here](https://docs.google.com/document/d/1icATDE41zBhdGM5qlPNgBdHJe0I8uJxtTujov9Cpqn4/edit?usp=sharing)<br/>
UI Design (Figma): [Click Here](https://www.figma.com/file/k5eDd6Edq2NL3xGf4do5Ki/Guardian?type=design&node-id=0%3A1&t=Js4hdwCZioEZo3dU-1)<br/>
Frontend Repo: [Click Here](https://github.com/ishtails/Guardian-Frontend)<br/>

# Installation Guide

This is a simple guide to help you locally install and run the backend.

## Prerequisites

Before proceeding with the installation, make sure you have the following prerequisites installed on your machine:

- Node.js (version 14 or above)
- npm (Node Package Manager)

## Installation

Follow these steps to install and run the Node Express app locally:

1. Fork the Repo & Clone to the repository to your local machine:

   ```bash
   git clone <forked url>
   ```

2. Navigate to the project directory:

   ```bash
   cd Guardian-Backend
   ```

3. Install the dependencies using npm:

   ```bash
   npm install
   ```

4. Rename the `.env.template` file in the project to `.env` file and fill your local environment variable values. For Example

   ```
   PORT=8000
   MONGO_URL = mongodb://localhost:27017/mydatabase
   ```

   Note: Modify the values according to your needs.

5. Start the application:

   ```bash
   npm run dev
   ```

   This command will start the server and make the app available at `http://localhost:8000` by default.

6. Open your web browser and navigate to `http://localhost:8000` to see the application running.

## Configuration

If you need to customize the configuration of the Node Express app, you can modify the following files:

- `server.js`: The main application file where you can set up middleware, routes, and other configurations.
- `.env`: The environment variables file where you can define settings like the port number, database connection string, etc.

## Usage

Once the Node Express app is up and running, you can interact with it using your preferred API testing tool or by making HTTP requests from your own applications.

The app provides API endpoints that you can access to perform various actions according to its functionality. Refer to the app's documentation or source code for details on the available endpoints and their usage.

## Contributing

If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository on GitHub.
2. Create a new branch with your name in it from the `main` branch for your changes.
3. Make your modifications, add features, or fix bugs.
4. Ensure that your code adheres to the project's coding conventions and style.
5. Commit your changes and push them to your fork.
6. Submit a pull request describing your changes
