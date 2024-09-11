const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validate, User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    // Validate incoming request data
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });
    }

    // Hash the password
    const saltRounds = Number(process.env.SALTROUNDS) || 10; // Default to 10 if not provided
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the new user
    user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    // Create a verification token
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();

    // Generate the verification URL and send the verification email
    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    // Respond with success message
    return res.status(201).send({
      message:
        "An email has been sent to your account. Please click the link to verify.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Internal server error" });
  }
});

//route to verify link sent to user and update there status to verified;
router.get("/:id/verify/:token", async (req, res) => {
  try {
    //Find user by ID

    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ message: "User does not exist" });

    //Check if the user is already verified
    if (user.verified) {
      return res.status(400).send({ message: "Email is already verified" });
    }

    //Find the token
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ message: "invalid or expired token" });

    //Update user's verified status
    user.verified = true;
    await user.save();

    //Delete the verification token after successfull verification
    await Token.deleteOne({ _id: token._id });

    //Respond with success message
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error.message);

    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
