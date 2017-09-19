module.exports = {
    urls: [],
    devices: [
        {
            name: 'Macbook-12',
            type: 'desktop',
            ppi: 1,
            viewport: {
                width: 1440,
                height: 900
            },
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.43 (KHTML, like Gecko) Version/10.0 Safari/602.1.43'
        },
        {
            name: 'iPad',
            type: 'tablet',
            ppi: 1,
            viewport: {
                width: 768,
                height: 959
            },
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
        },
        {
            name: 'iPhone-5',
            type: 'mobile',
            ppi: 2,
            viewport: {
                width: 320,
                height: 528
            },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
        }
    ],
    screenMethod: {
        type: 'part'
    },
    playScrollAnimation: true
}