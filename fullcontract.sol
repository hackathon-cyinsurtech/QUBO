/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 * This library was taken from https://github.com/OpenZeppelin
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract Ownable {

  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    require(newOwner != address(0));
    owner = newOwner;
  }
}

contract KYC is Ownable {
    mapping(address => PersonDetail) personDetails;

    address[] personAccounts;

    struct PersonDetail {
        bytes32 first_name;
        bytes32 last_name;
        bytes8 id_number;
        bytes1 status;
    }

    modifier checkPerson() {
        require (personDetails[msg.sender].status == 'A');
        _;
    } 

    function addPersonDetails(bytes32 first_name, bytes32 last_name, bytes8 id_number) returns(bool) {
        require(personDetails[msg.sender].id_number == '');

        personDetails[msg.sender].first_name = first_name;
        personDetails[msg.sender].last_name = last_name;
        personDetails[msg.sender].id_number = id_number;
        personDetails[msg.sender].status = 'P';

        if (personDetails[msg.sender].id_number != "") {
            personAccounts.push(msg.sender);
        }
        return true;     
    }

    function getPersonDetails(address sender) public constant returns(
         bytes32 first_name, 
         bytes32 last_name,
         bytes32 id_number,
         bytes1 status
    ) {
        return (
            personDetails[sender].first_name,
            personDetails[sender].last_name,
            personDetails[sender].id_number,
            personDetails[sender].status
        );
    }

    function getAdminPersonDetails() onlyOwner public constant returns(
         bytes32 first_name, 
         bytes32 last_name,
         bytes32 id_number,
         bytes1 status
    ) {
        return (
            personDetails[msg.sender].first_name,
            personDetails[msg.sender].last_name,
            personDetails[msg.sender].id_number,
            personDetails[msg.sender].status
        );
    }

    function getAdminPersons() onlyOwner view public returns (address[]) {
        return personAccounts;
    }

    function setAdminPersonStatus(address sender,bytes1 status) onlyOwner returns(bool) {
        require(status == 'A' || status == 'R' || status == 'P');

        personDetails[sender].status = status;
        return true;
    }

    function getPersonStatus() public constant returns(bytes1 status) {
        require(personDetails[msg.sender].id_number != '');

        return personDetails[msg.sender].status;
    }

}

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

    modifier carPersonHaveCars(address sender) {
        require (carDetails[sender].length > 0);
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
        carDetails[sender][index].amount_per_day = amount_per_day * 1 ether;    

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

     function getInvestorCarCount(address sender) carPersonHaveCars(sender) public constant returns(uint count) {
        return carDetails[sender].length;
    }
    
    function getInvestorCarAmounts(address sender, uint index) carPersonHaveCars(sender) public constant returns(
        uint deposit,
        uint amount_per_day
    ) {
        
        return(
            carDetails[sender][index].deposit,
            carDetails[sender][index].amount_per_day
        );
    }

    function getInvestorCarDetails(address sender, uint index) carPersonHaveCars(sender) public constant returns(
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