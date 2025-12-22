import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpEmailTemplate = ({ otp, reason }) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:30px">
      <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px">
        <h1 style="text-align:center; color:#e91e63; margin-bottom:10px;">
          Welcome to BiggEyes
        </h1>

        <p style="font-size:14px; color:#555; text-align:center;">
          ${reason}
        </p>

        <div style="margin:30px 0; text-align:center;">
          <div style="
            font-size:32px;
            letter-spacing:6px;
            font-weight:bold;
            color:#000;
            background:#ffe6f0;
            padding:15px;
            border-radius:6px;
          ">
            ${otp}
          </div>
        </div>

        <p style="font-size:13px; color:#777; text-align:center;">
          This OTP is valid for <b>10 minutes</b> only.
        </p>

        <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;
};

export const sendEmail = async (to, subject, htmlContent) => {
  const msg = {
    to,
    from: process.env.MAIL_FROM, // SendGrid verified sender
    subject,
    html: htmlContent
  };

  try {
    await sgMail.send(msg);
    console.log("EMAIL SENT:", to);
  } catch (error) {
    console.error(
      "SENDGRID ERROR:",
      error.response ? error.response.body : error.message
    );
    // ❗ Fail silently to not block API
  }
};

export const sendOtpEmail = async (to, otp, reason) => {
  await sendEmail(
    to,
    "Your BiggEyes OTP",
    otpEmailTemplate({ otp, reason })
  );
};
