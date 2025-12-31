// scripts/generate-contracts.mjs
// Gemini-based contract generator (Node.js + Express)
// - Scans routes/*.js for router.get/post/put/delete/patch
// - (Optional) tries to include a controller file if you pass CONTROLLERS_DIR
// - Calls Gemini (gemini-2.5-flash) with STRUCTURED JSON output
// - Writes one contract per endpoint into /contracts

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { GoogleGenAI } from "@google/genai";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { geminiApiKey } = require("../config/env.js");
const GEMINI_API_KEY = geminiApiKey;

console.log("GEMINI-based Contract Generator", GEMINI_API_KEY);

console.log("Using GEMINI_API_KEY:", GEMINI_API_KEY ? "✅ found" : "❌ missing");
if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY. Set it in your environment variables.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ---- CONFIG: update these to match your project layout ----
const ROUTES_DIR = path.join(process.cwd(), "routes"); // change if needed
const CONTROLLERS_DIR = path.join(process.cwd(), "controllers"); // change if needed
const CONTRACTS_DIR = path.join(process.cwd(), "contracts");
const SERVER_FILE = path.join(process.cwd(), "index.js"); // main server file

fs.mkdirSync(CONTRACTS_DIR, { recursive: true });

// ---- Extract route prefixes from index.js ----
function extractRoutePrefixes() {
    if (!fs.existsSync(SERVER_FILE)) {
        console.warn(`⚠️  ${SERVER_FILE} not found. Using no prefix.`);
        return {};
    }
    
    const serverCode = fs.readFileSync(SERVER_FILE, "utf8");
    const prefixes = {};
    
    // Match: app.use('/prefix', routeName);
    const re = /app\.use\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\w+)\s*\)/g;
    let m;
    
    while ((m = re.exec(serverCode))) {
        const prefix = m[1];
        const routeVarName = m[2]; // e.g., "authRoutes"
        
        // Try to match: const authRoutes = require('./routes/authRoutes');
        const requireRe = new RegExp(`const\\s+${routeVarName}\\s*=\\s*require\\s*\\(\\s*['"\`]\\.\\/routes\\/([^'"\`]+)['"\`]\\s*\\)`, 'g');
        const reqMatch = requireRe.exec(serverCode);
        
        if (reqMatch) {
            const routeFileName = reqMatch[1]; // e.g., "authRoutes"
            prefixes[routeFileName] = prefix;
        }
    }
    
    return prefixes;
}

// ---- helpers ----
function listJsFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...listJsFiles(full));
        else if (ent.isFile() && full.endsWith(".js")) out.push(full);
    }
    return out;
}

function extractRouterCalls(routeCode) {
    // Basic pattern: router.post('/path', ...middlewares, handler)
    // Captures method, path, and the trailing handler identifier if simple.
    const results = [];
    const re = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]\s*,([\s\S]*?)\)\s*;/g;

    let m;
    while ((m = re.exec(routeCode))) {
        const method = m[1].toLowerCase();
        const routePath = m[2];
        const args = m[3];

        // naive handler extraction: last token before closing )
        // example: authToken, restrictTo('Admin'), rejectCancelOrder
        const handlerMatch = args.match(/([A-Za-z_$][A-Za-z0-9_$]*)\s*$/);
        const handlerName = handlerMatch ? handlerMatch[1] : null;

        // middleware name hints
        const usesAuthToken = /\bauthToken\b/.test(args);
        const usesRestrictTo = /\brestrictTo\s*\(/.test(args);

        results.push({
            method,
            routePath,
            handlerName,
            middlewareHints: { usesAuthToken, usesRestrictTo },
        });
    }

    // fallback simple extraction if no semicolons
    if (results.length === 0) {
        const re2 = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
        let m2;
        while ((m2 = re2.exec(routeCode))) {
            results.push({
                method: m2[1].toLowerCase(),
                routePath: m2[2],
                handlerName: null,
                middlewareHints: { usesAuthToken: false, usesRestrictTo: false },
            });
        }
    }
    return results;
}

function normalizeOpenApiPath(p) {
    // Express style :id -> OpenAPI {id}
    return p.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

function contractFilename(method, openapiPath) {
    // post__/reject-cancel -> post__reject-cancel.contract.json
    return (
        `${method}__${openapiPath}`
            .replace(/[\/{}]/g, "_")
            .replace(/__+/g, "_")
            .toLowerCase() + ".contract.json"
    );
}

function findControllerFileByHandler(handlerName) {
    // Very simple heuristic: search controllers folder for text "exports.<handlerName>"
    // If your project uses module.exports = { handler } or different style, adjust here.
    if (!handlerName) return null;
    if (!fs.existsSync(CONTROLLERS_DIR)) return null;

    const controllerFiles = listJsFiles(CONTROLLERS_DIR);
    for (const f of controllerFiles) {
        const code = fs.readFileSync(f, "utf8");
        if (new RegExp(`exports\\.${handlerName}\\b`).test(code)) return f;
        if (new RegExp(`\\b${handlerName}\\b\\s*=\\s*catchAsync`).test(code)) return f;
    }
    return null;
}

function safeRead(filePath) {
    if (!filePath) return "";
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch {
        return "";
    }
}

// ---- Contract JSON schema (Structured Output) ----
// Keep this schema stable for predictable output.
const contractSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        method: { type: "string" },
        path: { type: "string" },
        summary: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        security: { type: "array", items: { type: "string" } },

        // Simplified OpenAPI schema fragments (we keep them JSON schema-like)
        params: {
            type: "object",
            properties: {
                type: { type: "string" },
                properties: { type: "object" },
                required: { type: "array", items: { type: "string" } },
            },
        },

        requestBody: {
            anyOf: [{ type: "object" }, { type: "null" }],
        },

        responses: { type: "object" },
    },
    required: ["id", "method", "path", "responses"],
};

