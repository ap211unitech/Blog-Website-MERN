module.exports.validateRegisterInput = (
    email,
    name,
    password
) => {
    const errors = {};
    if (!name || name.trim() === '') {
        errors.name = 'Name must not be empty';
    }
    if (!email || email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (!password || password === '') {
        errors.password = 'Password must not empty';
    }
    else if (password.length < 6) {
        errors.password = 'Password must be length of greater than 6'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (email, password) => {
    const errors = {};
    if (!email || email.trim() === '') {
        errors.username = 'Email must not be empty';
    }
    if (!password || password.trim() === '') {
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};