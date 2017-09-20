module.exports = {
    createByParts: (device, quantityParts) => {
        const sectionHeight = document.body.scrollHeight / quantityParts;   
        const sections = [];
        let topPoint = 0;

        for (let i = 0; i < quantityParts; i++) {
            sections.push({
                top: topPoint,
                height: sectionHeight * device.ppi
            });

            topPoint += sectionHeight * device.ppi;
        }

        return sections;
    },

    createByPoints: (device, getOffsetTop) => {
        const scrPoints = [...document.querySelectorAll('[scr-point]')];
        
        return scrPoints.map((point, i, arr) => {
            const nextPointOffset = (i === arr.length - 1) ? document.body.scrollHeight * device.ppi : getOffsetTop(arr[i + 1]);

            return {
                top: getOffsetTop(point),
                height: nextPointOffset - getOffsetTop(point)
            };
        });
    },

    getBodyHeight: () => document.body.scrollHeight,

    getOffsetTop: $el => parseInt($el.getBoundingClientRect().top + pageYOffset),

    setMobileScale: value => {
        const bodyStyle = document.body.style;
        
        bodyStyle.transform = `scale(${value})`;
        bodyStyle.transformOrigin = '0% 0% 0px';
    }
}