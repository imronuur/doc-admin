import { useState } from 'react';
// material
import { capitalCase } from 'change-case';
//
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';

import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSettings from '../../../hooks/useSettings';

import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { PATH_ADMIN } from '../../../routes/paths';

import { Profile, ProfileCover } from './components';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

export default function UsersProfile() {
  const params = useParams();
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('profile');

  const { _id } = params;
  const { user } = useSelector((state) => ({ ...state }));
  const { users } = user;

  let currentUser = null;

  if (Array.isArray(users.data)) {
    currentUser = users.data.find((user) => user._id === _id);
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <Profile currentUser={currentUser} />
    }
  ];

  return (
    <Page title="User |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`User Profile - ${currentUser.name}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Roles Directory', href: PATH_ADMIN.directories.users },
            { name: currentUser?.name || '' }
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover currentUser={currentUser} />
          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={handleChangeTab}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
