// Form validation utilities for authentication

export interface ValidationResult {
        isValid: boolean;
        error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
        if (!email.trim()) {
                return { isValid: false, error: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
                return { isValid: false, error: 'Please enter a valid email address' };
        }

        return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
        if (!password) {
                return { isValid: false, error: 'Password is required' };
        }

        if (password.length < 6) {
                return { isValid: false, error: 'Password must be at least 6 characters' };
        }

        return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
        if (!confirmPassword) {
                return { isValid: false, error: 'Please confirm your password' };
        }

        if (password !== confirmPassword) {
                return { isValid: false, error: 'Passwords do not match' };
        }

        return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
        if (!name.trim()) {
                return { isValid: false, error: 'Name is required' };
        }

        if (name.trim().length < 2) {
                return { isValid: false, error: 'Name must be at least 2 characters' };
        }

        return { isValid: true };
};

// Combined validation for signup form
export interface SignupFormData {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
}

export interface SignupFormErrors {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
}

export const validateSignupForm = (data: SignupFormData): { isValid: boolean; errors: SignupFormErrors } => {
        const errors: SignupFormErrors = {};

        const nameValidation = validateName(data.name);
        if (!nameValidation.isValid) {
                errors.name = nameValidation.error;
        }

        const emailValidation = validateEmail(data.email);
        if (!emailValidation.isValid) {
                errors.email = emailValidation.error;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
                errors.password = passwordValidation.error;
        }

        const confirmPasswordValidation = validateConfirmPassword(data.password, data.confirmPassword);
        if (!confirmPasswordValidation.isValid) {
                errors.confirmPassword = confirmPasswordValidation.error;
        }

        return {
                isValid: Object.keys(errors).length === 0,
                errors,
        };
};

// Combined validation for login form
export interface LoginFormData {
        email: string;
        password: string;
}

export interface LoginFormErrors {
        email?: string;
        password?: string;
}

export const validateLoginForm = (data: LoginFormData): { isValid: boolean; errors: LoginFormErrors } => {
        const errors: LoginFormErrors = {};

        const emailValidation = validateEmail(data.email);
        if (!emailValidation.isValid) {
                errors.email = emailValidation.error;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
                errors.password = passwordValidation.error;
        }

        return {
                isValid: Object.keys(errors).length === 0,
                errors,
        };
};
