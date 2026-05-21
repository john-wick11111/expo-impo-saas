// Redirect old /email route → /email-campaigns
import { redirect } from "next/navigation";
export default function OldEmailPage() {
    redirect("/dashboard/email-campaigns");
}
