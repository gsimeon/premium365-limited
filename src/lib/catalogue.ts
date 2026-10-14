import { createClient } from "@/lib/supabase/server";

export type CatalogueProduct = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  description?: string | null;
  sku: string | null;
  price_minor: number;
  currency: string;
  condition: "new" | "refurbished" | "used";
  fulfilment_type: "owned_stock" | "supplier_fulfilled" | "mixed";
  category_id: string | null;
  categories?: { name: string } | null;
  imageUrl?: string;
  badge?: string;
  brand?: string;
  specs?: Record<string, string>;
};

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT") &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  );
}

export { formatPrice } from "@/lib/format";

export const CURATED_DEMO_PRODUCTS: CatalogueProduct[] = [
  // --- 1 to 7: LAPTOPS & ULTRABOOKS ---
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Lenovo ThinkPad X1 Carbon Gen 11 (Intel Core i7, 32GB RAM, 1TB SSD)",
    slug: "lenovo-thinkpad-x1-carbon-gen-11",
    summary: "Ultralight business powerhouse featuring 14-inch 2.8K OLED display, 13th Gen Intel Core i7, and military-grade durability.",
    description: "The gold standard of enterprise computing. Engineered for demanding mobile professionals, the ThinkPad X1 Carbon Gen 11 combines carbon-fibre reinforced chassis with dual-fan ventilation, Dolby Atmos sound, and enhanced AI-driven noise suppression for effortless collaboration.",
    sku: "P365-TP-X1C11",
    price_minor: 159900, // £1,599.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Flagship Ultrabook",
    brand: "Lenovo",
    specs: {
      "Processor": "13th Gen Intel Core i7-1365U (10 Cores, up to 5.2GHz, vPro)",
      "Memory": "32GB LPDDR5-6400MHz Soldered",
      "Storage": "1TB PCIe NVMe Gen 4 Performance SSD",
      "Display": "14.0\" 2.8K (2880 x 1800) OLED, Anti-Reflective, 400 nits, 100% DCI-P3",
      "Graphics": "Integrated Intel Iris Xe Graphics",
      "Connectivity": "Wi-Fi 6E (802.11ax), Bluetooth 5.1, 2x Thunderbolt 4",
      "Operating System": "Windows 11 Pro 64-bit",
      "Warranty": "3-Year Lenovo Premier On-Site Support Included",
    },
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    name: "Apple MacBook Pro 14 (Apple M3 Pro, 18GB Unified Memory, 512GB SSD) Space Black",
    slug: "apple-macbook-pro-14-m3-pro",
    summary: "Space Black workstation with Liquid Retina XDR display, incredible battery endurance, and hardware-accelerated ray tracing.",
    description: "Certified Grade A refurbished workstation with full Premium 365 12-month hardware guarantee. Rigorously tested, sanitized, and certified by our certified engineers with battery health verified at 98%+.",
    sku: "P365-MBP14-M3P",
    price_minor: 174900, // £1,749.00
    currency: "GBP",
    condition: "refurbished",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "Certified Refurbished",
    brand: "Apple",
    specs: {
      "Processor": "Apple M3 Pro (11-core CPU, 14-core GPU, 16-core Neural Engine)",
      "Memory": "18GB Unified Memory",
      "Storage": "512GB High-Speed SSD",
      "Display": "14.2-inch Liquid Retina XDR (3024 x 1964), 1,000,000:1 contrast, 120Hz ProMotion",
      "Ports": "3x Thunderbolt 4, HDMI port, SDXC card slot, MagSafe 3",
      "Battery Life": "Up to 18 hours movie playback",
      "Condition Rating": "Grade A Pristine (Zero screen blemishes, flawless keyboard)",
      "Warranty": "12-Month Premium 365 Return to Base Hardware Warranty",
    },
  },
  {
    id: "3c89b71e-9271-419b-a3d5-2e6b91129f10",
    name: "Dell Latitude 7440 Ultrabook (Intel Core i7-1365U, 16GB RAM, 512GB SSD)",
    slug: "dell-latitude-7440-ultrabook",
    summary: "Premium magnesium-chassis business laptop with Intel vPro enterprise management and ExpressConnect multi-network bridging.",
    description: "Built for fleet deployments and executive workloads. Features thermal acoustics innovations with dual opposite outlet fans, high-density batteries with ExpressCharge, and Dell SafeID hardware security token storage.",
    sku: "P365-LAT-7440",
    price_minor: 129900, // £1,299.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Enterprise Fleet Pick",
    brand: "Dell",
    specs: {
      "Processor": "13th Gen Intel Core i7-1365U (10 Cores, 12MB Cache, up to 5.2GHz, vPro)",
      "Memory": "16GB LPDDR5 4800MT/s integrated",
      "Storage": "512GB M.2 PCIe NVMe Class 35 SSD",
      "Display": "14.0\" FHD+ (1920x1200) AG, ComfortView Plus, 400 nits",
      "Security": "FIPS 201 Contacted SmartCard reader & Touch Fingerprint in Power Button",
      "Operating System": "Windows 11 Pro 64-bit National Academic",
      "Warranty": "3-Year Dell ProSupport with Next Business Day Onsite Service",
    },
  },
  {
    id: "4d90c82f-0382-520c-b4e6-3f7c02230a21",
    name: "HP EliteBook 840 G10 (Intel Core i7-1360P, 32GB RAM, 1TB SSD, 4G LTE)",
    slug: "hp-elitebook-840-g10",
    summary: "Commercial workhorse with HP Wolf Pro Security, integrated 4G mobile broadband, and 5MP auto-tracking IR webcam.",
    description: "Empower hybrid workers with AI-based audio tuning from Bang & Olufsen, 5MP privacy camera with temporal noise reduction, and hardware-enforced endpoint security isolated below the operating system.",
    sku: "P365-EB-840G10",
    price_minor: 138500, // £1,385.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Built-in 4G LTE",
    brand: "HP",
    specs: {
      "Processor": "Intel Core i7-1360P (12 Cores, 16 Threads, up to 5.0GHz, 18MB Cache)",
      "Memory": "32GB DDR5-5200MHz RAM (2x 16GB, user-upgradeable to 64GB)",
      "Storage": "1TB PCIe NVMe TLC Solid State Drive",
      "WWAN": "Intel XMM 7560 R+ LTE-Advanced Cat 16 Cellular Modem",
      "Display": "14\" WUXGA (1920 x 1200), IPS, anti-glare, 400 nits, HP Sure View reflect privacy",
      "Audio": "Audio by Bang & Olufsen with dual stereo speakers",
      "Warranty": "3-Year HP Commercial Worldwide On-Site Warranty",
    },
  },
  {
    id: "5ea1d930-1493-631d-c5f7-4a8d13341b32",
    name: "Microsoft Surface Laptop 6 for Business (Core Ultra 7, 16GB RAM, 512GB SSD)",
    slug: "microsoft-surface-laptop-6",
    summary: "AI-accelerated PixelSense touchscreen with Intel Core Ultra NPU, anti-reflective coating, and Copilot hardware key.",
    description: "Designed for business productivity and security. Featuring Intel AI Boost NPU to accelerate on-device machine learning, dual studio microphones with voice focus, and Microsoft Secured-core PC level defense.",
    sku: "P365-SUR-LAP6",
    price_minor: 149900, // £1,499.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "AI Powered NPU",
    brand: "Microsoft",
    specs: {
      "Processor": "Intel Core Ultra 7 processor 165H with Intel AI Boost NPU",
      "Memory": "16GB LPDDR5x RAM",
      "Storage": "512GB Removable Gen 4 PCIe NVMe SSD",
      "Display": "13.5\" PixelSense Display (2256 x 1504) 10-point multi-touch, Gorilla Glass 5",
      "Camera": "Full HD 1080p Surface Studio Camera with Windows Hello facial sign-in",
      "Ports": "1x Thunderbolt 4/USB4, 1x USB-A 3.1, Surface Connect port",
      "Warranty": "2-Year Commercial Advanced Exchange Warranty",
    },
  },
  {
    id: "6fb2ea41-2504-742e-d6a8-5b9e24452c43",
    name: "Apple MacBook Air 15 (Apple M3, 16GB Unified Memory, 512GB SSD) Midnight",
    slug: "apple-macbook-air-15-m3",
    summary: "Impossibly thin 11.5mm aluminum design with expansive 15.3-inch Liquid Retina display and silent fanless architecture.",
    description: "The ideal balance of screen real estate and lightweight portability for managers, consultants, and analysts. Up to 18 hours of battery life, dual external display support in clamshell mode, and fast MagSafe 3 charging.",
    sku: "P365-MBA15-M3",
    price_minor: 134900, // £1,349.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "Fanless Portability",
    brand: "Apple",
    specs: {
      "Processor": "Apple M3 (8-core CPU with 4 performance cores and 4 efficiency cores, 10-core GPU)",
      "Memory": "16GB Unified Memory",
      "Storage": "512GB NVMe SSD",
      "Display": "15.3-inch LED-backlit Liquid Retina (2880 x 1864), 500 nits, Wide color (P3)",
      "Battery": "66.5-watt-hour lithium-polymer battery with 35W Dual USB-C Port Compact Power Adapter",
      "Weight": "1.51 kg (3.3 pounds)",
      "Warranty": "1-Year Apple Manufacturer Limited Warranty (AppleCare+ Eligible)",
    },
  },
  {
    id: "7ac3fb52-3615-853f-e7b9-6caf35563d54",
    name: "ASUS ExpertBook B9 OLED (Core i7-1355U, 32GB RAM, 2TB SSD, Ultra-light 990g)",
    slug: "asus-expertbook-b9-oled",
    summary: "The world's lightest 14-inch OLED business laptop, weighing just 990 grams in an ultralight magnesium-lithium alloy body.",
    description: "Uncompromised featherweight performance for traveling leaders. Features a brilliant 2.8K 16:10 OLED display, smart dual cooling fans, ASUS NumberPad 2.0 integrated into the trackpad, and MIL-STD-810H durability certification.",
    sku: "P365-ASUS-B9",
    price_minor: 165000, // £1,650.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Sub-1kg Featherweight",
    brand: "ASUS",
    specs: {
      "Weight": "990 grams (2.18 lbs) - Premium Magnesium-Lithium Alloy",
      "Processor": "Intel Core i7-1355U (10 Cores, up to 5.0 GHz, 12MB Cache)",
      "Memory": "32GB LPDDR5 5200MHz",
      "Storage": "2TB M.2 NVMe PCIe 4.0 Performance SSD",
      "Display": "14.0\" 2.8K (2880 x 1800) OLED 16:10, 400nits, 100% DCI-P3, 90Hz",
      "Battery": "63WHrs 3-cell Li-ion with 65W Type-C Fast Charging",
      "Warranty": "3-Year ASUS Commercial Onsite Service",
    },
  },

  // --- 8 to 12: WORKSTATIONS & POWER DESKTOPS ---
  {
    id: "8bd4ac63-4726-9640-f8ca-7db046674e65",
    name: "Dell Precision 3660 Tower Workstation (i9-13900K, 64GB DDR5, NVIDIA RTX A4000)",
    slug: "dell-precision-3660-tower",
    summary: "Heavyweight ISV-certified engineering workstation designed for CAD, 3D simulation, and data science modeling.",
    description: "Engineered for unthrottled computing. Liquid-cooled Intel Core i9-13900K processor combined with workstation-class NVIDIA RTX A4000 16GB GPU provides certified stability across AutoCAD, SolidWorks, Revit, and Adobe Premiere.",
    sku: "P365-PREC-3660",
    price_minor: 285000, // £2,850.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "ISV Certified CAD Rig",
    brand: "Dell",
    specs: {
      "Processor": "Intel Core i9-13900K (24 Cores, 32 Threads, 5.8GHz Turbo, Liquid Cooled)",
      "Memory": "64GB DDR5 4400MHz ECC Memory (Expandable to 128GB)",
      "Graphics": "NVIDIA RTX A4000 16GB GDDR6 Workstation Graphics (4x DisplayPort 1.4)",
      "Storage": "2TB PCIe NVMe Gen 4 M.2 SSD + 4TB 7200RPM Enterprise SATA HDD",
      "Power Supply": "1000W 80 Plus Platinum High Efficiency PSU",
      "ISV Certifications": "Autodesk, Dassault Systèmes, PTC, Adobe, ANSYS certified",
      "Warranty": "3-Year Dell ProSupport Plus with Keep Your Hard Drive Service",
    },
  },
  {
    id: "9ce5bd74-5837-0751-a9db-8ec157785f76",
    name: "Apple Mac Studio (Apple M2 Ultra, 64GB Unified Memory, 1TB SSD)",
    slug: "apple-mac-studio-m2-ultra",
    summary: "Astonishing compact creative powerhouse with 24-core CPU, 60-core GPU, and support for up to 8 simultaneous 4K displays.",
    description: "Designed for production studios, machine learning engineers, and creative directors. Transform any desk into an industrial workstation with unprecedented thermal efficiency, front-facing Thunderbolt 4 ports, and SDXC high-speed reader.",
    sku: "P365-MAC-STUDIO",
    price_minor: 349900, // £3,499.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/analytics.jpg",
    badge: "Studio Masterclass",
    brand: "Apple",
    specs: {
      "Processor": "Apple M2 Ultra (24-core CPU, 60-core GPU, 32-core Neural Engine)",
      "Memory": "64GB Unified Memory (800GB/s memory bandwidth)",
      "Storage": "1TB High Performance PCIe SSD",
      "Ports Front": "2x Thunderbolt 4 (up to 40Gb/s), 1x SDXC card slot (UHS-II)",
      "Ports Rear": "4x Thunderbolt 4, 2x USB-A (up to 5Gb/s), 1x HDMI, 1x 10Gb Ethernet, 3.5mm jack",
      "Display Support": "Up to eight displays simultaneously",
      "Warranty": "1-Year Apple Limited Warranty",
    },
  },
  {
    id: "0df6ce85-6948-1862-baec-9fd268896087",
    name: "Lenovo ThinkStation P3 Tiny Workstation (Core i7, 32GB RAM, 1TB SSD, T1000)",
    slug: "lenovo-thinkstation-p3-tiny",
    summary: "One-litre micro form-factor workstation with dedicated NVIDIA professional graphics and dual display outputs.",
    description: "Full desktop workstation capability condensed into a 1-liter chassis that mounts seamlessly behind monitors or under conference desks. Certified for AutoCAD and financial multi-screen trading desks.",
    sku: "P365-TS-P3TINY",
    price_minor: 112000, // £1,120.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/analytics.jpg",
    badge: "1-Litre Compact",
    brand: "Lenovo",
    specs: {
      "Chassis Volume": "1 Litre Ultra-Small Form Factor (USFF)",
      "Processor": "Intel Core i7-13700T (16 Cores, 24 Threads, up to 4.9GHz, 30MB Cache)",
      "Memory": "32GB DDR5 4800MHz SoDIMM",
      "Graphics": "NVIDIA T1000 8GB GDDR6 (4x Mini-DisplayPort with 4x DP adapters)",
      "Storage": "1TB M.2 2280 PCIe Gen 4 Performance NVMe SSD",
      "Operating System": "Windows 11 Pro 64-bit",
      "Warranty": "3-Year Lenovo Premier Onsite Support",
    },
  },
  {
    id: "1ea7df96-7059-2973-cbfd-0ae3799a7198",
    name: "HP Z2 Mini G9 Workstation (Core i7-13700, 32GB DDR5, 1TB SSD, RTX A2000)",
    slug: "hp-z2-mini-g9-workstation",
    summary: "Petite powerhouse for architectural rendering and healthcare multi-monitor imaging setups.",
    description: "Fits on your desk or mounts behind an HP Z Display. Delivers whisper-quiet acoustics, copper thermal heat pipes, and full ISV certification for CAD engineers requiring workstation horsepower in constrained spaces.",
    sku: "P365-HP-Z2MINI",
    price_minor: 145000, // £1,450.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "Architecture & BIM Ready",
    brand: "HP",
    specs: {
      "Processor": "Intel Core i7-13700 (16 Cores, 24 Threads, up to 5.2GHz, 30MB Cache)",
      "Memory": "32GB DDR5-4800 non-ECC SODIMM (2x 16GB)",
      "Graphics": "NVIDIA RTX A2000 12GB GDDR6 (4x Mini-DisplayPort 1.4)",
      "Storage": "1TB HP Z Turbo Drive PCIe NVMe TLC SSD",
      "Form Factor": "Ultra-compact mini desktop (21.1 x 21.8 x 6.9 cm)",
      "Security": "HP Sure Start Gen 7 self-healing BIOS, HP Wolf Security",
      "Warranty": "3-Year HP Z Care Next Business Day Onsite Warranty",
    },
  },
  {
    id: "2fb8ea07-816a-3a84-dcae-1bf48aab82a9",
    name: "Premium 365 Deep Learning & AI Dev Rig (Ryzen 9 7950X, 128GB RAM, Dual RTX 4090)",
    slug: "premium365-deep-learning-ai-rig",
    summary: "Custom built on-premise AI training rig with 48GB VRAM across dual liquid-cooled RTX 4090s and high-speed PCIe Gen 5 storage.",
    description: "Designed for localized LLM fine-tuning, computer vision training, and high-throughput vector processing. Avoid recurring cloud compute bills by hosting inference and fine-tuning on-premises with redundant enterprise power.",
    sku: "P365-AI-RIGX2",
    price_minor: 589900, // £5,899.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "computers-laptops",
    categories: { name: "Computers & laptops" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "Dual GPU AI Beast",
    brand: "Custom Enterprise",
    specs: {
      "Processor": "AMD Ryzen 9 7950X (16 Cores, 32 Threads, 5.7GHz Boost, 360mm AIO Cooler)",
      "Graphics": "2x NVIDIA GeForce RTX 4090 24GB (Total 48GB High-Bandwidth VRAM)",
      "System Memory": "128GB DDR5 5600MHz Kingston Fury Beast",
      "Fast Cache": "4TB PCIe Gen 5 NVMe SSD (12,400 MB/s Read, 11,800 MB/s Write)",
      "Storage Pool": "8TB PCIe Gen 4 NVMe Secondary Dataset Drive",
      "Power": "Corsair AX1600i 1600W 80 PLUS Titanium Fully Modular Digital Power Supply",
      "OS / Stack": "Ubuntu Server 24.04 LTS pre-installed with NVIDIA CUDA 12.4, PyTorch & Docker",
      "Warranty": "3-Year Premium 365 RTB Enterprise Hardware Warranty with loaner replacement",
    },
  },

  // --- 13 to 19: ENTERPRISE NETWORKING, FIREWALLS & STORAGE ---
  {
    id: "30c9fb18-927b-4b95-edbf-2c059bbc93ba",
    name: "Ubiquiti UniFi Dream Machine Pro (10G SFP+ Enterprise Security Gateway)",
    slug: "ubiquiti-unifi-dream-machine-pro",
    summary: "All-in-one enterprise network gateway, 3.5 Gbps IPS/IDS firewall, and UniFi Network controller appliance.",
    description: "Consolidate routing, threat mitigation, and device management into a single 1U rackmount console. Features dual-WAN failover with 10G SFP+ ports, 8-port Gigabit switch, and built-in 3.5\" HDD bay for UniFi Protect NVR storage.",
    sku: "P365-NET-UDMPRO",
    price_minor: 43500, // £435.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "10G Rack Gateway",
    brand: "Ubiquiti",
    specs: {
      "IDS/IPS Throughput": "3.5 Gbps with Deep Packet Inspection & Threat Prevention",
      "Network Interfaces": "8x 10/100/1000 RJ45 LAN, 1x 10G SFP+ LAN, 1x 10/100/1000 RJ45 WAN, 1x 10G SFP+ WAN",
      "Processor": "Quad-Core ARM Cortex-A57 at 1.7 GHz",
      "Memory": "4 GB DDR4",
      "Surveillance Storage": "1x 3.5\" SATA HDD Bay for UniFi Protect camera footage",
      "Form Factor": "1U 19\" Rack Mountable (Brackets Included)",
      "Warranty": "2-Year Ubiquiti Manufacturer Warranty",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Cisco Meraki MX68 Cloud-Managed Security Appliance",
    slug: "cisco-meraki-mx68-router",
    summary: "Enterprise UTM firewall router with gigabit throughput, integrated PoE+, 4G cellular failover, and cloud dashboard management.",
    description: "Designed specifically for branch offices and distributed small-to-medium businesses. Offers complete zero-touch cloud provisioning, stateful firewall, Cisco Snort intrusion detection, content filtering, and advanced malware protection.",
    sku: "P365-NET-MX68",
    price_minor: 88500, // £885.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "Cyber Essentials Ready",
    brand: "Cisco",
    specs: {
      "Stateful Firewall": "450 Mbps Throughput",
      "Advanced Security": "300 Mbps UTM throughput with Snort IDS/IPS",
      "Maximum Concurrent VPN": "Up to 50 site-to-site VPN tunnels",
      "Ports": "10x GbE (including 2x PoE+ ports for APs or phones)",
      "Cellular Uplink": "Dual SIM slot with LTE support for failover",
      "Management": "Centralized Cisco Meraki Cloud Dashboard",
      "Compliance": "PCI-DSS 3.2.1 Level 1, HIPAA, Cyber Essentials certified architecture",
      "Warranty": "Cisco Meraki Lifetime Hardware Replacement Warranty",
    },
  },
  {
    id: "41da0c29-038c-5ca6-fece-3d16accd04cb",
    name: "Cisco Catalyst 9200L 24-Port Gigabit PoE+ Managed Switch (C9200L-24P-4G-E)",
    slug: "cisco-catalyst-9200l-24p",
    summary: "High-reliability enterprise layer-3 access switch with 370W PoE+ budget, 4x 1G SFP uplinks, and Cisco DNA readiness.",
    description: "Extend the security, resiliency, and programmability of Catalyst 9000 hardware into your branch offices. Features Full Flexible NetFlow, AES-128 MACsec encryption, and hot-swappable dual redundant power supplies.",
    sku: "P365-NET-C9200L",
    price_minor: 142000, // £1,420.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "Enterprise Layer 3",
    brand: "Cisco",
    specs: {
      "Ports": "24x 10/100/1000 Gigabit Ethernet PoE+ ports",
      "PoE Power Budget": "370 Watts (802.3at PoE+ up to 30W per port)",
      "Uplinks": "4x 1G Fixed SFP Uplink ports",
      "Switching Capacity": "56 Gbps (Forwarding Rate: 41.66 Mpps)",
      "Stacking Technology": "StackWise-80 support (up to 80 Gbps stacking bandwidth)",
      "Security": "MACsec-128 hardware encryption, 802.1X, CoPP, Trustworthy Systems",
      "Warranty": "Cisco Enhanced Limited Lifetime Warranty (E-LLW)",
    },
  },
  {
    id: "52eb1d3a-149d-6db7-0fdf-4e27bdde15dc",
    name: "Ubiquiti UniFi Pro Max 24 PoE Switch (Etherlighting, Multi-Gig 2.5GbE)",
    slug: "ubiquiti-unifi-pro-max-24-poe",
    summary: "Layer 3 switch with 8x 2.5GbE PoE++ ports, 16x GbE PoE+ ports, 2x 10G SFP+ ports, and Etherlighting port illumination.",
    description: "Future-proof your Wi-Fi 7 access points and high-throughput servers. Patented Etherlighting illuminates ports to indicate speed, VLAN configuration, and locator status directly from the UniFi mobile app.",
    sku: "P365-NET-USW-PMAX24",
    price_minor: 72000, // £720.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "Wi-Fi 7 Ready 2.5G",
    brand: "Ubiquiti",
    specs: {
      "High-Speed Ports": "8x 2.5GbE PoE++ ports (60W per port) + 16x 1GbE PoE+ ports",
      "Uplinks": "2x 10G SFP+ optical ports",
      "Total PoE Availability": "400 Watts PoE power budget",
      "Etherlighting": "RGB port LEDs indicating locator, port speed, and network/VLAN",
      "Layer 3 Features": "Inter-VLAN routing, static routing, DHCP server",
      "Redundant Power": "USP-RPS DC input for power redundancy",
      "Warranty": "2-Year Ubiquiti Manufacturer Warranty",
    },
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Synology DiskStation DS923+ 4-Bay NAS Solution (16TB RAID Array Included)",
    slug: "synology-diskstation-ds923-plus",
    summary: "Reliable, high-performance network attached storage configured with 4x 4TB Enterprise drives and ECC memory.",
    description: "Compact yet powerful storage for small businesses and creative agencies. Features hardware encryption engine, Btrfs file system with automatic file self-healing, and seamless hybrid cloud backup syncing with Microsoft 365 and Google Workspace.",
    sku: "P365-NAS-DS923",
    price_minor: 119900, // £1,199.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "Business Backup Hub",
    brand: "Synology",
    specs: {
      "Total Raw Capacity": "16TB (4x 4TB Seagate IronWolf Enterprise NAS Drives Included)",
      "RAID Mode": "Pre-configured Synology Hybrid RAID (SHR) with 1-drive fault tolerance",
      "Processor": "AMD Ryzen R1600 Dual-Core (up to 3.1 GHz)",
      "System Memory": "8GB DDR4 ECC RAM (expandable to 32GB)",
      "M.2 Cache Slots": "2x M.2 2280 NVMe SSD slots for high-speed cache acceleration",
      "Network": "2x 1GbE LAN ports with failover & Link Aggregation support (10GbE PCIe upgradeable)",
      "Cloud Integration": "Active Backup for Microsoft 365, Google Workspace, VMware",
      "Warranty": "3-Year Manufacturer Warranty extendable to 5 years",
    },
  },
  {
    id: "63fc2e4b-25ae-7ec8-10ef-5f38ceef26ed",
    name: "QNAP TS-h973AX 9-Bay QuTS hero ZFS Hybrid NAS (32GB RAM, 10GbE SFP+)",
    slug: "qnap-ts-h973ax-zfs-nas",
    summary: "Desktop ZFS storage powerhouse with 5x 3.5\" SATA bays, 2x 2.5\" U.2 NVMe SSD bays, and native 10GbE connectivity.",
    description: "Built for software developers, video editors, and mission-critical virtualization. Runs ZFS-based QuTS hero OS with inline data deduplication, inline compression, nearly limitless snapshots, and real-time SnapSync to remote DR sites.",
    sku: "P365-NAS-TS973AX",
    price_minor: 169000, // £1,690.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/analytics.jpg",
    badge: "ZFS Data Integrity",
    brand: "QNAP",
    specs: {
      "Drive Bays": "5x 3.5\" SATA + 2x 2.5\" U.2 NVMe PCIe Gen3 x4 / SATA + 2x 2.5\" SATA SSD",
      "Operating System": "QuTS hero (ZFS) or QTS (ext4) selectable",
      "Processor": "AMD Ryzen V1500B Quad-Core 2.2 GHz",
      "RAM": "32GB DDR4 SO-DIMM (Max Supported)",
      "Network": "1x 10GBASE-T (10G/5G/2.5G/1G) + 2x 2.5GbE (2.5G/1G)",
      "Deduplication": "Inline Data Deduplication and Compression for maximum storage economy",
      "Warranty": "3-Year QNAP Manufacturer Warranty Included",
    },
  },
  {
    id: "74ad3f5c-36bf-8fd9-21fa-6a49dff037fe",
    name: "Fortinet FortiGate 60F Next-Generation Hardware Firewall",
    slug: "fortinet-fortigate-60f",
    summary: "High-security hardware firewall with patented SOC4 SD-WAN processor and 10 Gbps stateful inspection.",
    description: "The benchmark in SME and enterprise branch cybersecurity. Delivers industry-leading Threat Protection throughput (700 Mbps), SSL inspection without bottlenecks, and zero-trust network access (ZTNA) enforcement.",
    sku: "P365-FW-FG60F",
    price_minor: 69500, // £695.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "networking-storage",
    categories: { name: "Networking & storage" },
    imageUrl: "/images/cybersecurity.jpg",
    badge: "Zero Trust Hardware",
    brand: "Fortinet",
    specs: {
      "Firewall Throughput": "10 Gbps (Enterprise Grade Stateful Packet Inspection)",
      "Threat Protection": "700 Mbps with full antivirus, IPS, and application control active",
      "SSL Inspection": "750 Mbps with TLS 1.3 hardware decryption acceleration",
      "Interfaces": "10x GE RJ45 ports (including 2x WAN, 1x DMZ, 7x Internal LAN)",
      "Concurrent Sessions": "700,000 TCP connections",
      "SD-WAN": "Built-in dynamic path steering over broadband & MPLS",
      "Warranty": "1-Year FortiCare & FortiGuard Unified Threat Management Included",
    },
  },

  // --- 20 to 24: MONITORS, DOCKS & ERGONOMIC WORKSPACE ACCESSORIES ---
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Dell UltraSharp 32 4K USB-C Hub Monitor (U3223QE, IPS Black)",
    slug: "dell-ultrasharp-32-4k-hub-monitor",
    summary: "Colour-accurate 4K IPS Black monitor with 90W USB-C power delivery, integrated RJ45 Ethernet, and KVM switch.",
    description: "Experience brilliant contrast and true-to-life colour with revolutionary IPS Black technology. Built-in USB-C hub connectivity streamlines your workspace with video, data, and 90W charging through a single clean cable.",
    sku: "P365-MON-U3223QE",
    price_minor: 72900, // £729.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "accessories",
    categories: { name: "Accessories" },
    imageUrl: "/images/analytics.jpg",
    badge: "Workplace Essential",
    brand: "Dell",
    specs: {
      "Screen Size": "31.5 Inch 16:9 Aspect Ratio",
      "Resolution": "4K UHD (3840 x 2160) at 60 Hz",
      "Panel Technology": "IPS Black with 2000:1 Contrast Ratio",
      "Color Support": "1.07 Billion colors, 100% sRGB, 98% DCI-P3, HDR 400",
      "Power Delivery": "Up to 90W charging to connected laptops via USB-C",
      "Hub Ports": "1x USB-C with DP 1.4, 1x RJ45 Ethernet, 4x SuperSpeed USB-A 10Gbps, 1x DP Out",
      "Ergonomics": "Height adjustable (150 mm), Tilt, Swivel, Pivot 90°",
      "Warranty": "3-Year Dell Advanced Exchange Service with Premium Panel Guarantee",
    },
  },
  {
    id: "85be4a6d-47c0-90ea-320b-7b5ae001480f",
    name: "LG UltraFine 27\" 5K IPS Thunderbolt Display (27MD5KL-B)",
    slug: "lg-ultrafine-27-5k-display",
    summary: "Retina-grade 5120 x 2880 IPS panel with seamless macOS brightness integration, 94W power delivery, and built-in camera/speakers.",
    description: "Specifically tuned for macOS and high-DPI Windows graphics workflows. Packing 218 pixels per inch, DCI-P3 99% wide color gamut, integrated stereo speakers, microphone, and 1080p webcam.",
    sku: "P365-MON-LG5K",
    price_minor: 89900, // £899.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "accessories",
    categories: { name: "Accessories" },
    imageUrl: "/images/hero-tech.jpg",
    badge: "5K Retina Display",
    brand: "LG",
    specs: {
      "Screen Size": "27-inch 16:9 Aspect Ratio",
      "Resolution": "5K (5120 x 2880) at 60Hz - 218 PPI",
      "Brightness & Gamut": "500 nits brightness, DCI-P3 99%",
      "Thunderbolt Connectivity": "1x Thunderbolt 3 (94W power delivery) + 3x USB-C downstream",
      "Multimedia": "Integrated 1080p camera, dual stereo speakers, and microphone",
      "macOS Integration": "Hardware brightness and volume controlled directly from Mac keyboard",
      "Warranty": "2-Year LG Commercial Exchange Warranty",
    },
  },
  {
    id: "96cf5b7e-58d1-01fb-431c-8c6bf1125910",
    name: "Samsung ViewFinity S9 27\" 5K Matte Professional Monitor (LS27C902PAU)",
    slug: "samsung-viewfinity-s9-5k",
    summary: "5K smart creative display with anti-glare matte glass, detachable 4K SlimFit camera, and factory color calibration report.",
    description: "Designed for colourists, graphic designers, and enterprise developers. Anti-glare matte coating virtually eliminates ambient office reflections while Smart Calibration via smartphone delivers Delta E < 2 color accuracy.",
    sku: "P365-MON-S95K",
    price_minor: 94900, // £949.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "accessories",
    categories: { name: "Accessories" },
    imageUrl: "/images/analytics.jpg",
    badge: "Matte Anti-Glare 5K",
    brand: "Samsung",
    specs: {
      "Screen Size": "27-inch 5K (5120 x 2880) IPS",
      "Surface Finish": "Matte Display with UL-validated Glare Free certification",
      "Color Accuracy": "Factory calibrated 99% DCI-P3, Delta E < 2",
      "Included Webcam": "4K SlimFit magnetic detachable camera with Auto Framing",
      "Connectivity": "1x Thunderbolt 4 (90W PD), 3x USB-C, 1x Mini DisplayPort",
      "Smart OS": "Tizen OS with AirPlay, SmartThings, and remote desktop access",
      "Warranty": "3-Year Samsung Onsite Commercial Warranty",
    },
  },
  {
    id: "07d06c8f-69e2-120c-542d-9d7c02236a21",
    name: "CalDigit TS4 Thunderbolt 4 Enterprise Docking Station (18 Ports, 98W Charging)",
    slug: "caldigit-ts4-docking-station",
    summary: "The apex of desktop docking with 18 comprehensive ports, 2.5 Gigabit Ethernet, and 98W high-current laptop charging.",
    description: "Drive your entire workstation over a single certified Thunderbolt cable. Compatible with Thunderbolt 4, Thunderbolt 3, and USB4 laptops across macOS and Windows. Features front UHS-II SD/microSD slots and optical audio.",
    sku: "P365-DOCK-TS4",
    price_minor: 36900, // £369.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "accessories",
    categories: { name: "Accessories" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Ultimate 18-Port Dock",
    brand: "CalDigit",
    specs: {
      "Total I/O": "18 Connectivity Ports in heavy aluminum heatsink housing",
      "Thunderbolt Ports": "3x Thunderbolt 4 (40Gbps) with 98W host charging",
      "Networking": "1x 2.5 Gigabit RJ45 Ethernet port (2.5x faster than standard GbE)",
      "Video Output": "DisplayPort 1.4 (supports single 8K or dual 6K 60Hz displays)",
      "USB Ports": "5x USB-A 10Gbps, 3x USB-C (including 1x 20W front charging port)",
      "Audio": "Front 3.5mm combo, rear 3.5mm in/out, Digital Optical SPDIF",
      "Warranty": "2-Year CalDigit Manufacturer Warranty",
    },
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Logitech MX Master 3S Performance Wireless Mouse & Keys Combo",
    slug: "logitech-mx-master-3s-combo",
    summary: "Ergonomic quiet-click precision mouse with 8K DPI sensor paired with low-profile mechanical wireless keyboard.",
    description: "The gold standard for software developers, data scientists, and creative professionals. MagSpeed electromagnetic scrolling moves up to 1,000 lines per second with pixel-precise stop, dual Bluetooth and Logi Bolt connectivity.",
    sku: "P365-ACC-MXCOMBO",
    price_minor: 18900, // £189.00
    currency: "GBP",
    condition: "new",
    fulfilment_type: "owned_stock",
    category_id: "accessories",
    categories: { name: "Accessories" },
    imageUrl: "/images/laptop-pro.jpg",
    badge: "Ergonomic Pro",
    brand: "Logitech",
    specs: {
      "Sensor Technology": "Darkfield high precision (8000 DPI track-on-glass)",
      "Acoustics": "Quiet Clicks technology (90% less click noise)",
      "Scroll Wheel": "MagSpeed Electromagnetic scroll with SmartShift",
      "Keyboard Switches": "Tactile Quiet low-profile mechanical switches",
      "Connectivity": "Logi Bolt USB Receiver + Bluetooth Low Energy (up to 3 devices)",
      "Battery": "Rechargeable Li-Po; up to 70 days mouse / 15 days keyboard with backlighting",
      "Cross-Computer Control": "Logitech Flow seamless file & text copy between macOS and Windows",
      "Warranty": "2-Year Limited Hardware Warranty",
    },
  },
];

export async function getActiveProducts(): Promise<{
  products: CatalogueProduct[];
  configured: boolean;
  error: boolean;
}> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,summary,description,sku,price_minor,currency,condition,fulfilment_type,category_id,categories(name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return {
          products: data.map((p) => {
            const demoMatch = CURATED_DEMO_PRODUCTS.find((d) => d.slug === p.slug);
            return {
              ...(p as unknown as CatalogueProduct),
              imageUrl: demoMatch?.imageUrl ?? "/images/laptop-pro.jpg",
              badge: demoMatch?.badge,
              brand: demoMatch?.brand,
              specs: demoMatch?.specs,
            };
          }),
          configured: true,
          error: false,
        };
      }
    } catch (e) {
      console.warn("Supabase connection check fallback to curated catalogue:", e);
    }
  }

  // Graceful curated demo catalogue fallback with full 24 genuine UK products:
  return {
    products: CURATED_DEMO_PRODUCTS,
    configured: isSupabaseConfigured(),
    error: false,
  };
}

export async function getActiveProductBySlug(slug: string): Promise<{
  product: CatalogueProduct | null;
  configured: boolean;
  error?: boolean;
}> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,summary,description,sku,price_minor,currency,condition,fulfilment_type,category_id,categories(name)")
        .eq("status", "active")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        const demoMatch = CURATED_DEMO_PRODUCTS.find((d) => d.slug === slug);
        return {
          product: {
            ...(data as unknown as CatalogueProduct),
            imageUrl: demoMatch?.imageUrl ?? "/images/laptop-pro.jpg",
            badge: demoMatch?.badge,
            brand: demoMatch?.brand,
            specs: demoMatch?.specs,
          },
          configured: true,
        };
      }
    } catch (e) {
      console.warn("Supabase product lookup fallback:", e);
    }
  }

  // Check curated demo products:
  const demo = CURATED_DEMO_PRODUCTS.find((p) => p.slug === slug);
  if (demo) {
    return { product: demo, configured: isSupabaseConfigured() };
  }

  return { product: null, configured: isSupabaseConfigured() };
}
