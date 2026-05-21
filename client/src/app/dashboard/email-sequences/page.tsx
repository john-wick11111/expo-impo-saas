// Redirect old /email-sequences route → /email-campaigns (Automated Sequences tab)
import { redirect } from "next/navigation";
export default function OldEmailSequencesPage() {
    redirect("/dashboard/email-campaigns");
}
