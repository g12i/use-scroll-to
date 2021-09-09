import React, { useState } from "react";
import { render } from "react-dom";
import "./style.css";
import { useScrollTo, bezier } from "../lib/useScrollTo";
import type { EasingFunction } from "../lib/useScrollTo";

console.log(React);

type EasingState = {
  fn: EasingFunction;
};

const exampleEasing = {
  ease: bezier(0.25, 0.1, 0.25, 1),
  linear: bezier(0, 0, 1, 1),
  easeIn: bezier(0.42, 0, 1, 1),
  easeOut: bezier(0, 0, 0.58, 1),
  easeInOut: bezier(0.42, 0, 0.58, 1),
};

const getRandomInt = (min: number, max: number) => {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin)) + intMin;
};

const Dynamic = React.memo<{ easing: EasingState }>(({ easing }) => {
  const [ref] = useScrollTo<HTMLDivElement>({
    auto: true,
    duration: 500,
    easing: easing.fn,
  });

  return (
    <div
      className="example example--dynamic"
      style={{ backgroundColor: `hsl(${getRandomInt(0, 360)}, 100%, 96.1%)` }}
      ref={ref}
    >
      Dynamic!
    </div>
  );
});

function App() {
  const [easing, setEasing] = useState<EasingState>({
    fn: exampleEasing.ease,
  });
  const [dynamicCount, setDynamicCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [ref2, scroll2] = useScrollTo<HTMLDivElement>({
    duration: 500,
    offsetTop: offset,
  });
  const [ref5, scroll5] = useScrollTo<HTMLDivElement>({
    duration: 500,
    offsetTop: offset,
  });
  const [ref8, scroll8] = useScrollTo<HTMLDivElement>({
    duration: 500,
    offsetTop: offset,
  });

  const handleEasingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEasing(exampleEasing[e.target.value]);
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(parseInt(e.target.value));
  };

  const handleAddDynamic = () => {
    setDynamicCount((old) => old + 1);
  };

  return (
    <>
      <div ref={ref2} className="example example--top">
        top
      </div>
      <div ref={ref5} className="example example--middle">
        middle
      </div>
      <div ref={ref8} className="example example--bottom">
        bottom
      </div>

      {Array.from({ length: dynamicCount }).map((_, i) => (
        <Dynamic key={`el-${i}`} easing={easing} />
      ))}

      <div className="controls">
        <button onClick={scroll2} className="control">
          Top
        </button>

        <button onClick={scroll5} className="control">
          Middle
        </button>

        <button onClick={scroll8} className="control">
          Bottom
        </button>

        <select
          onChange={handleEasingChange}
          value={Object.entries(exampleEasing)
            .filter(([, value]) => value === easing.fn)
            .map(([key]) => key)
            .find((v) => v)}
        >
          {Object.keys(exampleEasing).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="range"
          min="0"
          max="100"
          value={offset}
          onChange={handleOffsetChange}
        />

        <button onClick={handleAddDynamic} className="control">
          Add new!
        </button>
      </div>
    </>
  );
}

render(<App />, document.getElementById("app"));
