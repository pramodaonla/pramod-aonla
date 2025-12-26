export const otpEmailTemplate = ({ otp, purpose }) => {
  return `
  <div style="
    max-width:600px;
    margin:auto;
    font-family:Arial, sans-serif;
    background:#fff0f5;
    padding:30px;
    border-radius:12px;
  ">
    <h1 style="
      color:#d81b60;
      text-align:center;
      font-weight:800;
      margin-bottom:10px;
    ">
      Welcome to BiggEyes 💗
    </h1>

    <p style="
      color:#444;
      font-size:16px;
      text-align:center;
      margin-bottom:25px;
    ">
      ${purpose === "register"
        ? "Verify your email to complete your account creation."
        : "Use the OTP below to reset your password."}
    </p>

    <div style="
      background:#ffffff;
      padding:25px;
      border-radius:10px;
      text-align:center;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      <p style="margin:0;color:#555;font-size:14px;">
        Your One Time Password
      </p>

      <div style="
        margin:15px auto;
        font-size:32px;
        letter-spacing:6px;
        font-weight:700;
        color:#ffffff;
        background:#ec407a;
        padding:12px 20px;
        display:inline-block;
        border-radius:8px;
      ">
        ${otp}
      </div>

      <p style="
        color:#777;
        font-size:13px;
        margin-top:10px;
      ">
        ⏰ Valid for <b>11 minutes</b>
      </p>
    </div>

    <p style="
      font-size:13px;
      color:#666;
      text-align:center;
      margin-top:25px;
    ">
      If you did not request this,
      please ignore this email.
    </p>

    <p style="
      font-size:12px;
      color:#999;
      text-align:center;
      margin-top:20px;
    ">
      © ${new Date().getFullYear()} BiggEyes. All rights reserved.
    </p>
  </div>
  `;
};
