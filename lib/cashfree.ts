import { Cashfree } from "cashfree-pg";

if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error("Cashfree keys are missing in environment variables");
}

// Correct instantiation using the Enum value directly implies we can pass "SANDBOX" ONLY IF the types allow it.
// The lint error said: Argument of type '"SANDBOX"' is not assignable to parameter of type 'CFEnvironment'.
// CFEnvironment is an enum: SANDBOX = 1.
// So we should pass CFEnvironment.SANDBOX.
// Verify if CFEnvironment is exported from "cashfree-pg". index.d.ts says export * from "./configuration".
// So we can import it.

import { CFEnvironment } from "cashfree-pg";

export const cashfree = new Cashfree(
    CFEnvironment.SANDBOX, 
    process.env.CASHFREE_APP_ID, 
    process.env.CASHFREE_SECRET_KEY
);
