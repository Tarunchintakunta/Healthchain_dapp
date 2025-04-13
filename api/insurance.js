// Vercel serverless function for insurance data
export default function handler(req, res) {
    const insurancePlans = [
      {
        id: 0,
        name: "Dental Care",
        description: "Basic dental coverage including cleanings and fillings",
        basePriceEth: 0.01,
        benefits: [
          "Regular dental checkups",
          "Basic fillings and repairs",
          "Teeth cleaning and maintenance",
          "X-rays and diagnostics",
          "Emergency dental care",
        ]
      },
      {
        id: 1,
        name: "General Health",
        description: "Comprehensive health coverage for regular checkups and emergency care",
        basePriceEth: 0.02,
        benefits: [
          "Primary care physician visits",
          "Specialist consultations",
          "Emergency room services",
          "Hospital stays and treatments",
          "Prescription medication coverage",
          "Preventive care services",
        ]
      },
      {
        id: 2,
        name: "Vision Care",
        description: "Eye exams and prescription glasses/contacts coverage",
        basePriceEth: 0.008,
        benefits: [
          "Annual eye examinations",
          "Prescription glasses coverage",
          "Contact lenses allowance",
          "Vision correction procedures",
          "Specialized eye treatments",
        ]
      },
      {
        id: 3,
        name: "Preventative Care",
        description: "Wellness visits, vaccinations, and preventative screenings",
        basePriceEth: 0.015,
        benefits: [
          "Annual wellness check-ups",
          "Vaccinations and immunizations",
          "Health screenings and tests",
          "Nutrition and dietary guidance",
          "Fitness and wellness programs",
        ]
      },
    ];
  
    // Log the request for monitoring purposes
    console.log(`Insurance API request: ${req.method} ${req.url}`);
    
    // Return the insurance plans data
    res.status(200).json({
      success: true,
      data: insurancePlans,
      timestamp: new Date().toISOString(),
    });
  }