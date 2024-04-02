// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint target;
        uint amountCollected;
        uint deadline;
        string image;
        bool open;
        address[] funders;
        uint256[] fundings;
    }

    mapping(uint => Campaign) public campaigns;
    uint public CampaignCount = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint _target, uint _deadline, string memory _image) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline should be in the future");
        Campaign storage campaign = campaigns[CampaignCount];
        campaign.deadline = _deadline;
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.image = _image;
        campaign.open = true;
        CampaignCount++;
        return CampaignCount;
    }

   event DonationReceived(address indexed donor, uint indexed campaignId, uint amount);

function donate(uint _id) public payable {
    Campaign storage campaign = campaigns[_id];

    campaign.funders.push(msg.sender);
    campaign.fundings.push(msg.value);

    campaign.amountCollected += msg.value; // Update the amountCollected field

    if (campaign.amountCollected >= campaign.target) {
        campaign.open = false;
    }

    emit DonationReceived(msg.sender, _id, msg.value); // Log donation event

    (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
    require(sent, "Failed to send donation to campaign owner");
}


    function getFunders(uint256 _id) public view returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].funders, campaigns[_id].fundings);
    }

    function getCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory allcampaigns = new Campaign[](CampaignCount);
        for (uint i = 0; i < CampaignCount; i++) {
            Campaign storage item = campaigns[i];
            allcampaigns[i] = item;
        }
        return allcampaigns;
    }
    
    function getCurrentDonatedAmount(uint _id) public view returns (uint){
        require(_id<CampaignCount ,"Campaign out of range");
        return campaigns[_id].amountCollected;
    }

    function getCampaign(uint256 index) public view returns (
        address owner,
        string memory title,
        string memory description,
        uint target,
        uint amountCollected,
        uint deadline,
        string memory image,
        bool open,
        address[] memory funders,
        uint256[] memory fundings
    ) {
        require(index < CampaignCount, "Campaign index out of range");
        Campaign storage campaign = campaigns[index];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.amountCollected,
            campaign.deadline,
            campaign.image,
            campaign.open,
            campaign.funders,
            campaign.fundings
        );
    }

    function terminateCampaign(uint256 _id) public {
        require(_id < CampaignCount, "Campaign index out of range");
        Campaign storage campaign = campaigns[_id];
        
        // Check if the campaign is already closed or if the deadline has not passed
        require(campaign.open, "Campaign is already closed");
        require(campaign.deadline <= block.timestamp, "Deadline has not passed yet");

        // Close the campaign
        campaign.open = false;
    }

    function deleteCampaign(uint256 _id) public {
        require(_id < CampaignCount, "Campaign index out of range");
        Campaign storage campaign = campaigns[_id];
        
        // Only allow the owner of the campaign to delete it
        require(msg.sender == campaign.owner, "Only the owner can delete the campaign");

        // Delete the campaign
        delete campaigns[_id];
        
        // Decrement the campaign count
        CampaignCount--;
        
        // If the deleted campaign was not the last one, move the last campaign to the deleted position
        if (_id < CampaignCount) {
            campaigns[_id] = campaigns[CampaignCount];
        }
    }
}
