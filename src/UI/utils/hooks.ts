import React, { useState, useEffect, useRef } from "react";
import Controller from "../../controllers/controller";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      (savedCallback as any).current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useController(controller: Controller) {
  const [, update] = useState(null);

  useEffect(() => {
    const upd = () => update(Math.random());

    controller.subscribe(upd);
    return () => {
      controller.unSubscribe(upd);
    }
  }, []);
}
