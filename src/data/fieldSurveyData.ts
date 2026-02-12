export type QuestionType = "bool" | "choice" | "count" | "text";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[]; // for choice type
}

export interface Location {
  letter: string;
  name: string;
  address: string;
  lat?: number;
  lon?: number;
  phone?: string;
  website?: string;
  hours?: string;
  money?: string;
  questions: Question[];
}

export interface Entity {
  slug: string;
  name: string;
  description: string;
  color: string; // tailwind border color
  locations: Location[];
}

const letterColors: Record<string, string> = {
  A: "border-red-500",
  B: "border-orange-500",
  C: "border-yellow-500",
  D: "border-green-500",
  E: "border-blue-500",
  F: "border-indigo-500",
  G: "border-purple-500",
};

export function getLetterColor(letter: string): string {
  return letterColors[letter] || "border-gray-500";
}

export const entities: Entity[] = [
  {
    slug: "prcc",
    name: "PRCC",
    description: "Puerto Rican Cultural Center — Humboldt Park",
    color: "from-red-600 to-orange-500",
    locations: [
      {
        letter: "A",
        name: "PRCC Main HQ",
        address: "2739 W Division St", lat: 41.903, lon: -87.6938, phone: "773-360-1613", website: "https://prcc-chgo.org", hours: "M-F 9am-5pm", money: "$46.7M total",
        questions: [
          { id: "open", type: "bool", label: "Building is open / accessible" },
          { id: "staff", type: "choice", label: "Staff visible", options: ["None", "1-5", "6-20", "20+"] },
          { id: "signage", type: "bool", label: "PRCC signage visible" },
          { id: "multiOrg", type: "bool", label: "Multiple org names on building" },
          { id: "activity", type: "choice", label: "Activity level", options: ["Empty", "Light", "Busy"] },
          { id: "otherOrgs", type: "text", label: "Other org names on building" },
        ],
      },
      {
        letter: "B",
        name: "VIDA/SIDA (HIV Clinic)",
        address: "2556 W Division St", lat: 41.903, lon: -87.69, hours: "M-F 9am-5pm", money: "CDPH contracts",
        questions: [
          { id: "clinicSignage", type: "bool", label: "Health clinic signage visible" },
          { id: "vidaSida", type: "bool", label: "VIDA/SIDA name visible" },
          { id: "hours", type: "bool", label: "Posted hours / patient info" },
          { id: "activeClinic", type: "bool", label: "Looks like active healthcare facility" },
          { id: "clients", type: "choice", label: "Clients visible", options: ["None", "1-5", "5+"] },
          { id: "staffCount", type: "count", label: "Approx staff visible" },
        ],
      },
      {
        letter: "C",
        name: "Community Center / NBDC",
        address: "2640 W Division St", lat: 41.903, lon: -87.6918, hours: "M-F 9am-5pm",
        questions: [
          { id: "active", type: "bool", label: "Community space active" },
          { id: "youth", type: "bool", label: "Youth present" },
          { id: "nbdc", type: "bool", label: "Business development signage / NBDC" },
          { id: "hours", type: "bool", label: "Posted hours" },
          { id: "spaceType", type: "choice", label: "Space type", options: ["Office", "Classroom", "Mixed", "Empty"] },
        ],
      },
      {
        letter: "D",
        name: "HOPWA Housing / El Rescate",
        address: "Ask at HQ", lat: 41.9032, lon: -87.6935, money: "$2.64M rehab",
        questions: [
          { id: "foundHopwa", type: "bool", label: "Could identify HOPWA housing location(s)" },
          { id: "elRescate", type: "bool", label: "El Rescate signage visible anywhere" },
          { id: "units", type: "count", label: "Housing units visible at identified location" },
          { id: "condition", type: "choice", label: "Building condition", options: ["Good", "Fair", "Poor", "Vacant"] },
          { id: "address", type: "text", label: "Address of housing if found" },
        ],
      },
      {
        letter: "E",
        name: "Dr. Pedro Albizu Campos HS",
        address: "Near 2739 W Division", lat: 41.9028, lon: -87.694, hours: "M-F 8am-3pm (school year)",
        questions: [
          { id: "signage", type: "bool", label: "School signage visible" },
          { id: "students", type: "bool", label: "Students visible" },
          { id: "accreditation", type: "bool", label: "Accreditation posted" },
          { id: "size", type: "choice", label: "School size", options: ["Tiny (<20)", "Small (20-50)", "Medium (50-100)", "Large"] },
          { id: "separate", type: "bool", label: "Separate building from PRCC HQ" },
        ],
      },
      {
        letter: "F",
        name: "Paseo Boricua Arts Housing",
        address: "Division St corridor", lat: 41.903, lon: -87.692, money: "$14.4M",
        questions: [
          { id: "found", type: "bool", label: "Found ~24-unit residential building on corridor" },
          { id: "occupied", type: "bool", label: "Building appears occupied" },
          { id: "condition", type: "choice", label: "Building condition", options: ["New/Excellent", "Good", "Fair", "Poor"] },
          { id: "mgmt", type: "bool", label: "Property management signage" },
          { id: "brinshore", type: "bool", label: "Brinshore or PRCC name on building" },
          { id: "address", type: "text", label: "Exact address of building" },
        ],
      },
      {
        letter: "G",
        name: "Cultural / Political Spaces",
        address: "Division St between Western & California", lat: 41.903, lon: -87.691,
        questions: [
          { id: "storefronts", type: "count", label: "PRCC-affiliated storefronts on corridor (total)" },
          { id: "laCasita", type: "bool", label: "La Casita de Don Pedro — open / visible" },
          { id: "gallery", type: "bool", label: "Gallery or performance space — active" },
          { id: "advocacy", type: "bool", label: "Political advocacy materials visible" },
          { id: "list", type: "text", label: "List all PRCC-affiliated storefronts with addresses" },
        ],
      },
    ],
  },
  {
    slug: "kleo",
    name: "KLEO",
    description: "KLEO Community Family Life Center — Greater Englewood",
    color: "from-blue-600 to-cyan-500",
    locations: [
      {
        letter: "A",
        name: "KLEO HQ",
        address: "119 E Garfield Blvd", lat: 41.7943, lon: -87.619, phone: "773-363-6941", website: "https://thekleocenter.org", hours: "Pantry: Tue 4-7pm, Wed 11am-1pm", money: "$240M+",
        questions: [
          { id: "open", type: "bool", label: "Building is open / accessible" },
          { id: "size", type: "choice", label: "Facility size", options: ["Small office", "Medium", "Large", "Warehouse-scale"] },
          { id: "staff", type: "choice", label: "Staff visible", options: ["0-2", "3-10", "10-25", "25+"] },
          { id: "shelter", type: "bool", label: "Shelter operations signage / evidence" },
          { id: "youth", type: "bool", label: "Youth program activity visible" },
          { id: "logistics", type: "bool", label: "Logistics indicators (vehicles, supplies)" },
          { id: "shelterSites", type: "text", label: "How many shelter sites does KLEO operate?" },
          { id: "beds", type: "text", label: "How many total beds?" },
          { id: "hiring", type: "bool", label: "Hiring signs posted" },
        ],
      },
      {
        letter: "B",
        name: "Workforce Hub",
        address: "79th St corridor", lat: 41.7513, lon: -87.6443,
        questions: [
          { id: "found", type: "bool", label: "Workforce facility found" },
          { id: "signage", type: "bool", label: "KLEO signage" },
          { id: "programming", type: "bool", label: "Active programming" },
          { id: "space", type: "choice", label: "Space", options: ["Not found", "Empty", "Small office", "Training facility"] },
          { id: "address", type: "text", label: "Exact address if found" },
        ],
      },
      {
        letter: "C",
        name: "757 W 79th St (Evergreen)",
        address: "757 W 79th St", lat: 41.7513, lon: -87.6441, money: "$18M TIF",
        questions: [
          { id: "status", type: "choice", label: "Building status", options: ["Under construction", "Complete-occupied", "Complete-empty", "Not found"] },
          { id: "communityCenter", type: "bool", label: "KLEO community center on ground floor — open" },
          { id: "occupancy", type: "choice", label: "Occupancy", options: ["Empty", "<25%", "25-75%", "75%+", "Can't tell"] },
          { id: "residential", type: "bool", label: "Residential activity" },
          { id: "groundFloor", type: "text", label: "What's in ground floor commercial space" },
        ],
      },
      {
        letter: "D",
        name: "838 W 79th St (Evergreen)",
        address: "838 W 79th St", lat: 41.7513, lon: -87.6455,
        questions: [
          { id: "status", type: "choice", label: "Building status", options: ["Under construction", "Complete-occupied", "Complete-empty", "Not found"] },
          { id: "ayoFoods", type: "bool", label: "AYO Foods operating" },
          { id: "occupancy", type: "choice", label: "Occupancy", options: ["Empty", "<25%", "25-75%", "75%+", "Can't tell"] },
          { id: "businesses", type: "text", label: "What businesses in commercial space" },
        ],
      },
      {
        letter: "E",
        name: "Shelter Sites", money: "$132M EFSP",
        address: "UNKNOWN",
        questions: [
          { id: "addresses", type: "text", label: "Shelter addresses obtained" },
          { id: "count", type: "count", label: "Number of shelter sites identified" },
          { id: "leads", type: "text", label: "Leads from aldermanic offices" },
        ],
      },
      {
        letter: "F",
        name: "GAGDC Hub",
        address: "839 W 79th St Ste 400", lat: 41.7513, lon: -87.6456, website: "https://www.gagdc.org",
        questions: [
          { id: "gagdc", type: "bool", label: "GAGDC office operating" },
          { id: "shared", type: "bool", label: "Shared space/staff with KLEO" },
          { id: "hub", type: "bool", label: "Healthy Lifestyle Hub functioning" },
          { id: "activity", type: "choice", label: "Activity", options: ["Closed", "Light", "Active", "Busy"] },
        ],
      },
    ],
  },
  {
    slug: "shelters",
    name: "Migrant Shelters",
    description: "Migrant shelter network — food service & operations",
    color: "from-green-600 to-emerald-500",
    locations: [
      {
        letter: "A",
        name: "14 Parish / Nella's",
        address: "1644 E 53rd St, Hyde Park", lat: 41.7995, lon: -87.5867, website: "https://www.14parish.com", hours: "Tue-Thu 12-11pm, Fri-Sat 12-2am, Mon CLOSED", money: "$149M",
        questions: [
          { id: "whatHere", type: "choice", label: "What's at this address", options: ["Restaurant only", "Restaurant + kitchen", "Commercial kitchen", "Other"] },
          { id: "nellasOpen", type: "bool", label: "Nella's open for business" },
          { id: "kitchenScale", type: "choice", label: "Kitchen scale", options: ["Small restaurant", "Large restaurant", "Commercial/industrial", "Can't see"] },
          { id: "delivery", type: "bool", label: "Delivery vehicles visible" },
          { id: "hotHolding", type: "bool", label: "Hot-holding/catering equipment visible" },
          { id: "highVolume", type: "bool", label: "Evidence of high-volume food prep" },
          { id: "staff", type: "count", label: "Staff visible" },
          { id: "meals", type: "text", label: "How many meals prepared daily?" },
          { id: "shelterDelivery", type: "text", label: "Which shelters do they deliver to?" },
        ],
      },
      {
        letter: "B",
        name: "77 Communities (Woodridge)",
        address: "7601 Lemont Rd", lat: 41.715, lon: -87.992, money: "$140M",
        questions: [
          { id: "whatHere", type: "choice", label: "What's here", options: ["Commercial kitchen", "Office", "Residential", "Warehouse", "Nothing"] },
          { id: "foodService", type: "bool", label: "Food service operation visible" },
          { id: "vehicles", type: "bool", label: "Commercial vehicles" },
          { id: "signage", type: "bool", label: "77 Communities signage" },
          { id: "description", type: "text", label: "Description" },
        ],
      },
      {
        letter: "C",
        name: "77 Communities (Burr Ridge)",
        address: "6910 N Frontage Rd", lat: 41.7545, lon: -87.9268,
        questions: [
          { id: "whatHere", type: "choice", label: "What's here", options: ["Commercial kitchen", "Office", "Residential", "Warehouse", "Nothing"] },
          { id: "foodService", type: "bool", label: "Food service operation visible" },
          { id: "signage", type: "bool", label: "77 Communities signage" },
          { id: "description", type: "text", label: "Description" },
        ],
      },
      {
        letter: "D",
        name: "Wadsworth School Shelter",
        address: "6420 S University Ave", lat: 41.7795, lon: -87.5973, hours: "24/7 if active",
        questions: [
          { id: "status", type: "choice", label: "Status", options: ["Active shelter", "Closed/boarded", "Converted", "Can't tell"] },
          { id: "security", type: "bool", label: "Security/access control visible" },
          { id: "people", type: "bool", label: "People entering/exiting" },
          { id: "operator", type: "choice", label: "Operator signage", options: ["KLEO", "Bright Star", "City of Chicago", "ESS", "Other", "None"] },
          { id: "count", type: "count", label: "People visible around site" },
        ],
      },
      {
        letter: "E",
        name: "KLEO HQ",
        address: "119 E Garfield Blvd",
        questions: [
          { id: "addresses", type: "text", label: "Shelter addresses obtained" },
          { id: "operators", type: "text", label: "Who operates shelters" },
        ],
      },
      {
        letter: "F",
        name: "Bright Star CDC",
        address: "651 W Washington Blvd", lat: 41.8828, lon: -87.6442, money: "$29M+",
        questions: [
          { id: "whatHere", type: "choice", label: "What's here", options: ["Office", "Community center", "Shelter", "Mixed", "Nothing"] },
          { id: "staff", type: "choice", label: "Staff visible", options: ["0", "1-5", "5+"] },
          { id: "shelterOps", type: "bool", label: "Shelter operations evidence" },
          { id: "sites", type: "text", label: "Where are Bright Star shelter sites?" },
        ],
      },
      {
        letter: "G",
        name: "Inn of Chicago",
        address: "162 E Ohio St, Streeterville", lat: 41.8929, lon: -87.6239, hours: "Hotel 24/7",
        questions: [
          { id: "use", type: "choice", label: "Current use", options: ["Active shelter", "Normal hotel", "Closed", "Mixed", "Can't tell"] },
          { id: "security", type: "bool", label: "Security beyond normal hotel" },
          { id: "shelterUse", type: "bool", label: "Evidence of shelter use" },
          { id: "operator", type: "text", label: "Who appears to operate" },
        ],
      },
    ],
  },
  {
    slug: "childhood",
    name: "Early Childhood Vendors",
    description: "DFSS Head Start / Early Childhood (CS-CEL) • $3.1B since 2019 • 8 targets",
    color: "border-pink-500",
    locations: [
      {
        letter: "A",
        name: "Shining Star Youth",
        address: "3012 E 92nd St, Chicago 60617", lat: 41.73, lon: -87.5545, website: "https://www.shiningstaryouth.com", hours: "M-F 8am-3pm (Head Start)", money: "$87M",
        questions: [
          { id: "facility_type", type: "choice", label: "Facility type", options: ["Active daycare", "Office only", "Residential", "Empty", "Other"] },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "children_count", type: "count", label: "Approx children visible" },
          { id: "staff_count", type: "count", label: "Approx staff visible" },
          { id: "signage", type: "bool", label: "Shining Star signage" },
          { id: "naeyc", type: "bool", label: "NAEYC accreditation posted" },
          { id: "dcfs", type: "bool", label: "DCFS license posted" },
          { id: "playground", type: "bool", label: "Playground / outdoor space" },
          { id: "scale", type: "choice", label: "Facility scale vs $35M/yr", options: ["Way too small", "Modest", "Reasonable", "Large"] },
          { id: "gap_year", type: "text", label: "Ask: What happened in 2023? (gap year)" },
          { id: "other_locations", type: "text", label: "Other locations mentioned by staff" },
        ],
      },
      {
        letter: "B",
        name: "Allison's Infant & Toddler",
        address: "234 E 115th St, 1st Fl, Chicago 60628", lat: 41.6852, lon: -87.6264, hours: "M-F ~6:30am-6pm", money: "$49M",
        questions: [
          { id: "facility_type", type: "choice", label: "Facility type", options: ["Active daycare", "Office only", "Residential", "Empty", "Other"] },
          { id: "children_present", type: "bool", label: "Children present (infants/toddlers)" },
          { id: "children_count", type: "count", label: "Approx children visible" },
          { id: "dcfs", type: "bool", label: "DCFS license posted" },
          { id: "scale", type: "choice", label: "Facility scale", options: ["Home daycare", "Small center", "Medium", "Large"] },
          { id: "vendor_id", type: "text", label: "Ask: Have you ever had a different vendor number with the city?" },
          { id: "how_long", type: "text", label: "Ask: How long at this location?" },
        ],
      },
      {
        letter: "C",
        name: "It Takes A Village (original)",
        address: "4000 W Division St, Chicago 60651", lat: 41.903, lon: -87.727, hours: "M-F 7am-6pm if open", money: "$108.5M",
        questions: [
          { id: "whats_here", type: "choice", label: "What's at 4000 W Division", options: ["Active daycare", "Closed", "Different business", "Empty"] },
          { id: "itav_signage", type: "bool", label: "It Takes A Village signage" },
          { id: "cen_signage", type: "bool", label: "Community Education Network signage" },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "relationship", type: "text", label: "Ask: Relationship between ITAV and Community Education Network?" },
        ],
      },
      {
        letter: "D",
        name: "It Takes A Village (River City)",
        address: "800 S Wells St Ste 180, Chicago 60607", lat: 41.872, lon: -87.634,
        questions: [
          { id: "whats_here", type: "choice", label: "What's at 800 S Wells", options: ["Active daycare", "Office only", "Empty", "Other"] },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "childcare_signage", type: "bool", label: "Any childcare signage" },
          { id: "impression", type: "choice", label: "Looks like", options: ["Real daycare", "Admin office", "Neither"] },
          { id: "description", type: "text", label: "Description of what's here" },
        ],
      },
      {
        letter: "E",
        name: "Galewood / A-Karrasel",
        address: "5504 W Fullerton Ave, Chicago 60639", lat: 41.9234, lon: -87.7664, hours: "M-F 7am-6pm if open", money: "$12M+",
        questions: [
          { id: "facility_type", type: "choice", label: "Facility type", options: ["Active daycare", "Office", "Residential", "Empty"] },
          { id: "galewood_signage", type: "bool", label: "Galewood Enterprises signage" },
          { id: "akarrasel_signage", type: "bool", label: "A-Karrasel signage" },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "dcfs", type: "bool", label: "DCFS license posted" },
          { id: "relationship", type: "text", label: "Ask: Relationship between Galewood and A-Karrasel?" },
        ],
      },
      {
        letter: "F",
        name: "Montessori Network",
        address: "6550 S Seeley Ave, Chicago 60636", lat: 41.7749, lon: -87.6688, hours: "M-F 8am-3pm", money: "$20M",
        questions: [
          { id: "facility_type", type: "choice", label: "Facility type", options: ["Active daycare", "Office", "Residential", "Empty"] },
          { id: "montessori_env", type: "bool", label: "Montessori materials/environment visible" },
          { id: "accreditation", type: "bool", label: "AMI or AMS accreditation posted" },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "children_count", type: "count", label: "Approx children visible" },
          { id: "ami_ams", type: "text", label: "Ask: Are you AMI/AMS accredited?" },
          { id: "gap_year", type: "text", label: "Ask: What happened in 2023?" },
        ],
      },
      {
        letter: "G",
        name: "Henry Booth House",
        address: "2328 S Dearborn St, Chicago 60616", lat: 41.8505, lon: -87.6292, website: "https://henryboothhouse.org", hours: "M-F daytime", money: "$73M",
        questions: [
          { id: "status", type: "choice", label: "Status", options: ["Still operating", "Reduced operations", "Closed", "Different use"] },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "scale_vs_peak", type: "choice", label: "Scale vs 2020 peak ($50M)", options: ["Full capacity", "Clearly reduced", "Skeletal", "Closed"] },
          { id: "children_count", type: "count", label: "Approx children visible" },
          { id: "why_drop", type: "text", label: "Ask: Why did funding drop from $50M to under $1M?" },
          { id: "compliance", type: "text", label: "Ask: Were you notified of compliance issues?" },
        ],
      },
      {
        letter: "H",
        name: "Kimball Daycare Center",
        address: "1636 N Kimball Ave, Chicago 60647", lat: 41.9115, lon: -87.7123, hours: "M-F 7am-6pm", money: "$138M",
        questions: [
          { id: "facility_type", type: "choice", label: "Facility type", options: ["Single location", "Multiple visible", "Office only", "Other"] },
          { id: "children_present", type: "bool", label: "Children present" },
          { id: "children_count", type: "count", label: "Approx children visible" },
          { id: "scale", type: "choice", label: "Scale impression", options: ["Home daycare", "Small center", "Large center", "Multi-site HQ"] },
          { id: "locations", type: "text", label: "Ask: How many locations do you operate?" },
          { id: "total_children", type: "text", label: "Ask: How many children total across all sites?" },
          { id: "subcontract", type: "text", label: "Ask: Do you subcontract to other providers?" },
        ],
      },
    ],
  },
];

export function getEntity(slug: string): Entity | undefined {
  return entities.find((e) => e.slug === slug);
}
