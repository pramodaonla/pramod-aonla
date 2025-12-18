router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save(); // ✅ existing user, name already present

    await sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
          Reset Password
        </a>
      `
    });

    res.json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
