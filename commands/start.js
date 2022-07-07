const {SlashCommandBuilder} = require('@discordjs/builders');
const {readyTime, minPlayers} = require('../config.json');
const {startRoom, playerCount, getStringLocale, formatString} = require('../functions/general.js');
const {waitingMsg, readyTimeLeftMsg, startedMsg, notEnoughPlayersMsg} = require('../messages.json');
const {timeoutMessages, createRoom, addPlayer, playerListStr} = require("../functions/general");
const {getInteractionMessage, sendMessage} = require("../functions/messages");
const { start } = require('../commands.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(getStringLocale(start)),
    async execute(interaction) {
        getInteractionMessage(interaction);
        let roomId = createRoom();
        addPlayer(roomId, interaction.user);
        sendMessage(interaction, formatString(getStringLocale(waitingMsg), roomId))
        let timeLeftMsg = getStringLocale(readyTimeLeftMsg);
        timeoutMessages(1, readyTime ?? 60000, timeLeftMsg, 10000, interaction, roomId);
        setTimeout(() => {
            let count = playerCount(roomId);
            startRoom(interaction, roomId, minPlayers)
                .then((started) => {
                    let msg = started
                        ? (formatString(getStringLocale(startedMsg), count, roomId) + '\nPlayers: \n' + playerListStr(roomId))
                        : (formatString(getStringLocale(notEnoughPlayersMsg), count, minPlayers, roomId));
                    sendMessage(interaction, msg);
                });
        }, readyTime ?? 60000);
    },
};