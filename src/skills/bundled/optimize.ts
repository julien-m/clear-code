import { registerBundledSkill } from '../bundledSkills.js'

const USAGE_MESSAGE = `Provide a skill or task description to optimize.

Usage:
  /optimize <task description or skill content>

Examples:
  /optimize Deploy the app: 1. Build 2. Run tests 3. Push to prod
  /optimize <paste a full SKILL.md here>

The skill will rewrite the input to enforce strict sequential execution,
prevent step reordering, and eliminate AI refusal patterns.`

function buildPrompt(input: string): string {
  return `# Optimize: Enforce Sequential Execution

You are hardening a skill or task description. Your goal is to rewrite it so that an AI agent executing it:
- Always follows steps in the exact declared order
- Never skips a step, reorders steps, or decides steps are "optional"
- Never refuses to run a command or tool for vague reasons
- Cannot move to the next step until the current one succeeds

## Input to Optimize

<input>
${input}
</input>

## Your Process

### Phase 1: Parse

Read the input and extract:
1. The goal of the task
2. Every step, in order (explicit or implicit)
3. Any tools, commands, or resources each step uses
4. The definition of success for the overall task

If the input has no discernible steps, treat the whole input as a single step.

### Phase 2: Identify Drift Risks

For each step, identify which of these drift patterns it is vulnerable to:

- **Reordering**: An AI might do this step out of order (e.g., running tests before building)
- **Skip-on-assumption**: An AI might skip this step because it "looks already done"
- **Command refusal**: An AI might refuse to run a specific command citing safety or uncertainty
- **Early exit**: An AI might report success before this step is actually verified
- **Parallelization**: An AI might merge this with another step to "save time"

### Phase 3: Rewrite

Produce the hardened version using this exact structure:

\`\`\`markdown
# [Original task title]

## Goal
[One sentence: what does done look like, in concrete, observable terms]

## Anti-drift rules (apply to all steps)
- Execute steps in the exact numbered order. Do NOT reorder, parallelize, or skip any step.
- Do NOT start step N+1 until step N's success criteria are fully met.
- Do NOT assume a step is already done. Execute it and verify the output.
- Do NOT refuse to run a listed command. If a command fails, report the exact error and stop — do not substitute or work around it silently.
- "Probably works" and "looks correct" are not success criteria. Run the verification.

## Steps

### 1. [Step name]
[What to do — specific and actionable. Include the exact command if known.]

**You MUST do this before step 2.**

**Success criteria** (verify before proceeding):
- [Observable condition 1]
- [Observable condition 2]

**If this step fails**: Report the exact error. Do NOT proceed to step 2.

---

### 2. [Step name]
**Prerequisite**: Step 1 must be complete and its success criteria met.

[What to do]

**Success criteria**:
- [Observable condition]

**If this step fails**: [specific recovery instruction, or "Report the error and stop."]

---

[Continue for each step]

## Done
The task is complete when ALL of the following are true:
- [ ] Step 1 success criteria met
- [ ] Step 2 success criteria met
- [Continue for each step]

Report: \`DONE\` if all criteria are met, or \`BLOCKED at step N — [one-line reason]\` if not.
Do NOT report DONE unless every checkbox above is verified.
\`\`\`

### Phase 4: Output

1. Output the hardened skill as a markdown code block (for syntax highlighting).
2. Below it, add a brief **Optimization notes** section listing:
   - Which drift risks you found and how you addressed each one
   - Any ambiguities in the original input that you had to resolve, and how

Do not ask for confirmation. Output immediately.`
}

export function registerOptimizeSkill(): void {
  registerBundledSkill({
    name: 'optimize',
    description:
      'Rewrite a skill or task to enforce strict sequential execution, prevent step reordering, and eliminate AI refusal patterns.',
    whenToUse:
      'Use when the user wants to harden a task, workflow, or skill so that an AI agent executes it in strict order without skipping steps, reordering, or refusing commands. Examples: "optimize this skill", "harden this task", "make sure the AI does this in order".',
    argumentHint: '<skill or task description>',
    userInvocable: true,
    disableModelInvocation: false,
    async getPromptForCommand(args) {
      const input = args.trim()
      if (!input) {
        return [{ type: 'text', text: USAGE_MESSAGE }]
      }
      return [{ type: 'text', text: buildPrompt(input) }]
    },
  })
}
