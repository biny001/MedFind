export type Medicine = {
  id: string;
  name: string;
  category: string;
  dosage: string;
  price: number;
  stock: number;
};
// Based on Therapeutic Use
export const therapeuticUses: string[] = [
  "Analgesic", // Pain relief
  "Antibiotic", // Infections
  "Antidepressant", // Mood disorders
  "Antihypertensive", // High blood pressure
  "Antipyretic", // Fever reducer
  "Antiviral", // Viral infections
  "Antidiabetic", // Diabetes
  "Antacid", // Stomach acidity
  "Antihistamine", // Allergies
  "Sedative", // Sleep aid
  "Vaccine", // Immunization
];

// Based on Form
export const forms: string[] = [
  "Tablet", // Solid form
  "Capsule", // Gelatin shell
  "Syrup", // Liquid medication
  "Injection", // Parenteral administration
  "Cream", // Topical application
  "Ointment", // Topical application
  "Powder", // For reconstitution or direct use
  "Spray", // Nasal/oral/inhalation
  "Patch", // Transdermal
  "Drops", // Eye/ear drops
  "Suppository", // Rectal/vaginal administration
  "Inhaler", // Respiratory
];

export const unit: string[] = [
  "mg", // Milligrams
  "g", // Grams
  "mcg", // Micrograms
  "kg", // Kilograms
  "ml", // Milliliters
  "l", // Liters
  "IU", // International Units
  "puffs", // Measurement unit for inhalers
  "dose", // Generic measurement for dosages
  "actuation", // Single spray or actuation for inhalers
];

export const medicines: Medicine[] = [
  {
    id: "1",
    name: "Aspirin",
    category: "Pain Relief",
    dosage: "325mg",
    price: 5.99,
    stock: 500,
  },
  {
    id: "2",
    name: "Amoxicillin",
    category: "Antibiotic",
    dosage: "500mg",
    price: 12.99,
    stock: 200,
  },
  {
    id: "3",
    name: "Lisinopril",
    category: "Blood Pressure",
    dosage: "10mg",
    price: 8.99,
    stock: 300,
  },
  {
    id: "4",
    name: "Metformin",
    category: "Diabetes",
    dosage: "500mg",
    price: 7.99,
    stock: 400,
  },
  {
    id: "5",
    name: "Simvastatin",
    category: "Cholesterol",
    dosage: "20mg",
    price: 9.99,
    stock: 250,
  },
];
