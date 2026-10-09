# Log — <id>

Real timestamps only. The clock starts at "Brief received" and stops at "Handoff written". Setup, the before clips and the post package happen off the clock and say so. Every time is written by Claude Code from the system clock at the moment it happens (`node tools/video/now.mjs`); a missed time comes from a commit or a file's own timestamp, or stays blank — it is never estimated.

| Event | Time (Dhaka) |
|---|---|
| Setup complete (off the clock) | |
| Before clips recorded (off the clock) | |
| Brief received | |
| Questions answered (only if a question went to the project chat) | |
| Plan written | |
| First commit | |
| Staging ready | |
| QA passed | |
| Handoff written | |
| Post package rendered (off the clock) | |
| Audit passed (off the clock) | |
| Published — insight post <URL> (Monday; added on `main` by Yeasir) | |
| Published — video <URL> (Tuesday; added on `main` by Yeasir) | |
| Published — carousel <URL> (Thursday; added on `main` by Yeasir) | |

Recordings (the `media/` copy, `node tools/video/drive.mjs <id>`): `<PERVEJ_DRIVE_DIR>/shopify/<id>/`
