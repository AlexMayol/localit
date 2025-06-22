import { describe, test, expect } from "vitest";
import fs from "fs";
import util from "util";
import zlib from "zlib";
const readFile = util.promisify(fs.readFile);
const gzip = util.promisify(zlib.gzip);

const getGzipSize = (filePath) =>
  readFile(filePath)
    .then(gzip)
    .then((x) => x.length);

const MAX_ALLOWED_SIZE = 1500;
const LOCALIT_PATH = "./dist/localit.es.js";

describe("Localit's final file size", () => {
  test("The generated file doesn't exceed 1.5KB after being gzipped", async () => {
    expect(await getGzipSize(LOCALIT_PATH)).toBeLessThan(MAX_ALLOWED_SIZE);
  });
});
