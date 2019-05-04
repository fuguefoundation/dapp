// The global database object will act as a mock database where we will store
// our pending multisig operations so that we can restore the operations when
// we need to sign them from another account.
const DATABASE = {
    operations: {},
};

module.exports = DATABASE;
