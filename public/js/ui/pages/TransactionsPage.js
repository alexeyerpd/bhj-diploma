/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Элемент не существует');
    }
    this.element = element;
    this.header = element.querySelector('.content-header');
    this.title = element.querySelector('.content-title');
    this.content = element.querySelector('.content');
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      
      if (!target || !this.lastOptions) {
        return;
      }
      
      const id = target?.dataset.id;
      const type = target.classList.contains('remove-account') ? 'remove-account' : 'transaction__remove';
      const text = type === 'remove-account' ? 'счет' : 'эту транзакцию';

      const isConfirm = confirm(`Вы действительно хотите удалить ${text}`)
      if (!isConfirm) {
        return;
      }

      if (type === 'remove-account') {
        this.removeAccount(id);
      }
      if (type === 'transaction__remove') {
        this.removeTransaction(id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount(id) {
    Account.remove({id}, (err, response) => {
      if (!err && response.success) {
        this.clear();
        App.updateWidgets();
        App.updateForms();
      }
    })
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    Transaction.remove({id}, (err, response) => {
      if (!err && response.success) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options?.account_id) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (!err && response.success) {
        this.renderTitle(response.data.name);
        this.setBtnAccountId(response.data.id);
      }
    });

    Transaction.list(options, (err, response) => {
      if (!err && response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.content.innerHTML = '';
    this.removeTransaction([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  clearContent() {
    this.content.innerHTML = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.title.textContent = name;
  }

  setBtnAccountId(id) {
    this.header.querySelector('.remove-account').dataset.id = id;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    return new Date(date).toLocaleString(true, {
        day: '2-digit',
        year: 'numeric',
        month: 'long',
        hour: "2-digit",
        minute: "2-digit",
    }).replace(',', ' в');
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const {type, id, sum, name, created_at} = item;
    return `
      <div class="transaction transaction_${type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${name}</h4>
              <!-- дата 10 марта 2019 г. в 03:20 -->
              <div class="transaction__date">${this.formatDate(created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
            ${sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id="${id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    this.clearContent();
    for (const item of data) {
      this.content.insertAdjacentHTML(
        'afterbegin',
        this.getTransactionHTML(item),
      );
    }
  }
}
