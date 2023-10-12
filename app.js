const express = require("express");
const path = require("path");
const {createReadStream} = require('fs')
const cookieParser = require('cookie-parser');

const HOST = 'localhost';
const PORT = 8080;
const PUBLIC_FOLDER = path.join(__dirname, "public")

const { Client } = require('pg');
const { Hash } = require("crypto");

const connectionData = {
    user: 'postgres',
    host: 'localhost',
    database: 'telegrambot_tkt',
    password: '123',
    port: 5432,
}
const client = new Client(connectionData)

const app = express();
app.use(cookieParser('Kuro1230./*****.$'))
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "img")));

app.get('/', (req, res) => {
    ref = req.query.ref;
    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }
    if(ref != "" && ref != null && ref != undefined){
        res.cookie('ref', ref, options)
    }
    
	const HTML_CONTENT_TYPE = 'text/html'
    stream = createReadStream(`${PUBLIC_FOLDER}/index.html`)
    //res.status(200).send({ response: 'Username not register' });
	
	res.writeHead(200, {'Content-Type': HTML_CONTENT_TYPE})
    // si tenemos un stream, lo enviamos a la respuesta
    if (stream) stream.pipe(res)
	else return res.end('Not found')

    //return res.status(403).send({ response: 'Your client does not have permission to get URL / from this server. That’s all we know.' })
})
app.get('/ref', (req, res) => {
    ref = req.query.ref;
    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }
    if(ref != "" && ref != null && ref != undefined){
        res.cookie('ref', ref, options)
    }
    
	const HTML_CONTENT_TYPE = 'text/html'
    stream = createReadStream(`${PUBLIC_FOLDER}/index.html`)
    //res.status(200).send({ response: 'Username not register' });
	
	res.writeHead(200, {'Content-Type': HTML_CONTENT_TYPE})
    // si tenemos un stream, lo enviamos a la respuesta
    if (stream) stream.pipe(res)
	else return res.end('Not found')

    //return res.status(403).send({ response: 'Your client does not have permission to get URL / from this server. That’s all we know.' })
})
app.get('/api/twitter', (req, res) => {
    token = req.query.token;
    username = req.query.username;
    twitter = req.query.twitter;
    hash = req.query.hash;

    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
    }

    // Set cookie
    res.cookie('twitterusername', username, options)
    res.cookie('twitterfollow', "%s" % twitter, options) // options is optional
    res.cookie('twitterhash', hash, options) // options is optional
    res.cookie('twitteralert', "true", options) // options is optional

    //res.redirect('/');
    const HTML_CONTENT_TYPE = 'text/html'
    stream = createReadStream(`${PUBLIC_FOLDER}/index.html`)
    //res.status(200).send({ response: 'Username not register' });
	
	res.writeHead(200, {'Content-Type': HTML_CONTENT_TYPE})
    // si tenemos un stream, lo enviamos a la respuesta
    if (stream) stream.pipe(res)
	else return res.end('Not found')
})
app.get('/api/error', (req, res) => {
    token = req.query.token;
    error = req.query.error;

    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }

    // Set cookie
    res.cookie('twittererror', error, options)
    res.redirect('/');
})


app.listen(PORT, function(){
  	console.log(`Server is running on http://${HOST}:${PORT}`);
});
