"use strict";

class Notifications {
    constructor(){
        this.eventHandlers = {};
    }

    addEventHandler(name) {
        this.eventHandlers[name] = [];
        return this;
    }

    addEventHandlers(names) {
        for (let name of names) {
            this.addEventHandler(name);
        }
    }

    on(event, callback) {
        if (Object.keys(this.eventHandlers).includes(event)) {
            this.eventHandlers[event].push(callback);
        } else {
            console.warn("Unknown event: ", event);
        }
        return this;
    }

    off(event, callback) {
        if (Object.keys(this.eventHandlers).includes(event)) {
            this.eventHandlers[event] = this.eventHandlers[event].filter(item => item != callback);
        } else {
            console.warn("Unknown event: ", event);
        }
        return this;
    }

    dispatchEvent(event, args) {
        console.log("Drinks.dispatchEvent", event);

        if (Object.keys(this.eventHandlers).includes(event)) {
            for (let callback of this.eventHandlers[event]) {
                callback(args);
            }
        } else {
            console.warn("Unknown event: ", event);
        }
        return this;
    }

}

export default Notifications;
