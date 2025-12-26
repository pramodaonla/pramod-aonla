export const otpEmailTemplate = ({ otp, purpose }) => {
  const title =
    purpose === "register"
      ? "Verify your email to complete account creation"
      : "Reset your BiggEyes password";

  return `
  <div style="background:#fde7ef;padding:30px;font-family:Arial">
    <div style="max-width:420px;margin:auto;background:#fff;border-radius:12px;padding:25px;text-align:center">
      
      <h1 style="color:#d81b60;margin-bottom:10px;font-weight:800">
        Welcome to BiggEyes
      </h1>

      <p style="color:#555;font-size:15px;margin-bottom:25px">
        ${title}
      </p>

      <div style="background:#fce4ec;border-radius:10px;padding:18px;margin:20px 0">
        <p style="margin:0;color:#777;font-size:14px">Your One Time Password</p>

        <div style="
          margin:12px auto;
          background:#ec407a;
          color:#fff;
          font-size:30px;
          font-weight:700;
          letter-spacing:6px;
          padding:12px 0;
          width:220px;
          border-radius:8px;">
          ${otp}
        </div>

        <p style="margin:0;color:#999;font-size:13px">
          Valid for <b>11 minutes</b>
        </p>
      </div>

      <p style="font-size:13px;color:#888">
        OTP purpose: <b>${purpose === "register" ? "Create Account" : "Forgot Password"}</b>
      </p>

    </div>
  </div>
  `;
};
