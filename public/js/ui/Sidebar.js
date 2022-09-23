/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const body = document.body;

    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginLink = document.querySelector('.menu-item_login');
    const registerLink = document.querySelector('.menu-item_register');
    const logoutLink = document.querySelector('.menu-item_logout');
    const register = App.getModal('register');
    const login = App.getModal('login');

    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      login.open();
    });

    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      register.open();
    });

    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      User.logout((err, response) => {
        if (!err && response.success) {
          App.setState('init');
        }
      });
    });
  }
}
