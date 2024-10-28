const fs = require("fs");
const http = require("http");
const {Command} = require("commander");
const superagent = require("superagent");
const program = new Command;

program 
    .requiredOption("-H, --host <host>", "host address")
    .requiredOption("-p, --port <PORT>", "Port server")
    .requiredOption("-c, --cache <PATH>", "Path to dir with cached files")
    .parse(process.argv);

const options = program.opts();
const host = options.host;
const port = options.port;
const cache = options.cache;

const server = http.createServer(async (req, res) => {
    const path = `https://http.cat/${req.url}.jpg`;
    const img = `${cache}${req.url}.jpg`;
    try {
        switch (req.method) {
          case "GET":
            try {
              const cachedPicture = await fs.promises.readFile(image);
              res.writeHead(200, { "Content-Type": "image/jpeg" });
              res.end(cachedPicture);
            } catch (err) {
              try {
                const fetchedPicture = await superagent.get(path);
                await fs.promises.writeFile(image, fetchedPicture.body);
                const cachedPicture = await fs.promises.readFile(image);
                res.writeHead(200, { "Content-Type": "image/jpeg" });
                res.end(cachedPicture);
              } catch {
                res.writeHead(404);
                res.end("Not Found");
              }
            }
            break;
          case "PUT":
            console.log(`Processing PUT request for status code: ${req.url}`);
    
            let body = [];
            req.on("data", (chunk) => body.push(chunk));
            req.on("end", async () => {
              body = Buffer.concat(body);
    
              if (!body.length) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("No image in request body");
                return;
              }
    
              console.log(`Saving image to: ${image}`);
    
              try {
                await fs.promises.writeFile(image, body);
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end("Image saved");
              } catch (err) {
                console.log(`Error saving image: ${err}`);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
              }
            });
            break;
    
          /* case "DELETE":
            await fs.promises.rm(image, { force: true });
            res.writeHead(200);
            res.end();
            break;
     */
          default:
            res.writeHead(405);
            res.end();
        }
      } catch (error) {
        res.writeHead(404);
        res.end("Error with processing the request");
      }
    });
    
    server.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}/`);
    });