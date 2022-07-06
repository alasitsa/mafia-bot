module.exports.sendMessage = function (interaction, message) {
    const channel = interaction.channel;
    let user = client.users.cache.find(user => user.id === process.env.CLIENT_ID);
    console.log(user.username + ': ' + message);
    channel.send(message);
}

module.exports.getInteractionMessage = function (interaction, ...options) {
    let user = interaction.user;
    let message = user.username + ': /' + interaction.commandName;
    options.forEach(optionName => {
        message += ' ' + interaction.options.getString(optionName);
    });
    console.log(message);
}