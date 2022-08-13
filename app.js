const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//  MIDDLEWARES
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev')); // 'tiny'
}

// Middleware to transform req into json
app.use(express.json());
// Middleware to serve static files (e.g images)
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log('Hello from middleware');
  req.requestTime = new Date().toDateString();
  next();
});

//  ROUTES

app.get('/', (req, res) => {
  //   res.status(200);
  //   res.send('Hello from server');
  res.status(200).json({ message: 'Hello from server', app: 'Natours' });
});
app.post('/', (req, res) => {
  res.send('Post received from server');
});
// app.get('/api/v1/tours/:id/:optionalParam?', getTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/usersa', userRouter);

module.exports = app;
