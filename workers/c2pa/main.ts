import { } from "@storage"
import { } from "@queue-message"
import { } from "@contentauth/c2pa-node"

// 0. Listen for tasks
// 1. Get image from S3
// 2. Inject C2PA metadata
// 3. Send injected C2PA image to S3 (contentauth/hash.extension)