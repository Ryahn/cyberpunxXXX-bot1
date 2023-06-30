const colors = require('../colors.json')
const Discord = require('discord.js');

module.exports = {
    name: "founders",

    async run (client, message, args) {
		let messageArry = message.content.split(" ")
		let cmd = messageArry[0]; 
        const role =  message.guild.roles.cache.find(role => role.id === '1094091674910728232') //the role to check
        const totalFounder = role.members.map(m => m.id) // array of user IDs who have the role
        const totalMembers = totalFounder.length // how many users have the role

		message.channel.send(`Total Founders: ${totalMembers}`)
	}
}