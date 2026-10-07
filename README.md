# Launch Desk

The producer's desk for a title launch. One place to see what is ready, what is late, and what to send.

Built as a working sketch for a conversation with Prime Video's Global Marketing Tooling team. It is the tool a marketing or localization producer would open on Monday morning. Every screen starts with one sentence that says what it is for. All data is seeded, so it reads without clicking anything and without a login.

## The six screens

1. **Today.** One sentence per launch: "Sintel launches in 8 markets in 9 days. Not ready. 3 things are blocking it." Then the blockers, the new requests since Friday, and the slate.
2. **Requests.** The intake queue: asset requests, localization, spec rejections, placements, briefs, data pulls, budget. Each one is read once, linked to the launch board, and given a suggested owner and a reason. The producer confirms or changes it.
3. **Briefs.** The creative brief every vendor works from, beside what fans are saying about the title this week, so the brief is written from evidence. The signals are illustrative; in production they come from the listening feed.
4. **Launch board.** Markets by deliverables: key art set, trailer, dubbed trailer, subtitles, social cuts, CRM email. Each cell has an owner, a due date and a state. Spec checks run on receipt, so a rejection shows up on the day, not at upload. This is the sheet producers keep by hand today.
5. **Markets.** A world map of where campaigns are live, launching or blocked. Click a market for what each title still owes there.
6. **Updates.** The Monday status and the vendor chase email, drafted from the board state, edited and sent by the producer. Nothing sends itself.

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

Titles are Blender Foundation open movies (CC BY). Every vendor, person, number and signal is invented for the demo. Nothing here is Amazon data.
