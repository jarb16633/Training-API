require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const responseMiddleware = require('./middleware/responseMiddleware');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());
app.use(responseMiddleware);

// routes
app.use(cors());
app.use(logger());
app.use(bodyParser.json());
app.use('/api/v1', authRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
