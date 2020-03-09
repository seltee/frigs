import { useState, useEffect, useRef } from "react";
export function useInterval(callback, delay) {
    var savedCallback = useRef();
    useEffect(function () {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(function () {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            var id_1 = setInterval(tick, delay);
            return function () { return clearInterval(id_1); };
        }
    }, [delay]);
}
export function useController(controller) {
    var _a = useState(null), update = _a[1];
    useEffect(function () {
        var upd = function () { return update(Math.random()); };
        controller.subscribe(upd);
        return function () {
            controller.unSubscribe(upd);
        };
    }, []);
}
