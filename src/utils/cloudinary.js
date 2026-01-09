
const CLOUD_NAME = "dbxktcwug";
const UPLOAD_PRESET = "Karteji";

export async function uploadToCloudinary(file){
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(url, { method:'POST', body: fd });
  if(!res.ok) throw new Error('Gagal upload');
  const data = await res.json();
  return data.secure_url;
}

export function cloudinarySmart(url, w=900){
  // lightweight transform if already cloudinary - strict URL validation
  if(!url) return url;
  
  try {
    const urlObj = new URL(url);
    // Check if hostname is exactly res.cloudinary.com or subdomain.res.cloudinary.com
    const hostname = urlObj.hostname.toLowerCase();
    if(hostname !== 'res.cloudinary.com' && !hostname.endsWith('.res.cloudinary.com')) {
      return url;
    }
    // Additional check: ensure cloudinary.com is not preceded by another domain
    if(hostname.includes('.') && !hostname.match(/^[a-z0-9-]+\.res\.cloudinary\.com$/i) && hostname !== 'res.cloudinary.com') {
      return url;
    }
    return url.replace('/upload/','/upload/f_auto,q_auto,w_'+w+'/');
  } catch {
    return url; // Invalid URL, return as-is
  }
}
