module.exports.sendMessage = function (interaction, message) {
    let user = client.users.cache.find(user => user.id === process.env.CLIENT_ID);
    console.log(formatInteractionMessage(user, message, interaction.channel));
    interaction.channel.send(message);
}

module.exports.getInteractionMessage = function (interaction, ...options) {
    let message = '/' + interaction.commandName;
    options.forEach(optionName => {
        message += ' ' + interaction.options.getString(optionName);
    });
    console.log(formatInteractionMessage(interaction.user, message, interaction.channel));
}

function formatDate(date) {
    return date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds() + ' '
        + date.getDate() + '.'
        + (date.getMonth() + 1) + '.'
        + date.getFullYear();

}

function formatInteractionMessage(user, message, channel) {
    return '[' + formatDate(new Date()) + '] '
        + '(' + channel.name + ') '
        + user.username + ': ' + message;
}

module.exports.formatErrorMessage = function (message) {
    return '[' + formatDate(new Date()) + '] '
    + '(Error): ' + message;
}