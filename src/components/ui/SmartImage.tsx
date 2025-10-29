import { CldImage } from 'next-cloudinary';
import Image, { ImageProps } from 'next/image';

type SmartImageProps = ImageProps & { fallbackAlt?: string };

function extractCloudinaryPublicId(url: string): string | null {
    // Matches URLs like: https://res.cloudinary.com/<cloud>/image/upload/v12345/folder/name.ext
    const m = url.match(/res\.cloudinary\.com\/(?:[^/]+)\/(?:image|video)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!m || !m[1]) return null;
    // remove file extension
    return m[1].replace(/\.[^/.]+$/, '');
}

export default function SmartImage(props: SmartImageProps) {
    const { src, unoptimized, alt, ...rest } = props as any;

    // Determine src string value
    let srcStr = '';
    if (!src) srcStr = '';
    else if (typeof src === 'string') srcStr = src;
    else if (typeof src === 'object' && 'src' in src) srcStr = (src as any).src || '';

    // If the image is a local upload under /uploads, mark as unoptimized
    const isLocalUpload = typeof srcStr === 'string' && srcStr.startsWith('/uploads/');

    // If Cloudinary URL, render CldImage with extracted public id for transformations
    if (typeof srcStr === 'string' && srcStr.includes('res.cloudinary.com')) {
        const publicId = extractCloudinaryPublicId(srcStr);
        if (publicId) {
            // Pass through common props; next-cloudinary wraps Next/Image so supports similar props
            return <CldImage src={publicId} alt={alt || ''} {...(rest as any)} /> as any;
        }
        // fallback: use CldImage with the full URL
        return <CldImage src={srcStr} alt={alt || ''} {...(rest as any)} /> as any;
    }

    return <Image {...(rest as any)} src={src} alt={alt || ''} unoptimized={isLocalUpload ? true : unoptimized} />;
}
