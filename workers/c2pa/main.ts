import { s3 } from "@storage"
import { sqs } from "@queue-message"

// 0. Listen for tasks
// 1. Get image from S3
// 2. Inject C2PA metadata
// 3. Send injected C2PA image to S3 (contentauth/hash.extension)