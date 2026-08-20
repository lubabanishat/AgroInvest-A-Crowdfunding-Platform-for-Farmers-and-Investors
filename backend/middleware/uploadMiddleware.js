const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// Ensure Upload Directory Exists
// ==========================================
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, {
      recursive: true,
    });
  }
};

// ==========================================
// Storage Configuration
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = "";

    if (file.fieldname === "nid") {
      folderName = "nid";
    } else if (file.fieldname === "land_deed") {
      folderName = "land-deed";
    } else if (file.fieldname === "land_image") {
      folderName = "land-image";
    } else {
      return cb(
        new Error("Invalid upload field.")
      );
    }

    const uploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      folderName
    );

    try {
      ensureFolderExists(uploadPath);

      cb(null, uploadPath);
    } catch (error) {
      console.error(
        "Upload directory creation error:",
        error
      );

      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      );

    const extension =
      path.extname(
        file.originalname
      );

    cb(
      null,
      uniqueName + extension
    );
  },
});

// ==========================================
// File Filter
// ==========================================
const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, PNG and PDF files are allowed."
    )
  );
};

// ==========================================
// Multer Configuration
// ==========================================
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

module.exports = upload;