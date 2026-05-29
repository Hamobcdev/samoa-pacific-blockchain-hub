import { useState } from 'react';
import { ResearchGate } from '@samoa-dpi/shared-ui';
import VerifyAuthGate from './components/VerifyAuthGate';
import PublicVerifyView from './components/PublicVerifyView';
import IssuingAuthorityDashboard from './components/IssuingAuthorityDashboard';

export default function App() {
  const [view, setView] = useState('gate');   // 'gate' | 'public' | 'dashboard'
  const [authUser, setAuthUser] = useState(null);

  return (
    <ResearchGate storageKey="sdpi_verify_acknowledged">
      {view === 'gate' && (
        <VerifyAuthGate
          onPublicAccess={() => setView('public')}
          onAuthAccess={user => { setAuthUser(user); setView('dashboard'); }}
        />
      )}
      {view === 'public' && (
        <PublicVerifyView onBack={() => setView('gate')} />
      )}
      {view === 'dashboard' && authUser && (
        <IssuingAuthorityDashboard
          user={authUser}
          onSignOut={() => { setAuthUser(null); setView('gate'); }}
        />
      )}
    </ResearchGate>
  );
}
