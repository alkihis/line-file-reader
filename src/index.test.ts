import LineFileReader from '.';

if (typeof globalThis.Blob === 'undefined') {
  // @ts-ignore - Blob simple polyfill for Node.js (only the required things are defined)
  globalThis.Blob = class SimpleBlob {
    protected content: string;
  
    constructor(parts: string[]) {
      this.content = parts.join("");
    }
  
    get size() {
      return this.content.length;
    }
  
    async text() {
      return this.content;
    }
  
    slice(start: number, end: number) {
      return new SimpleBlob([this.content.slice(start, end)]);
    }
  };
}

const TESTS: { lines: string[], sep: string, chunk?: number }[] = [
  {
    lines: [
      'Hello',
      'This is my world, what did you except ?',
      'hi',
      'hel',
      'llo',
      'World !',
    ],
    sep: '\n\r\t',
    chunk: 6,
  },
  {
    lines: [],
    sep: '\n',
  },
  {
    lines: [ 
      'dzqoihfioeihfoishfis',
      'fseiohfiesiodneiogejpos',
      'fe,oifes,',
      'oifen',
      'kofiej',
      'f',
      '',
      '',
      'deqofnoiesnf',
    ],
    sep: 'nrttta',
    chunk: 10,
  }
];

(async () => {
  let test_no = 1;
  for (const test of TESTS) {
    const str = test.lines.join(test.sep);

    const file = new Blob([str]);
    const reader = new LineFileReader(file);

    let i = 0;
    let success = true;

    for await (const line of reader.iterate(test.sep, test.chunk)) {
      if (line !== test.lines[i]) {
        success = false;
      }

      // console.log(i, line, line === test.lines[i]);
      i++;
    }

    if (!success)
      console.log(`Test n°${test_no} failed:`, test);
    else
      console.log(`Test n°${test_no} passed.`);

    test_no++;
  }
})();
