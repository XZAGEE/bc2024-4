const fs = require("fs");
const http = require("http");
const {Command} = require("commander");
const program = new Command;

program 
    .requiredOption("-H, --host <host>", "host address")
    .requiredOption("-p, --port <PORT>", "Port server")
    .requiredOption("-c, --cache <PATH>", "Path to dir with cached files")
program.parse();

const options = program.opts();
const host = options.host;
const port = options.port;
const cache = options.cache;


if(!options.port){
    console.error("error");
};
/* if(process.argv.length <= 2){
    console.error("Error!");
    process.exit(1);
}; */
const requestListener = function(req, res){
    res.writeHead(500);
    res.end("Hello123");
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

/* http.Server.listen(options.host, options.port, options.cache)

fs.promise.readFile()
fs.promise.writeFile() */