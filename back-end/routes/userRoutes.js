var express = require('express'),
    router = express.Router(),
    request = require('request'),
    requestpromise = require('request-promise'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    BigNumber = require('bignumber.js');

    const KycABI = require('../abi/kycABI.json'),
        public_address = "0xEA0fab7509A09571C41868da513950FF743745B1";
        private_key = "62079237e051d2e559153d41fecb14dfca788308ce1b3fbfba51bdce22fa5a71";
        kyc_address = "0xa1ce842c7a5db31873099af569474b30d9011ad2";
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

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
                                res.status(200).json({message:"Transaction is proceed.To be completed and listed will need 15 min to 2 hours"});
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
            id_number: web3.utils.hexToUtf8(details["id_number"])
        });
    })
})

module.exports = router