import axios from "axios";
import { CompanyFormProps } from "../../models/CompanyFormProps";

axios.defaults.baseURL = "YOUR_API_URL";

const CompanyService = {
    async sendCompanyData(companyData: CompanyFormProps ) {
        console.log("Getting companies..");
    }
};

export default CompanyService;