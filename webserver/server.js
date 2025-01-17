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
    let eventsArr = [];

    parseIcalFile(filePath)
      .then((events) => {
        eventsArr = events;
        console.log(eventsArr);
      })
      .catch((error) => {
        console.error(error);
      });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('/test');
  }else{
    // INDEX
    fs.readFile('index.html', function(err, data){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error 500, loading file failed')
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