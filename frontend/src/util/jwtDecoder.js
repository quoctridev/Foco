export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return decoded.roleId || null;
};

export const getUsernameFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return decoded.username || decoded.sub || null;
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

