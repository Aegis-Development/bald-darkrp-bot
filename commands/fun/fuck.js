const Discord = require("discord.js");
const { SQL } = require("../../exports/databaseManager");
const { BaldGaming } = require("../../exports/baldgaming");

module.exports = {
    name: 'fuck2',
    description: 'Shit',
    usage: 'none',
    category: 'Fun',
    permission: BaldGaming.AccessLevels.mod,
    reqargs: 0,
    execute(message, args){
       message.reply("ur a fuckstick");

       //console.log(message.client.hasRole(message.member, "502031842229223424"));
       
        SQL.Query("SELECT * FROM `users`", null, (success, data) => {
            console.log(data['result'].name);
        });
    }
}