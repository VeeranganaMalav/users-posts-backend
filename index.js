const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.log('Cannot connect to MongoDB');
        });

app.use('/users', authRoutes);
app.use('/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});