'use strict';

// TODO: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.json
const pg = require('pg');
const fs = require('fs');
const express = require('express');

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// TODO: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password

// This is commented
// const conString = 'postgres://postgres:1234@HOST:5432/hackerIpsum.json
const conString = 'postgres://localhost:5432';

// TODO: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... This line of code corresponds to #5 in the full-stack-diagram; line 46-51 on article.js are interecting with this code; those lines invoke the method Article.loadAll which is located in same js file at line 35; It is using the READ part of CRUD
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... This line of code corresponds to number 3 in the full-stack-diagram; this is interacting with line 22 in article.js which is the Article.all method which is the array holding all articles; this particular line of code is an array and is not directly invoking or interacting with another portion; the part of CRUD being used is READ
  client.query('SELECT * FROM articles')
  .then(function(result) {
    response.send(result.rows);
  })
  .catch(function(err) {
    console.error(err)
  })
});

app.post('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... This line of code is referring to number 3 of the full-stack-diagram; This is interacting with the  Article.prototype.insertRecord on line 69 in article.js using method post; The part of CRUD being utilized is CREATE
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
  .then(function() {
    response.send('insert complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.put('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...this corresponds to # 3 in the full-stack-diagram; the client-side code this is interacting with the  Article.prototype.updateRecord on line 88 in article.js using method PUT; the part of CRUD this is doing is UPDATE
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
  .then(function() {
    response.send('update complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... the following block of code deals with numbers 1-5 on the full-stack-diagram; this is interacting with the Article.prototype.deleteRecord on line 77 in article.js using method DELETE; this is using the DESTROY part of CRUD
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... this is using the whole diagram; this is interacting with Article.truncateTable on line 58 using method DELETE; the part of CRUD being used is DESTROY
  client.query(
    'DELETE FROM articles;'
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

// COMMENT: What is this function invocation doing?
// Put your response here... loading data for table, which the function will create a table if one is not present.
loadDB();

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... this is using numbers 3 and 4 from the full-stack-diagram; this is interacting with Article.fetchAll; the part of CRUD being used is READ
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(title, author, "authorUrl", category, "publishedOn", body)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
            [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
          )
        })
      })
    }
  })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here... this is using the whole full-stack-diagram; depending on if the table exists this will interact with Article.all and/or Article.prototype.updateRecord using method PUT; this will use the CRUD parts CREATE/READ/UPDATE depending on if data exists or not.
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
    )
    .then(function() {
      loadArticles();
    })
    .catch(function(err) {
      console.error(err);
    }
  );
}
