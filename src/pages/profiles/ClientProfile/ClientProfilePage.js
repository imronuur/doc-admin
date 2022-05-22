// material
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import { capitalCase } from 'change-case';

import roundAccountBox from '@iconify/icons-ic/round-account-box';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';

import { PATH_ADMIN } from '../../../routes/paths';
// import { ClientAbout } from './components';
import { Profile, ProfileCover } from './components';
// --------------------------------------------
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

export default function RouteProfilePage() {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { _id } = params;
  const { client, order } = useSelector((state) => ({ ...state }));
  const { clients } = client;
  const { orders } = order;

  let currentClient = null;
  let currentOrder = null;
  if (Array.isArray(clients.data)) {
    currentClient = clients.data.find((client) => client._id === _id);
  }
  if (Array.isArray(orders.data)) {
    currentOrder = orders.data.find((order) => order?.orderTo === currentClient._id);
  }
  console.log(currentOrder);
  const [currentTab, setCurrentTab] = useState('profile');

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <Profile currentUser={currentClient} currentOrder={currentOrder} />
    }
  ];
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <Page title="Client |  iDAN">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Client Profile -  ${currentClient?.name}`}
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'Profiles Directory', href: PATH_ADMIN.directories.clients },
            { name: currentClient?.name || '' }
          ]}
        />

        {/* <ClientAbout client={currentClient} order={currentOrder} /> */}
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover currentUser={currentClient} />
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
