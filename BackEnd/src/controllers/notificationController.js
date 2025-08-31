import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../utils/email.js';

export const createNotification = async (userId, type, message, relatedId, relatedModel) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
      relatedId,
      relatedModel,
    });
    await notification.save();

    const user = await User.findById(userId);
    user.notifications = user.notifications || [];
    user.notifications.push(notification._id);
    await user.save();

    await sendEmail(user.email, `New ${type} Notification`, message);
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('relatedId', 'title')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markNotificationRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};