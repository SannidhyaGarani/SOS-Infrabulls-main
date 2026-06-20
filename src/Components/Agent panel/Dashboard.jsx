import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Shield, IdCard, LogOut, Menu, X, Settings,
  CheckCircle, Clock, Loader2, Lock, ExternalLink, Mail, Phone, MapPin, Calendar,
  KeyRound, Eye, EyeOff, AlertCircle, ChevronRight, Users
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOutAgent, setAgentPasswordOnce } from '../Firebase/agentHelpers';
import S3Image from '../S3Image';
import { getImageViewUrl } from '../Firebase/s3UploadService';
import './AgentPanel.css';

const mapAgentInfo = (agent) => {
  const docsUploaded = [agent.photographUrl, agent.panCardUrl, agent.aadhaarCardUrl].filter(Boolean).length;
  return {
    name: agent.fullName || [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' '),
    id: agent.loginId || agent.email,
    agentId: agent.agentId || 'Pending',
    ownReferralCode: agent.ownReferralCode || 'Pending',
    email: agent.email,
    mobile: agent.mobile1,
    status: agent.status || 'Pending',
    joiningDate: agent.date || '—',
    dob: agent.dob || '—',
    panCardNo: agent.panCardNo || '—',
    aadhaarCardNo: agent.aadhaarCardNo || '—',
    profileCompletion: Math.round((docsUploaded / 3) * 100),
    address: agent.localAddressLine || agent.permanentAddressLine1 || '—',
    city: agent.localCity || agent.permanentCity || '—',
    state: agent.localState || agent.permanentState || '—',
    pincode: agent.localPinCode || agent.permanentPinCode || '—',
    photographUrl: agent.photographUrl,
    panCardUrl: agent.panCardUrl,
    aadhaarCardUrl: agent.aadhaarCardUrl,
    passwordChanged: !!agent.passwordChanged,
    uid: agent.id,
  };
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  const isApproved = agentInfo?.status === 'Approved';
  const hasSetPassword = agentInfo?.passwordChanged;

  const fetchTeam = async () => {
    if (!agentInfo?.ownReferralCode || agentInfo.ownReferralCode === 'Pending') return;
    setTeamLoading(true);
    try {
      const q = query(collection(db, 'agents'), where('referralCode', '==', agentInfo.ownReferralCode));
      const snap = await getDocs(q);
      const members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeam(members);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'team') {
      fetchTeam();
    }
  }, [activeTab, agentInfo?.ownReferralCode]);

  useEffect(() => {
    let unsubDoc = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubDoc) unsubDoc();
      if (!user) { navigate('/agent/login'); return; }
      unsubDoc = onSnapshot(doc(db, 'agents', user.uid), (snap) => {
        if (!snap.exists()) { signOutAgent(); navigate('/agent/login'); return; }
        setAgentInfo(mapAgentInfo({ id: snap.id, ...snap.data() }));
        setAuthLoading(false);
      });
    });
    return () => { unsubAuth(); if (unsubDoc) unsubDoc(); };
  }, [navigate]);

  const handleLogout = async () => {
    await signOutAgent();
    navigate('/agent/login');
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters long.');
      return;
    }

    setPwLoading(true);
    try {
      await setAgentPasswordOnce(
        agentInfo.uid,
        agentInfo.id, // This is agent.email or agent.loginId from mapAgentInfo
        currentPassword,
        newPassword
      );
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message =
        err.code === 'auth/wrong-password'
          ? 'The temporary password you entered is incorrect.'
          : err.message || 'Failed to update security credentials.';
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  if (authLoading || !agentInfo) {
    return (
      <div className="agent-portal-wrapper align-items-center justify-content-center flex-column gap-3">
        <Loader2 className="animate-spin" size={40} color="#1174d6" />
        <p className="text-muted small fw-bold">Authenticating Portal Access...</p>
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard overview', icon: LayoutDashboard, requiresApproval: false },
    { id: 'team', name: 'My team network', icon: Users, requiresApproval: true },
    { id: 'profile', name: 'Identity profile', icon: User, requiresApproval: true },
    { id: 'kyc', name: 'KYC documents', icon: Shield, requiresApproval: true },
    { id: 'digital-card', name: 'Digital ID card', icon: IdCard, requiresApproval: true },
    { id: 'settings', name: 'Security settings', icon: Settings, requiresApproval: false, badge: !hasSetPassword ? '!' : null },
  ];

  const StatusBadge = ({ status }) => {
    const approved = status === 'Approved';
    return (
      <span className={`badge rounded-pill px-3 py-1 border ${
        approved ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning border-warning-subtle'
      }`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
        <span className={`d-inline-block rounded-circle me-1 ${approved ? 'bg-success' : 'bg-warning animate-pulse'}`} style={{ width: '6px', height: '6px' }} />
        {status}
      </span>
    );
  };

  const onboardingSteps = [
    { label: 'Registration Submitted', done: true },
    { label: 'Credentials Sent via Email', done: true },
    { label: 'Set Your Login Password', done: hasSetPassword, pending: !hasSetPassword },
    { label: 'HR Document Review', done: isApproved, pending: !isApproved && hasSetPassword },
    { label: 'Full Portal Access', done: isApproved },
  ];

  return (
    <div className="agent-portal-wrapper">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="position-fixed inset-0 bg-dark opacity-25 z-1000" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`agent-sidebar ${sidebarOpen ? 'd-flex vh-100 position-fixed overflow-hidden' : ''}`}>
        <div className="agent-sidebar-header">
           <img src="/img/logo.jpeg" alt="Logo" style={{ width: '36px', borderRadius: '8px' }} />
           <div>
             <span className="fw-800 d-block small" style={{ color: '#0A2540' }}>SOS INFRABULLS</span>
             <span className="text-muted fw-800 uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>Partner Node</span>
           </div>
           {sidebarOpen && <button className="btn ms-auto p-0" onClick={() => setSidebarOpen(false)}><X size={20} /></button>}
        </div>

        <nav className="agent-sidebar-nav">
          {navigationItems.map((item) => {
            const isLocked = item.requiresApproval && !isApproved;
            return (
              <button
                key={item.id}
                onClick={() => { if (!isLocked) { setActiveTab(item.id); setSidebarOpen(false); } }}
                disabled={isLocked}
                className={`agent-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <div className="d-flex align-items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
                {isLocked && <Lock size={12} />}
                {!isLocked && item.badge && <span className="badge bg-danger rounded-circle ms-2 p-1" style={{ fontSize: '0.4rem' }}> </span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-top">
          <button onClick={handleLogout} className="agent-nav-item text-danger w-100">
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 min-w-0 d-flex flex-column">
        {/* Top Header */}
        <header className="agent-header">
          <div className="d-flex align-items-center gap-3">
            <button className="btn d-lg-none p-0" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
            <h1 className="h5 fw-800 m-0 text-capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <StatusBadge status={agentInfo.status} />
            <div className="d-flex align-items-center gap-2 border-start ps-3 ms-2">
               <div className="text-end d-none d-sm-block">
                 <span className="d-block fw-700 small" style={{ fontSize: '0.8rem' }}>{agentInfo.name}</span>
                 <span className="text-muted" style={{ fontSize: '0.65rem' }}>{agentInfo.email}</span>
               </div>
               <div className="rounded-circle shadow-sm overflow-hidden" style={{ width: '32px', height: '32px' }}>
                 {agentInfo.photographUrl ? (
                   <S3Image src={agentInfo.photographUrl} alt="" className="w-100 h-100 object-cover" />
                 ) : (
                   <div className="w-100 h-100 bg-primary d-flex align-items-center justify-content-center text-white fw-bold small">
                     {agentInfo.name.charAt(0)}
                   </div>
                 )}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 p-md-5 mx-auto w-100" style={{ maxWidth: '1000px' }}>
          
          {/* Welcome Card */}
          {activeTab === 'dashboard' && (
            <>
              <div className="agent-hero-card mb-4" style={{ boxShadow: '0 20px 40px rgba(17, 116, 214, 0.15)' }}>
                 <div className="row align-items-center">
                   <div className="col-lg-8">
                     <span className="badge px-3 py-2 bg-white bg-opacity-10 mb-3" style={{ fontSize: '0.65rem', fontWeight: 800 }}>DASHBOARD OVERVIEW</span>
                     <h2 className="fw-800 mb-2 text-light">Success, <span className="fw-light">{agentInfo.name.split(' ')[0]}</span></h2>
                     <div className="d-flex flex-wrap gap-3 mt-3">
                        <div className="bg-white bg-opacity-10 px-3 py-2 rounded-3 border border-white border-opacity-10">
                          <label className="d-block text-white text-opacity-50 fw-800 uppercase" style={{ fontSize: '0.5rem' }}>Agent Identity</label>
                          <span className="text-white fw-bold font-monospace small">{agentInfo.agentId}</span>
                        </div>
                        <div className="bg-white bg-opacity-10 px-3 py-2 rounded-3 border border-white border-opacity-10">
                          <label className="d-block text-white text-opacity-50 fw-800 uppercase" style={{ fontSize: '0.5rem' }}>Referral Code</label>
                          <span className="text-white fw-bold font-monospace small">{agentInfo.ownReferralCode}</span>
                        </div>
                      </div>
                   </div>
                   <div className="col-lg-4 d-none d-lg-block text-end">
                      <Shield size={80} className="text-white opacity-10" />
                   </div>
                 </div>
              </div>

              {/* Quick Profile Summary */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Profile Progress</span>
                    <div className="d-flex align-items-baseline gap-2">
                      <h2 className="fw-800 m-0">{agentInfo.profileCompletion}%</h2>
                      {agentInfo.profileCompletion === 100 && <CheckCircle size={16} className="text-success" />}
                    </div>
                    <div className="progress mt-3" style={{ height: '6px' }}>
                      <div className="progress-bar bg-primary" style={{ width: `${agentInfo.profileCompletion}%` }} />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Account Age</span>
                    <h2 className="fw-800 m-0">{agentInfo.joiningDate}</h2>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Current Level</span>
                    <h2 className="fw-800 m-0 text-capitalize">{agentInfo.status}</h2>
                  </div>
                </div>
              </div>

              {!isApproved && (
                <div className="alert alert-warning border-0 p-4 mb-4 shadow-sm" style={{ background: '#fffbeb', borderRadius: '18px' }}>
                  <div className="d-flex gap-3">
                    <Clock size={24} className="text-warning flex-shrink-0" />
                    <div>
                      <h6 className="fw-800 mb-1">HR Review Pending</h6>
                      <p className="small text-muted m-0">Your profile is currently under active review. Full portal features including your Digital Agent Card will be unlocked once HR completes the verification process.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onboarding Roadmap */}
              <div className="agent-card">
                 <h6 className="fw-800 mb-4 px-1">Onboarding Roadmap</h6>
                 <div className="row g-3">
                   {onboardingSteps.map((step, idx) => (
                     <div key={idx} className="col-12">
                       <div className={`onboarding-step ${step.done ? 'done' : step.pending ? 'pending' : ''}`}>
                         <div className={`rounded-circle d-flex align-items-center justify-content-center ${step.done ? 'bg-success text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                            {step.done ? <CheckCircle size={16} /> : <Clock size={16} className={step.pending ? 'animate-spin text-warning' : 'text-muted'} />}
                         </div>
                         <div className="flex-grow-1">
                           <span className={`fw-700 small ${step.done ? 'text-success' : 'text-muted'}`}>{step.label}</span>
                         </div>
                         {step.done && <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.6rem' }}>COMPLETED</span>}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </>
          )}

          {activeTab === 'profile' && isApproved && (
            <div className="agent-card">
               <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 fw-800" style={{ fontSize: '0.65rem' }}>IDENTITY PROFILE</span>
               <div className="row g-4 mt-1">
                  <div className="col-md-6 border-end">
                     {[
                       { label: 'Full Name', value: agentInfo.name, icon: User },
                       { label: 'Mobile Number', value: agentInfo.mobile, icon: Phone },
                       { label: 'Email Address', value: agentInfo.email, icon: Mail },
                       { label: 'Date of Birth', value: agentInfo.dob, icon: Calendar }
                     ].map((item, i) => (
                       <div key={i} className="mb-4">
                         <label className="text-muted fw-700 uppercase d-block mb-1" style={{ fontSize: '0.6rem' }}>{item.label}</label>
                         <span className="fw-600 text-dark">{item.value}</span>
                       </div>
                     ))}
                  </div>
                  <div className="col-md-6">
                     <div className="mb-4">
                       <label className="text-muted fw-700 uppercase d-block mb-1" style={{ fontSize: '0.6rem' }}>Resident Address</label>
                       <p className="fw-600 text-dark small leading-relaxed">{agentInfo.address}<br/>{agentInfo.city}, {agentInfo.state} - {agentInfo.pincode}</p>
                     </div>
                     <div className="p-4 bg-light rounded-4">
                        <span className="fw-800 small d-block mb-2">Portal Access Link</span>
                        <code className="bg-white p-2 rounded d-block text-primary fw-600" style={{ fontSize: '0.7rem' }}>{window.location.origin}/agent/login</code>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'kyc' && isApproved && (
            <div className="row g-4">
               {[
                 { name: 'Profile Photograph', url: agentInfo.photographUrl },
                 { name: 'PAN Card Proof', url: agentInfo.panCardUrl },
                 { name: 'Aadhaar Card Proof', url: agentInfo.aadhaarCardUrl }
               ].map((doc, idx) => (
                 <div className="col-md-4" key={idx}>
                   <div className="agent-card p-0 overflow-hidden h-100 shadow-sm border-light">
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '160px' }}>
                        {doc.url ? (
                          <S3Image src={doc.url} className="w-100 h-100 object-cover" />
                        ) : (
                          <Shield size={40} className="text-muted opacity-25" />
                        )}
                      </div>
                      <div className="p-3">
                        <h6 className="fw-800 small mb-1">{doc.name}</h6>
                        <span className={`small fw-bold ${doc.url ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.6rem' }}>
                          {doc.url ? 'VERIFIED ✓' : 'MISSING ⚠'}
                        </span>
                        {doc.url && (
                          <button 
                            className="btn btn-link btn-sm p-0 d-block mt-2 text-decoration-none fw-700" 
                            style={{ fontSize: '0.7rem' }}
                            onClick={async () => {
                              const url = await getImageViewUrl(doc.url);
                              if (url) window.open(url, '_blank');
                            }}
                          >
                            View Original <ExternalLink size={10} />
                          </button>
                        )}
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'digital-card' && isApproved && (
            <div className="text-center py-5">
              <h5 className="fw-800 mb-4">Authorized Agent ID Card</h5>
              <div className="digital-id-card text-start">
                 <div className="d-flex justify-content-between mb-4 border-bottom border-white border-opacity-20 pb-3">
                    <div>
                      <span className="fw-900 d-block small tracking-wider">SOS INFRABULLS</span>
                      <span className="text-white-50 text-uppercase fw-800" style={{ fontSize: '0.5rem' }}>Digital Partner</span>
                    </div>
                    <span className="badge bg-success small" style={{ fontSize: '0.5rem' }}>ACTIVE</span>
                 </div>
                 
                  <div className="d-flex gap-4 align-items-center">
                    <div className="rounded-4 overflow-hidden border border-white border-opacity-20 shadow-lg" style={{ width: '80px', height: '100px' }}>
                      <S3Image src={agentInfo.photographUrl} className="w-100 h-100 object-cover" />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                       <label className="text-blue-100 opacity-50 uppercase fw-800 d-block mb-1" style={{ fontSize: '0.5rem' }}>Agent Identity</label>
                       <h5 className="fw-800 mb-3 truncate">{agentInfo.name}</h5>
                       
                       <div className="row g-2">
                          <div className="col-6">
                            <label className="text-blue-100 opacity-50 uppercase fw-800 d-block mb-1" style={{ fontSize: '0.5rem' }}>Agent ID</label>
                            <span className="bg-white bg-opacity-10 px-2 py-1 rounded d-block text-center fw-600 font-monospace" style={{ fontSize: '0.65rem' }}>{agentInfo.agentId}</span>
                          </div>
                          <div className="col-6">
                            <label className="text-blue-100 opacity-50 uppercase fw-800 d-block mb-1" style={{ fontSize: '0.5rem' }}>Referral Code</label>
                            <span className="bg-white bg-opacity-10 px-2 py-1 rounded d-block text-center fw-600 font-monospace" style={{ fontSize: '0.65rem' }}>{agentInfo.ownReferralCode}</span>
                          </div>
                        </div>
                    </div>
                  </div>

                 <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-flex justify-content-between text-white-50 uppercase fw-700" style={{ fontSize: '0.5rem' }}>
                    <span>Joined: {agentInfo.joiningDate}</span>
                    <span>Valid Property Node</span>
                 </div>
              </div>
              <p className="mt-4 text-muted small">This digital card is automatically generated and verified by the HR office.</p>
            </div>
          )}

          {activeTab === 'team' && isApproved && (
            <div className="agent-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-800 m-0">My Direct Referrals</h6>
                <span className="badge bg-primary-subtle text-primary fw-800 px-3">{team.length} Member{team.length !== 1 ? 's' : ''}</span>
              </div>

              {teamLoading ? (
                <div className="py-5 text-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : team.length === 0 ? (
                <div className="text-center py-5 border-dashed rounded-4">
                  <Users size={48} className="text-muted opacity-25 mb-3" />
                  <h6 className="text-muted fw-700">No team members yet</h6>
                  <p className="text-muted small mx-auto" style={{ maxWidth: '300px' }}>
                    Share your referral code <strong className="text-primary">{agentInfo.ownReferralCode}</strong> with others to build your network.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle m-0">
                    <thead>
                      <tr className="border-bottom">
                        <th className="text-muted small fw-800 uppercase pb-3" style={{ fontSize: '0.6rem' }}>Member Identity</th>
                        <th className="text-muted small fw-800 uppercase pb-3" style={{ fontSize: '0.6rem' }}>Agent ID</th>
                        <th className="text-muted small fw-800 uppercase pb-3" style={{ fontSize: '0.6rem' }}>Contact</th>
                        <th className="text-muted small fw-800 uppercase pb-3" style={{ fontSize: '0.6rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((member) => (
                        <tr key={member.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="rounded-circle bg-light border overflow-hidden" style={{ width: '36px', height: '36px' }}>
                                {member.photographUrl ? (
                                  <S3Image src={member.photographUrl} className="w-100 h-100 object-cover" />
                                ) : (
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-primary fw-bold small">
                                    {member.fullName?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="fw-800 small d-block">{member.fullName}</span>
                                <span className="text-muted" style={{ fontSize: '0.65rem' }}>{member.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="badge bg-light text-dark font-monospace small px-2 py-1 border">{member.agentId}</span>
                          </td>
                          <td className="py-3 fw-600 small">{member.mobile1}</td>
                          <td className="py-3">
                            <span className={`badge rounded-pill px-2 py-1 ${member.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '0.6rem' }}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="agent-card" style={{ maxWidth: '480px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                 <KeyRound size={24} className="text-primary" />
                 <h6 className="fw-800 m-0">Account Security</h6>
              </div>
              
              {!hasSetPassword ? (
                <form onSubmit={handleSetPassword}>
                  {pwError && <div className="alert alert-danger small border-0 py-2">{pwError}</div>}
                  {pwSuccess && <div className="alert alert-success small border-0 py-2">Security credentials updated successfully!</div>}
                  
                  <div className="mb-3">
                    <label className="fw-700 text-muted small mb-1">Current Temporary Password</label>
                    <input 
                      type="password" 
                      className="agent-input" 
                      placeholder="received via email"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fw-700 text-muted small mb-1">New Secure Password</label>
                    <input 
                      type="password" 
                      className="agent-input" 
                      placeholder="min 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="fw-700 text-muted small mb-1">Verify Password</label>
                    <input 
                      type="password" 
                      className="agent-input" 
                      placeholder="confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <button className="btn btn-primary w-100 py-2 fw-bold" disabled={pwLoading}>
                    {pwLoading ? 'Securing Account...' : 'Set Password Permanently'}
                  </button>
                </form>
              ) : (
                <div className="bg-light p-4 rounded-4 text-center">
                   <Lock size={32} className="text-success opacity-50 mb-3" />
                   <h6 className="fw-800 small">Biometric / Password Logged</h6>
                   <p className="text-muted small m-0">Your secure password has been registered. It cannot be modified without HR intervention for security reasons.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
