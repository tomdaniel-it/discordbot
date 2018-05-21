var genericfunctions = require('../../GenericFunctions.js');
var settings = require('../../../../settings.js');

var challenges = [];

function challengeBot(command, senderid) {
    var challenge = createChallenge(command, senderid);
    challenges.push(challenge);
    setTimeout(()=>{
        if (challenges.indexOf(challenge) !== -1 && challenge != null) {
            genericfunctions.sendMessage(challenge.command, "Rock Paper Scissors game with <@" + challenge.sender.userid + "> challenge has been canceled due to inactivity.");
            challenges.splice(challenges.indexOf(challenge), 1);
        }
    }, 300000);
}

function challengeUser(command, senderid, receiverid) {
    var challenge = createChallenge(command, senderid, receiverid);
    challenges.push(challenge);
    setTimeout(()=>{
        if (challenges.indexOf(challenge) !== -1 && challenge != null) {
            var user1 = "<@" + challenge.sender.userid + ">";
            var user2 = "<@" + challenge.receiver.userid + ">";
            genericfunctions.sendMessage(challenge.command, "Rock Paper Scissors game challenge between " + user1 + " and " + user2 + " has been canceled due to inactivity.");
            challenges.splice(challenges.indexOf(challenge), 1);
        }
    }, 300000);
}

function createChallenge(command, senderid, receiverid) {
    if (receiverid == undefined || receiverid == null) {
        // CREATE CHALLENGE WITH BOT
        return {
            type: 0, //TYPE BOT CHALLENGE
            command: command,
            sender: {
                choice: null,
                userid: senderid,
                accepted: true
            }
        };
    } else {
        // CREATE CHALLENGE WITH OTHER USER
        return {
            type: 1, //TYPE OTHER PLAYER CHALLENGE
            command: command,
            sender: {
                choice: null,
                userid: senderid,
                accepted: true
            },
            receiver: {
                choice: null,
                userid: receiverid,
                accepted: false
            }
        };
    }
}

function isChallengeComplete(challenge) {
    if (challenge.type === 0) {
        return challenge.sender.choice !== null && challenge.sender.accepted;
    } else {
        return challenge.sender.choice !== null && challenge.receiver.choice !== null && challenge.sender.accepted && challenge.receiver.accepted;
    }
}

function isChallengeAccepted(challenge) {
    if (challenge.type === 0) return challenge.sender.accepted;
    return challenge.sender.accepted && challenge.receiver.accepted;
}

function endChallenge(challenge, delay) {
    if (delay === undefined || delay === null) delay = 0;
    setTimeout(() => {
        var choiceS = challenge.sender.choice;
        var choiceR = null;
        var nameS = "<@" + challenge.sender.userid + ">";
        var nameR = null;
        if (challenge.type === 0) {
            var choices = ["rock", "paper", "scissors"];
            choiceR = choices[Math.floor(Math.random()*3)];
            nameR = settings.bot_name;
        } else {
            choiceR = challenge.receiver.choice;
            nameR = "<@" + challenge.receiver.userid + ">";
        }
        if (choiceS === choiceR) {
            // DRAW
            genericfunctions.sendMessage(challenge.command, nameS + " and " + nameR + " both played " + choiceS + ", it's a DRAW!");
            challenges.splice(challenges.indexOf(challenge), 1);
            return;
        }
        if ((choiceS === "rock" && choiceR === "scissors") || (choiceS === "paper" && choiceR === "rock") || (choiceS === "scissors" && choiceR === "paper")) {
            // SENDER WINS
            genericfunctions.sendMessage(challenge.command, nameS + " (" + choiceS + ") won against " + nameR + " (" + choiceR + ") in a Rock Paper Scissors game!");
            challenges.splice(challenges.indexOf(challenge), 1);
        } else {
            // RECEIVER WINS
            genericfunctions.sendMessage(challenge.command, nameR + " (" + choiceR + ") won against " + nameS + " (" + choiceS + ") in a Rock Paper Scissors game!");
            challenges.splice(challenges.indexOf(challenge), 1);
        }
    }, delay);
}

function isInChallenge(userid) {
    for (var i = 0; i < challenges.length; ++i) {
        if (challenges[i].type === 0) {
            if (challenges[i].sender.userid === userid) return true;
        } else {
            if (challenges[i].receiver.userid === userid || challenges[i].sender.userid === userid) return true;
        }
    }
    return false;
}

