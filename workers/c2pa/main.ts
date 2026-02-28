import {
  getNextC2PATaskFromQueue,
  pushC2PATaskToQueue,
  updateC2PATaskAttempts,
} from "../../common/c2pa-task.ts";
import { injectC2PAMetadata } from "./modules/c2pa-cli-tool.ts";
import {
  createTempFile,
  readTempFile,
  removeTempFile,
} from "./modules/tmp-file.ts";
import {
  getFileFromCloudStorage,
  putFileToCloudStorage,
} from "./modules/cloud-storage.ts";

const MAX_ATTEMPTS = 5;
const TEMP_FILES_DIR = "tmp/files";
console.log("🚀 Worker waiting for tasks...");

while (true) {
  const task = await getNextC2PATaskFromQueue();
  if (!task) continue;

  const manifestPath = 'tmp/manifest/c2pa.json';
  const inputFilePath = `${TEMP_FILES_DIR}/original/${task.assetId}`;
  const outputFilePath = `${TEMP_FILES_DIR}/c2pa_injected/${task.assetId}`;

  try {
    // 1. Get image from S3
    const file = await getFileFromCloudStorage(task.assetId);

    if (!file) {
      if (task.attempts >= MAX_ATTEMPTS) {
        console.warn(
          `Asset ${task.assetId} not available. Maximum attempts reached.`,
        );
        continue;
      }
      const taskUpdated = updateC2PATaskAttempts(task);
      await pushC2PATaskToQueue(taskUpdated);

      console.warn(`Asset ${task.assetId} not available. Scheduled for retry.`);
      continue;
    }
    // 2. Write image to local file system
    await createTempFile(inputFilePath, file);
    // 3. Inject C2PA metadata
    await injectC2PAMetadata(
      inputFilePath,
      manifestPath,
      outputFilePath,
    );
    // 4. Send injected C2PA image to S3
    const signedFileData = await readTempFile(outputFilePath);
    await putFileToCloudStorage(task.assetId, signedFileData);

    console.log(`Asset "${task.assetId}" injected C2PA manifest.json`);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(`Error processing asset "${task.assetId}": ${error.message}`);
  } finally {
    // removeTempFile(tmpOriginalFilePath);
    // removeTempFile(tmpC2PAInjectedFilePath);
  }
}
