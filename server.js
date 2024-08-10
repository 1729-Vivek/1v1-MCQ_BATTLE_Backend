const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the cors package

dotenv.config();
connectDB();

const app = express();

// Use CORS middleware
app.use(cors());  // Add this line

app.use(express.json());

// Define your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mcqs', require('./routes/mcq'));
app.use('/api/game', require('./routes/game'));

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
