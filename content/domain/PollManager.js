var polls = {}; //{serverid: [ {name: String, author: String, last_message: Message, options: [ {name: String, votes: [ userid: String ] } ] } ] }
/* 
 * {
 *  serverid: [ 
 *      {
 *          name: String, //Name of poll
 *          author: String, //Name of user author
 *          last_message: Message //The last message sent to chat by the bot about the poll, should be deleted before sending a new one => against spam
 *          options: [ //Options of poll
 *              {
 *                  name: String, //Name of option
 *                  votes: [ userid: String ] //Userids which voted for this option
 *              } 
 *          ] 
 *      } 
 *  ] 
 * }
*/ 

var polltemplate = {name: "", author: "", last_message: null, options: []};

function createPollObject(name, author, options){ //name: String, author: String, options: [name: String]
    if(name===null || name.trim().length === 0){
        throw new Error("No name specified for the poll.");
        return;
    }
    name = name.trim();
    if(name.split(" ").length > 1){
        throw new Error("Make sure the name is only one word. That makes voting easier.");
        return;
    }
    if(options === undefined || options === null) options = [];
    for(var i=0;i<options.length;i++){
        for(var j=0;j<options.length;j++){
            if(i===j) continue;
            if(options[i].toLowerCase().trim() === options[j].toLowerCase().trim()){
                throw new Error("There can't be multiple options with the same name.");
                return;
            }
        }
    }
    var newpoll = JSON.parse(JSON.stringify(polltemplate));
    newpoll.name = name;
    newpoll.author = author;
    for(var i=0;i<options.length;i++){
        if(options[i].trim() === "") continue;
        newpoll.options.push(  {name: options[i], votes: []}  );
    }
    return newpoll;
}

function addPoll(serverid, pollobj){
    if(polls[serverid]===undefined || polls[serverid]===null){
        polls[serverid] = [];
    }
    if(getPoll(serverid, pollobj.name) !== null){
        throw new Error("There already exists a poll with that name. Try closing that poll first.");
        return;
    }
    polls[serverid].push(pollobj);
}

function getPoll(serverid, name){
    if(name === undefined || name === null){
        throw new Error("A valid name is required.");
        return;
    }
    if(polls[serverid]===undefined || polls[serverid]===null) return null;
    for(var i=0;i<polls[serverid].length;i++){
        if(polls[serverid][i].name.toLowerCase().trim() === name.toLowerCase().trim()){
            return polls[serverid][i];
        }
    }
    return null;
}

function getServer(serverid){
    if(polls[serverid] === undefined) return null;
    return polls[serverid];
}

module.exports = {
    create: function(serverid, name, author, options){ //name: String, options: [option: String]
        serverid = serverid.toString();

        var pollobj = createPollObject(name, author, options);
        addPoll(serverid, pollobj);
        return;
    },
    get: function(serverid, name){
        serverid = serverid.toString();
        return getPoll(serverid, name); //{serverid: [ {name: String, options: [ {name: String, votes: [ userid: String ] } ] } ] }
    },
    remove: function(serverid, name){
        serverid = serverid.toString();
        var server = getServer(serverid);
        if(server === null){
            throw new Error("There is no poll with that name.");
            return;
        }
        if(name === undefined || name === null){
            throw new Error("Enter a valid name from a poll.");
            return;
        }
        for(var i=0;i<server.length;i++){
            if(server[i].name.toLowerCase().trim() === name.toLowerCase().trim()){
                return server.splice(i, 1)[0]; //{name: String, options: [ {name: String, votes: [ userid: String ] } ] } => REMOVED POLL
            }
        }

        throw new Error("There is no poll with that name.");
    },
    vote: function(serverid, name, optionid, userid){ //optionid = index in option array (starting from 0!)
        serverid = serverid.toString();
        userid = userid.toString();
        optionid = Number(optionid);
        if(isNaN(optionid)){
            throw new Error("Choose an option with a number.");
            return;
        }
        var poll = getPoll(serverid, name);
        if(poll===null){
            throw new Error("There is no poll with that name.");
            return;
        }
        if(poll.options === undefined || poll.options === null || poll.options[optionid] === undefined || poll.options[optionid] === null){
            throw new Error("There is no option with that number.");
            return;
        }
        if(poll.options[optionid].votes.indexOf(userid) !== -1){
            throw new Error("You have already voted for this option.");
            return;
        }
        poll.options[optionid].votes.push(userid);
        return;
    },
    unvote: function(serverid, name, optionid, userid){ //optionid = index in option array (starting from 0!)
        serverid = serverid.toString();
        userid = userid.toString();
        optionid = Number(optionid);
        if(isNaN(optionid)){
            throw new Error("Choose an option with a valid number.");
            return;
        }
        var poll = getPoll(serverid, name);
        if(poll===null){
            throw new Error("There is no poll with that name.");
            return;
        }
        if(poll.options === undefined ||poll.options === null || poll.options[optionid] === undefined || poll.options[optionid] === null){
            throw new Error("There is no option with that number.");
            return;
        }
        if(poll.options[optionid].votes.indexOf(userid) === -1){
            throw new Error("You didn't vote for that option.");
            return;
        }
        poll.options[optionid].votes.splice(poll.options[optionid].votes.indexOf(userid), 1);
        return;
    },
    addOption: function(serverid, name, option){
        serverid = serverid.toString();
        var poll = getPoll(serverid, name);
        if(poll === null){
            throw new Error("There is no poll with that name.");
            return;
        }
        if(option === undefined || option === null){
            throw new Error("The option can not be empty.");
            return;
        }
        if(poll.options === undefined || poll.options === null) poll.options = [];
        for(var i=0;i<poll.options.length;i++){
            if(poll.options[i].name.toLowerCase().trim() === option.toLowerCase().trim()){
                throw new Error("There already exists an option with this name.");
                return;
            }
        }
        poll.options.push({name: option, votes: []});
        return;
    },
    removeOption: function(serverid, name, optionid){
        serverid = serverid.toString();
        optionid = Number(optionid);
        if(isNaN(optionid)){
            throw new Error("Choose an option with a valid number.");
            return;
        }

        var poll = getPoll(serverid, name);        
        if(poll === null){
            throw new Error("There is no poll with that name.");
            return;
        }
        if(poll.options === undefined || poll.options === null || poll.options.length <= optionid || optionid < 0){
            throw new Error("There is no option with that number.");
            return;
        }

        poll.options.splice(optionid, 1);
        return;
    },
    getList: function(serverid){
        if(polls[serverid] === undefined || polls[serverid] === null) return [];
        return polls[serverid];
    },
    getLastMessage: function(serverid, name){
        var poll = getPoll(serverid, name);
        return poll.last_message;
    },
    setLastMessage: function(serverid, name, message){
        var poll = getPoll(serverid, name);
        poll.last_message = message;
        return;
    }
};