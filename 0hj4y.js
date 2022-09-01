const fs = require("fs");
const betastar = require("betastar.js");
const cron = require("node-cron");
var axios = require("axios");
const {
  addAbortSignal
} = require("stream");
global.msgs = [];

// ONLY WORKS WITH PATCHED BETASTAR.JS
let client = new betastar("username", "password");

var perms = {
  tmflsh: 3,
  blacklisted_acc4: 3,
  blacklisted_acc3: 3,
  evildude101: 3,
  Villains: 2,
  zastixV2: 2,
  zastix: 2,
  Alligatorbruh: 2,
  qaiik: 2,
  Xotic: 0,
  Doxy: 0,
  Ankha: 0,
};

var prefix = "!";

var commands = {
  whoami: [
    "🤔 Who are you",
    "%whoami <user> or %whoami",
    function (msg, args) {
      if (args.length === 1)
        axios
        .get("https://betastar.org/api/user/?name=" + args[0], {
          headers: {
            Cookie: client.token,
          },
        })
        .then((data) => {
          var aData = data.data;
          msg.reply(
            aData.element === null ||
            aData.element === "" ||
            aData.element === undefined ?
            "blax" :
            (aData.element.replace("CUSTOM|", "").startsWith("/") ?
              "https://betastar.org" +
              aData.element.replace("CUSTOM|", "") :
              aData.element.replace("CUSTOM|", "")) +
            " - " +
            args[0] +
            " (" +
            aData.role +
            ") " +
            aData.atoms +
            " atoms, " +
            "Discord: " +
            (aData.linked === "none" || aData.linked === undefined ?
              "None" :
              aData.linked.split("|")[0])
          );
        });
      else if (args.length === 0)
        msg.reply(
          msg.author.element === null ||
          msg.author.element === "" ||
          msg.author.element === undefined ?
          "blax" :
          (msg.author.element.replace("CUSTOM|", "").startsWith("/") ?
            "https://betastar.org" +
            msg.author.element.replace("CUSTOM|", "") :
            msg.author.element.replace("CUSTOM|", "")) +
          " - " +
          msg.author.name +
          " (" +
          msg.author.role +
          ") " +
          msg.author.atoms +
          " atoms, " +
          "Discord: " +
          (msg.author.linked.tag === undefined ?
            "None" :
            msg.author.linked.tag) +
          " "
        );
      else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'whoami <user> or !whoami');
      }
    },
  ],
  prefix: [
    "⁉️ Sets the prefix of the bot",
    "%prefix <prefix>",
    function (msg, args) {
      if (args.length === 1) {
        prefix = args[0];
        console.log(prefix);
        msg.send("Alright! New prefix is " + args[0]);
      } else msg.reply("The maximum argument length is 1. Try this: " + prefix + "prefix <prefix>");
    },
    2,
  ],
  cocksize: [
    "🐓 How large is your (or someone else's) cock?",
    "%cocksize <user> or %cocksize",
    function (msg, args) {
      var size = Math.floor(Math.random() * 24) + 1;
      for (var x of Object.entries(perms)) {
        if ((msg.author.name === x[0]) && (args.length === 0)) {
          if (x[1] >= 2) {
            size = 119;
          }
        } else if (args[0] !== undefined && args[0] !== null) {
          if ((args[0] === x[0]) && (x[1] >= 2)) {
            size = 150;
          }
        }
      }
      var thing = "";
      if (args.length === 0) {
        if (size >= 24) thing = "You must like gay furry porn!";
        else if (size >= 12) thing = "1 foot defeated 😨";
        else if (size >= 6) thing = "Micropenis Ⓜ️";
        else if (size >= 1) thing = "Man you can do better, can't you???";
        msg.reply(
          "Your cock's size is approximately: 8" +
          "=".repeat(size / 3) +
          "|)" +
          " (" +
          size +
          " inches.) : " +
          thing
        );
      } else if (args.length === 1) {
        if (size >= 24)
          thing = "He must like watching your mom in bed with another man!";
        else if (size >= 12) thing = "He's got a cock larger than yours 😱";
        else if (size >= 6) thing = "Smol pp";
        else if (size >= 1) thing = "MicroMicroPenis Ⓜ️Ⓜ️";
        msg.send(
          args[0] +
          "'s cock size is approximately: 8" +
          "=".repeat(size / 3) +
          "|)" +
          " (" +
          size +
          " inches.) : " +
          thing
        );
      } else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'cocksize <user>');
      }
    },
  ],
  gay: [
    "🌈 How gay are you (or another person)",
    "%gay <user> or %gay",
    function (msg, args) {
      var gay = true;
      if (args.length === 0) {
        for (var x of Object.entries(perms)) {
          if (msg.author.name === x[0] && !(x[1] === 0)) {
            gay = false;
          }
        }
      } else if (args.length === 1) {
        for (var x of Object.entries(perms)) {
          if (args[0] === x[0] && !(x[1] === 0)) {
            gay = false;
          }
        }
      }
      var gayness;
      if (gay === false) {
        gayness = 0;
      } else {
        gayness = Math.floor(Math.random() * 101).toString();
      }
      if (args.length === 0)
        msg.reply(
          "You are " +
          gayness +
          "% gay!" +
          (gayness === "0%" ? " (WHAT)" : gayness === "100%" ? " (🌈)" : "")
        );
      else if (args.length === 1)
        msg.send(
          args[0] +
          " is " +
          gayness +
          "% gay!" +
          (gayness === "0%" ?
            " (based 🗿)" :
            gayness === "100%" ?
            " (do they go by they/them pronouns?)" :
            "")
        );
      else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'gay <user>');
      }
    },
  ],
  coinflip: [
    "🪙 Flip a coin",
    "%coinflip",
    function (msg, args) {
      var side = Math.floor(Math.random() * 3).toString();
      msg.send("🪙 " + (side === 1 ? "Heads!" : "Tails!"));
    },
  ],
  penisfight: [
    "🪳 Penis swords game",
    "%penisfight <player>",
    function (msg, args) {
      if (args.length === 0) msg.send("Are you really gonna masturbate here?");
      else if (args.length === 1) {
        var responses = [
          "died of gayness.",
          "got an STD and died.",
          "was fucked too hard to handle.",
          "had too much of an orgasm and filled up a bathtub, depleted himself of cum, spat out blood and died.",
          "somehow fit his cock inside of %user's and his balls were pressed to death.",
          "had his dick sliced off by %user.",
          "decided to drop out of the competition.",
          "had too soft of a dick to play.",
        ];
        var loser = Math.floor(Math.random() * 2);
        for (var x of Object.entries(perms)) {
          if (msg.author.name === x[0]) {
            console.log('W/B in fuck command (author)');
            if (x[1] >= 2) {
              loser = 1;
            }
          } else if (args[0] === x[0]) {
            console.log('W/B in fuck command (args[0])');
            if (x[1] >= 2) {
              loser = 0;
            }
          }
        }
        var msgIN = Math.floor(Math.random() * 7);
        if (loser === 0)
          msg.send(
            "🪳 @" +
            msg.author.name +
            " " +
            responses[msgIN].replaceAll("%user", args[0]) +
            " @" +
            args[0] +
            " wins!"
          );
        else if (loser === 1)
          msg.send(
            "🪳 @" +
            args[0] +
            " " +
            responses[msgIN].replaceAll("%user", msg.author.name) +
            " @" +
            msg.author.name +
            " wins!"
          );
      } else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'penisfight <user>');
      }
    },
  ],
  fuck: [
    "🫂 Fuck someone regardless of genders.",
    "%fuck <user>",
    function (msg, args) {
      if (args.length === 0) {
        msg.reply("You're so lonely you wanna fuck yourself. 😭");
      } else if (args.length === 1) {
        var responses = [
          "got fucked so hard his fake ass furry tail dropped off.",
          "got an STD from %user.",
          "shot cum webs all over the ceiling.",
          "filled up a bathtub with his cum.",
          "got a cumshot that was too salty to enjoy.",
          "had his dick sliced in half by %user.",
          "found his true love, %user!",
          "experienced extreme pleasure and passed away in a coma, all because of %user.",
        ];
        var loser = Math.floor(Math.random() * 2);
        for (var x of Object.entries(perms))
          if (msg.author.name === x[0]) {
            console.log('W/B in fuck command (author)');
            if (x[1] >= 2) {
              loser = 1;
            }
          } else if (args[0] === x[0]) {
          console.log('W/B in fuck command (args[0])');
          if (x[1] >= 2) {
            loser = 0;
          }
        }
        var msgIN = Math.floor(Math.random() * 7);
        if (loser === 0)
          msg.send(
            msg.author.name +
            " " +
            responses[msgIN].replaceAll("%user", args[0])
          );
        else if (loser === 1)
          msg.send(
            args[0] +
            " " +
            responses[msgIN].replaceAll("%user", msg.author.name)
          );
      } else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'fuck <user>');
      }
    },
  ],
  bitches: [
    "🧔‍♀️ How many bitches do you (or does someone else) have?",
    "%bitches <user> or %bitches",
    function (msg, args) {
      if (args.length === 0) {
        var bitches = Math.floor(Math.random() * 101);
        for (var x of Object.entries(perms))
          if (msg.author.name === x[0]) {
            console.log('W/B in bitches command (author)');
            if (x[1] >= 2) {
              bitches = 32767;
            }
          } else if ((args[0] !== undefined) && (args[0] !== null)) {
          if ((args[0] === x[0]) && (x[1] >= 2)) {
            bitches = 32767;
          }
        }
        if (bitches === 0) msg.reply("You have ZERO bitches. How depressing.");
        else msg.reply("You have " + bitches.toString() + " bitch(es).");
      } else if (args.length === 1) {
        var bitches = Math.floor(Math.random() * 101);
        for (var x of Object.entries(perms))
          if (x[0] === args[0]) {
            console.log('W/B in bitches command (args[0])');
            if (x[1] >= 2) {
              bitches = 32767;
            }
          }
        if (bitches === 0) msg.send(args[0] + " has ZERO bitches. LOL!");
        else msg.send(args[0] + " has " + bitches.toString() + " bitch(es).");
      } else {
        msg.reply('The maximum argument length is 1. Try this: ' + prefix + 'bitches <user>');
      }
    },
  ],
};

