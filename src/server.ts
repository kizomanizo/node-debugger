import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config({ path: `.env.local`, override: true });
import bodyParser from "body-parser";

class Server {
  private app: Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.NODE_PORT || 3000;
    this.initializeMiddleware();
  }

  private initializeMiddleware(): void {
    this.app.disable("x-powered-by");
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(
        `INFO: Service ${process.env.SERVICE_NAME?.toUpperCase()} is listening on ${this.port}`
      );
    });
  }
}

export default Server;

const server = new Server();
server.start();
