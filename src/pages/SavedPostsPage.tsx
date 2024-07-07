// src/pages/SavedPostsPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

const SavedPostsPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchSavedPosts = async () => {
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      const savedPostIds = userDoc.data()?.savedPosts || [];
      if (savedPostIds.length) {
        const q = query(collection(firestore, 'posts'), where('id', 'in', savedPostIds));
        const querySnapshot = await getDocs(q);
        setSavedPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchSavedPosts();
  }, [currentUser]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Saved Posts
      </Typography>
      <Grid container spacing={3}>
        {savedPosts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card>
              <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
              <CardContent>
                <Typography variant="h6">{post.username}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavedPostsPage;
