declare module 'bsv' {
  export class PrivateKey {
    static fromWIF(wif: string): PrivateKey;
    toAddress(): Address;
    toPublicKey(): PublicKey;
  }

  export class PublicKey {
    toString(): string;
  }

  export class Address {
    toString(): string;
  }

  export class Script {
    static fromAddress(address: string | Address): Script;
    static buildDataOut(data: (string | Buffer)[]): Script;
    toHex(): string;
    add(script: Script): Script;
  }

  export class Transaction {
    constructor();
    from(utxo: {
      txId: string;
      outputIndex: number;
      script: string;
      satoshis: number;
    }): Transaction;
    to(address: string, satoshis: number): Transaction;
    addOutput(output: Transaction.Output): Transaction;
    sign(privateKey: PrivateKey): Transaction;
    serialize(): string;
    id: string;
  }

  export namespace Transaction {
    export class Output {
      constructor(options: { script: Script; satoshis: number });
    }
  }

  export default {
    PrivateKey,
    PublicKey,
    Address,
    Script,
    Transaction,
  };
}
