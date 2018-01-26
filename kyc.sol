contract KYC is Ownable {
    mapping(address => PersonDetail) personDetails;

    address[] personAccounts;

    struct PersonDetail {
        bytes32 first_name;
        bytes32 last_name;
        bytes8 id_number;
        bytes1 status;
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
}