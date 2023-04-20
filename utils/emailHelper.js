const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email server is working!");
    }
});

async function sendVerificationEmail(email, code) {
    await transporter.sendMail({
        from: 'no-reply@originsdatapacks.com',
        to: email,
        subject: 'Verify Email',
        html: `Please verify your accounts email address by visiting <a href="https://originsdatapacks.com/auth/verify/${code}">here</a>.<br><i>(https://originsdatapacks.com/auth/verify/${code})</i>`
    }).catch(() => console.log("Failed to send verification email!"))
}

module.exports = { sendVerificationEmail }