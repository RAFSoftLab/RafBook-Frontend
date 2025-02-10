import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, useTheme } from '@mui/material';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const theme = useTheme();

  const components = {
    code({ inline, className, children, ...props }: any) {
      if (!className) {
        return (
          <code
            style={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(0.25, 0.5),
              fontFamily: theme.typography.fontFamily,
            }}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <pre
          style={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
            overflowX: 'auto',
            fontFamily: theme.typography.fontFamily,
          }}
          {...props}
        >
          <code className={className}>{children}</code>
        </pre>
      );
    },
  };

  return (
    <Box
      sx={{
        // Reset margins on all descendants.
        '& *': { margin: 0 },
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
