export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  if (!token || !tokenExpiration) {
    return false;
  }

  if (new Date().getTime() > parseInt(tokenExpiration)) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    return false;
  }

  return true;
};

export const setAuth = (token) => {
  const expirationTime = new Date().getTime() + (5 * 60 * 1000); // 5 minutes
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiration', expirationTime);
};