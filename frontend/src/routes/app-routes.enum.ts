export const AppRoutesEnum = {
  HomeRoute: '/',
  RegisterRoute: '/register',

  /* For users */
  AccountSettingsRoute: '/account',
  NotificationsRoute: '/notifications',
  NotificationRoute: (id:string) => `/notifications/${id}`,
  NotificationPattern: '/notifications/:notificationId',

  /* Visa Requests */
  VisaRequestsRoute: '/visa-requests',
  VisaRequestRoute: '/visa-request',
  VisaRequestByStudentIdRoute: (id:string) => `/visa-requests/${id}`,
  VisaRequestPattern: '/visa-requests/:studentId',
  VisaRequestByVisaRequestIdPattern: '/visa-requests/:requestId',

  /* Student Documents */
  /* * For students * */
  DocumentsPassportRoute: '/documents/passport',
  DocumentsVisaRoute: '/documents/visa',
  DocumentsMigrationCardRoute: '/documents/migration-card',
  DocumentsArrivalNoticeRoute: '/documents/arrival-notice',
  DocumentsCloseRelativesRoute: '/documents/close-relatives',
  /* * For admins & employees * */
  StudentPassportRoute: (id:string) => `/students/${id}/passport`,
  StudentPassportPattern: '/students/:studentId/passport',
  StudentVisaRoute: (id:string) => `/students/${id}/visa`,
  StudentVisaPattern: '/students/:studentId/visa',
  StudentMigrationCardRoute: (id:string) => `/students/${id}/migration-card`,
  StudentMigrationCardPattern: '/students/:studentId/migration-card',
  StudentArrivalNoticeRoute: (id:string) => `/students/${id}/arrival-notice`,
  StudentArrivalNoticePattern: '/students/:studentId/arrival-notice',
  StudentCloseRelativesRoute: (id:string) => `/students/${id}/close-relatives`,
  StudentCloseRelativesPattern: '/students/:studentId/close-relatives',

  /* Students for admins & employees */
  StudentsRoute: '/students',
  StudentCreateRoute: '/students/create',
  StudentRoute: (id:string) => `/students/${id}`,
  StudentProfilePattern: '/students/:studentId',

  /* Employees for admins */
  EmployeesRoute: '/employees',
  EmployeeCreateRoute: '/employees/create',
  EmployeeRoute: (id:string) => `/employees/${id}`,
  EmployeePattern: '/employees/:employeeId',

  /* Admins */
  NotificationsSendRoute: '/notificationsSend',

  /* Not found */
  AnyRoute: '*',
} as const;
