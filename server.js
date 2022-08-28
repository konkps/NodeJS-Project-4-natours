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

// const testTour = new Tour({ name: 'mongoose name', price: 297, rating: 4.7 });
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(e => {
//     console.log('ERROR: ', e);
//   });

const app = require('./app');

// console.log(process.env);

const PORT = process.env.PORT || 3015;
// START SERVER
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
