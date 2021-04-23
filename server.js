require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const urlParse = require("url-parse");
const shortid = require("shortid");
const dns = require("dns");
const Url = require("./models/Url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log(err);
    })


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
});


app.post("/api/shorturl", async (req, res) => {
    const parsedUrl = new urlParse(req.body?.url);
    dns.lookup(parsedUrl.toString(), async (err, addr, fam) => {
        if (addr) {
            const urlInDb = await Url.findOne({ url: parsedUrl.toString() });
            if (urlInDb) {
                res.send(`${urlInDb.url} --- ${urlInDb.shortenedHost}/api/shorturl/${urlInDb.shortenedHash}`);
                return;
            }
            const shortenedHost = `${req.protocol}://${req.get('host')}`;
            const shortenedHash = shortid.generate();
            const newUrl = new Url({
                shortenedHost,
                shortenedHash,
                url: parsedUrl.toString()
            });
            try {
                const response = await newUrl.save({});
                res.send(`${response.url} --- ${response.shortenedHost}/api/shorturl/${response.shortenedHash}`);
            } catch (err) {
                res.send(err);
            }
        } else {
            res.json({
                error: "Invalid Url"
            })
        }
    })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
