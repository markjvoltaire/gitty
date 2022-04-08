const { Router } = require('express');
const auth = require('../middleware/authentication');
const fetch = require('cross-fetch');

module.exports = Router().get('/', async (req, res) => {
  const arrayOfURLs = [
    'https://programming-quotes-api.herokuapp.com/quotes/random',
    'https://futuramaapi.herokuapp.com/api/quotes/1',
    'https://api.quotable.io/random',
  ];

  function fetchQuotes(arrayOfURLs) {
    return Promise.all(arrayOfURLs.map((url) => fetch(url))).then(
      (response) => {
        console.log('response', response);
        return Promise.all(response.map((responses) => responses.json()));
      }
    );
  }

  function mungedQuotes(data) {
    if (data.content) return data.content;
    if (data.en) return data.en;
    if (data[0]) return data[0].quote;
  }

  fetchQuotes(arrayOfURLs)
    .then((rawQuotes) =>
      rawQuotes.map((data) => {
        return {
          author: data.author || data[0].character,
          content: mungedQuotes(data),
        };
      })
    )
    .then((quotesMunged) => res.send(quotesMunged));
});
