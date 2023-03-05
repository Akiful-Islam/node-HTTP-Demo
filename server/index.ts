import http from "http";
import fs from "fs";
import { getContentType, getFileSize } from "./headerMethods";
import logRequest from "./logRequest";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const filePath = "../public" + req.url;
    try {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) throw new Error("URL is a directory");

      fs.accessSync(filePath, fs.constants.R_OK);

      const fileStream = fs.createReadStream(filePath);

      const length = stat.size.toString();
      const size = getFileSize(stat.size);
      const type = getContentType(filePath);

      logRequest(req, res, { length, size, type });

      res.setHeader("Content-Type", type);
      res.setHeader("Content-Length", length);

      fileStream.pipe(res);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === "ENOENT") {
        const error = new Error("File not found");

        res.statusCode = 404;
        res.end(error.message);

        logRequest(req, res, error);
      } else if (err.message === "URL is a directory") {
        const error = new Error("Bad Request. File is a directory.");

        res.statusCode = 400;
        res.end(error.message);

        logRequest(req, res, error);
      } else if (err.code === "EACCES") {
        const error = new Error("Forbidden. File Access denied.");

        res.statusCode = 403;
        res.end(error.message);

        logRequest(req, res, error);
      } else {
        const error = new Error("Internal server error");

        res.statusCode = 500;
        res.end(error.message);

        logRequest(req, res, error);
      }
    }
  }
);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
