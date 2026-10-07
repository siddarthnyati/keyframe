# Keyframe — PR/FAQ

For Kyle Reilly-Johnston, Head of Marketing Technology & Enablement, Prime Video, and the Global Marketing Tooling team.
Sid Nyati, candidate for Product Manager, Prime Video Marketing AI, Automation & Tooling (job 10569110). 7 October 2026.

A draft in Amazon's Working Backwards format. Keyframe does not exist inside Amazon; a prototype does, described in the README beside this file. Quotes are illustrative constructions and nothing is attributed to anyone at Amazon. Tags: `[OBSERVED: source]` public document I read · `[REPORTED: who]` secondhand or vendor-published · `[ASSUMED]` my inference · `[UNKNOWN]` could not find out · `[NEEDS EVIDENCE]` a number I do not have and did not invent.

---

## Press release

### Keyframe: one approved trailer in, a spec-compliant launch art set out, in every language-locale

*Prime Video marketing and localization producers can turn an approved trailer into poster, cover, hero and social artwork for 30 or more language-locales, see every spec failure before upload, and learn which variant customers chose.*

**Culver City, Calif.** — [launch date] — Prime Video's Global Marketing Tooling team today released Keyframe, an internal tool for the producers who prepare a title's artwork for launch. Keyframe shortlists the strongest frames from an approved trailer, renders the four in-app art formats per language-locale with the Slate artwork rules checked on every render, and reports back which variant each customer cohort saw, whether they clicked, and whether they kept watching. A producer finds out about a spec failure at the desk, not at upload, and for the first time learns whether the art they shipped worked.

**The problem.** A Central Marketing Localization producer versions key art for one title across 37 or more languages and 240 or more territories through artwork adaptation houses, keeps a production asset tracker by hand, and troubleshoots creative and technical rejections after they happen `[OBSERVED: Amazon CML producer postings]`. One title needs roughly 450 to 750 in-app art files before any social cut exists: five art types, three to five variants, 30 or more locales `[ASSUMED: arithmetic from the Slate format list and the variant programme; no internal count]`. The rules keep tightening: a 2:3 poster is mandatory and non-compliant titles have been filtered from mobile carousels since 30 January 2026; hero art must be text-free; title treatments must stay legible on small devices; and since January 2026 artwork is keyed to language-locale, not territory overrides `[OBSERVED: Video Central Slate supply-chain updates, July and December 2025]`. A failure surfaces at upload, in Asset Quick View, after the vendor round is paid for `[REPORTED: research brief, 7 Oct 2026; the exact rejection point is a question for GMT]`. Prime Video already serves personalized artwork variants keyed to themes such as romance, action or a named talent `[OBSERVED: Video Central, personalized artwork delivery variants; arXiv 2205.04528]`, but I found no public evidence that the producer who delivered a variant ever learns which one won `[UNKNOWN]`. What this costs per title today in hours, rejections and revision rounds: `[NEEDS EVIDENCE: baseline from GMT and CML trackers]`.

**What the producer does now.** Three screens, one title launch.

*Shortlist.* Drop the approved trailer. The browser samples a frame every 1.5 seconds, scores focus and exposure locally, folds near-duplicates, and sends the top 24 to a vision model for a designer's read: faces, mood, theme tags from the service's own variant taxonomy, burned-in text, and one sentence on why. The producer stars three. The tool proposes; the producer decides.

*Variants.* Each starred frame becomes a 2:3 poster, a 16:9 cover with title treatment, a 16:9 text-free hero and a 1:1 social, per language-locale. Every render carries the spec checks: title legible at the smallest carousel size, tagline inside the safe area, hero text-free, badge colour. A failing cell goes red before anything leaves the tool. The producer swaps one slot, not the set, and exports a ZIP with a manifest carrying theme tags, locale and variant id.

*Audiences.* Three cohorts side by side, including a member who arrived through a telecom partner with only coarse, consented signals. The screen shows which variant each cohort would see, holds back an explore slice, and returns the two numbers a producer never gets today: who clicked, and who was still watching at two minutes. A "clicked but bailed" flag catches art that misleads.

**What they use today.** Adaptation vendors, hand-kept trackers, and tools producers assemble themselves. Sports marketing runs on Airtable plus internal tools and scripts `[OBSERVED: Prime Video sports-marketing posting]`; I infer the wider estate is similarly mixed `[ASSUMED]`. Finished assets live in Iconik, tagged by a Bedrock, Nova and Rekognition pipeline `[OBSERVED: AWS Media blog]`. An internal AI artwork tool exists and a Bangalore Creative Specialist, Artwork team corrects its output `[OBSERVED: Amazon posting]`. What falls short is not generation. None of these tells the producer, before upload, that a render fails a rule, and none returns performance to the person who made the variant.

> "I used to find out a hero had text on it when the upload bounced, and by then the adaptation house had billed the round. Now the cell goes red before I export, and two weeks after launch I can see the romance variant beat the action one in Brazil."
> — Localization producer, CML `[illustrative construction, not a real statement]`

> "Generation is not the gap. Adobe, Canva and Amazon Ads' Creative Agent already generate. The gap for a streaming marketer is selection, versioning and QC of title-specific truth: approved art, localized title treatments, the Slate rules, and knowing which variant worked. We built Keyframe to close that loop, and we kept a human on every export."
> — Product Manager, Global Marketing Tooling `[illustrative construction; the candidate's thesis, not an Amazon statement]`

