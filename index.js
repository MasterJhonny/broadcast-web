const http = require('./src/app');
const { appConfig } = require('./src/config');
const port = appConfig.port || 8080;

http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})