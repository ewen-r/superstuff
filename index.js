import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";


const PROJECT = "SuperStuff";
/* Set dirname prefix for the current root so that files can be served.
 * e.g res.sendFile(_dirname + '/web/index.html'); */
const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

let username = "";
let users = [];

// Shop icon
const superShopSvg = '<path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5ZM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1Zm0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />';

// NOTE: Test via postman using Body = x=www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Link static files.
app.use(express.static("public"));


// Handle GET requests to "/"
app.get('/',
  (req, res) => {
    console.debug("GET \"/\":");

    // Default case... Presume User is not logged in.
    let ejsOpts = {
      svgIconHtml: superShopSvg,
      titleText: "SuperStuff",
      paraText: "Never to be missed offers await.",
      buttonText: "Sign up now!",
      buttonHref: "/signup"
    };

    if (username) {
      ejsOpts.paraText = `Welcome back ${username}.`;
      ejsOpts.buttonText = "Shop now!";
      ejsOpts.buttonHref = "/shop";
    }
    res.locals = ejsOpts;
    res.render("index.ejs");
  }
);


// Handle GET requests to "/signup"
app.get('/signup',
  (req, res) => {
    console.debug("GET \"/signup\":");
    res.render("signup.ejs");
  }
);


// Handle GET requests to "/shop"
app.get('/shop',
  (req, res) => {
    console.debug("GET \"/shop\":");
    let ejsOpts = {
      products: []
    };
    res.locals = ejsOpts;
    res.render("shop.ejs");
  }
);


// Handle POST to 
app.post('/register',
  (req, res) => {
    console.debug("POST: \"/register\": ", req.body);

    if (req.body.username && req.body.email && req.body.password) {
      addUser(req.body.username, req.body.email, req.body.password);
      // If remember was ticked.. pretend to be clever and remember user.
      if (req.body.remember) {
        username = req.body.username;
      }
      res.redirect("/");
    } else {
      // Problem with sign-in..
      console.error("Problem with sign in data.");
      res.redirect("/signup");
    }
  }
);



function haveUser(username) {
  console.log("haveUser", username);
  if (users.find(
    u => {
      return (u.username == username);
    }
  )) {
    console.log(`Already have user ${username}`);
    return true;
  }

  return false;
}


function addUser(username, userEmail, userPassword) {
  console.log("addUser", username, userEmail, userPassword);

  if (haveUser(username)) {
    console.log(`Already have user ${username}`);
    return false;
  } else {
    users.push({
      username: username,
      email: userEmail,
      password: userPassword
    });
    return true;
  }
}


// Start the app, listening on PORT "PORT".
app.listen(PORT,
  () => {
    console.log(`PROJECT "${PROJECT}": Server is running on http://localhost:${PORT}`);
  }
);


