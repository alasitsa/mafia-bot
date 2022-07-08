const { SlashCommandBuilder } = require('@discordjs/builders');
const {TextChannel, CommandInteraction, Guild, VoiceChannel, ChannelManager, GuildMemberManager, Collection} = require("discord.js");
const {getRooms, createRoom} = require("../functions/general");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        console.log(rooms);
        // (new VoiceChannel()).members
        getRooms()
            .then(rooms => {
                console.log(rooms);
                createRoom()
                    .then(() => {
                        getRooms().then(rooms => console.log(rooms));
                    });
            });
    },
};