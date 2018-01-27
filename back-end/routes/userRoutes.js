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
        kyc_address = "0xa9336bb2813faad8b35ac58d4050772226290512";
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));

router.get('/balance', (req, res) => {
    web3.eth.getBalance(public_address, (err, balance) => {
        if(err)
            res.status(500).send("Error : " + err)
        else
            res.status(200).send(web3.utils.fromWei(balance, 'ether'))
    });
});

router.post('/details',(req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        console.log(count_val);
        return;
        if(err)
            res.status(500).send(err.toString());
        else {
            kycContract.methods.addPersonDetails(
                web3.utils.fromAscii(req.body.first_name),
                web3.utils.fromAscii(req.body.last_name), 
                web3.utils.fromAscii(req.body.id_number)).estimateGas({from: public_address},(error, gasLimit) => {
                if(err)
                    res.status(500).send(error.toString());
                else {
                    web3.eth.getGasPrice().then((gasPrice) => {
                        var rawTransactionObj = {
                            from: public_address,
                            to: kyc_address,
                            nonce: count_val,
                            gasPrice: web3.utils.toHex(gasPrice.toString()),
                            gasLimit: web3.utils.toHex(gasLimit.toString()),
                            value: "0x0",
                            data : kycContract.methods.addPersonDetails(
                                web3.utils.fromAscii(req.body.first_name), 
                                web3.utils.fromAscii(req.body.last_name), 
                                web3.utils.fromAscii(req.body.id_number)
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
                                res.status(200).json({hash:hash});
                        }); 
                    });
                }
            });
        }
    });
});

router.get('/status', (req ,res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
    kycContract.methods.getPersonStatus().call({from: public_address}).then(status => {
        res.status(200).send(web3.utils.toAscii(status));
    }); 
});

router.get('/details', (req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
    kycContract.methods.getPersonDetails().call({from: public_address}).then(details => {
        res.status(200).json({
            first_name: web3.utils.hexToUtf8(details["first_name"]),
            last_name: web3.utils.hexToUtf8(details["last_name"]),
            id_number: web3.utils.hexToUtf8(details["id_number"]),
            status:  web3.utils.hexToUtf8(details["status"])
        });
    })
})

module.exports = router