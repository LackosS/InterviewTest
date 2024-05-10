import * as Yup from 'yup';

const CompanyFormValidationSchema = Yup.object().shape({
    companyName: Yup.string()
        .required('Company name is required'),
    companyEmail: Yup.string()
        .required('Email adress is required')
        .email('Invalid email address'),
    numberOfEmployees: Yup.number()
        .positive()
        .integer()
        .min(1, "Number of employees must be greater or equal than 1")
        .max(100,"Number of employees must be lower or equal than 100")
        .required('Number of employees is required'),
    companyDescription: Yup.string(),
    employees: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Employee name is required'),
            email: Yup.string()
                .required('Email address is required')
                .email('Invalid email address'),
            jobTitle: Yup.string()
                .required('Job title is required')
                .test(
                    "jobTitle",
                    "Job title must be one of the following: accountat, software developer, software tester, manager",
                    value => ['accountant', 'software developer', 'software tester', 'manager'].includes(value as string)
                ),
            age: Yup.number()
                .required("Employee age is required")
                .positive()
                .integer()
                .min(18,"Employee must be at least 18 years old")
                .required('Employee must be at least 18 years old'),
            cv: Yup.mixed()
                .required("CV is required")
                .test(
                    "fileType",
                    "Only PDF files are allowed",
                    value => value && value instanceof File && value.type === "application/pdf"
                )
        })
    )
});

export default CompanyFormValidationSchema;