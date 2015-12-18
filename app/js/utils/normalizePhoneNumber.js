const INTERNAL_NUMBER_MASK = /^\d{4}$/;
const FORBIDDEN_CHARS = /[^0-9]/g
const EXTERNAL_NUMBER_PREFIX = 9;

export function normalizePhoneNumber(phoneString) {
	let phone = phoneString.replace(FORBIDDEN_CHARS, '');
	if (isInternalNumber(phone)){
		return phone;
	}

	return `${EXTERNAL_NUMBER_PREFIX}${phone}`;
}

function isInternalNumber(phone) {
	return INTERNAL_NUMBER_MASK.test(phone);
}
