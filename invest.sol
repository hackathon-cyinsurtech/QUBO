contract Invest is Ownable {
    
    using SafeMath for uint256;
    
    mapping(address => InvestDetail[]) investDetails;
    mapping(address => InvestorsInvest[]) investorsInvest;
    
    address[] personAccounts;
    address[] investAccounts;
    InvestIndex[] openInvest;
    InvestIndex[] completeInvest;
    InvestIndex[] runningInvest;
    InvestIndex[] cancelInvest;

    struct InvestDetail {
        uint256 index_car;
        uint256 invest_start_date;
        uint256 from;
        uint256 duration; // seconds
        uint256 deposit;
        uint256 invest_amount_raised;
        uint256 amount_per_day;
        uint256 total_amount;
        mapping(address => InvestDetailsInvestor)  investor_amount;
        bytes1 status;
    }
    
    struct InvestDetailsInvestor {
        uint256 amount;
        bool cashback;
    }
    
    struct InvestorsInvest {
        address person;
        uint256 index;
        uint256 amount;
    }

    struct InvestIndex {
        address person;
        uint256 index;
    }
    
    modifier iscashback(address person, uint256 index) {
        require(investDetails[person][index].investor_amount[msg.sender].cashback == false);
        _;
    }
    
    modifier isOpen(address person, uint256 index) {
        require (investDetails[person][index].status == "O");
        _;
    }

    modifier iscompleted(address person, uint256 index) {
        require (investDetails[person][index].status == "C");
        _;
    }
    
    modifier isRunning(address person, uint256 index) {
        require (investDetails[person][index].status == "R");
        _;
    }

    function isActive(uint256 from, uint256 duration) constant returns (bool) {
        return (
             now >= from 
            && now <= from + duration
        );
    }

    function addInvest(
        uint index_car,
        uint256 from,
        uint256 daysduration,
        uint256 deposit,
        uint256 amount_per_day
     ) payable returns(bool) {
        investDetails[msg.sender].push(InvestDetail({
            index_car: index_car,
            invest_start_date: now,
            from: from,
            duration: daysduration * 1 days,
            deposit: deposit,
            invest_amount_raised: 0,
            amount_per_day: amount_per_day,
            total_amount: (amount_per_day / 86400) * daysduration * 1 days,
            status: "O"
        }));
        
        openInvest.push(InvestIndex({
            person: msg.sender,
            index: investDetails[msg.sender].length--
        }));

        return true;     
    }


    function invest(address person, uint256 index) payable isOpen(person, index) {
        uint256 amount;
        if(investDetails[person][index].investor_amount[msg.sender].amount > 0) {
            amount = investDetails[person][index].investor_amount[msg.sender].amount.add(msg.value);
        }
        
        investDetails[person][index].investor_amount[msg.sender].amount = amount;
        investDetails[person][index].investor_amount[msg.sender].cashback = false;
        investDetails[person][index].invest_amount_raised = investDetails[msg.sender][index].invest_amount_raised.add(msg.value);

        if(investDetails[person][index].invest_amount_raised == investDetails[msg.sender][index].deposit * 1 ether) {
            investDetails[person][index].status == 'R';
            for(uint256 i=0;i < openInvest.length; i++) {
                if(openInvest[i].index == index) {
                    delete openInvest[i];
                }
            }
            runningInvest.push(InvestIndex({
                person: msg.sender,
                index: index
            }));
        }
    }
    
    function amountRaised(address person, uint256 index) constant returns (uint256) {
        return investDetails[msg.sender][index].invest_amount_raised / 1 ether;
    }
    
    function depositReached(address person, uint256 index) constant returns (bool) {
        return (investDetails[msg.sender][index].invest_amount_raised >= investDetails[msg.sender][index].deposit * 1 ether);
    }

    function availableDeposit(address person, uint256 index) constant returns (uint256) {
        uint available_deposit = (investDetails[msg.sender][index].deposit * 1 ether) - investDetails[msg.sender][index].invest_amount_raised;
        return (available_deposit / 1 ether);
    } 
    
    function InvestorRefund(address person, uint256 index) constant returns (uint256) {
        require(investDetails[person][index].investor_amount[msg.sender].amount > 0);
        
        investDetails[person][index].invest_amount_raised = investDetails[person][index].invest_amount_raised.sub(investDetails[person][index].investor_amount[msg.sender].amount);
        msg.sender.transfer(investDetails[person][index].investor_amount[msg.sender].amount);
    }

    function InvestorClaimProfits(address person, uint256 index) iscompleted(person, index) iscashback(person, index) {
        require(investDetails[person][index].investor_amount[msg.sender].amount > 0);
        uint256 invested_amount = investDetails[person][index].investor_amount[msg.sender].amount;
        uint256 deposit = investDetails[person][index].deposit * 1 ether;
        uint256 total_amount = investDetails[person][index].total_amount;

        uint256 investor_profit_percantage = (invested_amount / deposit ) * 100;
        uint256 investor_profit_amount =(total_amount * investor_profit_percantage ) / 100  - (0.2 * 100);
       
        uint256 admin_profit_amount = investor_profit_amount * 2 / 100;

        msg.sender.transfer(investor_profit_amount + invested_amount);
        // Send money to owner
        owner.transfer(admin_profit_amount);

        investDetails[person][index].investor_amount[msg.sender].cashback = true;
    }

}