/**
 * Клиент для работы с системой уведомлений Identics
 */
class NotificationService {
  constructor(userId) {
    this.userId = userId;
    this.connected = false;
    this.stompClient = null;
    this.onMessageCallback = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.pendingNotifications = [];
    
    // Initialize unread notifications count
    this.unreadCount = 0;
    this.loadUnreadCount();
  }
  
  /**
   * Загружает количество непрочитанных уведомлений с сервера
   */
  loadUnreadCount() {
    fetch(`/api/v1/notifications/unread/count`)
      .then(response => response.json())
      .then(count => {
        this.unreadCount = count;
        this.updateUnreadBadge();
      })
      .catch(error => {
        console.error('Error loading unread count:', error);
      });
  }
  
  /**
   * Загружает все уведомления пользователя
   * @returns {Promise} Promise с массивом уведомлений
   */
  loadAllNotifications() {
    return fetch(`/api/v1/notifications`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error loading notifications:', error);
        return [];
      });
  }
  
  /**
   * Загружает непрочитанные уведомления пользователя
   * @returns {Promise} Promise с массивом непрочитанных уведомлений
   */
  loadUnreadNotifications() {
    return fetch(`/api/v1/notifications/unread`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error loading unread notifications:', error);
        return [];
      });
  }
  
  /**
   * Отмечает уведомление как прочитанное
   * @param {number} notificationId ID уведомления
   * @returns {Promise} Promise результата операции
   */
  markAsRead(notificationId) {
    return fetch(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT'
    })
      .then(response => {
        if (response.ok) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.updateUnreadBadge();
          return true;
        }
        return false;
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
        return false;
      });
  }
  
  /**
   * Отмечает все уведомления как прочитанные
   * @returns {Promise} Promise с количеством помеченных уведомлений
   */
  markAllAsRead() {
    return fetch(`/api/v1/notifications/read-all`, {
      method: 'PUT'
    })
      .then(response => response.json())
      .then(count => {
        this.unreadCount = 0;
        this.updateUnreadBadge();
        return count;
      })
      .catch(error => {
        console.error('Error marking all notifications as read:', error);
        return 0;
      });
  }
  
  /**
   * Обновляет бейдж с количеством непрочитанных уведомлений
   */
  updateUnreadBadge() {
    const badge = document.getElementById('notifications-badge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }
  
  /**
   * Подключение к серверу уведомлений
   * @returns {Promise} Promise, который резолвится при успешном подключении
   */
  connect() {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws');
      this.stompClient = Stomp.over(socket);
      
      // Отключаем логи в консоль
      this.stompClient.debug = null;
      
      this.stompClient.connect({}, (frame) => {
        console.log('Подключено к серверу уведомлений:', frame);
        
        // Подписываемся на персональный канал пользователя
        this.stompClient.subscribe(`/queue/notifications.${this.userId}`, (message) => {
          if (this.onMessageCallback) {
            try {
              const notification = JSON.parse(message.body);
              
              // Увеличиваем счетчик непрочитанных уведомлений
              if (notification.id) {
                this.unreadCount++;
                this.updateUnreadBadge();
              }
              
              this.onMessageCallback(notification);
            } catch (e) {
              console.error('Ошибка при обработке сообщения:', e);
            }
          }
        });
        
        this.connected = true;
        resolve();
      }, (error) => {
        console.error('Ошибка подключения к серверу уведомлений:', error);
        this.connected = false;
        reject(error);
      });
    });
  }
  
  /**
   * Отключение от сервера уведомлений
   */
  disconnect() {
    if (this.stompClient !== null && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Отключено от сервера уведомлений');
    }
  }
  
  /**
   * Установка обработчика для входящих уведомлений
   * @param {Function} callback Функция-обработчик, принимающая уведомление
   */
  onMessage(callback) {
    this.onMessageCallback = callback;
  }
  
  /**
   * Показывает системное уведомление браузера
   * @param {Object} notification Объект уведомления
   */
  showBrowserNotification(notification) {
    // Проверяем поддержку уведомлений браузером
    if (!("Notification" in window)) {
      console.warn("Браузер не поддерживает уведомления");
      return;
    }
    
    // Если разрешение уже получено, показываем уведомление
    if (Notification.permission === 'granted') {
      this._createNotification(notification);
    } 
    // Если разрешение еще не запрашивалось, запрашиваем его
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this._createNotification(notification);
        }
      });
    }
  }
  
  /**
   * Внутренний метод для создания уведомления
   * @param {Object} notification Объект уведомления
   * @private
   */
  _createNotification(notification) {
    const notif = new Notification(notification.title, {
      body: notification.message,
      icon: '/img/logo.png',
      data: notification
    });
    
    // Обработка клика по уведомлению
    notif.onclick = (event) => {
      window.focus(); // Фокус на окно
      
      // Если есть ID уведомления, помечаем его как прочитанное
      if (notification.id) {
        this.markAsRead(notification.id);
      }
      
      // Если есть URL для действия, переходим по нему
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      
      event.target.close();
    };
  }
}

// Пример инициализации (можно удалить в продакшене)
document.addEventListener('DOMContentLoaded', () => {
  // Эта функция должна вызываться после аутентификации пользователя
  window.initNotifications = function(userId) {
    const notificationService = new NotificationService(userId);
    
    notificationService.connect()
      .then(() => {
        console.log('Успешно подключено к серверу уведомлений');
        
        // Устанавливаем обработчик уведомлений
        notificationService.onMessage((notification) => {
          console.log('Получено уведомление:', notification);
          
          // Показываем уведомление в браузере
          notificationService.showBrowserNotification(notification);
          
          // Здесь можно добавить логику обновления UI
          // Например, увеличить счетчик непрочитанных уведомлений
        });
      })
      .catch(error => {
        console.error('Не удалось подключиться к серверу уведомлений:', error);
      });
    
    // Сохраняем сервис в глобальном объекте для доступа из других частей приложения
    window.notificationService = notificationService;
    
    // Запрашиваем разрешение на показ уведомлений при первой загрузке
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };
}); 