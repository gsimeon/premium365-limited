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
    badge: "Flagship Choice",
    specs: {
      "Processor": "13th Gen Intel Core i7-1365U (10 Cores, up to 5.2GHz)",
      "Memory": "32GB LPDDR5-6400MHz Soldered",
      "Storage": "1TB PCIe NVMe Gen 4 Performance SSD",
      "Display": "14.0\" 2.8K (2880 x 1800) OLED, Anti-Reflective, 400 nits, 100% DCI-P3",
      "Graphics": "Integrated Intel Iris Xe Graphics",
      "Connectivity": "Wi-Fi 6E (802.11ax), Bluetooth 5.1, 2x Thunderbolt 4",
      "Operating System": "Windows 11 Pro 64-bit",
      "Warranty": "3-Year Premier On-Site Support Included",
    },
  },
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    name: "Apple MacBook Pro 14 (Apple M3 Pro, 18GB Unified Memory, 512GB SSD)",
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
    specs: {
      "Processor": "Apple M3 Pro (11-core CPU, 14-core GPU, 16-core Neural Engine)",
      "Memory": "18GB Unified Memory",
      "Storage": "512GB High-Speed SSD",
      "Display": "14.2-inch Liquid Retina XDR (3024 x 1964), 1,000,000:1 contrast, 120Hz ProMotion",
      "Ports": "3x Thunderbolt 4, HDMI port, SDXC card slot, MagSafe 3",
      "Battery Life": "Up to 18 hours Apple TV app movie playback",
      "Condition Rating": "Grade A Pristine (Zero screen blemishes, flawless keyboard)",
      "Warranty": "12-Month Premium 365 Return to Base Hardware Warranty",
    },
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Dell UltraSharp 32 4K USB-C Hub Monitor (U3223QE)",
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
    specs: {
      "Screen Size": "31.5 Inch 16:9 Aspect Ratio",
      "Resolution": "4K UHD (3840 x 2160) at 60 Hz",
      "Panel Technology": "IPS Black with 2000:1 Contrast Ratio",
      "Color Support": "1.07 Billion colors, 100% sRGB, 98% DCI-P3, HDR 400",
      "Power Delivery": "Up to 90W charging to connected laptops",
      "Hub Ports": "1x USB-C with DP 1.4, 1x RJ45 Ethernet, 4x SuperSpeed USB-A 10Gbps, 1x DP Out (Daisy chain)",
      "Ergonomics": "Height adjustable (150 mm), Tilt, Swivel, Pivot 90°",
      "Warranty": "3-Year Dell Advanced Exchange Service",
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
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Synology DiskStation DS923+ 4-Bay NAS Solution (16TB RAID Array)",
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
    badge: "Business Backup",
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

  // Graceful curated demo catalogue fallback:
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
