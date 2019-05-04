export class WalletInstance {
    address: String;
    chainId: Number;
    keystore: Promise<String>;
    mnemonic: String;
    derivationPath?: Promise<String>;
    otherAddresses: Array<String>;
    privateKey: String;
    publicKey: Promise<String>;
    type: String;
    subtype: String;
    // setDefaultAddress(addressIndex: Number): Promise<Boolean>;
    // sign(transactionObject: Object): Promise<String>;
    // signMessage(messageObject: Object): Promise<String>;
    // verifyMessage(verificationObject: Object): Promise<Boolean>;
    setDefaultAddress: Promise<Boolean>;
    sign: Promise<String>;
    signMessage: Promise<String>;
    verifyMessage: (verificationObject: Object) => Promise<Boolean>;    
}
