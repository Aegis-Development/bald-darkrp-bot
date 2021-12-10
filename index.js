require("dotenv").config();

// depedency
const fs = require("fs");
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const mysql = require('mysql');
const http = require('http');
const Logger = require("./exports/logger");
const { SQL } = require("./exports/databaseManager");
const { Config } = require('./exports/config');
const { count } = require("console");

var db;

// vars used by the client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.DIRECT_MESSAGES]});
client.commands = new Collection();

client.ranks = {
    
}

client.EmbedMessage = function(title, fields, user, thumbnail, desc){
	if(!thumbnail){
		thumbnail = false;
	}

	if(desc){
		const rt = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setAuthor(client.user.username, client.user.avatarURL())
			.setThumbnail(thumbnail)
			.addFields(
				fields,
			)
			.setTimestamp()
			.setFooter('Executed by ' + user.username, user.avatarURL());

		return rt;
	}

	if(thumbnail != false){
		const rt = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setAuthor(client.user.username, client.user.avatarURL())
			.setThumbnail(thumbnail)
			.addFields(
				fields,
			)
			.setTimestamp()
			.setFooter('Executed by ' + user.username, user.avatarURL());

	return rt;
	}
	//user = client.users.fetch(user, true);

	const rt = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(title)
	.setAuthor(client.user.username, client.user.avatarURL())
	.addFields(
		fields,
	 )
	.setTimestamp()
	.setFooter('Executed by ' + user.username, user.avatarURL());

	return rt;
}

client.hasRole = function(member, roleid){
	var rt = false;

	member.roles.cache.each(function(v, k){
		if(roleid == v){
			rt = true;
		}
	});

	return rt;
}

client.isStaff = function(minrank, member){
	if(client.hasRole(member, minrank)) return true;
	
	return false;
}


client.on('ready', () => {
	console.log("Creating database object...");

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", (member) => {
	console.log(`[New Member] Checking if ${member.name} is verified.`);

    SQL.Query("SELECT `identifier`, `discord` FROM `users` WHERE `discord` = 'discord:?'", [member.id], (success, res) => {
        if(!success) {
            console.error(`[FATAL] An error occured while attempting to check ${member.name}'s verification. Error: ${res}`);
            return;
        }
        res = res['result'];

        if(res.length > 0) {
            console.log(`[INFO] ${member.name} (${member.id}) is verified on FiveM with account ${res.identifier}`);

            member.roles.add("735631264153075814");
            member.user.send("Welcome back! You've previously linked your discord with us, and have been granted the verified role automatically.");
        }
    });
});


// Load Commands
const loadCommands = fs.readdirSync('./commands');
for(const folder of loadCommands){
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

	for(const file of commandFiles){
		const command = require(`./commands/${folder}/${file}`);

		client.commands.set(command.name, command);
	}
}

client.on('messageCreate', msg => {
    if(msg.content.indexOf("stearncommunytiy.ru") != -1 && !msg.member.user.bot) {
        msg.member.send("This link is a known phishing site. You have been banned from the server, and your message as been removed.");
        msg.member.ban({days: 7, reason: "Posting phishing links."});
        msg.delete();

        return;
    }

	if(msg.content.substring(0, 1)== "!"){
		let args = msg.content.split(" ");
		let cmd = args[0].replace('!', '');

		if(!client.commands.has(cmd)) return;

		var cmdobj = client.commands.get(cmd);

		args.splice(0, 1);
		let argtxt = args.join(" ");

		if(args.length == 0) argtxt = "<NONE>"
		console.log(msg.member.user.username + " attempted to run command " + cmd + " with args " + argtxt);

		if(cmdobj.permission == 0){
			if(args.length < cmdobj.reqargs){
				msg.reply("you are missing required args! Usage: ```!" + cmd + " " + cmdobj.usage + "```");
				return;
			}

			try {
				cmdobj.execute(msg, args)
			} catch(error){
				console.log(msg.member.user.username + " had a fatal error while running " + cmd + " error: \n" + error);
				msg.reply("Error running command!\n```" + error + "```");
			}
		}else if(msg.member.hasPermission(cmdobj.permission) || msg.member.hasPermission('ADMINISTRATOR')){
			if(args.length < cmdobj.reqargs){
				msg.reply("you are missing required args! Usage: ```!" + cmd + " " + cmdobj.usage + "```");
				return;
			}
			try {
				cmdobj.execute(msg, args)
			} catch(error){
				console.log(msg.member.user.username + " had a fatal error while running " + cmd + " error: \n" + error);
	
				msg.reply("Error running command!\n```" + error + "```");
			}
		}else{
			msg.reply('You do not have permission to execute this command');
		}
	}
});

client.login(process.env.TOKEN);