const { SlashCommandBuilder } = require('@discordjs/builders');
const {getInteractionMessage, sendMessage} = require("../functions/messages");
const {addPlayer, isGameStarted, getStringLocale, formatString} = require("../functions/general");
const { intend } = require('../commands.json');
const { playerAdded, playerNotAdded } = require('../messages.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('intend')
        .setDescription(getStringLocale(intend))
        .addStringOption(option =>
            option.setName('room')
                .setDescription('room id')
        ),
    async execute(interaction) {
        getInteractionMessage(interaction, 'room');
        let roomId = interaction.options.getString('room');
        if(!isGameStarted(roomId)) {
            let msg = addPlayer(roomId, interaction.user) ? playerAdded : playerNotAdded;
            sendMessage(interaction, formatString(getStringLocale(msg), roomId));
        }

    },
};