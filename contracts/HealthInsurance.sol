// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HealthInsurance
 * @dev A smart contract for purchasing health insurance plans and medications
 */
contract HealthInsurance is Ownable, ReentrancyGuard {
    // Structs
    struct InsurancePlan {
        string name;
        string description;
        uint256 basePriceWei; // Base price in wei
    }
    
    struct Medication {
        string name;
        string description;
        string category;
        uint256 priceWei; // Price in wei
    }
    
    struct UserPolicy {
        uint256 planId;
        uint256 coverageAmount;
        uint256 purchaseDate;
        uint256 expiryDate;
        uint256 peopleCount;
    }
    
    struct MedicationPurchase {
        uint256 medicationId;
        uint256 packageSize;
        uint256 quantity;
        uint256 totalPrice;
        uint256 purchaseDate;
    }
    
    // State variables
    InsurancePlan[] public insurancePlans;
    Medication[] public medications;
    
    // Mapping from user address to their policies
    mapping(address => UserPolicy[]) public userPolicies;
    
    // Mapping from user address to their medication purchases
    mapping(address => MedicationPurchase[]) public medicationPurchases;
    
    // Events
    event InsurancePurchased(address indexed user, uint256 planId, uint256 peopleCount, uint256 totalCost);
    event MedicationPurchased(address indexed user, uint256 medicationId, uint256 packageSize, uint256 quantity, uint256 totalCost);
    event WithdrawalMade(address indexed to, uint256 amount);
    
    constructor() {
        // Initialize with default insurance plans
        insurancePlans.push(InsurancePlan("Dental Care", "Basic dental coverage including cleanings and fillings", 0.01 ether));
        insurancePlans.push(InsurancePlan("General Health", "Comprehensive health coverage for regular checkups and emergency care", 0.02 ether));
        insurancePlans.push(InsurancePlan("Vision Care", "Eye exams and prescription glasses/contacts coverage", 0.008 ether));
        insurancePlans.push(InsurancePlan("Preventative Care", "Wellness visits, vaccinations, and preventative screenings", 0.015 ether));
        
        // Initialize with default medications
        medications.push(Medication("Ibuprofen", "Pain reliever and fever reducer", "Pain Relief", 0.001 ether));
        medications.push(Medication("Acetaminophen", "Pain reliever and fever reducer", "Pain Relief", 0.0008 ether));
        medications.push(Medication("Amoxicillin", "Antibiotic for bacterial infections", "Antibiotics", 0.003 ether));
        medications.push(Medication("Loratadine", "Antihistamine for allergy relief", "Allergy", 0.0015 ether));
        medications.push(Medication("Pseudoephedrine", "Decongestant for cold and sinus", "Cold & Flu", 0.002 ether));
        medications.push(Medication("Multivitamin", "Daily nutritional supplement", "Vitamins", 0.001 ether));
    }
    
    /**
     * @dev Get the total number of insurance plans
     * @return The number of insurance plans
     */
    function getInsurancePlanCount() public view returns (uint256) {
        return insurancePlans.length;
    }
    
    /**
     * @dev Get the total number of medications
     * @return The number of medications
     */
    function getMedicationCount() public view returns (uint256) {
        return medications.length;
    }
    
    /**
     * @dev Get all insurance plans
     * @return An array of insurance plans
     */
    function getAllInsurancePlans() public view returns (InsurancePlan[] memory) {
        return insurancePlans;
    }
    
    /**
     * @dev Get all medications
     * @return An array of medications
     */
    function getAllMedications() public view returns (Medication[] memory) {
        return medications;
    }
    
    /**
     * @dev Get a user's insurance policies
     * @param _user The address of the user
     * @return An array of the user's policies
     */
    function getUserPolicies(address _user) public view returns (UserPolicy[] memory) {
        return userPolicies[_user];
    }
    
    /**
     * @dev Get a user's medication purchases
     * @param _user The address of the user
     * @return An array of the user's medication purchases
     */
    function getUserMedicationPurchases(address _user) public view returns (MedicationPurchase[] memory) {
        return medicationPurchases[_user];
    }
    
    /**
     * @dev Purchase an insurance plan
     * @param _planId The ID of the insurance plan
     * @param _peopleCount The number of people to be covered (1-5)
     */
    function purchaseInsurance(uint256 _planId, uint256 _peopleCount) public payable nonReentrant {
        require(_planId < insurancePlans.length, "Invalid plan ID");
        require(_peopleCount > 0 && _peopleCount <= 5, "People count must be between 1 and 5");
        
        InsurancePlan memory plan = insurancePlans[_planId];
        
        // Calculate price based on people count (price increases proportionally but with a small discount for more people)
        uint256 totalPrice;
        if (_peopleCount == 1) {
            totalPrice = plan.basePriceWei;
        } else {
            // Apply a small discount for multiple people
            totalPrice = (plan.basePriceWei * _peopleCount * 95) / 100;
        }
        
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Create new policy with 1 year coverage
        userPolicies[msg.sender].push(UserPolicy({
            planId: _planId,
            coverageAmount: totalPrice,
            purchaseDate: block.timestamp,
            expiryDate: block.timestamp + 365 days,
            peopleCount: _peopleCount
        }));
        
        // Emit event
        emit InsurancePurchased(msg.sender, _planId, _peopleCount, totalPrice);
        
        // Refund excess payment if any
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }
    
    /**
     * @dev Purchase medication
     * @param _medicationId The ID of the medication
     * @param _packageSize The size of the package (10, 30, or 60 tablets)
     * @param _quantity The quantity of packages (1-5)
     */
    function purchaseMedication(uint256 _medicationId, uint256 _packageSize, uint256 _quantity) public payable nonReentrant {
        require(_medicationId < medications.length, "Invalid medication ID");
        require(_packageSize == 10 || _packageSize == 30 || _packageSize == 60, "Package size must be 10, 30, or 60");
        require(_quantity > 0 && _quantity <= 5, "Quantity must be between 1 and 5");
        
        Medication memory medication = medications[_medicationId];
        
        // Calculate price based on package size and quantity
        uint256 packageFactor;
        if (_packageSize == 10) {
            packageFactor = 1;
        } else if (_packageSize == 30) {
            packageFactor = 28; // 30 tablets at a slight discount
        } else { // 60 tablets
            packageFactor = 55; // 60 tablets at a larger discount
        }
        
        uint256 totalPrice = (medication.priceWei * packageFactor * _quantity) / 10;
        
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Record purchase
        medicationPurchases[msg.sender].push(MedicationPurchase({
            medicationId: _medicationId,
            packageSize: _packageSize,
            quantity: _quantity,
            totalPrice: totalPrice,
            purchaseDate: block.timestamp
        }));
        
        // Emit event
        emit MedicationPurchased(msg.sender, _medicationId, _packageSize, _quantity, totalPrice);
        
        // Refund excess payment if any
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }
    
    /**
     * @dev Add a new insurance plan (only owner)
     * @param _name The name of the plan
     * @param _description The description of the plan
     * @param _basePriceWei The base price in wei
     */
    function addInsurancePlan(string memory _name, string memory _description, uint256 _basePriceWei) public onlyOwner {
        insurancePlans.push(InsurancePlan(_name, _description, _basePriceWei));
    }
    
    /**
     * @dev Add a new medication (only owner)
     * @param _name The name of the medication
     * @param _description The description of the medication
     * @param _category The category of the medication
     * @param _priceWei The price in wei
     */
    function addMedication(string memory _name, string memory _description, string memory _category, uint256 _priceWei) public onlyOwner {
        medications.push(Medication(_name, _description, _category, _priceWei));
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance to withdraw");
        
        payable(owner()).transfer(amount);
        emit WithdrawalMade(owner(), amount);
    }
}