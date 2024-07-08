// src/pages/SavedPostsPage.tsx
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const SavedPostsPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUser) return;

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      if (userData && userData.savedPosts) {
        const savedPostsQuery = query(collection(firestore, 'posts'), where('__name__', 'in', userData.savedPosts));
        const querySnapshot = await getDocs(savedPostsQuery);
        setSavedPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchSavedPosts();
  }, [currentUser]);

  return (
    <Container sx={{ marginTop: 8 }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Saved Posts
        </Typography>
        <Grid container spacing={3}>
          {savedPosts && savedPosts.length > 0 ? (
            savedPosts.map(post => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body1">{post.caption}</Typography>
                    <Typography variant="body2" color="textSecondary">{post.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {(post.likes || []).length} likes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No saved posts available</Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default SavedPostsPage;
