const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription('Ready players'),
    async execute(interaction) {
        let playerList = "";
        (rooms[0]).players.forEach((player) => {
            playerList += player.name + '\n';
        });
        console.log(JSON.stringify(rooms));
        await interaction.reply(playerList);
    },
};