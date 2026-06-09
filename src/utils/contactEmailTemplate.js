const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const formatMessageHtml = (message) =>
  escapeHtml(message).replace(/\n/g, '<br>')

const fieldRow = (label, value, { href } = {}) => {
  const valueCell = href
    ? `<a href="${href}" style="color:#e8c87a;text-decoration:underline;text-underline-offset:3px;">${value}</a>`
    : value

  return `
    <tr>
      <td style="padding:0 0 1.25rem;">
        <p style="margin:0 0 0.4rem;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.45);">
          ${label}
        </p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700;line-height:1.35;letter-spacing:-0.01em;color:#ffffff;">
          ${valueCell}
        </p>
      </td>
    </tr>`
}

/**
 * Builds plain-text and HTML bodies for portfolio contact form emails.
 */
export function buildContactEmail({ name, email, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = formatMessageHtml(message)
  const mailto = `mailto:${encodeURIComponent(email)}`

  const text = [
    'PORTFOLIO CONTACT',
    '—'.repeat(40),
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
    '',
    '—',
    'Boxcar von productions — Myth Anthropix',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Portfolio contact from ${safeName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
          <tr>
            <td style="height:3px;background-color:#c9a84c;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color:#0e0e0e;border:1px solid rgba(255,255,255,0.1);border-top:none;padding:32px 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0 0 10px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.45);">
                      Get in touch
                    </p>
                    <h1 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:800;line-height:1.05;letter-spacing:-0.02em;color:#ffffff;">
                      New message
                    </h1>
                    <p style="margin:12px 0 0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.65;letter-spacing:0.04em;color:rgba(255,255,255,0.58);">
                      Someone reached out through your portfolio contact form.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
                ${fieldRow('Name', safeName)}
                ${fieldRow('Email', safeEmail, { href: mailto })}
                <tr>
                  <td style="padding:0 0 1.5rem;">
                    <p style="margin:0 0 0.4rem;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.45);">
                      Message
                    </p>
                    <div style="padding:16px 18px;background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:2px;">
                      <p style="margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.88);">
                        ${safeMessage}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:4px;">
                    <a href="${mailto}" style="display:inline-block;padding:11px 22px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;color:#0a0a0a;background-color:#c9a84c;border-radius:2px;">
                      Reply to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 8px 0;">
              <p style="margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);">
                Boxcar von productions &mdash; <span style="color:#c9a84c;">Myth Anthropix</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { text, html }
}
