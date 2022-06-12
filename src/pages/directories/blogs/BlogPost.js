import { useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
// material
import { Box, Card, Divider, Skeleton, Container, Typography, Pagination } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getPost, getRecentPosts } from '../../../redux/slices/blog';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Markdown from '../../../components/Markdown';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { BlogPostHero, BlogPostTags, BlogPostRecent, BlogPostCommentList, BlogPostCommentForm } from './blog';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    <Skeleton width="100%" height={560} variant="rectangular" sx={{ borderRadius: 2 }} />
    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={64} height={64} />
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
      </Box>
    </Box>
  </>
);

export default function BlogPost() {
  const { themeStretch } = useSettings();
  const { _id } = useParams();
  const { blogs } = useSelector((state) => state.blogs);
  let currentBlog = null;

  if (Array.isArray(blogs)) {
    currentBlog = blogs.find((blog) => blog._id === _id);
  }
  return (
    <Page title="Blog: Post Details | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: sentenceCase(_id) }
          ]}
        />

        {currentBlog && (
          <Card>
            <BlogPostHero post={currentBlog} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {currentBlog.description}
              </Typography>

              <Markdown children={currentBlog.content} />

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={currentBlog} />
                <Divider />
              </Box>

              {/* <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="h4">Comments</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({currentBlog.comments})
                </Typography>
              </Box> */}

              {/* <BlogPostCommentList post={currentBlog} /> */}

              {/* <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination count={8} color="primary" />
              </Box> */}

              {/* <BlogPostCommentForm /> */}
            </Box>
          </Card>
        )}

        {!currentBlog && SkeletonLoad}

        {currentBlog.length === 0 && <Typography variant="h6">404 Post not found</Typography>}

        {/* {recentPosts.length > 0 && <BlogPostRecent posts={recentPosts} />} */}
      </Container>
    </Page>
  );
}
