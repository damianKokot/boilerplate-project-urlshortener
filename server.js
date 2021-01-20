require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlsBase = [];

app.get('/api/shorturl/:short_url', (req, res) => {
  const index = parseInt(req.params.short_url);

  if(index < 0 || index >= urlsBase.length)
    res.json({
      error: 'invalid url'
    })
  else {
    res.redirect(urlsBase[index]);
  }
})

// Your first API endpoint
app.post('/api/shorturl/new', function(req, res) {
  const urlRegex = /http(s|):\/{1,2}([\w-]+\.)+[\w]+/;
  const { url } = req.body;

  if (!url || !url.match(urlRegex))
    res.json({
      error: 'invalid url'
    })
  else {
    const domain = url.split('/')[2];
    dns.lookup(domain, (err, address, family) => {
      if(err)
        res.json({
          error: 'invalid url'
        })
      else
      {
        urlsBase.push(req.body.url);

        res.json({
          original_url : req.body.url,
          short_url : urlsBase.length - 1
        });
      }
    })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
