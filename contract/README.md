# 📦 Tumbuh Contract

This project is developed using the Move programming language on the Sui blockchain platform. This documentation covers the basic commands to build, test, and publish your Move modules using the `sui` CLI.

---

## 🛠️ Build: `sui move build`

This command compiles your Move modules and ensures there are no syntax or semantic errors before running or publishing.

### Usage:

```bash
sui move build --silence-warnings
```

### Output:
- A `build/` directory will be generated containing the compiled bytecode and module metadata.
- Any build errors will be displayed in the terminal.

---

## 🧪 Test: `sui move test`

This command runs all unit tests defined in your Move files. Use it to verify your contract functionality locally.

### Usage:

```bash
sui move test --silence-warnings
```

### Output:
- Results of each test case will be displayed.
- Pass/fail indicators for each test function.
- Error trace if any test fails.

> ✅ **Tip:** Ensure your tests are located in the same file or are properly connected to the modules being tested.

---

## 🚀 Publish: `sui client publish`

This command publishes your Move package to the Sui blockchain.

### Requirements:
- You must have a Sui wallet with sufficient gas (SUI).
- The wallet must be configured using `sui client`.

### Usage:

```bash
sui client publish --gas-budget <amount_of_gas>
```

Example:

```bash
sui client publish --gas-budget 500000000
```

### Output:
- The package will be published to the Sui network (Devnet/Testnet/Mainnet depending on configuration).
- You will receive a package object ID that can be used to interact with the contract.

---

## 🔧 CLI Configuration

Ensure your CLI environment is set up correctly:

```bash
sui client active-address
sui client switch --env devnet
```

---

## 📂 Project Structure

```
contract/
├── sources/         # Main .move source files
├── tests/           # Unit test files
├── Move.toml        # Project configuration file
└── build/           # Build output directory
```