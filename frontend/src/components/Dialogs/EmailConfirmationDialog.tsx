import { FC, useEffect } from 'react';
import {
  Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { cloneDeep } from 'lodash';
import { useEmailConfirmByCodeMutation, useSendConfirmationCodeMutation } from '../../api/generated';

const initialState = {
  email: '' as string,
  isEmailConfirmed: false as boolean,
  isOpen: false as boolean,
  code: '' as string,
  status: undefined as string | Error | undefined,
  resetDialog: undefined as (() => void) | undefined,
};

export const useEmailConfirmationDialog = create(combine(cloneDeep(initialState), (setState, getState) => ({
  open: (email: string) => setState({
    ...cloneDeep(initialState),
    email,
    isOpen: true,
  }),
  close: () => setState({ isOpen: false }),
  confirm: () => setState({ isEmailConfirmed: true, isOpen: false, status: 'Почта подтверждена!' }),
  reset: () => {
    getState().resetDialog?.();
    setState(cloneDeep(initialState));
  },
  setCode: (code: string) => setState({ code }),
  setStatus: (status: string | Error | undefined) => setState({ status }),
  setOnResetDialogFn: (resetDialog: () => void) => setState({ resetDialog }),
})));

export const EmailConfirmationDialog: FC = () => {
  const dialog = useEmailConfirmationDialog();
  const [confirmCode, confirmMutation] = useEmailConfirmByCodeMutation({
    variables: { email: dialog.email, code: dialog.code },
    fetchPolicy: 'network-only',
    onCompleted: dialog.confirm,
    onError: dialog.setStatus,
  });
  const [sendConfirmCode, sendMutation] = useSendConfirmationCodeMutation({
    variables: { email: dialog.email },
    fetchPolicy: 'network-only',
    onCompleted: () => dialog.setStatus(`Код отправлен на почту ${dialog.email}`),
    onError: dialog.setStatus,
  });

  useEffect(() => {
    if (dialog.isOpen && !sendMutation.called) {
      sendConfirmCode();
      dialog.setOnResetDialogFn(() => {
        sendMutation.reset();
        confirmMutation.reset();
      });
    }
    // return () => dialog.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.isOpen]);

  return (
    <Dialog
      maxWidth='xs'
      open={dialog.isOpen}
      TransitionComponent={Grow}
      transitionDuration={500}
      fullWidth
      onClose={dialog.close}
    >
      <DialogTitle className='flex items-center'>
        <Typography className='grow inline' component='span' variant='h6'>Подтверждение почты</Typography>
        <IconButton onClick={dialog.close}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className='flex flex-col' dividers>
        <Collapse in={!!dialog.status}>
          <Alert className='mb-6' severity={typeof dialog.status === 'string' ? 'info' : 'error'} variant='filled'>
            {typeof dialog.status === 'string' ? dialog.status : dialog.status?.message}
          </Alert>
        </Collapse>
        <TextField
          disabled={!sendMutation.called}
          helperText='Код подтверждения, отправленный на почту'
          label='Код подтверждения'
          placeholder='123456'
          value={dialog.code}
          onChange={e => dialog.setCode(e.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions className='flex'>
        <Button
          className='grow'
          color='warning'
          disabled={sendMutation.loading}
          onClick={() => sendConfirmCode()}
        >
          {sendMutation.called ? 'Отправить код повторно' : 'Отправить код'}
        </Button>
        <Button
          className='grow'
          disabled={dialog.code.length < 6 || !sendMutation.called || sendMutation.loading || confirmMutation.loading}
          variant='contained'
          onClick={() => confirmCode()}
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
