import { EasingFunction } from "bezier-easing";
import React, { useState } from "react";
import { render } from "react-dom";
import { bezier, useScrollTo } from "../lib/useScrollTo";
import "./style.css";

type EasingState = {
  fn: bezier.EasingFunction;
};

const exampleEasing = {
  ease: bezier(0.25, 0.1, 0.25, 1),
  linear: bezier(0, 0, 1, 1),
  easeIn: bezier(0.42, 0, 1, 1),
  easeOut: bezier(0, 0, 0.58, 1),
  easeInOut: bezier(0.42, 0, 0.58, 1),
  weird: bezier(0.17, 0.67, 1, -0.24),
};

const getRandomInt = (min: number, max: number) => {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin)) + intMin;
};

const Dynamic = React.memo<{
  easing: EasingState;
  backgroundColor: string;
}>(({ easing, backgroundColor }) => {
  const [ref] = useScrollTo<HTMLDivElement>({
    auto: true,
    duration: 500,
    easing: easing.fn,
  });

  return (
    <div
      className="example example--dynamic"
      style={{ backgroundColor }}
      ref={ref}
    >
      Dynamic!
    </div>
  );
});

function App() {
  const [easing, setEasing] = useState<EasingState>({ fn: exampleEasing.ease });
  const [dynamicElements, setDynamicElements] = useState<
    [number, number, number][]
  >([]);
  const [refTop, scrollTop] = useScrollTo<HTMLDivElement>({
    easing: easing.fn,
  });
  const [refMid, scrollMid] = useScrollTo<HTMLDivElement>({
    easing: easing.fn,
  });
  const [refBottom, scrollBottom] = useScrollTo<HTMLDivElement>({
    easing: easing.fn,
  });

  const handleEasingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEasing({ fn: exampleEasing[e.target.value] });
  };

  const handleAddDynamic = () => {
    setDynamicElements((old) => [
      ...old,
      [getRandomInt(0, 360), getRandomInt(99, 100), getRandomInt(95, 97)],
    ]);
  };

  return (
    <>
      <div ref={refTop} className="example example--top">
        Top
      </div>
      <div ref={refMid} className="example example--middle">
        Middle
      </div>
      <div ref={refBottom} className="example example--bottom">
        Bottom
      </div>

      {dynamicElements.map(([h, s, l], i) => (
        <Dynamic
          key={`el-${i}`}
          backgroundColor={`hsl(${h}, ${s}%, ${l}%)`}
          easing={easing}
        />
      ))}

      <div className="controls">
        <button onClick={scrollTop} className="control">
          Top
        </button>

        <button onClick={scrollMid} className="control">
          Middle
        </button>

        <button onClick={scrollBottom} className="control">
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
        <button onClick={handleAddDynamic} className="control">
          Add new!
        </button>
      </div>
    </>
  );
}

render(<App />, document.getElementById("app"));
