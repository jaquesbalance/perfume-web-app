⏺ S3 Image Access Guide for Frontend Developers

  Image URL Format in Perfume Data

  Perfume objects contain image references in these fields:
  - imageUrl - Direct S3 URL (if available)
  - imgId - S3 key/filename (needs signed URL)

  1. Check Image Type

  // In your perfume object:
  if (perfume.imageUrl) {
    // Use direct URL
    return perfume.imageUrl;
  } else if (perfume.imgId) {
    // Generate signed URL
    return await getSignedImageUrl(perfume.imgId);
  }

  2. Generate Signed URL

  async function getSignedImageUrl(imgId) {
    try {
      const response = await fetch('/api/images/signed-url',
  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bucket: 'bourgeon',
          key: `img/${imgId}`,
          expires: 3600 // 1 hour
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        return data.url;
      }
      throw new Error(data.message);
    } catch (error) {
      console.error('Failed to get signed URL:', error);
      return '/placeholder-image.jpg'; // Fallback
    }
  }

  3. React Hook Example

  import { useState, useEffect } from 'react';

  function usePerfumeImage(perfume) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadImage() {
        if (perfume.imageUrl) {
          setImageUrl(perfume.imageUrl);
        } else if (perfume.imgId) {
          const signedUrl = await
  getSignedImageUrl(perfume.imgId);
          setImageUrl(signedUrl);
        }
        setLoading(false);
      }

      loadImage();
    }, [perfume]);

    return { imageUrl, loading };
  }

  4. Common Issues & Solutions

  403 Error:
  - Key must start with img/
  - Bucket must be bourgeon

  500 Error:
  - AWS credentials not configured on backend
  - Check /api/images/health endpoint

  404/No Image:
  - Use fallback placeholder image
  - The imgId might not exist in S3

  5. Health Check

  // Check if S3 service is working
  fetch('/api/images/health')
    .then(res => res.json())
    .then(data => console.log('S3 Status:', data.data));