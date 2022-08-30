const mongoose = require('mongoose');
const dotenv = require('dotenv');
//  sets env params from file  (pushes them on procces.env)
//  must be set before app
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
).replace('<USERNAME>', process.env.DATABASE_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true // added to avoid deprecated warning
  })
  .then(con => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });
// .catch(err => console.log('ERROR: ', err));

// handles errors that are not predicted. (also asychronous promises rejected?)
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception!! Shutting down');
  process.exit(1);
});

const app = require('./app');

// console.log(process.env);

const PORT = process.env.PORT || 3015;
// START SERVER
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection!! Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
