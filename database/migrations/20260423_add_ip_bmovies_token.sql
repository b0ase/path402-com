-- B.MOVIES IP licence token (path402.com/market)
-- Run via: ssh hetzner "docker exec supabase-db psql -U postgres -d postgres" < database/migrations/20260423_add_ip_bmovies_token.sql

INSERT INTO tokens (address, name, description, content_type, issuer_handle, pricing_model, base_price_sats, max_supply, issuer_share_bps, facilitator_share_bps, is_active)
VALUES
  ('ip_bmovies', '$BMOVIES', 'B.MOVIES IP licence — create derivative works and distributed streaming experiences', 'ip_licence', 'b0ase', 'alice_bond', 1000000000, 1000000000, 9000, 1000, true)
ON CONFLICT (address) DO NOTHING;
