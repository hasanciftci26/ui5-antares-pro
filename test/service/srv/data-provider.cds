using {
    Employees              as DBEmployees,
    Departments            as DBDepartments,
    Countries              as DBCountries,
    Companies              as DBCompanies,
    EmployeeCertifications as DBEmployeeCertifications,
    EmployeeContracts      as DBEmployeeContracts
} from '../db/data-models';

service CompanyManagement {
    entity Employees              as select from DBEmployees;
    entity Departments            as select from DBDepartments;
    entity Countries              as select from DBCountries;
    entity Companies              as select from DBCompanies;
    entity EmployeeCertifications as select from DBEmployeeCertifications;
    entity EmployeeContracts      as select from DBEmployeeContracts;
};
