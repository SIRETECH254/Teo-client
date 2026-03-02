# TEO-CLIENT Style Guide

This guide documents the shared Tailwind classes used across the app. Follow
these conventions to keep layouts consistent and to avoid repeating utility
chains.

## File organization

- `src/styles/tokens.css`: design tokens (`@theme`)
- `src/styles/base.css`: base layer styles (body, root)
- `src/styles/components.css`: shared UI components (buttons, inputs, alerts)
- `src/styles/utilities.css`: small layout helpers (container/spacing)

## Naming conventions

- Use base + variant naming, e.g. `btn` + `btn-primary`.
- Prefer semantic classes (`alert-error`) over inline colors.
- Keep class names short and descriptive (no page-specific names).

## Layout classes

Use these helpers to keep page spacing consistent.

- `page-container`: global page width + horizontal padding for protected pages.
- `section`: vertical spacing block for sections.
- `stack-4`: consistent vertical spacing for stacked content.
- `cluster-2`: horizontal cluster with consistent gap.
- `divider`: standard horizontal divider.

## Auth page layout

Use the `auth-page` → `auth-container` structure for all auth-related screens:

```tsx
<div className="auth-page">
  <div className="auth-container">
    <div className="">
      <!-- content -->
    </div>
  </div>
</div>
```

Core auth classes:

- `auth-page`, `auth-container`
- `auth-header`, `auth-kicker`, `auth-title`, `auth-subtitle`
- `auth-form`, `auth-field`
- `auth-actions`, `auth-remember`, `auth-checkbox`
- `auth-button`
- `auth-inline-message`
- `auth-inline-message-success`
- `auth-inline-message-error`

## Buttons

Use the base `btn` class plus a variant:

- `btn`
- `btn-primary`
- `btn-secondary`
- `btn-ghost`
- Size helpers: `btn-sm`, `btn-lg`

## Forms

Input and label classes:

- `label`
- `input`
- `input-password`
- `input-search`
- `input-disabled`
- `input-toggle-icon`
- `input-select`
- `input-date`
- `input-multiselect`
- `input-quill`

## Alerts

- `alert`
- `alert-success`
- `alert-error`
- `alert-info`

## Badges

Use `badge` plus a variant:

- `badge badge-soft`
- `badge badge-success`
- `badge badge-error`

## Tables

Table layout classes:

- `table-container`: wrapper with overflow and rounded border
- `table`: base table element
- `table-header`: header row container
- `table-header-cell`: standard header cell
- `table-header-cell-right`: right-aligned header cell
- `table-body`: table body container
- `table-row`: table row with hover effect
- `table-cell`: standard table cell
- `table-cell-text`: text cell with specific styling
- `table-cell-center`: centered table cell
- `table-cell-content`: flex container for cell content
- `table-avatar`: avatar image in table
- `table-avatar-initials`: avatar with initials fallback

## Image Previews

- `image-preview-grid`: flex grid container for image previews
- `image-preview-item`: individual image preview card

## Brand Colors

The TEO-CLIENT app uses a purple/pink brand palette:

- `brand-primary`: #4B2E83 (Primary brand color)
- `brand-accent`: #E879F9 (Secondary/accent)
- `brand-soft`: #FDE7FF (Soft secondary button)
- `brand-tint`: #F8F5FF (Light section backgrounds)
- `brand-primaryButton`: #3A1F66 (Primary button color)

These colors are available as Tailwind utilities (e.g., `bg-brand-primary`, `text-brand-accent`).
