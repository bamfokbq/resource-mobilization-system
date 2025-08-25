# Resource Management System Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the Resource Management System with MongoDB and AWS S3 integration for the NCD Navigator admin dashboard.

## Architecture

### Components
1. **Admin Dashboard UI** - React components for resource management
2. **Server Actions** - Next.js server actions for resource operations
3. **API Routes** - RESTful endpoints for file operations
4. **MongoDB** - Database for resource metadata
5. **AWS S3** - File storage for resource documents and media
6. **File Processing** - Thumbnail generation and file validation

## MongoDB Integration

### Database Schema

```javascript
// MongoDB Collection: resources
{
  _id: ObjectId,
  id: String, // Unique identifier
  title: String,
  description: String,
  type: String, // Enum: research-findings, concept-notes, etc.
  fileFormat: String, // PDF, DOC, DOCX, etc.
  fileSize: Number,
  fileName: String,
  fileUrl: String, // S3 URL
  thumbnailUrl: String, // S3 URL for thumbnail
  status: String, // Enum: draft, published, under-review, archived
  accessLevel: String, // Enum: public, internal, restricted, confidential
  uploadDate: Date,
  publicationDate: Date,
  lastModified: Date,
  partnerId: String,
  projectId: String,
  tags: Array,
  downloadCount: Number,
  viewCount: Number,
  author: String,
  version: String,
  language: String,
  keywords: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### MongoDB Connection Setup

```javascript
// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### Environment Variables for MongoDB

```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ncd_navigator?retryWrites=true&w=majority
```

## AWS S3 Integration

### S3 Bucket Structure

```
ncd-navigator-resources/
├── resources/
│   ├── {resourceId}/
│   │   ├── original/
│   │   │   └── {filename}
│   │   └── thumbnails/
│   │       └── {filename}_thumb.jpg
├── temp/
│   └── uploads/
└── backups/
    └── {date}/
```

### S3 Configuration

```javascript
// lib/s3.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFile = async (file, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type,
    ServerSideEncryption: 'AES256',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
};

export const generateSignedUrl = async (key, expires = 3600) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: expires,
  };

  try {
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('S3 signed URL error:', error);
    throw error;
  }
};
```

### Environment Variables for S3

```bash
# .env.local
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=ncd-navigator-resources
```

## Implementation Steps

### 1. Install Required Dependencies

```bash
npm install aws-sdk mongodb multer sharp pdf-thumbnail fluent-ffmpeg
npm install @types/multer @types/sharp --save-dev
```

### 2. Update Server Actions

Replace the mock functions in `actions/resources.ts` with actual database operations:

```typescript
// actions/resources.ts
import clientPromise from '@/lib/mongodb';
import { uploadFile, deleteFile } from '@/lib/s3';

export async function createResource(data: CreateResourceRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('ncd_navigator');
    
    // Generate unique ID
    const resourceId = `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Upload file to S3
    const fileKey = `resources/${resourceId}/original/${data.file.name}`;
    const fileUrl = await uploadFile(data.file, fileKey);
    
    // Create resource document
    const resource = {
      id: resourceId,
      title: data.title,
      description: data.description,
      type: data.type,
      fileFormat: data.file.name.split('.').pop()?.toUpperCase(),
      fileSize: data.file.size,
      fileName: data.file.name,
      fileUrl,
      status: data.status,
      accessLevel: data.accessLevel,
      uploadDate: new Date(),
      lastModified: new Date(),
      partnerId: data.partnerId,
      projectId: data.projectId,
      tags: data.tags || [],
      downloadCount: 0,
      viewCount: 0,
      author: data.author,
      keywords: data.keywords || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert into MongoDB
    await db.collection('resources').insertOne(resource);
    
    return {
      success: true,
      message: 'Resource created successfully',
      resourceId
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return {
      success: false,
      message: 'Failed to create resource'
    };
  }
}
```

### 3. Set up File Processing

```typescript
// lib/fileProcessing.ts
import sharp from 'sharp';
import pdfThumbnail from 'pdf-thumbnail';
import ffmpeg from 'fluent-ffmpeg';

