// utils/amenity-mapper.ts


// Category grouping
export const amenitiesByCategory: Record<string, string[]> = {
  "Technology & Connectivity": [
    "WiFi", "High-Speed Internet", "Smart TV", "Cable TV", "Bluetooth Speaker",
    "USB Charging Ports", "Laptop-Friendly Workspace", "Phone", "Fax Machine"
  ],
  "Climate Control": [
    "Air Conditioning", "Heating", "Ceiling Fan", "Fireplace", "Thermostat"
  ],
  "Kitchen & Dining": [
    "Kitchen", "Kitchenette", "Microwave", "Refrigerator", "Dishwasher",
    "Coffee Maker", "Kettle", "Toaster", "Stove/Oven", "Dining Table",
    "Cookware", "Wine Glasses", "Blender"
  ],
  "Bathroom & Personal Care": [
    "Private Bathroom", "Shared Bathroom", "Hot Water", "Shower", "Bathtub",
    "Hair Dryer", "Towels", "Toiletries", "Bathrobe", "Slippers", "Bidet"
  ],
  "Bedroom & Comfort": [
    "King Bed", "Queen Bed", "Twin Beds", "Sofa Bed", "Extra Pillows",
    "Linens", "Blackout Curtains", "Alarm Clock", "Iron & Board", 
    "Closet/Wardrobe", "Hangers"
  ],
  "Entertainment & Leisure": [
    "Streaming Services", "Books/Library", "Board Games", "Video Games",
    "Pool Table", "Ping Pong", "Dart Board", "Piano", "Guitar"
  ],
  "Outdoor & Views": [
    "Balcony", "Patio", "Garden View", "Ocean View", "Mountain View",
    "City View", "Private Entrance", "Outdoor Furniture", "BBQ Grill",
    "Fire Pit", "Hammock"
  ],
  "Safety & Security": [
    "Safe/Lockbox", "Smoke Detector", "Carbon Monoxide Detector",
    "Fire Extinguisher", "First Aid Kit", "Security Cameras", "Smart Lock",
    "Security Guard", "Emergency Exit"
  ],
  "Parking & Transportation": [
    "Free Parking", "Paid Parking", "Street Parking", "EV Charging",
    "Garage", "Valet Parking", "Bicycle Storage", "Airport Shuttle",
    "Car Rental"
  ],
  "Family & Children": [
    "Kid-Friendly", "Crib/Cot", "High Chair", "Baby Monitor", "Toys",
    "Children's Books", "Baby Bath", "Changing Table", "Stroller"
  ],
  "Pet Amenities": [
    "Pet-Friendly", "Dog Allowed", "Cat Allowed", "Pet Bed", "Pet Bowls",
    "Fenced Yard", "Pet Toys", "Pet Waste Bags", "Pet Sitting Available"
  ],
  "Laundry & Cleaning": [
    "Washer", "Dryer", "Laundry Service", "Iron & Ironing Board",
    "Clothes Drying Rack", "Cleaning Products", "Vacuum Cleaner", "Broom & Dustpan"
  ],
  "Wellness & Spa": [
    "Pool", "Hot Tub/Jacuzzi", "Sauna", "Gym/Fitness Center", "Yoga Mats",
    "Massage Services", "Steam Room", "Beach Access", "Spa"
  ],
  "Business & Work": [
    "Dedicated Workspace", "Ergonomic Chair", "Monitor", "Printer",
    "Meeting Room", "Business Center", "Fax", "Copier"
  ],
  "Accessibility": [
    "Wheelchair Accessible", "Elevator", "Grab Rails", "Roll-in Shower",
    "Wide Doorways", "Accessible Parking", "Braille Signage", "Lowered Counters"
  ],
  "Food & Beverage Services": [
    "Breakfast Included", "Restaurant On-site", "Room Service", "Bar/Lounge",
    "Mini Bar", "Complimentary Snacks", "BBQ Area", "Outdoor Dining", "Vending Machines"
  ],
  "Miscellaneous Services": [
    "24/7 Check-in", "Self Check-in", "Luggage Storage", "Concierge Service",
    "Housekeeping", "Welcome Basket", "Long-term Stays", "Events Allowed",
    "Smoking Allowed", "Non-Smoking"
  ]
};

