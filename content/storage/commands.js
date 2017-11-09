/*
 * EXAMPLE: .something -option1 value1 -option2 value2 (-option3 value3)
 * {
 *      command: "something", //COMMAND NAME AND CATEGORY ARE UNIQUE (TOGETHER!) Ex: no command 'polls' when there already exists a category 'polls'
 *          //'all' = RESERVED
 *      description: "Description of command",
 *      category: "random", //IMPORTANT FOR help COMMAND
 *      required_params: [
 *          {key:"option1",description:"This is option 1"},
 *          {key:"option2",description:"This is option 2"}
 *      ],
 *      optional_params: [
 *          {key:"option3",description:"This is option 3, this one is optional"},
 *      ],
 *      disabled: false, //IF true => COMMAND CAN'T BE USED BY ANYONE
 *      required_role: null, //NULL => EVERYONE CAN USE IT, STRING => EVERYONE WITH THAT ROLE CAN USE IT (Example: "admin")
 *      cooldown_time: null //NULL OR 0 => NO COOLDOWN, EX: 300 (IN SECONDS) => 5 MINUTE COOLDOWN PER USER
 * }
*/

module.exports = [
    {
        command:"ping",
        description:"Answers with pong.",
        category: "random",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"help",
        description:"Shows information about a command, category or everything.",
        category: "random",
        required_params:[
            {key:"command|category|all",description:"The command, category or everything to retrieve help about."}
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"insult",
        description:"Makes the bot say an insult.",
        category: "random",
        required_params:[],
        optional_params:[
            {key:"user",description:"The user to direct the insult to (Works with @user)."}
        ],
        disabled: false,
        required_role: null,
        cooldown_time: 60,
    },
    {
        command:"meme",
        description:"Sends a random meme.",
        category: "random",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"fancy",
        description:"Makes text fancy with a random font and/or a random decoration.",
        category: "random",
        required_params:[
            {key:"style",description:"f for random font, d for random decoration, fd for both."},
            {key:"message", description:"The message to be made fancy."}
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"purge",
        description:"Deletes messages from current channel.",
        category: "random",
        required_params:[],
        optional_params:[
            {key:"amount",description:"The amount of messages to delete starting from the latest (excluding purge command) (MAX 99)."},
            {key:"user", description:"Choose a specific person to delete messages from."}
        ],
        disabled: false,
        required_role: "admin",
        cooldown_time: null,
    },
    {
        command:"say",
        description:"Says a message with text to speach.",
        category: "random",
        required_params:[
            {key:"message",description:"The message to say."},
        ],
        optional_params:[
            {key:"language",description:"The language to say the message in. Choices: english, french, dutch, german, korean, russian, italian, spanish."},],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"coinflip",
        description:"Flips a coin.",
        category: "random",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_play",
        description:"Starts playing music in the voice channel where the user is connected to.",
        category: "music",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_stop",
        description:"Stops playing music.",
        category: "music",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_add",
        description:"Add a song to the playlist.",
        category: "music",
        required_params:[
            {key:"url|title",description:"Pick a song by a youtube url or title."},
        ],
        optional_params:[
            {key:"position",description:"The position to place the song at in the playlist (1 = top)."},
        ],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_pick",
        description:"Picks a song from the search results from the command 'music_add -search title'.",
        category: "music",
        required_params:[
            {key:"num",description:"The number of the song to add from the search results."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_skip",
        description:"Skips the currently playing song.",
        category: "music",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_purge",
        description:"Removes songs from the playlist.",
        category: "music",
        required_params:[],
        optional_params:[
            {key:"amount",description:"The amount of songs to delete starting from top (DEFAULT ALL SONGS)."},
        ],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"music_list",
        description:"Gives a list of all the songs queued in the playlist.",
        category: "music",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"admin_add",
        description:"Gives a user the admin role.",
        category: "permissions",
        required_params:[
            {key:"user",description:"The user to give the admin role to."},
        ],
        optional_params:[],
        disabled: false,
        required_role: "admin",
        cooldown_time: null,
    },
    {
        command:"admin_remove",
        description:"Removes the admin role from a specific user.",
        category: "permissions",
        required_params:[
            {key:"user",description:"The user to remove the admin role from."},
        ],
        optional_params:[],
        disabled: false,
        required_role: "admin",
        cooldown_time: null,
    },
    {
        command:"admin_list",
        description:"Gives a list of all admin users.",
        category: "permissions",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: "admin",
        cooldown_time: null,
    },
    {
        command:"admin_commands",
        description:"Shows all commands for only admins.",
        category: "permissions",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: "admin",
        cooldown_time: null,
    },
    {
        command:"poll_create",
        description:"Creates a poll.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
        ],
        optional_params:[
            {key:"option1;...",description:"The options for the poll (seperated by ';')."},
        ],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_close",
        description:"Closes a poll and shows the most wanted option.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_list",
        description:"Gives a list of all open polls.",
        category: "polls",
        required_params:[],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_remind",
        description:"Sends a message with the poll information.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_vote",
        description:"Vote on an option from a poll.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
            {key:"option_num",description:"The number of the option."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_unvote",
        description:"Remove your vote from an option from a poll.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
            {key:"option_num",description:"The number of the option."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_add_option",
        description:"Adds an option to a poll.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
            {key:"option",description:"The name of the option."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"poll_remove_option",
        description:"Removes an option from a poll.",
        category: "polls",
        required_params:[
            {key:"name",description:"The name of the poll."},
            {key:"option_num",description:"The number of the option."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"remind",
        description:"Reminds a user of something he has to do.",
        category: "random",
        required_params:[
            {key:"user",description:"The user to remind."},
            {key:"message",description:"The message."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"sb_play",
        description:"Plays a sound.",
        category: "soundboard",
        required_params:[
            {key:"sound_name",description:"The name of the sound."},
        ],
        optional_params:[],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
    {
        command:"sb_list",
        description:"List all of the sounds available.",
        category: "soundboard",
        required_params:[],
        optional_params:[
            {key:"directory",description:"The directory to list sounds from."},
        ],
        disabled: false,
        required_role: null,
        cooldown_time: null,
    },
];