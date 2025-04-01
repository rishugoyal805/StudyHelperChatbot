'use server';

import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

interface UpdateProfileParams {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateProfile({ name, currentPassword, newPassword }: UpdateProfileParams) {
  try {
    const session = await getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const { db } = await connectToDatabase();
    const userId = new ObjectId(session.user.id);
    
    // Get current user data
    const user = await db.collection('users').findOne({ _id: userId });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Prepare update data
    const updateData: any = { name };
    
    // If changing password, verify current password and hash new password
    if (newPassword) {
      if (!currentPassword) {
        return { success: false, error: 'Current password is required' };
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    // Update user in database
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return { success: false, error: 'No changes were made' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'An error occurred while updating profile' };
  }
}
