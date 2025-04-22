# Spacecore Detector

Detect the type of a Spacecore (Spacecore, Spacebee or Spacedrive)

## Install

`npm i spacecore-detector`

## Usage

```
const detect = require('spacecore-detector')

let type = await detect(aSpacecore)

if (!type) {
  type = detect(aSpacecore, { wait: true })
}

if (type === 'bee') {
  console.log('I am a bee')
} else if (type === 'drive') {
  console.log('I am the db core of a drive')
} else {
  console.log('I am a basic spacecore')
}

```

## API

#### `const type = await detect(spacecore, opts?)`

Detect the type of the `spacecore`.

returns either `'core'`, `'bee'`, `'drive'` or `null`.

`null` is returned when it is not yet possible to determine the type. Set `opts.wait = true` if instead you want to wait until the  type can be determined. 

Do note that this will wait until the first block of the spacecore becomes locally available, so make sure you are either the writer, or are swarming on this core.
