const dotenv = require('dotenv');
//  sets env params from file  (pushes them on procces.env)
//  must be set before app
dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);

const PORT = process.env.PORT || 3015;
// START SERVER
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
