const Discord = require('discord.js');
const { token, id } = require('./config.json');

global.client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
	client.user.setActivity('mh!help', {
		type: 'STREAMING',
		url: 'https://www.twitch.tv/ '
	});

	require('./commands.js');
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);

			return;
		}
	}

	if (user.id == id) return;

	const users = await reaction.users.fetch();

	if (reaction.message.author.id == id || users.has(id)) reaction.users.remove(user.id);
});

client.login(token);