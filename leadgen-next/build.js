// This file is no longer needed with standalone output mode
console.log(
  "Skipping routes-manifest creation - using Next.js built-in process"
);

const fs = require("fs");
const path = require("path");

// Create a routes-manifest.json file for Vercel
const routesManifest = {
  version: 3,
  basePath: "",
  headers: [],
  redirects: [],
  rewrites: [],
  staticRoutes: [
    {
      page: "/",
      regex: "^/(?:/)?$",
      routeKeys: {},
      namedRegex: "^/(?:/)?$",
    },
    {
      page: "/api/salespeople",
      regex: "^/api/salespeople(?:/)?$",
      routeKeys: {},
      namedRegex: "^/api/salespeople(?:/)?$",
    },
    {
      page: "/api/send-lead",
      regex: "^/api/send-lead(?:/)?$",
      routeKeys: {},
      namedRegex: "^/api/send-lead(?:/)?$",
    },
    {
      page: "/api/track-lead",
      regex: "^/api/track-lead(?:/)?$",
      routeKeys: {},
      namedRegex: "^/api/track-lead(?:/)?$",
    },
  ],
};

// Create the routes-manifest.json file in the out directory
const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, "routes-manifest.json"),
  JSON.stringify(routesManifest, null, 2)
);

console.log("Routes manifest created for Vercel deployment");
