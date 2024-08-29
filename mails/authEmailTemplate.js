// mails/authEmailTemplate.js
const authEmailTemplate = ({
  type,
  recipientName,
  companyName,
  actionURL,
  otp,
  email,
}) => {
  let actionContent;
  let headerText;
  const isAuth = type === 'otp' || type === 'reset';

  if (type === 'otp') {
    headerText = 'Prove Your Identity';
    actionContent = `
      <tr>
        <td style="padding: 20px; font-size: 16px; line-height: 24px;">
          <p style="margin: 0;">For security purposes, please verify your identity by providing the following One-Time Password (OTP).</p>
          <h2 style="margin: 20px 0; background: linear-gradient(to right, #00bc69, #00bca8); color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 4px;">${otp}</h2>
          <p style="margin: 0;"><strong>One-Time Password (OTP) is valid for 10 minutes.</strong></p>
        </td>
      </tr>
    `;
  } else if (type === 'reset') {
    headerText = 'Reset Your Password';
    actionContent = `
      <tr>
        <td style="padding: 20px; font-size: 16px; line-height: 24px;">
          <p style="margin: 0;">We received a request to reset your ${companyName} account password. Please click the button below to reset your password:</p>
          <a href="${actionURL}" style="display: block; margin: 20px 0; background: linear-gradient(to right, #00bc69, #00bca8); color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 4px; text-decoration: none;">Reset Password</a>
          <p style="margin: 0;"><strong>This link is valid for 1 hour.</strong></p>
        </td>
      </tr>
    `;
  } else if (type === 'waitlist') {
    headerText = 'Welcome to the Waitlist!';
    actionContent = `
      <tr>
        <td style="padding: 20px; font-size: 16px; line-height: 24px;">
          <p style="margin: 0;">Thank you for joining the ${companyName} waitlist! We are thrilled to have you onboard and will keep you updated with any news or information.</p>
          <p style="margin: 0;"><strong>Stay tuned for more updates!</strong></p>
        </td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${companyName} Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            background-color: #f4f6f8 !important;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .header {
            border-bottom: 2px solid #00bca8;
            padding-bottom: 10px;
            margin-bottom: 18px;
            text-align: center;
          }
          .header a {
            font-size: 1.5em;
            color: #00bca8;
            text-decoration: none;
            font-weight: 700;
          }
          .footer {
            text-align: center;
            color: #aaa;
            font-size: 0.9em;
            margin-top: 20px;
          }
          .email-info {
            color: #666666;
            font-weight: 400;
            font-size: 0.9em;
            line-height: 1.4;
            margin-top: 20px;
            text-align: center;
          }
          .email-info a {
            text-decoration: none;
            color: #00bc69;
          }
          @media only screen and (max-width: 600px) {
            .container {
              padding: 10px;
              border-radius: 0;
              box-shadow: none;
            }
            .header a {
              font-size: 1.2em;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f4f6f8 !important;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8">
          <tr>
            <td>
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" align="center" style="margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 6px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); box-sizing: border-box;">
                <tr class="header" style="border-bottom: 2px solid #00bca8; padding-bottom: 10px; text-align: center;">
                  <td>
                    <div class="header">
                      <a href="#" style="font-size: 1.5em; color: #00bca8; text-decoration: none; font-weight: 700;">${headerText}</a>
                    </div>
                  </td>
                </tr>
                <tr class="content" style="padding: 20px; line-height: 1.6;">
                  <td>
                    <p style="margin: 0 0 10px; color: #333;">Dear ${recipientName},</p>
                    ${actionContent}
                    ${
                      isAuth
                        ? `
                      <p style="margin: 0 0 10px; color: #333;">
                        If you did not request this, please ignore this message. Please ensure the confidentiality of your ${type === 'otp' ? 'OTP' : 'reset link'} and do not share it with anyone.
                      </p>`
                        : ''
                    }
                    <p style="margin: 0 0 10px; color: #333;">Thank you for using ${companyName}.</p>
                    <p style="margin: 0 0 10px; color: #333;">Best regards,</p>
                    <p style="margin: 0 0 10px; color: #333;"><strong>${companyName} Team</strong></p>
                  </td>
                </tr>
                <tr class="footer" style="text-align: center; color: #aaa; font-size: 0.9em; margin-top: 20px;">
                  <td>
                    <hr style="border: none; border-top: 0.5px solid #e1e1e1" />
                    <p style="margin: 0 0 10px;">This email can't receive replies.</p>
                    <p style="margin: 0 0 10px;">For more information about ${companyName.toLowerCase()}, visit <strong><a href="https://payertel.com.ng/" style="text-decoration: none; color: #00bc69;">www.payertel.com.ng</a></strong></p>
                  </td>
                </tr>
                <tr class="email-info" style="color: #666666; font-weight: 400; font-size: 0.9em; line-height: 1.4; margin-top: 20px; text-align: center;">
                  <td>
                    <span style="margin: 0 0 10px;">This email was sent to <a href="mailto:${email}" style="text-decoration: none; color: #00bc69;">${email}</a></span>
                    <div style="margin: 0 0 10px;"><a href="/" style="text-decoration: none; color: #00bc69;">${companyName}</a> | 22, Ita-Agemo Ward 12, Igbehin, Abeokuta, Igbehin, Ogun State, Nigeria.</div>
                    <div style="margin: 0 0 10px;">&copy; 2024 ${companyName}. All rights reserved.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export default authEmailTemplate;

/*
const authEmailTemplate = ({
  type,
  recipientName,
  companyName,
  actionURL,
  otp,
  email,
}) => {
  let actionContent;

  if (type === 'otp') {
    actionContent = `
      <tr>
        <td style="padding: 20px; font-size: 16px; line-height: 24px;">
          <p style="margin: 0;">For security purposes, please verify your identity by providing the following One-Time Password (OTP).</p>
          <h2 style="margin: 20px 0; background: linear-gradient(to right, #00bc69, #00bca8); color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 4px;">${otp}</h2>
          <p style="margin: 0;"><strong>One-Time Password (OTP) is valid for 10 minutes.</strong></p>
        </td>
      </tr>
    `;
  } else if (type === 'reset') {
    actionContent = `
      <tr>
        <td style="padding: 20px; font-size: 16px; line-height: 24px;">
          <p style="margin: 0;">We received a request to reset your ${companyName} account password. Please click the button below to reset your password:</p>
          <a href="${actionURL}" style="display: block; margin: 20px 0; background: linear-gradient(to right, #00bc69, #00bca8); color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 4px; text-decoration: none;">Reset Password</a>
          <p style="margin: 0;"><strong>This link is valid for 1 hour.</strong></p>
        </td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${companyName} Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            background-color: #f4f6f8 !important;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .header {
            border-bottom: 2px solid #00bca8;
            padding-bottom: 10px;
            margin-bottom: 18px;
            text-align: center;
          }
          .header a {
            font-size: 1.5em;
            color: #00bca8;
            text-decoration: none;
            font-weight: 700;
          }
          .footer {
            text-align: center;
            color: #aaa;
            font-size: 0.9em;
            margin-top: 20px;
          }
          .email-info {
            color: #666666;
            font-weight: 400;
            font-size: 0.9em;
            line-height: 1.4;
            margin-top: 20px;
            text-align: center;
          }
          .email-info a {
            text-decoration: none;
            color: #00bc69;
          }
          @media only screen and (max-width: 600px) {
            .container {
              padding: 10px;
              border-radius: 0;
              box-shadow: none;
            }
            .header a {
              font-size: 1.2em;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f4f6f8 !important;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8">
          <tr>
            <td>
              <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" align="center" style="margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 6px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); box-sizing: border-box;">
                <tr class="header" style="border-bottom: 2px solid #00bca8; padding-bottom: 10px; text-align: center;">
                  <td>
                    <div class="header">
                      <a href="#" style="font-size: 1.5em; color: #00bca8; text-decoration: none; font-weight: 700;">${type === 'otp' ? 'Prove Your Identity' : 'Reset Your Password'}</a>
                    </div>
                  </td>
                </tr>
                <tr class="content" style="padding: 20px; line-height: 1.6;">
                  <td>
                    <p style="margin: 0 0 10px; color: #333;">Dear ${recipientName},</p>
                    ${actionContent}
                    <p style="margin: 0 0 10px; color: #333;">If you did not request this, please ignore this message. Please ensure the confidentiality of your ${type === 'otp' ? 'OTP' : 'reset link'} and do not share it with anyone.</p>
                    <p style="margin: 0 0 10px; color: #333;">Thank you for using ${companyName}.</p>
                    <p style="margin: 0 0 10px; color: #333;">Best regards,</p>
                    <p style="margin: 0 0 10px; color: #333;"><strong>${companyName} Team</strong></p>
                  </td>
                </tr>
                <tr class="footer" style="text-align: center; color: #aaa; font-size: 0.9em; margin-top: 20px;">
                  <td>
                    <hr style="border: none; border-top: 0.5px solid #e1e1e1" />
                    <p style="margin: 0 0 10px;">This email can't receive replies.</p>
                    <p style="margin: 0 0 10px;">For more information about ${companyName.toLowerCase()} and your account, visit <strong><a href="/" style="text-decoration: none; color: #00bc69;">${companyName}.com</a></strong></p>
                  </td>
                </tr>
                <tr class="email-info" style="color: #666666; font-weight: 400; font-size: 0.9em; line-height: 1.4; margin-top: 20px; text-align: center;">
                  <td>
                    <span style="margin: 0 0 10px;">This email was sent to <a href="mailto:${email}" style="text-decoration: none; color: #00bc69;">${email}</a></span>
                    <div style="margin: 0 0 10px;"><a href="/" style="text-decoration: none; color: #00bc69;">${companyName}</a> | 22, Ita-Agemo Ward 12, Igbehin, Abeokuta, Igbehin, Ogun State, Nigeria.</div>
                    <div style="margin: 0 0 10px;">&copy; 2024 ${companyName}. All rights reserved.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export default authEmailTemplate;
 */
