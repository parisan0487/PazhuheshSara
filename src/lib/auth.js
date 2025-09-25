import jwt from 'jsonwebtoken';

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            userId: decoded.id,
            role: decoded.role,
        };
    } catch {
        return null;
    }
}



// تابع بررسی لاگین بودن در سمت سرور
export function getCurrentAdmin() {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (decoded?.role === 'admin') {
        return decoded;
    }
    return null;
}