const {randomUUID} = require("crypto");
const {sendMessage} = require("../functions/messages");
const {language} = require("../config.json");
require('dotenv').config();

module.exports.startRoom = async function (interaction, roomId, minPlayers) {
    let room = rooms.find(room => room.id === roomId);
    if (room.players.length >= (minPlayers ?? 4)) {
        createChannels(roomId, interaction.guild.channels)
            .then(created => {
                if (!created) return;
                console.log(rooms);
                room.players.forEach(player =>
                    movePlayerToChannel(player.id, roomId, room.genVoice, process.env.GENERAL_CHANNEL_ID, interaction));

            });
        room.started = true;
        return true;
    }
    global.rooms = rooms.filter(room => room.id !== roomId);
    return false;
}

module.exports.createRoom = function () {
    let roomId = randomUUID();
    rooms.push({
        id: roomId,
        players: [],
        started: false
    });
    return roomId;
}

module.exports.addPlayer = function (roomId, user) {
    if (isPlayerInGame(user)) return false;
    if (isPlayerIntendingAnyRoom(user))
        removePlayerFromAllRooms(user);

    let room = rooms.find(room => room.id === roomId);
    if (!room) return false;
    if (!room.players) return false;
    room.players.push(module.exports.createPlayer(user));
    return true;
}

module.exports.createPlayer = function (client) {
    return {id: client.id, name: client.username};
}

module.exports.playerCount = function (roomId) {
    let room = rooms.find(room => room.id === roomId);
    if (!room)
        return [];
    return room.players ? room.players.length : [];
}

module.exports.playerList = function (roomId) {
    let room = rooms.find(room => room.id === roomId);
    return room ? room.players : [];
}

module.exports.playerListStr = function (roomId) {
    let room = rooms.find(room => room.id === roomId);
    if (!room) return null;
    if (!room.players) return null;
    let str = '';
    room.players.forEach(player => {
        str += player.name + '\n';
    });
    return str;
}

module.exports.formatString = function (text, ...values) {
    return text.replace(/\{(\d)\}/g, (s, num) => values[num]);
}

module.exports.getStringLocale = function (strArray) {
    return language === "en" ? strArray[0] : strArray[1];
}

module.exports.timeoutMessages = function (currentTime, readyTime, message, step, interaction, roomId) {
    setTimeout(() => {
        let leftTime = readyTime - currentTime * step;
        if (leftTime <= 0)
            return;
        sendMessage(interaction, module.exports.formatString(message, leftTime / 1000, roomId));
        currentTime++;
        module.exports.timeoutMessages(currentTime, readyTime, message, step, interaction.channel, roomId);
    }, step);
}

module.exports.isGameStarted = function (roomId) {
    let room = rooms.find(room => room.id === roomId);
    if (!room) return false;
    return room.started;
}

function isPlayerIntendingAnyRoom(user) {
    let exist = false;
    rooms.forEach(room => {
        if (!room.players) return;
        if (room.players.find(player => player.id === user.id))
            exist = true;
    })
    return exist;
}

function isPlayerInGame(user) {
    let exist = false;
    rooms.forEach(room => {
        if (!room.players) return;
        if (room.players.find(player => player.id === user.id) && room.started)
            exist = true;
    })
    return exist;
}

function removePlayerFromAllRooms(user) {
    rooms.forEach(room => {
        if (!room.players) return;
        room.players = room.players.filter(player => player.id !== user.id);
    });
    return true;
}

async function createChannels(roomId, channels) {
    let room = rooms.find(room => room.id === roomId);
    if (!room)
        return false;

    // channels.create('gen-text-' + roomId, {reason: 'Started mafia game ' + roomId})
    //     .then(channel => {
    //         room.genText = channel.id;
    //         channel.setParent(process.env.CATEGORY_ID);
    //     });
    channels.create('gen-voice-' + roomId, {
        reason: 'Started mafia game ' + roomId,
        type: 'GUILD_VOICE'
    })
        .then(channel => {
            room.genVoice = channel.id;
            channel.setParent(process.env.CATEGORY_ID);
        });

    // channels.create('mafia-text-' + roomId, {reason: 'Started mafia game ' + roomId})
    //     .then(channel => {
    //         room.mafiaText = channel.id;
    //         channel.setParent(process.env.CATEGORY_ID);
    //     });
    // channels.create('mafia-voice-' + roomId, {
    //     reason: 'Started mafia game ' + roomId,
    //     type: 'GUILD_VOICE'
    // })
    //     .then(channel => {
    //         room.mafiaVoice = channel.id
    //         channel.setParent(process.env.CATEGORY_ID);
    //     });
    return true;
}

function movePlayerToChannel(playerId, roomId, channelId, currChannelId, interaction) {
    console.log(channelId);
    interaction.guild.channels.fetch(currChannelId)
        .then(currChannel => {
            if (!currChannel) return;
            let member = currChannel.members.find(player => playerId === player.user.id);
            if (!member) return;
            member.voice.setChannel(channelId).then(r => r); // TODO .then if member is not in currChannel send invite or smth
        });


    // interaction.guild.channels.fetch(channelId)
    //     .then(channel => {
    //         // console.log('\n\n\n' + interaction.guild.channels + '\n\n\n');
    //         if (!channel) return;
    //         interaction.guild.channels.fetch(currChannelId)
    //             .then(currChannel => {
    //                 if (!currChannel) return;
    //                 let member = currChannel.members.find(player => playerId === player.user.id);
    //                 if (!member) return;
    //                 member.voice.setChannel(channelId).then(r => console.log(r)); // TODO .then if member is not in currChannel send invite or smth
    //                 // console.log(member.voiceStates);
    //                 // member.voiceStates.channelID = channel.id;
    //                 // member.setVoiceChannel(channel.id);
    //             });
    //     });
}