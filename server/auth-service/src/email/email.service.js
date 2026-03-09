const { sendEmail } = require("./email.provider");
const inviteTemplate = require("./templates/invite.template");

exports.sendInviteEmail = async ({ to, name, inviteToken }) => {
  const html = inviteTemplate({ name, inviteToken });
 
  await sendEmail({
    to,
    subject: "You're invited to Inventory Management System",
    html,
  });
};

