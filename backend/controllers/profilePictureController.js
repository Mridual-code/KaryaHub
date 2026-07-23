const fs = require("fs");
const path = require("path");

const Employee = require(
  "../models/Employee"
);

const removeLocalFile = (
  fileUrl
) => {
  if (!fileUrl) {
    return;
  }

  try {
    const relativePath =
      fileUrl.replace(
        /^\/+/,
        ""
      );

    const absolutePath =
      path.join(
        __dirname,
        "..",
        relativePath
      );

    if (
      fs.existsSync(
        absolutePath
      )
    ) {
      fs.unlinkSync(
        absolutePath
      );
    }
  } catch (error) {
    console.error(
      "Remove profile image error:",
      error.message
    );
  }
};

const uploadMyProfilePicture =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select an image"
        });
      }

      const employee =
        await Employee.findOne({
          user: req.user._id
        });

      if (!employee) {
        removeLocalFile(
          `/public/uploads/profile-pictures/${req.file.filename}`
        );

        return res.status(404).json({
          success: false,
          message:
            "Employee profile not found"
        });
      }

      if (
        employee.profilePicture
      ) {
        removeLocalFile(
          employee.profilePicture
        );
      }

      employee.profilePicture =
        `/public/uploads/profile-pictures/${req.file.filename}`;

      await employee.save();

      res.status(200).json({
        success: true,
        message:
          "Profile picture uploaded successfully",
        profilePicture:
          employee.profilePicture
      });
    } catch (error) {
      if (req.file) {
        removeLocalFile(
          `/public/uploads/profile-pictures/${req.file.filename}`
        );
      }

      console.error(
        "Upload profile picture error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to upload profile picture"
      });
    }
  };

const deleteMyProfilePicture =
  async (req, res) => {
    try {
      const employee =
        await Employee.findOne({
          user: req.user._id
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee profile not found"
        });
      }

      if (
        employee.profilePicture
      ) {
        removeLocalFile(
          employee.profilePicture
        );
      }

      employee.profilePicture = "";

      await employee.save();

      res.status(200).json({
        success: true,
        message:
          "Profile picture removed successfully"
      });
    } catch (error) {
      console.error(
        "Delete profile picture error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to remove profile picture"
      });
    }
  };

module.exports = {
  uploadMyProfilePicture,
  deleteMyProfilePicture
};