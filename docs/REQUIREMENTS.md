# Launch Desk, requirements

Written as the Global Marketing Tooling product manager for one customer team. Sid Nyati, 7 October 2026.

## 1. The customer

**One team: Title Launch Marketing, Prime Video Originals.** The people who take an original title from an approved campaign to a live launch in every market. GMT's charter is to make "every marketing team we serve feel heard, supported, and equipped." This is the team I would serve first, because every other marketing team's work funnels into a launch, and a launch is where a missed week costs the most.

Two chairs on that team, from Amazon's own postings:

- **The Campaign Manager** owns the campaign. Intake arrives by ticket. They write the creative brief the agencies work from, make sure assets meet each channel's spec, book placements, and send status to the marketing lead. In the prototype this is Dev Okafor, Campaign Manager, Prime Video US Streaming.
- **The Marketing Production Manager** owns delivery. They orchestrate the production lifecycle for the launch, set up localization and trafficking workflows for key art, trailers and promos across territories, manage the vendors, and keep every market on schedule. In the prototype this is Priya Natarajan, Marketing Production Manager, Prime Video International Originals.

Names are invented. The job titles and the duties are quoted from Prime Video postings. Localization producers, asset ops and merchandising are stakeholders the team works with, not users of this tool.

## 2. What I observed

I could not sit with the team, so this is from the job description, Prime Video's own postings, and the Slate partner documentation. Everything here is tagged observed or assumed in the PR/FAQ.

1. **The tracker is kept by hand.** Production postings ask for "production asset trackers"; sports marketing tooling is "Airtable, internal tools, scripts." One launch lives in several sheets. (observed)
2. **Rejections surface late.** Spec rules keep tightening (2:3 poster mandatory, text-free hero, title legibility, language-locale model since January). A failure is discovered at upload, after the vendor round is paid for. (observed rules, assumed timing)
3. **Intake is re-typed.** Requests arrive by ticket, email and chat and are copied into the tracker by the person who received them. (observed: "manage campaign intake through ticketing and other channels")
4. **Status is prose written from a tracker.** The weekly status to stakeholders and the chase to a late vendor are the two most-written emails on the team, and both are assembled from the same sheet. (assumed from the duties)
5. **The brief and the listening report live apart.** Coverage and fan reaction exist, but the brief is written from the last meeting. (assumed)
6. **Nobody has the "where are we" view.** The regional lead asks every week; someone builds a slide. (assumed)

## 3. The job to be done

> "Is this title ready to launch in every market, what is in the way, and what do I need to send today?"

Every requirement below is justified by whether it moves that sentence.

## 4. Requirements, in priority order

| Priority | Requirement | Why, tied to an observation | Role |
|---|---|---|---|
| P0 | **One launch board**: markets by deliverables, with owner, due date and state, for one title. | The hand-kept tracker (1). This is the record everything else reads from. | Priya |
| P0 | **Spec checks on receipt.** A file that arrives is checked against the Slate rules and the cell turns red that day. | Rejections surface late (2). The single highest-cost failure on a launch. | Priya |
| P0 | **Monday view that leads with blockers.** One sentence: ready or not, how many things in the way, each with owner and date. | The job to be done. If the tool only did this it would be used. | Both |
| P0 | **Status and chase drafted from the board.** The two emails, pre-written with real dates and owners; the person edits and sends. Nothing sends itself. | Status is prose written from a tracker (4). The hours are here. | Both |
| P1 | **Intake linked to the board.** A request is read once, tied to a title, market and deliverable, and given a suggested owner with a reason. The campaign manager confirms. | Intake is re-typed (3). | Dev |
| P1 | **Brief beside this week's coverage.** Sourced items, dated, with one line on what to do with each. | Brief and listening live apart (5). | Dev |
| P1 | **Where it runs.** Placements by market on a map, red where a placement is waiting on production. | The "where are we" view (6), and it shows the two chairs share the same blockers. | Dev |
| P2 | Vendor-facing view, budget tracking, performance after launch. | Real needs, other owners. Not in the first release. | |

## 5. What I decided not to build, and why

- **Generative art or frame picking.** Creative owns art; talent and legal clearances make generated art a liability for a tooling team. The producer's problem is delivery, not creation.
- **Paid-media optimisation.** Mixed Media Engineering owns it.
- **Auto-approval or auto-send.** Every approval and every email stays a human action. Adoption on a marketing team depends on trust in the first month; one wrong email sent by a tool ends it.
- **A social listening product.** Coverage is an input to the brief from an existing feed, not a dashboard to maintain.
- **Territory overrides.** The artwork model moved to language-locale in January; the board is keyed to locale from day one.

## 6. Where the model is used

Three places, each replacing a task done by hand: suggesting the owner and link on a request, checking a received file against spec, and drafting the two emails. Nowhere else.

## 7. Success metrics

- Hours per week the team spends compiling status. Baseline from the team in week one.
- Spec rejections caught before upload, as a share of all rejections.
- Days late per market, visible on the day a deliverable goes late rather than at launch.
- Requests re-typed into a tracker. Target zero.

## 8. Data standards

The board needs four shared keys or it cannot be fed by other tools: title id, market as a language-locale (not a territory), deliverable type, and status from a fixed list. The job description asks the PM to help define taxonomy; this is the taxonomy.

## 9. The plan, and what the prototype shows

The prototype is the first release on seeded data: real Prime Video titles and dates, official artwork, real coverage with sources, invented vendors and statuses. The front door names the team and the two chairs. Each chair has a Monday page, the tools it uses, and a guided morning so a reader who is neither Priya nor Dev can follow the value in five stops.

Discovery I would run in week one: sit with one production manager and one campaign manager for a launch week; pull the last ten rejections and find where each surfaced; count the trackers open for one title; time one Monday status from blank to sent.

## 10. Open questions for the team

1. How many trackers does one title launch live in today, and which one is treated as the truth?
2. Where does a spec rejection surface first: at the vendor, at upload, or at Asset Quick View?
3. How long does the Monday status take, and who reads it?
4. What share of requests arrive outside the ticket queue?
5. Which of the four data keys already exists in the stack, and where?
