
// import nodemailer from 'nodemailer';
// // const nodemailer = require("nodemailer");

//  export const sendEmail = async (email, subject, text) => {
//   try {
//     console.log(email);
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,
//       service: "gmail",
//     //   port: 465,
//     //   secure: true,
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//       authMethod: "PLAIN"
//     });

//     await transporter.sendMail({
//       from: process.env.USER,
//       to: email,
//       subject: subject,
//       text: text,
//     });
//     console.log("email sent sucessfully");
//   } catch (error) {
//     console.log("email not sent");
//     console.log(error);
//   }
// };

// import nodemailer from 'nodemailer';

// export const sendEmail = async (email: string, subject: string, text: string): Promise<void> => {
//   try {
//     console.log(`Sending email to: ${email}`);

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com', // Specify Gmail SMTP server
//       port: 587,               // Use port 587 for TLS
//       secure: false,           // Set to true for port 465
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.USER,
//       to: email,
//       subject: subject,
//       text: text,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Email not sent");
//     if (error instanceof Error) {
//       console.error(`Error: ${error.name} - ${error.message}`);
//     } else {
//       console.error(`Unexpected error: ${error}`);
//     }
//   }
// };

// // Call the function
// sendEmail('sunidhi1408.be21@chitkara.edu.in', 'Test Subject', 'This is a test email.')
//   .then(() => console.log('Email process completed'))
//   .catch((error) => console.error('Failed to send email:', error));
