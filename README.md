# Cairo VM Typescript

<div align="center">
  <h1><code>Cairo VM TypeScript</code></h1>

<strong>An implementation of the Cairo VM in TypeScript, focusing on
education</strong>

[Github](https://github.com/kkrt-labs/cairo-vm-ts) ·
[Telegram](https://t.me/cairovmts)

<sub>Built with 🥕 by <a href="https://twitter.com/KakarotZkEvm">KKRT
Labs</a></sub>

</div>

> ⚠️ This project is in its genesis, undergoing fast-paced development. It is
> not suitable for production yet. Expect frequent breaking changes.

## What is Cairo

Cairo stands for CPU AIR "o" (like insp"o", conv"o", 🤔).

It is a framework (a machine, an assembly and a language) which allows writing
provable programs without having to understand the underneath ZK-technology.

A program written in Cairo (or Cairo Zero) is compiled to Cairo Assembly (CASM)
and then executed on a Cairo VM which produces traces to be used for the STARK
proof generation.

See [resources](#resources) for more information.

## Why this

### Implementation Diversity

There are currently seven other Cairo VM implementations:

- Reference (original)
  [implementation in Python](https://github.com/starkware-libs/cairo-lang) by
  Starkware (prod)
- New [implementation in Rust](https://github.com/lambdaclass/cairo-vm) by
  Lambda Class (prod)
- A [Go implementation](https://github.com/lambdaclass/cairo-vm_in_go), by
  Lambda Class (dev)
- Another [Go implementation](https://github.com/NethermindEth/cairo-vm-go) by
  Nethermind (dev)
- A
  [Zig implementation](https://github.com/keep-starknet-strange/ziggy-starkdust),
  by Community (dev)
- A [C++ implementation](https://github.com/lambdaclass/cairo-vm.c) by Lambda
  Class (dev)
- A
  [GoogleSheets (gs AppScript) implementation](https://github.com/ClementWalter/cairo-vm-gs)
  by Clément Walter (dev)

The Lambda Class alt-implementations comes with a detailed guide
([Go](https://github.com/lambdaclass/cairo-vm_in_go/blob/main/README.md#documentation),
[C++](https://github.com/lambdaclass/cairo-vm.c?tab=readme-ov-file#documentation))
on how they built their Cairo VM. It gives insights into the overall Cairo VM
but is incomplete and rather specific to language details.

Why would you have different implementations of the same program in multiple
languages? For **implementation diversity**.

More implementations provide more:

- **Resilience**. It helps in finding bugs in the existing   implementations.
- **Documentation**. The documentation over the Cairo VM is   still scarce, and
  the latest version in prod (Rust) is not easy to read for   the average dev.
- **Architecture diversity**. Different architectures can be   implemented to
  achieve the same goal (e.g. memory model). However, most of the current
  implementations essentially are a rewrite of the Rust implementation, which is
  an (enhanced) rewrite of the Python implementation itself.

Implementation diversity also implies **usage diversity**. The primary goals of
each implementation can differ.

For example, the EVM implementation in clients (e.g.
[geth](https://geth.ethereum.org/) and
[reth](https://github.com/paradigmxyz/reth) written in Go and Rust), whose
primary goals are **performance** and **safety**, and the
[reference EVM implementation](https://github.com/ethereum/execution-specs/?tab=readme-ov-file#execution-specification-work-in-progress)
in Python, prioritizing **readability** and **simplicity**.

Analogous to the EVM implementations, the primary goals of the Rust Cairo VM are
performance and safety. While the ones of our TypeScript implementation is
**education** through **readability** and **simplicity**.

### Demistifying the Cairo VM

- TypeScript is easily readable and known by most devs if not all
- Deliberate design choices to further improve readability and simplicity
- Extensive documentation: JSDoc, diagrams, explainers, etc.

## Usage

### CLI

You can install the CLI `cairo-vm-ts` by doing the following:

1. Clone this repo: `git clone git@github.com:kkrt-labs/cairo-vm-ts.git`
2. Go to the cloned directory: `cd cairo-vm-ts`
3. Install the dependencies: `bun install`
4. Register the package as a _linkable_ package: `bun link`

Example usage:

```bash
cairo run fibonacci.json --export-memory fib_mem.bin --print-memory --print-output
```

### As a dependency

No package release has been done yet.

You can still add it as a dependency with a local copy:

1. Clone this repo: `git clone git@github.com:kkrt-labs/cairo-vm-ts.git`
2. Go to the cloned directory: `cd cairo-vm-ts`
3. Install the dependencies: `bun install`
4. Build the project: `bun run build`
5. Go to your project `cd ~/my-project`
6. Add `cairo-vm-ts` to your project dependency:
   `<bun | yarn | npm> add ~/path/to/cairo-vm-ts`

## State of the VM

| Goals                        | Done?   |
| ---------------------------- | ------- |
| Run basic Cairo Zero program | &#9745; |
| Run basic Cairo program      | &#9744; |
| Add [builtins](#builtins)    | &#9745; |
| Add [hints](#hints)          | &#9744; |
| Run StarkNet contracts       | &#9744; |
| Benchmark against other VMs  | &#9744; |

<!-- TODO: Add the state of each section of the VM and a small explainer of their purpose (VM core, hints, builtins, runner...) -->

### Builtins

| Builtin                                                              | Done?   |
| -------------------------------------------------------------------- | ------- |
| [Output](https://github.com/kkrt-labs/cairo-vm-ts/issues/65)         | &#9745; |
| [Pedersen](https://github.com/kkrt-labs/cairo-vm-ts/issues/70)       | &#9745; |
| [Range Check](https://github.com/kkrt-labs/cairo-vm-ts/issues/68)    | &#9745; |
| [ECDSA](https://github.com/kkrt-labs/cairo-vm-ts/issues/67)          | &#9745; |
| [Bitwise](https://github.com/kkrt-labs/cairo-vm-ts/issues/62)        | &#9745; |
| [EcOp](https://github.com/kkrt-labs/cairo-vm-ts/issues/66)           | &#9745; |
| [Keccak](https://github.com/kkrt-labs/cairo-vm-ts/issues/69)         | &#9745; |
| [Poseidon](https://github.com/kkrt-labs/cairo-vm-ts/issues/71)       | &#9745; |
| [Range Check 96](https://github.com/kkrt-labs/cairo-vm-ts/issues/81) | &#9745; |
| Segment Arena                                                        | &#9744; |
| AddMod                                                               | &#9744; |
| MulMod                                                               | &#9744; |

### Hints

<!-- Add a table with the hint list and state done/to be done -->
<!-- If the list is too long, maybe separate in chunks, put the list in an issue to track it and reference the issue here -->

<!-- TODO: Add a Benchmark section when process is nailed -->

### Differential Testing & Benchmark

Pre-requisite: make

### Differential Testing

Compare the encoded memory and trace of executions between different Cairo VM
implementations on a broad range of Cairo programs (currently with no hints).

It is currently only test in execution mode (non-proof mode). It uses the CLI of
each VM implementation.

| Cairo VM Implementations                                                             | Added to `diff-test` |
| ------------------------------------------------------------------------------------ | -------------------- |
| [Cairo VM TS](https://github.com/kkrt-labs/cairo-vm-ts)                              | &#9745;              |
| [Cairo VM Rust](https://github.com/lambdaclass/cairo-vm)                             | &#9745;              |
| [Cairo VM Python](<(https://github.com/starkware-libs/cairo-lang)>)                  | &#9745;              |
| [Cairo VM Zig](https://github.com/keep-starknet-strange/ziggy-starkdust)             | &#9745;              |
| [Cairo VM Go](<(https://github.com/NethermindEth/cairo-vm-go)>) - only ProofMode atm | &#9744;              |

#### Pre-requisites

To build the different projects CLI, you'll need the required dependencies:

- [Rust 1.74.1 or newer](https://www.rust-lang.org/tools/install)
- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [Zig](https://ziglang.org/)
- [Poetry](https://python-poetry.org/docs/#installation)

#### How-to diff-test

```bash
make diff-test
```

## Resources

- [Cairo whitepaper](https://eprint.iacr.org/2021/1063)
- [Cairo Book](https://book.cairo-lang.org/)
- [Cairo website](https://www.cairo-lang.org/)

## Local Development

### Requirements

- Install [bun](https://bun.sh/)
- Run `bun install` to install all dependencies
- Run `bun test` to run all tests

<!-- TODO: Add Project Guidelines -->
