/**
 * Responsive image helper using <picture> with AVIF / WebP sources
 * and a density-aware srcset for 1x/2x.
 *
 * Resuelve todas las rutas de assets contra import.meta.env.BASE_URL,
 * de forma que el componente funciona tanto en dev (BASE_URL = '/') como
 * bajo un base path de proyecto (BASE_URL = '/dev-portfolio/') sin
 * requerir cambios en los datos (projects.json).
 *
 * Acepta dos formas:
 *   1. String (legacy):  "/avatar.png"
 *   2. Objeto:
 *      {
 *        alt: "Foto de perfil",
 *        sources: [{ type: "image/avif", srcSet: "/x.avif 1x, /x@2x.avif 2x" }, ...],
 *        fallback: { src: "/x.png", srcSet: "/x.png 1x, /x@2x.png 2x" },
 *        width: 132, height: 132,
 *      }
 */
const BASE = import.meta.env.BASE_URL;

/**
 * Prefija paths absolutos (que empiezan por /) con BASE_URL.
 * Ignora URLs absolutas con protocolo (//cdn.example.com/...) y paths relativos.
 */
function resolvePath(p) {
  if (!p || typeof p !== 'string') return p;
  if (p.startsWith('/') && !p.startsWith('//')) {
    return BASE + p.slice(1);
  }
  return p;
}

/**
 * Aplica resolvePath a cada URL de un descriptor srcSet
 * (formato: "url1 1x, url2 2x, ...").
 */
function resolveSrcSet(srcSet) {
  if (!srcSet || typeof srcSet !== 'string') return srcSet;
  return srcSet
    .split(',')
    .map((part) => resolvePath(part.trim()))
    .join(', ');
}

export default function ResponsiveAvatar({ config, className }) {
  if (!config) return null;

  // Forma string legacy
  if (typeof config === 'string') {
    return (
      <img
        src={resolvePath(config)}
        alt=""
        className={className}
        loading="eager"
        decoding="async"
      />
    );
  }

  const {
    sources = [],
    fallback,
    alt = '',
    width,
    height,
  } = config;

  if (!fallback?.src) return null;

  return (
    <picture className={className}>
      {sources.map((s) => (
        <source key={s.type} type={s.type} srcSet={resolveSrcSet(s.srcSet)} />
      ))}
      <img
        src={resolvePath(fallback.src)}
        srcSet={resolveSrcSet(fallback.srcSet)}
        alt={alt}
        width={width}
        height={height}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
