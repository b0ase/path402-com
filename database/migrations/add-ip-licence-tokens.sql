-- IP Licence Tokens
-- Vending machine for IP content creation rights
-- 4 tokens: $FNEWS, $NPGX, $CHERRYX, $ZERODICE
-- Run via: ssh hetzner "docker exec supabase-db psql -U postgres -d postgres" < database/migrations/add-ip-licence-tokens.sql

INSERT INTO tokens (address, name, description, content_type, issuer_handle, pricing_model, base_price_sats, max_supply, issuer_share_bps, facilitator_share_bps, is_active)
VALUES
  ('ip_fnews',   '$FNEWS',    'F.NEWS satirical media IP licence — create derivative deepfakes and characters',   'ip_licence', 'b0ase', 'alice_bond', 1000000000, 1000000000, 9000, 1000, true),
  ('ip_npgx',    '$NPGX',     'Ninja Punk Girls X IP licence — create NPG universe characters and content',        'ip_licence', 'b0ase', 'alice_bond', 1000000000, 1000000000, 9000, 1000, true),
  ('ip_cherryx', '$CHERRYX',  'CherryX IP licence — create derivative works and pay-to-mint content',             'ip_licence', 'b0ase', 'alice_bond', 1000000000, 1000000000, 9000, 1000, true),
  ('ip_zerodice','$ZERODICE', 'Zero Dice AI DJ IP licence — create stories, music videos, and merchandise',       'ip_licence', 'b0ase', 'alice_bond', 1000000000, 1000000000, 9000, 1000, true)
ON CONFLICT (address) DO NOTHING;
