const app = require('./app');
const path = require('path');
const documentRoutes = require('./routes/documents');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});