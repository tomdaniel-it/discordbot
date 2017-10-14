module.exports = [
    {
        command:"ping",
        description:"Answers with pong",
        required_params:[],
        optional_params:[]
    },
    {
        command:"help",
        description:"Shows information about a command.",
        required_params:[],
        optional_params:[
            {key:"c",description:"The command to retrieve help about."}
        ]
    },
    {
        command:"insult",
        description:"Makes the bot say an insult.",
        required_params:[],
        optional_params:[
            {key:"p",description:"The person to direct the insult to (Works with @person)."}
        ]
    },
    {
        command:"meme",
        description:"Sends a random meme.",
        required_params:[],
        optional_params:[]
    }

];