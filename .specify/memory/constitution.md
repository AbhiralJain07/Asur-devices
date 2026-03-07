<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0 (initial constitution)
List of modified principles: N/A (initial creation)
Added sections: All sections (initial creation)
Removed sections: N/A
Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
Follow-up TODOs: N/A
-->

# ASUR Constitution

## Core Principles

### I. Premium Performance Identity
ASUR embodies "Heavier than Air" (Premium/Solid) yet "Faster than Light" (Performance). Every digital interaction must convey premium quality through solid, substantial design while delivering lightning-fast performance. This duality defines our brand essence and must be reflected in all user experiences.

### II. Motion as Meaning
No animation shall be purely decorative. Every movement MUST guide the user's eye to a key specification or critical information. Motion serves a functional purpose - to direct attention, reveal relationships, or communicate state changes. All animations must be justified by their contribution to user understanding or task completion.

### III. Dark Mode Primacy
ASUR interfaces shall default to dark mode with high-contrast blacks and obsidian surfaces. Accent colors MUST use "Electric Violet/Cyan" palette inspired by ROG aesthetics. Light mode may be offered as an option but never as the default. All designs must first prove their effectiveness in dark mode.

### IV. Typography Hierarchy
Bold, wide-kerning sans-serif fonts MUST be used for headings to convey strength and premium quality. Monospaced fonts are REQUIRED for all technical specifications, code displays, and performance metrics. Typography must support the premium performance identity through deliberate weight and spacing choices.

### V. Spec-First Development
No component SHALL be built until its JSON schema/specification is defined and approved. Specifications must include visual design, interaction patterns, performance requirements, and technical constraints. This ensures alignment with premium standards before implementation begins.

### VI. Atomic Design Modularity
All components MUST follow atomic design principles: Atom > Molecule > Organism. Each component MUST be modular, independently testable, and reusable. Components must have clear boundaries and defined interfaces to maintain system integrity and enable rapid iteration.

## Design Standards

### Visual Design Requirements
- Color palette: Obsidian blacks (#000000, #0A0A0A, #141414) with Electric Violet/Cyan accents (#8B5CF6, #06B6D4)
- Typography: Bold sans-serif for headings (Inter Bold, Space Grotesk Bold), monospace for specs (JetBrains Mono, Fira Code)
- Layout: Grid-based systems with generous spacing to convey premium quality
- Imagery: High-contrast product photography with dramatic lighting

### Performance Standards
- Page load MUST be under 2 seconds on premium hardware
- Animations MUST maintain 60fps on target devices
- Image optimization REQUIRED for all product visuals
- Lazy loading implementation for below-fold content

### Interaction Standards
- Hover states MUST provide immediate visual feedback
- Transitions MUST be meaningful and purposeful
- Touch targets MUST meet or exceed accessibility guidelines
- Error states MUST be clear and actionable

## Development Workflow

### Specification Phase
All features MUST begin with comprehensive specification including:
- User journey mapping with premium touchpoints
- Technical performance requirements
- Visual design mockups in dark mode
- Component atomic structure definition
- Success metrics and KPIs

### Implementation Phase
Development MUST follow strict order:
1. Component specification approval
2. Atomic component creation (atoms first)
3. Integration into molecules
4. Assembly into organisms
5. Performance validation
6. Cross-device testing

### Quality Assurance
All components MUST pass:
- Performance benchmarks (load time, animation fps)
- Visual regression testing in dark mode
- Accessibility compliance testing
- Cross-browser/device validation
- Premium user experience validation

## Governance

This Constitution supersedes all other development practices and style guides. Amendments require:
- Documentation of proposed changes with rationale
- Team review and approval process
- Migration plan for existing components
- Version update following semantic versioning

All pull requests MUST verify compliance with relevant Constitution principles. Complexity beyond these standards MUST be explicitly justified with business or technical rationale. Use this Constitution as the primary reference for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
