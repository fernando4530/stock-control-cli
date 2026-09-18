# Stock Control CLI Constitution

<!--
Sync Impact Report
- Version change: no previous constitution -> 1.0.0
- Modified principles: scaffold placeholders -> seven mandatory project principles
- Added sections: Technical Constraints; Quality Gates
- Removed sections: none
- Follow-up TODOs: none
-->

## Core Principles

### I. Specification-First Development
Functional behavior MUST be specified before implementation. Specifications, plans and
tasks are the source of truth, and code MUST NOT introduce behavior absent from the
approved specification. Any material change discovered during development MUST update
the corresponding SDD artifacts before implementation continues.

### II. Incremental and Traceable Implementation
Implementation MUST proceed one independently testable user story at a time. Requirements,
acceptance criteria, tasks, source code and tests MUST remain traceable to one another.
SDD artifacts MUST be committed before their corresponding implementation so the intended
behavior is reviewable first.

### III. Data Integrity
Product codes MUST be unique. Stock quantities and minimum stock values MUST be
non-negative integers. Stock exits MUST never produce negative availability. Every
accepted stock entry or exit MUST create a movement record. Product and movement data
MUST persist in external JSON files.

### IV. Testing and Validation
Business rules MUST have automated tests covering successful operations, validation
failures and relevant edge cases. Every increment MUST be validated against its
acceptance criteria. An implementation is complete only when the tests pass and
convergence finds no unresolved critical gaps.

### V. Simplicity and Controlled Scope
The project MUST use Node.js 24 and TypeScript and MUST remain a command-line
application. It MUST NOT add a graphical interface, web server, database, authentication
or cloud dependency. Production dependencies MUST be minimized in favor of Node.js
standard-library capabilities. The architecture MUST be modular but proportional to the
small scope.

### VI. Portability and Packaging
The application MUST work during development on Ubuntu Linux and MUST be compilable into
a Linux executable and a Windows x64 `.exe`. The Windows executable MUST run without
Node.js on the destination computer. Writable JSON files MUST remain external to the
packaged executable, and file paths MUST work consistently on Linux and Windows.

### VII. Agentic AI Governance
The project MUST include one reusable declarative agent following the AS-Transformation
canonical model. The agent MUST perform a real development-lifecycle task and include at
least one skill and supporting resource. Its execution MUST produce reviewable evidence.
AI-generated results MUST be verified before acceptance.

## Technical Constraints

The project purpose is to build a small command-line stock management application as the
final practical exercise for the NTT DATA Agentic AI and Spec-Driven Development learning
path. All persistent product and movement data MUST use external JSON files. The runtime
and source implementation MUST use Node.js 24 and TypeScript, with platform-independent
path handling and no required network service, database or cloud resource.

## Quality Gates

Before implementation begins, the constitution, specification, plan and tasks MUST exist.
Requirements and acceptance criteria MUST be explicit and testable. Automated tests MUST
pass, and no stock operation may result in a negative quantity. JSON persistence MUST
survive application restarts. At least one specification refinement or replanning instance
MUST be documented. The declarative agent MUST be executed on the project and its result
MUST be retained. Linux and Windows packaging evidence MUST be retained. Final delivery
MUST include the executable, JSON data files, source code, SDD artifacts, agent definition,
evidence, README and presentation.

## Governance

This constitution overrides informal implementation preferences. Amendments MUST include
the reason for the change and an impact assessment. Exceptions MUST be documented
explicitly rather than implemented silently.

The constitution uses semantic versioning. A MAJOR version denotes backward-incompatible
governance or principle changes, a MINOR version denotes added or materially expanded
governance, and a PATCH version denotes clarifications or non-semantic refinements.
Compliance MUST be reviewed at each increment and before final delivery, including the
quality gates and evidence requirements above.

**Version**: 1.0.0 | **Ratified**: 2026-09-18 | **Last Amended**: 2026-09-18
