import {WebsocketServer} from './websocketserver';
const port = Number(process.argv[2]);
const websocketserver = new WebsocketServer(port);
console.log(`listening on ${port}`);
