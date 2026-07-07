/**
 * Responsive image helper using <picture> with AVIF / WebP sources
 * and a density-aware srcset for 1x/2x.
 *
 * Accepts two shapes:
 *   1. String (legacy):  "/avatar.png"
 *   2. Object form:
 *      {
 *        alt: "Foto de perfil",
 *        sources: [{ type: "image/avif", srcSet: "/x.avif 1x, /x@2x.avif 2x" }, ...],
 *        fallback: { src: "/x.png", srcSet: "/x.png 1x, /x@2x.png 2x" },
 *        width: 132, height: 132,
 *      }
 */
export default function ResponsiveAvatar({ config, className }) {
  if (!config) return null;

  // Legacy string form (kept for backward compatibility)
  if (typeof config === 'string') {
    return <img src={config} alt="" className={className} loading="eager" decoding="async" />;
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
        <source key={s.type} type={s.type} srcSet={s.srcSet} />
      ))}
      <img
        src={fallback.src}
        srcSet={fallback.srcSet}
        alt={alt}
        width={width}
        height={height}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
