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


## Importants points for interview
# Quiz Game Backend

## Technology Stack

- **Express.js**: Used for building the API, handling HTTP requests, and managing game logic.
- **MongoDB with Mongoose**: Employed for data storage and retrieval. Designed schemas for games and multiple-choice questions (MCQs) to ensure efficient data management.
- **Pusher**: Integrated for real-time updates and notifications, ensuring clients are notified of game state changes.

## Features

- **Authentication**: Implemented secure user authentication using JWT for access control.
- **Game Management**: Managed game creation, joining, and state transitions, ensuring a consistent game experience.
- **MCQ Management**: Handled the addition and retrieval of MCQs, supporting quiz functionality.
- **Real-time Communication**: Used Pusher for notifying clients of game state changes and updates.

## API Design

- **Endpoints**: Developed endpoints for user login, registration, game management, and answer submission.
- **Error Handling**: Implemented error handling and validation for user inputs and API requests.

## Data Management

- **Database Schema**: Designed schemas for storing game and user data, including relationships and indexing for efficient queries.
- **State Management**: Managed game states (waiting, active, completed) to ensure consistency across clients.

## Challenges and Solutions

- **Concurrency**: Addressed challenges with concurrent game sessions by implementing proper state management and synchronization.
- **Real-Time Updates**: Integrated Pusher to handle real-time interactions, enhancing the user experience with live updates.

## Future Enhancements

- **Scalability**: Plans to improve scalability to handle more concurrent users and games efficiently.
- **Additional Features**: Considering additional endpoints and features for enhanced game management and analytics.

## Project Scope

- **Overview**: An Express.js-based backend for managing quiz games, supporting real-time updates and secure user interactions.
- **User Stories**: Key functionalities include authentication, game management, MCQ handling, and real-time communication.

## Collaboration

- **Teamwork**: If applicable, describe the collaboration process, including code reviews and development coordination.

## Contributing

Contributions are welcome. Please open issues or submit pull requests. For detailed contribution guidelines, refer to the `CONTRIBUTING.md` file.



