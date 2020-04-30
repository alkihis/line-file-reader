# line-file-reader

> Modern line-by-line `File` reader

## Getting started

Install it using NPM.

```bash
npm i line-file-reader
```

## Usage

You can simply use it with the ES2018 async iterator.

```ts
import LineFileReader from 'line-file-reader';

const file = new File(["Some\nlines\n...\n"], "content.txt");
const reader = new LineFileReader(file);

for await (const line of reader) {
  console.log(line);
}
```
