namespace Stats {
  const dateRegExp = /(\d{2})\/(\d{2})\/(\d{4})/;

  interface Dot {
    x: number;
    y: number;
    dy: number;
  }

  export const computeRegressions = (
    mappedLines: Map<string, MatchedReceiptLine[]>
  ) => {
    const labelToDataSet = new Map<string, Dot[]>();

    for (const commonLabel of [...mappedLines.keys()]) {
      const usedLines = (
        mappedLines.get(commonLabel) as MatchedReceiptLine[]
      );
      labelToDataSet.set(commonLabel, makeDots(usedLines).slice(-4));
    }

    const labels = [...labelToDataSet.keys()];

    return labels.map((label) => {
      const dataSet = labelToDataSet.get(label);
      if (dataSet === undefined || dataSet.length < 2) {
        return { label, diff: null, meanDy: null };
      }
      /**
       * This value should give the value threshold of diff, when diff is near or higher
       * than this value a refill should be considered.
       */
      const positiveDys = dataSet.map(({ dy }) => dy).filter((dy) => dy !== 0);
      const meanDy =
        positiveDys.reduce((a, b) => a + b, 0) / positiveDys.length;
      const { intercept, slope } = linearRegression(dataSet);

      const nDaysFrom1900ToNow = (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 70);
        return d.getTime() / (1000 * 60 * 60 * 24);
      })();

      const yForecast = intercept + slope * nDaysFrom1900ToNow;
      const diff = yForecast - dataSet[dataSet.length - 1].y;
      return { label, diff, meanDy, intercept, slope };
    });
  };

  const makeDots = (lines: MatchedReceiptLine[]) => {
    const result: Dot[] = [];
    for (const { date: x, amount: dy } of lines) {
      const lastDot = result[result.length - 1];
      if (lastDot === undefined) {
        result.push({ x, y: dy, dy });
      } else {
        if (lastDot.x === x) {
          lastDot.y += dy;
        } else {
          // for (let i = lastDot.x + 1; i < x; i++) {
          //   dataSet.push({ x: i, y: lastDot.y, dy: 0 });
          // }
          const y = lastDot.y + dy;
          result.push({ x, y, dy });
        }
      }
    }
    return result;
  };

  const linearRegression = (data: Array<{ x: number; y: number }>) => {
    const n = data.length;

    // Calculate mean of x and y
    const meanX = data.reduce((sum, { x }) => sum + x, 0) / n;
    const meanY = data.reduce((sum, { y }) => sum + y, 0) / n;

    // Calculate slope (m) and y-intercept (b)
    const numerator = data.reduce(
      (sum, { x, y }) => sum + (x - meanX) * (y - meanY),
      0
    );
    const denominator = data.reduce(
      (sum, { x }) => sum + Math.pow(x - meanX, 2),
      0
    );

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    return { slope, intercept };
  };
}
