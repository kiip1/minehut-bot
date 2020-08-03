const fs = require('fs');
const Discord = require('discord.js');
const { prefix, success, fail } = require('./config.json');

const commandFiles = fs.readdirSync('./commands');

client.commands = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('message', async (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (client.commands.has(command)) {
		try {
			const usage = client.commands.get(command).usage;

			var requiredArgs = 0;

			if (usage != undefined) {
				requiredArgs = usage.split(' ').length;
			}

			if (args.length == requiredArgs) {
				client.commands.get(command).execute(message, args);
				
				message.react(success);
			} else {
				message.channel.send(`Usage: ${prefix}${command} ${usage}`);

				message.react(fail);
			}
		} catch (error) {
			console.error(error);

			message.channel.send('Oops... an error occurred whilst executing that command.');

			message.react(fail);
		}
	} else {
		message.channel.send(`That command couldn\'t be recognised. Type ${prefix}help for help.`);

		message.react(fail);
	}
});

client.on('messageUpdate', (_oldMessage, newMessage) => {
	const reactions = newMessage.reactions.cache;

	if (reactions.get(success) == undefined || !reactions.get(success).me) {
		if (!(reactions.get(fail) == undefined || !reactions.get(fail).me)) {
			reactions.get(fail).remove();
		}

		client.emit('message', newMessage);
	}
});