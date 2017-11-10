const http = require('http');
const { public, home, notFound, pratsya } = require('./routes');
const eventsServices = require('./lib/events.services');


const server = http.createServer((req, res) => {

    if (req.url.match(/\.(html|css|js|json|png|jpg)$/)) {
        public(req, res);
    } else if (req.url === '/') {
        home(req, res, eventsServices(req, res).getEventsNum());
    } else if (req.url === '/pratsya') {
        pratsya(req, res);
    } else {
        notFound(req, res);
    }

});

server.listen( 3000, () => console.log('Server Run'));

server.on('request', function(req, res) {

    if (req.url === '/createEvent') {
        eventsServices(req, res).addNewEvent();
        //home(req, res, eventsServices(req, res).getEventsNum());
    }

    if (req.url === '/clearAllEvents') {
        eventsServices(req, res).clearAllEvents();
    }

    if (req.url === '/clearOneEvent') {
        eventsServices(req, res).clearOneEvent();
    }

    if (req.url === '/addNewMember') {
        eventsServices(req, res).addNewMember();
    }

});
