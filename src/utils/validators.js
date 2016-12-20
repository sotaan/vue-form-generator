import { isNil, isNumber, isString, isArray } from "lodash";
import moment from "moment";

function checkEmpty(value, required) {
	if (isNil(value) || value === "") {
		if (required)
			return [msg(resources.fieldIsRequired)];
		else
			return [];
	}
	return null;
}

function msg(text) {
	if (text != null && arguments.length > 1)
		for (let i = 1; i < arguments.length; i++)
			text = text.replace(/\{\d+?\}/, arguments[i]);

	return text;
}

let resources = {
	fieldIsRequired: "Champs obligatoire",
	invalidFormat: "Format invalide",

	numberTooSmall: "Le numéro est trop petit ! Minimum: {0}",
	numberTooBig: "Le numéro est trop grand ! Maximum: {0}",
	invalidNumber: "Numéro Invalide",

	textTooSmall: "La longueur du texte est trop petite ! Actuellement : {0}, Minimum : {1}",
	textTooBig: "La longueur du texte est trop grande ! Actuellement: {0}, Maximum: {1}",
	thisNotText: "Ce n’est pas du texte !",

	thisNotArray: "Ce n’est pas un tableau !",

	selectMinItems: "Sélectionnez un minimum {0} d’éléments !",
	selectMaxItems: "Sélectionnez un maximum {0} d’éléments !",

	invalidDate: "Date invalide !",
	dateIsEarly: "La date est trop tôt ! Actuellement : {0}, Minimum: {1}",
	dateIsLate: "La date est trop tard ! Actuellement : {0}, Maximum: {1}",

	invalidEmail: "Adresse email invalide !",
	invalidURL: "URL invalide !",

	invalidCard: "Format de carte invalide !",
	invalidCardNumber: "Numéro de carte invalide !",

	invalidTextContainNumber: "Texte invalide ! Ne peut contenir de chiffres ou caractères spéciaux !",
	invalidTextContainSpec: "Texte invalide ! Ne peut contenir de caractères spéciaux !"
};

module.exports = {

	resources,

	required(value, field) {
		return checkEmpty(value, field.required);
	},

	number(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let err = [];
		if (isNumber(value)) {
			if (!isNil(field.min) && value < field.min)
				err.push(msg(resources.numberTooSmall, field.min));

			if (!isNil(field.max) && value > field.max)
				err.push(msg(resources.numberTooBig, field.max));

		} else
			err.push(msg(resources.invalidNumber));

		return err;
	},

	integer(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		if (!(Number(value) === value && value % 1 === 0))
			return [msg(resources.invalidNumber)];
	},

	double(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		if (!(Number(value) === value && value % 1 !== 0))
			return [msg(resources.invalidNumber)];
	},

	string(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let err = [];
		if (isString(value)) {
			if (!isNil(field.min) && value.length < field.min)
				err.push(msg(resources.textTooSmall, value.length, field.min));

			if (!isNil(field.max) && value.length > field.max)
				err.push(msg(resources.textTooBig, value.length, field.max));

		} else
			err.push(msg(resources.thisNotText));

		return err;
	},

	array(value, field) {
		if (field.required) {

			if (!isArray(value))
				return [msg(resources.thisNotArray)];

			if (value.length == 0)
				return [msg(resources.fieldIsRequired)];
		}

		if (!isNil(value)) {
			if (!isNil(field.min))
				if (value.length < field.min)
					return [msg(resources.selectMinItems, field.min)];

			if (!isNil(field.max))
				if (value.length > field.max)
					return [msg(resources.selectMaxItems, field.max)];
		}
	},

	date(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let m = moment(value);
		if (!m.isValid())
			return [msg(resources.invalidDate)];

		let err = [];

		if (!isNil(field.min)) {
			let min = moment(field.min);
			if (m.isBefore(min))
				err.push(msg(resources.dateIsEarly, m.format("L"), min.format("L")));
		}

		if (!isNil(field.max)) {
			let max = moment(field.max);
			if (m.isAfter(max))
				err.push(msg(resources.dateIsLate, m.format("L"), max.format("L")));
		}

		return err;
	},

	regexp(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		if (!isNil(field.pattern)) {
			let re = new RegExp(field.pattern);
			if (!re.test(value))
				return [msg(resources.invalidFormat)];
		}
	},

	email(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(value))
			return [msg(resources.invalidEmail)];
	},

	url(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
		if (!re.test(value))
			return [msg(resources.invalidURL)];
	},

	creditCard(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		/*  From validator.js code
			https://github.com/chriso/validator.js/blob/master/src/lib/isCreditCard.js
		*/
		const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
		const sanitized = value.replace(/[^0-9]+/g, "");
		if (!creditCard.test(sanitized)) {
			return [msg(resources.invalidCard)];
		}
		let sum = 0;
		let digit;
		let tmpNum;
		let shouldDouble;
		for (let i = sanitized.length - 1; i >= 0; i--) {
			digit = sanitized.substring(i, (i + 1));
			tmpNum = parseInt(digit, 10);
			if (shouldDouble) {
				tmpNum *= 2;
				if (tmpNum >= 10) {
					sum += ((tmpNum % 10) + 1);
				} else {
					sum += tmpNum;
				}
			} else {
				sum += tmpNum;
			}
			shouldDouble = !shouldDouble;
		}

		if (!((sum % 10) === 0 ? sanitized : false))
			return [msg(resources.invalidCardNumber)];
	},

	alpha(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let re = /^[a-zA-Z]*$/;
		if (!re.test(value))
			return [msg(resources.invalidTextContainNumber)];
	},

	alphaNumeric(value, field) {
		let res = checkEmpty(value, field.required); if (res != null) return res;

		let re = /^[a-zA-Z0-9]*$/;
		if (!re.test(value))
			return [msg(resources.invalidTextContainSpec)];
	}
};
