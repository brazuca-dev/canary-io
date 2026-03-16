import { s3 } from "@storage"
import { sqs } from "@queue-message"
import { } from "sharp"

// 0. Listen for tasks
// 1. Get image from S3
// 2. Optimize image
// 3. Send optimized image to S3 (optimized/hash.extension)