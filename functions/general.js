const {randomUUID} = require("crypto");
const {sendMessage} = require("../functions/messages");

module.exports.start = async function (roomId, minPlayers) {
    let room = rooms.find(room => room.id === roomId);
    if (room.players.length >= (minPlayers ?? 4)) {
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
    if(!room) return null;
    if(!room.players) return null;
    let str = '';
    room.players.forEach(player => {
        str += player.name + '\n';
    });
    return str;
}

module.exports.formatString = function (text, ...values) {
    return text.replace(/\{(\d)\}/g, (s, num) => values[num]);
}

module.exports.getStringLocale = function (strArray, locale) {
    return locale === "en" ? strArray[0] : strArray[1];
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
    if(!room) return false;
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