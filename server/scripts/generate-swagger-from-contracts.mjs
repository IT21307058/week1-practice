// scripts/generate-swagger-from-contracts.mjs
// Converts /contracts/*.contract.json -> docs/swagger.json (OpenAPI 3.0)

import fs from "node:fs";
import path from "node:path";

const CONTRACTS_DIR = path.join(process.cwd(), "contracts");
const BASE_PATH = path.join(process.cwd(), "docs", "openapi.base.json");
const OUT_PATH = path.join(process.cwd(), "docs", "swagger.json");

function main() {
    if (!fs.existsSync(BASE_PATH)) {
        console.error("❌ Missing docs/openapi.base.json");
        process.exit(1);
    }

    const base = JSON.parse(fs.readFileSync(BASE_PATH, "utf8"));
    base.paths = base.paths || {};
    base.components = base.components || {};
    base.components.schemas = base.components.schemas || {};

    const files = fs.existsSync(CONTRACTS_DIR) ? fs.readdirSync(CONTRACTS_DIR) : [];
    for (const f of files) {
        if (!f.endsWith(".contract.json")) continue;

        const c = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, f), "utf8"));

        base.paths[c.path] = base.paths[c.path] || {};
        base.paths[c.path][c.method] = {
            summary: c.summary || "",
            tags: c.tags || [],
            security: (c.security || []).length ? c.security.map((s) => ({ [s]: [] })) : undefined,
            parameters: c.params ? Object.entries(c.params.properties || {}).map(([name, schema]) => ({
                name,
                in: "path",
                required: (c.params.required || []).includes(name),
                schema
            })) : [],

            // Use requestBody directly if it already has 'content', otherwise wrap it
            requestBody: c.requestBody
                ? (c.requestBody.content ? c.requestBody : {
                    required: true,
                    content: { "application/json": { schema: c.requestBody } },
                })
                : undefined,

            // Use responses directly if they already have 'description' and 'content', otherwise wrap them
            responses: Object.fromEntries(
                Object.entries(c.responses || {}).map(([code, r]) => {
                    // If response already has 'content', use it as-is
                    if (r.content) {
                        return [code, r];
                    }
                    // Otherwise wrap the schema
                    return [
                        code,
                        {
                            description: r.description || "Response",
                            content: { "application/json": { schema: r.schema || { type: "object" } } },
                        },
                    ];
                })
            ),
        };
    }

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(base, null, 2), "utf8");
    console.log("✅ Generated:", path.relative(process.cwd(), OUT_PATH));
}

main();
