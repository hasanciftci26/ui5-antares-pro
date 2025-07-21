using CompanyManagement from './data-provider';

annotate CompanyManagement.Countries with {
    code @Common.Label: 'Country Code';
    name @Common.Label: 'Country Name';
};

annotate CompanyManagement.Companies with {
    code          @Common.Label: 'Company Code';
    name          @Common.Label: 'Company Name';
    countryCode   @Common.Label: 'Country Code';
    toCountry     @Common.Label: 'Country of the Company';
    toDepartments @Common.Label: 'Company Departments';
};

annotate CompanyManagement.Departments with {
    ID          @Common.Label: 'Department ID';
    name        @Common.Label: 'Department Name';
    companyCode @Common.Label: 'Company Code';
    toCompany   @Common.Label: 'Company of the Department';
    toEmployees @Common.Label: 'Department Employees';
};

annotate CompanyManagement.EmployeeCertifications with {
    ID         @Common.Label: 'Certificate ID';
    employeeID @Common.Label: 'Employee ID';
    authority  @Common.Label: 'Authority';
    expiryDate @Common.Label: 'Expiry Date';
    issuedDate @Common.Label: 'Issued Date';
    score      @Common.Label: 'Score';
    title      @Common.Label: 'Certificate Title';
    toEmployee @Common.Label: 'Certificate Owner';
};

annotate CompanyManagement.EmployeeContracts with {
    employeeID       @Common.Label: 'Employee ID';
    benefitsPackage  @Common.Label: 'Benefits Package';
    contractEnd      @Common.Label: 'Contract End Date';
    contractStart    @Common.Label: 'Contract Start Date';
    contractType     @Common.Label: 'Contract Type';
    noticePeriodDays @Common.Label: 'Notice Period Days';
    unionMember      @Common.Label: 'Union Member';
    weeklyHours      @Common.Label: 'Weekly Hours';
    toEmployee       @Common.Label: 'Contract Owner';
};

annotate CompanyManagement.Employees with {
    ID               @Common.Label: 'Employee ID';
    firstName        @Common.Label: 'First Name';
    lastName         @Common.Label: 'Last Name';
    dateOfBirth      @Common.Label: 'Date of Birth';
    departmentID     @Common.Label: 'Department ID';
    countryCode      @Common.Label: 'Country Code';
    hireDate         @Common.Label: 'Hire Date';
    isActive         @Common.Label: 'Active';
    level            @Common.Label: 'Level';
    salary           @Common.Label: 'Salary';
    contractSignedAt @Common.Label: 'Contract Signed At';
    workingStartTime @Common.Label: 'Working Start Time';
    totalExperience  @Common.Label: 'Total Experience';
    toCountry        @Common.Label: 'Employee Country';
    toDepartment     @Common.Label: 'Employee Department';
    toCertifications @Common.Label: 'Employee Certifications';
    toContract       @Common.Label: 'Employee Contract';
};
