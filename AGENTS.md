# Working on this repo (Claude, Grok and any other agent)

Read `CLAUDE.md` / `README.md` first where present: they hold how this project runs and deploys.

## House rules

1. **Never push to `main`.** Work on a branch named `grok/<short-topic>` or `claude/<short-topic>`
   and open a pull request. Ty (or Claude, at Ty's request) reviews and merges.
2. **Never commit secrets** (API keys, tokens, passwords, `.env*` files).
3. **Deploys are not done from pull requests.** Merging does not deploy; Claude deploys after review.
4. One topic per pull request, with a plain-English summary of what changes.

## Working alongside the other agent (Claude ↔ Grok)

- **Before you start:** `git fetch --prune && git pull`, then look at what changed since you last worked here:
  `git log --oneline -15 origin/main` and the open branches `git branch -r --no-merged origin/main`.
  If the other agent touched the files you're about to change, read their change first and build on it.
- **End of every day:** everything committed and pushed (Grok: your `grok/` branch + pull request).
  Ty's Mac runs a nightly sync at 23:00 WITA (`~/.local/bin/eod-git-sync`): it pulls merged work, pushes
  saved-but-unpushed commits, and backs up unsaved work to `wip/eod-<date>` branches (never `main`).
  `wip/` branches are backups only: don't build on them or merge them.
- **Deploy only from `main`**, so the live site, the VPS and Git always match. Never redeploy from an old local
  copy: in Nov 2026 that silently overwrote a newer change to the SONIC alerts.
