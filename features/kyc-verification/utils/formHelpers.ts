import { FormField, RequestParam, VerificationService } from "../types";

/**
 * Converts API validations to react-hook-form validation rules.
 * @param {RequestParam} param - The request parameter with validation rules
 * @returns {FormField['validations'] | undefined} React-hook-form compatible validation object or undefined
 */
const mapValidations = (
	param: RequestParam
): FormField["validations"] | undefined => {
	const validations: FormField["validations"] = {};

	if (param.is_required) {
		validations.required = `${param.label} is required`;
	}

	if (param.validations) {
		if (param.validations.pattern) {
			validations.pattern = {
				value: new RegExp(param.validations.pattern),
				message: `Invalid ${param.label} format`,
			};
		}
		if (param.validations.minLength) {
			validations.minLength = {
				value: param.validations.minLength,
				message: `${param.label} must be at least ${param.validations.minLength} characters`,
			};
		}
		if (param.validations.maxLength) {
			validations.maxLength = {
				value: param.validations.maxLength,
				message: `${param.label} must be at most ${param.validations.maxLength} characters`,
			};
		}
		if (param.validations.min !== undefined) {
			validations.min = {
				value: param.validations.min,
				message: `${param.label} must be at least ${param.validations.min}`,
			};
		}
		if (param.validations.max !== undefined) {
			validations.max = {
				value: param.validations.max,
				message: `${param.label} must be at most ${param.validations.max}`,
			};
		}
	}

	return Object.keys(validations).length > 0 ? validations : undefined;
};

/**
 * Merges parameters from multiple services, tracking which service(s) require each param.
 * Deduplicates parameters by name and aggregates requiredBy arrays.
 * @param {VerificationService[]} services - Array of services to merge parameters from
 * @returns {FormField[]} Deduplicated array of form fields with requiredBy metadata
 */
export const mergeServiceParams = (
	services: VerificationService[]
): FormField[] => {
	const paramMap = new Map<string, FormField>();

	services.forEach((service) => {
		service.requestParams.forEach((param) => {
			// Skip internal params like eko_tid
			if (param.name === "eko_tid") return;

			if (paramMap.has(param.name)) {
				// Param already exists, add this service to requiredBy
				const existing = paramMap.get(param.name)!;
				if (!existing.requiredBy?.includes(service.name)) {
					existing.requiredBy = [
						...(existing.requiredBy || []),
						service.name,
					];

					// 2. Update helperText dynamically as we find more services
					if (services.length > 1) {
						existing.helperText = `Required by: ${existing.requiredBy.join(", ")}`;
					}
				}
			} else {
				// New param
				paramMap.set(param.name, {
					name: param.name,
					label: param.label,
					required: param.is_required === 1,
					parameter_type_id: param.type,
					validations: mapValidations(param),
					placeholder: param.placeholder,
					requiredBy: [service.name],
					helperText:
						services.length > 1
							? `Required by: ${service.name}`
							: undefined,
				});
			}
		});
	});

	return Array.from(paramMap.values());
};
