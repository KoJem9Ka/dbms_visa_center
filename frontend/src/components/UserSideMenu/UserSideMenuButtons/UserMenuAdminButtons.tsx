import { FC } from 'react';
import {
  Divider, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import PortraitIcon from '@mui/icons-material/Portrait';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import { navigateFromMenu } from '../user-side-menu-store.ts';
import { AppRoutesEnum } from '../../../routes/app-routes.enum.ts';

export const UserMenuAdminButtons: FC = () => (
  <>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.NotificationsRoute)}>
        <ListItemIcon><NotificationsIcon /></ListItemIcon>
        <ListItemText primary='Уведомления' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.NotificationsSendRoute)}>
        <ListItemIcon><EmailIcon /></ListItemIcon>
        <ListItemText primary='Рассылка' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.VisaRequestsRoute)}>
        <ListItemIcon><PortraitIcon /></ListItemIcon>
        <ListItemText primary='Визовые анкеты' />
      </ListItemButton>
    </ListItem>
    <Divider className='!mt-4 !mb-2'>Пользователи</Divider>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.EmployeesRoute)}>
        <ListItemIcon><BadgeIcon /></ListItemIcon>
        <ListItemText primary='Сотрудники' />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigateFromMenu(AppRoutesEnum.StudentsRoute)}>
        <ListItemIcon><SchoolIcon /></ListItemIcon>
        <ListItemText primary='Студенты' />
      </ListItemButton>
    </ListItem>
  </>
);
