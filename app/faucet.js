// Modern dapp browsers...
if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
        // Request account access if needed
        ethereum.enable().then(function() {
            goOn();
        });
    } catch (error) {
        // User denied account access...
        console.log("Cannot enable");
    }
}
// Legacy dapp browsers...
else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
}
// Non-dapp browsers...
else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Your deployed address changes every time you deploy.
const faucetAddress = "0xbbb7ba2dbc1577ed33e1ae2a9c348c04c6bd4dcd"; // <-- Put your own
var faucetContractFactory;
var faucetInstance;

function goOn() {
    web3.eth.getCoinbase(function(err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            console.log("Coinbase: " + coinbase);
        }
    });

    faucetContractFactory = web3.eth.contract(JSON.parse(faucetCompiled.contracts["Faucet.sol:Faucet"].abi));
    faucetInstance = faucetContractFactory.at(faucetAddress);

    // Query eth for balance
    web3.eth.getBalance(faucetAddress, function(err, balance) {
        if (err) {
            console.error(err);
        } else {
            console.log("Contract balance: " + balance);
        }
    });

    // Query the contract directly
    faucetInstance.getBalance.call(function(err, balance) {
        if (err) {
            console.error(err);
        } else {
            console.log("Faucet balance: " + balance);
        }
    });
}

function topUp() {
    web3.eth.getCoinbase(function(err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.sendTransaction({
                from: coinbase,
                to: faucetAddress,
                value: web3.toWei(1, "ether")
            }, function(err, txn) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("topUp txn: " + txn);
                }
            });
        }
    });
}

function sendWei() {
    web3.eth.getCoinbase(function(err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.getAccounts(function(err, accounts) {
                if (err) {
                    console.error(err);
                } else {
                    const targetAccount = accounts[0];
                    faucetInstance.sendWei(
                        targetAccount,
                        { from: coinbase },
                        function(err, txn) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("sendWei txn: " + txn);
                            }
                        });
                }
            });
        }
    });
}
