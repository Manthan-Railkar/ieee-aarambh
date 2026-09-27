import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Registration from "@/models/Registration";

const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxj0XBw_mgDu6e4f9S92H7LQfWNKMMGCkns87Sx6ptIYRjEKiTrAG9k_osHWxMu8dls/exec";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all registrations sorted chronologically
    const registrations = await Registration.find({}).sort({ createdAt: 1 });

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No registrations found in database to sync.",
        count: 0,
      });
    }

    let syncedCount = 0;
    const errors: string[] = [];

    // Push each document to Google Sheets Webhook
    for (const doc of registrations) {
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketId: doc.ticketId || `PASS-${doc.uid}`,
            name: doc.name || "",
            uid: doc.uid || "",
            branch: doc.branch || "",
            division: doc.division || "",
            phone: doc.phone || "",
            email: doc.email || "",
          }),
        });
        syncedCount++;
        // Small delay to ensure sequential row append in Google Sheet
        await new Promise((r) => setTimeout(r, 200));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Sync error";
        errors.push(`Failed for ${doc.uid}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} of ${registrations.length} registrations to Google Sheets!`,
      totalInDatabase: registrations.length,
      syncedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    console.error("Sync API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to sync entries.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
