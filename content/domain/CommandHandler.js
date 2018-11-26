var genericfunctions = require('../domain/GenericFunctions.js');

module.exports = class CommandHandler{
    constructor(command){
        this.command = command;
    }

    run(){
        var category = genericfunctions.getCategoryOfCommand(this.command.getCommand());
        var command_dir = "../domain/commands/" + category.trim().toLowerCase() + "/";
        switch(this.command.getCommand()){
            case "ping":
                require(command_dir + 'Ping.js').execute(this.command);
                break;
            case "help":
                require(command_dir + 'Help.js').execute(this.command);
                break;
            case "insult":
                require(command_dir + 'Insult.js').execute(this.command);
                break;
            case "meme":
                require(command_dir + 'Meme.js').execute(this.command);
                break;
            case "fancy":
                require(command_dir + 'Fancy.js').execute(this.command);
                break;
            case "purge":
                require(command_dir + 'Purge.js').execute(this.command);
                break;
            case "say":
                require(command_dir + 'Say.js').execute(this.command);
                break;
            case "coinflip":
                require(command_dir + 'Coinflip.js').execute(this.command);
                break;
            case "music_play":
                require(command_dir + 'Music_Play.js').execute(this.command);
                break;
            case "music_stop":
                require(command_dir + 'Music_Stop.js').execute(this.command);
                break;
            case "music_add":
                require(command_dir + 'Music_Add.js').execute(this.command);
                break;
            case "music_pick":
                require(command_dir + 'Music_Pick.js').execute(this.command);
                break;
            case "music_skip":
                require(command_dir + 'Music_Skip.js').execute(this.command);
                break;
            case "music_purge":
                require(command_dir + 'Music_Purge.js').execute(this.command);
                break;
            case "music_list":
                require(command_dir + 'Music_List.js').execute(this.command);
                break;
            case "admin_add":
                require(command_dir + 'Admin_Add.js').execute(this.command);
                break;
            case "admin_remove":
                require(command_dir + 'Admin_Remove.js').execute(this.command);
                break;
            case "admin_list":
                require(command_dir + 'Admin_List.js').execute(this.command);
                break;
            case "admin_commands":
                require(command_dir + 'Admin_Commands.js').execute(this.command);
                break;
            case "poll_create":
                require(command_dir + 'Poll_Create.js').execute(this.command);
                break;
            case "poll_close":
                require(command_dir + 'Poll_Close.js').execute(this.command);
                break;
            case "poll_list":
                require(command_dir + 'Poll_List.js').execute(this.command);
                break;
            case "poll_remind":
                require(command_dir + 'Poll_Remind.js').execute(this.command);
                break;
            case "poll_vote":
                require(command_dir + 'Poll_Vote.js').execute(this.command);
                break;
            case "poll_unvote":
                require(command_dir + 'Poll_Unvote.js').execute(this.command);
                break;
            case "poll_add_option":
                require(command_dir + 'Poll_Add_Option.js').execute(this.command);
                break;
            case "poll_remove_option":
                require(command_dir + 'Poll_Remove_Option.js').execute(this.command);
                break;
            case "remind":
                require(command_dir + 'Remind.js').execute(this.command);
                break;
            case "sb_play":
                require(command_dir + 'Sb_Play.js').execute(this.command);
                break;
            case "sb_list":
                require(command_dir + 'Sb_List.js').execute(this.command);
                break;
            case "no":
                require(command_dir + 'No.js').execute(this.command);
                break;
            case "yes":
                require(command_dir + 'Yes.js').execute(this.command);
                break;
            case "triggered":
                require(command_dir + 'Triggered.js').execute(this.command);
                break;
            case "wifi":
                require(command_dir + 'Wifi.js').execute(this.command);
                break;
            case "challenge":
                require(command_dir + 'Challenge.js').execute(this.command);
                break;
            case "challenge_select":
                require(command_dir + 'Challenge_Select.js').execute(this.command);
                break;
            default:
                return;
        }
    }
};