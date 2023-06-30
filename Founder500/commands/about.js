const colors = require('../colors.json')
const Discord = require('discord.js');

module.exports = {
    name: "about",

    async run (client, message, args) {
		let messageArry = message.content.split(" ")
		let cmd = messageArry[0]; 
		const about = new Discord.MessageEmbed()
		.setTitle('About')
		.setDescription('**Bouncer is a ID/Founder500 bot for CyberpunkXXX, Created by AinzOoalGown#3496**')
		.setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
		.setColor(colors.main)
		message.channel.send(about)
	}
}