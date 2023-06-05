export const arrivalNoticeMarkup = {
  passport: [
    {
      originalName: 'Фамилия',
      type: 'string',
      field: 'lastName',
      startCell: 'N11',
      length: 3,
      count: 27,
      step: 4,
    },
    {
      originalName: 'Имя',
      type: 'string',
      field: 'firstName',
      startCell: 'N13',
      length: 3,
      count: 27,
      step: 4,
    },
    {
      originalName: 'Отчество',
      type: 'string',
      field: 'patronymic',
      startCell: 'Z15',
      length: 3,
      count: 24,
      step: 4,
    },
    {
      originalName: 'Гражданство, подданство',
      type: 'string',
      field: 'citizenship',
      startCell: 'V17',
      length: 3,
      count: 25,
      step: 4,
    },
    {
      originalName: 'Дата рождения',
      type: 'date',
      field: 'birthDate',
      day: {
        startCell: 'AD20',
        length: 3,
        count: 2,
        step: 4,
      },
      month: {
        startCell: 'AT20',
        length: 3,
        count: 2,
        step: 4,
      },
      year: {
        startCell: 'BF20',
        length: 3,
        count: 4,
        step: 4,
      },
    },
    {
      originalName: 'Пол: мужской',
      type: 'check',
      alias: 'genderMale',
      field: 'gender',
      startCell: 'CL20',
      length: 3,
      count: 1,
      step: 0,
    },
    {
      originalName: 'женский',
      type: 'check',
      alias: 'genderFemale',
      field: 'gender',
      startCell: 'DB20',
      length: 3,
      count: 1,
      step: 0,
    },
    {
      originalName: 'Место рождения: государство, город или другой населенный пункт',
      type: 'rows',
      field: 'birthPlace',
      rows: [
        {
          index: 1,
          startCell: 'Z22',
          length: 3,
          count: 24,
          step: 4,
        },
        {
          index: 2,
          startCell: 'Z24',
          length: 3,
          count: 24,
          step: 4,
        },
        {
          index: 3,
          startCell: 'Z26',
          length: 3,
          count: 24,
          step: 4,
        },
      ],
    },
    {
      originalName: 'серия',
      type: 'string',
      field: 'series',
      startCell: 'BF28',
      length: 3,
      count: 4,
      step: 4,
    },
    {
      originalName: '№',
      type: 'string',
      field: 'number',
      startCell: 'BF28',
      length: 3,
      count: 11,
      step: 4,
    },
    {
      originalName: '№',
      type: 'string',
      field: 'number',
      startCell: 'BF28',
      length: 3,
      count: 11,
      step: 4,
    },
    {
      originalName: 'Дата выдачи',
      type: 'date',
      field: 'issueDate',
      day: {
        startCell: 'I30',
        length: 3,
        count: 2,
        step: 4,
      },
      month: {
        startCell: 'Z30',
        length: 3,
        count: 2,
        step: 4,
      },
      year: {
        startCell: 'AL30',
        length: 3,
        count: 4,
        step: 4,
      },
    },
    {
      originalName: 'Срок действия до',
      type: 'date',
      field: 'expirationDate',
      day: {
        startCell: 'BN30',
        length: 3,
        count: 2,
        step: 4,
      },
      month: {
        startCell: 'CD30',
        length: 3,
        count: 2,
        step: 4,
      },
      year: {
        startCell: 'CP30',
        length: 3,
        count: 4,
        step: 4,
      },
    },
  ],
  visa: [
    {
      originalName: 'серия',
      type: 'string',
      field: 'blankSeries',
      startCell: 'J36',
      length: 3,
      count: 4,
      step: 4,
    },
    {
      originalName: '№',
      type: 'string',
      field: 'number',
      startCell: 'AD36',
      length: 3,
      count: 15,
      step: 4,
    },
    {
      originalName: 'Дата выдачи',
      type: 'date',
      field: 'issueDate',
      day: {
        startCell: 'I38',
        length: 3,
        count: 2,
        step: 4,
      },
      month: {
        startCell: 'Z38',
        length: 3,
        count: 2,
        step: 4,
      },
      year: {
        startCell: 'AL38',
        length: 3,
        count: 4,
        step: 4,
      },
    },
    {
      originalName: 'Срок действия до',
      type: 'date',
      field: 'expirationDate',
      day: {
        startCell: 'BN38',
        length: 3,
        count: 2,
        step: 4,
      },
      month: {
        startCell: 'CD38',
        length: 3,
        count: 2,
        step: 4,
      },
      year: {
        startCell: 'CP38',
        length: 3,
        count: 4,
        step: 4,
      },
    },
  ],
  migrationCard: [
    {
      originalName: 'Серия',
      type: 'string',
      field: 'series',
      startCell: 'AP48',
      length: 3,
      count: 4,
      step: 4,
    },
    {
      originalName: '№',
      type: 'string',
      field: 'number',
      startCell: 'BJ48',
      length: 3,
      count: 11,
      step: 4,
    },
  ],
} as const;