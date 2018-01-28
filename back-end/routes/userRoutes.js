var express = require('express'),
    router = express.Router(),
    request = require('request'),
    requestpromise = require('request-promise'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    BigNumber = require('bignumber.js');

    const KycABI = require('../abi/kycABI.json'),
        InvestABI = require('../abi/investcontract.json'),
        public_address = "0xDBe308BAbb5c749366fC3dAD6a7797F59340c204",
        private_key = "0x081cdf7558d7e27eac61d5d95eb06e84612f08786322be3ac939b6f72041244a",
        kyc_address = "0xf6E6ac3b833927298819910562c01CDDF5618655",
        invest_address = "0xd0b853c934ef081f0d35716351c8b2ca834b1b51",
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

router.post('/persondetails',(req, res) => {
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
                    res.status(500).send("Oops! Something went wrong. Please try again!");
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
                            console.log(err);
                            if (err)
                                res.status(500).send("Oops! Something went wrong. Please try again!");
                            else
                                res.status(200).json({message:"Great! we will approve you within 24h"})
                        }); 
                    });
                }
            });
        }
    });
});

router.post('/cardetails',(req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send("Oops! Something went wrong. Please try again!");
        else {
            kycContract.methods.addCarDetails(
                web3.utils.fromAscii(req.body.license_plate),
                web3.utils.fromAscii(req.body.brand), 
                web3.utils.fromAscii(req.body.model),
                web3.utils.fromAscii(req.body.category),
                web3.utils.fromAscii(req.body.engine_size),
                web3.utils.fromAscii(req.body.horse_power),
                req.body.year).estimateGas({from: public_address},(error, gasLimit) => {
                if(err)
                    res.status(500).send("Oops! Something went wrong. Please try again!");
                else {
                    web3.eth.getGasPrice().then((gasPrice) => {
                        var rawTransactionObj = {
                            from: public_address,
                            to: kyc_address,
                            nonce: count_val,
                            gasPrice: web3.utils.toHex(gasPrice.toString()),
                            gasLimit: web3.utils.toHex(gasLimit.toString()),
                            value: "0x0",
                            data : kycContract.methods.addCarDetails(
                                web3.utils.fromAscii(req.body.license_plate),
                                web3.utils.fromAscii(req.body.brand), 
                                web3.utils.fromAscii(req.body.model),
                                web3.utils.fromAscii(req.body.category),
                                web3.utils.fromAscii(req.body.engine_size),
                                web3.utils.fromAscii(req.body.horse_power),
                                req.body.year
                            ).encodeABI()
                        }
                        var privKey = new Buffer(private_key.toLowerCase().replace('0x', ''), 'hex');
                        var tx = new EthereumTx(rawTransactionObj);
        
                        tx.sign(privKey);
                        var serializedTx = tx.serialize();
                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                            if (err)
                                res.status(400).send("Oops! Something went wrong. Please try again!");
                            else
                                res.status(200).json({message:"Great! we will approve your car within 24h"})
                        }); 
                    });
                }
            });
        }
    });

});

router.post('/investdetails', (req, res) => {
//     var investContract = new web3.eth.Contract(InvestABI, invest_address); 
//    web3.eth.getTransactionCount(public_address, (err, count_val) => {
//        if(err)
//            res.status(500).send("Oops! Something went wrong. Please try again!");
//        else {
//            investContract.methods.addInvest(
//                req.body.index,
//                req.body.from,
//                req.body.duration,
//                req.body.deposit,
//                req.body.amount_per_day).estimateGas({from: public_address},(error, gasLimit) => {
//                if(err)
//                    res.status(500).send("Oops! Something went wrong. Please try again!");
//                else {
//                    web3.eth.getGasPrice().then((gasPrice) => {
//                        var rawTransactionObj = {
//                            from: public_address,
//                            to: invest_address,
//                            nonce: count_val,
//                            gasPrice: web3.utils.toHex(gasPrice.toString()),
//                            gasLimit: web3.utils.toHex(gasLimit.toString()),
//                            value: "0x0",
//                            data : investContract.methods.addInvest(
//                                req.body.index,
//                                req.body.from,
//                                req.body.duration,
//                                req.body.deposit,
//                                req.body.amount_per_day).encodeABI()
//                        }
//                        var privKey = new Buffer(private_key.toLowerCase().replace('0x', ''), 'hex');
//                        var tx = new EthereumTx(rawTransactionObj);
//        
//                        tx.sign(privKey);
//                        var serializedTx = tx.serialize();
//                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
//                            if (err)
//                                res.status(400).send("Oops! Something went wrong. Please try again!");
//                            else
//                                res.status(200).json({message:"Great! we will approve your car within 24h"})
//                        }); 
//                    });
//                }
//            });
//        }
//    });
    res.status(400).send("Oops! Something went wrong. Please try again!");
})

router.get('/cardetails', (req, res) => {
//    index: index,
//    license_plate: web3.utils.hexToUtf8(carDetails["license_plate"]),
//    brand: web3.utils.hexToUtf8(carDetails["brand"]),
//    model: web3.utils.hexToUtf8(carDetails["model"]),
//    category: web3.utils.hexToUtf8(carDetails["category"]),
//    engine_size: web3.utils.hexToUtf8(carDetails["engine_size"]),
//    horse_power: web3.utils.hexToUtf8(carDetails["horse_power"]),
//    year: carDetails["year"]
    
    
    res.status(200).send([{
        index: 1,
        license_plate: "MAB209",
        brand: "Audi",
        model: "A1",
        category: "saloon",
        engine_size: "1.7L",
        horse_power: "350",
        year:2012,
        deposit: 10,
        amount_per_day: 0.0047109,
        status: 'A'
    },{
        index: 2,
        license_plate: "MSB101",
        brand: "Auid",
        model: "A5",
        category: "saloon",
        engine_size: "2.0",
        horse_power: "190",
        year:2012,
        deposit: 10,
        amount_per_day: 0.0047109,
        status: 'A'
    }])
    
    
});


router.get('/status', (req ,res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
    kycContract.methods.getPersonStatus().call({from: public_address}).then(status => {
        res.status(200).send(web3.utils.toAscii(status));
    }); 
});


router.get('/persondetails', (req, res) => {
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