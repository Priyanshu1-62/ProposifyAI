import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // Adding priority order for DNS resolution ordering fix for Render-Supabase

import app from './app';

const PORT = process.env.PORT || 5000;

// Controllers                    => Communication orchestration
// Orchetrator domain services    => Knows and archestrates business intent 
// AI Domain Services             => AI-aware domain services, knows about prompts and parameters
// Provider-aware Domain Services => Manages structuring input and output wrt services providers
// Provider Services              => Knows and interacts with service providers

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});