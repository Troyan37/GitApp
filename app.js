const express = require('express');
const chalk = require('chalk');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render(
    'index',
  );
});


app.get('/repos/:name', async (req, res) => {
  try {
    let headers;

    if (process.env.API_KEY === 'YOUR_API_TOKEN' || typeof process.env.API_KEY === 'undefined' || process.env.API_KEY === '') {
      console.log(`${chalk.red('Token nie został uzupełniony, aby korzystać z API bez limitu skonfiguruj token zgodnie z README.md!')}`);
    } else {
      headers = {
        Authorization: `Token ${process.env.API_KEY}`,
      };
    }

    const response = await fetch(`https://api.github.com/users/${req.params.name}/repos?sort=update`,
      {
        method: 'GET',
        headers,
      });

    const json = await response.json();

    const results = json;

    return res.json({
      results,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});


app.listen(port, () => {
  console.log(`listening on port ${chalk.green(port)}`);
});
