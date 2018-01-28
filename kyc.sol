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

    function getPersonDetails() public constant returns(
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

    function getAdminPersonDetails(address sender) onlyOwner public constant returns(
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

    function getAdminPersons() onlyOwner public returns (address[]) {
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