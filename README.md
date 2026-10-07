# Launch Desk

The producer's desk for a title launch. One place to see what is ready, what is late, and what to send.

Built as a working sketch for a conversation with Prime Video's Global Marketing Tooling team. It is the tool a marketing or localization producer would open on Monday morning. Every screen starts with one sentence that says what it is for. All data is seeded, so it reads without clicking anything and without a login.

## One team, two chairs

Built for Title Launch Marketing, Prime Video Originals. The front door names the two people on it and you pick one:

- **Priya, Marketing Production Manager.** Start Monday (blockers first), Check the launch (markets by deliverables with spec checks on receipt), Send the update (vendor chase and production status, drafted from the board).
- **Dev, Campaign Manager.** Start Monday (placements on a map, new requests, briefs due), Triage requests (intake linked to the board with a suggested owner), Write the brief (beside this week's sourced coverage), Send the status (to the marketing lead, drafted).

Each chair has a "Follow their morning" tour: five stops, one sentence each, ending on what they used to do by hand. The requirements, priorities and what was deliberately not built are in `docs/REQUIREMENTS.md`.

## Where the model is used, and where it is not

Used in three places: triage suggestions on requests, spec checks on received files, and drafting the two emails. Each removes a task a producer does by hand.

Not used for generating art, picking frames, choosing variants, optimising spend, approving anything, or sending anything.

## In this folder

- `docs/PRFAQ.md`, the press release and FAQ in Amazon's Working Backwards format, every number tagged as observed, reported, assumed or unknown.
- `docs/walkthrough-script.md`, a short voiceover for a screen recording.

## Run it

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Without a key the Updates screen shows the seeded drafts instead of regenerating them.

Titles, launch dates and artwork are real Prime Video titles from public announcements and IMDb, shown to illustrate a prototype for the team; they belong to Amazon MGM Studios and their partners. The "said this week" panel is real public coverage with sources. Vendors, people, tickets, statuses and numbers are invented. Nothing here is Amazon data.
