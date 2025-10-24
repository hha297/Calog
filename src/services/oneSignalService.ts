import OneSignal from 'react-native-onesignal';

export const initializeNotifications = () => {
  // Initialize OneSignal
  OneSignal.initialize('YOUR_ONESIGNAL_APP_ID');

  // Request permission for notifications
  OneSignal.Notifications.requestPermission(true);

  // Set up notification handlers
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
    console.log('OneSignal: notification will show in foreground:', event);
  });
};

export const sendNotification = async (title: string, message: string) => {
  try {
    // Send notification via OneSignal
    await OneSignal.Notifications.postNotification({
      title,
      body: message,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const setUserTag = (key: string, value: string) => {
  OneSignal.User.addTag(key, value);
};

export const removeUserTag = (key: string) => {
  OneSignal.User.removeTag(key);
};
