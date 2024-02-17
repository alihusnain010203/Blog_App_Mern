import nodemailer from 'nodemailer';

const sendMail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: "kxkx qaxh lnjj pkdr",
        },
      });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        html: message
    };
    try {
      console.log("sending email");
        await transporter.sendMail(mailOptions);
     console.log("email sent");
    } catch (error) {
        console.log(error);
    }
}

export default sendMail;