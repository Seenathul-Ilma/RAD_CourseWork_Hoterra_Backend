// multer.ts or files.ts or upload.ts

import multer from "multer";    // 1

// can store in disk or memory
// we choose memory
const storage = multer.memoryStorage()   // 2

export const upload = multer({ storage })  // storage : storage   // 3
