import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { transporter } from "@/lib/mailer";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return;
      }
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Password Reset</h2>
            <p>You requested a password reset.</p>
            <p>
              <a href="${url}"
                 style="
                   background:#18181b;
                   color:white;
                   padding:10px 18px;
                   border-radius:999px;
                   text-decoration:none;
                   display:inline-block;
                 ">
                 Reset Password
              </a>
            </p>
            <p>If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    },
  },

  sendEmail: async ({
    user,
    type,
    url,
  }: {
    user: { email: string; name?: string | null };
    type: "resetPassword" | "verifyEmail";
    url: string;
  }) => {
    let subject = "";
    let html = "";

    if (type === "resetPassword") {
      subject = "Reset your password";
      html = `
        <div style="font-family:Arial,sans-serif">
          <h2>Password Reset</h2>
          <p>You requested a password reset.</p>

          <p>
            <a href="${url}"
               style="
                 background:#18181b;
                 color:white;
                 padding:10px 18px;
                 border-radius:999px;
                 text-decoration:none;
                 display:inline-block;
               ">
               Reset Password
            </a>
          </p>

          <p>If you didn't request this, ignore this email.</p>
        </div>
      `;
    } else if (type === "verifyEmail") {
      subject = "Verify your email";
      html = `<p>Click <a href="${url}">here</a> to verify your email.</p>`;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject,
      html,
    });
  },
});
