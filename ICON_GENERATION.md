# Icon Generation Guide for Coding Agents

This document describes the workflow for generating and iterating on SVG icons
for the Arch architecture diagram builder. Follow these instructions when asked
to create, update, or refine icons.

## Overview

Icons are generated iteratively. Each round produces multiple labeled variations.
The user reviews them in the Icon Studio UI, provides feedback, and you refine
in the next round. The goal is convergence through iteration, not perfection on
the first try.

## Directory Structure

```
assets/icons/
  workspace/           # Active experiments — organized by session
    {session-name}/    # e.g. "load-balancer", "auth-flow"
      {concept}-v1.svg
      {concept}-v2.svg
      ...
  library/             # Published icons — the curated collection
    {icon-name}.svg
```

## SVG Requirements

All generated SVGs must follow these constraints:

- **ViewBox**: `0 0 24 24`
- **Size attributes**: `width="24" height="24"`
- **Stroke-based**: Use `stroke="currentColor"` so icons inherit theme colors
- **Stroke width**: `stroke-width="2"` (standard), vary only with intention
- **Line caps/joins**: `stroke-linecap="round" stroke-linejoin="round"`
- **No fills** unless intentional (e.g., a filled circle as a focal point)
- **No embedded styles, scripts, or external references**
- **Simple geometry**: Prefer lines, circles, rects, paths over complex shapes
- **Legible at 16px**: Icons render small on the canvas — test mental clarity

## Embedded Description (Required)

Every generated SVG **must** include a description comment as the first line
inside the `<svg>` tag. This serves as a validation mechanism — the user reads
the description and compares it to the rendered icon to catch mismatches.

Format:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">
  <!-- description: A globe with horizontal latitude lines and a vertical meridian,
       representing a CDN or global distribution network -->
  <circle cx="12" cy="12" r="10"/>
  ...
</svg>
```

The description should:
- Be 1-2 sentences
- Describe what the icon visually depicts (shapes, layout)
- Explain what concept it represents
- Be specific enough that someone could reconstruct the icon from the description

## Generation Workflow

### New Icon

When the user asks for a new icon:

1. **Check existing library icons** — read the SVGs in `assets/icons/library/`
   to understand the current visual style. Match stroke weight, complexity level,
   and geometric approach.

2. **Create a session folder**:
   ```
   assets/icons/workspace/{concept-name}/
   ```

3. **Generate 4-6 variations**, each exploring a different visual metaphor:
   ```
   {concept}-v1.svg  — literal/obvious interpretation
   {concept}-v2.svg  — more abstract take
   {concept}-v3.svg  — minimal version
   {concept}-v4.svg  — detailed version
   ...
   ```

4. **Present each variation** with its embedded description so the user can
   compare what they see vs. what was intended.

5. **Ask the user** which directions to pursue or what to change.

### Refining an Existing Icon

When the user references an existing icon to update:

1. **Read the current SVG** to understand what exists.
2. **Apply the requested changes** across 3-4 new variations.
3. **Save as new versions** in the same session folder (don't overwrite originals):
   ```
   {concept}-v5.svg
   {concept}-v6.svg
   ```
4. **Present the new variations** alongside the original for comparison.

### Mixing Feedback

The user may reference multiple variations:
> "I like v2's overall shape but v4 is cleaner. Can you combine them?"

When this happens:
1. Read both referenced SVGs.
2. Generate 2-3 new variations that blend the specified qualities.
3. Explain what you took from each source in the description.

## Presenting Results

After generating variations, present them in this format:

```
### v1 — [Short title]
**Description**: [The embedded description text]
**Approach**: [Why you chose this visual metaphor]

### v2 — [Short title]
...
```

Then ask:
> Which direction(s) do you want to explore further? You can also reference
> specific elements across variations (e.g., "v1's shape with v3's weight").

## Publishing

When the user is satisfied with an icon and wants to publish it:

1. Copy the final SVG to `assets/icons/library/{icon-name}.svg`
2. The icon will automatically appear in the toolbar's Library popover
   on the design canvas.

## Style Consistency Checklist

Before presenting variations, verify each icon:

- [ ] Uses `stroke="currentColor"` (no hardcoded colors)
- [ ] Has `stroke-width="2"` unless intentionally varied
- [ ] Includes the `<!-- description: ... -->` comment
- [ ] Is legible as a 16x16 rendering (mentally)
- [ ] Feels like it belongs with the existing library icons
- [ ] Uses simple, recognizable shapes
- [ ] Has appropriate visual weight (not too heavy or too light)

## Example Session

**User**: "I need an icon for a message broker"

**Agent**:
1. Reads existing library icons for style reference
2. Creates `assets/icons/workspace/message-broker/`
3. Generates variations:
   - `message-broker-v1.svg` — envelope with routing arrows
   - `message-broker-v2.svg` — hub-and-spoke with message symbols
   - `message-broker-v3.svg` — pipeline with fan-out
   - `message-broker-v4.svg` — mailbox with queue indicator
4. Presents each with descriptions
5. Waits for feedback

**User**: "v2 is closest but make the hub smaller and the spokes more prominent"

**Agent**:
1. Reads `message-broker-v2.svg`
2. Generates `message-broker-v5.svg`, `message-broker-v6.svg`, `message-broker-v7.svg`
   with the hub reduced and spokes emphasized, each trying a slightly different balance
3. Presents for comparison

**User**: "v6 is perfect, publish it"

**Agent**:
1. Copies `message-broker-v6.svg` to `assets/icons/library/message-broker.svg`
2. Done — icon appears in the canvas toolbar
