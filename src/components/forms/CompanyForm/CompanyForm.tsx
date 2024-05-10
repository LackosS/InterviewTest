import { Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import JsonModalViewer from '../../modals/JsonModalViewer';
import { useState } from 'react';
import { CompanyFormProps, Employee } from '../../../models/CompanyFormProps';
import CompanyService from '../../../services/CompanyService/CompanyService';
import CompanyFormValidationSchema from './CompanyFormValidationSchema';

interface InnerFormikProps {
    values: CompanyFormProps;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => any;
}
const jobTitles = ['Choose a job','accountant', 'software developer', 'software tester', 'manager'] as const;

function CompanyForm() {
    const [jsonData, setJsonData] = useState<CompanyFormProps>({
        companyName: '', 
        companyEmail: '', 
        numberOfEmployees: '', 
        companyDescription: '', 
        employees: []
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleNumberOfEmployeesChange = (event: {target: {value: any}}, CompanyFormData: InnerFormikProps) => {
        const { value } = event.target;
        const { values, setFieldValue } = CompanyFormData;
        const currentNumberOfEmployees = values.employees.length;
        const newNumberOfEmployees = +value;
        const emptyEmployee = { name: '', email: '', jobTitle: '', age: '', cv: null };

        if (newNumberOfEmployees < currentNumberOfEmployees) {
            const updatedEmployees = values.employees.slice(0, newNumberOfEmployees);
            setFieldValue('employees', updatedEmployees);
        } else {
            const employeesToAdd = newNumberOfEmployees - currentNumberOfEmployees;
            for (let i = 0; i < employeesToAdd; i++) {
                values.employees.push(emptyEmployee as never);
            }
            const updatedEmployees = [...values.employees];
            setFieldValue('employees', updatedEmployees);
        }
        setFieldValue('numberOfEmployees', value);
    }

    const handleEmployeeChange = (event: React.ChangeEvent<HTMLInputElement>, CompanyFormData: InnerFormikProps, index: number) => {
        const { setFieldValue } = CompanyFormData;
        if (event.target.files) {
            setFieldValue(`employees.${index}.cv`, event.target.files[0]);
        }
    }
    
    const sendData = async (jsonData: CompanyFormProps) => {
        await CompanyService.sendCompanyData(jsonData).then(() => {
                console.log("Data sent successfully");
            }
            ).catch((error) => {
                console.log("Error sending data", error);
            }).finally(() => {
                console.log("Data sent");
            }
        );
    }

    const handleOnSubmit = (values: CompanyFormProps) => {
        const jsonDataMapped : CompanyFormProps = {
            companyName: values.companyName,
            companyEmail: values.companyEmail,
            numberOfEmployees: values.numberOfEmployees,
            companyDescription: values.companyDescription,
            employees: values.employees.map((employee: Employee) => {
                return {
                    name: employee.name,
                    email: employee.email,
                    jobTitle: employee.jobTitle,
                    age: employee.age,
                    cv: {
                        name: employee.cv.name,
                        size: employee.cv.size,
                        type: employee.cv.type
                    }
                };
            }),
        };
        setJsonData(jsonDataMapped);
        setModalIsOpen(true);
        sendData(jsonDataMapped);
    };

    function renderEmployeeForm({ values, setFieldValue }: InnerFormikProps) {
       return (
       <FieldArray
            name="employees"
            render={() => (
                values.employees && values.employees.length > 0 ? (
                    values.employees.map((employee, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-lg font-bold">Employee {index + 1}</h3>
                            <label 
                                htmlFor={`employees.${index}.name`} 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Name
                            </label>
                            <Field 
                                name={`employees.${index}.name`} 
                                type="text" 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                />
                            <ErrorMessage 
                                name={`employees.${index}.name`} 
                                component="div" 
                                className="text-red-500 text-xs italic" 
                                />

                            <label 
                                htmlFor={`employees.${index}.email`} 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Email
                            </label>
                            <Field 
                                name={`employees.${index}.email`} 
                                type="email" 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                />
                            <ErrorMessage 
                                name={`employees.${index}.email`} 
                                component="div" 
                                className="text-red-500 text-xs italic" 
                                />

                            <label 
                                htmlFor={`employees.${index}.jobTitle`} 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Job Title
                            </label>
                            <Field 
                                as="select" 
                                name={`employees.${index}.jobTitle`}
                                 className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                 >
                                {jobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                            </Field>
                            <ErrorMessage 
                                name={`employees.${index}.jobTitle`} 
                                component="div" 
                                className="text-red-500 text-xs italic" 
                                />

                            <label 
                                htmlFor={`employees.${index}.age`} 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Age
                            </label>
                            <Field 
                                name={`employees.${index}.age`} 
                                type="number" 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                />
                            <ErrorMessage 
                                name={`employees.${index}.age`} 
                                component="div" 
                                className="text-red-500 text-xs italic" 
                                />

                            <label 
                                htmlFor={`employees.${index}.cv`} 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    CV
                            </label>
                            <input 
                                id={`employees.${index}.cv`} 
                                name={`employees.${index}.cv`} 
                                type="file" accept='.pdf' 
                                className="block w-full text-sm text-gray-700 bg-white border border-gray-400 cursor-pointer focus:outline-none focus:border-gray-500" 
                                onChange={(event)=>handleEmployeeChange(event,{values,setFieldValue},index)} 
                                />
                            <ErrorMessage 
                                name={`employees.${index}.cv`} 
                                component="div" 
                                className="text-red-500 text-xs italic" />
                        </div>
                    ))
                ) : null
            )} />
        );
    }
    function innerFormik ({ values, setFieldValue }: InnerFormikProps) {
        return <Form className="space-y-6 bg-white p-8 shadow-md rounded-lg">
            <div className="mb-4">
                <label htmlFor="companyName" 
                       className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Company Name
                </label>
                <Field 
                    name="companyName" 
                    type="text" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     />
                <ErrorMessage 
                    name="companyName" 
                    component="div" 
                    className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
                <label htmlFor="companyEmail" 
                       className="block text-gray-700 text-sm font-bold mb-2"
                       >
                        Company Email
                </label>
                <Field 
                    name="companyEmail" 
                    type="email" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                <ErrorMessage 
                    name="companyEmail" 
                    component="div" 
                    className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
                <label 
                    htmlFor="numberOfEmployees" 
                    className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Number of Employees
                </label>
                <Field 
                    name="numberOfEmployees" 
                    type="number" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    onChange={(event:{target: {value: any}})=>handleNumberOfEmployeesChange(event,{values,setFieldValue})}
                />
                <ErrorMessage 
                    name="numberOfEmployees" 
                    component="div" 
                    className="text-red-500 text-xs italic" 
                />
            </div>
            <div className="mb-4">
                <label 
                    htmlFor="companyDescription" 
                    className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Description
                </label>
                <Field 
                    name="companyDescription" 
                    as="textarea" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
            </div>
            {renderEmployeeForm({ values, setFieldValue })}
            <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                >
                    Submit
            </button>
        </Form>
    };

    return (
        <>
            <Formik
                initialValues={{
                    companyName: '',
                    companyEmail: '',
                    numberOfEmployees: '',
                    companyDescription: '',
                    employees: [],
                }}
                validationSchema={CompanyFormValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleOnSubmit(values);
                    setSubmitting(false);
                }}
            >
                {innerFormik}
            </Formik>
            <JsonModalViewer 
                jsonData={jsonData} 
                modalIsOpen={modalIsOpen} 
                setModalIsOpen={setModalIsOpen} 
            />
        </>
    );
};

export default CompanyForm;
