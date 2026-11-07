/**
 * Helper to convert various video URLs (Google Drive, YouTube, Vimeo, direct mp4)
 * into embeddable or playable formats.
 */
export function parseVideoSource(url) {
  if (!url || typeof url !== 'string') return null

  const trimmed = url.trim()

  // Google Drive file link:
  // e.g. https://drive.google.com/file/d/1A2B3C/view?usp=sharing
  // or https://drive.google.com/open?id=1A2B3C
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (driveFileMatch && driveFileMatch[1]) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`,
      provider: 'google-drive',
    }
  }

  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`,
      provider: 'google-drive',
    }
  }

  // YouTube standard, short, or youtu.be
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      provider: 'youtube',
    }
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/)
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
      provider: 'vimeo',
    }
  }

  // Direct HTML5 video file (.mp4, .webm, .mov)
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'video',
      src: trimmed,
      provider: 'direct',
    }
  }

  // Fallback: If it's an iframe-compatible URL
  return {
    type: 'iframe',
    src: trimmed,
    provider: 'generic',
  }
}
