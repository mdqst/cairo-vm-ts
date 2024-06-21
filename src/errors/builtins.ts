import { SignatureType } from '@noble/curves/src/abstract/weierstrass';
import { ProjectivePoint } from '@scure/starknet';
import { Felt } from 'primitives/felt';

/** Errors related to builtins */
class BuiltinError extends Error {}

/** Value cannot be infered from undefined cell value */
export class UndefinedValue extends BuiltinError {
  constructor(offset: number) {
    super(
      `Value cannot be infered from undefined cell value at offset ${offset}`
    );
  }
}

/** Value is above Range Check upper bound */
export class RangeCheckOutOfBounds extends BuiltinError {
  constructor(value: Felt, boundExponent: bigint) {
    super(
      `Value 0x${value.toString()} is above Range Check upper bound 2^${boundExponent.toString()}`
    );
  }
}

/** ECDSA signature cannot be retrieved from dictionnary at `offset` */
export class UndefinedECDSASignature extends BuiltinError {
  constructor(offset: number) {
    super(
      `ECDSA signature cannot be retrieved from dictionnary at offset ${offset}`
    );
  }
}

/** The ECDSA verification of the signature has failed */
export class InvalidSignature extends BuiltinError {
  constructor(
    signature: SignatureType,
    msg: Felt,
    pubKeyPosHex: string,
    pubKeyNegHex: string
  ) {
    super(`The ECDSA verification of the signature has failed
signature: ${signature.toString()}
message: 0x${msg.toString(16)}
public key (positive): ${pubKeyPosHex}
public key (negative): ${pubKeyNegHex}
`);
  }
}

/** The signature dictionnary is undefined */
export class UndefinedSignatureDict extends BuiltinError {
  constructor() {
    super('The signature dictionnary is undefined');
  }
}

/** An offset of type number is expected */
export class ExpectedOffset extends BuiltinError {
  constructor(prop: any) {
    super(
      `The key to set a value to the segment is expected to be castable to number, received ${typeof prop}: ${prop}`
    );
  }
}

/** Ladder formula R = P + mQ failed in EcOp builtin */
export class LadderFailed extends BuiltinError {
  constructor(p: ProjectivePoint, q: ProjectivePoint, m: bigint) {
    super(`Ladder formula r = P + mQ failed in EcOp builtin
p: ${p.toHex}
q: ${q.toHex()}
m: 0x${m.toString(16)}`);
  }
}
