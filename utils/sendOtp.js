const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOtp(email, otp) {
  console.log(`OTP for ${email}: ${otp}`);
  // yahan aap Twilio Email / Verify service use kar sakte ho
}

module.exports = sendOtp;
