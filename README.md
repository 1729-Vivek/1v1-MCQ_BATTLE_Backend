# Backend

## Overview

This is the backend service for the MCQ and game application, built with Express.js. It handles game management, user authentication, and provides endpoints for frontend interactions.

## Features

- User authentication and management.
- Game creation, joining, and management.
- MCQ management and game state updates.
- Real-time updates with Pusher.

## Technologies

- Express.js
- MongoDB (with Mongoose)
- Pusher (for real-time updates)
- JSON Web Token (JWT) for authentication

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/backend-repo.git
    ```

2. Navigate to the project directory:
    ```bash
    cd backend-repo
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory with the following content:
    ```env
    MONGO_URI=mongodb://localhost:27017/your-database
    JWT_SECRET=your-jwt-secret
    PUSHER_APP_ID=your-pusher-app-id
    PUSHER_KEY=your-pusher-key
    PUSHER_SECRET=your-pusher-secret
    PUSHER_CLUSTER=your-pusher-cluster
    ```

5. Start the server:
    ```bash
    npm start
    ```

## Running Tests

- Run the tests using:
    ```bash
    npm test
    ```

## API Endpoints

- **POST /api/login**: User login.
- **POST /api/register**: User registration.
- **POST /api/games**: Create a new game.
- **GET /api/games/:gameId**: Get game details.
- **POST /api/games/:gameId/submit-answer**: Submit an answer.
- **POST /api/games/:gameId/end**: End the game.

## Contributing

Feel free to open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.
