const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory =
  path.join(
    __dirname,
    "../public/uploads/profile-pictures"
  );

if (
  !fs.existsSync(uploadDirectory)
) {
  fs.mkdirSync(
    uploadDirectory,
    {
      recursive: true
    }
  );
}

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      callback
    ) => {
      callback(
        null,
        uploadDirectory
      );
    },

    filename: (
      req,
      file,
      callback
    ) => {
      const uniqueName =
        `${req.user._id}-${Date.now()}${path.extname(
          file.originalname
        ).toLowerCase()}`;

      callback(
        null,
        uniqueName
      );
    }
  });

const fileFilter = (
  req,
  file,
  callback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (
    !allowedTypes.includes(
      file.mimetype
    )
  ) {
    return callback(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }

  callback(null, true);
};

const uploadProfilePicture =
  multer({
    storage,
    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024
    }
  });

module.exports = {
  uploadProfilePicture
};