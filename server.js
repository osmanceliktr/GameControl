const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/news/:app', async (req, res) => {
  const appName = req.params.app;
  const searchQueries = {
    'brawl-stars': 'Brawl+Stars+tehlikeli',
    'snapchat': 'snapchat+tehlikeli',
    'amongus': 'among+us+tehlikeli'
  };

  try {
    const response = await axios.get(`https://www.google.com/search?q=${searchQueries[appName]}&tbm=nws`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
}); 