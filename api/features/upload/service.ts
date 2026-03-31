import { hash } from "node:crypto";

export const renameFile = (name: string, lastModified: string, extension: string) => {
  const hashName = hash(
    "sha256",
    `${name}${lastModified}`,
  );
  return `raw/${hashName}.${extension}`;
}