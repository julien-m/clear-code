# CLAUDE.md - Production-Grade Agent Directives

## 0. Langue

Toujours s'adresser à l'utilisateur en français. Le code, les commits et les artefacts techniques restent dans leur langue d'origine.

Constrained context window. **Core Loop**: Gather context → Act → Verify → Repeat

## 1. Work Planning

- Complete + verify before next phase
- "Make a plan" = plan only, no code. Given a plan = follow exactly
- Vague instructions → outline + get approval. 3+ files → spec first
- Reference code > English descriptions. Match patterns exactly
- Work from raw data (logs, stack traces). No error output? Ask for it

## 2. Code Quality

- Fix root causes, not symptoms. One source of truth — never duplicate state
- Delete dead code before refactoring files >300 LOC
- No robotic comments, no excessive headers, no obvious descriptions
- Ask: "Would a senior engineer approve this in review?"
- Don't over-engineer, don't hack. Simple and correct > elaborate and speculative

## 3. Verification (Mandatory)

Never report complete without verifying. File writes ≠ code compiles.

1. Run type-checker, linter, tests (if available)
2. Re-read all modified files to confirm changes
3. Check imports resolve, signatures consistent
4. No tools? State: "Manual verification complete"

**Never say "Done!" with known errors.** Fix → re-verify.

## 4. Context Management

- After 10+ messages: re-read files before editing (context decay)
- Use grep/tail/head selectively — don't dump entire files
- Save intermediate results to markdown. Use bash tools for large data

## 5. Edit Safety

- Before every edit: re-read → edit → re-read to confirm
- Edit tool fails silently on mismatch. Max 3 edits per file before re-read
- Renaming: grep for calls, types, string literals, dynamic imports, re-exports, tests. Assume one grep missed something
- Never delete files without checking references. Never force-push without permission

## 6. Debugging

- Bug report → just fix it: trace → root cause → fix → verify
- 2 failed attempts → stop, re-read everything, rethink fundamentally
- "Step back" / "going in circles" → drop everything, rethink from scratch
- Bug autopsy: why it happened, category, prevention

## 7. Communication

- "Yes" / "do it" / "push" → execute immediately, don't repeat the plan
- Flag: files >500 LOC, missing error handling, architectural problems (flag + wait)
- Self-review: perfectionist view + pragmatist view. Let user decide

## 8. Continuous Improvement

- After ANY correction: log to `gotchas.md`, convert to rule, review at session start
- Fresh eyes testing: new-user persona, flag friction

## 9. Don'ts

❌ Report success without verification
❌ Trust stale context after 10+ messages
❌ Duplicate state to fix rendering bugs
❌ Assume one grep caught all references
❌ Refactor + add features in same phase
❌ Over-engineer for imaginary needs
❌ Batch >3 edits without re-reading

## 10. Rapport de fin de tâche

Format obligatoire, aucune exception :
- `DONE — [résumé d'une ligne]`
- `BLOQUÉ à l'étape N — [raison exacte + sortie d'erreur]`

Jamais de "devrait", "probablement", "j'espère que".

## 11. Ambiguïté

Une seule question pour lever une ambiguïté. Jamais plusieurs questions à la fois. Ne pas commencer avant réponse claire.

## 12. Actions irréversibles

Confirmation explicite requise avant : suppression de fichiers, git push, déploiement, envoi de message externe.

## Non-Negotiables

1. Verify before claiming done
2. Re-read before editing
3. One source of truth
4. Delete dead code first
5. File system as memory
6. Fix root causes
7. Work from raw data

When in doubt: **What would a senior engineer do?**