export const generateThumbnail = async (file: File, fileFormat: string): Promise<Buffer | null> => {
  try {
    switch (fileFormat.toLowerCase()) {
      case 'pdf':
        return await pdfThumbnail(file, {
          compress: {
            type: 'JPEG',
            quality: 70
          }
        });
        
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return await sharp(file)
          .resize(300, 200)
          .jpeg({ quality: 80 })
          .toBuffer();
          
      case 'mp4':
      case 'avi':
      case 'mov':
        return new Promise((resolve, reject) => {
          ffmpeg(file)
            .screenshot({
              timestamps: ['50%'],
              filename: 'thumbnail.jpg',
              size: '300x200'
            })
            .on('end', () => resolve(/* thumbnail buffer */))
            .on('error', reject);
        });
        
      default:
        return null;
    }
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return null;
  }
};
```

### 4. Configure CORS and Security

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for file uploads
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 5. Add File Validation

```typescript
// lib/fileValidation.ts
const ALLOWED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'video/mp4': ['.mp4'],
  'video/avi': ['.avi'],
  'video/quicktime': ['.mov']
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  if (!ALLOWED_TYPES[file.type]) {
    return { valid: false, error: 'File type not supported' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_TYPES[file.type].includes(extension)) {
    return { valid: false, error: 'File extension does not match MIME type' };
  }

  return { valid: true };
};
```

## Security Considerations

### 1. Access Control
- Implement role-based access control (RBAC)
- Validate user permissions before file operations
- Use signed URLs for private resources

### 2. File Security
- Scan uploaded files for malware
- Validate file types and contents
- Implement file size limits
- Use secure file naming conventions

### 3. Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement audit logging
- Regular security updates

## Monitoring and Analytics

### 1. Usage Tracking
```typescript
// lib/analytics.ts
export const trackResourceEvent = async (event: string, resourceId: string, userId?: string) => {
  const analytics = {
    event,
    resourceId,
    userId,
    timestamp: new Date(),
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };
  
  await db.collection('analytics').insertOne(analytics);
};
```

### 2. Performance Monitoring
- Monitor S3 upload/download speeds
- Track database query performance
- Monitor storage usage and costs
- Set up alerts for system issues

## Backup and Recovery

### 1. MongoDB Backup
```bash
# Daily backup script
mongodump --uri="$MONGODB_URI" --out="/backups/$(date +%Y%m%d)"
```

### 2. S3 Backup
- Enable S3 versioning
- Configure cross-region replication
- Set up lifecycle policies for cost optimization

## Cost Optimization

### 1. S3 Storage Classes
- Use Standard-IA for infrequently accessed files
- Use Glacier for archival storage
- Implement intelligent tiering

### 2. Database Optimization
- Index frequently queried fields
- Use aggregation pipelines for analytics
- Implement data archival strategies

## Testing

### 1. Unit Tests
```typescript
// __tests__/resources.test.ts
import { createResource, deleteResource } from '@/actions/resources';

describe('Resource Management', () => {
  test('should create resource successfully', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = await createResource({
      title: 'Test Resource',
      file: mockFile,
      type: 'reports',
      status: 'draft',
      accessLevel: 'internal',
      partnerId: 'test-partner'
    });
    
    expect(result.success).toBe(true);
    expect(result.resourceId).toBeDefined();
  });
});
```

### 2. Integration Tests
- Test file upload to S3
- Test database operations
- Test thumbnail generation
- Test access control

## Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=ncd-navigator-resources-prod
```

### 2. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Resource Management
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Troubleshooting

### Common Issues

1. **File Upload Failures**
   - Check S3 permissions
   - Verify CORS configuration
   - Check file size limits

2. **Thumbnail Generation Errors**
   - Ensure required dependencies are installed
   - Check file format support
   - Verify memory limits

3. **Database Connection Issues**
   - Check MongoDB URI
   - Verify network connectivity
   - Check connection pool settings

### Debugging Tools

1. **S3 Debugging**
```typescript
import AWS from 'aws-sdk';
AWS.config.logger = console;
```

2. **MongoDB Debugging**
```typescript
import { MongoClient } from 'mongodb';
const client = new MongoClient(uri, { 
  loggerLevel: 'debug',
  logger: console 
});
```

This implementation provides a robust, scalable resource management system with comprehensive file handling, security, and monitoring capabilities.
