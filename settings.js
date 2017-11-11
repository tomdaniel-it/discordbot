module.exports = {
    //DEFAULT
    error_message_time_until_deletion: 5, //IN SECONDS
    memes_directory: __dirname + "/content/storage/memes/",
    command_prefix: ".", //SINGLE CHAR REQUIRED!

    //INFO
    discord_invite: "https://discordapp.com/oauth2/authorize?client_id=368465430924230670&scope=bot&permissions=2146958591",

    //ISW
    isw_discord_server_id: "233315669683339264",
    isw_service_warning_enabled: false, //FALSE => NOBODY WILL RECEIVE PM'S ABOUT SERVICES THAT ARE DOWN
    isw_service_managers: [ //USERS TO RECEIVE NOTIFICATIONS ABOUT DOWN SERVICES => SERVERS & SITES
        "233991650790080512", //PIETER
    ],
    isw_service_warn_time_intervals: [ //TIME INTERVALS FOR WARNINGS IN MINUTES, Ex: first 30 minutes, then 2 hours, then 6 hours, then 24 hours
        30,
        120,
        360,
        1440,
    ],
    isw_service_keep_reminding: true, //TRUE => MESSAGES WILL BE SENT USING LAST TIME INTERVAL UNTIL SERVICE IS UP


};