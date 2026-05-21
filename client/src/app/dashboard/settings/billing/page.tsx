// Redirect old settings/billing route → /dashboard/subscription
import { redirect } from "next/navigation";
export default function OldBillingPage() {
    redirect("/dashboard/subscription");
}
