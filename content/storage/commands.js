module.exports = [
    {
        command:"ping",
        description:"Answers with pong",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"help",
        description:"Shows information about a command.",
        required_params:[],
        optional_params:[
            {key:"c",description:"The command to retrieve help about."}
        ],
        disabled: false,
    },
    {
        command:"insult",
        description:"Makes the bot say an insult.",
        required_params:[],
        optional_params:[
            {key:"p",description:"The person to direct the insult to (Works with @person)."}
        ],
        disabled: false,
    },
    {
        command:"meme",
        description:"Sends a random meme.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"fancy",
        description:"Makes text fancy with a random font and/or a random decoration.",
        required_params:[
            {key:"style",description:"f for random font, d for random decoration, fd for both."},
            {key:"message", description:"The message to be made fancy."}
        ],
        optional_params:[],
        disabled: false,
    },
    {
        command:"purge",
        description:"Deletes messages from current channel (DEFAULT ALL MESSAGES)",
        required_params:[],
        optional_params:[
            {key:"amount",description:"The amount of messages to delete starting from the latest (excluding purge command) (MAX 99)."},
            {key:"user", description:"Choose a specific person to delete messages from."}
        ],
        disabled: false,
    },
    {
        command:"say",
        description:"Says a message with text to speach.",
        required_params:[
            {key:"message",description:"The message to say."},
        ],
        optional_params:[],
        disabled: true,
    },
    {
        command:"music_play",
        description:"Plays music",
        required_params:[
            {key:"url",description:"The url of the music."},
        ],
        optional_params:[],
        disabled: false,
    },


];