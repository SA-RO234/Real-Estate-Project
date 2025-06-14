import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disallow default body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Upload failed" });
    }
    return res
      .status(200)
      .json({ message: "Files uploaded successfully", files });
  });
}
