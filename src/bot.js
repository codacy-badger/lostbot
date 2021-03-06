const Eris = require('eris');
const { token, monpass } = require('./passwords');
const client = new Eris.Client(token, {
	getAllUsers: true,
	maxShards: 2,
	requestTimeout: 5000,
	restMode: true,
	defaultImageFormat: 'png',
	disableEvents: [
		'INTEGRATION_DELETE',
		'INTEGRATION_CREATE',
		'WEBHOOK_DELETE',
		'WEBHOOK_CREATE',
		'MESSAGE_UNPIN',
		'MESSAGE_PIN',
		'EMOJI_CREATE',
		'EMOJI_DELETE',
		'WEBHOOK_UPDATE',
		'WEBHOOK_DELETE',
		'WEBHOOK_CREATE',
		'MEMBER_PRUNE',
		'MEMBER_MOVE',
		'MEMBER_DISCONNECT',
		'MEMBER_BAN_ADD'
	]
});

const db = require('./database/database');
db.then(() => console.log('connected to the db')).catch((e) => console.log(e));

const fs = require('fs');
client.commands = new Eris.Collection();
fs.readdirSync('./commands/').forEach((dir) => {
	const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${dir}/${file}`);
		client.commands.set(command.name, command);
	}
	commandFiles.forEach((f, i) => {
		require(`./commands/${dir}/${f}`);
	});
});
fs.readdirSync('./events/').forEach((dir) => {
	const events = fs.readdirSync(`./events/${dir}/`).filter((file) => file.endsWith('.js'));
	for (let file of events) {
		const evt = require(`./events/${dir}/${file}`);
		let eName = file.split('.')[0];
		console.log(eName);
		client.on(eName, evt.bind(null, client));
	}
});

const connect = async () => {
	await client.connect();
};
connect();
