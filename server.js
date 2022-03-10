const http = require('http')

const server = http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.write('Bot\'s Alive!');
  res.end();
});

module.exports = function (port,host) {
  server.listen(port || 1337,()=>{console.log(`Server\'s Up! ${host}:${port}`)});
}