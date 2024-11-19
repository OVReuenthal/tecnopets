
import { Server } from "./server.js";
import {db} from './DB/db.js'

const server = new Server;

server.listen();

db();
