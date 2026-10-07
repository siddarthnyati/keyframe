# Keyframe

A trailer in, a launch art set out, with the spec checks built in.

Built as a working sketch for a conversation with Prime Video's Global Marketing Tooling team. It is a small internal tool for the marketer who has to turn one approved trailer into the artwork a title launch needs, in every size and language, without a design queue and without finding out at upload time that something fails spec.

## The three screens

1. **Shortlist.** Drop a trailer. The browser samples a frame every 1.5 seconds, scores focus and exposure locally, folds near-duplicates, then sends the top 24 to Claude for a designer's read: faces, mood, theme tags from the service's own variant taxonomy, burned-in text, and one plain sentence on why. The timeline shows where the strong frames live. Star three.
2. **Variants.** Each starred frame becomes a poster (2:3), cover (16:9), hero (16:9, text-free) and social (1:1) render, per language-locale. Every render carries the spec checks: title legible at the smallest carousel size, tagline inside the safe area, hero text-free, badge colour. Flip the "Title on hero" switch to see a rule fail. Export the set as a ZIP with a manifest.
3. **Audiences.** Three cohorts, including a new member who arrived through a telecom partner with only coarse, consented signals. The app shows which variant each cohort would see, plays a seeded bandit forward over 14 days, and reports the two numbers a marketer never gets back today: who clicked, and who kept watching.

## What it deliberately does not do

- No generative art. Only frames from the source footage, so there is nothing to clear with talent or legal.
- No paid-media optimisation. A different organisation owns that.
- No auto-approval. Export is a human action.
- No territory overrides. Variants are keyed to language-locale.

## Run it

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Without a key the Shortlist still runs with placeholder tags, so the rest of the flow can be demonstrated.

Sample footage is the Sintel trailer, Blender Foundation, CC BY 3.0. The service badge, the cohort signals and the performance numbers are illustrative.
