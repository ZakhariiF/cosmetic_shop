export class AlertHelper {
  static dropDown;
  static onClose;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  static show(type, title, message) {
    console.log('SHOW ERROR:', message);
    if (this.dropDown) {
      this.dropDown.alertWithType(type, title, message);
    }
  }

  static showError(message) {
    console.log('SHOW ERROR:', message);
    if (this.dropDown) {
      this.dropDown.alertWithType('error', 'Error', message);
    }
  }

  static showSuccess(message) {
    if (this.dropDown) {
      this.dropDown.alertWithType('success', 'Success', message);
    }
  }

  static setOnClose(onClose) {
    this.onClose = onClose;
  }

  static invokeOnClose() {
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }
}
