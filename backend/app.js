import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
console.log('Express app initialized.');

app.use(express.static('images'));
app.use(bodyParser.json());

console.log('Middleware configured.');

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

console.log('CORS configured.');

app.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');
  const placesData = JSON.parse(fileContent);
  res.status(200).json({ places: placesData });
});

console.log('GET /places route configured.');

app.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');
  const places = JSON.parse(fileContent);
  res.status(200).json({ places });
});

console.log('GET /user-places route configured.');

app.put('/user-places', async (req, res) => {
  const places = req.body.places;
  await fs.writeFile('./data/user-places.json', JSON.stringify(places));
  res.status(200).json({ message: 'User places updated!' });
});

console.log('PUT /user-places route configured.');

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

console.log('404 middleware configured.');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

console.log('App.listen configured.');
