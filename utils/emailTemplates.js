export const otpEmailTemplate = ({ otp, purpose, minutes = 11 }) => `
<div style="max-width:600px;margin:auto;background:#fff0f6;padding:30px;border-radius:14px;font-family:Arial">
  <h1 style="text-align:center;color:#d81b60;font-weight:800;">
    Welcome to BiggEyes
  </h1>

  <p style="text-align:center;color:#555;font-size:15px;">
    ${
      purpose === "register"
        ? "Use this OTP to verify your BiggEyes account."
        : "Use this OTP to reset your BiggEyes password."
    }
  </p>

  <div style="text-align:center;background:#ffffff;padding:25px;border-radius:12px;margin-top:20px">
    <div style="
      display:inline-block;
      background:#ec407a;
      color:white;
      font-size:30px;
      letter-spacing:8px;
      padding:14px 28px;
      border-radius:10px;
      font-weight:700;
    ">
      ${otp}
    </div>

    <p style="margin-top:12px;font-size:13px;color:#777">
      Valid for <b>${minutes} minutes</b>
    </p>
  </div>

  <p style="margin-top:25px;text-align:center;font-size:13px;color:#999">
    If you did not request this, please ignore.
  </p>
</div>
`;
