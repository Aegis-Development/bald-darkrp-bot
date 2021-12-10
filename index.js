require("dotenv").config();

// depedency
const fs = require("fs");
const {Client, Intents, Collection, MessageEmbed, Permissions} = require('discord.js');
const mysql = require('mysql');
const http = require('http');
const { LogTypes, Log } = require("./exports/logger");
const { SQL } = require("./exports/databaseManager");
const { Config } = require('./exports/config');
const { BaldGaming } = require("./exports/baldgaming");
const { config } = require("dotenv");

var db;

// vars used by the client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.DIRECT_MESSAGES]});
client.commands = new Collection();

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

client.hasAccess = function(member, accessLevel) {
    if(member.permissions.has(Permissions.FLAGS.ADMINISTRATOR, false))
        return true;

    // probably not the best way to do this; hell, its 100% not, but whatever
    if(typeof accessLevel == "object") {
        accessLevel.forEach(val => {
            if(client.hasRole(member, val)) {
                return true;
            }
        });
    }

    if(typeof accessLevel === "bigint" && member.permissions.has(accessLevel)) {
        return true;
    }

    return false; // default to false to prevent any unwanted pregnancy.
}


client.on('ready', () => {
    Log(LogTypes.INFO, "Booting up Bald Bot!");

	Log(LogTypes.INFO, `Logged in as ${client.user.tag}!`);
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
    if(msg.author == client.user) // prevent the bot from saying something retarded and crashing down here. ie on the filter, it says the word the user tried to use.
        return;
    
    if(msg.content.indexOf("stearncommunytiy.ru") != -1 && !msg.member.user.bot) {
        msg.member.send("This link is a known phishing site. You have been banned from the server, and your message as been removed.");
        msg.member.ban({days: 7, reason: "Posting phishing links."});
        msg.delete();

        return;
    } else {
        Config.FilteredWords.forEach(val => {
            if(msg.content.indexOf(val) != -1 && (!msg.member.user.bot && !client.hasAccess(msg.member, BaldGaming.AccessLevels.mod))) {
                msg.member.send(`Wow, that word is so fucking rude. Shut your ass up. (You said a word in the filter list: '${val}')`);

                msg.delete();
            }
        });
    }

	if(msg.content.substring(0, 1)== "!"){
		let args = msg.content.split(" ");
		let cmd = args[0].replace('!', '');

		if(!client.commands.has(cmd)) return;

		var cmdobj = client.commands.get(cmd);

		args.splice(0, 1);
		let argtxt = args.join(" ");

		if(args.length == 0) argtxt = "<NONE>"
		Log(LogTypes.ERROR, msg.member.user.username + " attempted to run command " + cmd + " with args " + argtxt);

		if(cmdobj.permission == 0){
			if(args.length < cmdobj.reqargs){
				msg.reply("You're missing required args! Usage: ```!" + cmd + " " + cmdobj.usage + "```");
				return;
			}

			try {
				cmdobj.execute(msg, args)
			} catch(error){
				Log(LogTypes.ERROR, msg.member.user.username + " had a fatal error while running " + cmd + " error: \n" + error);

				msg.reply("Error running command!\n```" + error + "```");
			}
		}else if(client.hasAccess(msg.member, cmdobj.permission)){
			if(args.length < cmdobj.reqargs){
				msg.reply("You're missing required args! Usage: ```!" + cmd + " " + cmdobj.usage + "```");

				return;
			}
			try {
				cmdobj.execute(msg, args)
			} catch(error){
				Log(LogTypes.ERROR, msg.member.user.username + " had a fatal error while running " + cmd + " error: \n" + error);
	
				msg.reply("Error running command!\n```" + error + "```");
			}
		}else{
			msg.reply('You do not have permission to execute this command');
		}
	}
});

client.login(process.env.TOKEN);