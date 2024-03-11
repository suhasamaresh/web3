// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract CrowdFunding{
    struct Campaign{
        address owner;
        string title;
        string description;
        uint target;
        uint amountcollected;
        uint deadline;
        string image;
        bool open;
        address[] funders;
        uint256[] fundings;
    }
    mapping(uint => Campaign) public campaigns;

    uint public CampaignCount=0;

    function createCampaign(address _owner,string memory _title, string memory _description, uint _target, uint _deadline, string memory _image) public returns (uint256){
        Campaign storage campaign = campaigns[CampaignCount];
        require(campaign.deadline > block.timestamp, "Deadline should be in future");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.open = true;
        CampaignCount++;
        return CampaignCount - 1;
    }

    function donate(uint _id) public payable{
        Campaign storage campaign = campaigns[_id];
        require(campaign.open,"Campaign is closed");
        require(campaign.deadline > block.timestamp,"Deadline is finished");

        campaign.funders.push(msg.sender);
        campaign.fundings.push(msg.value);

        if(campaign.amountcollected >= campaign.target){
            campaign.open = false;
        }

        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
        if(sent){
            campaign.amountcollected += msg.value;
        }
    }

    function getFunders(uint256 _id) public view returns(address[] memory,uint256[] memory){
        return (campaigns[_id].funders,campaigns[_id].fundings);
    }

    function getCampaigns() public view returns(Campaign[] memory){
        Campaign[] memory allcampaigns = new Campaign[](CampaignCount);
        for(uint i=0;i<=CampaignCount;i++){
            allcampaigns[i] = campaigns[i];
        }
        return allcampaigns;
    }
}