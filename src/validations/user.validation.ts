import {
    IsString,
    MaxLength,
    IsEmail,
    Matches,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    Validate,
} from 'class-validator';

/**
 * - (?=.*\d) is checking for numbers between 0-9.
 * - (?=.*[A-Z]) is checking for uppercase characters.
 * - (?=.*[a-z]) is checking for lowercase characters.
 * - (?=.*[\\?!@#$%^&*()\-_=+{};:,<>.]) is checking for special characters.
 * - {8,64} means a minimum of 8 characters, and maximum of 64 characters.
 */
const passwordRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\\?!@#$%^&*()\-_=+{};:,<>.]).{8,64}/;

@ValidatorConstraint({ name: 'customPassword', async: false })
class CustomPasswordValidator implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        return passwordRegex.test(password);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Password must be 8-64 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.';
    }
}

export class LoginDTO {
    @IsEmail()
    @MaxLength(64)
    email!: string;

    @IsString()
    @Validate(CustomPasswordValidator)
    password!: string;
}
