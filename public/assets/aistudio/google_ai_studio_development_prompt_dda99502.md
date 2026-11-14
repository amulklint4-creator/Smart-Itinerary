# Google AI Studio Prompt — Full-Stack App & Grounding Logic

Copy and paste the prompt below into **Google AI Studio** (Build / App Architect mode) to generate the functional application with real Gemini multimodal capabilities, Google Maps grounding, and Google Search grounding.

***

**Prompt:**

Build a full-stack React web application called **KinCompass**, an AI-powered Family-First Smart Itinerary & Logistics Visualizer. 

### Core Architectural Mandate: ZERO HALLUCINATIONS
You **MUST** enable and strictly enforce **Google Search Grounding** and **Google Maps Grounding** tools for all itinerary generation. 
* Never invent restaurants, museums, parks, transit times, or opening hours.
* Every single activity in the generated JSON/UI must come from a real place verified via Google Maps/Search grounding, including its real address, verified operating hours for the requested day of the week, and accessibility details.
* If a venue's accessibility or stroller-friendliness cannot be verified, explicitly label it `"Verify on arrival"` rather than guessing.

### Functional Requirements & User Flow

#### 1. Family Profile & Constraint Engine
* Allow users to enter a **Destination**, **Trip Dates**, and build a **Family Roster**.
* Each family member entry includes: `Name`, `Age Group` (Infant 0-2, Toddler 3-4, Child 5-12, Teen 13-17, Adult 18-59, Senior 60+), `Mobility/Care Needs` (e.g., Stroller-friendly, Step-free/No stairs, Midday nap required, Frequent seating), and `Interests`.
* Include a **Trip Pace** selector (`Relaxed`, `Balanced`, `Active`).

#### 2. Multimodal "Family Huddle" Voice Input (Gemini Audio)
* Implement an in-browser audio recorder (using `MediaRecorder` API) plus a text fallback.
* Send the recorded audio blob directly to **Gemini (`gemini-2.5-flash`)** to transcribe the multi-person conversation, identify conflicting family preferences, and extract structured constraints (e.g., `must_include`, `avoid`, `dietary_needs`, `energy_notes`) that automatically populate the family trip parameters.

#### 3. Age-Adapted Itinerary Synthesis (Gemini + Maps & Search Grounding)
* When the user clicks **"Generate Family Itinerary"**, call Gemini with **Google Maps Grounding** and **Google Search Grounding** enabled.
* **Scheduling Rules enforced by the System Prompt:**
  1. **Logistics Realism:** Calculate real transit/walking buffers between consecutive stops using Maps data. Never schedule back-to-back activities across town.
  2. **Care Windows:** If a Toddler/Infant is present, automatically block a 90-minute midday nap/quiet window near the hotel or a peaceful park/café. If a Senior is present, cap continuous walking segments and prioritize step-free venues.
  3. **Inclusive Balancing ("No One Left Out"):** Tag every stop with `best_for: [Member Names]` and `logistics_note` (e.g., *"Stroller ramp at East entrance; shaded benches for Grandpa"*). Ensure every family member has at least one primary interest highlighted per day.
  4. **Grounding Citations:** Display clickable Google Maps links and Search verification badges on every itinerary card.

#### 4. Dynamic "Real-Time Pivot" Engine
* Add three quick-action re-planning buttons on the active itinerary:
  * **"Sudden Rain"** (swaps outdoor stops for nearby verified indoor alternatives)
  * **"Low Energy / Meltdown"** (compresses the schedule, finds the closest verified kid-friendly café or quiet rest spot)
  * **"Swap Activity"** (regenerates a single time block while keeping surrounding transit logistics intact)
* Each pivot executes a targeted grounded Gemini call using the current stop's real geographic location to find immediate, open alternatives.

#### 5. "Nano Banana" Visual Adventure Preview (Gemini Image Generation)
* Add a **"Generate Kids' Adventure Card"** button on each day's itinerary.
* Use Gemini's image generation capability (`imagen-3.0-generate-002` or Gemini native image output) to create a whimsical, illustrated map/storybook visual summarizing that day's specific stops (e.g., *"A colorful, kid-friendly illustrated treasure map showing a morning train ride, an aquarium with sea turtles, and an ice cream cone, flat vector storybook style"*).

### UI & Code Quality Standards
* Build a clean, responsive dashboard using React, Tailwind CSS, and `lucide-react` icons.
* Display a **Split View**: Left side for the interactive, expandable day-by-day timeline with member tags, care buffers, and verification badges; Right side for a visual route overview, daily logistics summary (total walking time, family harmony balance), and the Kids' Adventure Card generator.
* Handle loading states gracefully with informative progress indicators (e.g., *"Checking live opening hours via Google Search..."*, *"Verifying stroller & step-free routes via Google Maps..."*).