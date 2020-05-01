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

Please be warned that line separator (default: `\n`) will **not** be returned in iterated lines.
To customize line separator, see `Customize iteration` part.

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

### Customize iteration

By default, iteration is made with the `\n` separator (UNIX new lines), using chunks of 1024 bytes.

You can customize those settings by using the `.iterate()` method (`Symbol.asyncIterator` is just an alias of `.iterate` without arguments).

```ts
const reader = new LineFileReader(file);

const async_iterator = reader.iterate(
  // Here, you can use string, even of multiple characters.
  /* separator = */ '\n',

  // This is only a parameter to adjust for performance sake (in bytes).
  // Higher length = higher performance = higher RAM consumption
  /* chunk_length = */ 1024
);

for await (const line of async_iterator) {
  // Do sth with line...
}
```
