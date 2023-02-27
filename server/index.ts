import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const filePath = "../public" + req.url; // Convert the requested URL to a file path
    const fileExists = fs.existsSync(filePath); // Check if the file exists
    if (fileExists) {
      const fileStream = fs.createReadStream(filePath);
      const stat = fs.statSync(filePath);
      const contentType = getContentType(filePath);
      const contentLength = stat.size.toString();
      const contentSize = getFileSize(stat.size);
      logRequest(req, res.statusCode, contentLength, contentSize, contentType);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", contentLength);
      res.setHeader("Content-File-Size", contentSize);
      fileStream.pipe(res); // Send the file contents to the browser
    } else {
      const errorCode = 404;
      res.statusCode = errorCode;
      res.end("File not found");
      logRequest(req, errorCode);
    }
  }
);

function getContentType(filePath: string): string {
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
}

function getFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) {
    return "0 Byte";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

function logRequest(
  req: http.IncomingMessage,
  statusCode: number,
  contentLength?: string,
  contentSize?: string,
  contentType?: string
) {
  let logMessage: string;
  if (!contentLength || !contentSize || !contentType) {
    logMessage = `Request: ${req.method} url: ${
      req.url
    } Status code: ${statusCode}\n File Not Found.\n Request Made at ${new Date().toISOString()}\n`;
  } else {
    logMessage = `Request: ${req.method} url: "${req.url}" path: "${
      "../public" + req.url
    }" Status code: ${statusCode}\n File Type: ${contentType} File Length: ${contentLength}bytes File Size: ${contentSize}\n Request Made at ${new Date().toISOString()}\n`;
  }
  fs.appendFile("log.txt", logMessage + "\n", (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err.message}`);
    }
  });
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
