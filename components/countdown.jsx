import React, { useState, useEffect } from "react";
import humanizeDuration from "humanize-duration";
import formatThousands from "format-thousands";

function formatNumber(number) {
  return formatThousands(number, { separator: "," });
}

function floorPrecision(number, precision) {
  return Math.floor(number * precision) / precision;
}

function calculateTimeLeft(now, tip) {
  const epochsWhenFetch =
    tip.targetEpoch - tip.epochNumber - tip.epochBlockIndex / tip.epochLength;
  const elapsedTime = now - new Date(tip.fetchTime);
  const elapsedEpochs = elapsedTime / tip.estimatedEpochTime;
  const epochs = epochsWhenFetch - elapsedEpochs;
  const milliseconds =
    Math.floor((epochs * tip.estimatedEpochTime) / 1000) * 1000;
  const targetDate = new Date(+now + milliseconds);

  return {
    milliseconds,
    epochs,
    targetDate,
    targetEpoch: tip.targetEpoch,
  };
}

function Root({ title, children }) {
  return (
    <div className="my-24 text-center">
      <h1 className="font-bold text-3xl mb-8">{title}</h1>
      {children}
    </div>
  );
}

function Details({
  timeLeft: { targetEpoch, targetDate, epochs, milliseconds },
}) {
  return (
    <p className="leading-8">
      The Mirana Upgrade epoch {formatNumber(targetEpoch)} is scheduled to occur
      on <strong>{targetDate.toLocaleString()}</strong> which is in
      <br />
      <strong>{humanizeDuration(milliseconds)}</strong> <span>/</span>{" "}
      <strong>{formatNumber(floorPrecision(epochs, 10000))} epochs</strong> to
      go
    </p>
  );
}

export default function Countdown({ tip }) {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(new Date(tip.fetchTime), tip)
  );

  if (timeLeft.milliseconds > 0) {
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(new Date(), tip));
      }, 1000);

      return function clearTimer() {
        clearTimeout(timer);
      };
    });

    return (
      <Root title="CKB Mirana Upgrade Countdown">
        <Details timeLeft={timeLeft} />
      </Root>
    );
  }

  return <Root title="🎉 🎉 CKB Mirana is now online! 🎉 🎉" />;
}
