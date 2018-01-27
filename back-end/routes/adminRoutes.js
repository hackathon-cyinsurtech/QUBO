var express = require('express'),
router = express.Router(),
request = require('request'),
requestpromise = require('request-promise'),
Web3 = require('web3'),
EthereumTx = require('ethereumjs-tx'),
BigNumber = require('bignumber.js');

const KycABI = require('../abi/kycABI.json'),
    public_address = "0x55F6ab5A5d0B82B2513D73D0f72e2b5E95238484";
    private_key = "f8220dbc4a8c1aad8b5093057d1d77c5e87452706387a011bc1dedd152f0d9e2";
    kyc_address = "0xa1ce842c7a5db31873099af569474b30d9011ad2";
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


router.post('/persons', (req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    kycContract.methods.getAdminPersons().call({from: public_address}).then(addresses => {
        if(persons.length > 0) {
            let actions = addresses.map((address) => {
                if(web3.utils.isAddress(address)) {
                    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
                    var results = kycContract.methods.getAdminPersonDetails().call().then((details) => {
                        return {
                            first_name: web3.utils.hexToUtf8(details["first_name"]),
                            last_name: web3.utils.hexToUtf8(details["last_name"]),
                            id_number: web3.utils.hexToUtf8(details["id_number"])
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