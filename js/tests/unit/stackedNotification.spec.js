import { StackedNotificationManager } from '../../src/stackedNotification';

describe('StackedNotificationManager', () => {
    let stackedNotificationManager;

    beforeEach(() => {
        stackedNotificationManager = new StackedNotificationManager();
    });

    afterEach(() => {
        stackedNotificationManager.clearAllStackedNotifications();
    });

    it('should create a stacked notification and add it to the DOM', () => {
        stackedNotificationManager.createStackedNotification('success', 'Success message');
        const notifications = document.querySelectorAll('.stacked-notification');
        expect(notifications.length).toBe(1);
        expect(notifications[0].classList.contains('stacked-notification-success')).toBe(true);
        expect(notifications[0].innerText.includes('Success message')).toBe(true);
    });

    it('should automatically remove the stacked notification after a certain time', (done) => {
        stackedNotificationManager.createStackedNotification('error', 'Error message', true, 1000);
        setTimeout(() => {
            const notifications = document.querySelectorAll('.stacked-notification');
            expect(notifications.length).toBe(0);
            done();
        }, 1500);
    });

    it('should allow manual removal of stacked notifications', () => {
        stackedNotificationManager.createStackedNotification('warning', 'Warning message');
        const notification = document.querySelector('.stacked-notification');
        notification.querySelector('.close-btn').click();
        const notifications = document.querySelectorAll('.stacked-notification');
        expect(notifications.length).toBe(0);
    });
});
