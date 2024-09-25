export type verificationType  = {
    customerName:string;
    customerType:string;
    phoneNumber:string
    signupDate:Date
    IdVerificationStatus:string
    userId:string
}
export type recoveryType  = {
    customerName:string;
    logo:string;
    customerType:string;
    phoneNumber:string
    signupDate:Date
    IdVerificationStatus:string;
    userId:string;
    recovery_request_type:string
}
export type docs  = {
    userId:string;
    certificateOfLocation:string;
    certificateOfIncorporation:string;
    UtilityBill:string;
    businessContactSignature:string;
    IdVerificationStatus:string;
    businessContactId:string;
    other_docs:string
}
export type businessInfo  = {
    userId:string;
    Business_Address:string;
    business_registration_no:string;
    business_size:string;
   
}