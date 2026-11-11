const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024, files: 1 },
    fileFilter(_req, file, callback) {
        const hasPdfExtension = file.originalname?.toLowerCase().endsWith(".pdf");
        if (file.mimetype !== "application/pdf" || !hasPdfExtension) {
            return callback(new Error("Only PDF files are allowed"));
        }
        callback(null, true);
    },
});

module.exports = upload;
