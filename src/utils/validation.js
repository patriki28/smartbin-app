export const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);

export const isStrongPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
