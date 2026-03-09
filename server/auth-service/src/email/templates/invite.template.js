require('dotenv').config();

module.exports = ({ name, inviteToken }) => {
  const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>You're Invited </h2>

      <p>Hello <b>${name}</b>,</p>
       
      <p>
        You have been invited to join the 
        <b>Inventory Management System</b>.
      </p>

      <p>Click the button below to set your password:</p>

      <p>
        <a href="${inviteLink}"
           style="
             background:#2563eb;
             color:#fff;
             padding:10px 16px;
             text-decoration:none;
             border-radius:6px;
             display:inline-block;
           ">
          Set Password
        </a>
      </p>

      <p>This link will expire in <b>24 hours</b>.</p>

      <br/>

      <p>Regards,<br/>
      Inventory Team</p>
    </div>
  `;
};
