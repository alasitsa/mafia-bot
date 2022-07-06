const {SlashCommandBuilder} = require('@discordjs/builders');
const {readyTime, minPlayers, language} = require('../config.json');
const {start, playerCount, getStringLocale, formatString} = require('../functions/general.js');
const {waitingMsg, readyTimeLeftMsg, startedMsg, notEnoughPlayersMsg} = require('../messages.json');
const {timeoutMessages, createRoom, addPlayer, playerList, playerListStr} = require("../functions/general");
const {getInteractionMessage, sendMessage} = require("../functions/messages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts mafia game!'),
    async execute(interaction) {
        getInteractionMessage(interaction);
        let roomId = createRoom();
        addPlayer(roomId, interaction.user);
        sendMessage(interaction, formatString(getStringLocale(waitingMsg, language), roomId))
        let timeLeftMsg = getStringLocale(readyTimeLeftMsg, language);
        timeoutMessages(1, readyTime ?? 60000, timeLeftMsg, 10000, interaction, roomId);
        setTimeout(() => {
            let count = playerCount(roomId);
            start(roomId, minPlayers)
                .then((started) => {
                    let msg = started
                        ? (formatString(getStringLocale(startedMsg, language), count, roomId) + '\nPlayers: \n' + playerListStr(roomId))
                        : (formatString(getStringLocale(notEnoughPlayersMsg, language), count, minPlayers, roomId));
                    sendMessage(interaction, msg);
                });
        }, readyTime ?? 60000);
    },
};