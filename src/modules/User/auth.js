/**
 * Security: Data Encryption and Session Simulation Mock
 * In a real application, this uses bcrypt for hashing passwords
 * and JWT for secure token handling.
 */

// Simulated Hash function (Data Encryption non-functional requirement constraint)
export const hashPassword = (password) => {
  return btoa(password + process.env.VITE_SALT || "secure_salt_123");
};

// Simulated Token Generation (Secure Login using authentication)
export const generateSecureToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    userId: user.id,
    role: user.role, // Role-based access control payload
    exp: Date.now() + 1000 * 60 * 60 * 24 // 1 day expiration
  }));
  const signature = btoa("mock_signature");
  return `${header}.${payload}.${signature}`;
};

// Simulated Token Verification (Data Integrity + Security)
export const verifyAuthToken = (token) => {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    if (Date.now() > payload.exp) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (error) {
    return null;
  }
};
