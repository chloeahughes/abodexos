import { ExtractedFields } from './types';

export function extractFromText(text: string): ExtractedFields {
  const fields: ExtractedFields = {};
  
  // Clean text for better matching
  const cleanText = text.toLowerCase().replace(/[^\w\s$.,]/g, ' ');
  
  // Extract property value / asking price
  const pricePatterns = [
    /\$[\d,]+(?:\.\d+)?\s*(?:million|mil|m)\b/g,
    /\$[\d,]+(?:\.\d+)?\s*(?:thousand|k)\b/g,
    /\$[\d,]+(?:\.\d+)?\b/g,
  ];
  
  for (const pattern of pricePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const prices = matches.map(match => {
        let value = match.replace(/[$,]/g, '');
        if (value.includes('million') || value.includes('mil') || value.includes('m')) {
          value = value.replace(/\s*(million|mil|m)\b/, '');
          return parseFloat(value) * 1000000;
        } else if (value.includes('thousand') || value.includes('k')) {
          value = value.replace(/\s*(thousand|k)\b/, '');
          return parseFloat(value) * 1000;
        }
        return parseFloat(value);
      }).filter(price => !isNaN(price) && price > 1000);
      
      if (prices.length > 0) {
        // Take the highest price as asking price
        fields.asking_price = Math.max(...prices);
        fields.property_value = fields.asking_price;
      }
    }
  }
  
  // Extract square footage
  const sqftPatterns = [
    /(\d[\d,]*)\s*(?:sq\s?ft|sf|ft²|square\s*feet)/gi,
    /(\d[\d,]*)\s*(?:sq\.?\s*ft\.?)/gi,
  ];
  
  for (const pattern of sqftPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const sqfts = matches.map(match => {
        const num = match.replace(/[^\d,]/g, '').replace(/,/g, '');
        return parseInt(num);
      }).filter(sqft => !isNaN(sqft) && sqft > 100);
      
      if (sqfts.length > 0) {
        // Take the largest square footage
        fields.square_feet = Math.max(...sqfts);
      }
    }
  }
  
  // Extract price per square foot
  if (fields.asking_price && fields.square_feet) {
    fields.price_per_sqft = Math.round(fields.asking_price / fields.square_feet);
  } else {
    const pricePerSqftPattern = /\$(\d[\d,]*)\s*(?:per\s*sq\s*ft|psf)/gi;
    const matches = text.match(pricePerSqftPattern);
    if (matches) {
      const prices = matches.map(match => {
        const num = match.replace(/[^\d,]/g, '').replace(/,/g, '');
        return parseInt(num);
      }).filter(price => !isNaN(price) && price > 10);
      
      if (prices.length > 0) {
        fields.price_per_sqft = Math.max(...prices);
      }
    }
  }
  
  // Extract location/address
  const addressPatterns = [
    /\b(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct))\b/gi,
    /\b([A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct))\b/gi,
  ];
  
  for (const pattern of addressPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Take the first reasonable address
      const address = matches[0].trim();
      if (address.length > 5 && address.length < 100) {
        fields.location = address;
        break;
      }
    }
  }
  
  // Extract property type
  const propertyTypes = [
    'office', 'industrial', 'retail', 'multifamily', 'mixed-use',
    'warehouse', 'apartment', 'condo', 'townhouse', 'single-family',
    'commercial', 'residential', 'land', 'development'
  ];
  
  for (const type of propertyTypes) {
    if (cleanText.includes(type)) {
      fields.property_type = type.charAt(0).toUpperCase() + type.slice(1);
      break;
    }
  }
  
  // TODO: Add LLM fallback for missing key fields
  // if (!fields.location || !fields.property_value) {
  //   // Call LLM API to extract missing fields
  // }
  
  return fields;
}

export function consolidateExtractedFields(messages: Array<{ text: string; subject: string }>): ExtractedFields {
  const allFields = messages.map(msg => extractFromText(`${msg.subject} ${msg.text}`));
  
  const consolidated: ExtractedFields = {};
  
  // Take the most frequent or highest values
  const locations = allFields.map(f => f.location).filter(Boolean);
  if (locations.length > 0) {
    // Take the most common location
    const locationCounts = locations.reduce((acc, loc) => {
      acc[loc!] = (acc[loc!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    consolidated.location = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
  }
  
  const prices = allFields.map(f => f.asking_price).filter(Boolean);
  if (prices.length > 0) {
    consolidated.asking_price = Math.max(...prices);
    consolidated.property_value = consolidated.asking_price;
  }
  
  const sqfts = allFields.map(f => f.square_feet).filter(Boolean);
  if (sqfts.length > 0) {
    consolidated.square_feet = Math.max(...sqfts);
  }
  
  const pricePerSqfts = allFields.map(f => f.price_per_sqft).filter(Boolean);
  if (pricePerSqfts.length > 0) {
    consolidated.price_per_sqft = Math.round(
      pricePerSqfts.reduce((sum, price) => sum + price, 0) / pricePerSqfts.length
    );
  }
  
  const propertyTypes = allFields.map(f => f.property_type).filter(Boolean);
  if (propertyTypes.length > 0) {
    const typeCounts = propertyTypes.reduce((acc, type) => {
      acc[type!] = (acc[type!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    consolidated.property_type = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
  }
  
  return consolidated;
}
