const mysql = require('../controllers/mysql_controller');
const _ = require('underscore')
const fs = require('fs')

var meme_controller = meme_controller || {}
meme_controller = {
    displayMemes: async _ => {
        const memesRecord = await mysql.query(`SELECT id, author_username, tags, likes, status, added_in  FROM images WHERE status = 1 ORDER BY 'added_in' DESC`);
        return memesRecord;
    },
    displayWaitingMemes: async _ => {
        const memesRecord = await mysql.query(`SELECT id, author_username, tags, likes, status, added_in  FROM images WHERE status = 0 ORDER BY 'added_in' DESC`);
        return memesRecord;
    },
    insertToDB: async (author_id, author_username, date, tags) => {
        const replacedTags = tags.replace(/,/g, " ");
        const uploadedSqlID = await mysql.insert(`images`, `author_id, author_username, added_in, tags`, `${author_id}, '${author_username}' ,'${date}', '${replacedTags}'`);
        return uploadedSqlID;
    },
    changeImageName: async (oldName, newName) => {
        fs.rename(`./public/uploads/${oldName}`, `./public/uploads/${newName}.jpg`, (err) => {
            if (err) throw err;
        });
    },
    moderate: async (meme_id, decision) => {
        if(decision != 'Submit'){
            fs.unlinkSync(`./public/uploads/${meme_id}.jpg`);
            mysql.delete(`images`, `id = ${meme_id}`);
        }else{
            mysql.update(`images`, `status = 1`, `id = ${meme_id}`);
        }
    },
    like: async (meme_id, who_liked) => {
        let responseFromDB = await mysql.query(`SELECT id FROM likes WHERE ingame_id = ${who_liked} AND meme_id = ${meme_id}`);
        if(!_.isEmpty(responseFromDB) || _.isEmpty(who_liked)) return false;

        mysql.insert(`likes`, `meme_id, ingame_id`, `${meme_id}, ${who_liked}`);
        mysql.update(`images`, `likes = likes + 1`, `id = ${meme_id}`);
    }
}


module.exports = meme_controller || 'There is a problem with a meme controller file';