import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Registration from "@/models/Registration";

function getBranchPrefix(branch: string): string {
  const b = branch.toUpperCase().trim();
  if (b === "CE" || b.startsWith("CE")) return "CE";
  if (b === "CSE" || b.includes("COMPUTER SCIENCE")) return "CS";
  if (b === "EXTC" || b.includes("ELECTRONICS")) return "EE";
  return "CS";
}

// Google Sheets Webhook URL (from Google Apps Script deployment)
// Paste your Web App URL below or set it as GOOGLE_SHEET_WEBHOOK_URL environment variable:
const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxj0XBw_mgDu6e4f9S92H7LQfWNKMMGCkns87Sx6ptIYRjEKiTrAG9k_osHWxMu8dls/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, uid, branch, division, phone, email } = body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedUid = typeof uid === "string" ? uid.trim() : "";
    const trimmedBranch = typeof branch === "string" ? branch.trim() : "";
    const trimmedDivision = typeof division === "string" ? division.trim() : "";
    const trimmedPhone = typeof phone === "string" ? phone.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedName || !trimmedUid || !trimmedBranch || !trimmedDivision || !trimmedPhone || !trimmedEmail) {
      return NextResponse.json(
        { error: "Please fill in all fields (Name, UID, Branch, Division, Phone, Email)." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(trimmedUid)) {
      return NextResponse.json(
        { error: "College UID must be exactly 10 digits." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if student with UID or Email already registered
    const existing = await Registration.findOne({
      $or: [{ uid: trimmedUid }, { email: trimmedEmail }],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          alreadyRegistered: true,
          message: "You are already registered! Here is your entry pass.",
          data: {
            name: existing.name,
            uid: existing.uid,
            branch: existing.branch,
            division: existing.division,
            phone: existing.phone,
            email: existing.email,
            ticketId: existing.ticketId,
          },
        },
        { status: 200 }
      );
    }

    const registration = await Registration.create({
      name: trimmedName,
      uid: trimmedUid,
      branch: trimmedBranch,
      division: trimmedDivision,
      phone: trimmedPhone,
      email: trimmedEmail,
      ticketId: `${getBranchPrefix(trimmedBranch)}-${trimmedUid}`,
    });

    // Real-time sync to Google Sheets (awaited so Vercel serverless does not freeze before completion)
    if (GOOGLE_SHEET_WEBHOOK_URL && !GOOGLE_SHEET_WEBHOOK_URL.includes("PASTE_YOUR_")) {
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketId: registration.ticketId,
            name: registration.name,
            uid: registration.uid,
            branch: registration.branch,
            division: registration.division,
            phone: registration.phone,
            email: registration.email,
          }),
        });
      } catch (err) {
        console.error("Google Sheets webhook error:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: {
          name: registration.name,
          uid: registration.uid,
          branch: registration.branch,
          division: registration.division,
          phone: registration.phone,
          email: registration.email,
          ticketId: registration.ticketId,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /api/register error:", error);

    // Catch duplicate key collision (MongoDB error 11000)
    const err = error as { code?: number; message?: string };
    if (err && err.code === 11000) {
      return NextResponse.json(
        { error: "A registration with this College UID or Email already exists." },
        { status: 409 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to process registration.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
