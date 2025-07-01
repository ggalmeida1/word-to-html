interface CleanupOptions {
  cleanupLevel: 'basic' | 'moderate' | 'aggressive';
  preserveImages: boolean;
  preserveTables: boolean;
  removeComments: boolean;
}

export function cleanWordHTML(htmlContent: string, options: CleanupOptions): string {
  let cleanedHTML = htmlContent;

  // Remove HTML comments if requested
  if (options.removeComments) {
    cleanedHTML = cleanedHTML.replace(/<!--[\s\S]*?-->/g, '');
  }

  // Remove Word-specific XML namespaces and declarations
  cleanedHTML = cleanedHTML.replace(/<\?xml[^>]*\?>/g, '');
  cleanedHTML = cleanedHTML.replace(/<\/?[owvpx]:[^>]*>/g, '');
  
  // Remove Word-specific meta tags
  cleanedHTML = cleanedHTML.replace(/<meta[^>]*>/g, '');
  cleanedHTML = cleanedHTML.replace(/<link[^>]*>/g, '');
  
  // Remove Word-specific style blocks
  cleanedHTML = cleanedHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  switch (options.cleanupLevel) {
    case 'basic':
      cleanedHTML = basicCleanup(cleanedHTML, options);
      break;
    case 'moderate':
      cleanedHTML = moderateCleanup(cleanedHTML, options);
      break;
    case 'aggressive':
      cleanedHTML = aggressiveCleanup(cleanedHTML, options);
      break;
  }

  // Final cleanup - normalize whitespace
  cleanedHTML = normalizeWhitespace(cleanedHTML);
  
  return cleanedHTML.trim();
}

function basicCleanup(html: string, options: CleanupOptions): string {
  let cleaned = html;
  
  // Remove Word-specific CSS classes and styles
  cleaned = cleaned.replace(/\s*class="[^"]*mso[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*class="[^"]*Mso[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*class="[^"]*MSO[^"]*"/gi, '');
  
  // Remove Word-specific style attributes
  cleaned = cleaned.replace(/\s*style="[^"]*mso[^"]*[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*style="[^"]*Mso[^"]*[^"]*"/gi, '');
  
  // Remove conditional comments
  cleaned = cleaned.replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, '');
  
  return cleaned;
}

function moderateCleanup(html: string, options: CleanupOptions): string {
  let cleaned = basicCleanup(html, options);
  
  // Remove all class attributes
  cleaned = cleaned.replace(/\s*class="[^"]*"/gi, '');
  
  // Remove empty attributes
  cleaned = cleaned.replace(/\s*\w+=""/g, '');
  
  // Remove font tags and replace with appropriate semantic tags
  cleaned = cleaned.replace(/<font[^>]*color="[^"]*"[^>]*>(.*?)<\/font>/gi, '<span style="color: $1">$2</span>');
  cleaned = cleaned.replace(/<font[^>]*>(.*?)<\/font>/gi, '$1');
  
  // Clean up span tags with minimal styling
  cleaned = cleaned.replace(/<span[^>]*style="[^"]*"[^>]*>(.*?)<\/span>/gi, (match, content) => {
    const styleMatch = match.match(/style="([^"]*)"/);
    if (styleMatch) {
      const style = styleMatch[1];
      // Only keep essential styles
      const essentialStyles = style.match(/(color|font-weight|font-style|text-decoration):[^;]+/g);
      if (essentialStyles && essentialStyles.length > 0) {
        return `<span style="${essentialStyles.join('; ')}">${content}</span>`;
      }
    }
    return content;
  });
  
  // Remove unnecessary div tags
  cleaned = cleaned.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1');
  
  // Handle images based on options
  if (!options.preserveImages) {
    cleaned = cleaned.replace(/<img[^>]*>/gi, '');
  }
  
  return cleaned;
}

function aggressiveCleanup(html: string, options: CleanupOptions): string {
  let cleaned = moderateCleanup(html, options);
  
  // Remove all style attributes
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, '');
  
  // Remove all non-essential attributes
  cleaned = cleaned.replace(/\s*(?:id|name|title|lang|dir|onClick|onLoad|onMouseOver)="[^"]*"/gi, '');
  
  // Keep only essential HTML tags
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
  ];
  
  if (options.preserveTables) {
    allowedTags.push('table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot');
  }
  
  if (options.preserveImages) {
    allowedTags.push('img');
  }
  
  // Remove tags not in the allowed list
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  cleaned = cleaned.replace(tagPattern, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // For allowed tags, clean up attributes
      if (tagName.toLowerCase() === 'a') {
        const hrefMatch = match.match(/href="([^"]*)"/);
        return hrefMatch ? `<${tagName} href="${hrefMatch[1]}">` : `<${tagName}>`;
      } else if (tagName.toLowerCase() === 'img' && options.preserveImages) {
        const srcMatch = match.match(/src="([^"]*)"/);
        const altMatch = match.match(/alt="([^"]*)"/);
        let imgTag = '<img';
        if (srcMatch) imgTag += ` src="${srcMatch[1]}"`;
        if (altMatch) imgTag += ` alt="${altMatch[1]}"`;
        imgTag += '>';
        return imgTag;
      } else {
        return match.replace(/<(\/?[a-zA-Z][a-zA-Z0-9]*)[^>]*>/, '<$1>');
      }
    }
    return '';
  });
  
  return cleaned;
}

function normalizeWhitespace(html: string): string {
  let normalized = html;
  
  // Replace multiple spaces with single space
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Remove spaces around tags
  normalized = normalized.replace(/\s*<\s*/g, '<');
  normalized = normalized.replace(/\s*>\s*/g, '>');
  
  // Fix line breaks
  normalized = normalized.replace(/\s*<br\s*\/?>\s*/gi, '<br>');
  normalized = normalized.replace(/(<br>){3,}/gi, '<br><br>');
  
  // Remove empty paragraphs
  normalized = normalized.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // Normalize paragraph spacing
  normalized = normalized.replace(/\s*<p([^>]*)>\s*/gi, '<p$1>');
  normalized = normalized.replace(/\s*<\/p>\s*/gi, '</p>');
  
  return normalized;
}

// Utility function to detect if content is from Word
export function isWordContent(html: string): boolean {
  const wordIndicators = [
    /mso-/i,
    /Microsoft\s+Word/i,
    /urn:schemas-microsoft-com/i,
    /<!--\[if/i,
    /<o:p>/i,
    /class="?Mso/i
  ];
  
  return wordIndicators.some(pattern => pattern.test(html));
}

// Utility function to get content statistics
export function getContentStats(original: string, cleaned: string) {
  return {
    originalLength: original.length,
    cleanedLength: cleaned.length,
    reductionPercentage: Math.round(((original.length - cleaned.length) / original.length) * 100),
    isWordContent: isWordContent(original)
  };
} 