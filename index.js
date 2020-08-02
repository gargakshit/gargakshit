const fetch = require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");

  const { en: qoth, author: qoth_author } = await (
    await fetch("https://programming-quotes-api.herokuapp.com/quotes/random")
  ).json();

  const { access_token } = await (
    await fetch(
      `https://accounts.spotify.com/api/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded ",
        },
        method: "POST",
      }
    )
  ).json();

  const { total: sp_liked } = await (
    await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { total: sp_abl } = await (
    await fetch("https://api.spotify.com/v1/me/albums", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { total: sp_pl } = await (
    await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const readme = readmeTemplate
    .replace("{qoth}", qoth)
    .replace("{qoth_author}", qoth_author)
    .replace("{sp_liked}", sp_liked)
    .replace("{sp_abl}", sp_abl)
    .replace("{sp_pl}", sp_pl);

  await fs.writeFile("README.md", readme);
}

main();
