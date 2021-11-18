const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.sendEmail = (message) => {
  sgMail.send(message)
    .then(() => console.log('Email Sent'))
    .catch(err => console.log(error.message))
}