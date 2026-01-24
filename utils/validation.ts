export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export const validateWhatsApp = (phone: string) => {
    // Validates international format or 10-digit Indian numbers
    return String(phone).match(/^(?:(?:\+|0{0,2})91(\s*[\\-]\s*)?|[0]?)?[6789]\d{9}$/);
};

export const validatePincode = (pincode: string) => {
    return String(pincode).match(/^[1-9][0-9]{5}$/); // Standard Indian Pincode
};