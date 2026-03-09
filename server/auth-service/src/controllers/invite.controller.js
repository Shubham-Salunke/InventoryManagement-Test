const Invite = require("../models/invite.model");
const crypto = require("crypto");
const { sendInviteMail } = require("../services/email.service");

exports.inviteUser = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    await Invite.create({
      email,
      role,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const link = `${process.env.FRONTEND_URL}/activate/${token}`;

    await sendInviteMail(email, link);

    res.status(200).json({ message: "Invite sent successfully" });
  } catch (error) {
    next(error);
  }
};
