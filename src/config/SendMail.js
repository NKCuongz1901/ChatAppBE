import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const { SEND_MAIL_USER, SEND_MAIL_PASS, SEND_MAIL_FROM } = process.env

const sendMail = (option) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: SEND_MAIL_USER,
      pass: SEND_MAIL_PASS,
    },
  })

  option.from = SEND_MAIL_FROM
  console.log(option)
  transporter.sendMail(option)
}

export default sendMail
