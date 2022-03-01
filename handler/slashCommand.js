
const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const token = "OTQ1NTgzNTQzMTEzODgzNjc4.YhSRTA.c38L9R4lwapwL2xdjq6bY0st4cQ"; //get the token in .env
const guild = '943587795002343562'; //get the guild ID in .env
const application_id = '945583543113883678'; //get the application ID in .env

module.exports = (client) => {

    const slashCommands = []; //make a variable

    fs.readdirSync('./slashCommands/').forEach(dir => {
        const slashCommandFiles = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

        for (const file of slashCommandFiles) {
            const slashCommand =require(`../slashCommands/${dir}/${file}`);
            slashCommands.push(slashCommand.data.toJSON());
            if(slashCommand.data.name) { //if the slash command file has a name
                client.slashCommands.set(slashCommand.data.name, slashCommand)
                console.log(file, '- Success') //check if the file load and log in console
            } else {
                console.log(file, '- Error') //if the file doesn't have command name, log it error in console
            }
        }
    });
    
    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try{
            console.log('Start registering application slash commands...')

            await rest.put(
                guild
                ? Routes.applicationGuildCommands(application_id, guild) //registered the slash command in guild
                : Routes.applicationGuildCommands(application_id), //registered the slash command globally
                {
                    body: slashCommands,
                }
            );

            console.log('Successfully registered application slash commands.')
        } catch (err) {
            console.log(err);
        }
    })();

};