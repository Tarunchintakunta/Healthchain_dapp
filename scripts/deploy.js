const hre = require("hardhat");

async function main() {
  console.log("Deploying HealthInsurance contract...");

  // Get the contract factory
  const HealthInsurance = await hre.ethers.getContractFactory("HealthInsurance");
  
  // Deploy the contract
  const healthInsurance = await HealthInsurance.deploy();

  // Wait for deployment to finish
  console.log("Waiting for deployment...");
  await healthInsurance.deployed();

  console.log("HealthInsurance deployed to:", healthInsurance.address);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await healthInsurance.deployTransaction.wait(5);
  
  // Verify contract on Etherscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: healthInsurance.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });