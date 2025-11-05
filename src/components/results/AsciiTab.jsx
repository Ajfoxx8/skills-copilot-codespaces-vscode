function buildAsciiLine(timeline) {
  const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
  const lineLength = timeline.length * 4;
  const result = strings.map((string, index) => {
    const stringNumber = 6 - index;
    const chars = Array.from({ length: lineLength }, () => '-');

    timeline.forEach((event, eventIndex) => {
      const fret = event.tab?.positions?.find((pos) => pos.string === stringNumber)?.fret;
      if (typeof fret === 'number') {
        const cursor = eventIndex * 4;
        const digits = String(fret).split('');
        digits.forEach((digit, digitIndex) => {
          chars[cursor + digitIndex] = digit;
        });
      }
    });

    return `${string}|${chars.join('')}`;
  });

  return result.join('\n');
}

export default function AsciiTab({ timeline }) {
  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-xl font-semibold">ASCII Tablature</h2>
      <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-emerald-200">
        {timeline?.length ? buildAsciiLine(timeline) : 'No events to display'}
      </pre>
    </div>
  );
}
