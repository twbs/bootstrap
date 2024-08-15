export class StackedNotificationManager {
    constructor() {
        this.notifications = [];
        this.container = this._createStackedNotificationContainer();
    }

    _createStackedNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'stacked-notification-container';
        document.body.appendChild(container);
        return container;
    }

    createStackedNotification(type, message, autoDismiss = true, dismissTime = 3000) {
        const notification = document.createElement('div');
        notification.className = `stacked-notification stacked-notification-${type}`;
        notification.innerText = message;
    
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.removeStackedNotification(notification);
    
        notification.appendChild(closeBtn);
        this.container.appendChild(notification);
    
        this.notifications.push(notification);
    
        if (autoDismiss) {
            setTimeout(() => {
                if (notification.parentNode) {
                    this.removeStackedNotification(notification);
                }
            }, dismissTime);
        }
    }
    

    removeStackedNotification(notification) {
        if (notification && notification.parentNode === this.container) {
            this.container.removeChild(notification);
            this.notifications = this.notifications.filter(n => n !== notification);
        }
    }
    

    clearAllStackedNotifications() {
        this.notifications.forEach(notification => this.removeStackedNotification(notification));
    }
}