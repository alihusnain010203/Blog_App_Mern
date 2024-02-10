import { Button } from 'flowbite-react'
import React from 'react'
import { GoogleAuthProvider, signInWithPopup,getAuth } from 'firebase/auth'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {useNavigate} from 'react-router-dom';
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice/userSlice';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultfromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('http://localhost:300/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: resultfromGoogle.user.displayName,
                    email: resultfromGoogle.user.email,
                    DPurl: resultfromGoogle.user.photoURL
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Button type='button' gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6' />
            Continue with Google
        </Button>
    );
};

export default OAuth