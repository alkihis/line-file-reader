import LineFileReader from '.';

if (typeof globalThis.Blob === 'undefined') {
  // @ts-ignore - Blob simple polyfill for Node.js (only the required things are defined)
  globalThis.Blob = class SimpleBlob {
    protected content: ArrayBuffer;
  
    constructor(parts: (string | ArrayBuffer)[]) {
      const ab_parts: ArrayBuffer[] = [];

      for (const part of parts) {
        if (typeof part === 'string') {
          const str = parts.join("");
          const arr = new TextEncoder().encode(str);

          ab_parts.push(arr.buffer);
        }
        else {
          ab_parts.push(part);
        }
      }

      if (ab_parts.length > 1) {
        const content_buf_len = ab_parts.reduce((acc, val) => acc + val.byteLength, 0);
  
        // Constructing the final array buffer
        this.content = new ArrayBuffer(content_buf_len);
        const view = new Uint8Array(this.content);
  
        let i = 0;
        for (const part of ab_parts) {
          const part_view = new Uint8Array(part);
  
          for (let j = 0; j < part_view.length; i++, j++) {
            view[j] = part_view[i];
          }
        }
      }
      else if (ab_parts.length === 1) {
        this.content = ab_parts[0];
      }
      else {
        this.content = new ArrayBuffer(0);
      }
    }
  
    get size() {
      return this.content.byteLength;
    }
  
    async text() {
      return new TextDecoder().decode(this.content);
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
