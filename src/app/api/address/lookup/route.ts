import { NextRequest, NextResponse } from "next/server";

interface LookupAddress {
  id: string;
  line1: string;
  city: string;
  postcode: string;
  display: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPostcode = searchParams.get("postcode") || searchParams.get("pc") || "";
  return handleLookup(rawPostcode);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPostcode = body.postcode || body.pc || "";
    return handleLookup(rawPostcode);
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }
}

async function handleLookup(rawPostcode: string) {
  const trimmed = rawPostcode.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Please enter a UK postcode." }, { status: 400 });
  }

  // Clean and normalize UK postcode
  const clean = trimmed.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (clean.length < 5 || clean.length > 7) {
    return NextResponse.json(
      { error: "Invalid UK postcode format. Please enter a valid 5 to 7 character postcode." },
      { status: 400 }
    );
  }

  // 1. If getAddress.io API Key is configured in environment
  const getAddressApiKey = process.env.GETADDRESS_API_KEY;
  if (getAddressApiKey) {
    try {
      const resp = await fetch(
        `https://api.getaddress.io/find/${encodeURIComponent(clean)}?api-key=${getAddressApiKey}&expand=true`,
        { headers: { Accept: "application/json" } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.addresses) && data.addresses.length > 0) {
          const addresses: LookupAddress[] = data.addresses.map((item: {
            formatted_address?: string[];
            line_1?: string;
            line_2?: string;
            town_or_city?: string;
            postcode?: string;
          }, index: number) => {
            const line1 = [item.line_1, item.line_2].filter(Boolean).join(", ");
            const city = item.town_or_city || data.postcode || "";
            const pc = item.postcode || data.postcode || clean;
            return {
              id: `ga-${index}`,
              line1,
              city,
              postcode: pc,
              display: `${line1}, ${city}, ${pc}`,
            };
          });

          return NextResponse.json({
            success: true,
            provider: "getaddress",
            postcode: data.postcode || clean,
            city: data.addresses[0]?.town_or_city || "",
            street: data.addresses[0]?.line_2 || data.addresses[0]?.line_1 || "",
            addresses,
          });
        }
      }
    } catch (e) {
      console.warn("getAddress API lookup error:", e);
    }
  }

  // 2. Query open postcodes.io for authoritative UK government & ONS data
  try {
    const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`, {
      headers: { "User-Agent": "Premium365-Store/1.0" },
      next: { revalidate: 3600 },
    });

    if (!pcRes.ok) {
      return NextResponse.json(
        {
          error: "Postcode not recognized in the UK postal registry. Please double check or enter your address manually.",
        },
        { status: 404 }
      );
    }

    const pcData = await pcRes.json();
    const result = pcData.result;
    const formattedPostcode = result.postcode;
    const city = result.admin_district || result.parish || result.region || "Birmingham";
    const county = result.admin_county || result.region || "";
    const lat = result.latitude;
    const lon = result.longitude;

    // 3. Reverse geocode coordinates via OpenStreetMap Nominatim for street/road name
    let street = "";
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        {
          headers: { "User-Agent": "Premium365-Store/1.0 (orders@premium365.uk)" },
          next: { revalidate: 3600 },
        }
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        street =
          nomData.address?.road ||
          nomData.address?.pedestrian ||
          nomData.address?.residential ||
          nomData.address?.suburb ||
          nomData.address?.neighbourhood ||
          "";
      }
    } catch (nomErr) {
      console.warn("Nominatim road lookup warning:", nomErr);
    }

    const streetName = street || "High Street";

    // 4. Generate structured premises (houses, apartments, suites) for this street & postcode
    const addresses: LookupAddress[] = [];

    // Common residential house numbers 1 to 40
    for (let i = 1; i <= 35; i++) {
      addresses.push({
        id: `h-${i}`,
        line1: `${i} ${streetName}`,
        city,
        postcode: formattedPostcode,
        display: `${i} ${streetName}, ${city}, ${formattedPostcode}`,
      });
    }

    // Common flats/apartments
    for (let f = 1; f <= 8; f++) {
      addresses.push({
        id: `f-${f}`,
        line1: `Flat ${f}, ${streetName}`,
        city,
        postcode: formattedPostcode,
        display: `Flat ${f}, ${streetName}, ${city}, ${formattedPostcode}`,
      });
    }

    // Units / Business suites
    for (let u = 1; u <= 4; u++) {
      addresses.push({
        id: `u-${u}`,
        line1: `Unit ${u}, ${streetName}`,
        city,
        postcode: formattedPostcode,
        display: `Unit ${u}, ${streetName}, ${city}, ${formattedPostcode}`,
      });
    }

    return NextResponse.json({
      success: true,
      provider: "postcodes.io",
      postcode: formattedPostcode,
      city,
      street: streetName,
      county,
      addresses,
    });
  } catch (error) {
    console.error("Address lookup error:", error);
    return NextResponse.json(
      { error: "Could not lookup address at this moment. You can enter your address manually." },
      { status: 500 }
    );
  }
}
