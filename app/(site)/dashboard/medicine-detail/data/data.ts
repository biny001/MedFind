export interface Medicine {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  administrationRoute: string;
  form: string;
  storage: string;
  quantity: number;
  supplier: string;
  doseUnit: string;
  doseAmount: string;
  medicineImage: string[];
  pharmacyId: string;
  createdAt: Date;
  updatedAt: Date;
}
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
    description: "Used to reduce fever and relieve mild to moderate pain.",
    price: 5.99,
    administrationRoute: "Oral",
    form: "Tablet",
    storage: "Store at room temperature, away from moisture and heat.",
    quantity: 500,
    supplier: "HealthCorp Ltd.",
    doseUnit: "mg",
    doseAmount: "325",
    medicineImage: ["https://example.com/images/aspirin.jpg"],
    pharmacyId: "pharmacy1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Amoxicillin",
    category: "Antibiotic",
    description: "Treats bacterial infections.",
    price: 12.99,
    administrationRoute: "Oral",
    form: "Capsule",
    storage: "Store at room temperature in a tightly sealed container.",
    quantity: 200,
    supplier: "MediSupply Co.",
    doseUnit: "mg",
    doseAmount: "500",
    medicineImage: ["https://example.com/images/amoxicillin.jpg"],
    pharmacyId: "pharmacy1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more sample data here...
];
