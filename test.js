const test = require('brittle')
const RAM = require('random-access-memory')
const Spacecore = require('bitspacecore')
const Spacebee = require('spacebee')
const Spacedrive = require('spacedrive')
const Corestore = require('spacecorestore')

const detect = require('./index.js')

test('can detect normal spacecore', async (t) => {
  const core = new Spacecore(RAM)
  await core.ready()
  await core.append('I am just a normal core')
  t.is(await detect(core), 'core')
})

test('returns null if first block not available locally and wait not set', async (t) => {
  const core = new Spacecore(RAM)
  await core.ready()
  t.is(await detect(core), null)
})

test('returns null if first block not available locally and wait not set (spacedrive)', async (t) => {
  const drive = await getDrive()
  t.is(await detect(drive.db.core), null)
})

test('waits for the first block if wait set', async (t) => {
  t.plan(1)

  const core = new Spacecore(RAM)
  await core.ready()
  detect(core, { wait: true })
    .then(res => t.is(res, 'core'))
    .catch(e => t.fail('Failed with unexpected error'))

  await core.append('I am just a normal core, but you only know this now')
})

test('waits for the first block if wait set (spacedrive)', async (t) => {
  t.plan(1)

  const drive = await getDrive()
  detect(drive.db.core, { wait: true })
    .then(res => t.is(res, 'drive'))
    .catch(e => t.fail('Failed with unexpected error'))

  await drive.put('/confirmed', 'I am a spacedrive')
})

test('can detect a spacebee', async (t) => {
  const core = new Spacecore(RAM)
  const bee = new Spacebee(core)
  await bee.put('Needs an entry', 'to officially be a spacebee')

  t.is(await detect(core), 'bee')
  t.ok(core.closing == null, 'passed-in core not closed')
})

test('can detect a spacedrive', async (t) => {
  const drive = await getDrive()
  await drive.put('/file', 'needs a file to officially become a spacedrive')

  t.is(await detect(drive.db.core), 'drive')
})

async function getDrive () {
  const spacecorestore = new Corestore(RAM)
  await spacecorestore.ready()

  const drive = new Spacedrive(spacecorestore)
  await drive.ready()

  return drive
}
