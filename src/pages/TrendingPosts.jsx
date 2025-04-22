import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { dataService } from '../services/api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const data = await dataService.getPosts();
        
        
        const sortedPosts = [...(data.posts || [])].sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
        );

        const maxComments = sortedPosts[0]?.comments?.length || 0;

        
        const trending = sortedPosts.filter(
          post => (post.comments?.length || 0) === maxComments
        );

        setTrendingPosts(trending);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();

    
    const interval = setInterval(fetchTrendingPosts, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading trending posts...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Trending Posts
        </Typography>
        {trendingPosts.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {trendingPosts.map((post) => (
              <Card key={post.id} sx={{ bgcolor: 'primary.light' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.dark' }}>
                      {post.user.name.charAt(0)}
                    </Avatar>
                  }
                  title={post.user.name}
                  subheader={new Date(post.timestamp).toLocaleString()}
                />
                <CardContent>
                  <Typography variant="body1" color="text.primary">
                    {post.content}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary.dark">
                      🔥 {post.comments?.length || 0} Comments
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography>No trending posts found</Typography>
        )}
      </Box>
    </Container>
  );
};

export default TrendingPosts; 