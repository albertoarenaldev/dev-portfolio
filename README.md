# dev-portfolio

Portfolio personal de **Alberto Arenal Fernández** — Desarrollador Backend Java (Spring Boot, JPA, Docker).

🌐 **Live:** [albertoarenaldev.github.io/dev-portfolio](https://albertoarenaldev.github.io/dev-portfolio/)

## Stack

- **[Vite 8](https://vite.dev/)** + **[React 19](https://react.dev/)** — HMR instantáneo y builds modernos
- **JavaScript** (ES modules) — sin TypeScript para mantener el bundle ligero
- **[oxlint](https://oxc.rs/)** — linting ultrarrápido (Oxc, alternativa a ESLint)
- **[react-icons](https://react-icons.github.io/react-icons/)** (set *Simple Icons*) — logos de tecnologías
- **GitHub REST API** — la sección `GitHubStats` hace auto-fetch del perfil y los repos públicos

## Estructura

```
dev-portfolio/
├── index.html                  # entry point + preconnect a Google Fonts
├── vite.config.js              # base: '/dev-portfolio/' (GitHub Pages project site)
├── package.json
├── .github/workflows/
│   └── deploy.yml              # build + deploy a Pages en cada push a main
└── src/
    ├── main.jsx                # React root
    ├── App.jsx                 # composición de secciones
    ├── App.css / index.css     # estilos globales
    ├── projects.json           # única fuente de verdad de los datos
    ├── api/
    │   └── github.js           # fetch a api.github.com
    └── components/
        ├── ProjectCard.jsx
        └── GitHubRepos.jsx
```

## Secciones

1. **Hero** — nombre, título, ubicación, disponibilidad, CTAs
2. **About** — bio extendida en 2-3 párrafos
3. **Skills** — grid por categoría (Backend, BD, Frontend, Testing, DevOps)
4. **Experience** — bootcamp + formación reglada
5. **Projects** — cards con tech stack, links a GitHub y demo
6. **GitHubStats** — perfil + top repos auto-fetched (solo si `social.github` está definido en `projects.json`)
7. **Contact** — canales disponibles con botón *Copiar*

## Datos

Toda la info del portfolio vive en `src/projects.json`. Edita ese fichero para:

- Cambiar nombre, bio, skills, experiencia, proyectos
- Activar la sección GitHubStats: pon `"github": "tu-usuario"` en la raíz
- Añadir/quitar canales de contacto (email, phone, linkedin, website)

## Scripts

```bash
npm install
npm run dev      # dev server con HMR en http://localhost:5173
npm run build    # build a ./dist (base path = /dev-portfolio/)
npm run preview  # preview del build localmente
npm run lint     # oxlint
```

## Deploy

El deploy a GitHub Pages es **automático** vía GitHub Actions:

1. Push a `main` dispara el workflow `.github/workflows/deploy.yml`
2. Instala deps → `npm run build` → sube `./dist` como artifact
3. `actions/deploy-pages@v4` publica en `https://albertoarenaldev.github.io/dev-portfolio/`

**Setup one-time** (ya hecho en este repo):

1. Repo → **Settings** → **Pages** → *Source*: **GitHub Actions**
2. (Opcional) custom domain

## Licencia

MIT — siéntete libre de forkear y adaptarlo a tu propio portfolio.

---

Hecho con ❤️ desde Puente Viesgo, Cantabria · 2025
