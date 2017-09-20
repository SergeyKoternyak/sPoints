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
            .each(config.urls, (casper, url, pageIndex) => {
                casper.each(config.devices, (casper, device) => {
                    const isRetina = device.ppi > 1 ? true : false;
                    
                    casper
                        .then(() => casper.userAgent(device.userAgent))
                        .then(() => casper.viewport(device.viewport.width, device.viewport.height))
                        .thenOpen(url, () => { 
                            isRetina && casper.evaluate(evaluates.setMobileScale, device.ppi);
                            casper.wait(this.TIME_INTERVAL_LONG);
                        })
                        .then(() => config.playScrollAnimation && this.playScrollAnimation(device))
                        .then(() => {
                            const sectionParameters = this.getSectionParameters(config.screenMethod, device);

                            casper.each(this.checkSectionHeight(sectionParameters), (casper, section, index) => {
                                casper.wait(this.TIME_INTERVAL_SHORT, () => {
                                    this.captureArea({
                                        device: device,
                                        pageIndex: pageIndex,
                                        section: section,
                                        sectionName: 'section' + (index + 1)
                                    });
                                });
                            });
                        });
                })
            })
            .run(() => casper.exit());
    }

    captureArea(params) {
        const pageName = this._pageName(params.pageIndex);
        
        params = Object.assign({
            section: {}
        }, params);

        params.section = Object.assign({
            top: 0,
            left: 0 ,
            width: params.device.viewport.width * params.device.ppi,
            height: params.device.viewport.height * params.device.ppi
        }, params.section);

        casper.capture(this._setScreenshotName(pageName, params.device, params.sectionName), params.section);
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

    getDate() {
        const date = new Date().toString();
        return date.slice(4, 15).replace(/ /g, '-') + '_' + date.slice(16, 21).replace(':', '-');
    }

    getSectionParameters(screenMethod, device) {
        screenMethod = Object.assign({
            type: 'parts',
            quantity: 1
        }, screenMethod);

        if (screenMethod.type === 'sections') {
            return casper.evaluate(evaluates.createByPoints, device, evaluates.getOffsetTop);
        } else {
            if (Array.isArray(screenMethod.userParts)) {
                return screenMethod.userParts;
            } else {
                return casper.evaluate(evaluates.createByParts, device, screenMethod.quantity);
            }
        }
    }

    _pageName(pageindex) {
        return (config.urls.length > 1) ? `page-${pageindex + 1}` : '';
    }

    playScrollAnimation(device) {
        const bodyHeight = casper.evaluate(evaluates.getBodyHeight);
        const scrollQuantity = Math.ceil(bodyHeight / device.viewport.height);

        for (let i = 1; i < scrollQuantity; i++) {
            casper
                .then(() => casper.scrollTo(0, (device.viewport.height * device.ppi * i)))
                .then(() => casper.wait(this.TIME_INTERVAL_SHORT));
        }

        casper.then(() => casper.scrollTo(0, 0));
    }

    _setScreenshotName(pageName, device, screenName) {
        return `screenshots/${this.startDate}/${device.type}/${device.name}/${pageName}/${device.viewport.width}x${device.viewport.height}-${screenName}.png`;
    }
}

new sPoints;