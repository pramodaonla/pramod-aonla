export const otpEmailTemplate = ({ otp, purpose }) => {
  const title =
    purpose === "register"
      ? "Verify your email to complete your account"
      : "Reset your BiggEyes password";

  const purposeText =
    purpose === "register"
      ? "Account Creation OTP"
      : "Password Reset OTP";

  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #fff0f6;
    padding: 30px;
    text-align: center;
  ">
    <h1 style="
      color: #d81b60;
      font-weight: 800;
      margin-bottom: 10px;
    ">
      Welcome to BiggEyes
    </h1>

    <p style="color:#444; font-size:16px;">
      ${title}
    </p>

    <div style="
      background:#ffffff;
      padding:25px;
      margin:30px auto;
      max-width:320px;
      border-radius:12px;
      box-shadow:0 4px 12px rgba(0,0,0,0.1);
    ">
      <p style="margin:0; color:#777;">
        ${purposeText}
      </p>

      <div style="
        margin-top:15px;
        font-size:36px;
        font-weight:bold;
        letter-spacing:6px;
        color:#ffffff;
        background:#ec407a;
        padding:12px 0;
        border-radius:8px;
      ">
        ${otp}
      </div>

      <p style="margin-top:15px; color:#666;">
        Valid for <b>11 minutes</b>
      </p>
    </div>

    <p style="font-size:13px; color:#999;">
      If you didn’t request this, please ignore this email.
    </p>
  </div>
  `;
};
