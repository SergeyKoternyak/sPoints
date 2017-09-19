const config = require('./s-point.config');
const evaluates = require('./s-point.evaluates');

class sPoints {
    constructor() {
        this.startDate = this.getDate();
    }

    _setScreenshotName(device, screenName) {
        return `screenshots/${ this.startDate }/${ device.type }/${ device.name }/${ device.viewport.width }x${ device.viewport.height }-${ screenName }.png`;
    }

    getDate() {
        const date = new Date().toString();
        return date.slice(4, 15).replace(/ /g, '-') + '_' + date.slice(16, 21).replace(':', '-');
    }


}