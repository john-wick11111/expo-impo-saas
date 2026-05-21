// Redirect /pricing → /subscription
import { redirect } from "next/navigation";
export default function OldPricingPage() {
    redirect("/dashboard/subscription");
}
