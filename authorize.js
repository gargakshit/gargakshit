require("dotenv").config();
require("isomorphic-unfetch");
const express = require("express");

const app = express();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const scopes = [
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-recently-played",
];

console.log("Please visit");
console.log(
  "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" +
    clientId +
    (scopes ? "&scope=" + encodeURIComponent(scopes.join(" ")) : "") +
    "&redirect_uri=" +
    encodeURIComponent("http://localhost:3000")
);

app.get("/", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(401).send("Not Authorized");
  }

  const data = await (
    await fetch(
      `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${encodeURIComponent(
        code
      )}&redirect_uri=${encodeURIComponent(
        "http://localhost:3000"
      )}&client_id=${clientId}&client_secret=${clientSecret}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded ",
        },
        method: "POST",
      }
    )
  ).text();
  console.log(data);

  return res.send("Authorized, please check console");
});

app.listen(3000);
