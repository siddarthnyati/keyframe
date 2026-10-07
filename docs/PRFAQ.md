# Launch Desk — PR/FAQ

For Kyle Reilly-Johnston, Head of Marketing Technology & Enablement, Prime Video, and the Global Marketing Tooling team.
Sid Nyati, candidate for Product Manager, Prime Video Marketing AI, Automation & Tooling (job 10569110). 7 October 2026.

Launch Desk does not exist inside Amazon; a prototype does (see the README). It replaces Keyframe, a creative tool pitched at an operations team; only the spec-check engine survives. Quotes are illustrative; nothing is attributed to anyone at Amazon. Tags: `[OBSERVED: source]` public document I read · `[REPORTED: who]` secondhand · `[ASSUMED]` my inference · `[UNKNOWN]` could not find out · `[NEEDS EVIDENCE]` a number I do not have and did not invent.

---

## Press release

### Launch Desk: is this title ready in every market, what is blocking it, and what do I send

*Prime Video marketing and localization producers see every market's deliverables for a title launch on one board, learn about a spec failure on the day a file arrives, and send a Monday status drafted from the board instead of compiled by hand.*

**Culver City, Calif.** — [launch date] — Prime Video's Global Marketing Tooling team today released Launch Desk, a tool for the producers who run a title launch across markets. It opens on one sentence per launch: "The Terminal List season 2 launches in 12 markets in 14 days. Not ready. 3 things are blocking it." Under it sit the blockers, the new requests and the slate. A producer who used to open four trackers to answer "are we ready?" now reads it in ten seconds.

**The problem.** A Prime Video campaign manager manages intake through ticketing, writes briefs, checks assets against channel specs, traffics them across territories and reports status to stakeholders `[OBSERVED: Prime Video US Streaming and Campaign Operations postings]`. A Central Marketing Localization producer versions one title across 37 or more languages and 240 or more territories through dubbing studios, subtitle vendors and adaptation houses, keeps the asset tracker by hand, and troubleshoots rejections after they happen `[OBSERVED: Amazon CML producer postings]`. Their day is chase, check, route, report. The rules keep tightening: a 2:3 poster is mandatory and non-compliant titles have been filtered from mobile carousels since 30 January 2026; hero art must be text-free; title treatments must stay legible on small devices; and since January 2026 artwork is keyed to language-locale, not territory overrides `[OBSERVED: Video Central Slate supply-chain updates, July and December 2025]`. A failure surfaces at upload, in Asset Quick View, after the vendor round is paid for `[REPORTED: research brief, 7 Oct 2026; the exact rejection point is a question for GMT]`. The cost per launch in hours: `[NEEDS EVIDENCE: baseline from GMT and CML trackers]`.

**What the producer does now.** Six screens, each opening with a sentence that says what it is for.

*Today.* One line per launch, then the blockers with a plain reason, the new requests, and the slate.

*Requests.* The intake queue: asset requests, localization, spec rejections, placements, briefs, data pulls, budget. The model suggests an owner, links the request to the board cell it affects, and gives a reason: "Same cut is in review for the tagline overflow. Fold into one delivery." The producer confirms or changes it. Nothing is re-typed.

*Briefs.* The creative brief every vendor works from, beside what fans are saying about the title this week, so the brief is written from evidence. The signals are illustrative; in production they come from an existing listening feed.

*Launch board.* Rows are markets. Columns are deliverables: key art set, trailer, dubbed trailer, subtitles, social cuts, CRM email. Each cell carries owner, due date and state. Spec checks run on receipt, so "no 2:3 poster in the set" shows on the day, not at upload. This is the sheet producers keep by hand today.

*Markets.* A world map of where campaigns are live, launching or blocked. Click a market for what each title still owes there.

*Updates.* The Monday stakeholder status and the vendor chase email, drafted by the model from the board state, edited and sent by the producer. Nothing sends itself.

**What they use today.** Ticket queues and hand-kept trackers. Sports marketing runs on Airtable plus internal tools and scripts `[OBSERVED: Prime Video sports-marketing posting]`; I infer the wider estate is similar `[ASSUMED]`. Finished assets live in Iconik, tagged by a Bedrock, Nova and Rekognition pipeline `[OBSERVED: AWS Media blog]`; an internal AI artwork tool exists with a Bangalore QC team behind it `[OBSERVED: Amazon posting]`. None answers the Monday question in one place, runs the spec rules on receipt, or drafts the status from state it already holds.

> "Monday used to be two hours reading four trackers to write one email. Now the board writes the first draft and I spend the two hours on the German dub that slipped."
> — Localization producer, CML `[illustrative construction, not a real statement]`

> "The marketer's question is not 'make me art'. It is 'is this title ready, what is blocking it, and what do I send'. We built the desk that answers it, used the model only on toil, and kept a person on every send."
> — Product Manager, Global Marketing Tooling `[illustrative construction; the candidate's thesis, not an Amazon statement]`

