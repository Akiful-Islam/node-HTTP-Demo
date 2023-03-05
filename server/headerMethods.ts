import { extname } from "path";

const contentTypeMap: { [key: string]: string } = {
  ".txt": "text/plain",
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

const getContentType = (filePath: string): string => {
  const ext = extname(filePath);
  return contentTypeMap[ext] || "application/octet-stream";
};

const getFileSize = (bytes: number): string => {
  if (bytes == 0) {
    return "0 Byte";
  }

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

export { getContentType, getFileSize };
