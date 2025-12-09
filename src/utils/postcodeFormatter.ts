export function formatUKPostcode(postcode: string | null | undefined): string {
  if (!postcode) return postcode || "";
  
  if (postcode.includes(' ')) {
    return postcode;
  }
  
  const clean = postcode.replace(/\s/g, '').toUpperCase();
  
  if (/^\d{6}$/.test(clean)) {
    return clean;
  }
  
  if (clean.length >= 5 && clean.length <= 7) {
    const inward = clean.slice(-3);
    const outward = clean.slice(0, -3);
    
    if (/^[0-9][A-Z]{2}$/.test(inward)) {
      return `${outward} ${inward}`;
    }
  }
  
  return postcode;
}

