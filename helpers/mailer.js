const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.send = function (from, to, subject, html) {
  return sgMail.send({
    from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
    to: to, // list of receivers e.g. bar@example.com, baz@example.com
    subject: subject, // Subject line e.g. 'Hello ✔'
    //text: text, // plain text body e.g. Hello world?
    html: html, // html body e.g. '<b>Hello world?</b>'
  });
};

exports.sendDynamic = (from, personalizations, dynamicTemplateData, templateId) => sgMail.send({
  from,
  personalizations,
  templateId,
  dynamicTemplateData
});
