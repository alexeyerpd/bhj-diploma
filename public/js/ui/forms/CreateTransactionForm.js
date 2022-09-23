/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const data = User.current();
    if (!data?.success) {
      return;
    }

    const select = this.element.querySelector('.accounts-select');
    Account.list(data.user, (err, response) => {
      if (!err && response.success) {
        select.innerHTML = '';
        response.data.forEach(item => {
          this.renderItem(select, item);
        });
      }
    })
  }

  renderItem(select, data){
    select.insertAdjacentHTML('beforeend', this.getAccountOptionHTML(data));
  }

  getAccountOptionHTML(item){
    const selectId = this.getLastAccountsSelectId();
    return `<option value="${item.id}" ${selectId === item.id ? 'selected' : ''}>${item.name}</option>`
  }

  getLastAccountsSelectId() {
    return App.getWidget('accounts').lastSelectId;
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (!err && response.success) {
        App.update();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        this.element.reset();
      }
    })
  }
}
