import http from "http";
import fs from "fs";

interface ContentInformation {
  length: string;
  size: string;
  type: string;
}

const logRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  content: ContentInformation | NodeJS.ErrnoException
) => {
  let logMessage: string;
  logMessage = `${new Date().toISOString()}\n`;
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

export default logRequest;
