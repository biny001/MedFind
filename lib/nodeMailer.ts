import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// export const Options = {
//   from: {
//     name: "Efuye-Gela",
//     address: process.env.USER_EMAIL || "default@example.com",
//   },
//   to: "biny01amin@gmail.com",
//   subject: "Given role to admin Dashboard",
//   text: "You have been given the role of an admin",
//   html: "<p>You have been given the role of an admin</p>",
// };

interface EmailOptions {
  to: string; // Recipient email address
  subject: string; // Subject of the email
  text: string; // Plain text content
  html?: string; // Optional: HTML content
}

const sendMail = async (emailOptions: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Stellar Wallet" <${process.env.EMAIL_USER}>`, // Sender address
      to: emailOptions.to, // Recipient
      subject: emailOptions.subject, // Subject
      text: emailOptions.text, // Plain text body
      html: emailOptions.html, // HTML body (optional)
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow error if needed for handling upstream
  }
};

export default sendMail;
