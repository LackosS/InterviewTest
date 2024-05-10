export interface CompanyFormProps {
    companyName: string;
    companyEmail: string;
    numberOfEmployees: string;
    companyDescription: string;
    employees: Employee[];
}

export interface Employee {
    name: string;
    email: string;
    jobTitle: string;
    age: number;
    cv: CV;
}

export interface CV {
    name: string;
    size: number;
    type: string;
}