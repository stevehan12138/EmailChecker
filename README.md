# Email Checker

This bot binds an organization email to a user. The bot will send a verification code to emails with special organization domains. The bot uses:

 - Discord.js
 - Firebase to store userdata

## Installing Procedure

First, set the following environment keys:

 - DISCORD_TOKEN
 - FIREBASE_API_KEY
 - FIREBASE_AUTH_DOMAIN
 - FIREBASE_PROJECT_ID
 - FIREBASE_STORAGE_BUCKET
 - FIREBASE_MESSAGING_SENDER_ID
 - FIREBASE_APP_ID
 - SMTP_HOST
 - SMTP_PASS
 - SMTP_PORT
 - SMTP_USER

Then, clone the application to your server and set the entry point to src/bot.ts.

## Usage
After joining the server, the user should be prompted to verify their email with specified domain through /start {email}. After verifying, the user will be granted the verified role. The admin can decide what access the verified role give.

#### /help
Get a list of commands

#### /start {email}
Get a verfication code to be sent to an email address with specific domains

#### /verify {code}
Verify the email address with the verification code

### Mod Only Commands

#### /info {@user}
Return the email registered with the user.

#### /unverify {@user}
Unverifies the user and removes the verified role

#### /setdomain {domain}
Set the allowed domain to verify. For example, /setdomain uni.edu will allow all the email address ends with @uni.edu. 

#### /alloweddomains
Return a list of allowed domains

#### /removedomain {domain}
Remove a domain from the allowed domains
