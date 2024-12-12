import { PrismaClient } from '@prisma/client';
import crypto from 'crypto'; // Use ES module import for crypto
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email }: { email: string } = req.body; // Ensure email is a string
  console.log(email)

  try {
    // Check if email exists in the database using Prisma and voter model
    const voter = await prisma.voter.findUnique({
      where: { email },
    });
   console.log(voter)
    if (!voter) {
      return res.status(400).json({ message: 'Voter with this email does not exist' });
    }

    // Generate a token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token and expiration in the database using Prisma
    await prisma.voter.update({
      where: { id: voter.id }, // Use the voter's ID since email is not unique
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    // Send back the token to the frontend
    res.json({ token: resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// POST route to reset password
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
  
    try {
      // Find the user by reset token and ensure token is not expired
      const user = await prisma.voter.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(), // Check if the token is still valid
          },
        },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Update the user's password and clear the reset token
      await prisma.voter.update({
        where: { id: user.id },
        data: {
          password, // Make sure to hash the password before storing it
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
  
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
// POST route to reset password
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
  
    try {
      // Find the user by reset token and ensure token is not expired
      const user = await prisma.voter.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(), // Check if the token is still valid
          },
        },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Update the user's password and clear the reset token
      await prisma.voter.update({
        where: { id: user.id },
        data: {
          password, // Make sure to hash the password before storing it
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
  
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
    

export default router; // Use ES module export
