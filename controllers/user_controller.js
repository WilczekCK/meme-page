const _ = require('underscore');
const mysql = require('./mysql_controller');

var user_controller = user_controller || {}
user_controller = {
    creation: async (inGame) => {
        const [results] = await mysql.query(`SELECT * FROM users WHERE ingame_id = ${inGame.id}`);
        if(!results) return await user_controller.newPlayer(inGame);
        return console.log('oldPlayer');
    },
    newPlayer: async (inGame) => {
        await mysql.insert("users", "ingame_id, username, registered, role", " "+inGame.id+", '"+inGame.username+"','2019-02-01', 0");
    }
}



module.exports = user_controller || 'There is a problem with an user controller file';