contract KYCar is Ownable, KYC {
    mapping(address => CarDetail[]) carDetails;
    address[] personCarAccounts;

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

    modifier carPersonHaveCars(uint index) {
        require (index <= carDetails[msg.sender].length);
        _;
    } 

    modifier AdminSenderHavecars(address sender, uint index) {
        require (index <= carDetails[sender].length);
        _;
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
            personCarAccounts.push(msg.sender);
        }
        
        return true;
    }

    function getCarCount() public constant returns(uint count) {
        return carDetails[msg.sender].length;
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

    function getAdminCarCount(address sender) onlyOwner public constant returns(uint count) {
        return carDetails[sender].length;
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

    function setAdminCarStatus(address sender, uint index,bytes1 status,uint deposit, uint amount_per_day) AdminSenderHavecars(sender, index) onlyOwner returns(bool) {
        require(status == 'A' || status == 'R' || status == 'P');

        carDetails[sender][index].status = status;
        carDetails[sender][index].deposit = deposit;
        carDetails[sender][index].amount_per_day = amount_per_day;    

        return true;
    }

   function getAdminCarDetails(address sender, uint index) AdminSenderHavecars(sender, index) onlyOwner public constant returns(
        bytes8 license_plate,
        bytes32 brand,
        bytes32 model,
        bytes32 category
    ) {
        return (
            carDetails[sender][index].license_plate,
            carDetails[sender][index].brand, 
            carDetails[sender][index].model,
            carDetails[sender][index].category
        );
    }
    
    function getAdminCarExtra(address sender, uint index) AdminSenderHavecars(sender, index) onlyOwner public constant returns(
        bytes4 engine_size,
        bytes8 horse_power,
        uint year
    ) {
        return (
            carDetails[sender][index].engine_size,
            carDetails[sender][index].horse_power,
            carDetails[sender][index].year
        );
        
    }

    function getAdminCarAmounts(address sender, uint index) AdminSenderHavecars(sender, index) onlyOwner public constant returns(
        uint deposit,
        uint amount_per_day
    ) {
        return ( 
            carDetails[sender][index].deposit,
            carDetails[sender][index].amount_per_day
        );
    }
    
    function getAdminCarPersons() onlyOwner view public returns (address[]) {
        return personCarAccounts;
    }

     function getCarStatus(uint index) public constant returns(bytes1 status) {
        require(index <= carDetails[msg.sender].length);

        return carDetails[msg.sender][index].status;
    }

    function getAdminCarStatus(address sender, uint index) AdminSenderHavecars(sender, index) AdminSenderHavecars(sender, index) onlyOwner returns(bytes1) {
        return carDetails[sender][index].status;
    }

     function getInvestorCarCount(address sender) carPersonHaveCars public constant returns(uint count) {
        return carDetails[sender].length;
    }
    
    function getInvestorCarAmounts(address sender, uint index) carPersonHaveCars public constant returns(
        uint deposit,
        uint amount_per_day
    ) {
        
        return(
            carDetails[sender][index].deposit,
            carDetails[sender][index].amount_per_day
        );
    }

    function getInvestorCarDetails(address sender, uint index) carPersonHaveCars public constant returns(
        bytes32 brand,
        bytes32 model,
        bytes32 category,
        bytes4 engine_size,
        bytes8 horse_power,
        uint year

    ) {
        require(index <= carDetails[sender].length && carDetails[sender][index].status == 'A');

        return (
            carDetails[sender][index].brand, 
            carDetails[sender][index].model,
            carDetails[sender][index].category, 
            carDetails[sender][index].engine_size,
            carDetails[sender][index].horse_power,
            carDetails[sender][index].year
        );

    }
}