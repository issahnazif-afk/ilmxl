# IlmXL accounts server (Google Apps Script)

IlmXL's accounts and saved progress live in a Google Sheet that you own, served by this script. It is set up the
same way as Ta'aleem's class server, but is a separate sheet and script.

Until it is connected, the website still works: accounts and progress are kept on each device only, and the
sign-in page says so.

## Set up (about 10 minutes, once)

1. In Google Drive, create a new Google Sheet named **IlmXL accounts**.
2. **Extensions → Apps Script**. Delete what is there, paste the whole of `Code.gs`, and save.
3. Choose the function **setup** in the toolbar and press **Run**. Allow access when Google asks.
   This adds the **Accounts** and **Progress** tabs.
4. **Deploy → New deployment →** type **Web app**. *Execute as:* **Me**. *Who has access:* **Anyone**. Deploy and
   copy the **Web app URL** (it ends in `/exec`).
5. In GitHub, open **issahnazif-afk/ilmxl → Settings → Secrets and variables → Actions → Variables → New repository
   variable**. Name: `ILMXL_SERVER_URL`. Value: the Web app URL.
6. **Actions → Build and deploy → Run workflow**. When it finishes, sign-ups are saved to the sheet.

## Day to day

- **Accounts** tab: one row per account (parent or guardian, student 13+, or teacher). Password hashes are in hidden
  columns; the password itself is never stored.
- **Reset a password:** type a temporary password in the yellow **Reset password** column and tell the person.
  They sign in with it once; it becomes their password and the cell clears.
- **Progress** tab: one row per learner. Deleting a row deletes that learner's saved progress.
- After changing `Code.gs`, use **Deploy → Manage deployments → Edit → Version: New version** so the URL stays the same.

## Privacy

Children do not create accounts: a parent, guardian or teacher does, and adds the children as learners. Learners
are stored by first name and grade only. No email address is collected.
