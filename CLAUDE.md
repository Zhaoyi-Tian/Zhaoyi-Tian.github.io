# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based academic portfolio website forked from Academic Pages template, customized with a projects section that displays academic work in GitHub-style cards with timeline view. The site is hosted on GitHub Pages and built automatically.

## Development Commands

### Local Development
```bash
# Install dependencies (first time setup)
bundle config set --local path 'vendor/bundle'  # Install gems locally
bundle install

# Serve locally
jekyll serve -l -H localhost
# OR with bundle exec
bundle exec jekyll serve -l -H localhost
```

### Docker Development
```bash
# Build and run with Docker
chmod -R 777 .
docker compose up
```

### JavaScript Build
```bash
# Build minified JavaScript
npm run build:js

# Watch for changes
npm run watch:js
```

## Architecture

### Core Structure
- **Jekyll Site**: Static site generator with GitHub Pages compatibility
- **Liquid Templates**: Template engine for HTML generation
- **SCSS/Sass**: Styling with modular imports in `assets/css/main.scss`
- **Collections**: Custom content types for projects, publications, talks, teaching

### Key Custom Components

#### Projects System
- **Collection**: `_projects/` - Markdown files with YAML frontmatter
- **Template**: `_includes/archive-single-project.html` - GitHub-style project cards
- **Layout**: `_pages/projects.md` - Timeline view with project grouping
- **Styling**: Custom CSS in `assets/css/main.scss` for `.github-project-card` and timeline

#### Project Card Features
- Background images with gradient overlays
- Language indicators with color coding
- Star counts and dates
- Responsive grid layout
- Hover animations

### Configuration
- **Main Config**: `_config.yml` - Site settings, collections, author info
- **Gemfile**: Ruby dependencies for Jekyll and plugins
- **Navigation**: `_data/navigation.yml` - Site menu structure

### Content Organization
```
_projects/       # Project markdown files
_publications/   # Academic publications
_talks/         # Conference talks
_teaching/      # Teaching experience
_pages/         # Static pages
_includes/      # Reusable templates
_layouts/       # Page layouts
_sass/          # Modular stylesheets
```

### Styling System
- **Theme Variables**: Dark/light mode support with CSS custom properties
- **Modular SCSS**: Organized by layout, theme, and vendor components
- **Custom Components**: Project cards, timeline, responsive grid

### Content Management
- **Frontmatter Fields**: Standard Jekyll + custom fields (image, language, language_color, stars)
- **Markdown Processing**: Kramdown with syntax highlighting
- **Asset Management**: Images in `/images/`, organized by content type

## Important Patterns

### Project Creation
New projects require:
1. Markdown file in `_projects/` with proper frontmatter
2. Optional project image in `images/projects/`
3. Date-based naming for chronological ordering

### Styling Conventions
- Use CSS custom properties for theme-aware colors
- Follow existing class naming (kebab-case)
- Maintain responsive design patterns
- Test both light and dark themes

### Deployment
- Site builds automatically on GitHub Pages
- Uses Jekyll safe mode (limited plugins)
- Static files served from `_site/` directory