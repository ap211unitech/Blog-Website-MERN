module.exports.validateRegisterInput = (
    email,
    name,
    password
) => {
    const errors = {};
    if (!name || name.trim() === '') {
        errors.fields = 'Please add all fields';
    }
    if (!email || email.trim() === '') {
        errors.fields = 'Please add all fields';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (!password || password === '') {
        errors.fields = 'Please add all fields';
    }
    else if (password.length < 6) {
        errors.password = 'Password must be length of greater than 6'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};
