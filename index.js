const Spacebee = require('spacebee')

const CORE_TYPE = 'spacecore'
const BEE_TYPE = 'bee'
const DRIVE_TYPE = 'drive'
const UNKNOWN_TYPE = null

async function detect (spacecore, { wait = false } = {}) {
  let isBee
  try {
    isBee = await Spacebee.isSpacebee(spacecore, { wait })
  } catch (e) { // Could not load first block (~only when wait=false set)
    return UNKNOWN_TYPE
  }

  if (!isBee) return CORE_TYPE

  const bee = new Spacebee(spacecore.session())

  try {
    const isDrive = await isSpacedriveDb(bee)
    if (isDrive) {
      return DRIVE_TYPE
    } else {
      return BEE_TYPE
    }
  } finally {
    await bee.close()
  }
}

async function isSpacedriveDb (bee) {
  const header = await bee.getHeader()
  const contentFeed = header.metadata?.contentFeed

  // Note: will report false positives if contentFeed is used for
  // something else which is exactly 32 bytes long
  // (but at that point it's definitely not a normal bee anymore)
  return contentFeed?.byteLength === 32
}

module.exports = detect
