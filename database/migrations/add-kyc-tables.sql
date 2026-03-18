-- Add KYC tables for $402 vending machine
-- Tracks identity verification status for high-value token purchases

CREATE TABLE IF NOT EXISTS kyc_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_handle TEXT NOT NULL UNIQUE,
  kyc_status TEXT DEFAULT 'unverified', -- unverified, verified, rejected
  kyc_provider TEXT,
  kyc_session_id TEXT,
  kyc_verified_at TIMESTAMPTZ,
  bsv_address TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  date_of_birth TEXT,
  document_type TEXT,
  document_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kyc_subjects_user_handle ON kyc_subjects(user_handle);
CREATE INDEX idx_kyc_subjects_kyc_status ON kyc_subjects(kyc_status);

CREATE TABLE IF NOT EXISTS kyc_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_handle TEXT NOT NULL,
  veriff_session_id TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, approved, declined
  veriff_response JSONB,
  decision_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kyc_sessions_user_handle ON kyc_sessions(user_handle);
CREATE INDEX idx_kyc_sessions_status ON kyc_sessions(status);
CREATE INDEX idx_kyc_sessions_veriff_id ON kyc_sessions(veriff_session_id);
