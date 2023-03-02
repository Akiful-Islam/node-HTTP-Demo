import http from "http";
import fs from "fs";
import {
  getContentType,
  getFileSize,
  ContentInformation,
} from "./contentMethods";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const filePath = "../public" + req.url;
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        res.statusCode = 403;
        res.end("Access Forbidden");
        logRequest(req, res, new Error("Access Forbidden"));
      } else {
        const fileStream = fs.createReadStream(filePath);

        const length = stat.size.toString();
        const size = getFileSize(stat.size);
        const type = getContentType(filePath);

        logRequest(req, res, { length, size, type });

        res.setHeader("Content-Type", type);
        res.setHeader("Content-Length", length);
        fileStream.pipe(res);
      }
    } else {
      res.statusCode = 404;
      res.end("File not found");

      logRequest(req, res, new Error("File not found"));
    }
  }
);

const logRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  content: ContentInformation | Error
) => {
  let logMessage: string;
  logMessage = `** ${new Date().toISOString()}\n`;
  logMessage += `-- Request : ${req.method} || Status : ${res.statusCode} || URL : "${req.url}"\n`;

  if (content instanceof Error) {
    logMessage += `!! ERROR - ${content.message}\n`;
  } else if (content instanceof Object) {
    logMessage += `~~ Type - ${content.type} :: Length - ${content.length}B :: Size - ${content.size}\n`;
  }

  fs.appendFile("log.txt", logMessage + "\n", (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err.message}`);
    }
  });
};

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
