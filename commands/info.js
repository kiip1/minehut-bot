const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Gives info about Minehut Bot.',
	execute(message, args) {
		const client = message.client;

		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#00ff00')
			.setTitle('Minehut Bot Info')
			.addField('Servers with Minehut Bot:', `${client.guilds.cache.size} servers`)
			.addField('Active in this server since:', `${message.guild.member(client.user).joinedAt}`)
			.setTimestamp()
			.setFooter(message.author.tag, message.author.displayAvatarURL());
		
		message.channel.send(helpEmbed);

		return true;
	},
};