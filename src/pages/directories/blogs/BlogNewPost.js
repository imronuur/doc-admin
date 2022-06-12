import { useNavigate } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// routes
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { createOrUpdateBlog } from '../../../redux/thunk/blogThunk';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { BlogNewPostForm } from './blog';
import { PATH_ADMIN } from '../../../routes/paths';
import Page from '../../../components/Page';
// hooks
import useSettings from '../../../hooks/useSettings';
// components

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { token, user } = useSelector((state) => state.auth);

  const handleCreateBlog = async (article) => {
    const reqObject = {
      article,
      accessToken: token
    };
    const res = await dispatch(createOrUpdateBlog(reqObject));
    if (res.type === 'article/create/fulfilled') {
      enqueueSnackbar('Blog created successfully', { variant: 'success' });
      navigate(`${PATH_ADMIN.directories.blogs}`);
    } else if (res.type === 'article/create/rejected') {
      enqueueSnackbar(`${res.error.message}`, { variant: 'error' });
    }
  };

  return (
    <Page title="Blog: New Post | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Blog', href: PATH_ADMIN.directories.blogs },
            { name: 'New Post' }
          ]}
        />

        <BlogNewPostForm onCreateBlog={handleCreateBlog} user={user} />
      </Container>
    </Page>
  );
}
