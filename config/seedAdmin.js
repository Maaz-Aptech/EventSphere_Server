// server/config/seedAdmin.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const admin = new User({
        fullName: 'System Administrator',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        mobile: '0000000000',
      });

      await admin.save();
      console.log('✅ Default admin created: admin@gmail.com / Admin@123');
    } else {
      console.log('ℹ️ Admin already exists, skipping seeding.');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

export default seedAdmin;
