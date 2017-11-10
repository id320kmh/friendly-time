const querystring = require('querystring');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/events.json');
const db = low(adapter);

function eventsServices(req, res) {

    return {
        addNewEvent() {

            let queryData = "";

            req.on('data', function(data) {
                queryData += data;
                if(queryData.length > 1e6) {
                    queryData = "";
                    res.writeHead(413, {'Content-Type': 'text/plain'}).end();
                    req.connection.destroy();
                }
            });

            req.on('end', function() {
                req.post = querystring.parse(queryData);

                db.defaults({ events: [] })
                    .write();

                db.get('events')
                    .push(req.post)
                    .write();

            });
        },

        addNewMember() {

            let queryData = "";
            req.on('data', function(data) {
                queryData += data;
            });

            req.on('end', function() {
                req.post = querystring.parse(queryData);

                db.get('events')
                    .find({ idEvent: req.post.eventId })
                    .assign({ members: req.post.newMembers })
                    .write()
            });
        },

        clearAllEvents() {
            db.set('events', []).write();
        },

        clearOneEvent() {

            let events = db.get('events').value();
            let length = events.length;
            let delId = events[length-1].idEvent;

            db.get('events')
                .remove({ idEvent: delId })
                .write();
        },

        getEventsNum() {
            return db.get('events').value();
        }
    }

}

module.exports = eventsServices;