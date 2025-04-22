import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.token = null;
  }

  async register() {
    try {
      const userData = {
        email: "azhagammai055@gmail.com",
        name: "Azhagammai",
        mobileNo: "8248214887",
        githubUsername: "azhagammai",
        rollNo: "727622bad094",
        collegeName: "Dr.MahalingamCollegeofEngineeringandTechnology",
        accessCode: "jtBuzu"
      };

      const response = await api.post('/register', userData);
      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem('auth_token', this.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await api.get('/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  isUserAuthenticated() {
    return this.isAuthenticated || !!this.getToken();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
}

export default new AuthService(); 