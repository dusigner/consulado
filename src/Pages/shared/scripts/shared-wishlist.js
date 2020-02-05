const UtilShared = {
    encrypt(s) {
        return s.replace(/\-/gm, 'U2FsdGVkX186oi');
    },
    decrypt(s) {
        return s.replace(/\U2FsdGVkX186oi/gm, '-');
    },
}

module.exports = UtilShared;