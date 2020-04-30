# line-file-reader

> Modern line-by-line `File` reader

Easily read `File` or `Blob` objects line by line.

## Getting started

Install it using NPM.

```bash
npm i line-file-reader
```

## Usage

You can simply use it with the ES2018 async iterator.

### Simple usage

```ts
import LineFileReader from 'line-file-reader';

const file = new File(["Some\nlines\n...\n"], "content.txt");
const reader = new LineFileReader(file);

for await (const line of reader) {
  console.log(line);
}
```

### Multiple iteration

You can iterate *multiple times*, and *concurrently* on the same file.

```ts
for await (const line of reader) {
  // Do something with line..
  // Read the file during file read

  for await (const line_second of reader) {
    // do this action is safe!
  }
}
```
