const style = `
background: #eee;
padding: 20px;
border-radius: 20px`;

const emailTemplate = (email, content, replyTo, subject) => {
  return {
    Source: replyTo,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <div style="${style}">
          <h1>${subject}</h1>
         ${content}
             <p>&copy; ${new Date().getFullYear()}</p>
              </div>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome to the Realist Deal",
      },
    },
  };
};

module.exports = { emailTemplate };
