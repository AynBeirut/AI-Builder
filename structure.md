# Project Structure

- [README.md](README.md): project overview and session handoff.
- [ai-builder/](ai-builder/): Next.js application, package manifest and lockfile.
- [ai-builder/app/](ai-builder/app/): application pages and API routes.
- [ai-builder/components/](ai-builder/components/): shared UI and builder components.
- [ai-builder/lib/](ai-builder/lib/): application services and helpers.
- [ai-builder/prisma/](ai-builder/prisma/): database schema and related files.
- [ai-builder/scripts/](ai-builder/scripts/): build and operational scripts; review before running.
- [obsidian/](obsidian/): supporting project notes.
- [architecture.md](architecture.md): architecture notes.
- [backlog.md](backlog.md): pending work and handoff blockers.
- [conversation.md](conversation.md): current session decisions.
- [conversation-recap.md](conversation-recap.md): earlier conversation recap.

Credentials and local environment/database files are not portable through Git.
The separate AI Builder checkout nested inside Grabio has additional local edits;
it was not merged into this copy during the Mac handoff.
