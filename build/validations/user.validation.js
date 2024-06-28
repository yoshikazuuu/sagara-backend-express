"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDTO = void 0;
const class_validator_1 = require("class-validator");
const passwordRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\\?!@#$%^&*()\-_=+{};:,<>.]).{8,64}/;
let CustomPasswordValidator = class CustomPasswordValidator {
    validate(password, args) {
        return passwordRegex.test(password);
    }
    defaultMessage(args) {
        return 'Password must be 8-64 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.';
    }
};
CustomPasswordValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'customPassword', async: false })
], CustomPasswordValidator);
class LoginDTO {
}
exports.LoginDTO = LoginDTO;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], LoginDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(CustomPasswordValidator),
    __metadata("design:type", String)
], LoginDTO.prototype, "password", void 0);
