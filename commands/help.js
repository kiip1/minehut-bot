const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Lists all Minehut Bot commands.',
	async execute(message, args) {
		const { commands } = message.client;

		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#00ff00')
			.setTitle('Minehut Bot Help')
			.setDescription(commands.map(command => `${prefix}${command.name} - ${command.description}`).join('\n'))
			.setTimestamp()
			.setFooter(message.author.tag, message.author.displayAvatarURL());
		
		message.channel.send(helpEmbed);

		return true;
	},
};