import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export function generateToken(data) {
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    // En desarrollo, permitir tokens dummy para testing
    if (process.env.NODE_ENV === 'development' && token === 'dummy-token-for-testing') {
      decoded = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
    } else {
      decoded = verifyToken(token);
    }

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    return handler(req, res);
  };
}

export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return handler(req, res);
  });
}
