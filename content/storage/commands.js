module.exports = [
    {
        command:"ping",
        description:"Answers with pong.",
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
        description:"Deletes messages from current channel (DEFAULT ALL MESSAGES).",
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
        optional_params:[
            {key:"lang",description:"The language to say the message in. Choices: english, french, dutch, german, korean, russian, italian, spanish."},],
        disabled: false,
    },
    {
        command:"coinflip",
        description:"Flips a coin.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"music_play",
        description:"Starts playing music in the voice channel where the user is connected to.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"music_stop",
        description:"Stops playing music.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"music_add",
        description:"Add a song to the playlist.",
        required_params:[],
        optional_params:[
            {key:"url",description:"Pick a song by a youtube url."},
            {key:"search",description:"Pick a song by entering the title."},
            {key:"position",description:"The position to place the song at in the playlist (1 = top)."},
        ],
        disabled: false,
    },
    {
        command:"music_pick",
        description:"Picks a song from the search results from the command 'music_add -search title'.",
        required_params:[
            {key:"num",description:"The number of the song to add from the search results."},
        ],
        optional_params:[],
        disabled: false,
    },
    {
        command:"music_skip",
        description:"Skips the currently playing song.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },
    {
        command:"music_purge",
        description:"Removes songs from the playlist.",
        required_params:[],
        optional_params:[
            {key:"amount",description:"The amount of songs to delete starting from top (DEFAULT ALL SONGS)."},
        ],
        disabled: false,
    },
    {
        command:"music_list",
        description:"Gives a list of all the songs queued in the playlist.",
        required_params:[],
        optional_params:[],
        disabled: false,
    },


];