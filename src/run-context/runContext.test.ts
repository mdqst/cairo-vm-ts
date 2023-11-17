import { test, expect, describe } from 'bun:test';
import { RunContext } from './runContext';
import { Uint32, UnsignedInteger } from 'primitives/uint';
import { Op1Src, RegisterFlag } from 'vm/instruction';
import { Int16, SignedInteger16 } from 'primitives/int';
import { Relocatable } from 'primitives/relocatable';
import { Felt } from 'primitives/felt';
import {
  Op0NotRelocatable,
  Op0Undefined,
  Op1ImmediateOffsetError,
  RunContextError,
} from 'errors/runContext';

describe('RunContext', () => {
  describe('incrementPc', () => {
    test('should successfully increment pc', () => {
      const ctx = RunContext.default();
      const instructionSize = UnsignedInteger.toUint32(2);
      ctx.incrementPc(instructionSize as Uint32);
      expect(ctx.pc).toEqual(new Relocatable(0, 2));
    });
  });

  // Test cases reproduced from:
  // https://github.com/lambdaclass/cairo-vm/blob/main/vm/src/vm/context/run_context.rs#L116
  describe('computeDstAddress', () => {
    test('should compute dst addr for ap register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const dstAddr = runContext.computeAddress(RegisterFlag.AP, offset);

      expect(dstAddr.getSegmentIndex()).toEqual(1);
      expect(dstAddr.getOffset()).toEqual(6);
    });

    test('should compute dst addr for fp register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const dstAddr = runContext.computeAddress(RegisterFlag.FP, offset);

      expect(dstAddr.getSegmentIndex()).toEqual(1);
      expect(dstAddr.getOffset()).toEqual(7);
    });
  });

  // Test cases reproduced from:
  // https://github.com/lambdaclass/cairo-vm/blob/main/vm/src/vm/context/run_context.rs#L229
  describe('computeOp1Address', () => {
    test('should compute op1 addr for fp register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.FP,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(7);
    });

    test('should compute op1 addr for ap register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.AP,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(6);
    });

    test('should compute op1 addr for op1 src imm', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.Imm,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(0);
      expect(op1Addr.getOffset()).toEqual(5);
    });

    test('should throw an error Op1ImmediateOffsetError for op1 src imm with incorrect offset', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(2);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Imm, offset, undefined)
      ).toThrow(new RunContextError(Op1ImmediateOffsetError));
    });

    test('should compute op1 addr for op1 src op0 with op0 relocatable', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.Op0,
        offset,
        new Relocatable(1, 7)
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(8);
    });

    test('should throw an error Op0NotRelocatable for op1 src op0 with op0 felt', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Op0, offset, new Felt(7n))
      ).toThrow(new RunContextError(Op0NotRelocatable));
    });

    test('should throw an error Op0Undefined for op1 src op0 with op0 undefined', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Op0, offset, undefined)
      ).toThrow(new RunContextError(Op0Undefined));
    });
  });

  // Test cases reproduced from:
  // https://github.com/lambdaclass/cairo-vm/blob/main/vm/src/vm/context/run_context.rs#L229
  describe('computeOp1Address', () => {
    test('should compute op1 addr for fp register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.FP,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(7);
    });

    test('should compute op1 addr for ap register', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.AP,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(6);
    });

    test('should compute op1 addr for op1 src imm', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.Imm,
        offset,
        undefined
      );

      expect(op1Addr.getSegmentIndex()).toEqual(0);
      expect(op1Addr.getOffset()).toEqual(5);
    });

    test('should throw an error Op1ImmediateOffsetError for op1 src imm with incorrect offset', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(2);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Imm, offset, undefined)
      ).toThrow(new RunContextError(Op1ImmediateOffsetError));
    });

    test('should compute op1 addr for op1 src op0 with op0 relocatable', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      const op1Addr = runContext.computeOp1Address(
        Op1Src.Op0,
        offset,
        new Relocatable(1, 7)
      );

      expect(op1Addr.getSegmentIndex()).toEqual(1);
      expect(op1Addr.getOffset()).toEqual(8);
    });

    test('should throw an error Op0NotRelocatable for op1 src op0 with op0 felt', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Op0, offset, new Felt(7n))
      ).toThrow(new RunContextError(Op0NotRelocatable));
    });

    test('should throw an error Op0Undefined for op1 src op0 with op0 undefined', () => {
      const runContext = new RunContext(4, 5, 6);
      const offset = SignedInteger16.toInt16(1);

      expect(() =>
        runContext.computeOp1Address(Op1Src.Op0, offset, undefined)
      ).toThrow(new RunContextError(Op0Undefined));
    });
  });
});
