import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

// Configure Cloudinary from environment. Prefer CLOUDINARY_URL, or individual vars.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ url: process.env.CLOUDINARY_URL });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large (max 10MB)' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure Cloudinary configuration exists
    const cloudConfigured = !!(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));
    if (!cloudConfigured) {
      return NextResponse.json({ error: 'Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.' }, { status: 500 });
    }

    // Upload to Cloudinary using upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const opts: Record<string, any> = { folder };
      const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      // Pipe buffer into the upload stream
      const readable = Readable.from(buffer);
      readable.pipe(stream);
    });

    // uploadResult contains fields like secure_url, url, public_id
    const fileUrl = uploadResult.secure_url || uploadResult.url;

    console.log('Cloudinary upload result:', { folder, public_id: uploadResult.public_id, url: fileUrl });

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: uploadResult.original_filename || uploadResult.public_id,
      url: fileUrl,
      public_id: uploadResult.public_id,
      raw: uploadResult,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

