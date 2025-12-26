export const otpEmailTemplate = ({ otp, purpose }) => {
  const title =
    purpose === "register"
      ? "Verify your email to create account"
      : "Reset your password";

  return `
  <div style="background:#fde7ef;padding:30px;font-family:Arial">
    <div style="max-width:420px;margin:auto;background:#fff;border-radius:12px;padding:25px;text-align:center">
      <h1 style="color:#e91e63;font-weight:800;margin-bottom:10px">
        Welcome to BiggEyes
      </h1>

      <p style="color:#555;font-size:15px">${title}</p>

      <div style="margin:25px 0">
        <span style="
          display:inline-block;
          background:#e91e63;
          color:#fff;
          font-size:28px;
          letter-spacing:6px;
          padding:12px 28px;
          border-radius:10px;
          font-weight:bold">
          ${otp}
        </span>
      </div>

      <p style="color:#888;font-size:13px">
        Valid for <b>11 minutes</b>
      </p>

      <p style="color:#aaa;font-size:12px;margin-top:20px">
        OTP for: <b>${purpose === "register" ? "Create Account" : "Forgot Password"}</b>
      </p>
    </div>
  </div>`;
};
