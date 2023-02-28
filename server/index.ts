import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const filePath = "../public" + req.url;
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        res.statusCode = 403;
        res.end("Forbidden");
        logRequest(req, res);
      } else {
        const fileStream = fs.createReadStream(filePath);
        const contentType = getContentType(filePath);
        const contentLength = stat.size.toString();
        const contentSize = getFileSize(stat.size);

        logRequest(req, res, contentLength, contentSize, contentType);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", contentLength);
        res.setHeader("Content-File-Size", contentSize);
        fileStream.pipe(res);
      }
    } else {
      res.statusCode = 404;
      res.end("File not found");

      logRequest(req, res);
    }
  }
);

const getContentType = (filePath: string): string => {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".html":
      return "text/html";
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".wav":
      return "audio/wav";
    default:
      return "application/octet-stream";
  }
};

const getFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) {
    return "0 Byte";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

const logRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  contentLength?: string,
  contentSize?: string,
  contentType?: string
) => {
  let logMessage = `Request: ${req.method} Status code: ${res.statusCode} URL: ${req.url}`;

  if (!contentLength || !contentSize || !contentType) {
    if (res.statusCode === 403) {
      logMessage += `\nForbidden Access\n`;
    } else if (res.statusCode === 404) {
      logMessage += `\nFile not Found\n`;
    }
  } else {
    logMessage += `\nType: ${contentType} - Length: ${contentLength}bytes - Size: ${contentSize}\n`;
  }

  logMessage += `Time: ${new Date().toISOString()}\n`;

  fs.appendFile("log.txt", logMessage + "\n", (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err.message}`);
    }
  });
};

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