export const amenityIconMap: Record<string, string> = {
  // Technology & Connectivity
  "WiFi": "Wifi",
  "High-Speed Internet": "Globe",
  "Smart TV": "Tv",
  "Cable TV": "Tv2",
  "Bluetooth Speaker": "Speaker",
  "USB Charging Ports": "Plug",
  "Laptop-Friendly Workspace": "Laptop",
  "Phone": "Phone",
  "Fax Machine": "Printer",

  // Climate Control
  "Air Conditioning": "AirVent",
  "Heating": "Flame",
  "Ceiling Fan": "Fan",
  "Fireplace": "Flame",
  "Thermostat": "Thermometer",

  // Kitchen & Dining
  "Kitchen": "ChefHat",
  "Kitchenette": "CookingPot",
  "Microwave": "Microwave",
  "Refrigerator": "Refrigerator",
  "Dishwasher": "Waves",
  "Coffee Maker": "Coffee",
  "Kettle": "Coffee",
  "Toaster": "Flame",
  "Stove/Oven": "Flame",
  "Dining Table": "UtensilsCrossed",
  "Cookware": "CookingPot",
  "Wine Glasses": "Wine",
  "Blender": "Blend",

  // Bathroom & Personal Care
  "Private Bathroom": "Bath",
  "Shared Bathroom": "Users",
  "Hot Water": "Droplets",
  "Shower": "ShowerHead",
  "Bathtub": "Bath",
  "Hair Dryer": "Wind",
  "Towels": "Shirt",
  "Toiletries": "Sparkles",
  "Bathrobe": "Shirt",
  "Slippers": "Footprints",
  "Bidet": "Droplet",

  // Bedroom & Comfort
  "King Bed": "Bed",
  "Queen Bed": "Bed",
  "Twin Beds": "BedDouble",
  "Sofa Bed": "Sofa",
  "Extra Pillows": "Pillow",
  "Linens": "Layers",
  "Blackout Curtains": "Moon",
  "Alarm Clock": "AlarmClock",
  "Iron & Board": "Zap",
  "Closet/Wardrobe": "Cabinet",
  "Hangers": "Minus",

  // Entertainment & Leisure
  "Streaming Services": "Tv",
  "Books/Library": "BookOpen",
  "Board Games": "Puzzle",
  "Video Games": "Gamepad2",
  "Pool Table": "Circle",
  "Ping Pong": "CircleDot",
  "Dart Board": "Target",
  "Piano": "Music",
  "Guitar": "Music2",

  // Outdoor & Views
  "Balcony": "Home",
  "Patio": "TreePine",
  "Garden View": "Trees",
  "Ocean View": "Waves",
  "Mountain View": "Mountain",
  "City View": "Building2",
  "Private Entrance": "DoorOpen",
  "Outdoor Furniture": "Armchair",
  "BBQ Grill": "Flame",
  "Fire Pit": "Flame",
  "Hammock": "Wind",

  // Safety & Security
  "Safe/Lockbox": "Lock",
  "Smoke Detector": "AlertTriangle",
  "Carbon Monoxide Detector": "Shield",
  "Fire Extinguisher": "Flame",
  "First Aid Kit": "Plus",
  "Security Cameras": "Video",
  "Smart Lock": "LockKeyhole",
  "Security Guard": "ShieldCheck",
  "Emergency Exit": "DoorOpen",

  // Parking & Transportation
  "Free Parking": "Car",
  "Paid Parking": "DollarSign",
  "Street Parking": "CarFront",
  "EV Charging": "Zap",
  "Garage": "Warehouse",
  "Valet Parking": "User",
  "Bicycle Storage": "Bike",
  "Airport Shuttle": "Bus",
  "Car Rental": "CarTaxiFront",

  // Family & Children
  "Kid-Friendly": "Baby",
  "Crib/Cot": "Baby",
  "High Chair": "ChairOffice",
  "Baby Monitor": "Radio",
  "Toys": "Gamepad",
  "Children's Books": "BookOpen",
  "Baby Bath": "Bath",
  "Changing Table": "Table",
  "Stroller": "Baby",

  // Pet Amenities
  "Pet-Friendly": "Dog",
  "Dog Allowed": "Dog",
  "Cat Allowed": "Cat",
  "Pet Bed": "Bed",
  "Pet Bowls": "Circle",
  "Fenced Yard": "Square",
  "Pet Toys": "Dog",
  "Pet Waste Bags": "Trash",
  "Pet Sitting Available": "Heart",

  // Laundry & Cleaning
  "Washer": "WashingMachine",
  "Dryer": "Wind",
  "Laundry Service": "Shirt",
  "Iron & Ironing Board": "Zap",
  "Clothes Drying Rack": "Layers",
  "Cleaning Products": "Sparkles",
  "Vacuum Cleaner": "Wind",
  "Broom & Dustpan": "Brush",

  // Wellness & Spa
  "Pool": "Waves",
  "Hot Tub/Jacuzzi": "Waves",
  "Sauna": "Flame",
  "Gym/Fitness Center": "Dumbbell",
  "Yoga Mats": "User",
  "Massage Services": "Hand",
  "Steam Room": "Cloud",
  "Beach Access": "Palmtree",
  "Spa": "Sparkles",

  // Business & Work
  "Dedicated Workspace": "Briefcase",
  "Ergonomic Chair": "ChairOffice",
  "Monitor": "Monitor",
  "Printer": "Printer",
  "Meeting Room": "Users",
  "Business Center": "Building",
  "Fax": "Send",
  "Copier": "Copy",

  // Accessibility
  "Wheelchair Accessible": "Accessibility",
  "Elevator": "MoveVertical",
  "Grab Rails": "Grip",
  "Roll-in Shower": "ShowerHead",
  "Wide Doorways": "DoorOpen",
  "Accessible Parking": "Car",
  "Braille Signage": "Hand",
  "Lowered Counters": "Minus",

  // Food & Beverage Services
  "Breakfast Included": "Coffee",
  "Restaurant On-site": "UtensilsCrossed",
  "Room Service": "Bell",
  "Bar/Lounge": "Wine",
  "Mini Bar": "Wine",
  "Complimentary Snacks": "Cookie",
  "BBQ Area": "Flame",
  "Outdoor Dining": "UtensilsCrossed",
  "Vending Machines": "Package",

  // Miscellaneous Services
  "24/7 Check-in": "Clock",
  "Self Check-in": "Key",
  "Luggage Storage": "Package",
  "Concierge Service": "UserCheck",
  "Housekeeping": "Sparkles",
  "Welcome Basket": "ShoppingBasket",
  "Long-term Stays": "Calendar",
  "Events Allowed": "PartyPopper",
  "Smoking Allowed": "Cigarette",
  "Non-Smoking": "CigaretteOff"
};


export function getAmenityCategory(amenityName: string): string {
  for (const category in amenitiesByCategory) {
    if (amenitiesByCategory[category].includes(amenityName)) {
      return category;
    }
  }
  return "Miscellaneous Services"; // fallback
}

export function getAmenityIcon(amenityName: string): string {
  return amenityIconMap[amenityName] || "Box"; // fallback icon
}
