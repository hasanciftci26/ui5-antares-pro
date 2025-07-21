entity Employees {
    key ID               : UUID;
        firstName        : String(40);
        lastName         : type of firstName;
        countryCode      : Countries:code;
        departmentID     : Departments:ID;
        dateOfBirth      : Date;
        hireDate         : DateTime;
        salary           : Decimal(13, 2);
        level            : Integer;
        isActive         : Boolean;
        workingStartTime : Time;
        totalExperience  : Integer64;
        contractSignedAt : Timestamp;
        toCountry        : Association[1..1] to Countries
                               on toCountry.code = $self.countryCode;
        toDepartment     : Association[1..1] to Departments
                               on toDepartment.ID = $self.departmentID;
        toCertifications : Composition[0.. * ] of EmployeeCertifications
                               on toCertifications.toEmployee = $self;
        toContract       : Composition[1..1] of EmployeeContracts
                               on toContract.employeeID = $self.ID;
};

entity Departments {
    key ID          : String(20);
        name        : String(80);
        companyCode : Companies:code;
        toEmployees : Association[0.. * ] to Employees
                          on toEmployees.toDepartment = $self;
        toCompany   : Association[1..1] to Companies
                          on toCompany.code = $self.companyCode;
};

entity Countries {
    key code : String(2);
        name : String(80);
};

entity Companies {
    key code          : String(10);
        name          : String(80);
        countryCode   : Countries:code;
        toDepartments : Composition[0.. * ] of Departments
                            on toDepartments.toCompany = $self;
        toCountry     : Association[1..1] to Countries
                            on toCountry.code = $self.countryCode;
};

entity EmployeeCertifications {
    key ID         : UUID;
        employeeID : Employees:ID;
        title      : String(100);
        authority  : String(100);
        issuedDate : Date;
        expiryDate : Date;
        score      : Integer;
        toEmployee : Association[1..1] to Employees
                         on toEmployee.ID = employeeID;
};

entity EmployeeContracts {
    key employeeID       : Employees:ID;
        contractType     : String(20) enum {
            PERMANENT = 'Permanent';
            CONTRACTOR = 'Contractor';
            INTERN = 'Intern';
        };
        contractStart    : Date;
        contractEnd      : Date;
        weeklyHours      : Integer;
        unionMember      : Boolean;
        noticePeriodDays : Integer;
        benefitsPackage  : String(50) enum {
            STANDARD = 'Standard';
            ENHANCED = 'Enhanced';
            EXECUTIVE = 'Executive';
            FLEXIBLE = 'Flexible';
            NONE = 'None';
            FAMILY = 'Family';
            INTERN = 'Intern';
            REMOTE = 'Remote';
        };
        toEmployee       : Association[1..1] to Employees
                               on toEmployee.ID = $self.employeeID;
};
