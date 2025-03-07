# ND1309 C2 Ethereum Smart Contracts, Tokens and Dapps - Project Starter 
**PROJECT: Decentralized Star Notary Service Project** - For this project, you will create a DApp by adding functionality with your smart contract and deploy it on the public testnet.

## Core ERC721 Contract Information
- Truffle version: v5.4.24 (core: 5.4.24)
- Solidity compiler:  0.8.0 (solc-js)
- OpenZeppelin: 4.4.1
- Symbol: SNT
- Name: StarNotaryToken
- Contract address: 0x7dfe584917a4622779b83bfae7137971b13b53a6
- Contract [on etherscan](https://rinkeby.etherscan.io/address/0x7dfe584917a4622779b83bfae7137971b13b53a6)


## Develpment Notes
### Comments regarding old code from Udacity
The Udacity nanodegree does not use more current code/tools which makes researching more difficult and prevented successful running of npm install.

In order to be able to complete the course, the following adjustments have been done:
- OpenZeppelin is installed now using `npm install @openzeppelin/contracts`
- Import statement for the ERC721 from OpenZeppelin was adjusted to `import "@openzeppelin/contracts/token/ERC721/ERC721.sol";`
- Constructor of ERC721 must be called with Token name and symbol directly in the contract extending a ERC721 contract, e.g. `constructor() public ERC721("StarNotaryToken", "SNT") {}`
- Truffle uses by default an older version of the solidity compiler (0.5.x). OpenZeppelin uses 0.8.x version. To mke this work together, adjust truffle-config.js:
    ```json
    compilers: {
        solc: {
          version: "0.8.0"    // Fetch exact version from solc-bin (default: truffle's version)
        }
    }
    ``` 
- Implementation of the `Migrations.sol` and `StarNotray.sol` was updated to `pragma solidity ^0.8.0;`
- Implementation needed to be adjusted:
  - `_mint` is now `_safeMint`
  - `_transferFrom` is now `_safeTransfer` (with minor differences in signature)
- To make an address payable it simply needs to be wrapped in a `paylable()` function
- Sender addresses for transferring back excess eth must be made a payable address as well
- web3 works differently
  - Calling a payable function cannot be done directly, but needs a `.send(from: ...)` added, e.g. `await createStar(name, id).send({from: this.account});`

### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```


### Run the application
1. Clean the frontend 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
cd app
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

The chain ID above can be fetched by:
```bash
cd app
node index.js
```

## Troubleshoot
#### Error 1 
```
'webpack-dev-server' is not recognized as an internal or external command
```
**Solution:**
- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!


#### Error 2
```
ParserError: Source file requires different compiler version. 
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```
**Solution:** In such a case, ensure the following in `truffle-config.js`:
```js
// Configure your compilers  
compilers: {    
  solc: {      
    version: "0.5.16", // <- Use this        
    // docker: true,
    // ...
```

## Raise a PR or report an Issue
1. Feel free to raise a [Pull Request](https://github.com/udacity/nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code/pulls) if you find a bug/scope of improvement in the current repository. 

2. If you have suggestions or facing issues, you can log in issue. 

---

Do not use the [Old depreacted zipped starter code](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/January/5c51c4c0_project-5-starter-code/project-5-starter-code.zip)
