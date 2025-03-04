import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, useTheme, Typography } from '@mui/material';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const theme = useTheme();

  const codeBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];

  const components = React.useMemo(
    () => ({
      p: ({ node, children, ...props }: any) => (
        <Typography variant="body1" {...props} sx={{ margin: 0 }}>
          {children}
        </Typography>
      ),
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
        return (
          <pre
            style={{
              backgroundColor: theme.palette.grey[300],
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(2),
              overflowX: 'auto',
            }}
            className={className}
            {...props}
          >
            <code>{children}</code>
          </pre>
        );
      },
    }),
    [theme, codeBackground]
  );


  return (
    <Box
      sx={{
        '& > *:not(:last-child)': {
          marginBottom: theme.spacing(1.5),
        },
        '& ul li:not(:last-child), & ol li:not(:last-child)': {
          marginBottom: theme.spacing(1.5),
        },
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

export default React.memo(MarkdownRenderer);
