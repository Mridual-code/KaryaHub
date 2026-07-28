const bcrypt = require("bcryptjs");

const User = require("../models/User");

/*
|--------------------------------------------------------------------------
| Get Logged-in User Profile
|--------------------------------------------------------------------------
*/

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        res.json({
            success: true,
            user,
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

exports.updateProfile = async (req, res) => {

    try {

        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        // Check if another user already uses this email
        if (email) {

            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.user.id },
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists",
                });
            }

        }

        // Update profile
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

exports.changePassword = async (req, res) => {

    try {

        const {

            currentPassword,
            newPassword,

        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        const isMatch =
            await user.comparePassword(
                currentPassword
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Current password is incorrect",
            });

        }

        user.password = newPassword;

        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};