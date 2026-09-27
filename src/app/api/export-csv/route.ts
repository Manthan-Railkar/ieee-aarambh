import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function GET() {
  try {
    await connectToDatabase();
    const registrations = await Registration.find({}).sort({ createdAt: 1 });

    const headers = [
      "Timestamp (IST)",
      "Ticket ID",
      "Full Name",
      "College UID",
      "Branch",
      "Division",
      "Phone Number",
      "Email ID",
    ];

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = registrations.map((r) => [
      escapeCsv(
        r.createdAt
          ? new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : ""
      ),
      escapeCsv(r.ticketId),
      escapeCsv(r.name),
      escapeCsv(r.uid),
      escapeCsv(r.branch),
      escapeCsv(r.division),
      escapeCsv(r.phone),
      escapeCsv(r.email),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="aarambh_registrations.csv"',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to export registrations";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