module.exports = {
    execute: function(command) {
        var params = command.getParameters().trim();
        var guild = command.getMessage().guild;

        if (guild === undefined || guild === null) {
            genericfunctions.sendErrorMessage(command, "This command is only available in a discord server.");
            return;
        }

        if (params.length === 0) {
            //CHALLENGE BOT
            if (isInChallenge(command.getMessage().author.id)) {
                genericfunctions.sendErrorMessage(command, "You are already in a challenge.");
                return;
            }
            challengeBot(command, command.getMessage().author.id);
            genericfunctions.sendMessage(command, "<@" + command.getMessage().author.id + "> challenged " + settings.bot_name + " to a Rock Paper Scissors game. Contestants, check your DM's!");
            genericfunctions.sendPM(command, command.getMessage().author.id, "You are in a Rock Paper Scissors game with " + settings.bot_name + ". Type .challenge_select <choice> to pick between rock, paper or scissors. E.g.: '.challenge_select rock'.", true);
        } else {
            var useridRegex = /^<@[^0-9]{0,2}([0-9]+)>$/;
            if(!(useridRegex.test(params))) {
                params = params.toLowerCase();
                if (params === "accept") {
                    var challengeFound = false;
                    for (var i = 0; i < challenges.length; ++i) {
                        if (challenges[i].receiver.userid === command.getMessage().author.id) {
                            challengeFound = true;
                            challenges[i].receiver.accepted = true;
                            genericfunctions.sendPM(command, challenges[i].receiver.userid, "You are in a Rock Paper Scissors game with <@" + challenges[i].sender.userid + ">. Type .challenge_select <choice> to pick between rock, paper or scissors. E.g.: '.challenge_select rock'.", true);
                            genericfunctions.sendPM(command, challenges[i].sender.userid, "You are in a Rock Paper Scissors game with <@" + challenges[i].receiver.userid + ">. Type .challenge_select <choice> to pick between rock, paper or scissors. E.g.: '.challenge_select rock'.", false);
                            break;
                        }
                    }
                    if (!challengeFound) {
                        genericfunctions.sendErrorMessage(command, "You do not have a challenge request to accept.");
                    }
                    return;
                }
                if (params === "deny") {
                    var challengeFound = false;
                    for (var i = 0; i < challenges.length; ++i) {
                        if (challenges[i].receiver.userid === command.getMessage().author.id) {
                            challenges.splice(i, 1);
                            challengeFound = true;
                            genericfunctions.sendErrorMessage(command, "Challenge has been denied.");
                            break;
                        }
                    }
                    if (!challengeFound) {
                        genericfunctions.sendErrorMessage(command, "You do not have any open challenge requests.");
                    }
                    return;
                }
                if (params === "cancel") {
                    var challengeFound = false;
                    for (var i = 0; i < challenges.length; ++i) {
                        if (challenges[i].sender.userid === command.getMessage().author.id) {
                            challenges.splice(i, 1);
                            challengeFound = true;
                            genericfunctions.sendErrorMessage(command, "Your challenge has been canceled.");
                            break;
                        }
                    }
                    if (!challengeFound) {
                        genericfunctions.sendErrorMessage(command, "You do not have a challenge to cancel.");
                    }
                    return;
                }
                genericfunctions.sendErrorMessage(command, "Challenge a @User or give an action (accept, deny or cancel).");
                return;
            }
            // CHALLENGE @User
            if (isInChallenge(command.getMessage().author.id)) {
                genericfunctions.sendErrorMessage(command, "You are already in a challenge.");
                return;
            }
            var receiverid = useridRegex.exec(params)[1];
            challengeUser(command, command.getMessage().author.id, receiverid);
            genericfunctions.sendMessage(command, "<@" + command.getMessage().author.id + "> challenged " + params + " to a Rock Paper Scissors Game. " + params + ", type '.challenge accept' or '.challenge deny'.");
            genericfunctions.deleteMessage(command.getMessage());
        }
        return;
    },
    registerChoice: function(command, choice) {
        choice = choice.toLowerCase().trim();
        var authorid = command.getMessage().author.id;
        if (choice !== "rock" && choice !== "paper" && choice !== "scissors") {
            genericfunctions.sendErrorMessage(command, "Pick your choice between rock, paper or scissors.");
            return;
        }
        var foundChallenge = false;
        for (var i = 0; i < challenges.length; ++i) {
            var challenge = challenges[i];
            if (challenge.type === 0) {
                // BOT CHALLENGE
                if (challenge.sender.userid !== authorid) continue;
                foundChallenge = true;
                challenge.sender.choice = choice;
                genericfunctions.sendPM(command, authorid, "Your choice has been registered. Check back in the server channel to see the winner in 5 seconds...", false);
                endChallenge(challenge, 5000);
            } else {
                // USER CHALLENGE
                if (challenge.sender.userid !== authorid && challenge.receiver.userid !== authorid) continue;
                foundChallenge = true;
                var otherPlayerId = null;
                if (challenge.sender.userid === authorid) {
                    challenge.sender.choice = choice;
                    otherPlayerId = challenge.receiver.userid;
                } else {
                    challenge.receiver.choice = choice;
                    otherPlayerId = challenge.sender.userid;
                }
                if (isChallengeAccepted(challenge)) {
                    if (isChallengeComplete(challenge)) {
                        genericfunctions.sendPM(challenge.command, authorid, "Your choice has been registered. Check back in the server channel to see the winner in 5 seconds...", false);
                        genericfunctions.sendPM(challenge.command, otherPlayerId, "Your opponent has picked his selection. Check back in the server channel to see the winner in 5 seconds...", false);
                        endChallenge(challenge, 5000);
                    } else {
                        genericfunctions.sendPM(command, authorid, "Your choice has been registered. Waiting for opponent to select his/her choice...", false);
                    }
                } else {
                    genericfunctions.sendErrorMessage(command, "Your opponent has not accepted your game request yet.");
                    return;
                }
            }
        }
        if (!foundChallenge) {
            genericfunctions.sendErrorMessage(command, "You are not in a challenge. Challenge someone to a game (.help challenge).");
            return;
        }
    },
};