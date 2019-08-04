// importa o path - Para trabalhar com caminhos
const path = require('path');

// importa o node mailer
const nodemailer = require('nodemailer');

// importa o handleBars - Permite usar templates em e-mails (@nome, @apelido@, etc)
const hbs = require('nodemailer-express-handlebars');

// importa os dados de authenticacao usando destruturacao
const { host, port, user, pass} = require('../config/mail.json');


const mailConfig = require('../config/mail.json');

// cod do transporte gerado pelo mailtrap
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
}


transport.use('compile', hbs(handlebarOptions));

  // exporta
  module.exports = transport;