const { createServer } = require('node:http');
const fs = require('fs');
const { get } = require('https');
//const IcalEvent = require("./IcalEvent.js");
const parseIcalFile = require("./icalParser.js").default;
//const querystring = require('node:querystring');
const url = require('node:url');
const { pipeline } = require('node:stream/promises');
const { createHtmlFile } = require('./htmlFileCreator.js');



const hostname = 'localhost';
const port = 3000;

//const fileUrl = 'https://schema.oru.se/setup/jsp/SchemaICAL.ics?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.H%C3%B6gskoleingenj%C3%B6r+-+Datateknik+%C3%A5k+2-';
//const filePath = './schema.html';
const kronoxDownloadUrl = "https://schema.oru.se/setup/jsp/SchemaICAL.ics";


/*function indexHandle(){
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

const routes = {
  'GET /' : indexHandle,
  'GET /schema' : schemaHandle,
  'GET /download' : downloadHandle,
  'GET /test' : testHandle,
  'GET /schema' : schemaHandle,
  'GET /schema.js' : schemajsHandle,
  'GET /outputs.css' : outputcssHandle,
  'GET /test.json' : testjsonHandle,
};
*/

function parseFileName(resurser){
  return resurser.replace(/[, ]/g, "_");
}

function downloadSchema(url){
  return fetch(url)
    .then((response) => {

      if(!response.ok){
        throw new Error(`Error fetching schema: ${response.status}`);
      }

      return response.text();
    });
}

const server = createServer((req, res) => {
  const clientReqUrl = new URL(`http://${hostname}${req.url}`);

  console.log(clientReqUrl.searchParams.has("link"));
  console.log(clientReqUrl);

  if(clientReqUrl.searchParams.has("link") && clientReqUrl.searchParams.get("link").startsWith("https://schema.oru.se/setup/jsp/Schema.jsp?")){
    // SCHEMA INPUT

    
    const kronoxReqUrl = new URL(clientReqUrl.searchParams.get("link"));
    console.log(kronoxReqUrl);
    console.log("URL: "+kronoxDownloadUrl+kronoxReqUrl.search);

    //let downloadedIcal = await downloadSchema(kronoxDownloadUrl+kronoxReqUrl.search);

    downloadSchema(kronoxDownloadUrl+kronoxReqUrl.search)
      .then((downloadedSchema) => {
        const parsedSchema = parseIcalFile(downloadedSchema);
        
        createHtmlFile(parsedSchema, './test123.html');

        fs.readFile('test123.html', function(err, data){
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
        
        //const schemaJson = JSON.stringify(parsedSchema)

        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        //res.end(schemaJson);
      })
      .catch((error) => {
        console.error(`Error downloading schema: ${error}`);

        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("500: Internal Server Error");
      });

    /*
    let fileName = "N/A";
    fileName = parseFileName(kronoxReqUrl.searchParams.get("resurser"));
    console.log(fileName);

    const fileEnding = '.ical'
    const filePath = `./scheman/${fileName}${fileEnding}`;

    console.log(filePath);
    */



    /*
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
    */

    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/plain');
    //res.end('YES BABY!'); 
  }else if(req.url === '/download'){
    // DOWNLOAD
    
  }
  /*
  else if(req.url === '/test'){
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

    
  }
  */    
  else if(req.url === '/schema'){
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