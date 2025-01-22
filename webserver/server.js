const { createServer } = require('node:http');
const fs = require('fs');
const { get } = require('https');
//const IcalEvent = require("./IcalEvent.js");
const parseIcalFile = require("./icalParser.js").default;

const hostname = 'localhost';
const port = 3000;

const fileUrl = 'https://schema.oru.se/setup/jsp/SchemaICAL.ics?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.H%C3%B6gskoleingenj%C3%B6r+-+Datateknik+%C3%A5k+2-';
const filePath = './schema.ical';

const server = createServer((req, res) => {
  if(req.url === '/download'){
    // DOWNLOAD
    get(fileUrl, (resp) => {
      if(resp.statusCode === 200){
        const fileStream = fs.createWriteStream(filePath);
        resp.pipe(fileStream);
  
        fileStream.on('finish', () => {
          fileStream.close();
          console.log('File downloaded successfully');
        });
      }else{
        console.error('Failed to download file. Status code: ${resp.statusCode}');
      }
    }).on('error', (err) =>{
      console.error('ERROR: ${err.message}');
    });
  }else if(req.url === '/test'){
    // TEST
    parseIcalFile(filePath)
      .then((events) => {
        // SKapar en fil 'test.json' med innehållet i events
        fs.writeFile('./test.json', JSON.stringify(events), err => {
          if(err){
            console.error(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('500: Failed to write to file')
          }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('200: File created');
          }
        });
      })
      .catch((error) => {
        console.error(error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error 500, failed to parse icalfile')
      });

    
  }else if(req.url === '/schema'){
    fs.readFile('schema.html', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error 500, loading schema.html failed')
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  }else if(req.url === '/schema.js'){
    fs.readFile('schema.js', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500: error loading /js/schema.js')
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data);
      }
    });
  }else if(req.url === '/output.css'){
    fs.readFile('output.css', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500: error loading /js/schema.js')
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data);
      }
    });
  }else if(req.url === '/test.json'){
    console.log("test.json called");
    fs.readFile('test.json', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error 500, loading schema.html failed')
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  }else{
    // INDEX
    fs.readFile('index.html', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error 500, loading index.html failed')
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});