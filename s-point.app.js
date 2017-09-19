const casper = require('casper').create();
const config = require('./s-point.config');
const evaluates = require('./s-point.evaluates');

class sPoints {
    constructor() {
        this.MAX_SECTION_HEIGHT = 32000;
        this.TIME_INTERVAL_SHORT = 1000;
        this.TIME_INTERVAL_LONG = 3000;
        this.startDate = this.getDate();
        this.init();
    }

    init() {
        casper
            .start()
            .each(config.urls, (casper, url) => {
                casper.each(config.devices, (casper, device) => {
                    const isRetina = device.ppi > 1 ? true : false;
                    
                    casper
                        .then(() => casper.userAgent(device.userAgent))
                        .then(() => casper.viewport(device.viewport.width, device.viewport.height))
                        .thenOpen(url, () => { 
                            isRetina && casper.evaluate(evaluates.setMobileScale, device.ppi);
                            casper.wait(this.TIME_INTERVAL_LONG);
                        })
                        .then(() => {
                            let sectionParameters;

                            if (config.screenMethod && config.screenMethod.type === 'section') {
                                sectionParameters = casper.evaluate(evaluates.createByPoints, device, evaluates.getOffsetTop);
                            } else {
                                if (config.screenMethod && config.screenMethod.userParts) {
                                    sectionParameters = config.screenMethod.userParts;
                                } else {
                                    sectionParameters = casper.evaluate(evaluates.createByParts, device, config.screenMethod && config.screenMethod.quantity);
                                }
                            }

                            casper.each(this.checkSectionHeight(sectionParameters), (casper, section, index) => {
                                casper.wait(this.TIME_INTERVAL_SHORT, () => {
                                    this.captureArea({
                                        device: device,
                                        section: section,
                                        sectionName: 'section' + (index + 1)
                                    });
                                });
                            });
                        })
                })
            })
            .run(() => casper.exit());
    }

    getDate() {
        const date = new Date().toString();
        return date.slice(4, 15).replace(/ /g, '-') + '_' + date.slice(16, 21).replace(':', '-');
    }

    _setScreenshotName(device, screenName) {
        return `screenshots/${ this.startDate }/${ device.type }/${ device.name }/${ device.viewport.width }x${ device.viewport.height }-${ screenName }.png`;
    }

    captureArea(params) {
        params = Object.assign({
            section: {}
        }, params);

        params.section = Object.assign({
            top: 0,
            left: 0 ,
            width: params.device.viewport.width * params.device.ppi,
            height: params.device.viewport.height * params.device.ppi
        }, params.section);

        casper.capture(this._setScreenshotName(params.device, params.sectionName), params.section);
    }

    checkSectionHeight(arr) {
        const newArr = [];
        let topPoint;
    
        arr.forEach((section, i) => {
            if (i=== 0) topPoint = 0;
    
            if (section.height > this.MAX_SECTION_HEIGHT) {
                const quantityParts = Math.ceil(section.height / this.MAX_SECTION_HEIGHT);
                const newSectionHeight = section.height / quantityParts;
    
                for (let i = 0; i < quantityParts; i++) {
    
                    if (i === 0) topPoint = section.top;
    
                    newArr.push({
                        top: topPoint,
                        height: newSectionHeight
                    });
    
                    topPoint += newSectionHeight;
                }
                
            } else {
                newArr.push(section)
            }
        })
    
        return newArr
    }
}

new sPoints;