var limit = false;

client.on("receivedMessage", (msg) => {
  if (limit === false) {
    try {
      if (msg.content.startsWith(prefix + "help")) {
        let data =
          "Hello! I'm 0hJay, a bot made with Betastar.js! These are my commands: ";
        for (var command of Object.entries(commands)) {
          data =
            data +
            command[1][1].replaceAll("%", prefix) +
            ": " +
            command[1][0] +
            " || ";
        }
        try {
          msg.send(
            data.slice(0, -4) +
            " !!! THIS VERSION DOES NOT HAVE THE IP XOTIC COMMAND !!!" +
            " ".repeat(Math.floor(Math.random() * 10) + 1)
          );
        } catch (e) {
          console.log("Ratelimited");
          limit = true;
          setTimeout(function () {
            limit = false;
          }, 4000);
        }
        return;
      } else {
        Object.entries(commands).forEach((command) => {
          if (msg.content.startsWith(prefix + command[0])) {
            try {
              if (command[1][3] !== undefined) {
                console.log(
                  "Command " + command[0] + " triggered, perms required."
                );
                if (perms[msg.author.name] >= command[1][3]) {
                  try {
                    command[1][2](msg, msg.content.split(" ").slice(1));
                  } catch (e) {
                    console.log("Ratelimited");
                    limit = true;
                    setTimeout(function () {
                      limit = false;
                    }, 4000);
                  }
                }
              } else {
                console.log(
                  "Command " + command[0] + " triggered, perms not required."
                );
                try {
                  command[1][2](msg, msg.content.split(" ").slice(1));
                } catch (e) {
                  console.log("Ratelimited");
                  limit = true;
                  setTimeout(function () {
                    limit = false;
                  }, 4000);
                }
              }
            } catch (e) {
              console.log("Ratelimited");
              limit = true;
              setTimeout(function () {
                limit = false;
              }, 4000);
            }
          }
        });
      }
    } catch (e) {
      console.log("Ratelimited");
      limit = true;
      setTimeout(function () {
        limit = false;
      }, 4000);
    }
  }
});