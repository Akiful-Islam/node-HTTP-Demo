import { extname } from "path";

interface ContentInformation {
  length: string;
  size: string;
  type: string;
}

const getContentType = (filePath: string): string => {
  const extension = extname(filePath);
  switch (extension) {
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
  if (bytes == 0) {
    return "0 Byte";
  }

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

export { getContentType, getFileSize, ContentInformation };
