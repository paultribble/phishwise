export function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube: youtube.com/watch?v=ID or youtu.be/ID → youtube.com/embed/ID
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // YouTube already in embed format
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Vimeo already in embed format
  if (url.includes("player.vimeo.com/video/")) {
    return url;
  }

  return null;
}
