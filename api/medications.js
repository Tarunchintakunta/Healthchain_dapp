// Vercel serverless function for medication data
export default function handler(req, res) {
    const medications = [
      {
        id: 0,
        name: "Ibuprofen",
        description: "Pain reliever and fever reducer",
        category: "Pain Relief",
        priceEth: 0.001,
      },
      {
        id: 1,
        name: "Acetaminophen",
        description: "Pain reliever and fever reducer",
        category: "Pain Relief",
        priceEth: 0.0008,
      },
      {
        id: 2,
        name: "Amoxicillin",
        description: "Antibiotic for bacterial infections",
        category: "Antibiotics",
        priceEth: 0.003,
      },
      {
        id: 3,
        name: "Loratadine",
        description: "Antihistamine for allergy relief",
        category: "Allergy",
        priceEth: 0.0015,
      },
      {
        id: 4,
        name: "Pseudoephedrine",
        description: "Decongestant for cold and sinus",
        category: "Cold & Flu",
        priceEth: 0.002,
      },
      {
        id: 5,
        name: "Multivitamin",
        description: "Daily nutritional supplement",
        category: "Vitamins",
        priceEth: 0.001,
      },
      {
        id: 6,
        name: "Naproxen",
        description: "Anti-inflammatory pain reliever",
        category: "Pain Relief",
        priceEth: 0.0012,
      },
      {
        id: 7,
        name: "Cetirizine",
        description: "Non-drowsy antihistamine for allergies",
        category: "Allergy",
        priceEth: 0.0018,
      },
      {
        id: 8,
        name: "Vitamin C",
        description: "Immune system support",
        category: "Vitamins",
        priceEth: 0.0007,
      },
      {
        id: 9,
        name: "Dextromethorphan",
        description: "Cough suppressant",
        category: "Cold & Flu",
        priceEth: 0.0017,
      },
      {
        id: 10,
        name: "Aspirin",
        description: "Pain reliever and blood thinner",
        category: "Pain Relief",
        priceEth: 0.0009,
      },
      {
        id: 11,
        name: "Ciprofloxacin",
        description: "Broad-spectrum antibiotic",
        category: "Antibiotics",
        priceEth: 0.0035,
      },
    ];
  
    // Get query parameters
    const { category } = req.query;
    
    // Filter medications by category if provided
    let filteredMedications = medications;
    if (category) {
      // Format category parameter to match data format
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // Filter the medications
      filteredMedications = medications.filter(
        med => med.category.toLowerCase() === formattedCategory.toLowerCase()
      );
    }
    
    // Log the request for monitoring purposes
    console.log(`Medication API request: ${req.method} ${req.url}`);
    
    // Return the medications data
    res.status(200).json({
      success: true,
      data: filteredMedications,
      timestamp: new Date().toISOString(),
    });
  }