-- UHRP (BRC-26) Advertisement Registry
-- Tracks content-addressed file advertisements across the $402 overlay network.

CREATE TABLE IF NOT EXISTS uhrp_advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uhrp_url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  content_type TEXT DEFAULT 'application/octet-stream',
  content_size BIGINT DEFAULT 0,
  download_url TEXT NOT NULL,
  advertiser_address TEXT NOT NULL,
  expiry_at TIMESTAMPTZ,
  inscription_txid TEXT,
  inscription_status TEXT DEFAULT 'pending',
  source_type TEXT NOT NULL,       -- 'domain_verify', 'content_serve', 'manual'
  source_id TEXT,                  -- Reference to originating record
  token_address TEXT,              -- $address if tied to a token
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uhrp_ads_hash ON uhrp_advertisements(content_hash);
CREATE INDEX IF NOT EXISTS idx_uhrp_ads_url ON uhrp_advertisements(uhrp_url);
CREATE INDEX IF NOT EXISTS idx_uhrp_ads_source ON uhrp_advertisements(source_type);
CREATE INDEX IF NOT EXISTS idx_uhrp_ads_advertiser ON uhrp_advertisements(advertiser_address);
