function $() {
    return document.querySelector.apply(document, arguments);
}
function $$() {
    return document.querySelectorAll.apply(document, arguments);
}

Object.defineProperties(HTMLElement.prototype, {
    "on": {
        value: function (event, callback) {
            return this.addEventListener(event, callback);
        }
    },
    "once": {
        value: function (event, callback) {
            return this.addEventListener(event, callback, {once: true});
        }
    },
    "$": {
        value: function (selector) {
            return this.querySelector(selector);
        }
    },
    "$$": {
        value: function (selector) {
            return this.querySelectorAll(selector);
        }
    }
});

const rotations = [180, 90, 0, -90];
class Timer {
    constructor(el) {
        this.el = el;
        this.time = 1 * 10 * 1000; // 1 minute
        this.chunks = Array.from(el.$$(".eatenChunk"));
        this.startTime = 0;
        this.pausedTime = 0;
        this.animationID = 0;
    }

    start() {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.startTime = Date.now();
        this.segmentSize = this.time / 4;
        return this;
    }

    update() {
        if(this.pausedTime !== 0) {
            this.pausedTime = Date.now();
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        let now = Date.now();
        let deltaPercent = (now - this.startTime) / this.time;
        let segmentPercent = deltaPercent * 4;
        let segment = Math.floor(deltaPercent * 4);

        if(segment > this.chunks.length) return this.stop();

        let skew = (segmentPercent % 1) * 90;
        let transform = `rotate(${rotations[segment]}deg) skew(${skew}deg)`;
        this.chunks[segment].style.transform = transform;

        for(let i = 0; i < this.chunks.length; i++) {
            if(i === segment) continue;
            let deg = 90;
            if(i > segment) deg = 0;
            this.chunks[i].style.transform = `rotate(${rotations[i]}deg) skew(${deg}deg)`;
        }

        if(this.startTime !== 0) requestAnimationFrame(this.update.bind(this));
    }

    pause(val) {
        if(val === undefined) val = this.pausedTime === 0;
        this.pausedTime = val ? Date.now() : 0;
        return this;
    }
    unpause() {
        return this.pause(false);
    }

    stop() {
        cancelAnimationFrame(this.animationID);
        this.animationID = 0;
        this.startTime = 0;
        return this;
    }
}


// on load
(() => {
    const timer = new Timer($(".timerWidget"));

    let start = $("button#start");
    let stop = $("button#stop");
    let pause = $("button#pause");

    start.on("click", () => {
        timer.start();
    });
    stop.on("click", () => {
        timer.stop();
    });
    pause.on("click", () => {
        timer.pause();
    });
})();