import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar } from '@mui/material';
import { dataService } from '../services/api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
     
        const usersData = await dataService.getUsers();
        const postsData = await dataService.getPosts();
        
        const userCommentCounts = {};
        postsData.posts.forEach(post => {
          const userId = post.userId;
          if (!userCommentCounts[userId]) {
            userCommentCounts[userId] = 0;
          }
          userCommentCounts[userId] += post.comments?.length || 0;
        });

     
        const usersWithComments = Object.entries(usersData.users).map(([id, name]) => ({
          id,
          name,
          commentCount: userCommentCounts[id] || 0
        }));

        
        const sortedUsers = usersWithComments
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 5);

        setTopUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading top users...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Top 5 Most Commented Users
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {topUsers.map((user, index) => (
            <Card key={user.id}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  #{index + 1}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Comments: {user.commentCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default TopUsers; 