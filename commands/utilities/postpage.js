const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'postpage',
    description: 'Posts a page.',
    usage: '<page>',
    category: 'Utilities',
    permission: Permissions.FLAGS.ADMINISTRATOR,
    reqargs: 1,
    execute(message, args){
        let client = message.client;
        let channel = message.channel;

        if(args[0] == "darkrp_information") {
            const darkrpInfo = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Bald Gaming - DarkRP")
                .setThumbnail("https://cdn.discordapp.com/attachments/294374142445223936/918852317690884176/V3JLlo5w_400x400.png")
                .setDescription("Here you'll find all the information you'll need regarding our DarkRP branch.")
                .addFields(
                    {name: "Server Description", value: `Bald Gaming's DarkRP branch strives to bring a unique DarkRP experience to the table.

                    We don't want to be just any regular DarkRP server ran by those with perfect hair lines. 

                    We have many many custom-made addons, with many more on the way.
                    Our economy is one of our top focus points; we're trying our best to balance everything to give everyone a fair shot.

                    You're (hopefully) going to enjoy the unique experience. See you ingame!`},
                    {name: "Server IP: ", value: "steam://connect/darkrp.baldgaming.net:27015", inline: true},
                    {name: "Discord Invite", value: "https://discord.gg/94qd9XjS5j", inline:true},
                    {name: "Server Manager", value: "<@195644811821318145>", inline: true},  
                )
                .setTimestamp()
                .setFooter(`Executed by ${message.member.displayName}`, message.member.user.avatarURL())

            channel.send({embeds: [darkrpInfo]});
        } else if(args[0] == "minecraft_information") {
            const minecraftInfo = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Bald Gaming - Minecraft")
                .setThumbnail("https://cdn.discordapp.com/attachments/294374142445223936/918852317690884176/V3JLlo5w_400x400.png")
                .setDescription("Here you'll find all the information you'll need regarding our Minecraft branch.")
                .addFields(
                    {name: "Server Description", value: `Our Minecraft server is a unique one for sure.
                    
                    Our server features a hardcore survival towny element, with a well-balanced economy.
                    
                    The economy is extremely important and completely player driven. We do not stimulate the economy in any way.
                    We've spent a lot of time making sure the economy is spot on, we even have custom economy-related plugins made by <@790395920185163777>.
                    
                    Our spawn is completely player built from our first town ever; BaldVille.

                    Player's are able to join the default town and continue to build onto it, or they may leave, and colonize on their own or with friends.
                    Player's will start with $1,000 in the bank, but be aware, that money goes quick when it comes to establishing your own town.
                    
                    We hope to see you on the server!`},
                    {name: "Server IP: ", value: "mc.baldgaming.net", inline: true},
                    {name: "Discord Invite", value: "https://discord.gg/2rVqmjYNTr", inline: true},
                    {name: "Server Manager", value: "<@790395920185163777>", inline: true},  
                )
                .setTimestamp()
                .setFooter(`Executed by ${message.member.displayName}`, message.member.user.avatarURL())

            channel.send({embeds: [minecraftInfo]});
        } else {
            message.reply("Invalid page.");
        }
    }
}