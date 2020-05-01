if (typeof Symbol.asyncIterator === undefined) {
  // Create the symbol async iterator if it is undefined
  // @ts-ignore
  Symbol.asyncIterator = Symbol('Symbol.asyncIterator');
}

export class LineFileReader {
  /** Read by chunks of 1 KB of text */
  protected static readonly CHUNK_LENGTH = 1024;

  constructor(protected file: Blob) {
    if (!LineFileReader.isFile(file)) {
      throw new Error("This object is not a file")
    }
  }

  static isFile(data: any) : data is Blob {
    if (typeof Blob !== 'undefined') {
      return data instanceof Blob;
    }
    return false;
  }

  /** Iterate a file line by line */
  async *iterate(separator = '\n', chunk_length = LineFileReader.CHUNK_LENGTH) {
    let seeker = 0;
    let buffer = "";
    let padding = separator.length - 1;

    if (separator.length + 1 >= chunk_length) {
      throw new Error("Separator must be shorter than chunk length.");
    }

    if (padding === -1) {
      padding = 0;
    }
    
    // While we didn't reach the end of file
    while (seeker < this.file.size) {
      const part = await this.file.slice(seeker, seeker + chunk_length + padding).text();
      seeker += chunk_length;
  
      const parts = part.split(separator);

      if (parts.length > 1) { 
        if (padding && part.length > chunk_length) {
          // There can be an overlap
          const last_index = parts.length - 1;
          const last_len = parts[last_index].length;

          if (parts[last_index].length < padding) {
            // There is an overlap !
            seeker += padding - last_len;
            parts[last_index] = "";
          }
          else {
            // There is no overlap, ignoring
            parts[last_index] = parts[last_index].slice(0, last_len - padding);
          }
        }

        // There is a next line
        parts[0] = buffer + parts[0];
        // Store the remaining line in the buffer
        buffer = parts[parts.length - 1];
        
        for (const line of parts.slice(0, parts.length - 1)) {
          yield line;
        }
      }
      else {
        // There is no next line here. Save the whole chunk in the buffer.
        buffer += part.slice(0, chunk_length);
      }
    }

    // If buffer is filled, this is the last line. Emit it !
    if (buffer) {
      yield buffer;
    }
  }

  /** Iterate a file line by line */
  async *[Symbol.asyncIterator]() {
    yield* this.iterate();
  }
}

export default LineFileReader;
