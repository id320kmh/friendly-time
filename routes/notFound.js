const render = require('../lib/render');


function notFound(req, res) {
    /*res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('views', 'error.html'));

    stream.pipe(res);*/

    render('error.html', { error: 'Not Found' }, (error, html) => {

        if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain'});
            return res.end(error.message);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);

    });
}

module.exports = notFound;