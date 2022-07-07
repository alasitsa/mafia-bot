const { SlashCommandBuilder } = require('@discordjs/builders');
const {getInteractionMessage, sendMessage} = require("../functions/messages");
const {playerListStr, getStringLocale} = require("../functions/general");
const { players } = require('../commands.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription(getStringLocale(players))
        .addStringOption(option =>
            option.setName('room')
                .setDescription('room id')
        ),
    async execute(interaction) {
        getInteractionMessage(interaction, 'room');
        let roomId = interaction.options.getString('room');
        sendMessage(interaction, playerListStr(roomId));
    },
};