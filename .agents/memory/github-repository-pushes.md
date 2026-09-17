---
name: GitHub repository pushes
description: Reliable repository publishing when Replit GitHub connections expose different authentication paths.
---

When a GitHub App connection is healthy but the workspace Git credential helper returns an invalid-token error, use the standard GitHub connector and authenticated Git data API instead of asking for a personal access token.

**Why:** The GitHub App connection can be attached successfully while its Git CLI token endpoint is unavailable or times out; the standard GitHub connector provides the REST proxy needed to create blobs, a tree, a commit, and the target branch without exposing credentials.

**How to apply:** Prefer the standard GitHub connector for repository-content writes. For an empty repository, initialize one file through the Contents API first, then create the complete tree and commit through the Git data API.