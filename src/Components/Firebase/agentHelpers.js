import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './Firebase';

export const generateAgentPassword = () =>
  String(Math.floor(10000000 + Math.random() * 90000000));

export const createAgentAccount = async ({
  email,
  password,
  formData,
  photographUrl,
  panCardUrl,
  aadhaarCardUrl,
  partnerRequestId,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );
  const { uid } = credential.user;

  await signOut(auth);

  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(' ');

  const agentData = {
    uid,
    loginId: normalizedEmail,
    email: normalizedEmail,
    password,
    role: 'agent',
    status: 'Pending',
    fullName,
    ...formData,
    photographUrl,
    panCardUrl,
    aadhaarCardUrl,
    partnerRequestId: partnerRequestId || null,
    passwordChanged: false,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'agents', uid), agentData);

  return { uid, loginId: normalizedEmail, password, agentData };
};

export const signInAgent = async (loginId, password) => {
  const normalizedEmail = loginId.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );

  const agentRef = doc(db, 'agents', credential.user.uid);
  const agentSnap = await getDoc(agentRef);

  if (!agentSnap.exists()) {
    await signOut(auth);
    throw new Error('Agent account not found. Please contact support.');
  }

  return { user: credential.user, agent: { id: agentSnap.id, ...agentSnap.data() } };
};

export const getAgentProfile = async (uid) => {
  const agentRef = doc(db, 'agents', uid);
  const agentSnap = await getDoc(agentRef);
  if (!agentSnap.exists()) return null;
  return { id: agentSnap.id, ...agentSnap.data() };
};

export const signOutAgent = () => signOut(auth);

export const setAgentPasswordOnce = async (uid, loginId, currentPassword, newPassword) => {
  const agentRef = doc(db, 'agents', uid);
  const agentSnap = await getDoc(agentRef);

  if (!agentSnap.exists()) {
    throw new Error('Agent account not found.');
  }
  if (agentSnap.data().passwordChanged) {
    throw new Error('Password has already been set. You cannot change it again.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to set your password.');
  }

  const normalizedEmail = loginId.trim().toLowerCase();
  const credential = EmailAuthProvider.credential(normalizedEmail, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  await updateDoc(agentRef, {
    passwordChanged: true,
    password: newPassword,
    passwordChangedAt: serverTimestamp(),
  });
};
