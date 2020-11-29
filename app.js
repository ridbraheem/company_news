// jshint esversion: 6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

const gHome = (req, res) => {
  res.render('index');
}


const search = (req, res) => {
  const {query} = req.body;
  const HeadT = req.body.query.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
  const apikey = process.env.API_KEY;
  const begin_date = req.body.begin_date.replace(/-/g, "");
  const end_date = req.body.end_date.replace(/-/g, "");
  const sort = req.body.sort.toLowerCase();
  const page = req.body.page || '0';
  const url = new URL("https://api.nytimes.com/svc/search/v2/articlesearch.json");
  const params = new URLSearchParams(url.search);
  params.set("api-key", apikey);
  params.set("query", query);
  params.set("begin_date", begin_date);
  params.set("end_date", end_date);
  params.set("sort", sort);
  params.set("page", page);

  const request = fetch(`${url}?${params.toString()}`)
  .then(response => response.json())
  .then(docs => {
     res.render('news_page', {
      nydata: docs.response.docs, HeadT: HeadT
  })
});
}




app.get('/', gHome);
app.post('/news', search);

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
