import React from "react";

interface HTMLRendererProps {
  content: string;
  className?: string;
}

export const HTMLRenderer: React.FC<HTMLRendererProps> = ({
  content,
  className = "",
}) => {
  // Basic HTML sanitization - in production, you might want to use a library like DOMPurify
  const sanitizeHTML = (html: string): string => {
    // Remove potentially dangerous tags and attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/javascript:/gi, "");
  };

  const sanitizedContent = sanitizeHTML(content || "");

  return (
    <div
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        // Ensure proper styling for HTML content
        color: "inherit",
        lineHeight: "1.6",
      }}
    />
  );
};

// CSS styles for HTML content
export const htmlContentStyles = `
  .html-content {
    color: inherit;
    line-height: 1.6;
  }
  
  .html-content p {
    margin-bottom: 1rem;
    color: inherit;
  }
  
  .html-content h1,
  .html-content h2,
  .html-content h3,
  .html-content h4,
  .html-content h5,
  .html-content h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: inherit;
  }
  
  .html-content ul,
  .html-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .html-content li {
    margin-bottom: 0.25rem;
    color: inherit;
  }
  
  .html-content strong,
  .html-content b {
    font-weight: 600;
    color: inherit;
  }
  
  .html-content em,
  .html-content i {
    font-style: italic;
    color: inherit;
  }
  
  .html-content a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .html-content a:hover {
    color: #1d4ed8;
  }
  
  .html-content blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    color: inherit;
  }
  
  .html-content code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    color: inherit;
  }
  
  .html-content pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  .html-content pre code {
    background: none;
    padding: 0;
  }
`;
