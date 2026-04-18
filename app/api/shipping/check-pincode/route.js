import { NextResponse } from "next/server";

const DELHIVERY_BASE = "https://track.delhivery.com";

// Delhivery returns abbreviated state codes — map them to full names
const STATE_CODE_MAP = {
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  DL: "Delhi",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JH: "Jharkhand",
  KA: "Karnataka",
  KL: "Kerala",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  OR: "Odisha",
  PB: "Punjab",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TS: "Telangana",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UK: "Uttarakhand",
  UT: "Uttarakhand",
  WB: "West Bengal",
  PY: "Puducherry",
  CH: "Chandigarh",
  JK: "Jammu & Kashmir",
  LA: "Ladakh",
  AN: "Andaman & Nicobar Islands",
  DN: "Dadra & Nagar Haveli",
  DD: "Daman & Diu",
  LD: "Lakshadweep",
};

function resolveState(code) {
  if (!code) return "";
  // If it's already a full name (some API versions return this)
  if (code.length > 3) return code;
  return STATE_CODE_MAP[code.toUpperCase()] || code;
}

export async function GET(request) {
  let pincode = "";
  try {
    const { searchParams } = new URL(request.url);
    pincode = searchParams.get("pincode") || "";

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode — must be 6 digits" },
        { status: 400 },
      );
    }

    const token = process.env.DELHIVERY_API_TOKEN;

    // ── Dev / no-token fallback ──────────────────────────────────────────────
    if (!token) {
      console.warn(
        "DELHIVERY_API_TOKEN not set — returning mock serviceable response",
      );
      return NextResponse.json({
        success: true,
        serviceable: true,
        prepaidAvailable: true,
        codAvailable: false,
        pincode,
        city: "New Delhi",
        state: "Delhi",
        mock: true,
      });
    }

    // ── Real Delhivery API call ──────────────────────────────────────────────
    const res = await fetch(
      `${DELHIVERY_BASE}/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) {
      // Non-2xx from Delhivery — fail open so checkout still works
      console.error(`Delhivery PIN API responded ${res.status}`);
      return NextResponse.json({
        success: true,
        serviceable: true,
        pincode,
        city: "",
        state: "",
        timedOut: true, // signals UI to show "could not verify" instead of blocking
      });
    }

    const data = await res.json();
    const codes = data?.delivery_codes ?? [];

    if (codes.length === 0) {
      return NextResponse.json({
        success: true,
        serviceable: false,
        pincode,
        city: "",
        state: "",
        message: "Delivery not available for this pincode",
      });
    }

    const pin = codes[0]?.postal_code ?? {};

    const prepaid = pin?.pre_paid === "Y";
    const cod = pin?.cod === "Y";
    const serviceable = prepaid || cod;

    // Delhivery may return state as code ("MH") or full name ("Maharashtra")
    const rawState = pin?.state_code || pin?.state || "";
    const fullState = resolveState(rawState);

    // District is the closest to city; fall back to city field
    const city = pin?.district || pin?.city || "";

    return NextResponse.json({
      success: true,
      serviceable,
      prepaidAvailable: prepaid,
      codAvailable: cod,
      pincode,
      city,
      state: fullState,
    });
  } catch (error) {
    console.error("check-pincode error:", error.name, error.message);

    // Timeout or network error — fail open
    if (
      error.name === "TimeoutError" ||
      error.name === "AbortError" ||
      error.code === "UND_ERR_CONNECT_TIMEOUT"
    ) {
      return NextResponse.json({
        success: true,
        serviceable: true,
        pincode,
        city: "",
        state: "",
        timedOut: true,
      });
    }

    // Any other error — fail open so checkout is never blocked by infra issues
    return NextResponse.json({
      success: true,
      serviceable: true,
      pincode,
      city: "",
      state: "",
      timedOut: true,
    });
  }
}
