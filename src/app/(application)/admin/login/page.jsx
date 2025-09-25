import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';



export default function AdminLoginPage() {
    const token = cookies().get('token')?.value;
    const isValid = verifyToken(token);

    if (isValid) {
        redirect('/admin');
    }

    return <LoginForm/>;
}
