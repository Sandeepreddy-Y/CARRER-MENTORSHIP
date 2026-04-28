const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const { User, CareerResource } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const seedData = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding initial counsellor...');
      await User.bulkCreate([
        {
          name: 'Dr. Jane Smith',
          email: 'counsellor@example.com',
          password: 'password123',
          role: 'counsellor',
          bio: 'Expert career counsellor with 10 years of experience helping students find their dream jobs.',
          interests: ['Tech', 'Business'],
          skills: ['Career Coaching', 'Resume Review', 'Interview Prep']
        },
        {
          name: 'Prof. Alan Turing',
          email: 'alan@example.com',
          password: 'password123',
          role: 'counsellor',
          bio: 'Former software engineer turned mentor. Specialized in breaking into tech and algorithms.',
          interests: ['Engineering', 'IT'],
          skills: ['Technical Interviews', 'Coding Bootcamp Prep', 'System Design']
        },
        {
          name: 'Sarah OConnor',
          email: 'sarah@example.com',
          password: 'password123',
          role: 'counsellor',
          bio: 'Healthcare professional with extensive experience in nursing career advancement.',
          interests: ['Healthcare', 'Education'],
          skills: ['Medical School Prep', 'Nursing Certifications', 'Work-Life Balance']
        },
        {
          name: 'Michael Chen',
          email: 'michael@example.com',
          password: 'password123',
          role: 'counsellor',
          bio: 'Finance executive helping graduates land competitive roles in investment banking and analytics.',
          interests: ['Finance', 'Business'],
          skills: ['Financial Modeling', 'Networking', 'Salary Negotiation']
        }
      ], { individualHooks: true });
      console.log('Seeded counsellor successfully!');
    }

    const count = await CareerResource.count();
    if (count === 0) {
      console.log('Seeding initial career paths...');
      await CareerResource.bulkCreate([
        {
          title: 'Software Engineer',
          description: 'Design, develop, and test software applications. Create innovative solutions to complex problems and shape the digital landscape.',
          category: 'Engineering',
          skills: ['JavaScript', 'Python', 'System Design', 'Algorithms'],
          salary: { min: 70000, max: 160000, currency: 'USD' },
          jobOutlook: 'Excellent growth expected over the next decade. High demand across all industries.',
          educationRequired: "Bachelor's in Computer Science or equivalent bootcamp experience.",
          resourceLinks: [
            { title: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/', type: 'website' }
          ]
        },
        {
          title: 'Product Manager',
          description: 'Guide the success of a product and lead the cross-functional team that is responsible for improving it.',
          category: 'Business',
          skills: ['Leadership', 'Agile', 'Market Research', 'Communication'],
          salary: { min: 80000, max: 150000, currency: 'USD' },
          jobOutlook: 'Strong growth as tech companies expand product lines.',
          educationRequired: "Bachelor's in Business, Computer Science, or related field.",
          resourceLinks: [
            { title: 'Product School', url: 'https://productschool.com/', type: 'course' }
          ]
        },
        {
          title: 'Registered Nurse',
          description: 'Provide and coordinate patient care, educate patients about various health conditions, and provide advice and emotional support.',
          category: 'Healthcare',
          skills: ['Patient Care', 'Empathy', 'Medical Knowledge', 'CPR'],
          salary: { min: 60000, max: 110000, currency: 'USD' },
          jobOutlook: 'Much faster than average growth as the population ages.',
          educationRequired: 'Bachelor of Science in Nursing (BSN) or Associate Degree in Nursing (ADN).',
          resourceLinks: []
        },
        {
          title: 'Data Analyst',
          description: 'Analyze data to help companies make better business decisions and discover hidden insights.',
          category: 'IT',
          skills: ['SQL', 'Excel', 'Python', 'Tableau'],
          salary: { min: 55000, max: 105000, currency: 'USD' },
          jobOutlook: 'High demand across all tech and finance sectors.',
          educationRequired: "Bachelor's in Statistics, Math, IT, or related field.",
          resourceLinks: [
            { title: 'Kaggle', url: 'https://www.kaggle.com/', type: 'website' }
          ]
        },
        {
          title: 'Financial Analyst',
          description: 'Guide businesses and individuals in making investment decisions. Assess the performance of stocks, bonds, and other types of investments.',
          category: 'Finance',
          skills: ['Financial Modeling', 'Data Analysis', 'Excel', 'Accounting'],
          salary: { min: 60000, max: 120000, currency: 'USD' },
          jobOutlook: 'Faster than average growth due to economic complexity.',
          educationRequired: "Bachelor's in Finance, Economics, or Accounting.",
          resourceLinks: []
        },
        {
          title: 'UX/UI Designer',
          description: 'Create user-friendly interfaces and experiences for digital products. Conduct user research and design wireframes.',
          category: 'Creative',
          skills: ['Figma', 'User Research', 'Wireframing', 'Visual Design'],
          salary: { min: 65000, max: 130000, currency: 'USD' },
          jobOutlook: 'High demand as digital products prioritize user experience.',
          educationRequired: "Bachelor's in Design, HCI, or strong portfolio.",
          resourceLinks: []
        },
        {
          title: 'High School Teacher',
          description: 'Educate students, typically in a specific subject, to prepare them for college or the workforce.',
          category: 'Education',
          skills: ['Communication', 'Patience', 'Subject Matter Expertise', 'Lesson Planning'],
          salary: { min: 45000, max: 95000, currency: 'USD' },
          jobOutlook: 'Steady demand with regional variations.',
          educationRequired: "Bachelor's degree and state teaching certification.",
          resourceLinks: []
        },
        {
          title: 'Environmental Scientist',
          description: 'Analyze environmental problems and develop solutions. Protect the environment and human health.',
          category: 'Other',
          skills: ['Data Collection', 'Analysis', 'Research', 'GIS'],
          salary: { min: 50000, max: 100000, currency: 'USD' },
          jobOutlook: 'Faster than average growth driven by increasing environmental awareness.',
          educationRequired: "Bachelor's in Environmental Science or related field.",
          resourceLinks: []
        }
      ]);
      console.log('Seeded career paths successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('Models synchronized');
    
    await seedData();
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/careerResourceRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
