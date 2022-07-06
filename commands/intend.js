const { SlashCommandBuilder } = require('@discordjs/builders');
const {getInteractionMessage, sendMessage} = require("../functions/messages");
const {addPlayer, isGameStarted} = require("../functions/general");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('intend')
        .setDescription('intending to room')
        .addStringOption(option =>
            option.setName('room')
                .setDescription('room id')
        ),
    async execute(interaction) {
        getInteractionMessage(interaction, 'room');
        let roomId = interaction.options.getString('room');
        if(!isGameStarted(roomId))
            addPlayer(roomId, interaction.user);
        sendMessage(interaction, 'msg');
    },
};