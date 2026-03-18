/**
 * Simple unit tests for toPascalCase — no test framework needed.
 * Run with:  node src/test-naming.js
 */

// Inline the function so the file is self-contained
function toPascalCase(filenameBase) {
  return filenameBase
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const cases = [
  // kebab-case
  ["hello-world", "HelloWorld"],
  ["my-http-service", "MyHttpService"],
  ["user-profile-dto", "UserProfileDto"],
  // snake_case
  ["hello_world", "HelloWorld"],
  ["user_profile_dto", "UserProfileDto"],
  ["my_http_service", "MyHttpService"],
  // mixed
  ["hello-world_service", "HelloWorldService"],
  ["some_kebab-mixed", "SomeKebabMixed"],
  // single word
  ["user", "User"],
  ["repository", "Repository"],
  // already-capitalised first letter
  ["MyService", "MyService"],
  // dots (e.g. index.service)
  ["index.service", "IndexService"],
];

let passed = 0;
let failed = 0;

for (const [input, expected] of cases) {
  const result = toPascalCase(input);
  const ok = result === expected;
  if (ok) {
    console.log(`  Passed:  "${input}" → "${result}"`);
    passed++;
  } else {
    console.error(
      `  Error:  "${input}" → "${result}"  (expected: "${expected}")`,
    );
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