**Getting started.** Open Launch Desk. Seeded slate of real Prime Video titles from public announcements, artwork from IMDb, no login; The Terminal List season 2 is 14 days out with 60 of 68 deliverables approved and 3 blocking `[ASSUMED: statuses, vendors and ratio invented; dates and titles observed]`.

**How we will know.** Hours per week a producer spends compiling status. Spec rejections caught before upload. Days late per market, visible the day they go late. Requests re-typed into a tracker, which should go to zero. All four need a baseline `[NEEDS EVIDENCE]`.

---

## FAQ

Tags: `ANSWERED` · `OPEN` · `BLOCKER` (a named role must answer before work proceeds).

**EFAQ-01 · Who is it for, and not for? · ANSWERED.** The production manager or localization producer who owns a title's launch across markets and must say, every week, whether it is ready. Not designers, not the artwork science team, not paid-media buyers.

**EFAQ-02 · Why an operations tool and not a creative one? · ANSWERED.** The posting says the team "sits at the center of Prime Video's marketing operations" and asks where tedious work can be eliminated `[OBSERVED: job 10569110]`. Generation is already covered by Adobe, Canva, Amazon Ads' Creative Agent and Prime Video's own artwork tool `[OBSERVED: vendor announcements; Bangalore posting]`. The gap is intake, readiness, spec QC on receipt and the status email.

**EFAQ-03 · What does the producer stop doing? · ANSWERED.** Reading several trackers to answer one question, re-typing requests from email, learning about a rule failure at upload, writing the Monday status from scratch. Hours saved: `[NEEDS EVIDENCE]`.

**EFAQ-04 · What stays human? · ANSWERED.** Every triage decision, approval and send. The model suggests and drafts; the producer confirms, edits and sends. Spec checks advise; they do not reject. Launch Desk never uploads to Slate and never approves.

**IFAQ-01 · Where is the model used, and how is each use measured? · OPEN.** Three places. Triage suggestions, measured as the share accepted unchanged `[NEEDS EVIDENCE: needs real tickets]`. Spec checks, pure functions tested by construction: remove the 2:3 poster and the check fails every time. The two drafts, measured by edits before send. In production, defects caught on receipt over defects caught at upload, which needs the rejection log. → Ask: GMT data owner.

**IFAQ-02 · What is the first metric, and is there a baseline? · BLOCKER.** Hours per week compiling status, then spec rejections caught before upload. I hold neither. If none exists, week one is timing ten producers through one Monday. → BLK-01 · DATA · high · Owner: GMT PM with CML production leads · Status: OPEN · Blocks any improvement claim.

**IFAQ-03 · What exists already, and what does this depend on? · BLOCKER.** Confirmed: a ticketing channel for intake, Iconik, an internal artwork tool `[OBSERVED: postings; AWS blog]`. Inferred: Airtable and internal trackers hold production truth `[ASSUMED: from a sports-marketing posting; correct me]`. Launch Desk should read from the ticket queue and the DAM, not replace either. The signals panel depends on a listening feed another team owns `[UNKNOWN: whether producers can see it]`. → BLK-02 · DEPENDENCY · medium · Owner: GMT tooling lead · Status: OPEN · Blocks anything beyond seeded data.

**IFAQ-04 · Legal and privacy? · OPEN.** Drafting calls send board state, never assets `[ASSUMED: confirm the endpoint and data terms GMT uses]`. A production signals feed needs its own review. → Ask: privacy counsel.

**IFAQ-05 · What is deliberately out? · ANSWERED.** Generative art. Frame picking and variant choice (artwork science owns it `[OBSERVED: Video Central personalized artwork variants; arXiv 2205.04528]`). Paid-media optimisation (Mixed Media Engineering owns it `[OBSERVED: posting]`). Auto-approval. Auto-send. A social listening product; signals are an input to the brief. Territory overrides `[OBSERVED: language-locale since January 2026, Slate update]`.

**IFAQ-06 · Why would producers adopt it, and what would I learn in week one? · OPEN.** Only if it sits where the truth already is: tickets in, board state out, email in the producer's own voice. The test is whether a producer opens it on Monday instead of the spreadsheet. Week one, with CML production leads, is the five questions below. The prototype starts those conversations; it is not a proposal to ship as is.

**Open questions for the GMT team.** Five I would ask before changing a line of the prototype:
1. How many trackers does a single title launch live in, and who keeps each one current?
2. Where do spec rejections surface, and how late? Is Asset Quick View the first place a producer sees one?
3. How long does the Monday status take to compile, and how much of it is read?
4. What share of requests arrive by email or chat rather than the ticket queue, and get re-typed?
5. What did the Disney+ AI upskilling programme teach you about adoption that a tool alone cannot fix?

---

*Critic pass: customer specificity, evidence, alternative named (Keyframe, retired; an explainer page over it, rejected), traceability, clarity, completeness all PASS. Missing numbers are left as `[NEEDS EVIDENCE]`.*
