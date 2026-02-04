# sequoiataylor.com (Cloudflare Pages)

## Deploy
- Push these files to a GitHub repo.
- Cloudflare Pages:
  - Framework preset: None
  - Build command: (blank)
  - Output dir: /

## Contact form (required)
This uses a Pages Function at `/api/contact` to send email via MailChannels.

Set environment variables in Cloudflare Pages:
- CONTACT_TO = sequoia@westpeek.ventures
- CONTACT_FROM = no-reply@sequoiataylor.com

Then redeploy.

## Update "Last updated"
Open `main.js` and change:
`const LAST_UPDATED = "February 2026";`
