import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

export default function useCurrentUserData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) {
            setError(new Error('No authenticated user found.'));
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        const unsubscribe = onSnapshot(
            userDocRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setData({ id: docSnapshot.id, ...docSnapshot.data() });
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}
