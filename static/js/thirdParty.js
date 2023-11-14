const parseAndDisplayErrors = function (errors, validErrors) {
    console.assert(typeof errors === 'object' && Array.isArray(validErrors))
    const validatedErrors = Object.keys(errors).filter(error => validErrors.includes(error))
    for (const error of validatedErrors) {
        document.getElementById(`${error}Error`).innerHTML = errors[error]
        document.getElementById(`${error}Input`).classList.add('is-invalid')
    }
}

const hideErrors = function () {
    document.querySelectorAll('[id$=Input]').forEach(input => input.classList.remove('is-invalid'))
}