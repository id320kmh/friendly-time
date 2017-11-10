const render = require('../lib/render');

function home(req, res, events) {

    render('index.html', null, (error, html) => {

        const eventsData = JSON.stringify(events);

        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain'});
            return res.end(error.message);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.write('<script>let events = '+ eventsData + '</script>');

        // res.write(html.replace('{{code}}', eventsData))
        res.end(html);



    });


}

module.exports = home;