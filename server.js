const app = require('./app');

const PORT = 3015;

// START SERVER
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
  });