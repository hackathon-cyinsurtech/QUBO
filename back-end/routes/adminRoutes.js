var express = require('express'),
router = express.Router(),
request = require('request'),
requestpromise = require('request-promise'),
Web3 = require('web3'),
EthereumTx = require('ethereumjs-tx'),
BigNumber = require('bignumber.js');

const KycABI = require('../abi/kycABI.json'),
    public_address = "0x06b248FA21f2dBab24efd15F5a49fA6a6d90A2eD";
    private_key = "c5719a8ffd3f23d86372d7563fd0202254ba9d7da432d1ed72e08a8fc48980fc";
    kyc_address = "0xa9336bb2813faad8b35ac58d4050772226290512";
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));


router.get('/persons', (req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    kycContract.methods.getAdminPersons().call({from: public_address}).then(addresses => {
        if(addresses.length > 0) {
            let actions = addresses.map((address) => {
                if(web3.utils.isAddress(address)) {
                    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
                    var results = kycContract.methods.getAdminPersonDetails(address).call().then((details) => {
                        return {
                            first_name: web3.utils.hexToUtf8(details["first_name"]),
                            last_name: web3.utils.hexToUtf8(details["last_name"]),
                            id_number: web3.utils.hexToUtf8(details["id_number"]),
                            status: web3.utils.hexToUtf8(details["status"])
                        }
                    });
                    return results
                }
            });

            return Promise.all(actions).then((personslist) => {
                res.status(200).send(personslist)  
            }).catch(error => {
                res.status(500).send("Error : "+ error)
            })
        }
        else
            res.status(200).send([]);
    });
});
router.post('/setstatus', (req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send(err.toString());
        else {
            kycContract.methods.setAdminPersonStatus(
                req.body.address, 
                web3.utils.fromAscii(req.body.status)
            ).estimateGas({from: public_address},(error, gasLimit) => {
                if(err)
                    res.status(500).send(error.toString());
                else {
                    web3.eth.getGasPrice().then((gasPrice) => {
                        web3.eth.getGasPrice().then((gasPrice) => {
                            var rawTransactionObj = {
                                from: public_address,
                                to: kyc_address,
                                nonce: count_val,
                                gasPrice: web3.utils.toHex(gasPrice.toString()),
                                gasLimit: web3.utils.toHex(gasLimit.toString()),
                                value: "0x0",
                                data : kycContract.methods.setAdminPersonStatus(
                                    req.body.address,
                                    web3.utils.fromAscii(req.body.status), 
                                ).encodeABI()
                            }
                            var privKey = new Buffer(private_key.toLowerCase().replace('0x', ''), 'hex');
                            var tx = new EthereumTx(rawTransactionObj);
            
                            tx.sign(privKey);
                            var serializedTx = tx.serialize();
                            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                                if (err)
                                    res.status(500).send(err.toString())
                                else
                                    res.status(200).json("done");
                            }); 
                        });
                    })
                }
            });
        }
    });
})


module.exports = router