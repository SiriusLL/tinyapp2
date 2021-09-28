const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extend: true }));
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};
console.log(generateRandomString());
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log("PT", req.cookies.username);
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  console.log("hello", req.params);
  const longURL = urlDatabase[req.params.shortURL];
  console.log("long", longURL);
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // res.send("OK"); //Respond with 'OK' (we will replace this)
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("surl", req.params);
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  console.log("data", urlDatabase);
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  console.log("s", req.params.shortURL);
  console.log("l", req.body.longURL);
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log("d", urlDatabase);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  console.log("login", req.body);
  const username = req.body && req.body.username ? req.body.username : "";
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
