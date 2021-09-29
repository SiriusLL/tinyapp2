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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};
console.log(generateRandomString());

const addNewUser = (users, email, password) => {
  const userId = generateRandomString();
  //create new user
  const newUser = {
    id: userId,
    email,
    password,
  };

  //add new usessr to db
  users[userId] = newUser;
  return userId;
};

//validate form inputs returns false of fields are not empty, otherwise returns an error message
const validateInput = (email, password) => {
  //create boolean
  const emptyFields = !email || !password;

  if (emptyFields) {
    return "Please, fill-in both the email and password";
  }

  return false;
};

const findUserByEmail = (usersDb, email) => {
  for (let userId in usersDb) {
    if (usersDb[userId].email === email) {
      return usersDb[userId];
    }
  }
  return false;
};

// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  console.log("PT", users[req.cookies.user_id]);
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id],
  };
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  console.log("hello", req.params);
  const longURL = urlDatabase[req.params.shortURL];
  console.log("long", longURL);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: longURL,
    user: users[req.cookies["user_id"]],
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
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
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Authentication routes

// Display the register page
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  // extract the email and password from the submitted form
  const email = req.body.email;
  const password = req.body.password;

  // validate the email and password with a helper function
  // return a string in errorMsg if there are no email and passwords
  const errorMsg = validateInput(email, password);

  // if we have an error message, send it and exit the function
  if (errorMsg) {
    res.status(400).send(errorMsg);
    return;
  }

  // check that the user with that email is not already in the users db with the
  // findUserByEmail helper function
  const user = findUserByEmail(users, email);

  // if the user exist send an error message
  if (user) {
    res
      .status(400)
      .send("A user with that email already exists, try to login instead");
    return;
  }

  //Add the new user into the db using a helper function
  // the function returns the new user id
  const userId = addNewUser(users, email, password);

  // set the userId in the cookies to log the user in
  res.cookie("user_id", userId);

  // redirect to /urls
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
