# Tomalika Mazumdar — Portfolio

Personal portfolio of **Tomalika Mazumdar**, an Electrical & Electronic Engineering graduate from BUET, focused on renewable energy, power-system optimization, microgrids and embedded systems.

**Live site:** https://toma117-alt.github.io/

## Features
- **Scroll-driven 3D flythrough** (Three.js): the camera moves through an energy landscape (energy core, solar farm, wind turbines, battery storage, microgrid network, sun) as you scroll.
- **Dark / light mode**, which follows the system setting and remembers your choice.
- **Graphical navigation**: a 3D orbit menu around the profile photo, a magnifying dock, and a circuit-style progress rail.
- **Isometric workspace with a rigged low-poly character** that types, waves and thinks.
- **Skills tag sphere** floating in 3D (drag to spin).
- **3D animated timeline** for education, experience and leadership.
- **Exploded-view animation** of the thesis's hybrid PV-Battery-Diesel system.
- **Projects in three 3D views**: tilt cards, flipping cubes and an orbit carousel. Each project links to its GitHub repo.

## Editing content
All text content (projects, thesis, timeline, skills) lives in [`js/data.js`](js/data.js).
To link a project to its own repository, set its `repo` field, e.g. `repo: repo('my-repo-name')`.
Projects with `repo: null` link to the GitHub repositories page.

## Running locally
It's a static site with no build step:
```bash
python -m http.server 8000
# open http://localhost:8000
```