async function generateContractWithGemini({
    method,
    openapiPath,
    routeCode,
    controllerCode,
    middlewareHints,
    handlerName,
}) {
    const prompt = `
You are an API documentation generator.

Goal: Create ONE endpoint contract JSON.

CRITICAL - Contract Structure:
The JSON must have these fields at the ROOT level:
- "id": string (operation id)
- "method": "${method}"
- "path": "${openapiPath}"
- "summary": string (brief description)
- "tags": array of strings
- "security": array of strings (["bearerAuth"] if auth required, [] if not)
- "requestBody": object with OpenAPI requestBody structure (with "required", "content", "application/json", "schema") OR null if no body
- "responses": object with status codes as keys, each response should have "description" and "content" with proper schema

DO NOT wrap the contract in a method key like "post": {...}. All fields should be at the root level.

RequestBody format (if needed):
{
  "required": true,
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "required": ["field1", "field2"],
        "properties": {
          "field1": { "type": "string", "description": "..." }
        }
      }
    }
  }
}

Response format:
{
  "200": {
    "description": "Success message",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": { ... }
        }
      }
    }
  }
}

Output rules:
- If route uses auth middleware, set security to ["bearerAuth"]. Otherwise, set to [].
- IMPORTANT: Infer requestBody fields from controller code by finding ALL fields destructured from req.body (e.g., const { field1, field2, field3 } = req.body).
- Include ALL destructured fields in the requestBody schema properties.
- Mark fields as required if they are validated with if (!field) checks in the controller.
- Infer response schema from controller res.json() calls.
- Common status codes: 200/201 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found).

Project hints:
- handlerName: ${handlerName || "unknown"}
- middleware: authToken=${middlewareHints.usesAuthToken}, restrictTo=${middlewareHints.usesRestrictTo}

Route code:
${routeCode}

Controller code:
${controllerCode || "(not found)"}
`;

    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        responseMimeType: "application/json",
        responseSchema: contractSchema,
    });

    // Depending on SDK version, this can be res.text or res.response?.text()
    let txt = res.text ?? res.response?.text ?? "";
    
    // Strip markdown code fences if present (e.g., ```json ... ```)
    txt = txt.replace(/^```json\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    
    return JSON.parse(txt);
}

// Helper to delay execution (for rate limiting)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const routeFiles = listJsFiles(ROUTES_DIR);
    if (routeFiles.length === 0) {
        console.error(`❌ No route files found in: ${ROUTES_DIR}`);
        process.exit(1);
    }

    // Extract route prefixes from index.js
    const routePrefixes = extractRoutePrefixes();
    console.log("📍 Detected route prefixes:", routePrefixes);

    const allContracts = [];
    let requestCount = 0;

    for (const rf of routeFiles) {
        const routeCode = safeRead(rf);
        const endpoints = extractRouterCalls(routeCode);
        
        // Determine route prefix from filename
        const routeFileName = path.basename(rf, '.js'); // e.g., "authRoutes"
        const routePrefix = routePrefixes[routeFileName] || "";
        
        console.log(`\n📁 Processing ${routeFileName} (prefix: ${routePrefix || '(none)'})`);

        for (const ep of endpoints) {
            let openapiPath = normalizeOpenApiPath(ep.routePath);
            
            // Add route prefix if exists
            if (routePrefix) {
                openapiPath = routePrefix + openapiPath;
            }
            
            console.log(`  → ${ep.method.toUpperCase()} ${openapiPath}`);

            const controllerFile = findControllerFileByHandler(ep.handlerName);
            const controllerCode = safeRead(controllerFile);

            // Rate limiting: wait 13 seconds between requests (4.6 requests/min = under 5/min limit)
            if (requestCount > 0) {
                console.log(`⏳ Waiting 13s to respect rate limits...`);
                await delay(13000);
            }

            const contract = await generateContractWithGemini({
                method: ep.method,
                openapiPath,
                routeCode,
                controllerCode,
                middlewareHints: ep.middlewareHints,
                handlerName: ep.handlerName,
            });

            requestCount++;

            // Ensure required fields are consistent
            contract.method = ep.method;
            contract.path = openapiPath;
            contract.security = contract.security || [];
            contract.tags = contract.tags || [];
            contract.summary = contract.summary || `${ep.method.toUpperCase()} ${openapiPath}`;
            contract.id =
                contract.id ||
                (ep.handlerName ? ep.handlerName : `${ep.method}_${openapiPath}`.replace(/[\/{}]/g, "_"));

            const outFile = path.join(CONTRACTS_DIR, contractFilename(ep.method, openapiPath));
            fs.writeFileSync(outFile, JSON.stringify(contract, null, 2), "utf8");
            console.log("✅ Wrote contract:", path.relative(process.cwd(), outFile));

            allContracts.push(outFile);
        }
    }

    console.log(`\n✅ Done. Generated ${allContracts.length} contract file(s).`);
    console.log("Next: run `npm run docs:swagger` to generate docs/swagger.json");
}

main().catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
});
