const fs = require("fs");
const config = module.exports = {
    data: require("../data/config.json")
};

config.save = function () {
    fs.writeFile("../data/config.json", JSON.stringify(config.data), err => {
        if (err) {
            throw err;
        }
    });
};

config.addUser = function(GUILD_ID, ROLE_ID, USER_ID) {
    config.data[GUILD_ID][ROLE_ID].members.push(USER_ID)
    config.save();
};

/*config.removeUser = function (guild, user) {
    delete guild.users[user.id];
    config.save();
}; Needs to be re-worked */

config.createSession = function(GUILD_ID,USER_ID, ROLE_ID, GAME, CHANNEL_ID, MESSAGE_ID) {
    if (config.data[GUILD_ID] === undefined) {
        config.data[GUILD_ID] = {}
    }
    config.data[GUILD_ID][ROLE_ID] = {
        game: GAME,
        channel: CHANNEL_ID,
        members: [],
        messageid: MESSAGE_ID
    }
    config.save();
};

config.addGame = function (GUILD_ID, GAME, LIMIT) {
    return new Promise((resolve, reject) => {
        try {
            if (config.data[GUILD_ID] === undefined || config.data[GUILD_ID].games === undefined) {
                config.data[GUILD_ID] = {
                    games: []
                }
            } else if (config.data[GUILD_ID].games.hasOwnProperty(GAME)) {
                reject(false)
            }
            config.data[GUILD_ID].games.push([GAME, LIMIT])
            config.save()
            resolve(true)
        } catch (err) {
            console.error(err)
            reject(err)
        }
    });
};

config.removeGame = function (GUILD_ID, GAME) {
    return new Promise((resolve, reject) => {
        try{
            var newGameArray = config.data[GUILD_ID].games.filter(function(val) { // Clone the Games array wothout the selected game
                if (val[0] === GAME) {
                    return false;
                }
                return true;
            });
            config.data[GUILD_ID].games = newGameArray; // Update the existing games array
            config.save();
            resolve(true)
        }catch(err){
            reject(false)
        }
    })
};

config.getGame = function (GUILD_ID, GAME) {
    return new Promise((resolve, reject) => {
        try {
            var gameFound = false; // Was the game found?
            config.data[GUILD_ID].games.filter(function(val) { // Search for the game
                if (val[0] === GAME) {
                    gameFound = true;
                }
            });
            if (config.data[GUILD_ID] === undefined || !gameFound) {
                resolve(false)
            } else {
                resolve(true)
            }
        } catch (err) {
            console.error(err)
            resolve(false)
        }
    })
};

config.getRoleByReaction = function (REACTION, GUILD_ID) { //https://stackoverflow.com/a/9907509
    var obj = config.data[GUILD_ID];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop].messageid === REACTION.message.id)
            return prop;
        }
    }
}

config.findSession = function(GUILD_ID,GAME) {
    return new Promise((resolve,reject) =>{
        if (config.data[GUILD_ID] === undefined) {
            resolve(false)
        } else {
            for(element in config.data[GUILD_ID]){
                if(config.data[GUILD_ID][element].game === GAME){
                    resolve(element)
                }
            }
            resolve(false)
        }
    })
};

config.getChannelID = function(GUILD_ID, SESSION) {
    return new Promise ((resolve,reject) => {
        resolve(config.data[GUILD_ID][SESSION].channel)
    })

};
