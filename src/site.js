/*jslint node: true */
'use strict';

var http = require('http'),
    fs = require('fs'),
    escapeHTML = require('escape-html');

var config = require('./config.json'),
    facts = require('./facts.json');

var styleFile;

var header = '';
header += '<!doctype html>';
header += '<title>Crockford Facts</title>';
header += '<link rel=stylesheet href=style.css>';
header += '<h1><a href="http://www.crockford.com/">Crockford</a> Facts</h1>';
header += '<a href=/>list</a>';
header += ' - ';
header += '<a href=/.json>list json</a>';
header += ' - ';
header += '<a href=/random>random</a>';
header += ' - ';
header += '<a href=/random.json>random json</a>';
header += ' - ';
header += '<a href="mailto:ajf@ajf.me?subject=Crockford%20Fact%20Submission">submit</a>';

var footer = '';
footer += '<footer>';
footer += '<a href="http://www.JSLint.com"><img src="http://jslint.com/jslintpill.gif" alt=JSLint></a>';
footer += '<a href="https://github.com/TazeTSchnitzel/crockfordfacts.org"><img src="http://jslint.com/github.gif" alt=GitHub></a>';
footer += '<a href="http://www.JSON.org/"><img src="http://jslint.com/jsonpill.gif" alt=JSON></a>';
footer += '</footer>';

function error(response, code, message) {
    response.writeHead(code, {'Content-Type': 'text/html;charset=utf-8'});
    response.end('<!doctype html><title>' + code + ' ' + message + '</title>' + '<h1>' + code + message + '</h1>');
}

function startServer() {
    http.createServer(function (request, response) {
        var body, fact;

        if (request.method !== 'GET') {
            return error(response, 405, 'Method Not Allowed');
        }

        switch (request.url) {
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'});
            response.end(styleFile);
            break;
        case '/random':
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

            fact = facts[Math.floor(Math.random() * facts.length)];

            body = header;
            body += '<h2>Random fact</h2>';
            body += '<p>' + escapeHTML(fact) + '</p>';
            body += footer;

            response.end(body);
            break;

        case '/random.json':
            fact = facts[Math.floor(Math.random() * facts.length)];

            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(fact));
            break;

        case '/':
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

            body = header;
            body += '<h2>List</h2>';
            body += '<ul>';
            facts.forEach(function (fact) {
                body += '<li>' + escapeHTML(fact) + '</li>';
            });
            body += '</ul>';
            body += footer;

            response.end(body);
            break;

        case '/.json':
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(facts));
            break;

        default:
            return error(response, 404, 'File Not Found');
        }
    }).listen(config.port, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:' + config.port + '/');
}

fs.readFile('style.css', function (error, content) {
    if (error) {
        console.log('Couldn\'t read style.css: ' + error);
        return;
    }

    styleFile = content;

    startServer();
});

