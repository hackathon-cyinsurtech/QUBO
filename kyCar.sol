contract KYCar is Ownable, KYC {
    mapping(address => CarDetail[]) carDetails;
    address[] senderAccounts;

    struct CarDetail {
        bytes8 license_plate;
        bytes32 brand;
        bytes32 model;
        bytes32 category;
        bytes4 engine_size;
        bytes8 horse_power;
        uint year;
        uint deposit;
        uint amount_per_day;
        bytes1 status;
    }

    function addCarDetails (
        bytes8 license_plate,
        bytes32 brand,
        bytes32 model,
        bytes32 category,
        bytes4 engine_size,
        bytes8 horse_power,
        uint year
    ) checkPerson returns(bool) {
       for(uint i = 0; i < carDetails[msg.sender].length; i++) {
            if(carDetails[msg.sender][i].license_plate == license_plate && carDetails[msg.sender][i].status == 'A') {
                return false;
            }
        }

        carDetails[msg.sender].push(CarDetail({
            license_plate: license_plate,
            brand: brand,
            model: model,
            category: category,
            engine_size:engine_size,
            horse_power:horse_power,
            year:year,
            deposit: 0, // Ether deposit
            amount_per_day: 0, // Ether deposit
            status: 'P'
        }));
    
        if (carDetails[msg.sender].length == 1) {
            senderAccounts.push(msg.sender);
        }
        
        return true;
    }

    function getCarDetails(uint index) public constant returns(
        bytes8 license_plate,
        bytes32 brand,
        bytes32 model,
        bytes32 category,
        bytes4 engine_size,
        bytes8 horse_power,
        uint year
    ) {
        require(index <= carDetails[msg.sender].length);

        return (
            carDetails[msg.sender][index].license_plate,
            carDetails[msg.sender][index].brand, 
            carDetails[msg.sender][index].model,
            carDetails[msg.sender][index].category, 
            carDetails[msg.sender][index].engine_size,
            carDetails[msg.sender][index].horse_power,
            carDetails[msg.sender][index].year
        );
    }
    
    function getCarAmounts(uint index) public constant returns(
        uint deposit,
        uint amount_per_day
    ) {
        require(index <= carDetails[msg.sender].length);
       return ( 
        carDetails[msg.sender][index].deposit,
        carDetails[msg.sender][index].amount_per_day
        );
    }
    
}