var express = require('express'),
    router = express.Router(),
    request = require('request'),
    requestpromise = require('request-promise'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    BigNumber = require('bignumber.js');

const KycABI = require('../abi/kycABI.json'),
    public_address = "0xEA0fab7509A09571C41868da513950FF743745B1";
    private_key = "0x62079237e051d2e559153d41fecb14dfca788308ce1b3fbfba51bdce22fa5a71";
    kyc_address = "0xf6E6ac3b833927298819910562c01CDDF5618655";
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));

router.get('/publicaddress', (req, res) => {
    res.status(200).json({public_address:public_address});
})

router.get('/balance', (req, res) => {
    web3.eth.getBalance(public_address, (err, balance) => {
        if(err)
            res.status(500).send("Error : " + err)
        else
            res.status(200).send(web3.utils.fromWei(balance, 'ether'))
    });
});


module.exports = router