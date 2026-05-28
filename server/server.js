import express from "express";
import cors from "cors";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();

app.use(cors());

const upload = multer({
  dest: "uploads/",
});

const WHISPER_PATH =
  "/Users/carlosesquer/Documents/Projects/whisper.cpp/build/bin/whisper-cli";

const MODEL_PATH =
  "/Users/carlosesquer/Documents/Projects/whisper.cpp/models/ggml-base.en.bin";

app.post("/speech", upload.single("audio"), async (req, res) => {
  try {
    console.log("Received audio upload");

    if (!req.file) {
      return res.status(400).json({
        error: "No audio uploaded",
      });
    }

    const inputPath = req.file.path;
    const wavPath = `${inputPath}.wav`;

    // Convert webm -> wav
    exec(`ffmpeg -i ${inputPath} ${wavPath}`, (ffmpegErr) => {
      if (ffmpegErr) {
        console.error("FFMPEG ERROR");
        console.error(ffmpegErr);

        return res.status(500).json({
          error: "FFmpeg conversion failed",
        });
      }

      console.log("Converted to WAV");

      // Run whisper
      exec(
        `${WHISPER_PATH} -m ${MODEL_PATH} -f ${wavPath}`,
        (whisperErr, stdout, stderr) => {
          if (whisperErr) {
            console.error("WHISPER ERROR");
            console.error(whisperErr);
            console.error(stderr);

            return res.status(500).json({
              error: "Whisper transcription failed",
            });
          }

          console.log("WHISPER OUTPUT:");
          console.log(stdout);

          res.json({
            text: stdout,
          });

          // cleanup temp files
          try {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(wavPath);
          } catch {}
        }
      );
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Speech server running on http://localhost:3000");
});
