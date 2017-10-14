module.exports = [
    {
        command:"example",
        description:"This is an example command.",
        required_params:[
            {key:"p",description:"This is a required parameter."},
            {key:"t",description:"This is another required parameter."}
        ],
        optional_params:[
            {key:"x",description:"This is an optional parameter."},
            {key:"y",description:"This is another optional parameter."}
        ]
    },
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
    }

];