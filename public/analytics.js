// public/analytics.js
(function (){
    console.log('Скрипт для аналитики загружен!')
    const NODE_ENV ='production'
    function generateUUID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    }
    const session_duration = 12*60*60*1000; //12 hours
    const now = Date.now()

    let visitorId = localStorage.getItem('webtrack_visitor_id');

    let sessionTime = localStorage.getItem('webtrack_session_time')

    if (!visitorId || (now-sessionTime) > session_duration) {

        if (visitorId) {
            localStorage.removeItem('webtrack_visitor_id')
            localStorage.removeItem('webtrack_session_time')
        }

        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId)
        localStorage.setItem('webtrack_session_time', now)
    } else {
        console.log('существующая сессия!')
    }

    const script = document.currentScript;
    const websiteId = script.getAttribute('data-website-id');
    const domain = script.getAttribute('data-domain');
    const referrer = document.referrer || 'Direct'

        // get_utm sources
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || '';
    const utm_medium = urlParams.get('utm_medium') || '';
    const utm_campaign = urlParams.get('utm_campaign') || '';
    const refParams = window.location.href.split('?')[1] || ''


    const entryTime = Date.now();
    const data = {
        type: "entry",
        websiteId,
        domain,
        entryTime: Date.now(),
        referrer,
        url: window.location.href,
        visitorId,
        utm_source,
        utm_medium,
        utm_campaign,
        refParams
    }
    fetch(NODE_ENV === 'production' ? 'https://analitity-track.vercel.app' : 'http://localhost:3000' + "/api/track", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    })


    // active time tracking
    let activeStartTime = Date.now();
    let totalActiveTime = 0;

    const handleExit = () => {
        const exitTime = Date.now();
        totalActiveTime += Date.now()-activeStartTime;

        fetch(NODE_ENV === 'production' ? 'https://analitity-track.vercel.app' : 'http://localhost:3000' +'/api/track', {
            method: 'POST',
            keepalive: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: 'exit',
                websiteId,
                domain,
                exitTime,
                totalActiveTime,
                visitorId
            })
        })

       // localStorage.clear()
    }
    window.addEventListener('beforeunload', handleExit)

    const sendLivePing = () => {
        fetch(NODE_ENV === 'production' ? 'https://analitity-track.vercel.app' : 'http://localhost:3000' +'/api/track', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                visitorId,
                websiteId,
                last_seen: Date.now(),
                url: window.location.href,
                type: "ping"
            })
        })
    }

    setInterval(sendLivePing, 10000)

//    window.addEventListener('pagehide', handleExit)
})()