import sharp from "sharp";
import { Readable } from "node:stream";

const inputFile = 'tmp/input/2333.jpg';
const outputFile = 'tmp/output/2333_instagram.webp';
const file = await Deno.open(inputFile)

const denoStream = file.readable
const nodeReadable = Readable.fromWeb(denoStream as any);

const optimizer = sharp()
  .resize({
    height: 730,
    width: 590,
    fit: sharp.fit.cover,
    withoutEnlargement: true,
  })
  .webp({ quality: 70 })

const optimizedBuffer = await nodeReadable.pipe(optimizer).toBuffer();
Deno.writeFile(outputFile, optimizedBuffer);

const originalStat = await Deno.stat(inputFile);

console.log(`✅ Sucesso!`);
console.log(`Original: ${(originalStat.size / 1024).toFixed(2)} KB`);
console.log(`Otimizada: ${(optimizedBuffer.length / 1024).toFixed(2)} KB`);
console.log(`Redução de: ${(((originalStat.size - optimizedBuffer.length) / originalStat.size) * 100).toFixed(1)}%`);