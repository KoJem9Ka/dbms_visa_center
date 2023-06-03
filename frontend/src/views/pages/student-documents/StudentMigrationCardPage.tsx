import { FC } from 'react';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import {
  Button, IconButton, Paper, Stack, Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormikTextField } from '../../../components/forms/FormikTextField.tsx';
import {
  GStudentMigrationCardUpsertInput,
  InputMaybe,
  refetchStudentMigrationCardQuery,
  useStudentMigrationCardQuery,
  useStudentMigrationCardUpsertMutation,
} from '../../../api/generated.ts';

type IFormValue = Omit<GStudentMigrationCardUpsertInput, 'issueDate' | 'expirationDate'> & {
  issueDate?: InputMaybe<string>;
  expirationDate?: InputMaybe<string>;
};

type StudentMigrationCardPageParams = {
  studentId?: string;
};

const formSchema = yup.object({
  series: yup.number()
    .min(1000, 'Неправильный номер')
    .max(9999, 'Неправильный номер')
    .required('Обязательное поле')
    .typeError('Введите число'),
  number: yup.number()
    .min(1000, 'Неправильный номер')
    .max(99999999, 'Неправильный номер')
    .required('Обязательное поле')
    .typeError('Введите число'),
  issueDate: yup.date().required('Обязательное поле').min(new Date(1970, 0, 1), 'Неправильная дата').max(new Date(), 'Неправильная дата'),
  expirationDate: yup.date().min(new Date(), 'Неправильная дата').required('Обязательное поле'),
});

export const StudentMigrationCardPage: FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<StudentMigrationCardPageParams>();

  const [saveDocument] = useStudentMigrationCardUpsertMutation({
    refetchQueries: [refetchStudentMigrationCardQuery({ studentId })],
  });

  const { data: originalData } = useStudentMigrationCardQuery({
    variables: { studentId },
    fetchPolicy: 'network-only',
  });

  const formik = useFormik<IFormValue>({
    enableReinitialize: true,
    initialValues: {
      series: originalData?.studentMigrationCard?.series || '',
      number: originalData?.studentMigrationCard?.number || '',
      expirationDate: originalData?.studentMigrationCard?.expirationDate?.format('YYYY-MM-DD') || '',
      issueDate: originalData?.studentMigrationCard?.issueDate?.format('YYYY-MM-DD') || '',
    },
    validationSchema: formSchema,
    onSubmit: data => toast.promise(saveDocument({
      variables: {
        data: {
          ...data,
          issueDate: data.issueDate ? dayjs(data.issueDate) : undefined,
          expirationDate: data.expirationDate ? dayjs(data.expirationDate) : undefined,
        },
        studentId,
      },
    }), {
      pending: 'Сохранение данных...',
      success: 'Данные сохранены',
      error: { render: ({ data: err }) => `Ошибка сохранения данных: ${err}` },
    }),
  });

  return (
    <>
      <Stack
        alignItems='center'
        direction='row'
        display='flex'
        gap={2}
        justifyContent='center'
        marginBottom={1}
      >
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography align='center' fontWeight='500' variant='h5'>Миграционная карта</Typography>
      </Stack>
      <FormikProvider value={formik}>
        <Paper className='flex flex-col gap-4 px-10 py-4 pt-10 mx-auto max-w-lg'>
          <FormikTextField label='Серия' name='series' required />
          <FormikTextField label='Номер' name='number' required />
          <FormikTextField
            label='Дата выдачи'
            name='issueDate'
            type='date'
            required
          />
          <FormikTextField
            label='Дата истечения'
            name='expirationDate'
            type='date'
            required
          />
          <Stack direction='row' gap={2} justifyContent='flex-end'>
            <Button color='warning' variant='text' onClick={() => formik.resetForm()}>Сброс</Button>
            <Button disabled={formik.isSubmitting || !formik.dirty} onClick={formik.submitForm}>Сохранить</Button>
          </Stack>
        </Paper>
      </FormikProvider>
    </>
  );
};
