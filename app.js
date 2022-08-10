const express = require('express');

const app = express();
const PORT = 3015;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello from server');
});
