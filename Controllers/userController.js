const userSchema = require("../db/schema/userSchema");
const openingSchema = require("../db/schema/openingSchema");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const register = async (req, res) => {
  try {
    const { name, clerk_id, email } = req.body;

    if (!(name && email && clerk_id)) {
      return res.status(400).json({
        message: "All input is required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await userSchema.findOne({
      email: normalizedEmail,
    });

    if (!existingUser) {
      const user = new userSchema({
        name,
        clerk_id,
        email: normalizedEmail,
      });
      const newUser = await user.save();
    }

    const token = jwt.sign({ normalizedEmail }, secretKey);

    return res.status(201).json({
      message: "ok",
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

const createOpening = async (req, res) => {
  const {
    title,
    company,
    location,
    salary,
    description,
    date,
    normalizedEmail,
  } = req.body;

  try {
    const user = await userSchema.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const newOpening = new openingSchema({
      title,
      company,
      location,
      salary,
      description,
      user: user._id,
      date,
      isOpen: true,
    });

    const opening = await newOpening.save();
  } catch (e) {
    console.log(e);
  }

  //   return res.json({ message: "ok" });
};

module.exports = { register, createOpening };
