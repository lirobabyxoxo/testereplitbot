const { prefix, developerID } = require("./config.json")
// const { config } = require("dotenv"); // Não necessário no Replit
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js')
const express = require('express')
const { Client, MessageEmbed, Intents }  = require('discord.js');

// Simple database replacement
const dbPath = path.join(__dirname, 'database.json');
const db = {
  get: (key) => {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      return data[key] || null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      let data = {};
      try {
        data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch {}
      data[key] = value;
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      return value;
    } catch {
      return null;
    }
  }
};

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
let cooldown = new Set();
let cdseconds = 1; // cooldown time

// This code is made by Atreya#2401


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
process.on('UnhandledRejection', console.error);
 

client.on("messageCreate", async message => {
    
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if(cooldown.has(message.author.id)){

    return message.channel.send(`**${message.author.username}** ta travando :woozy: , espera \`10\` segundos de cooldown`)
  }
  cooldown.add(message.author.id);
  setTimeout(() => {
cooldown.delete(message.author.id)}, cdseconds * 1000)

  if (!message.member)
    message.member = await message.guild.members.fetch(message.author.id);


  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);  

});


client.on("messageCreate", async message => {

const channel = db.get(`verify_${message.guild.id}`);

if (channel === null) {
    return;
  }

const chan = client.channels.cache.get(channel);
if (chan && message.channel.name == chan.name) {
  message.delete();

}

        
});





// Do not change anything here
require('http').createServer((req, res) => res.end(`
 |-----------------------------------------|
 |              Informations               |
 |-----------------------------------------|
 |• Alive: 24/7                            |
 |-----------------------------------------|
 |• Author: lirolegal                      |
 |-----------------------------------------|
 |• Server: https://discord.gg/sintase     |
 |-----------------------------------------|
 |• Github: https://github.com/lirolegal   |
 |-----------------------------------------|
 |• License: Apache License 2.0            |
 |-----------------------------------------|
`)).listen(3000) //Dont remove this 

client.on("ready", () => {
   client.user.setStatus("dnd"); // You can change it to online, dnd, idle

 console.log(`Successfully logined as ${client.user.tag} `)
});

//  For Watching Status
// client.on("ready", () => {
// client.user.setActivity(`Chilling with owner`, { type:         "STREAMING",
// url: "https://www.twitch.tv/nocopyrightsounds"})});

client.login(process.env.TOKEN);