**Getting started.** Open Keyframe, drop the trailer or pick the sample title, star three frames. The art set, the badges and the ZIP follow `[ASSUMED: minutes on the 90-second sample; not measured at trailer length]`.

**How we will know.** Hours from "art approved" to "all locales spec-compliant"; rejections per title at upload; revision rounds per localized asset; share of variants with performance feedback returned to the marketer. All four need a baseline first `[NEEDS EVIDENCE]`.

---

## FAQ

Tags: `ANSWERED` (known, with provenance) · `OPEN` (needs an answer) · `BLOCKER` (a named role must answer before work proceeds).

**EFAQ-01 · Who is it for, and not for? · ANSWERED.** The marketing or localization producer with approved art and a trailer who must deliver the in-app set across formats and locales. Not designers making key art from scratch, not paid-media buyers. Source: PR subheading.

**EFAQ-02 · Why not generate art? · ANSWERED.** Every frame comes from footage already cleared for the title, so there is nothing new to clear with talent or legal. And generation is where the market already is: Adobe, Canva and Amazon Ads' Creative Agent all generate, and Prime Video's own AI artwork tool already needs a human QC team behind it `[OBSERVED: vendor announcements; Bangalore posting]`. The unfilled gap is selection, versioning and QC. Source: PR spokesperson quote.

**EFAQ-03 · What does the producer stop doing? · ANSWERED, baseline open.** Manual resizing into four formats, re-versioning the same slot per locale, and learning about rule failures at upload. Vendor case studies say a two-day delivery stretched to ten with resizing and versioning, and 15 proof rounds per project `[REPORTED: Celtra, Lytho; directional]`. Prime Video's own numbers: `[NEEDS EVIDENCE]`. Source: PR problem paragraph.

**EFAQ-04 · What stays human? · ANSWERED.** Every star, slot swap, export and approval. Keyframe never uploads to Slate and never approves. Badges advise; they do not gate. Source: README, "What it deliberately does not do".

**IFAQ-01 · How is quality measured? · OPEN.** Theme tags are checked against a hand-labelled frame set `[NEEDS EVIDENCE: agreement rate; the set is planned, the number not yet produced]`. Spec checks are pure functions over the rendered cell, so they are tested by construction: flip "Title on hero" and the check fails every time. In production: defects caught in Keyframe over defects caught at vendor QC or upload, which needs the rejection log. → Ask: GMT data owner.

**IFAQ-02 · What is the first metric, and is there a baseline? · BLOCKER.** Hours from "art approved" to "all locales spec-compliant", then rejections per title at upload. I hold neither baseline and do not know whether it exists in one place. If it is spread across trackers, week one is assembling it by hand for ten recent titles. → BLK-01 · DATA · high · Owner: GMT PM with CML production leads · Status: OPEN · Blocks any improvement claim.

**IFAQ-03 · What exists already, and who owns it? · BLOCKER.** Confirmed: Iconik with an AWS tagging pipeline; an internal AI artwork tool with human QC; a variant selection system `[OBSERVED: AWS blog; postings; arXiv 2205.04528]`. Inferred: Airtable and internal trackers hold production truth `[ASSUMED: from a sports-marketing posting; correct me]`. Shortlist should consume the existing tagging pipeline, not replace it. Audiences needs a per-variant performance feed another team owns and may not expose to marketing. → BLK-02 · DEPENDENCY · medium · Owner: personalization or artwork-serving lead · Status: OPEN · Blocks Audiences beyond a simulation.

**IFAQ-04 · Legal and privacy? · OPEN.** Rights ride on the trailer's existing clearance `[ASSUMED: confirm that a still from a cleared trailer inherits it]`. Audiences only works if cohort signals are consented for marketing use; in the prototype they are illustrative. → Ask: privacy counsel.

**IFAQ-05 · What is deliberately out? · ANSWERED.** Generative art (clearance risk, commoditized). Paid-media optimisation (Mixed Media Engineering owns it `[OBSERVED: posting]`). Auto-approval. Territory overrides (language-locale has been the model since January 2026 `[OBSERVED: Slate update]`).

**IFAQ-06 · Why would producers adopt it? · OPEN.** Only if it sits in the path they already walk: trailer in, Slate-ready ZIP out, manifest in the DAM's shape. One more tool beside the tracker will not be used. → Ask: CML production leads, by direct observation.

**IFAQ-07 · What would I learn in week one? · ANSWERED.** Which trackers hold the truth for a launch and how many; where rejections surface and how late; whether anyone returns variant performance to producers; whether the first metric's baseline exists or must be built. The prototype starts those conversations; it is not a proposal to ship as is.

**Open questions for the GMT team.** Five I would ask before changing a line of the prototype:
1. What share of tooling requests are some form of "one more size or one more language"?
2. Where do artwork rejections surface today, and how late? Is Asset Quick View the first place a producer sees one?
3. Does the producer who delivered a variant ever learn which one won, and who holds that data?
4. How many trackers does a single title launch live in?
5. What did the Disney+ AI upskilling programme teach you about adoption that a tool alone cannot fix?

---

*Critic pass, structural dimensions: customer specificity, evidence presence, alternative named, traceability, clarity, completeness all PASS; every missing number is left visible as `[NEEDS EVIDENCE]` rather than invented. Strategic fit and falsifiability are not evaluable from the document; they are the five questions above.*
