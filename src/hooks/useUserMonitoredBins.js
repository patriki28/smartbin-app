import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

export default function useUserMonitoredBins(binsData) {
    const userId = auth.currentUser.uid;
    const [userSelectedBins, setUserSelectedBins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserSelectedBins = async () => {
            setLoading(true);
            setError(null);
            try {
                const binDocs = await Promise.all(binsData.map((bin) => getDoc(doc(db, 'bins', bin.id))));
                const selectedBins = binDocs
                    .filter((binDoc) => binDoc.exists() && binDoc.data().userIds && binDoc.data().userIds.includes(userId))
                    .map((binDoc) => binDoc.id);
                setUserSelectedBins(selectedBins);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (binsData.length > 0) {
            fetchUserSelectedBins();
        } else {
            setLoading(false);
        }
    }, [binsData, userId]);

    return { userSelectedBins, loading, error };
}
