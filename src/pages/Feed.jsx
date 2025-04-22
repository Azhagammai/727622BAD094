import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { dataService } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await dataService.getPosts();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

   
    fetchPosts();

   
    const interval = setInterval(fetchPosts, 5000); 

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading posts...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Latest Posts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader
                avatar={
                  <Avatar>
                    {post.user.name.charAt(0)}
                  </Avatar>
                }
                title={post.user.name}
                subheader={new Date(post.timestamp).toLocaleString()}
              />
              <CardContent>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Comments: {post.comments?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Feed; 