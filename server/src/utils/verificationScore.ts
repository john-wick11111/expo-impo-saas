export function calculateVerificationScore(buyer: {
    email?: string | null;
    emailVerified?: boolean | null;
    website?: string | null;
    websiteActive?: boolean | null;
    linkedin?: string | null;
}): number {
    let score = 0;

    if (buyer.email) score += 3;
    if (buyer.emailVerified) score += 3;
    if (buyer.website) score += 2;
    if (buyer.websiteActive) score += 1;
    if (buyer.linkedin) score += 1;

    return Math.min(score, 10); // Ensure score does not exceed 10
}
