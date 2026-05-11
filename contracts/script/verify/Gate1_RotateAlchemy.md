# Gate 1 — Rotate Alchemy API Key

**Purpose:** Verify that the RPC key rotation procedure works end-to-end without a
downtime window. Run this after every new deployment or credential rotation.

## Pre-conditions

- New Alchemy API key provisioned at dashboard.alchemy.com
- `contracts/.env` and `frontend/.env` are both writable

## Steps

1. **Generate a new key** in the Alchemy dashboard for the Polygon Amoy app.

2. **Update both env files** with the new key:
   ```bash
   # contracts/.env
   AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<NEW_KEY>

   # frontend/.env  (or .env.local — not committed)
   VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<NEW_KEY>
   ```

3. **Smoke-test the new key** with a lightweight RPC call:
   ```bash
   curl -s -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     "$AMOY_RPC_URL" | jq .result
   ```
   Expected: a hex block number string, e.g. `"0x1a2b3c"`.

4. **Confirm cast connectivity**:
   ```bash
   cast block-number --rpc-url "$AMOY_RPC_URL"
   ```
   Expected: a non-zero integer.

5. **Revoke the old key** in the Alchemy dashboard.

6. **Re-run steps 3–4** with the old key to confirm it now returns a 401/403.

## Pass Criteria

- Step 3 returns a valid hex block number with the new key.
- Step 6 returns an error (HTTP 4xx or JSON error) for the revoked key.
- No contracts need redeployment — RPC key rotation is config-only.

## Notes

- `VITE_RPC_URL` is a client-side env var. In production, proxy RPC calls through a
  server-side endpoint to avoid exposing the key in the browser bundle.
- The `POLYGONSCAN_API_KEY` (used for verification) is separate; rotate it independently.
