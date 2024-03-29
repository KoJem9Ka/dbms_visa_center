import { FC } from 'react';
import {
  Divider, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import PortraitIcon from '@mui/icons-material/Portrait';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import BadgeIcon from '@mui/icons-material/Badge';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { AppRoutesEnum } from '../../../routes/app-routes.enum.ts';

import { navigateFromMenu } from '../user-side-menu-store.ts';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const UserMenuStudentButtons: FC = () => (
  <>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.NotificationsRoute)}>
        <ListItemIcon><NotificationsIcon /></ListItemIcon>
        <ListItemText primary='Уведомления' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.VisaRequestRoute)}>
        <ListItemIcon><PortraitIcon /></ListItemIcon>
        <ListItemText primary='Визовая анкета' />
      </ListItemButton>
    </ListItem>
    <Divider className='!mt-4 !mb-2'>Документы</Divider>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.DocumentsPassportRoute)}>
        <ListItemIcon><PortraitIcon /></ListItemIcon>
        <ListItemText primary='Паспорт' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.DocumentsMigrationCardRoute)}>
        <ListItemIcon><RecentActorsIcon /></ListItemIcon>
        <ListItemText primary='Миграционная карта' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.DocumentsArrivalNoticeRoute)}>
        <ListItemIcon><FlightLandIcon /></ListItemIcon>
        <ListItemText primary='Уведомление о прибытии' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.DocumentsVisaRoute)}>
        <ListItemIcon><BadgeIcon /></ListItemIcon>
        <ListItemText primary='Виза' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.DocumentsCloseRelativesRoute)}>
        <ListItemIcon><FamilyRestroomIcon /></ListItemIcon>
        <ListItemText primary='Ближайшие родственники' />
      </ListItemButton>
    </ListItem>
  </>
);
