const { createServer } = require('node:http');
const fs = require('fs');
const { get } = require('https');
//const IcalEvent = require("./IcalEvent.js");
const parseIcalFile = require("./icalParser.js").default;
//const querystring = require('node:querystring');
const url = require('node:url');
const { createHtmlFile } = require('./htmlFileCreator.js');
const { DatabaseSync } = require('node:sqlite');


const protocol = 'http://';
const hostname = 'localhost';
const port = 3000;

const database = new DatabaseSync("./cache.db");




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

async function createNewSchemaHtml(searchQuary){
  const kronoxDownloadUrl = "https://schema.oru.se/setup/jsp/SchemaICAL.ics";

  const fullDownloadUrl = `${kronoxDownloadUrl}${searchQuary}`;

  let schema;
  try{
    schema = await downloadSchema(fullDownloadUrl);
  }catch(error){
    console.error("dlSchema failed: "+error);
    throw error;
  }

  const parsedSchema = parseIcalFile(schema);

  const createdHTML = createHtmlFile(parsedSchema);

  return createdHTML;
}

function checkIfCacheOutOfDate(cachedDate){
  const currentDate = Date.now();

  if(currentDate > cachedDate){
    return true;
  }else{
    return false;
  }
}

/*
function parseFileName(resurser){
  return resurser.replace(/[, ]/g, "_");
}
*/

function parseResources(resources){
  const parsedResources = resources.replace(/[åäö., ]/ig, (match) => {
    const replacements = {
      'å': 'a',
      'ä': 'a',
      'ö': 'o',
      '.': '_',
      ',': '_',
      " ": '_'
    };
    return replacements[match] || match;
  });

  return parsedResources;
}

// FIXA
/*
async function checkDbForResource(resource){
  const fetchedResource = select.get(resource);
}
*/

async function downloadSchema(url){
  console.log("downloadSchema called!");
  const response = await fetch(url);
  
  if(!response.ok){
    throw new Error(`502: Error fetching schema: ${response.status}`);
  }

  const responseText = await response.text();

  // KronoX responds with an empty file if the query is incorrect
  if(responseText === ""){
    throw new Error("502: Kronox response is empty");
  }

  return responseText;
}

function cacheHtml(queryResource, html){
  const currentDate = Date.now();
  const fourHoursInMs = 21600000;
  const expirationDate = currentDate+fourHoursInMs;

  const insert = database.prepare("INSERT INTO cache (resource, expiration, html) VALUES (?, ?, ?)");
  const insertedItem = insert.run(queryResource, expirationDate, html);

  console.log(insertedItem);
}

const server = createServer(async (req, res) => {
  const clientReqUrl = new URL(`${protocol}${hostname}${req.url}`);
  const kronoxSchemaURL = "https://schema.oru.se/setup/jsp/Schema.jsp?";

  if(clientReqUrl.searchParams.has("link") && clientReqUrl.searchParams.get("link").startsWith(kronoxSchemaURL)){
    // SCHEMA QUERY

    // Create URL from query
    let kronoxReqUrl;
    try{
      kronoxReqUrl = new URL(clientReqUrl.searchParams.get("link"));
    }catch(error){
      console.error("Invalid URL: "+error);

      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400: Bad Request");
      
      return;
    }

    console.log("1: "+kronoxReqUrl);
    console.log("2: "+kronoxReqUrl.search);

    // FULT
    // Get resources from query
    let queryResource = "";
    queryResource = kronoxReqUrl.searchParams.get("resurser");
    if(queryResource === null){
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400: Bad Request");
      
      return;
    }
    queryResource = parseResources(queryResource);

    // Check if resource is cached
    const select = database.prepare("SELECT * FROM cache WHERE resource = ?");
    const getCache = select.get(queryResource);

    if(getCache === undefined){
      // If NOT cached
      let html;
      try{
        html = await createNewSchemaHtml(kronoxReqUrl.search);
      }catch(error){
        res.statusCode = 502;
        res.setHeader("Content-Type", "text/plain");
        res.end(error.message);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(html);

      cacheHtml(queryResource, html);
    }else{
      // If cached
      currentDate = Date(Date.now());
      console.log("CT: "+currentDate);

      if(checkIfCacheOutOfDate(getCache.expiration)){
        // Lägg in samma logik som om inte cached. Gör om till funktion.
        let html;
        try{
          html = await createNewSchemaHtml(kronoxReqUrl.search);
        }catch(error){
          res.statusCode = 502;
          res.setHeader("Content-Type", "text/plain");
          res.end(error.message);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);

        cacheHtml(queryResource, html);
      }

      expdatum = new Date(getCache.expiration)
      console.log("gc: "+expdatum);
      const cachedHtml = getCache.html;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(cachedHtml);
    }
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
  }else if(req.url === '/'){
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
  }else{
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404: Not Found')
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});