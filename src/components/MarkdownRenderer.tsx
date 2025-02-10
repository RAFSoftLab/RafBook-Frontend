import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, useTheme, Typography } from '@mui/material';
// Import a CSS file for syntax highlighting (choose your favorite theme)
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const theme = useTheme();

  // Use your theme settings to calculate code background and text colors.
  const codeBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];

  const components = {
    code({ inline, className, children, ...props }: any) {
      if (!className) {
        return (
          <code
            style={{
              backgroundColor: codeBackground,
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(0.25, 0.5),
            }}
            {...props}
          >
            {children}
          </code>
        );
      }
      // For block code, we override the entire <pre> element.
      return (
        <pre
          style={{
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
            overflowX: 'auto',
          }}
          {...props}
          className={className}
        >
          {children}
        </pre>
      );
    },
  };

  return (
    <Box
      sx={{
        // Apply bottom margin to all direct children except the last one.
        '& > *:not(:last-child)': {
          marginBottom: theme.spacing(1.5),
        },
        // Also, apply bottom margin to all li elements in ul and ol.
        '& ul li:not(:last-child), & ol li:not(:last-child)': {
          marginBottom: theme.spacing(1.5),
        },
        // Override default highlight.js styles for dark mode support.
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
