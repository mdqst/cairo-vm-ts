import { Felt } from './felt';
import { Uint32, UnsignedInteger } from './uint';
import {
  ForbiddenOperation,
  OffsetOverflow,
  OffsetUnderflow,
  PrimitiveError,
  SegmentError,
} from 'result/primitives';
import { Err, Result } from 'result/result';

export type MaybeRelocatable = Relocatable | Felt;

export class Relocatable {
  private segmentIndex: Uint32;
  private offset: Uint32;

  constructor(segmentIndex: number, offset: number) {
    const { value: segmentUint, error: indexErr } =
      UnsignedInteger.toUint32(segmentIndex);
    const { value: offsetUint, error: offsetErr } =
      UnsignedInteger.toUint32(offset);
    if (indexErr !== undefined) {
      throw indexErr;
    }
    if (offsetErr !== undefined) {
      throw offsetErr;
    }
    this.segmentIndex = segmentUint;
    this.offset = offsetUint;
  }

  add(other: Relocatable): Err;
  add(other: Felt | Uint32): Result<Relocatable>;
  add(other: MaybeRelocatable): Result<MaybeRelocatable>;

  add(other: MaybeRelocatable | Uint32): Result<MaybeRelocatable> {
    if (other instanceof Felt) {
      const { value: num, error } = other.toUint32();
      if (error !== undefined) {
        return { value: undefined, error };
      }

      if (this.getOffset() + num > UnsignedInteger.MAX_UINT32) {
        return {
          value: undefined,
          error: new PrimitiveError(OffsetOverflow),
        };
      }
      return {
        value: new Relocatable(this.getSegmentIndex(), this.getOffset() + num),
        error: undefined,
      };
    }

    if (other instanceof Relocatable) {
      return {
        value: undefined,
        error: new PrimitiveError(ForbiddenOperation),
      };
    }

    return {
      value: new Relocatable(this.getSegmentIndex(), this.getOffset() + other),
      error: undefined,
    };
  }

  sub(other: MaybeRelocatable): Result<MaybeRelocatable>;
  sub(other: Felt | Uint32): Result<Relocatable>;
  sub(other: Relocatable): Result<Felt>;

  sub(other: MaybeRelocatable | Uint32): Result<MaybeRelocatable> {
    if (other instanceof Felt) {
      const { value: delta, error } = other.toUint32();
      if (error !== undefined) {
        return { value: undefined, error };
      }

      if (this.getOffset() < delta) {
        return {
          value: undefined,
          error: new PrimitiveError(OffsetUnderflow),
        };
      }
      return {
        value: new Relocatable(
          this.getSegmentIndex(),
          this.getOffset() - delta
        ),
        error: undefined,
      };
    }

    if (other instanceof Relocatable) {
      if (this.offset < other.offset) {
        return {
          value: undefined,
          error: new PrimitiveError(OffsetUnderflow),
        };
      }

      if (this.segmentIndex !== other.segmentIndex) {
        return {
          value: undefined,
          error: new PrimitiveError(SegmentError),
        };
      }

      return {
        value: new Felt(BigInt(this.offset - other.offset)),
        error: undefined,
      };
    }

    if (this.getOffset() < other) {
      return {
        value: undefined,
        error: new PrimitiveError(OffsetUnderflow),
      };
    }

    return {
      value: new Relocatable(this.getSegmentIndex(), this.getOffset() - other),
      error: undefined,
    };
  }

  mul(_: MaybeRelocatable | Uint32): Err {
    return {
      value: undefined,
      error: new PrimitiveError(ForbiddenOperation),
    };
  }

  div(_: MaybeRelocatable | Uint32): Err {
    return {
      value: undefined,
      error: new PrimitiveError(ForbiddenOperation),
    };
  }

  eq(other: MaybeRelocatable): boolean {
    if (other instanceof Felt) {
      return false;
    }
    if (
      other.offset === this.offset &&
      other.segmentIndex === this.segmentIndex
    ) {
      return true;
    }
    return false;
  }

  getSegmentIndex(): Uint32 {
    return this.segmentIndex;
  }

  getOffset(): Uint32 {
    return this.offset;
  }

  static isRelocatable(
    maybeRelocatable: MaybeRelocatable
  ): maybeRelocatable is Relocatable {
    return maybeRelocatable instanceof Relocatable;
  }

  static getRelocatable(
    maybeRelocatable: MaybeRelocatable
  ): Relocatable | undefined {
    if (Relocatable.isRelocatable(maybeRelocatable)) {
      return maybeRelocatable;
    }
    return undefined;
  }
}

/**
 * Subclass of Relocatable, specific to the Allocation Pointer (Ap) and the Frame Pointer (Fp)
 * These CairoVM registers are considered relocatables must only have segment index equal to 1
 * as they always point to the execution segment.
 */
export class MemoryPointer extends Relocatable {
  constructor(offset: number) {
    super(1, offset);
  }
}

/**
 * Subclass of Relocatable, specific to the Program Counter (PC).
 * PC points to the program segment. Its segment will be 0 until the last instruction.
 * At the end of a program run, the PC will be set to the end pointer, i.e. the address of the end segment.
 */
export class ProgramCounter extends Relocatable {
  constructor(offset: number) {
    super(0, offset);
  }
}