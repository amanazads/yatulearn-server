import { createTransport } from "nodemailer";

const createTransporter = () =>
  createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

// ─── OTP / Registration Email ────────────────────────────────────────────────

const sendMail = async (email, subject, data) => {
  const transport = createTransporter();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Account – YATU Learn</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:16px;padding:14px 28px;">
                    <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">
                      🎓 YATU Learn
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1a2e;border-radius:20px;border:1px solid #2d2d4e;overflow:hidden;">

              <!-- Top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#7c3aed,#4f46e5,#06b6d4);"></td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 40px 32px;">
                <tr>
                  <td>
                    <!-- Icon -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:#2d2d56;border-radius:50%;width:56px;height:56px;text-align:center;vertical-align:middle;">
                          <span style="font-size:28px;line-height:56px;">🔐</span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0 0 12px;font-size:24px;color:#f1f0ff;font-weight:700;">
                      Verify your account
                    </h1>
                    <p style="margin:0 0 28px;font-size:15px;color:#9d9db8;line-height:1.6;">
                      Hi <strong style="color:#c4b5fd;">${data.name}</strong>, welcome to YATU Learn! 🎉<br/>
                      Use the one-time password below to complete your registration. It expires in <strong style="color:#f1f0ff;">5 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td align="center" style="background:linear-gradient(135deg,#1e1b4b,#312e81);border:1px solid #4f46e5;border-radius:16px;padding:28px 20px;">
                          <p style="margin:0 0 8px;font-size:12px;color:#818cf8;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Your OTP</p>
                          <p style="margin:0;font-size:44px;font-weight:800;color:#a78bfa;letter-spacing:10px;font-family:'Courier New',monospace;">
                            ${data.otp}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning Note -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                      <tr>
                        <td style="background:#1f1a35;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#fcd34d;">
                            ⚠️ Never share this OTP with anyone. YATU Learn will never ask for it.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2d2d4e;padding:20px 40px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#4a4a72;text-align:center;line-height:1.6;">
                      If you didn't request this, you can safely ignore this email.<br/>
                      © ${new Date().getFullYear()} YATU Learn. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await transport.sendMail({
    from: `"YATU Learn" <${process.env.Gmail}>`,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

// ─── Forgot / Reset Password Email ───────────────────────────────────────────

export const sendForgotMail = async (subject, data) => {
  const transport = createTransporter();

  const resetLink = `${process.env.frontendurl}/reset-password/${data.token}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password – YATU Learn</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:16px;padding:14px 28px;">
                    <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">
                      🎓 YATU Learn
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1a2e;border-radius:20px;border:1px solid #2d2d4e;overflow:hidden;">

              <!-- Top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#7c3aed,#4f46e5,#06b6d4);"></td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 40px 32px;">
                <tr>
                  <td>
                    <!-- Icon -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:#2d2d56;border-radius:50%;width:56px;height:56px;text-align:center;vertical-align:middle;">
                          <span style="font-size:28px;line-height:56px;">🔑</span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0 0 12px;font-size:24px;color:#f1f0ff;font-weight:700;">
                      Reset your password
                    </h1>
                    <p style="margin:0 0 28px;font-size:15px;color:#9d9db8;line-height:1.6;">
                      We received a request to reset the password for your YATU Learn account linked to
                      <strong style="color:#c4b5fd;">${data.email}</strong>.<br/><br/>
                      Click the button below to set a new password. This link expires in <strong style="color:#f1f0ff;">5 minutes</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td align="center" style="border-radius:12px;background:linear-gradient(135deg,#7c3aed,#4f46e5);">
                          <a href="${resetLink}"
                             style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:0.3px;">
                            Reset Password →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback link -->
                    <p style="margin:0 0 20px;font-size:12px;color:#4a4a72;line-height:1.6;">
                      If the button doesn't work, copy and paste this link into your browser:<br/>
                      <a href="${resetLink}" style="color:#818cf8;word-break:break-all;">${resetLink}</a>
                    </p>

                    <!-- Warning Note -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#1f1a35;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#fcd34d;">
                            ⚠️ If you didn't request a password reset, please ignore this email — your password won't change.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2d2d4e;padding:20px 40px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#4a4a72;text-align:center;line-height:1.6;">
                      © ${new Date().getFullYear()} YATU Learn. All rights reserved.<br/>
                      This is an automated message, please do not reply.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await transport.sendMail({
    from: `"YATU Learn" <${process.env.Gmail}>`,
    to: data.email,
    subject,
    html,
  });
};
