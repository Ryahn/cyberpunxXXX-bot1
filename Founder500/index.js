const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { Collection, Client } = require("discord.js");
const { token, default_prefix } = require("./config.json");
const config = require("./config.json");
const colors = require("./colors.json");
const { red, green, blue } = require('chalk');
const { readdirSync } = require("fs");
const fs = require("fs");
const { join, format } = require("path");
const activities = [
  "https://cyberpunkxxx.com",
  "Default Prefix : $$",
  "Server : https://discord.gg/cyberpunkxxx",
  "/verify to get 18+ Night Club Access",
];


const client = new Discord.Client({ disableEveryone: true, fetchAllMembers: true });

process.on('unhandledRejection', console.error);

client.queue = new Map();

client.on("ready", () => {
  const guild = client.guilds.cache.size.toLocaleString();
  const user = client.users.cache.size.toLocaleString();
  const channel = client.channels.cache.size.toLocaleString();

  let readychannel = client.channels.cache.get("1094076751988150383");
  const ready = new Discord.MessageEmbed()
    .setTitle("I'm Online")
    .setThumbnail(
      client.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
    )
    .setDescription(
      `<a:yes:784463701305458708> **Serving ${user} users in ${guild} servers and ${channel} channels**`
    )
    .setColor(colors.main)
    .setFooter(
      `${client.user.username}`,
      client.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
    );
  readychannel.send(ready);

  const DevEvil = String.raw`

   _____       _                                 _   __   ____   ____   __ ______       _   
  /  __ \     | |                               | |  \ \ / /\ \ / /\ \ / / | ___ \     | |  
  | /  \/_   _| |__   ___ _ __ _ __  _   _ _ __ | | __\ V /  \ V /  \ V /  | |_/ / ___ | |_ 
  | |   | | | | '_ \ / _ \ '__| '_ \| | | | '_ \| |/ //   \  /   \  /   \  | ___ \/ _ \| __|
  | \__/\ |_| | |_) |  __/ |  | |_) | |_| | | | |   </ /^\ \/ /^\ \/ /^\ \ | |_/ / (_) | |_ 
   \____/\__, |_.__/ \___|_|  | .__/ \__,_|_| |_|_|\_\/   \/\/   \/\/   \/ \____/ \___/ \__|
          __/ |               | |                                                           
         |___/                |_|                                                           
  
                                                   
                                                   
      Founder500 is online               
      Developer: Ryahn
`;

  console.log(blue(DevEvil));
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
    const newActivity = activities[randomIndex];

    client.user.setActivity(newActivity);
  }, 10000);
});

client.on('error', console.error)
client.on('warn', console.warn)

process.on('unhandledRejection', (error) => {
  console.error(`Uncaught Promise Error: \n${error.stack}`)
})

process.on('uncaughtException', (err) => {
  let errmsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
  console.error(errmsg)
})

client.commands = new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith(default_prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  let patreon = {
    inthegame: '1072593099634774157',
    producer: '1072592969363898530',
    elite: '1072591858942873681',
    vip: '1072591565509382294',
    supporter: '1071525664949276784',
    founder: '1094091674910728232'
  };

  let logChannel = client.channels.cache.get("1094076751988150383");
  let founderChannel = client.channels.cache.get("1071510747617702009");
  const role = newMember.guild.roles.cache.find(role => role.id === patreon.founder) //the role to check
  const totalFounder = role.members.map(m => m.id) // array of user IDs who have the role
  const totalMembers = totalFounder.length+1 // how many users have the role

  if (!newMember.roles.cache.has(patreon.founder) && totalMembers <= 500) {
    if (newMember.roles.cache.has(patreon.producer)) {
      newMember.roles.add(patreon.founder);
      logChannel.send(`${newMember.user} (${newMember.id}) has Producer but not part of Founder 500. Giving Found 500 role.`)
      founderChannel.send(`${newMember.user} welcome to founders! Founder ${totalMembers}`)
    } else if (newMember.roles.cache.has(patreon.inthegame)) {
      newMember.roles.add(patreon.founder);
      logChannel.send(`${newMember.user} (${newMember.id}) has In The Game but not part of Founder 500. Giving Found 500 role.`)
      founderChannel.send(`${newMember.user} welcome to founders! Founder ${totalMembers}`)
    } else if (newMember.roles.cache.has(patreon.elite)) {
      newMember.roles.add(patreon.founder);
      logChannel.send(`${newMember.user} (${newMember.id}) has Elite Supporter but not part of Founder 500. Giving Found 500 role.`)
      founderChannel.send(`${newMember.user} welcome to founders! Founder ${totalMembers}`)
    } else if (newMember.roles.cache.has(patreon.vip)) {
      newMember.roles.add(patreon.founder);
      logChannel.send(`${newMember.user} (${newMember.id}) has VIP Supporter but not part of Founder 500. Giving Found 500 role.`)
      founderChannel.send(`${newMember.user} welcome to founders! Founder ${totalMembers}`)
    } else if (newMember.roles.cache.has(patreon.supporter)) {
      newMember.roles.add(patreon.founder);
      logChannel.send(`${newMember.user} (${newMember.id}) has Supporter but not part of Founder 500. Giving Found 500 role.`)
      founderChannel.send(`${newMember.user} welcome to founders! Founder ${totalMembers}`)
    }
  }

});

client.login(token);
