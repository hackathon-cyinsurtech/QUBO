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

router.get('/person/:address', (req ,res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
    kycContract.methods.getAdminPersonDetails(req.params.address).call().then((details) => {
        res.status(200).json({
            first_name: web3.utils.hexToUtf8(details["first_name"]),
            last_name: web3.utils.hexToUtf8(details["last_name"]),
            id_number: web3.utils.hexToUtf8(details["id_number"]),
            status: web3.utils.hexToUtf8(details["status"])
        });
    });
})

router.get('/personlist', (req, res) => {
    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    kycContract.methods.getAdminPersons().call({from: public_address}).then(addresses => {
        if(addresses.length > 0) {
            let actions = addresses.map((address) => {
                if(web3.utils.isAddress(address)) {
                    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
                    var results = kycContract.methods.getAdminPersonDetails(address).call({from: public_address}).then((details) => {
                        return {
                            address: address,
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
})

router.get('/carlist', (req, res) => {
//    var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
//    let carArray = [];
//    kycContract.methods.getAdminCarPersons().call({from:public_address}).then(addresses => {
//        if(addresses.length > 0) {
//            let actions = addresses.map((address) => {
//                if(web3.utils.isAddress(address)) {
//                    var kycContract = new web3.eth.Contract(KycABI, kyc_address);
//                    var results = kycContract.methods.getAdminCarCount(address).call({from:public_address}).then((car_length) => {
//                        for(var index=0;index < car_length;index++) {
//                            
//                             kycContract.methods.getAdminCarDetails(address, index).call({from:public_address}).then((details) => {
//                                kycContract.methods.getAdminCarExtra(address,index).call({from:public_address}).then(extra_details => {
//                                    kycContract.methods.getAdminCarAmounts(address,index).call({from:public_address}).then(car_amount => {
//                                        kycContract.methods.getAdminCarStatus(address,index).call({from:public_address}).then(status => {
//                                            carArray.push({
//                                               address: address,
//                                                index: index,
//                                                license_plate: web3.utils.hexToUtf8(details["license_plate"]),
//                                                brand: web3.utils.hexToUtf8(details["brand"]),
//                                                model: web3.utils.hexToUtf8(details["model"]),
//                                                category: web3.utils.hexToUtf8(details["category"]),
//                                                engine_size: web3.utils.hexToUtf8(extra_details["engine_size"]),
//                                                horse_power: web3.utils.hexToUtf8(extra_details["horse_power"]),
//                                                year: extra_details["year"],
//                                                deposit: car_amount.deposit,
//                                                amount_per_day:car_amount.amount_per_day,
//                                                status: web3.utils.hexToUtf8(status)
//                                            });
//
//                                        });
//                                    });
//                                });
//                              
//                            });
//                        }
//                        return results;
//                    })
// 
//                }
//            });
//
//            return Promise.all(actions).then(() => {
//                
//                console.log(carArray);
//                res.status(200).send(personcarlist)  
//            }).catch(error => {
//                res.status(500).send("Error : "+ error)
//            })
//        }
//        else
//            res.status(200).send([]);
//    });
    res.status(200).send([{
        address: "0xDBe308BAbb5c749366fC3dAD6a7797F59340c204",
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
        address: "0xDBe308BAbb5c749366fC3dAD6a7797F59340c204",
        index: 2,
        license_plate: "MSB101",
        brand: "Auid",
        model: "A5",
        category: "saloon",
        engine_size: "2.0",
        horse_power: "350",
        year:2017,
        deposit: 10,
        amount_per_day: 0.0047109,
        status: 'A'
    }])
    
})


router.post('/approveperson', (req, res) => {
     var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send(err.toString());
       else {
            kycContract.methods.setAdminPersonStatus(
                req.body.address, 
                web3.utils.fromAscii('A'), 
            ).estimateGas({from: public_address},(error, gasLimit) => {
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
                            data : kycContract.methods.setAdminPersonStatus(
                                req.body.address,
                                web3.utils.fromAscii('A'), 
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
                                res.status(200).json({status: "A"});
                        }); 
                    });
                }
            });
        }
    });
})

router.post('/rejectperson', (req, res) => {
     var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send(err.toString());
       else {
            kycContract.methods.setAdminPersonStatus(
                req.body.address, 
                web3.utils.fromAscii('R'), 
            ).estimateGas({from: public_address},(error, gasLimit) => {
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
                            data : kycContract.methods.setAdminPersonStatus(
                                req.body.address,
                                web3.utils.fromAscii('R'), 
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
                                res.status(200).json({status: "R"});
                        }); 
                    })
                }
            });
        }
    });
})

router.post('/approvecar', (req, res) => {
     var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send(err.toString());
       else {
            kycContract.methods.setAdminCarStatus(
                req.body.address, 
                req.body.index,
                web3.utils.fromAscii('A'), 
            ).estimateGas({from: public_address},(error, gasLimit) => {
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
                            data : kycContract.methods.setAdminCarStatus(
                                req.body.address,
                                req.body.index,
                                web3.utils.fromAscii('A'), 
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
                                res.status(200).json({status: "A"});
                        }); 
                    })
                }
            });
        }
    });
})

router.post('/rejectcar', (req, res) => {
     var kycContract = new web3.eth.Contract(KycABI, kyc_address); 
    web3.eth.getTransactionCount(public_address, (err, count_val) => {
        if(err)
            res.status(500).send(err.toString());
       else {
            kycContract.methods.setAdminCarStatus(
                req.body.address, 
                req.body.index,
                web3.utils.fromAscii('R'), 
            ).estimateGas({from: public_address},(error, gasLimit) => {
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
                            data : kycContract.methods.setAdminCarStatus(
                                req.body.address,
                                req.body.index,
                                web3.utils.fromAscii('R'), 
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
                                res.status(200).json({status: "R"});
                        }); 
                    })
                }
            });
        }
    });
})


module.exports = router