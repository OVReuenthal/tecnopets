import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { routerUser } from "./routers/routerUser.js";
import { productRouter } from "./routers/productsRouter.js";
import { paymentRouter } from "./routers/paymentsRouter.js";
import { config } from "dotenv";
import { selectRouter } from "./routers/selectEndpointRouters.js";
import { clientRouter } from "./routers/clientrouter.js";

import cookieParser from "cookie-parser";
const corsOptions = { // CORS politics
    origin: true,  // all IP is enabled to connect
    credentials: true,
};

config()
export class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            api: "/api",
        };

        this.middleware();
        this.routes();
    }

    middleware() {
        this.app.use(express.json());
        this.app.use(morgan("dev"));
        this.app.use(cors(corsOptions));
        this.app.use(cookieParser())
        this.app.use(cors()); 
        this.app.use(bodyParser.json()); 
        this.app.use(bodyParser.urlencoded({ extended: true}));
    };

    routes(){
        this.app.use(this.path.api, routerUser);
        this.app.use(`${this.path.api}/products`, productRouter);
        this.app.use(`${this.path.api}/payments`, paymentRouter);
        this.app.use(`${this.path.api}/select`, selectRouter);
        this.app.use(`${this.path.api}/clients`, clientRouter);
    }

    listen() {
        this.app.listen(this.port , () => {
            console.log("server runnning on port:" , this.port);
        });
    };
};



