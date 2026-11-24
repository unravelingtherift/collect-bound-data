# Newsletter

Each update email is one file in this folder, named like `2026-11-23-poro-tab.md`.

1. Claude opens a pull request that adds the file.
2. A **[TEST]** copy lands in your inbox (REPORT_EMAIL) so you can see it first.
3. **Merge the pull request** and the newsletter goes out from updates@unravelingtherift.com
   to the Collection-Bound Updates segment in Resend, under the file's topic.

Close the pull request without merging and nothing is sent.

Only new files are sent when merged, so editing an old file never re-sends it.
Files starting with `_` (like `_example.md`) and this README are never sent.

File layout: `subject:`, `preview:` and `topic:` lines (topic is New Sets & Cards,
New Features or New Videos), then a line with `---`, then the email body.
The no-tracking note, mailing address and Unsubscribe link are added automatically.
