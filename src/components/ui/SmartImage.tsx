"use client";

import { CldImage } from 'next-cloudinary';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

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
    const [failed, setFailed] = useState(false);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    // simple inline SVG placeholder as data URI to avoid adding files
    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
                <rect fill='#f3f4f6' width='100%' height='100%'/>
                <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='24'>No image</text>
            </svg>
        `)}`;

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
            // If cloud name is not configured for client-side usage, fall back to plain img
            if (!cloudName) {
                console.warn('CLOUDINARY_CLOUD_NAME not set — falling back to raw URL rendering for Cloudinary asset.');
                const rawUrl = srcStr; // use the original Cloudinary URL
                return failed ? (
                    <Image {...(rest as any)} src={placeholder} alt={alt || ''} />
                ) : (
                    <Image
                        {...(rest as any)}
                        src={rawUrl}
                        alt={alt || ''}
                        unoptimized={false}
                        onError={(e: any) => {
                            console.error('Image failed to load (cloud fallback):', rawUrl, e);
                            setFailed(true);
                        }}
                    />
                );
            }

            return failed ? (
                <Image {...(rest as any)} src={placeholder} alt={alt || ''} />
            ) : (
                <CldImage
                    src={publicId}
                    alt={alt || ''}
                    {...(rest as any)}
                    onError={(e: any) => {
                        console.error('CldImage failed to load:', srcStr, e);
                        setFailed(true);
                    }}
                />
            );
        }
        // fallback: use CldImage with the full URL
        if (!cloudName) {
            console.warn('CLOUDINARY_CLOUD_NAME not set — falling back to raw URL rendering for Cloudinary asset.');
            return failed ? (
                <Image {...(rest as any)} src={placeholder} alt={alt || ''} />
            ) : (
                <Image
                    {...(rest as any)}
                    src={srcStr}
                    alt={alt || ''}
                    unoptimized={false}
                    onError={(e: any) => {
                        console.error('Image failed to load (cloud fallback):', srcStr, e);
                        setFailed(true);
                    }}
                />
            );
        }

        return failed ? (
            <Image {...(rest as any)} src={placeholder} alt={alt || ''} />
        ) : (
            <CldImage
                src={srcStr}
                alt={alt || ''}
                {...(rest as any)}
                onError={(e: any) => {
                    console.error('CldImage failed to load:', srcStr, e);
                    setFailed(true);
                }}
            />
        );
    }

    // For local uploads or regular URLs, use Next/Image and handle load failure
    const finalSrc = failed ? placeholder : src;
    return (
        <Image
            {...(rest as any)}
            src={finalSrc}
            alt={alt || ''}
            unoptimized={isLocalUpload ? true : unoptimized}
            onError={(e: any) => {
                // Only switch to placeholder once
                if (!failed) {
                    console.error('Image failed to load, switching to placeholder:', srcStr, e);
                    setFailed(true);
                }
            }}
        />
    );
}
