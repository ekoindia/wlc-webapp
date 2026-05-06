import os, json, urllib.request, urllib.parse, urllib.error

SENTRY_TOKEN = os.environ["SENTRY_AUTH_TOKEN"]
GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
SENTRY_ORG   = os.environ.get("SENTRY_ORG", "eko-sp")
GITHUB_REPO  = os.environ.get("GITHUB_REPO", "ekoindia/wlc-webapp")
PROJECTS     = os.environ.get("SENTRY_PROJECTS", "javascript-react,javascript").split(",")

def sentry_get(path):
    req = urllib.request.Request(
        "https://sentry.io/api/0" + path,
        headers={"Authorization": "Bearer " + SENTRY_TOKEN}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def github_get(path):
    req = urllib.request.Request(
        "https://api.github.com" + path,
        headers={
            "Authorization": "Bearer " + GITHUB_TOKEN,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def github_post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        "https://api.github.com" + path,
        data=body, method="POST",
        headers={
            "Authorization": "Bearer " + GITHUB_TOKEN,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def issue_exists(sentry_id):
    q = urllib.parse.quote("repo:" + GITHUB_REPO + " is:issue sentry-id:" + sentry_id + " in:body")
    result = github_get("/search/issues?q=" + q + "&per_page=1")
    return result["total_count"] > 0

def ensure_label():
    try:
        github_get("/repos/" + GITHUB_REPO + "/labels/sentry")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            github_post("/repos/" + GITHUB_REPO + "/labels", {
                "name": "sentry",
                "color": "e74c3c",
                "description": "Issues imported from Sentry error tracking"
            })

def build_body(issue, project):
    sentry_id = issue["id"]
    lines = [
        "## Sentry Error Report",
        "",
        "<!-- sentry-id:" + sentry_id + " -->",
        "",
        "| Field | Value |",
        "|---|---|",
        "| **Sentry ID** | [" + sentry_id + "](" + issue["permalink"] + ") |",
        "| **Project** | " + project + " |",
        "| **Level** | " + issue["level"].upper() + " |",
        "| **Occurrences** | " + str(issue["count"]) + " |",
        "| **Users affected** | " + str(issue["userCount"]) + " |",
        "| **First seen** | " + issue["firstSeen"][:10] + " |",
        "| **Last seen** | " + issue["lastSeen"][:10] + " |",
        "| **Culprit** | `" + issue.get("culprit", "N/A") + "` |",
        "",
        "---",
        "",
        "### Error",
        "",
        "```",
        issue["title"],
        "```",
        "",
        "---",
        "",
        "> View full details on [Sentry](" + issue["permalink"] + ")"
    ]
    return "\n".join(lines)

ensure_label()
created = skipped = 0

for project in PROJECTS:
    print("\n[" + project + "] Fetching unresolved issues...")
    issues = sentry_get("/projects/" + SENTRY_ORG + "/" + project + "/issues/?query=is:unresolved&limit=50")
    for issue in issues:
        sentry_id = issue["id"]
        if issue_exists(sentry_id):
            print("  SKIP  #" + sentry_id + " — already exists")
            skipped += 1
        else:
            result = github_post("/repos/" + GITHUB_REPO + "/issues", {
                "title": "[Sentry] " + issue["title"] + " (" + project + ")",
                "body": build_body(issue, project),
                "labels": ["sentry", "bug"]
            })
            print("  CREATE #" + sentry_id + " -> " + result["html_url"])
            created += 1

print("\nDone. Created:: " + str(created) + " | Skipped: " + str(skipped))
