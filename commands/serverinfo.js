const Discord = require('discord.js');
const https = require('https');

const plugins = require('../plugins.json');

const stripColors = (input) => {
	return input.replace(/&([a-f0-9])/gi, '')
    .replace(/&k/gi, '')
    .replace(/&l/gi, '')
    .replace(/&m/gi, '')
    .replace(/&n/gi, '')
    .replace(/&o/gi, '')
    .replace(/&r/gi, '')
    .replace(/\\n/gi, '');
}

const capitalize = (input) => {
  return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
}

const pluginName = (id) => {
	for (var i = 0; i < plugins.all.length; i++) {
		if (plugins.all[i].hasOwnProperty('_id')) {
			if (id == plugins.all[i]._id) {
				return plugins.all[i].name;
			}
		}
	}

	return 'Unknown';
}

module.exports = {
	name: 'serverinfo',
	description: 'Gives info about a Minehut server.',
	usage: '<server>',
	execute(message, args) {
		https.get(`https://api.minehut.com/server/${args[0]}?byName=true`, (response) => {
			var data = '';
	
			response.on('data', (chunk) => {
				data += chunk;
			});
	
			response.on('end', () => {
				const serverData = JSON.parse(data);
	
				if (serverData.hasOwnProperty('ok')) {
					if (!serverData.ok) {
						message.channel.send(`Server named "${args[0]}" couldn't be found.`)

						return;
					}
				}

				const server = serverData.server;

				const last_online = new Date(server.last_online);
				const created_at = new Date(server.creation);

				const serverinfoEmbed = new Discord.MessageEmbed()
					.setColor('#00ff00')
					.setTitle(`Server Info - ${server.name}`)
					.addField('Online:', `${server.online ? 'Online' : 'Offline'} since ${last_online.toLocaleString('en-US', {day: 'numeric'})} ${last_online.toLocaleString('en-US', {month: 'long'})} ${last_online.toLocaleString('en-US', {hour: 'numeric', hour12: false})}:${last_online.toLocaleString('en-US', {minute: 'numeric'})}`)
					.addField('Visible:', server.visibility ? 'Yes' : 'No')
					.addField('Online Players:', `${server.playerCount} / ${server.maxPlayers} players`)
					.addField('Server Plan:', capitalize(server.server_plan).replace('_', ' '))
					.addField('Plugins:', server.active_plugins.map((id) => pluginName(id)).join(', '))
					.addField('Motd:', stripColors(server.motd))
					.addField('Created At:', `${created_at.toLocaleString('en-US', {day: 'numeric'})}-${created_at.toLocaleString('en-US', {month: 'numeric'})}-${created_at.toLocaleString('en-US', {year: 'numeric'})} ${created_at.toLocaleString('en-US', {hour: 'numeric', hour12: false})}:${created_at.toLocaleString('en-US', {minute: 'numeric'})}`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL());
			
				message.channel.send(serverinfoEmbed);
			});
		}).on('error', (error) => {
			console.log(error);
		});
	},
};